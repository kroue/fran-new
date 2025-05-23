import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // For cart icon (install expo/vector-icons if not already installed)

const Menu = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]); // For filtered products
  const [cart, setCart] = useState([]);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false); // For cart modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1); // For quantity selection
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false); // For quantity modal
  const [sizes, setSizes] = useState([]);
  const [toppingsOptions, setToppingsOptions] = useState([]);
  const [crustTypes, setCrustTypes] = useState([]); // State for crust types
  const [customization, setCustomization] = useState({
    size: '',
    crust: 'Normal crust',
    toppings: [],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card'); // Default to Card Payment
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [searchQuery, setSearchQuery] = useState(''); // For the search bar

  // Calculate total price of all items in the cart
  const totalCartPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://192.168.1.7/fran/api/products.php'); // Replace with your backend API endpoint
      if (response.ok) {
        const data = await response.json();
        const availableProducts = data.filter((item) => item.stock > 0); // Filter out products with stock 0
        setMenuItems(availableProducts);
        setFilteredMenuItems(availableProducts); // Update filtered products
      } else {
        console.error('Failed to fetch products:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts(); // Initial fetch

    // Set up polling to fetch products every 5 seconds
    const interval = setInterval(fetchProducts, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

const addToCart = (item) => {
  setSelectedItem(item);
  setQuantity(1); // Reset quantity to 1
  setIsQuantityModalVisible(true); // Show quantity modal
};

const handleAddToCart = () => {
  setCart((prevCart) => {
    const existingItem = prevCart.find((cartItem) => cartItem.id === selectedItem.id);
    if (existingItem) {
      // Update quantity and total price if the item already exists in the cart
      return prevCart.map((cartItem) =>
        cartItem.id === selectedItem.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity, totalPrice: cartItem.totalPrice + selectedItem.price * quantity }
          : cartItem
      );
    } else {
      // Add new item to the cart
      return [...prevCart, { ...selectedItem, quantity, totalPrice: selectedItem.price * quantity }];
    }
  });
  setIsQuantityModalVisible(false); // Close the quantity modal
  Alert.alert('Added to Cart', `${selectedItem.name} has been added to your cart.`);
};

  const handleAddCustomizedItem = () => {
    setCart((prev) => [
      ...prev,
      { ...selectedItem, customization },
    ]);
    setCustomization({ size: sizes[0] || '', toppings: [] }); // Reset customization
    setSelectedItem(null);
    setIsModalVisible(false); // Close the modal
    Alert.alert('Added to Cart', `${selectedItem.name} has been customized and added to your cart.`);
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }
    navigation.navigate('Order', { orders: cart, totalPrice: totalCartPrice }); // Pass cart data and total price to Order.js
  };

const handlePayment = async () => {
  if (paymentMethod === 'Card') {
    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
      Alert.alert('Error', 'Please fill in all card payment details.');
      return;
    }
  } else if (paymentMethod === 'COD') {
    if (!paymentDetails.address) {
      Alert.alert('Error', 'Please provide your address for Cash on Delivery.');
      return;
    }
  }

  try {
    const response = await fetch('http://192.168.1.7/fran/api/orders.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        cart.map((item) => ({
          pizza_name: item.name,
          size: item.customization.size,
          crust: item.customization.crust,
          toppings: item.customization.toppings,
          price: item.price,
          status: paymentMethod === 'Card' ? 'Preparing' : 'Pending COD',
        }))
      ),
    });

    if (response.ok) {
      Alert.alert('Payment Successful', 'Your order has been placed!');
      const orderDetails = cart.map((item) => ({
        pizza_name: item.name,
        size: item.customization.size,
        crust: item.customization.crust,
        toppings: item.customization.toppings,
      }));
      setCart([]); // Clear the cart
      setIsPaymentModalVisible(false); // Close the payment modal
      navigation.navigate('Order', { orders: orderDetails }); // Navigate to Order.js with order details
    } else {
      const errorData = await response.json();
      console.error('Order creation failed:', errorData);
      Alert.alert('Error', 'Failed to create order.');
    }
  } catch (error) {
    console.error('Error creating order:', error);
    Alert.alert('Error', 'Something went wrong.');
  }
};

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('Login');
  };

  // Handle search query changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMenuItems(menuItems); // Reset to all products if search query is empty
    } else {
      const filtered = menuItems.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
          <Text>No Image</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.category}</Text>
        <Text style={styles.itemPrice}>{item.price} PHP</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

const renderCartItem = ({ item }) => (
  <View style={styles.cartItem}>
    <Text style={styles.cartItemName}>{item.name}</Text>
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)} // Decrease quantity
      >
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{item.quantity}</Text>
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)} // Increase quantity
      >
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.cartItemPrice}>Total: {item.totalPrice} PHP</Text>
  </View>
);

const updateCartItemQuantity = (itemId, newQuantity) => {
  if (newQuantity <= 0) {
    // Remove the item from the cart if the quantity is 0 or less
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  } else {
    // Update the quantity and total price of the item
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
          : item
      )
    );
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FRAN</Text>
      <Text style={styles.title}>Shop Now</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.menuList}
      />

      {/* Cart Icon */}
      <TouchableOpacity
        style={styles.cartIconContainer}
        onPress={() => setIsCartModalVisible(true)}
      >
        <Ionicons name="cart" size={30} color="#000" />
        {cart.length > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cart.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Proceed to Payment Button */}
      <TouchableOpacity style={styles.button} onPress={handleProceedToPayment}>
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>

      {/* Cart Modal */}
      <Modal visible={isCartModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Cart</Text>
            {cart.length === 0 ? (
              <Text style={styles.emptyCartText}>Your cart is empty.</Text>
            ) : (
              <>
                <FlatList
                  data={cart}
                  renderItem={renderCartItem}
                  keyExtractor={(item, index) => index.toString()}
                />
                <Text style={styles.totalPrice}>Total: {totalCartPrice.toFixed(2)} PHP</Text>
              </>
            )}
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsCartModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Quantity Modal */}
      <Modal visible={isQuantityModalVisible} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Quantity</Text>
      <Text style={styles.itemName}>{selectedItem?.name}</Text>
      <Text style={styles.modalDescription}>
        Use the buttons below to adjust the quantity.
      </Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))} // Decrease quantity, minimum is 1
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((prev) => prev + 1)} // Increase quantity
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.modalButton} onPress={handleAddToCart}>
          <Text style={styles.modalButtonText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => setIsQuantityModalVisible(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  menuList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff', // White card background
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000000', // Black shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000', // Black text
  },
  itemDescription: {
    fontSize: 14,
    color: '#555555', // Gray text
    marginVertical: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#333333', // Dark gray text
  },
  addButton: {
    backgroundColor: '#000000', // Black button background
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: '#ffffff', // White text
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#000000', // Hot pink
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginRight: 15,
  },
  logoutText: {
    color: '#000000', // Hot pink
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Hot pink
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#ff7f50',
    borderColor: '#ff7f50',
  },
  optionText: {
    color: '#555',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#000000', // Black button background
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc', // Gray cancel button
  },
  proceedButton: {
    backgroundColor: '#ccc', // Green proceed button
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
  flexDirection: 'row',
  marginBottom: 20,
},
toggleButton: {
  flex: 1,
  padding: 10,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#ddd',
  alignItems: 'center',
  marginHorizontal: 5,
},
selectedToggle: {
  backgroundColor: '#ff69b4',
  borderColor: '#ff69b4',
},
toggleText: {
  color: '#fff',
  fontWeight: 'bold',
},
cartIconContainer: {
  position: 'absolute',
  bottom: 80, // Adjusted to ensure it's above the "Proceed to Payment" button
  right: 20,
  backgroundColor: '#ffffff', // White background
  borderRadius: 30,
  padding: 10,
  shadowColor: '#000000', // Black shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
  zIndex: 10, // Ensure it appears above other elements
},
cartBadge: {
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: '#ff0000', // Red badge
  borderRadius: 10,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
cartBadgeText: {
  color: '#ffffff', // White text
  fontSize: 12,
  fontWeight: 'bold',
},
cartItem: {
  backgroundColor: '#ffffff',
  borderRadius: 10,
  padding: 15,
  marginBottom: 10,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 3,
},
cartItemName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000000',
},
cartItemQuantity: {
  fontSize: 14,
  color: '#555555',
},
cartItemPrice: {
  fontSize: 14,
  color: '#333333',
},
modalDescription: {
  fontSize: 14,
  color: '#555',
  marginBottom: 15,
  textAlign: 'center',
},
emptyCartText: {
  fontSize: 16,
  color: '#555',
  textAlign: 'center',
  marginVertical: 20,
},
totalPrice: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
  textAlign: 'center',
  marginVertical: 10,
},
quantityContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},
quantityButton: {
  backgroundColor: '#000000', // Black button background
  borderRadius: 10,
  padding: 10,
  marginHorizontal: 10,
},
quantityButtonText: {
  color: '#ffffff', // White text
  fontSize: 18,
  fontWeight: 'bold',
},
quantityText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000000', // Black text
},
});

export default Menu;