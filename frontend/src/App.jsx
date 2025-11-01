import React, { useState, useEffect } from 'react';

// New component for CSS styles
const AppStyles = () => {
  return (
    <style>
      {`
        :root {
          --primary-color: #007bff;
          --primary-hover: #0056b3;
          --danger-color: #dc3545;
          --danger-hover: #c82333;
          --light-bg: #f8f9fa;
          --border-color: #dee2e6;
          --text-dark: #343a40;
          --text-light: #6c757d;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: var(--light-bg);
          color: var(--text-dark);
          margin: 0;
          padding: 20px;
        }
        
        .app-container {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
          max-width: 1200px;
          margin: auto;
        }

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-panel {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          height: fit-content;
        }

        .card {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        h2, h3 {
          color: var(--text-dark);
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 10px;
          margin-top: 0;
        }

        .input-group {
          margin-bottom: 15px;
        }

        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: var(--text-light);
        }

        .input-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          box-sizing: border-box;
        }

        button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          transition: background-color 0.2s;
        }

        button.primary {
          background-color: var(--primary-color);
          color: white;
        }

        button.primary:hover {
          background-color: var(--primary-hover);
        }

        button.danger {
          background-color: var(--danger-color);
          color: white;
          width: auto;
          padding: 5px 10px;
          font-size: 12px;
        }
        
        button.danger:hover {
          background-color: var(--danger-hover);
        }
        
        .error-message {
          color: var(--danger-color);
          background-color: #fdd;
          border: 1px solid var(--danger-color);
          border-radius: 4px;
          padding: 10px;
          margin-top: 10px;
        }
        
        .success-message {
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          padding: 10px;
          margin-top: 10px;
        }

        .customer-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 300px;
          overflow-y: auto;
        }

        .customer-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .customer-list li:last-child {
          border-bottom: none;
        }
        
        .profile-details {
          margin-bottom: 20px;
        }
        
        .profile-details p {
          font-size: 1.1em;
          margin: 5px 0;
        }
        
        .entry-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          align-items: flex-end;
          margin-bottom: 20px;
        }

        .entry-form .total-amount {
          grid-column: 1 / -1;
          font-size: 1.2em;
          font-weight: 600;
          color: var(--primary-color);
        }
        
        .entry-form button {
          grid-column: 1 / -1;
        }

        .entry-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .entry-table th, .entry-table td {
          border: 1px solid var(--border-color);
          padding: 10px;
          text-align: left;
        }

        .entry-table th {
          background-color: var(--light-bg);
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .app-container {
            grid-template-columns: 1fr;
          }
        }
      `}
    </style>
  );
};

// API Base URL (Your backend server)
const API_URL = 'http://localhost:3001';

// Main App Component
function App() {
  // --- STATE VARIABLES ---
  
  // For Admin Panel
  const [customers, setCustomers] = useState({}); // Stores all customers { "101": { name: "..." } }
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  
  // For Search
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState('');
  
  // For Customer Profile
  const [currentCustomer, setCurrentCustomer] = useState(null); // The currently searched customer
  const [liters, setLiters] = useState('');
  const [fat, setFat] = useState('');
  const [entryError, setEntryError] = useState('');
  const [entrySuccess, setEntrySuccess] = useState('');
  
  const totalAmount = (liters > 0 && fat > 0) ? (liters * fat * 0.85).toFixed(2) : 0; // Example calculation

  // --- API FUNCTIONS ---

  // Function: Get all customers from database
  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/customers`);
      const data = await response.json();
      
      // Convert data array to an object for easier lookup
      const customersObject = data.reduce((acc, customer) => {
        acc[customer.id] = customer;
        return acc;
      }, {});
      
      setCustomers(customersObject);
      
    } catch (err) {
      console.error('Error fetching customers:', err);
      setAdminError('Failed to load customer list from server.');
    }
  };
  
  // Function: Get one customer's full data (with entries)
  const fetchCustomerData = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${API_URL}/api/customers/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setSearchError(`Customer ID ${id} not found. Please add them from the Admin Panel first.`);
        } else {
          setSearchError('Failed to fetch customer data.');
        }
        setCurrentCustomer(null);
        return;
      }
      
      const data = await response.json();
      setCurrentCustomer(data);
      setSearchError('');
      setEntryError('');
      setEntrySuccess('');
      
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setSearchError('Failed to fetch customer data.');
      setCurrentCustomer(null);
    }
  };

  // --- EFFECTS ---
  
  // Load all customers when the app first starts
  useEffect(() => {
    fetchCustomers();
  }, []); // Empty array [] means this runs only once on mount

  // --- EVENT HANDLERS ---

  // Handle Search
  const handleSearch = () => {
    fetchCustomerData(searchId);
  };

  // Handle Add Customer (Admin)
  const handleAddCustomer = async (e) => {
    e.preventDefault(); // Prevent form from reloading page
    const form = e.target;
    const newCustomer = {
      id: form.customerId.value,
      name: form.customerName.value,
      mobile: form.customerMobile.value
    };
    
    setAdminError('');
    setAdminSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      
      const data = await response.json();

      if (!response.ok) {
        setAdminError(`Failed to add customer. (${data.error || 'Unknown error'})`);
      } else {
        setAdminSuccess('Customer added successfully!');
        form.reset();
        fetchCustomers(); // Refresh the customer list
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      setAdminError('Failed to add customer. (Network error)');
    }
  };

  // Handle Remove Customer (Admin)
  const handleRemoveCustomer = async (id) => {
    const customerName = customers[id]?.name || id;
    if (!window.confirm(`Are you sure you want to delete ${customerName} (ID: ${id})?`)) {
      return;
    }
    
    setAdminError('');
    setAdminSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/customers/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();

      if (!response.ok) {
        setAdminError(`Failed to delete customer ${id}. (${data.error || 'Unknown error'})`);
      } else {
        setAdminSuccess(`Customer ${id} deleted successfully.`);
        fetchCustomers(); // Refresh the list
        // If the deleted customer is the one being viewed, clear the profile
        if (currentCustomer && currentCustomer.id === id) {
          setCurrentCustomer(null);
        }
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      setAdminError(`Failed to delete customer ${id}. (Network error)`);
    }
  };
  
  // Handle Add Milk Entry
  const handleAddEntry = async () => {
    setEntryError('');
    setEntrySuccess('');

    const litersNum = parseFloat(liters);
    const fatNum = parseFloat(fat);
    
    if (litersNum <= 0 || fatNum <= 0) {
      setEntryError('Liters and Fat must be positive numbers.');
      return;
    }

    const newEntry = {
      customer_id: currentCustomer.id,
      liters: litersNum,
      fat: fatNum,
      amount: parseFloat(totalAmount)
    };

    try {
      const response = await fetch(`${API_URL}/api/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      
      const data = await response.json();

      if (!response.ok) {
        setEntryError(`Failed to add milk entry. (${data.error || 'Unknown error'})`);
      } else {
        setEntrySuccess('Entry added successfully!');
        setLiters('');
        setFat('');
        // Refresh the customer data to show the new entry
        fetchCustomerData(currentCustomer.id);
      }
    } catch (err) {
      console.error('Error adding entry:', err);
      setEntryError('Failed to add milk entry. (Network error)');
    }
  };

  // --- RENDER ---
  return (
    <>
      <AppStyles />
      <div className="app-container">
        {/* Main Content (Left Side) */}
        <div className="main-content">
          
          {/* Customer Search Card */}
          <div className="card">
            <h2>Customer Search</h2>
            <div className="input-group">
              <label htmlFor="customerIdSearch">Customer ID:</label>
              <input
                type="text"
                id="customerIdSearch"
                placeholder="E.g., 101"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <button className="primary" onClick={handleSearch}>Search</button>
            {searchError && <p className="error-message">{searchError}</p>}
          </div>

          {/* Customer Profile Card */}
          {currentCustomer && (
            <div className="card">
              <h2>Customer Profile</h2>
              <div className="profile-details">
                <p><strong>Customer ID:</strong> {currentCustomer.id}</p>
                <p><strong>Name:</strong> {currentCustomer.name}</p>
                <p><strong>Mobile:</strong> {currentCustomer.mobile}</p>
              </div>

              <hr />

              {/* New Entry Form */}
              <h3>Add New Entry</h3>
              <div className="entry-form">
                <div className="input-group">
                  <label htmlFor="liters">Liters</label>
                  <input
                    type="number"
                    id="liters"
                    value={liters}
                    onChange={(e) => setLiters(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="fat">Fat</label>
                  <input
                    type="number"
                    id="fat"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                  />
                </div>
                <div className="total-amount">
                  Total Amount: Rs. {totalAmount}
                </div>
                <button className="primary" onClick={handleAddEntry}>Add Entry</button>
              </div>
              {entryError && <p className="error-message">{entryError}</p>}
              {entrySuccess && <p className="success-message">{entrySuccess}</p>}

              <hr />

              {/* Entries History */}
              <h3>Entry History</h3>
              {currentCustomer.entries.length === 0 ? (
                <p>No entries found for this customer.</p>
              ) : (
                <table className="entry-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Liters</th>
                      <th>Fat</th>
                      <th>Amount (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomer.entries.map((entry) => (
                      <tr key={entry.entry_id}>
                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                        <td>{entry.liters} L</td>
                        <td>{entry.fat} %</td>
                        <td>{entry.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Admin Panel (Right Side) */}
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          
          {/* Add Customer Form */}
          <form onSubmit={handleAddCustomer}>
            <h3>Add New Customer</h3>
            <div className="input-group">
              <label htmlFor="adminCustId">Customer ID:</label>
              <input type="text" id="adminCustId" name="customerId" placeholder="E.g., 102" required />
            </div>
            <div className="input-group">
              <label htmlFor="adminCustName">Customer Name:</label>
              <input type="text" id="adminCustName" name="customerName" placeholder="E.g., Suresh Kumar" required />
            </div>
            <div className="input-group">
              <label htmlFor="adminCustMobile">Mobile Number:</label>
              <input type="text" id="adminCustMobile" name="customerMobile" placeholder="E.g., 9876543210" required />
            </div>
            <button type="submit" className="primary">Add Customer</button>
            {adminError && <p className="error-message">{adminError}</p>}
            {adminSuccess && <p className="success-message">{adminSuccess}</p>}
          </form>

          <hr style={{ margin: '20px 0' }} />

          {/* Existing Customers List */}
          <div className="customer-list">
            <h3>Existing Customers</h3>
            {Object.keys(customers).length === 0 ? (
              <p>No customers found in the database.</p>
            ) : (
              <ul>
                {Object.values(customers).map((cust) => (
                  <li key={cust.id}>
                    <span>{cust.name} (ID: {cust.id})</span>
                    <button className="danger" onClick={() => handleRemoveCustomer(cust.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

