/**
 * API Logs Routes
 * Provides endpoints for viewing API usage logs and statistics
 */

import express from 'express';
import { getRecentAPILogs, getAPIUsageStatistics } from '../services/logService.js';

const router = express.Router();

/**
 * Get recent API logs
 * GET /api/logs/recent
 */
router.get('/recent', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const logs = await getRecentAPILogs(limit);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error getting API logs:', error);
    res.status(500).json({ error: 'Failed to retrieve API logs' });
  }
});

/**
 * Get API usage statistics
 * GET /api/logs/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const stats = await getAPIUsageStatistics(days);
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting API stats:', error);
    res.status(500).json({ error: 'Failed to retrieve API statistics' });
  }
});

export default router;