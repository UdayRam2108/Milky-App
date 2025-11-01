import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Hum index.css ko import nahi kar rahe hain taaki koi error na aaye
// import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
    