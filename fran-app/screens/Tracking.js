import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const Tracking = ({ route, navigation }) => {
  const { orders } = route.params; // Receive orders from the parent

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemStatus}>
        Status: <Text style={item.status === 'Ready' ? styles.ready : styles.preparing}>{item.status}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Tracking</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.orderList}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Menu')}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
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
  itemStatus: {
    fontSize: 14,
    color: '#555555', // Gray text
    marginTop: 5,
  },
  preparing: {
    color: '#ff99cc', // Light pink for preparing
    fontWeight: 'bold',
  },
  ready: {
    color: '#b30059', // Darker pink for ready
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#000000', // Black button background
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#ffffff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Tracking;