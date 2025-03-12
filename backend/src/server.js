/**
 * Main server file for the GTM Application
 * Sets up Express server with middleware and routes
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
// Import prisma helper to ensure proper initialization
import prisma from './prisma.js';

// Import routes
import accountRoutes from './routes/accounts.js';
import scenarioRoutes from './routes/scenarios.js';
import segmentationRoutes from './routes/segmentation.js';
import insightsRoutes from './routes/insights.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import apiLogsRoutes from './routes/api-logs.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = 5001; // Changed from 5000 to avoid conflicts

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// API routes
app.use('/api/accounts', accountRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/segmentation', segmentationRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/logs', apiLogsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

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
  await prisma.$disconnect();
  process.exit(0);
});

export default app;