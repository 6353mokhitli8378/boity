// App.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';

// Lazy load components with error boundary
const Dashboard = lazy(() => import('./components/Dashboard'));
const ProductManagement = lazy(() => import('./components/ProductManagement'));
const StockManagement = lazy(() => import('./components/StockManagement'));
const Sales = lazy(() => import('./components/Sales'));
const Inventory = lazy(() => import('./components/Inventory'));
const Reporting = lazy(() => import('./components/Reporting'));
const Footer = lazy(() => import('./components/Footer')); // Add Footer import

// Customer component with error handling
let CustomerComponent;
try {
  CustomerComponent = lazy(() => import('./components/Customer'));
} catch (error) {
  console.error('Failed to load Customer component:', error);
  CustomerComponent = () => <div>Error loading Customer Management. Please check the component file.</div>;
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('wingsCafeProducts'));
    const savedSales = JSON.parse(localStorage.getItem('wingsCafeSales')) || [];
    const savedCustomers = JSON.parse(localStorage.getItem('wingsCafeCustomers')) || [];
    
    if (savedProducts) {
      setProducts(savedProducts);
      checkLowStock(savedProducts);
    } else {
      // Initialize with sample data if none exists
      const initialProducts = [
        { id: 1, name: 'Coffee', description: 'Hot brewed coffee', category: 'Beverages', price: 2.50, quantity: 15 },
        { id: 2, name: 'Sandwich', description: 'Club sandwich', category: 'Food', price: 5.99, quantity: 8 },
        { id: 3, name: 'Cake', description: 'Chocolate cake slice', category: 'Desserts', price: 3.75, quantity: 3 }
      ];
      setProducts(initialProducts);
      localStorage.setItem('wingsCafeProducts', JSON.stringify(initialProducts));
      checkLowStock(initialProducts);
    }
    
    setSales(savedSales);
    setCustomers(savedCustomers);
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('wingsCafeProducts', JSON.stringify(products));
      checkLowStock(products);
    }
  }, [products]);

  // Save sales and customers to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wingsCafeSales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('wingsCafeCustomers', JSON.stringify(customers));
  }, [customers]);

  const checkLowStock = (productList) => {
    const alerts = productList.filter(product => product.quantity < 5);
    setLowStockAlerts(alerts);
  };

  const addProduct = (newProduct) => {
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productToAdd = { ...newProduct, id };
    setProducts([...products, productToAdd]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const updateStock = (id, quantityChange) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, quantity: Math.max(0, product.quantity + quantityChange) } 
        : product
    ));
  };

  const addSale = (newSale) => {
    const id = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
    const saleToAdd = { ...newSale, id, date: new Date().toISOString() };
    
    // Update product quantities
    newSale.items.forEach(item => {
      updateStock(item.productId, -item.quantity);
    });
    
    setSales([...sales, saleToAdd]);
    
    // Update customer purchase history if customer exists
    if (newSale.customerId) {
      setCustomers(customers.map(customer => 
        customer.id === newSale.customerId 
          ? { ...customer, totalPurchases: (customer.totalPurchases || 0) + newSale.total, lastPurchase: new Date().toISOString() }
          : customer
      ));
    }
  };

  const addCustomer = (newCustomer) => {
    const id = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    const customerToAdd = { ...newCustomer, id, joinDate: new Date().toISOString(), totalPurchases: 0 };
    setCustomers([...customers, customerToAdd]);
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers(customers.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard products={products} lowStockAlerts={lowStockAlerts} sales={sales} customers={customers} />;
      case 'productManagement':
        return <ProductManagement 
                 products={products} 
                 addProduct={addProduct} 
                 updateProduct={updateProduct} 
                 deleteProduct={deleteProduct} 
               />;
      case 'stockManagement':
        return <StockManagement products={products} updateStock={updateStock} />;
      case 'sales':
        return <Sales 
                 sales={sales} 
                 products={products} 
                 customers={customers} 
                 addSale={addSale} 
               />;
      case 'inventory':
        return <Inventory products={products} lowStockAlerts={lowStockAlerts} />;
      case 'customer':
        return <CustomerComponent 
                 customers={customers} 
                 addCustomer={addCustomer} 
                 updateCustomer={updateCustomer} 
                 deleteCustomer={deleteCustomer} 
               />;
      case 'reporting':
        return <Reporting sales={sales} products={products} customers={customers} />;
      default:
        return <Dashboard products={products} lowStockAlerts={lowStockAlerts} sales={sales} customers={customers} />;
    }
  };

  return (
    <div className="App">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <h1>Wings Cafe Management</h1>
        <nav className="nav-menu">
          <button 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={currentPage === 'productManagement' ? 'active' : ''}
            onClick={() => setCurrentPage('productManagement')}
          >
            Product Management
          </button>
          <button 
            className={currentPage === 'stockManagement' ? 'active' : ''}
            onClick={() => setCurrentPage('stockManagement')}
          >
            Stock Management
          </button>
          <button 
            className={currentPage === 'sales' ? 'active' : ''}
            onClick={() => setCurrentPage('sales')}
          >
            Sales
          </button>
          <button 
            className={currentPage === 'inventory' ? 'active' : ''}
            onClick={() => setCurrentPage('inventory')}
          >
            Inventory
          </button>
          <button 
            className={currentPage === 'customer' ? 'active' : ''}
            onClick={() => setCurrentPage('customer')}
          >
            Customer
          </button>
          <button 
            className={currentPage === 'reporting' ? 'active' : ''}
            onClick={() => setCurrentPage('reporting')}
          >
            Reporting
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        <Suspense fallback={<div>Loading...</div>}>
          {renderPage()}
        </Suspense>
      </div>
      
      {/* Footer */}
      <Suspense fallback={<div></div>}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;