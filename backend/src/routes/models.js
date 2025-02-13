import express from 'express';
import ScoringModel from '../models/ScoringModel.js';

const router = express.Router();

// Create a new scoring model
router.post('/', async (req, res) => {
  try {
    const model = await ScoringModel.create(req.body);
    res.status(201).json(model);
  } catch (error) {
    console.error('Error creating model:', error);
    res.status(500).json({ error: 'Failed to create model' });
  }
});

// Get a specific model
router.get('/:id', async (req, res) => {
  try {
    const model = await ScoringModel.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    res.json(model);
  } catch (error) {
    console.error('Error fetching model:', error);
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

// Get all models for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const models = await ScoringModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Update a model
router.put('/:id', async (req, res) => {
  try {
    const model = await ScoringModel.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    await model.update(req.body);
    res.json(model);
  } catch (error) {
    console.error('Error updating model:', error);
    res.status(500).json({ error: 'Failed to update model' });
  }
});

// Archive a model
router.put('/:id/archive', async (req, res) => {
  try {
    const model = await ScoringModel.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    await model.update({ status: 'archived' });
    res.json(model);
  } catch (error) {
    console.error('Error archiving model:', error);
    res.status(500).json({ error: 'Failed to archive model' });
  }
});

// Update model version
router.put('/:id/version', async (req, res) => {
  try {
    const model = await ScoringModel.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }
    await model.update({
      version: model.version + 1,
      ...req.body
    });
    res.json(model);
  } catch (error) {
    console.error('Error updating model version:', error);
    res.status(500).json({ error: 'Failed to update model version' });
  }
});

export default router; 