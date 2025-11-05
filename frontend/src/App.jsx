// src/App.js
import React, { useState, useEffect, useRef } from "react";
import heroImg from "./assets/images/farmer-pour.jpg";
import cow1 from "./assets/images/man-feeding.jpg";
import paneer from "./assets/images/paneer.jpg";
import cowRow from "./assets/images/cow-row.jpg";

/* ---------- Styles (single place) ---------- */
const AppStyles = () => (
  <style>{`
    :root {
      --primary-color: #007bff;
      --primary-hover: #0056b3;
      --light-bg: #f8f9fa;
      --border-color: #dee2e6;
      --text-dark: #343a40;
      --text-light: #6c757d;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background: var(--light-bg); color: var(--text-dark); margin:0; padding:20px; }
    .app-container { display:grid; grid-template-columns: 1fr 350px; gap:30px; max-width:1200px; margin:auto; }
    .main-content { display:flex; flex-direction:column; gap:20px; }
    .admin-panel { background:#fff; border-radius:12px; padding:22px; box-shadow:0 10px 30px rgba(0,0,0,0.05); }
    .card { background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
    h2,h3 { color:var(--text-dark); border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-top:0; }
    .input-group { margin-bottom:15px; }
    .input-group label { display:block; margin-bottom:5px; font-weight:600; color:var(--text-light); }
    .input-group input { width:100%; padding:10px; border:1px solid var(--border-color); border-radius:6px; box-sizing:border-box; }
    button { cursor:pointer; border:none; border-radius:6px; }
    button.primary { width:100%; padding:10px; background:var(--primary-color); color:white; font-weight:600; }
    button.primary:hover { background:var(--primary-hover); }
    button.danger { background:#dc3545; color:white; padding:6px 10px; border-radius:6px; }
    .error-message { color:#721c24; background:#f8d7da; padding:10px; border-radius:6px; }
    .success-message { color:#155724; background:#d4edda; padding:10px; border-radius:6px; }

    /* HERO SLIDER */
    .hero-slider { position: relative; border-radius: 14px; overflow: hidden; min-height: 260px; }
    .hero-slide { position:absolute; inset:0; background-size:cover; background-position:center; opacity:0; transform:scale(1.02); transition:opacity .6s ease, transform .6s ease; display:flex; align-items:center; }
    .hero-slide.active { opacity:1; transform:scale(1); z-index:2; }
    .hero-slide .overlay { position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.45)); }
    .hero-slide-content { position:relative; z-index:3; color:#fff; padding:34px; max-width:720px; }
    .hero-slide h1{ margin:0 0 8px; font-size:30px; text-shadow:0 8px 20px rgba(0,0,0,0.6); }
    .hero-slide .lead { margin:0 0 14px; color:rgba(255,255,255,0.95); }
    .hero-dots { position:absolute; left:50%; transform:translateX(-50%); bottom:12px; display:flex; gap:8px; z-index:6; }
    .hero-dots .dot { width:10px; height:10px; border-radius:50%; background:rgba(255,255,255,0.45); border:none; cursor:pointer; transition:transform .18s, background .18s; }
    .hero-dots .dot.active { background:white; transform:scale(1.18); }
    .hero-nav { position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.35); color:white; border:none; width:36px; height:36px; border-radius:8px; z-index:6; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:20px; }
    .hero-nav.prev { left:14px; } .hero-nav.next { right:14px; }

    @media (max-width: 768px) {
      .app-container { grid-template-columns: 1fr; padding:12px; }
    }
  `}</style>
);

/* ---------- HeroSlider (automatic) ---------- */
function HeroSlider({ slides = [], interval = 4000 }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!slides.length) return;
    // start autoplay
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % slides.length), interval);
    return () => clearInterval(timerRef.current);
  }, [slides.length, interval]);

  if (!slides.length) return null;

  return (
    <div className="hero-slider" onMouseEnter={() => clearInterval(timerRef.current)} onMouseLeave={() => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setIndex(i => (i + 1) % slides.length), interval);
    }}>
      {slides.map((s, i) => (
        <div key={i} className={`hero-slide ${i === index ? "active" : ""}`} style={{ backgroundImage: `url(${s.src})` }}>
          <div className="overlay" />
          <div className="hero-slide-content">
            {s.title && <h1>{s.title}</h1>}
            {s.subtitle && <p className="lead">{s.subtitle}</p>}
          </div>
        </div>
      ))}

      <div className="hero-dots" role="tablist" aria-label="Slide dots">
        {slides.map((_, i) => (
          <button key={i} className={`dot ${i === index ? "active" : ""}`} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>

      <button className="hero-nav prev" onClick={() => setIndex(i => (i - 1 + slides.length) % slides.length)} aria-label="Previous">‹</button>
      <button className="hero-nav next" onClick={() => setIndex(i => (i + 1) % slides.length)} aria-label="Next">›</button>
    </div>
  );
}

/* ---------- Main App (admin + customer functionality retained) ---------- */
function App() {
  const API_URL = "http://localhost:3001";

  // hero slides
  const heroSlides = [
    { src: heroImg, title: "Milky App — Fresh dairy from local farms", subtitle: "Track daily milk collection and manage customers." },
    { src: cow1, title: "Trusted Farmers", subtitle: "Handpicked local dairy experts." },
    { src: paneer, title: "Quality Products", subtitle: "Pure milk, paneer, and ghee." },
    { src: cowRow, title: "Daily Supply", subtitle: "Reliable and fresh deliveries." },
  ];

  // Admin & customer states
  const [customers, setCustomers] = useState({});
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchError, setSearchError] = useState("");
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [liters, setLiters] = useState("");
  const [fat, setFat] = useState("");
  const [entryError, setEntryError] = useState("");
  const [entrySuccess, setEntrySuccess] = useState("");

  const totalAmount = (liters > 0 && fat > 0) ? (liters * fat * 0.85).toFixed(2) : 0;

  // fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/customers`);
        const data = await res.json();
        const obj = data.reduce((acc, c) => { acc[c.id] = c; return acc; }, {});
        setCustomers(obj);
      } catch (err) {
        setAdminError("Failed to load customer list from server.");
      }
    };
    fetchCustomers();
  }, []);

  // get one customer's details
  const fetchCustomerData = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_URL}/api/customers/${id}`);
      if (!res.ok) {
        if (res.status === 404) setSearchError(`Customer ID ${id} not found.`);
        else setSearchError("Failed to fetch customer data.");
        setCurrentCustomer(null);
        return;
      }
      const data = await res.json();
      setCurrentCustomer(data);
      setSearchError("");
      setEntryError("");
      setEntrySuccess("");
    } catch (err) {
      setSearchError("Failed to fetch customer data.");
      setCurrentCustomer(null);
    }
  };

  // handlers
  const handleSearch = () => fetchCustomerData(searchId);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newCustomer = { id: form.customerId.value, name: form.customerName.value, mobile: form.customerMobile.value };
    setAdminError(""); setAdminSuccess("");
    try {
      const res = await fetch(`${API_URL}/api/customers`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCustomer) });
      const data = await res.json();
      if (!res.ok) { setAdminError(`Failed to add customer. (${data.error || "Unknown error"})`); }
      else { setAdminSuccess("Customer added successfully!"); form.reset(); // refresh list
        const r = await fetch(`${API_URL}/api/customers`);
        const d = await r.json();
        setCustomers(d.reduce((acc, c) => { acc[c.id] = c; return acc; }, {}));
      }
    } catch (err) {
      setAdminError("Failed to add customer. (Network error)");
    }
  };

  const handleRemoveCustomer = async (id) => {
    const name = customers[id]?.name || id;
    if (!window.confirm(`Are you sure you want to delete ${name} (ID: ${id})?`)) return;
    setAdminError(""); setAdminSuccess("");
    try {
      const res = await fetch(`${API_URL}/api/customers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) setAdminError(`Failed to delete customer ${id}. (${data.error || "Unknown error"})`);
      else { setAdminSuccess(`Customer ${id} deleted successfully.`); // refresh list
        const r = await fetch(`${API_URL}/api/customers`);
        const d = await r.json();
        setCustomers(d.reduce((acc, c) => { acc[c.id] = c; return acc; }, {}));
        if (currentCustomer && currentCustomer.id === id) setCurrentCustomer(null);
      }
    } catch (err) {
      setAdminError(`Failed to delete customer ${id}. (Network error)`);
    }
  };

  const handleAddEntry = async () => {
    setEntryError(""); setEntrySuccess("");
    const litersNum = parseFloat(liters); const fatNum = parseFloat(fat);
    if (isNaN(litersNum) || isNaN(fatNum) || litersNum <= 0 || fatNum <= 0) { setEntryError("Liters and Fat must be positive numbers."); return; }
    const newEntry = { customer_id: currentCustomer.id, liters: litersNum, fat: fatNum, amount: parseFloat(totalAmount) };
    try {
      const res = await fetch(`${API_URL}/api/entries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newEntry) });
      const data = await res.json();
      if (!res.ok) setEntryError(`Failed to add milk entry. (${data.error || "Unknown error"})`);
      else { setEntrySuccess("Entry added successfully!"); setLiters(""); setFat(""); fetchCustomerData(currentCustomer.id); }
    } catch (err) {
      setEntryError("Failed to add milk entry. (Network error)");
    }
  };

  /* ---------- Render ---------- */
  return (
    <>
      <AppStyles />
      <div className="app-container">
        <div className="main-content">
          {/* KEEP only the hero slider here */}
          <HeroSlider slides={heroSlides} interval={4000} />

          {/* Customer Search Card (operation window) */}
          <div className="card">
            <h2>Customer Search</h2>
            <div className="input-group">
              <label htmlFor="customerIdSearch">Customer ID:</label>
              <input type="text" id="customerIdSearch" placeholder="E.g., 101" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
            </div>
            <button className="primary" onClick={handleSearch}>Search</button>
            {searchError && <p className="error-message">{searchError}</p>}
          </div>

          {/* Customer Profile Card */}
          {currentCustomer && (
            <div className="card">
              <h2>Customer Profile</h2>
              <div style={{ marginBottom: 12 }}>
                <p><strong>Customer ID:</strong> {currentCustomer.id}</p>
                <p><strong>Name:</strong> {currentCustomer.name}</p>
                <p><strong>Mobile:</strong> {currentCustomer.mobile}</p>
              </div>

              <hr />

              <h3>Add New Entry</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 10 }}>
                <div className="input-group">
                  <label htmlFor="liters">Liters</label>
                  <input id="liters" type="number" value={liters} onChange={(e) => setLiters(e.target.value)} />
                </div>
                <div className="input-group">
                  <label htmlFor="fat">Fat</label>
                  <input id="fat" type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
                </div>

                <div style={{ gridColumn: "1 / -1", fontSize: "1.1em", fontWeight: 600, color: "var(--primary-color)" }}>
                  Total Amount: Rs. {totalAmount}
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <button className="primary" onClick={handleAddEntry}>Add Entry</button>
                </div>
              </div>

              {entryError && <p className="error-message">{entryError}</p>}
              {entrySuccess && <p className="success-message">{entrySuccess}</p>}

              <hr />

              <h3>Entry History</h3>
              {(!currentCustomer.entries || currentCustomer.entries.length === 0) ? (
                <p>No entries found for this customer.</p>
              ) : (
                <table className="entry-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid var(--border-color)", padding: 10 }}>Date</th>
                      <th style={{ border: "1px solid var(--border-color)", padding: 10 }}>Liters</th>
                      <th style={{ border: "1px solid var(--border-color)", padding: 10 }}>Fat</th>
                      <th style={{ border: "1px solid var(--border-color)", padding: 10 }}>Amount (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomer.entries.map((entry) => (
                      <tr key={entry.entry_id}>
                        <td style={{ border: "1px solid var(--border-color)", padding: 10 }}>{new Date(entry.date).toLocaleDateString()}</td>
                        <td style={{ border: "1px solid var(--border-color)", padding: 10 }}>{entry.liters} L</td>
                        <td style={{ border: "1px solid var(--border-color)", padding: 10 }}>{entry.fat} %</td>
                        <td style={{ border: "1px solid var(--border-color)", padding: 10 }}>{entry.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Admin Panel (operation window) - KEEP THIS */}
        <div className="admin-panel">
          <h2>Admin Panel</h2>

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

          <hr style={{ margin: "20px 0" }} />

          <div className="customer-list">
            <h3>Existing Customers</h3>
            {Object.keys(customers).length === 0 ? (
              <p>No customers found in the database.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {Object.values(customers).map((cust) => (
                  <li key={cust.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderBottom: "1px solid var(--border-color)" }}>
                    <span>{cust.name} (ID: {cust.id})</span>
                    <button className="danger" onClick={() => handleRemoveCustomer(cust.id)}>Remove</button>
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
