// 1. Import necessary libraries
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // <-- Imported CORS

const app = express();
const port = 3001;

// 2. Use Middleware
app.use(express.json()); // To read incoming JSON data from React

// --- THIS IS THE NEW FIX ---
// Allow React app (at localhost:5173) to talk to this server
app.use(cors({
  origin: 'http://localhost:5173' 
}));
// --- FIX END ---


// 4. MySQL Database Connection
// !!! --- YOU NEED TO CHANGE THIS --- !!!
const db = mysql.createPool({
  host: 'localhost',      // Your database server
  port: 3307,           // Your new MySQL port
  user: 'root',           // Your MySQL username
  password: '',           // Your MySQL password
  database: 'dairy_db'    // Database name
}).promise(); // Using .promise() for async/await

// --- API ROUTES (Your App's Main Logic) ---

// 5. Get all customers from database (GET)
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customers');
    res.json(rows);
  } catch (err) {
    console.error('DB error (get all customers):', err);
    res.status(500).json({ error: 'Failed to fetch customers from database.' });
  }
});

// 6. Get one customer's data (profile + entries) (GET)
app.get('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // First, get customer details
    const [customerRows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    
    if (customerRows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Then, get all entries for that customer
    const [entryRows] = await db.query('SELECT * FROM milk_entries WHERE customer_id = ? ORDER BY date DESC', [id]);
    
    // Combine both and send
    const customerData = {
      ...customerRows[0],
      entries: entryRows
    };
    
    res.json(customerData);
    
  } catch (err) {
    console.error('DB error (get one customer):', err);
    res.status(500).json({ error: 'Failed to fetch customer details from database.' });
  }
});

// 7. Add a new customer (POST)
app.post('/api/customers', async (req, res) => {
  const { id, name, mobile } = req.body;
  
  if (!id || !name || !mobile) {
    return res.status(400).json({ error: 'ID, Name, and Mobile are all required.' });
  }
  
  try {
    await db.query('INSERT INTO customers (id, name, mobile) VALUES (?, ?, ?)', [id, name, mobile]);
    res.status(201).json({ message: 'Customer added successfully.' });
  } catch (err) {
    console.error('DB error (add customer):', err);
    // 'ER_DUP_ENTRY' is the error code for when ID already exists
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This ID already exists.' });
    }
    res.status(500).json({ error: 'Failed to add customer to database.' });
  }
});

// 8. Delete a customer (DELETE)
app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // (Entries will be deleted automatically due to FOREIGN KEY 'ON DELETE CASCADE')
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer to delete was not found.' });
    }
    
    res.json({ message: 'Customer deleted successfully.' });
  } catch (err) {
    console.error('DB error (delete customer):', err);
    res.status(500).json({ error: 'Failed to delete customer from database.' });
  }
});

// 9. Add a new milk entry (POST)
app.post('/api/entries', async (req, res) => {
  const { customer_id, liters, fat, amount } = req.body;
  const date = new Date(); // Today's date
  
  if (!customer_id || !liters || !fat || !amount) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  try {
    await db.query(
      'INSERT INTO milk_entries (customer_id, date, liters, fat, amount) VALUES (?, ?, ?, ?, ?)',
      [customer_id, date, liters, fat, amount]
    );
    res.status(201).json({ message: 'Entry saved successfully.' });
  } catch (err) {
    console.error('DB error (add entry):', err);
    res.status(500).json({ error: 'Failed to save entry to database.' });
  }
});


// 10. Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});