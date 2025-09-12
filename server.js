const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
const db = new sqlite3.Database(':memory:'); // Using in-memory database for simplicity

// Create tables
db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Customers table
  db.run(`CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_purchases REAL DEFAULT 0,
    last_purchase DATETIME
  )`);

  // Sales table
  db.run(`CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
  )`);

  // Sale items table
  db.run(`CREATE TABLE sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // Insert sample data
  const insertSampleData = () => {
    // Sample products
    const products = [
      { name: 'Laptop', description: 'High-performance laptop', category: 'Electronics', price: 1200, quantity: 15 },
      { name: 'Smartphone', description: 'Latest smartphone', category: 'Electronics', price: 800, quantity: 30 },
      { name: 'Headphones', description: 'Noise-cancelling headphones', category: 'Electronics', price: 250, quantity: 50 },
      { name: 'Desk Chair', description: 'Ergonomic office chair', category: 'Furniture', price: 350, quantity: 20 },
      { name: 'Coffee Maker', description: 'Automatic coffee machine', category: 'Appliances', price: 150, quantity: 25 }
    ];

    const insertProduct = db.prepare(`INSERT INTO products (name, description, category, price, quantity) 
                                      VALUES (?, ?, ?, ?, ?)`);
    products.forEach(p => {
      insertProduct.run(p.name, p.description, p.category, p.price, p.quantity);
    });
    insertProduct.finalize();

    // Sample customers
    const customers = [
      { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St' },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', address: '456 Oak Ave' },
      { name: 'Bob Johnson', email: 'bob@example.com', phone: '555-123-4567', address: '789 Pine Rd' }
    ];

    const insertCustomer = db.prepare(`INSERT INTO customers (name, email, phone, address) 
                                       VALUES (?, ?, ?, ?)`);
    customers.forEach(c => {
      insertCustomer.run(c.name, c.email, c.phone, c.address);
    });
    insertCustomer.finalize();
  };

  insertSampleData();
});

// Routes

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a single product
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
});

// Add a new product
app.post('/api/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  
  if (!name || !price || quantity === undefined) {
    res.status(400).json({ error: 'Name, price, and quantity are required' });
    return;
  }

  db.run(
    'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
    [name, description, category, price, quantity],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, description, category, price, quantity });
    }
  );
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, category, price, quantity } = req.body;
  
  db.run(
    'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
    [name, description, category, price, quantity, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ id, name, description, category, price, quantity });
    }
  );
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// Update product stock quantity
app.patch('/api/products/:id/stock', (req, res) => {
  const id = req.params.id;
  const { quantityChange } = req.body;
  
  if (quantityChange === undefined) {
    res.status(400).json({ error: 'quantityChange is required' });
    return;
  }
  
  db.run(
    'UPDATE products SET quantity = quantity + ? WHERE id = ?',
    [quantityChange, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      // Get the updated product
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

// Get all customers
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a single customer
app.get('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(row);
  });
});

// Add a new customer
app.post('/api/customers', (req, res) => {
  const { name, email, phone, address } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  db.run(
    'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
    [name, email, phone, address],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        name, 
        email, 
        phone, 
        address,
        join_date: new Date().toISOString(),
        total_purchases: 0
      });
    }
  );
});

// Update a customer
app.put('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, phone, address } = req.body;
  
  db.run(
    'UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
    [name, email, phone, address, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }
      res.json({ id, name, email, phone, address });
    }
  );
});

// Delete a customer
app.delete('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

// Get all sales with customer information and items
app.get('/api/sales', (req, res) => {
  const query = `
    SELECT 
      s.*, 
      c.name as customer_name,
      c.email as customer_email,
      GROUP_CONCAT(si.product_id || ':' || si.quantity || ':' || si.price, '|') as items
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.id
    LEFT JOIN sale_items si ON s.id = si.sale_id
    GROUP BY s.id
    ORDER BY s.date DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Parse items into a more usable format
    const sales = rows.map(sale => {
      const items = sale.items ? sale.items.split('|').map(item => {
        const [productId, quantity, price] = item.split(':');
        return { productId: parseInt(productId), quantity: parseInt(quantity), price: parseFloat(price) };
      }) : [];
      
      return {
        id: sale.id,
        customerId: sale.customer_id,
        customerName: sale.customer_name,
        total: sale.total,
        paymentMethod: sale.payment_method,
        date: sale.date,
        items
      };
    });
    
    res.json(sales);
  });
});

// Get a single sale with details
app.get('/api/sales/:id', (req, res) => {
  const id = req.params.id;
  
  // Get sale info
  db.get(`
    SELECT s.*, c.name as customer_name, c.email as customer_email 
    FROM sales s 
    LEFT JOIN customers c ON s.customer_id = c.id 
    WHERE s.id = ?
  `, [id], (err, sale) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!sale) {
      res.status(404).json({ error: 'Sale not found' });
      return;
    }
    
    // Get sale items
    db.all(`
      SELECT si.*, p.name as product_name 
      FROM sale_items si 
      JOIN products p ON si.product_id = p.id 
      WHERE si.sale_id = ?
    `, [id], (err, items) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        id: sale.id,
        customerId: sale.customer_id,
        customerName: sale.customer_name,
        total: sale.total,
        paymentMethod: sale.payment_method,
        date: sale.date,
        items: items.map(item => ({
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          price: item.price
        }))
      });
    });
  });
});

// Create a new sale
app.post('/api/sales', (req, res) => {
  const { customerId, items, paymentMethod } = req.body;
  
  if (!items || items.length === 0) {
    res.status(400).json({ error: 'Sale must have at least one item' });
    return;
  }
  
  // Calculate total
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  
  // Start transaction
  db.serialize(() => {
    // Insert sale
    db.run(
      'INSERT INTO sales (customer_id, total, payment_method) VALUES (?, ?, ?)',
      [customerId || null, total, paymentMethod || 'cash'],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        const saleId = this.lastID;
        
        // Insert sale items and update product quantities
        const insertItem = db.prepare(`
          INSERT INTO sale_items (sale_id, product_id, quantity, price) 
          VALUES (?, ?, ?, ?)
        `);
        
        const updateProduct = db.prepare(`
          UPDATE products SET quantity = quantity - ? WHERE id = ?
        `);
        
        for (const item of items) {
          insertItem.run(saleId, item.productId, item.quantity, item.price);
          updateProduct.run(item.quantity, item.productId);
        }
        
        insertItem.finalize();
        updateProduct.finalize();
        
        // Update customer's total purchases and last purchase date if customer exists
        if (customerId) {
          db.run(
            `UPDATE customers 
             SET total_purchases = total_purchases + ?, last_purchase = datetime('now') 
             WHERE id = ?`,
            [total, customerId]
          );
        }
        
        // Return the created sale
        db.get(`
          SELECT s.*, c.name as customer_name 
          FROM sales s 
          LEFT JOIN customers c ON s.customer_id = c.id 
          WHERE s.id = ?
        `, [saleId], (err, sale) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          // Get sale items with product names
          db.all(`
            SELECT si.*, p.name as product_name 
            FROM sale_items si 
            JOIN products p ON si.product_id = p.id 
            WHERE si.sale_id = ?
          `, [saleId], (err, items) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            
            res.json({
              id: sale.id,
              customerId: sale.customer_id,
              customerName: sale.customer_name,
              total: sale.total,
              paymentMethod: sale.payment_method,
              date: sale.date,
              items: items.map(item => ({
                productId: item.product_id,
                productName: item.product_name,
                quantity: item.quantity,
                price: item.price
              }))
            });
          });
        });
      }
    );
  });
});

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});