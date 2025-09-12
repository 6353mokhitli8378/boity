import React, { useState } from 'react';

const Reporting = ({ sales, products, customers }) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Include the entire end day
    
    return saleDate >= startDate && saleDate <= endDate;
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalItemsSold = filteredSales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);
  
  const topSellingProducts = () => {
    const productSales = {};
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = 0;
        }
        productSales[item.productId] += item.quantity;
      });
    });
    
    return Object.entries(productSales)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        return {
          name: product ? product.name : 'Unknown Product',
          quantity,
          revenue: quantity * (product ? product.price : 0)
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const topCustomers = () => {
    const customerPurchases = {};
    
    filteredSales.forEach(sale => {
      if (sale.customerId) {
        if (!customerPurchases[sale.customerId]) {
          customerPurchases[sale.customerId] = 0;
        }
        customerPurchases[sale.customerId] += sale.total;
      }
    });
    
    return Object.entries(customerPurchases)
      .map(([customerId, total]) => {
        const customer = customers.find(c => c.id === parseInt(customerId));
        return {
          name: customer ? customer.name : 'Unknown Customer',
          total
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const salesByDay = () => {
    const dailySales = {};
    
    filteredSales.forEach(sale => {
      const date = new Date(sale.date).toLocaleDateString();
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      dailySales[date] += sale.total;
    });
    
    return Object.entries(dailySales)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Internal CSS
  const styles = `
    .reporting-page {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    
    .reporting-page h2 {
      color: #2c3e50;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 10px;
      margin-bottom: 25px;
    }
    
    .reporting-page h3 {
      color: #34495e;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    
    .reporting-page h4 {
      color: #7f8c8d;
      margin: 15px 0;
      font-size: 1.1rem;
    }
    
    .report-controls {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      flex-wrap: wrap;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      min-width: 200px;
    }
    
    .form-group label {
      font-weight: 600;
      margin-bottom: 8px;
      color: #34495e;
    }
    
    .form-group input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 0.95rem;
    }
    
    .report-summary {
      margin-bottom: 30px;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .summary-card {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-top: 4px solid #3498db;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .summary-card:nth-child(2) {
      border-top-color: #2ecc71;
    }
    
    .summary-card:nth-child(3) {
      border-top-color: #f39c12;
    }
    
    .summary-card:nth-child(4) {
      border-top-color: #9b59b6;
    }
    
    .summary-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
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
    
    .report-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 25px;
    }
    
    .top-products, .top-customers, .sales-trend {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    
    .top-products tr:nth-child(1) td {
      background-color: #fff9e6;
    }
    
    .top-products tr:nth-child(2) td {
      background-color: #fff2cc;
    }
    
    .top-products tr:nth-child(3) td {
      background-color: #ffe6b3;
    }
    
    .top-customers tr:nth-child(1) td {
      background-color: #e6f7ff;
    }
    
    .top-customers tr:nth-child(2) td {
      background-color: #cceeff;
    }
    
    .top-customers tr:nth-child(3) td {
      background-color: #b3e6ff;
    }
    
    .no-data-message {
      text-align: center;
      padding: 20px;
      color: #7f8c8d;
      font-style: italic;
    }
    
    @media (max-width: 768px) {
      .report-controls {
        flex-direction: column;
        gap: 15px;
      }
      
      .form-group {
        min-width: 100%;
      }
      
      .summary-cards {
        grid-template-columns: 1fr 1fr;
      }
      
      .report-details {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      table {
        display: block;
        overflow-x: auto;
      }
    }
  `;

  return (
    <div className="reporting-page">
      {/* Add internal CSS */}
      <style>{styles}</style>
      
      <h2>Sales Reporting</h2>
      
      <div className="report-controls">
        <div className="form-group">
          <label>Start Date:</label>
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} 
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} 
          />
        </div>
      </div>
      
      <div className="report-summary">
        <h3>Summary for Selected Period</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Total Revenue</h4>
            <p>M{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h4>Total Orders</h4>
            <p>{filteredSales.length}</p>
          </div>
          <div className="summary-card">
            <h4>Items Sold</h4>
            <p>{totalItemsSold}</p>
          </div>
          <div className="summary-card">
            <h4>Average Order Value</h4>
            <p>M{filteredSales.length > 0 ? (totalRevenue / filteredSales.length).toFixed(2) : '0.00'}</p>
          </div>
        </div>
      </div>
      
      <div className="report-details">
        <div className="top-products">
          <h4>Top Selling Products</h4>
          {topSellingProducts().length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts().map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>M{product.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">No sales in the selected period.</p>
          )}
        </div>
        
        <div className="top-customers">
          <h4>Top Customers</h4>
          {topCustomers().length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers().map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.name}</td>
                    <td>M{customer.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">No customer sales in the selected period.</p>
          )}
        </div>
        
        <div className="sales-trend">
          <h4>Daily Sales Trend</h4>
          {salesByDay().length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {salesByDay().map((day, index) => (
                  <tr key={index}>
                    <td>{day.date}</td>
                    <td>M{day.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">No sales in the selected period.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reporting;