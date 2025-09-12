import React from 'react';

const Inventory = ({ products, lowStockAlerts }) => {
  const categories = [...new Set(products.map(product => product.category))];
  
  const getCategoryTotal = (category) => {
    return products
      .filter(product => product.category === category)
      .reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  // Internal CSS
  const styles = `
    .page {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    
    h2 {
      color: #2c3e50;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 10px;
      margin-bottom: 25px;
    }
    
    h3 {
      color: #34495e;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    
    h4 {
      color: #7f8c8d;
      margin: 10px 0;
    }
    
    .alerts {
      background-color: #fff4f4;
      border-left: 4px solid #e74c3c;
      padding: 15px 20px;
      margin-bottom: 30px;
      border-radius: 0 4px 4px 0;
    }
    
    .alert-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .alert-item {
      background-color: #ffecec;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    
    .inventory-summary {
      margin-bottom: 30px;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .summary-card {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .summary-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .summary-card h4 {
      margin-top: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .summary-card p {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0;
      color: #2c3e50;
    }
    
    .category-breakdown {
      margin-top: 30px;
    }
    
    .category-item {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 0.9rem;
    }
    
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    th {
      background-color: #f1f2f6;
      font-weight: 600;
      color: #2c3e50;
    }
    
    tr:hover {
      background-color: #f5f6fa;
    }
    
    .low-stock {
      background-color: #ffecf0;
    }
    
    .low-stock:hover {
      background-color: #ffe4e9;
    }
    
    @media (max-width: 768px) {
      .summary-cards {
        grid-template-columns: 1fr 1fr;
      }
      
      table {
        display: block;
        overflow-x: auto;
      }
    }
    
    @media (max-width: 480px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      .alert-list {
        flex-direction: column;
      }
    }
  `;

  return (
    <div className="page">
      {/* Add internal CSS */}
      <style>{styles}</style>
      
      <h2>Inventory Overview</h2>
      
      {lowStockAlerts.length > 0 && (
        <div className="alerts">
          <h3>Low Stock Alerts</h3>
          <div className="alert-list">
            {lowStockAlerts.map(product => (
              <div key={product.id} className="alert-item">
                <span>{product.name}</span> - Only {product.quantity} left in stock
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="inventory-summary">
        <h3>Inventory Summary</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Total Products</h4>
            <p>{products.length}</p>
          </div>
          <div className="summary-card">
            <h4>Total Inventory Value</h4>
            <p>M{products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h4>Out of Stock</h4>
            <p>{products.filter(product => product.quantity === 0).length}</p>
          </div>
          <div className="summary-card">
            <h4>Low Stock Items</h4>
            <p>{lowStockAlerts.length}</p>
          </div>
        </div>
      </div>
      
      <div className="category-breakdown">
        <h3>Inventory by Category</h3>
        {categories.map(category => (
          <div key={category} className="category-item">
            <h4>{category}</h4>
            <p>Products: {products.filter(p => p.category === category).length}</p>
            <p>Total Value: M{getCategoryTotal(category).toFixed(2)}</p>
            
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(product => product.category === category)
                  .map(product => (
                    <tr key={product.id} className={product.quantity < 5 ? 'low-stock' : ''}>
                      <td>{product.name}</td>
                      <td>M{product.price.toFixed(2)}</td>
                      <td>{product.quantity}</td>
                      <td>M{(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;