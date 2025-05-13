import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || '');
  const [stock, setStock] = useState(product?.stock || '');
  const [price, setPrice] = useState(product?.price || '');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');

  const handleEditProduct = async () => {
    try {
      const response = await fetch('http://localhost/fran/api/products.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: product.id,
          name,
          category,
          stock: parseInt(stock),
          price: parseFloat(price),
          image_url: imageUrl,
        }),
      });
      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/menu'); // Redirect back to MenuManagement
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit Product</h1>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleEditProduct} style={styles.editButton}>
        Save Changes
      </button>
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
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  editButton: {
    backgroundColor: '#000000', // Black
    color: '#ffffff', // White
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
  },
};

export default EditProduct;