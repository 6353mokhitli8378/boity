// public/stock-management.js (frontend React component)
import React, { useState, useEffect } from 'react';

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://backend-054e.onrender.com/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const updateStock = async (productId, quantityChange) => {
    try {
      const response = await fetch(`https://backend-054e.onrender.com/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantityChange }),
      });
      
      if (response.ok) {
        // Refresh the product list
        fetchProducts();
      } else {
        console.error('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const handleStockUpdate = (action) => {
    if (!selectedProduct || !quantity) return;
    
    const quantityChange = action === 'add' ? parseInt(quantity) : -parseInt(quantity);
    updateStock(parseInt(selectedProduct), quantityChange);
    
    setQuantity('');
  };

  // CSS styles
  const styles = {
    stockManagement: {
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto'
    },
    heading: {
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center'
    },
    stockForm: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '600',
      color: '#2c3e50'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '20px'
    },
    addButton: {
      padding: '12px 20px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.3s ease',
      flex: 1
    },
    removeButton: {
      padding: '12px 20px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.3s ease',
      flex: 1
    },
    buttonHover: {
      backgroundColor: '#218838'
    },
    removeButtonHover: {
      backgroundColor: '#c82333'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    tableHeader: {
      backgroundColor: '#34495e',
      color: 'white',
      padding: '12px',
      textAlign: 'left'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    lowStock: {
      color: 'red',
      fontWeight: 'bold'
    },
    inStock: {
      color: 'green'
    }
  };

  // Hover state for buttons
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div style={styles.stockManagement}>
      <h1 style={styles.heading}>Stock Management</h1>
      
      <div style={styles.stockForm}>
        <div style={styles.formGroup}>
          <label htmlFor="product" style={styles.label}>Select Product</label>
          <select 
            id="product" 
            value={selectedProduct} 
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={styles.select}
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} (Current: {product.quantity})
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label htmlFor="quantity" style={styles.label}>Quantity</label>
          <input 
            type="number" 
            id="quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            style={styles.input}
          />
        </div>
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={() => handleStockUpdate('add')}
            style={{
              ...styles.addButton,
              ...(hoveredButton === 'add' && styles.buttonHover)
            }}
            onMouseEnter={() => setHoveredButton('add')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={!selectedProduct || !quantity}
          >
            Add Stock
          </button>
          <button 
            onClick={() => handleStockUpdate('remove')}
            style={{
              ...styles.removeButton,
              ...(hoveredButton === 'remove' && styles.removeButtonHover)
            }}
            onMouseEnter={() => setHoveredButton('remove')}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={!selectedProduct || !quantity}
          >
            Remove Stock
          </button>
        </div>
      </div>
      
      <h2 style={styles.heading}>Current Inventory</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Category</th>
            <th style={styles.tableHeader}>Price</th>
            <th style={styles.tableHeader}>Quantity</th>
            <th style={styles.tableHeader}>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td style={styles.tableCell}>{product.name}</td>
              <td style={styles.tableCell}>{product.category}</td>
              <td style={styles.tableCell}>M{product.price.toFixed(2)}</td>
              <td style={styles.tableCell}>{product.quantity}</td>
              <td style={styles.tableCell}>
                {product.quantity < 5 ? 
                  <span style={styles.lowStock}>Low Stock</span> : 
                  <span style={styles.inStock}>In Stock</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagement;