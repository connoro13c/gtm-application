/**
 * AI Routes for GTM Application
 * Provides endpoints for AI-powered functionality
 */

import express from 'express';
import { generateFieldCategorySuggestions } from '../services/aiService.js';

const router = express.Router();

/**
 * Generate field category suggestions
 * POST /api/ai/field-categories
 * @body {Array} fields - Array of field objects with name, dataType, and example values
 * @returns {Object} - Object with field category suggestions
 */
router.post('/field-categories', async (req, res) => {
  console.log('==== AI ENDPOINT CALLED ====');
  console.log('Request received at /api/ai/field-categories');
  try {
    const { fields } = req.body;
    console.log(`Received ${fields?.length || 0} fields for categorization`);
    
    // Validate request
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Request must include a non-empty array of fields' 
      });
    }

    // Generate suggestions
    const suggestions = await generateFieldCategorySuggestions(fields);
    
    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error in field categories endpoint:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: 'Failed to generate field category suggestions' 
    });
  }
});

export default router;