// components/Customer.js
import React, { useState } from 'react';

const Customer = ({ customers, addCustomer, updateCustomer, deleteCustomer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing && currentCustomer) {
      updateCustomer({
        ...currentCustomer,
        ...formData
      });
    } else {
      addCustomer(formData);
    }

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    setShowForm(false);
    setIsEditing(false);
    setCurrentCustomer(null);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    setShowForm(false);
    setIsEditing(false);
    setCurrentCustomer(null);
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  // Internal CSS
  const styles = `
    .customer-management {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      color: #333;
    }
    
    .customer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .customer-header h2 {
      color: #2c3e50;
      margin: 0;
    }
    
    .add-customer-btn {
      padding: 10px 20px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    
    .add-customer-btn:hover:not(:disabled) {
      background-color: #2980b9;
    }
    
    .add-customer-btn:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }
    
    .search-bar {
      margin-bottom: 20px;
    }
    
    .search-input {
      width: 100%;
      max-width: 400px;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 0.95rem;
    }
    
    .customer-form {
      background: #f8f9fa;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 30px;
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .form-title {
      grid-column: 1 / -1;
      margin-bottom: 15px;
      color: #2c3e50;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-label {
      font-weight: 600;
      margin-bottom: 8px;
      color: #34495e;
    }
    
    .form-input, .form-textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }
    
    .form-input:focus, .form-textarea:focus {
      border-color: #3498db;
      outline: none;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
    
    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }
    
    .form-buttons {
      grid-column: 1 / -1;
      display: flex;
      gap: 12px;
      margin-top: 15px;
    }
    
    .submit-btn {
      padding: 10px 20px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    
    .submit-btn:hover {
      background-color: #27ae60;
    }
    
    .cancel-btn {
      padding: 10px 20px;
      background-color: #95a5a6;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    
    .cancel-btn:hover {
      background-color: #7f8c8d;
    }
    
    .customer-list-title {
      color: #2c3e50;
      margin-bottom: 20px;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #7f8c8d;
      font-style: italic;
      background-color: #f9f9f9;
      border-radius: 8px;
    }
    
    .customer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .customer-card {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .customer-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .customer-info {
      margin-bottom: 15px;
    }
    
    .customer-name {
      margin: 0 0 12px 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }
    
    .customer-detail {
      margin: 6px 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .customer-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .edit-btn {
      padding: 8px 16px;
      background-color: #f39c12;
      color: #212529;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    
    .edit-btn:hover {
      background-color: #e67e22;
    }
    
    .delete-btn {
      padding: 8px 16px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    
    .delete-btn:hover {
      background-color: #c0392b;
    }
    
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .customer-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    
    @media (max-width: 480px) {
      .customer-grid {
        grid-template-columns: 1fr;
      }
      
      .form-buttons, .customer-actions {
        flex-direction: column;
      }
    }
  `;

  return (
    <div className="customer-management">
      {/* Add internal CSS */}
      <style>{styles}</style>
      
      <div className="customer-header">
        <h2>Customer Management</h2>
        <button 
          className="add-customer-btn"
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Add New Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Customer Form */}
      {showForm && (
        <div className="customer-form">
          <form onSubmit={handleSubmit} className="form-grid">
            <h3 className="form-title">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h3>
            
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter customer name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                rows="3"
                className="form-textarea"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                {isEditing ? 'Update Customer' : 'Add Customer'}
              </button>
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customers List */}
      <div>
        <h3 className="customer-list-title">Customer List ({filteredCustomers.length})</h3>
        
        {filteredCustomers.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? 'No customers found matching your search.' : 'No customers found. Add your first customer!'}
          </div>
        ) : (
          <div className="customer-grid">
            {filteredCustomers.map(customer => (
              <div key={customer.id} className="customer-card">
                <div className="customer-info">
                  <h4 className="customer-name">{customer.name}</h4>
                  {customer.email && <p className="customer-detail">Email: {customer.email}</p>}
                  {customer.phone && <p className="customer-detail">Phone: {customer.phone}</p>}
                  {customer.address && <p className="customer-detail">Address: {customer.address}</p>}
                  <p className="customer-detail">Member since: {new Date(customer.joinDate).toLocaleDateString()}</p>
                  <p className="customer-detail">Total purchases: M{customer.totalPurchases || 0}</p>
                  {customer.lastPurchase && (
                    <p className="customer-detail">Last purchase: {new Date(customer.lastPurchase).toLocaleDateString()}</p>
                  )}
                </div>
                
                <div className="customer-actions">
                  <button 
                    onClick={() => handleEdit(customer)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(customer.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;