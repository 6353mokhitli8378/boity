// Sales.js
import React, { useState, useEffect } from 'react';
import './Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [saleForm, setSaleForm] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1 }],
    paymentMethod: 'cash'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = "https://backend-054e.onrender.com/api";

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, customersRes, salesRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/customers`),
        fetch(`${API_BASE}/sales`)
      ]);

      if (!productsRes.ok || !customersRes.ok || !salesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const productsData = await productsRes.json();
      const customersData = await customersRes.json();
      const salesData = await salesRes.json();

      setProducts(productsData);
      setCustomers(customersData);
      setSales(salesData);
      setLoading(false);
    } catch (err) {
      setError('Error loading data: ' + err.message);
      setLoading(false);
    }
  };

  const addItem = () => {
    setSaleForm({
      ...saleForm,
      items: [...saleForm.items, { productId: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    const newItems = saleForm.items.filter((_, i) => i !== index);
    setSaleForm({ ...saleForm, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = saleForm.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setSaleForm({ ...saleForm, items: newItems });
  };

  const calculateTotal = () => {
    return saleForm.items.reduce((total, item) => {
      const product = products.find(p => p.id === parseInt(item.productId));
      return total + (product ? product.price * (item.quantity || 0) : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (saleForm.items.some(item => !item.productId || item.quantity <= 0)) {
      setError('Please select valid products and quantities for all items');
      return;
    }

    // Check stock availability
    for (const item of saleForm.items) {
      const product = products.find(p => p.id === parseInt(item.productId));
      if (product && item.quantity > product.quantity) {
        setError(`Not enough stock for ${product.name}. Available: ${product.quantity}`);
        return;
      }
    }

    const total = calculateTotal();

    const saleData = {
      ...saleForm,
      customerId: saleForm.customerId || null,
      items: saleForm.items.map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        price: products.find(p => p.id === parseInt(item.productId))?.price || 0
      })),
      total: parseFloat(total.toFixed(2))
    };

    try {
      const response = await fetch(`${API_BASE}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData)
      });

      if (!response.ok) {
        throw new Error('Failed to create sale');
      }

      const newSale = await response.json();

      setSales([...sales, newSale]);

      // Reset form
      setSaleForm({
        customerId: '',
        items: [{ productId: '', quantity: 1 }],
        paymentMethod: 'cash'
      });

      // Refresh products
      const productsResponse = await fetch(`${API_BASE}/products`);
      if (productsResponse.ok) {
        const updatedProducts = await productsResponse.json();
        setProducts(updatedProducts);
      }
    } catch (err) {
      setError('Error creating sale: ' + err.message);
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">Error: {error}</div>;

  return (
    <div className="page">
      <h2>Sales Management</h2>

      <div className="sales-content">
        <div className="sales-form">
          <h3>New Sale</h3>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Customer:</label>
              <select
                value={saleForm.customerId}
                onChange={(e) => setSaleForm({ ...saleForm, customerId: e.target.value })}
              >
                <option value="">Walk-in Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <h4>Items:</h4>
            {saleForm.items.map((item, index) => {
              const selectedProduct = products.find(p => p.id === parseInt(item.productId));
              const maxQuantity = selectedProduct ? selectedProduct.quantity : 1;

              return (
                <div key={index} className="sale-item">
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.filter(p => p.quantity > 0).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price} (Stock: {product.quantity})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max={maxQuantity}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))
                    }
                    required
                  />

                  <button type="button" onClick={() => removeItem(index)}>Remove</button>
                </div>
              );
            })}

            <button type="button" onClick={addItem}>Add Item</button>

            <div className="form-group">
              <label>Payment Method:</label>
              <select
                value={saleForm.paymentMethod}
                onChange={(e) => setSaleForm({ ...saleForm, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="card">Credit Card</option>
                <option value="mobile">Mobile Payment</option>
              </select>
            </div>

            <div className="total">
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>

            <button type="submit">Complete Sale</button>
          </form>
        </div>

        <div className="sales-history">
          <h3>Recent Sales</h3>
          {sales.length === 0 ? (
            <p>No sales recorded yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice().reverse().map(sale => (
                  <tr key={sale.id}>
                    <td>{new Date(sale.date).toLocaleDateString()}</td>
                    <td>
                      {sale.customerId
                        ? customers.find(c => c.id === sale.customerId)?.name || 'Unknown'
                        : 'Walk-in'}
                    </td>
                    <td>
                      {sale.items.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        return product ? `${item.quantity}x ${product.name}` : 'Unknown Product';
                      }).join(', ')}
                    </td>
                    <td>${sale.total.toFixed(2)}</td>
                    <td>{sale.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
