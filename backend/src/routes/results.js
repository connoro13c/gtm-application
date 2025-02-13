import express from 'express';
import ScoringResult from '../models/ScoringResult.js';
import ScoringModel from '../models/ScoringModel.js';

const router = express.Router();

// Create a new scoring result
router.post('/', async (req, res) => {
  try {
    const result = await ScoringResult.create(req.body);
    
    // Update the lastRun timestamp on the associated model
    await ScoringModel.update(
      { lastRun: new Date() },
      { where: { id: result.modelId } }
    );
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating result:', error);
    res.status(500).json({ error: 'Failed to create result' });
  }
});

// Get a specific result
router.get('/:id', async (req, res) => {
  try {
    const result = await ScoringResult.findByPk(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// Get all results for a model
router.get('/model/:modelId', async (req, res) => {
  try {
    const results = await ScoringResult.findAll({
      where: { modelId: req.params.modelId },
      order: [['runDate', 'DESC']]
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get latest result for a model
router.get('/model/:modelId/latest', async (req, res) => {
  try {
    const result = await ScoringResult.findOne({
      where: { modelId: req.params.modelId },
      order: [['runDate', 'DESC']]
    });
    if (!result) {
      return res.status(404).json({ error: 'No results found for this model' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error fetching latest result:', error);
    res.status(500).json({ error: 'Failed to fetch latest result' });
  }
});

// Update result status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, errorDetails } = req.body;
    const result = await ScoringResult.findByPk(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    await result.update({ 
      status,
      errorDetails: errorDetails || null
    });
    res.json(result);
  } catch (error) {
    console.error('Error updating result status:', error);
    res.status(500).json({ error: 'Failed to update result status' });
  }
});

export default router; 