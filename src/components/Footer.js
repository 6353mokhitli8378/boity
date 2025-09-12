// components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Wings Cafe Management System</h3>
          <p>Developed by: [Mokhitli Senoko]</p>
          <p>Email: [senokomokhitli498@gmail.com.com]</p>
          <p>Phone: [63538378]</p>
        </div>
        
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>Product Management</li>
            <li>Stock Tracking</li>
            <li>Sales Processing</li>
            <li>Customer Management</li>
            <li>Inventory Reporting</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Technologies Used</h4>
          <ul>
            <li>React.js</li>
            <li>LocalStorage API</li>
            <li>CSS3</li>
            <li>JavaScript ES6+</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#support">Support Documentation</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Wings Cafe Management System. Developed by [Your Name]. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;