// Product.js
import React, { useState, useEffect } from 'react';

const Product = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://backend-054e.onrender.com/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading product: ' + err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="product">Loading...</div>;
  if (error) return <div className="product">Error: {error}</div>;
  if (!product) return <div className="product">Product not found</div>;

  return (
    <div className="product">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Quantity: {product.quantity}</p>
    </div>
  );
};

export default Product;