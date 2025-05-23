import React, { useEffect, useState } from 'react';

const OrderHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch('http://localhost/fran-new/api/order_history.php');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        console.error('Failed to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Order History</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Product Name</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Total Price</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Finished At</th>
          </tr>
        </thead>
        <tbody>
          {history.map((order) => (
            <tr key={order.id}>
              <td style={styles.td}>{order.id}</td>
              <td style={styles.td}>{order.product_name}</td>
              <td style={styles.td}>{order.quantity}</td>
              <td style={styles.td}>{order.total_price} PHP</td>
              <td style={styles.td}>{order.status}</td>
              <td style={styles.td}>{order.address}</td>
              <td style={styles.td}>{order.finished_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

export default OrderHistory;