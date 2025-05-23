import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

const Order = ({ route, navigation }) => {
  const { orders, totalPrice } = route.params; // Receive orders and total price from Menu.js
  const [paymentMethod, setPaymentMethod] = useState('Card'); // Default to Card Payment
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    address: '',
  });

  const handleCompleteOrder = async () => {
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
      // Send order details to the database
      const response = await fetch('http://192.168.1.7/fran/api/save_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orders,
          totalPrice,
          paymentMethod: paymentMethod === 'Card' ? 'Card (Pick Up)' : 'COD',
          address: paymentMethod === 'COD' ? paymentDetails.address : null,
        }),
      });

      if (response.ok) {
        Alert.alert('Order Placed', 'Your order has been successfully placed!');
        navigation.navigate('Tracking'); // Navigate to Tracking screen
      } else {
        const errorData = await response.json();
        console.error('Error saving order:', errorData);
        Alert.alert('Error', 'Failed to save order.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemDetails}>Total: {item.totalPrice} PHP</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.orderList}
      />
      <Text style={styles.totalPrice}>Total Amount: {totalPrice.toFixed(2)} PHP</Text>

      {/* Payment Method Switch */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            paymentMethod === 'Card' && styles.selectedToggle,
          ]}
          onPress={() => setPaymentMethod('Card')}
        >
          <Text style={styles.toggleText}>Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            paymentMethod === 'COD' && styles.selectedToggle,
          ]}
          onPress={() => setPaymentMethod('COD')}
        >
          <Text style={styles.toggleText}>Cash on Delivery</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Form */}
      {paymentMethod === 'Card' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={paymentDetails.cardNumber}
            onChangeText={(text) =>
              setPaymentDetails((prev) => ({ ...prev, cardNumber: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            value={paymentDetails.expiryDate}
            onChangeText={(text) =>
              setPaymentDetails((prev) => ({ ...prev, expiryDate: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            secureTextEntry
            value={paymentDetails.cvv}
            onChangeText={(text) =>
              setPaymentDetails((prev) => ({ ...prev, cvv: text }))
            }
          />
        </>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Delivery Address"
          value={paymentDetails.address}
          onChangeText={(text) =>
            setPaymentDetails((prev) => ({ ...prev, address: text }))
          }
        />
      )}

      {/* Complete Order Button */}
      <TouchableOpacity style={styles.finishButton} onPress={handleCompleteOrder}>
        <Text style={styles.finishButtonText}>Complete Order</Text>
      </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: 20,
    textAlign: 'center',
  },
  orderList: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#ffffff', // White card background
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000000', // Black shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderColor: '#000000', // Black border
    borderWidth: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000', // Black text
  },
  itemDetails: {
    fontSize: 14,
    color: '#555555', // Gray text
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black text
    textAlign: 'center',
    marginTop: 20,
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  finishButton: {
    backgroundColor: '#000000', // Black button background
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  finishButtonText: {
    color: '#ffffff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Order;