import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const Order = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State to store the total price

  useEffect(() => {
    const fetchOrders = () => {
      fetch('http://192.168.1.160/online-ordering-system/api/orders.php')
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          // Calculate total price
          const total = data.reduce((sum, order) => sum + parseFloat(order.price), 0);
          setTotalPrice(total);
        })
        .catch((error) => console.error('Error fetching orders:', error));
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleFinishOrder = async () => {
    try {
      const response = await fetch('http://192.168.1.160/online-ordering-system/api/orders.php', {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Order Finished', 'Thank you for your order!');
        setOrders([]); // Clear the orders state
        setTotalPrice(0); // Reset the total price
        navigation.navigate('Menu'); // Navigate back to the Menu screen
      } else {
        const errorData = await response.json();
        console.error('Failed to delete orders:', errorData);
        Alert.alert('Error', 'Failed to finish the order.');
      }
    } catch (error) {
      console.error('Error finishing order:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.pizza_name}</Text>
      <Text style={styles.itemDetails}>Size: {item.size}</Text>
      <Text style={styles.itemDetails}>Crust: {item.crust}</Text> {/* Wrap crust type */}
      <Text style={styles.itemDetails}>Toppings: {item.toppings}</Text>
      <Text style={styles.itemDetails}>Price: {item.price} PHP</Text>
      <Text style={styles.itemStatus}>
        Status: <Text style={item.status === 'Ready' ? styles.ready : styles.preparing}>{item.status}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.orderList}
      />
      {/* Display Total Price */}
      <Text style={styles.totalPrice}>Total Amount: {totalPrice.toFixed(2)} PHP</Text>
      <TouchableOpacity style={styles.finishButton} onPress={handleFinishOrder}>
        <Text style={styles.finishButtonText}>Finish Order</Text>
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
  itemStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  preparing: {
    color: '#ff99cc',
    fontWeight: 'bold',
  },
  ready: {
    color: '#b30059',
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black text
    textAlign: 'center',
    marginTop: 20,
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