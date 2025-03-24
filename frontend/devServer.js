const express = require('express');
const path = require('path');
const app = express();

// Serve static files from this directory
app.use(express.static(__dirname));

// Simple logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Special simplified route for testing
app.get('/test', (req, res) => {
  res.send('Server is working properly!');
});

// For all other routes, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});