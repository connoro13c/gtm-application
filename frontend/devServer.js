const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Check if dist directory exists (production build)
const distDir = path.join(__dirname, 'dist');
const isDistDirExist = fs.existsSync(distDir);

if (isDistDirExist) {
  console.log('Serving production build from dist directory');
  // Serve static files from the dist directory
  app.use(express.static(distDir));
} else {
  console.log('No production build found, serving from root directory');
  // Serve static files from this directory
  app.use(express.static(__dirname));
}

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
  if (isDistDirExist) {
    res.sendFile(path.join(distDir, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (!isDistDirExist) {
    console.log('WARNING: Running without a production build!');
    console.log('For production, run: npm run build');
  }
});