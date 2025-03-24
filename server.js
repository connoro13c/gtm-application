const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();

// Function to kill processes on port 3000
function killProcessOnPort(port, callback) {
  const command = process.platform === 'win32'
    ? `netstat -ano | findstr :${port} | findstr LISTENING && FOR /F "tokens=5" %p in ('netstat -ano | findstr :${port} | findstr LISTENING') do taskkill /F /PID %p`
    : `lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`;

  console.log(`Attempting to kill processes on port ${port}...`);
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`No existing process found on port ${port} or error killing: ${error.message}`);
    } else if (stderr) {
      console.log(`Error killing process: ${stderr}`);
    } else {
      console.log(`Successfully killed process on port ${port}: ${stdout}`);
    }
    
    // Continue regardless of result
    if (callback) callback();
  });
}

// Detect Firefox browser
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  req.isFirefox = userAgent.toLowerCase().includes('firefox');
  next();
});

// Serve static files from frontend directory
app.use(express.static('frontend'));

// Special route for Firefox users
app.get('/firefox-fix', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'firefox-fix.html'));
});

// Handle SPA routes
app.get('*', (req, res) => {
  // If it's Firefox and trying to access the root route, redirect to the fix page
  if (req.isFirefox && req.path === '/') {
    console.log('Firefox detected, serving special page');
    res.sendFile(path.join(__dirname, 'frontend', 'firefox-fix.html'));
  } else {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
});

const PORT = process.env.PORT || 3000;

// Kill any existing processes on port 3000 before starting server
killProcessOnPort(PORT, () => {
  // Start the server after attempting to kill existing processes
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in both Chrome and Firefox`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is still in use. Please close the application using this port and try again.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
});