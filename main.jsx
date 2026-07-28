import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Ensure the background spans the entire window without white borders
document.body.style.backgroundColor = '#0f172a';
document.body.style.margin = '0';
document.body.style.padding = '0';
document.documentElement.style.backgroundColor = '#0f172a';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

