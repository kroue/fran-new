import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const OrderHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch('http://192.168.1.10/fran-new/api/order_history.php');
      if (response.ok) {
        const data = await response.json();
        setHistory(Array.isArray(data) ? data : []);
      } else {
        setHistory([]);
      }
    } catch (error) {
      setHistory([]);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.product_name}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Total: {item.total_price} PHP</Text>
      <Text>Status: {item.status}</Text>
      <Text>Address: {item.address}</Text>
      <Text>Finished At: {item.finished_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : history.length === 0 ? (
        <Text>No order history found.</Text>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, marginBottom: 10 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
});

export default OrderHistory;