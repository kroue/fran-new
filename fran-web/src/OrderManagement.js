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
      const response = await fetch('http://localhost/online-ordering-system/api/orders.php');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const toggleOrderStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'Ready' ? 'Preparing' : 'Ready';

    console.log('Updating order:', { id: orderId, status: newStatus }); // Debugging: Log the request payload

    try {
      const response = await fetch('http://localhost/online-ordering-system/api/orders.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (response.ok) {
        console.log('Order status updated successfully'); // Debugging: Log success
        fetchOrders(); // Refresh the orders list
      } else {
        const errorData = await response.json();
        console.error('Failed to update order status:', errorData); // Debugging: Log error response
      }
    } catch (error) {
      console.error('Error updating order status:', error); // Debugging: Log network errors
    }
  };

  return (
  <div style={styles.container}>
    <h1 style={styles.title}>Order Management</h1>
    <ul style={styles.list}>
      {orders.map((order) => (
        <li key={order.id} style={styles.listItem}>
          <div>
            <p><strong>User Email:</strong> {order.user_email}</p>
            <p><strong>Pizza Name:</strong> {order.pizza_name}</p>
            <p><strong>Size:</strong> {order.size}</p>
            <p><strong>Crust:</strong> {order.crust}</p> {/* Display crust type */}
            <p><strong>Toppings:</strong> {order.toppings}</p>
            <p><strong>Price:</strong> {order.price} PHP</p>
            <p>
              <strong>Status:</strong>{' '}
              <span style={order.status === 'Ready' ? styles.ready : styles.preparing}>
                {order.status}
              </span>
            </p>
          </div>
          <button
            onClick={() => toggleOrderStatus(order.id, order.status)}
            style={styles.button}
          >
            {order.status === 'Ready' ? 'Mark as Preparing' : 'Mark as Ready'}
          </button>
        </li>
      ))}
    </ul>
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
    backgroundColor: '#ffffff', // White
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000000', // Black
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
    backgroundColor: '#ffffff', // White
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#000000', // Black
    color: '#ffffff', // White
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  ready: {
    color: 'green',
    fontWeight: 'bold',
  },
  preparing: {
    color: 'orange',
    fontWeight: 'bold',
  },
};

export default OrderManagement;