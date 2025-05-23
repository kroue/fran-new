import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    // Set up polling to fetch orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost/fran-new/api/orders.php');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched orders:', data); // Log the fetched data
        if (Array.isArray(data)) {
          setOrders(data); // Update the state
        } else {
          setOrders([]); // Set to empty array if not an array
          console.error('API did not return an array:', data);
        }
      } else {
        console.error('Failed to fetch orders:', response.status, response.statusText);
        setOrders([]); // Set to empty array on error
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Set to empty array on error
    }
  };

  const toggleOrderStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'Finished' ? 'Preparing' : 'Finished';
    console.log(`Updating order ${orderId} to status: ${newStatus}`);

    try {
      const response = await fetch('http://localhost/fran-new/api/orders.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);

        if (newStatus === 'Finished') {
          // Remove the order from the state
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        } else {
          fetchOrders(); // Refresh the orders list
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to update order status:', errorData);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Order Management</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <ul style={styles.list}>
          {orders.map((order) => (
            <li key={order.id} style={styles.listItem}>
              <div>
                <p><strong>Product Name:</strong> {order.product_name}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Total Price:</strong> {order.total_price} PHP</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Address:</strong> {order.address}</p>
              </div>
              <button
                onClick={() => toggleOrderStatus(order.id, order.status)}
                style={styles.button}
              >
                {order.status === 'Finished' ? 'Mark as Preparing' : 'Mark as Finished'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    width: '100%',
    maxWidth: '600px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default OrderManagement;