import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';

const Tracking = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [redirected, setRedirected] = useState(false); // Track if the user has been redirected

  useEffect(() => {
    // Fetch orders from the database every 5 seconds
    const interval = setInterval(() => {
      if (!redirected) {
        fetchOrders();
      }
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [redirected]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://192.168.1.10/fran-new/api/get_orders.php');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);

        // Redirect to Menu.js if orders are empty and not already redirected
        if (data.length === 0 && !redirected) {
          setRedirected(true); // Prevent further alerts and navigation
          Alert.alert('Thank you for ordering', 'Order Finished', [
            { text: 'OK', onPress: () => navigation.navigate('Menu') },
          ]);
        }
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (!redirected) {
        Alert.alert('Error', 'Failed to fetch orders.');
      }
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.product_name}</Text>
      <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemDetails}>Total Price: {item.total_price} PHP</Text>
      <Text style={styles.itemDetails}>Status: {item.status}</Text>
      {item.status === 'COD' && <Text style={styles.itemDetails}>Address: {item.address}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Tracking</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.orderList}
      />
      <Text style={styles.waitMessage}>Please wait until finished.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderList: {
    paddingBottom: 20,
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderColor: '#000000',
    borderWidth: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemDetails: {
    fontSize: 16,
    color: '#555555',
    marginTop: 5,
  },
  waitMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Tracking;