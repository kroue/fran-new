import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchProducts();
    }
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost/fran/api/products.php');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = () => {
    navigate('/add-product'); // Redirect to AddProduct.js
  };

  const handleEditProduct = (product) => {
    navigate('/edit-product', { state: { product } }); // Redirect to EditProduct.js with product data
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch('http://localhost/fran/api/products.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId }),
      });
      if (response.ok) {
        fetchProducts(); // Refresh the product list
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {user && <h2 style={styles.welcomeMessage}>Welcome, {user.username}!</h2>}
      <h1 style={styles.title}>Product Management</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={styles.searchBar}
      />

      {/* Add Product Button */}
      <button onClick={handleAddProduct} style={styles.addButton}>
        Add Product
      </button>

      {/* Product Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Product ID</th>
            <th style={styles.tableHeader}>Image</th>
            <th style={styles.tableHeader}>Product Name</th>
            <th style={styles.tableHeader}>Category</th>
            <th style={styles.tableHeader}>Stock</th>
            <th style={styles.tableHeader}>Price</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{product.id}</td>
              <td style={styles.tableCell}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={styles.productImage}
                />
              </td>
              <td style={styles.tableCell}>{product.name}</td>
              <td style={styles.tableCell}>{product.category}</td>
              <td style={styles.tableCell}>{product.stock}</td>
              <td style={styles.tableCell}>{product.price} PHP</td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => handleEditProduct(product)}
                  style={styles.actionButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  style={styles.actionButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  welcomeMessage: {
    fontSize: '18px',
    color: '#000000', // Black
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000000', // Black
    marginBottom: '20px',
  },
  searchBar: {
    width: '100%',
    maxWidth: '600px',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  addButton: {
    backgroundColor: '#000000', // Black
    color: '#ffffff', // White
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    maxWidth: '800px',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableHeader: {
    backgroundColor: '#000000', // Black
    color: '#ffffff', // White
    padding: '10px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'left',
  },
  actionButton: {
    backgroundColor: '#000000', // Black
    color: '#ffffff', // White
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  productImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  },
};

export default MenuManagement;