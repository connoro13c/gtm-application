/**
 * Segmentation routes for the GTM Application
 * Handles all segmentation-related API endpoints
 */

import express from 'express';
import prisma from '../prisma.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/segmentation/segments
 * @desc Get all segments
 * @access Private
 */
router.get('/segments', authenticateJWT, async (req, res) => {
  try {
    const segments = await prisma.segment.findMany({
      include: {
        _count: {
          select: { accounts: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(segments);
  } catch (error) {
    console.error('Error fetching segments:', error);
    res.status(500).json({ error: 'Failed to fetch segments' });
  }
});

/**
 * @route GET /api/segmentation/segments/:id
 * @desc Get segment by ID
 * @access Private
 */
router.get('/segments/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const segment = await prisma.segment.findUnique({
      where: { id },
      include: {
        accounts: {
          take: 10,
          include: {
            scores: {
              orderBy: {
                date: 'desc'
              },
              take: 1
            }
          }
        },
        _count: {
          select: { accounts: true }
        }
      }
    });
    
    if (!segment) {
      return res.status(404).json({ error: 'Segment not found' });
    }
    
    res.json(segment);
  } catch (error) {
    console.error('Error fetching segment:', error);
    res.status(500).json({ error: 'Failed to fetch segment' });
  }
});

/**
 * @route POST /api/segmentation/segments
 * @desc Create a new segment
 * @access Private
 */
router.post('/segments', authenticateJWT, async (req, res) => {
  try {
    const { name, description, criteria, color } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Create segment
    const segment = await prisma.segment.create({
      data: {
        name,
        description,
        criteria,
        color
      }
    });
    
    res.status(201).json(segment);
  } catch (error) {
    console.error('Error creating segment:', error);
    res.status(500).json({ error: 'Failed to create segment' });
  }
});

/**
 * @route PUT /api/segmentation/segments/:id
 * @desc Update a segment
 * @access Private
 */
router.put('/segments/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, criteria, color } = req.body;
    
    // Update segment
    const segment = await prisma.segment.update({
      where: { id },
      data: {
        name,
        description,
        criteria,
        color
      }
    });
    
    res.json(segment);
  } catch (error) {
    console.error('Error updating segment:', error);
    res.status(500).json({ error: 'Failed to update segment' });
  }
});

/**
 * @route DELETE /api/segmentation/segments/:id
 * @desc Delete a segment
 * @access Private
 */
router.delete('/segments/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if segment has associated accounts
    const accountCount = await prisma.account.count({
      where: { segmentId: id }
    });
    
    if (accountCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete segment with associated accounts',
        accountCount
      });
    }
    
    // Delete segment
    await prisma.segment.delete({
      where: { id }
    });
    
    res.json({ message: 'Segment deleted successfully' });
  } catch (error) {
    console.error('Error deleting segment:', error);
    res.status(500).json({ error: 'Failed to delete segment' });
  }
});

/**
 * @route POST /api/segmentation/auto-segment
 * @desc Auto-segment accounts based on criteria
 * @access Private
 */
router.post('/auto-segment', authenticateJWT, async (req, res) => {
  try {
    const { criteria } = req.body;
    
    if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
      return res.status(400).json({ error: 'Valid segmentation criteria are required' });
    }
    
    // TODO: Implement actual segmentation logic
    // This is a placeholder for the ML-based segmentation
    
    // For demonstration, we'll create a simple segmentation based on revenue
    const segments = [
      { name: 'Enterprise', criteria: { revenue: { gte: 1000000 } } },
      { name: 'Mid-Market', criteria: { revenue: { gte: 100000, lt: 1000000 } } },
      { name: 'SMB', criteria: { revenue: { lt: 100000 } } }
    ];
    
    // Create segments if they don't exist
    for (const segment of segments) {
      await prisma.segment.upsert({
        where: { name: segment.name },
        update: {},
        create: {
          name: segment.name,
          description: `Auto-generated ${segment.name} segment`,
          criteria: segment.criteria,
          color: segment.name === 'Enterprise' ? '#36B37E' : 
                 segment.name === 'Mid-Market' ? '#FFAB00' : '#FF5630'
        }
      });
    }
    
    // Assign accounts to segments based on criteria
    const enterpriseSegment = await prisma.segment.findUnique({ where: { name: 'Enterprise' } });
    const midMarketSegment = await prisma.segment.findUnique({ where: { name: 'Mid-Market' } });
    const smbSegment = await prisma.segment.findUnique({ where: { name: 'SMB' } });
    
    // Update Enterprise accounts
    await prisma.account.updateMany({
      where: { revenue: { gte: 1000000 } },
      data: { segmentId: enterpriseSegment.id }
    });
    
    // Update Mid-Market accounts
    await prisma.account.updateMany({
      where: { 
        revenue: { gte: 100000, lt: 1000000 }
      },
      data: { segmentId: midMarketSegment.id }
    });
    
    // Update SMB accounts
    await prisma.account.updateMany({
      where: { revenue: { lt: 100000 } },
      data: { segmentId: smbSegment.id }
    });
    
    // Get counts for response
    const enterpriseCount = await prisma.account.count({ where: { segmentId: enterpriseSegment.id } });
    const midMarketCount = await prisma.account.count({ where: { segmentId: midMarketSegment.id } });
    const smbCount = await prisma.account.count({ where: { segmentId: smbSegment.id } });
    
    res.json({
      message: 'Auto-segmentation completed successfully',
      segments: [
        { id: enterpriseSegment.id, name: 'Enterprise', count: enterpriseCount },
        { id: midMarketSegment.id, name: 'Mid-Market', count: midMarketCount },
        { id: smbSegment.id, name: 'SMB', count: smbCount }
      ]
    });
  } catch (error) {
    console.error('Error performing auto-segmentation:', error);
    res.status(500).json({ error: 'Failed to perform auto-segmentation' });
  }
});

export default router;
