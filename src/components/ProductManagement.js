// ProductManagement.js
import React, { useState, useEffect } from 'react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });

  const API_BASE = "http://localhost:5000/api/products";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading products: ' + err.message);
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      setNewProduct({ name: '', category: '', price: '', quantity: '' });
    } catch (err) {
      setError('Error adding product: ' + err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError('Error deleting product: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.quantity) {
      setError('Please fill all fields');
      return;
    }

    const productData = {
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity)
    };

    addProduct(productData);
  };

  if (loading) return <div className="product-management">Loading...</div>;

  return (
    <div className="product-management">
      <h1>Product Management</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="horizontal-table-container">
        <table className="horizontal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price (M)</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Existing products */}
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>M{product.price.toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td className="actions">
                  <button className="delete" onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new product form */}
      <div className="add-product-form">
        <h2>Add New Product</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Product name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              placeholder="Category"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price (M)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Price"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={newProduct.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label>&nbsp;</label>
            <button onClick={handleAddProduct}>Add Product</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-management {
          padding: 20px;
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .horizontal-table-container {
          overflow-x: auto;
          margin-top: 20px;
          margin-bottom: 40px;
        }
        
        .horizontal-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .horizontal-table th {
          background-color: #2c3e50;
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: bold;
        }
        
        .horizontal-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #ddd;
        }
        
        .horizontal-table tr:last-child td {
          border-bottom: none;
        }
        
        .actions button.delete {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .actions button.delete:hover {
          background-color: #c0392b;
        }
        
        .add-product-form {
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-top: 30px;
        }
        
        .add-product-form h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          align-items: end;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .form-group input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #2c3e50;
        }
        
        .form-group button {
          background-color: #27ae60;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }
        
        .form-group button:hover {
          background-color: #219a52;
        }
        
        .error-message {
          color: #e74c3c;
          background-color: #fadbd8;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
          border: 1px solid #e74c3c;
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 20px;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .horizontal-table {
            min-width: 600px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductManagement;