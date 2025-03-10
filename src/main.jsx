import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Add a global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  document.body.innerHTML += `
    <div style="padding: 20px; background: red; color: white; position: fixed; bottom: 0; left: 0; right: 0; z-index: 10000;">
      <h2>JavaScript Error Detected</h2>
      <p>${event.message}</p>
      <p>at: ${event.filename}:${event.lineno}:${event.colno}</p>
    </div>
  `;
});

// Add a debug element to ensure rendering is working
const DebugElement = () => (
  <div style={{
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    padding: '10px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    borderRadius: '4px',
    zIndex: 9999,
    fontSize: '12px'
  }}>
    Debug: {new Date().toLocaleTimeString()}
  </div>
);

console.log('main.jsx is executing');
console.log('Root element exists:', !!document.getElementById('root'));

try {
  console.log('Attempting to render React application...');
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Router>
        <>
          <App />
          <DebugElement />
        </>
      </Router>
    </React.StrictMode>
  );
  
  console.log('React render call completed');
} catch (error) {
  console.error('Failed to render React application:', error);
  document.body.innerHTML += `
    <div style="padding: 20px; font-family: Arial, sans-serif; background: #ffebee; color: #b71c1c; border: 1px solid #ef9a9a;">
      <h1>React Failed to Load</h1>
      <p>There was an error initializing the application:</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error.message}</pre>
    </div>
  `;
}
