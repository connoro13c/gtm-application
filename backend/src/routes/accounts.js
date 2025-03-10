/**
 * Account routes for the GTM Application
 * Handles all account-related API endpoints
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route GET /api/accounts
 * @desc Get all accounts with optional filtering
 * @access Private
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { segment, territory, search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where = {};
    
    if (segment) {
      where.segmentId = segment;
    }
    
    if (territory) {
      where.territoryId = territory;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Execute query with pagination
    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          segment: true,
          territory: true,
          scores: {
            orderBy: {
              date: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.account.count({ where })
    ]);
    
    res.json({
      accounts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

/**
 * @route GET /api/accounts/:id
 * @desc Get account by ID
 * @access Private
 */
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        segment: true,
        territory: true,
        scores: {
          orderBy: {
            date: 'desc'
          },
          take: 10
        },
        contacts: true
      }
    });
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

/**
 * @route POST /api/accounts
 * @desc Create a new account
 * @access Private
 */
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { name, industry, revenue, employees, website, segmentId, territoryId, contacts, ...accountData } = req.body;
    
    // Validate required fields
    if (!name || !industry) {
      return res.status(400).json({ error: 'Name and industry are required' });
    }
    
    // Create account with nested data
    const account = await prisma.account.create({
      data: {
        name,
        industry,
        revenue,
        employees,
        website,
        ...accountData,
        segment: segmentId ? { connect: { id: segmentId } } : undefined,
        territory: territoryId ? { connect: { id: territoryId } } : undefined,
        contacts: contacts ? {
          createMany: {
            data: contacts
          }
        } : undefined
      },
      include: {
        segment: true,
        territory: true,
        contacts: true
      }
    });
    
    res.status(201).json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

/**
 * @route PUT /api/accounts/:id
 * @desc Update an account
 * @access Private
 */
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { segmentId, territoryId, contacts, ...accountData } = req.body;
    
    // Update account
    const account = await prisma.account.update({
      where: { id },
      data: {
        ...accountData,
        segment: segmentId ? { connect: { id: segmentId } } : undefined,
        territory: territoryId ? { connect: { id: territoryId } } : undefined
      },
      include: {
        segment: true,
        territory: true,
        contacts: true
      }
    });
    
    res.json(account);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

/**
 * @route DELETE /api/accounts/:id
 * @desc Delete an account
 * @access Private
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.account.delete({
      where: { id }
    });
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
