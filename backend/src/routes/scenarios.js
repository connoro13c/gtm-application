/**
 * Scenario routes for the GTM Application
 * Handles all scenario-related API endpoints
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/scenarios
 * @desc Get all scenarios
 * @access Private
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const [scenarios, total] = await Promise.all([
      prisma.scenario.findMany({
        skip,
        take: Number(limit),
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.scenario.count()
    ]);
    
    res.json({
      scenarios,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to fetch scenarios' });
  }
});

/**
 * @route GET /api/scenarios/:id
 * @desc Get scenario by ID
 * @access Private
 */
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const scenario = await prisma.scenario.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        parameters: true,
        results: true
      }
    });
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    res.json(scenario);
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({ error: 'Failed to fetch scenario' });
  }
});

/**
 * @route POST /api/scenarios
 * @desc Create a new scenario
 * @access Private
 */
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { name, description, parameters, ...scenarioData } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Create scenario with nested data
    const scenario = await prisma.scenario.create({
      data: {
        name,
        description,
        ...scenarioData,
        createdBy: {
          connect: { id: userId }
        },
        parameters: parameters ? {
          createMany: {
            data: parameters
          }
        } : undefined
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        parameters: true
      }
    });
    
    res.status(201).json(scenario);
  } catch (error) {
    console.error('Error creating scenario:', error);
    res.status(500).json({ error: 'Failed to create scenario' });
  }
});

/**
 * @route PUT /api/scenarios/:id
 * @desc Update a scenario
 * @access Private
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { parameters, ...scenarioData } = req.body;
    
    // Update scenario
    const scenario = await prisma.scenario.update({
      where: { id },
      data: {
        ...scenarioData
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        parameters: true
      }
    });
    
    // Update parameters if provided
    if (parameters) {
      // Delete existing parameters
      await prisma.scenarioParameter.deleteMany({
        where: { scenarioId: id }
      });
      
      // Create new parameters
      await prisma.scenarioParameter.createMany({
        data: parameters.map(param => ({
          ...param,
          scenarioId: id
        }))
      });
      
      // Refresh scenario with updated parameters
      const updatedScenario = await prisma.scenario.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          parameters: true
        }
      });
      
      return res.json(updatedScenario);
    }
    
    res.json(scenario);
  } catch (error) {
    console.error('Error updating scenario:', error);
    res.status(500).json({ error: 'Failed to update scenario' });
  }
});

/**
 * @route DELETE /api/scenarios/:id
 * @desc Delete a scenario
 * @access Private
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete scenario and related data
    await prisma.$transaction([
      prisma.scenarioParameter.deleteMany({ where: { scenarioId: id } }),
      prisma.scenarioResult.deleteMany({ where: { scenarioId: id } }),
      prisma.scenario.delete({ where: { id } })
    ]);
    
    res.json({ message: 'Scenario deleted successfully' });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({ error: 'Failed to delete scenario' });
  }
});

/**
 * @route POST /api/scenarios/:id/run
 * @desc Run a scenario model
 * @access Private
 */
router.post('/:id/run', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get scenario with parameters
    const scenario = await prisma.scenario.findUnique({
      where: { id },
      include: {
        parameters: true
      }
    });
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    // TODO: Implement actual model execution logic
    // This is a placeholder for the ML model integration
    const results = {
      totalAccounts: 1000,
      predictedRevenue: 5000000,
      conversionRate: 0.12,
      timeframe: '6 months',
      segments: [
        { name: 'Enterprise', count: 250, revenue: 2500000 },
        { name: 'Mid-Market', count: 350, revenue: 1750000 },
        { name: 'SMB', count: 400, revenue: 750000 }
      ],
      timestamp: new Date()
    };
    
    // Save results to database
    const scenarioResult = await prisma.scenarioResult.create({
      data: {
        scenario: {
          connect: { id }
        },
        results: results,
        runBy: {
          connect: { id: req.user.id }
        }
      }
    });
    
    // Update scenario last run time
    await prisma.scenario.update({
      where: { id },
      data: {
        lastRunAt: new Date()
      }
    });
    
    res.json({
      message: 'Scenario executed successfully',
      results: scenarioResult
    });
  } catch (error) {
    console.error('Error running scenario:', error);
    res.status(500).json({ error: 'Failed to run scenario' });
  }
});

export default router;
