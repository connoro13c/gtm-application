import express from 'express';
import WizardSession from '../models/WizardSession.js';

const router = express.Router();

// Create a new session
router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await WizardSession.create({
      userId,
      currentStep: 'data-source'
    });
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get a specific session
router.get('/:id', async (req, res) => {
  try {
    const session = await WizardSession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Get all sessions for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const sessions = await WizardSession.findAll({
      where: { userId },
      order: [['lastUpdated', 'DESC']]
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Update a session
router.put('/:id', async (req, res) => {
  try {
    const session = await WizardSession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    await session.update({
      ...req.body,
      lastUpdated: new Date()
    });
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// Save session as draft
router.put('/:id/draft', async (req, res) => {
  try {
    const session = await WizardSession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    await session.update({
      isDraft: true,
      lastUpdated: new Date()
    });
    res.json(session);
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

// Complete session
router.put('/:id/complete', async (req, res) => {
  try {
    const session = await WizardSession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    await session.update({
      status: 'completed',
      isDraft: false,
      lastUpdated: new Date()
    });
    res.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

// Validate session
router.get('/:id/validate', async (req, res) => {
  try {
    const session = await WizardSession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const validationErrors = [];
    
    // Validate data source
    if (!session.dataSource) {
      validationErrors.push('Data source configuration is missing');
    }
    
    // Validate field selection
    if (!session.selectedFields || 
        !session.selectedFields.identifier?.length || 
        !session.selectedFields.target?.length) {
      validationErrors.push('Required fields are not selected');
    }
    
    // Validate model configuration
    if (!session.modelConfig || !session.modelConfig.type) {
      validationErrors.push('Model configuration is incomplete');
    }
    
    // Validate weights
    if (!session.weights || Object.keys(session.weights).length === 0) {
      validationErrors.push('Scoring weights are not configured');
    }
    
    await session.update({
      validationErrors: validationErrors.length > 0 ? validationErrors : null
    });
    
    res.json({
      isValid: validationErrors.length === 0,
      errors: validationErrors
    });
  } catch (error) {
    console.error('Error validating session:', error);
    res.status(500).json({ error: 'Failed to validate session' });
  }
});

export default router; 