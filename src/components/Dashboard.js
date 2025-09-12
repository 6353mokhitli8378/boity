// Dashboard.js
import React, { useState, useEffect } from 'react';

const Dashboard = ({ setCurrentPage }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalInventoryValue: 0
  });

  useEffect(() => {
    // Fetch statistics data
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products data
      const productsResponse = await fetch('/api/products');
      const products = await productsResponse.json();
      
      // Fetch sales data
      const salesResponse = await fetch('/api/sales');
      const sales = await salesResponse.json();
      
      // Calculate total inventory value
      const inventoryValue = products.reduce((total, product) => {
        return total + (product.price * product.quantity);
      }, 0);
      
      setStats({
        totalProducts: products.length,
        totalSales: sales.length,
        totalInventoryValue: inventoryValue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to sample data if API is not available
      setStats({
        totalProducts: 15,
        totalSales: 8,
        totalInventoryValue: 28750
      });
    }
  };

  const modules = [
    {
      title: 'Product Management',
      description: 'Add, update, or delete products from your inventory',
      page: 'product-management',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1089&q=80',
      price: 'M60.00'
    },
    {
      title: 'Stock Management',
      description: 'Track and manage your stock levels',
      page: 'stock-management',
      image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
      price: 'M30.00'
    },
    {
      title: 'Sales',
      description: 'Record sales and process transactions',
      page: 'sales',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      price: 'M15.00'
    },
    {
      title: 'Inventory',
      description: 'View current inventory status and levels',
      page: 'inventory',
      image: null,
      price: null
    },
    {
      title: 'Reporting',
      description: 'Generate reports and view analytics',
      page: 'reporting',
      image: null,
      price: null
    }
  ];

  // Internal CSS styles
  const styles = {
    dashboard: {
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto'
    },
    heading: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '15px',
      fontSize: '2.5rem'
    },
    description: {
      textAlign: 'center',
      marginBottom: '40px',
      color: '#7f8c8d',
      fontSize: '18px'
    },
    statsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '25px',
      marginBottom: '50px',
      flexWrap: 'wrap'
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      minWidth: '250px',
      textAlign: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      color: 'white',
      cursor: 'pointer'
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
    },
    statNumber: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
    },
    statLabel: {
      fontSize: '18px',
      opacity: 0.9,
      fontWeight: '500'
    },
    statIcon: {
      fontSize: '2.5rem',
      marginBottom: '15px'
    },
    modulesGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '25px'
    },
    moduleCard: {
      width: '280px',
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: '1px solid #e0e0e0'
    },
    moduleCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)'
    },
    moduleImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      display: 'block'
    },
    moduleContent: {
      padding: '20px'
    },
    moduleTitle: {
      color: '#2c3e50',
      marginBottom: '12px',
      fontSize: '20px',
      fontWeight: '600'
    },
    moduleDescription: {
      color: '#7f8c8d',
      marginBottom: '15px',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    price: {
      fontWeight: 'bold',
      color: '#e74c3c',
      fontSize: '20px',
      marginTop: '10px'
    }
  };

  // Hover state handlers
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.heading}>Wings Cafe Dashboard</h2>
      <p style={styles.description}>Welcome to the Wings Cafe Inventory Management System. Select a module to get started.</p>
      
      {/* Statistics Cards */}
      <div style={styles.statsContainer}>
        {/* Inventory Value Card */}
        <div 
          style={{
            ...styles.statCard,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            ...(hoveredStat === 'inventory' && styles.statCardHover)
          }}
          onMouseEnter={() => setHoveredStat('inventory')}
          onMouseLeave={() => setHoveredStat(null)}
          onClick={() => setCurrentPage('inventory')}
        >
          <div style={styles.statIcon}></div>
          <div style={styles.statNumber}>M{stats.totalInventoryValue.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Inventory Value</div>
        </div>

        {/* Sales Count Card */}
        <div 
          style={{
            ...styles.statCard,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            ...(hoveredStat === 'sales' && styles.statCardHover)
          }}
          onMouseEnter={() => setHoveredStat('sales')}
          onMouseLeave={() => setHoveredStat(null)}
          onClick={() => setCurrentPage('sales')}
        >
          <div style={styles.statIcon}></div>
          <div style={styles.statNumber}>{stats.totalSales}</div>
          <div style={styles.statLabel}>Total Sales</div>
        </div>

        {/* Products Count Card */}
        <div 
          style={{
            ...styles.statCard,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            ...(hoveredStat === 'products' && styles.statCardHover)
          }}
          onMouseEnter={() => setHoveredStat('products')}
          onMouseLeave={() => setHoveredStat(null)}
          onClick={() => setCurrentPage('product-management')}
        >
          <div style={styles.statIcon}></div>
          <div style={styles.statNumber}>{stats.totalProducts}</div>
          <div style={styles.statLabel}>Total Products</div>
        </div>
      </div>
      
      <div style={styles.modulesGrid}>
        {modules.map((module, index) => (
          <div 
            key={index} 
            style={{
              ...styles.moduleCard,
              ...(hoveredCard === index && styles.moduleCardHover)
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setCurrentPage(module.page)}
          >
            {module.image && (
              <img 
                src={module.image} 
                alt={module.title}
                style={styles.moduleImage}
              />
            )}
            <div style={styles.moduleContent}>
              <h3 style={styles.moduleTitle}>{module.title}</h3>
              <p style={styles.moduleDescription}>{module.description}</p>
              {module.price && <div style={styles.price}>{module.price}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;