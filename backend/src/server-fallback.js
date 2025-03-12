/**
 * Fallback server file for the GTM Application
 * Can run without Prisma using direct PostgreSQL connection
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = 5001; // Changed from 5000 to avoid conflicts

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic API endpoint for testing
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'operational',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    message: 'Backend is running in fallback mode without Prisma'
  });
});

// Try to initialize the database connection - either Prisma or direct PG
let dbConnection = null;

try {
  // First try to import Prisma
  const prismaPath = path.join(__dirname, 'prisma.js');
  if (fs.existsSync(prismaPath)) {
    console.log('Attempting to use Prisma client...');
    import('./prisma.js')
      .then(module => {
        dbConnection = module.default;
        console.log('Prisma client initialized successfully');
        
        // Add an API endpoint that uses Prisma
        app.get('/api/db-test', async (req, res) => {
          try {
            const result = await dbConnection.$queryRaw`SELECT 1 as connected`;
            res.status(200).json({ success: true, result });
          } catch (error) {
            res.status(500).json({ success: false, error: error.message });
          }
        });
      })
      .catch(err => {
        console.error('Failed to initialize Prisma:', err);
        tryDirectPgConnection();
      });
  } else {
    tryDirectPgConnection();
  }
} catch (error) {
  console.error('Error during initialization:', error);
  tryDirectPgConnection();
}

function tryDirectPgConnection() {
  try {
    console.log('Attempting to use direct PostgreSQL connection...');
    const pgPath = path.join(__dirname, 'db', 'pg.js');
    if (fs.existsSync(pgPath)) {
      import('./db/pg.js')
        .then(module => {
          dbConnection = module.default;
          console.log('Direct PostgreSQL connection initialized');
          
          // Add an API endpoint that uses direct PG
          app.get('/api/db-test', async (req, res) => {
            try {
              const result = await dbConnection.query('SELECT 1 as connected');
              res.status(200).json({ success: true, result: result.rows });
            } catch (error) {
              res.status(500).json({ success: false, error: error.message });
            }
          });
        })
        .catch(err => {
          console.error('Failed to initialize direct PG connection:', err);
        });
    } else {
      console.warn('No database connection mechanism found');
    }
  } catch (error) {
    console.error('Error setting up direct PG connection:', error);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Health check endpoint at http://localhost:${PORT}/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (dbConnection && typeof dbConnection.$disconnect === 'function') {
    await dbConnection.$disconnect();
  }
  process.exit(0);
});

export default app;