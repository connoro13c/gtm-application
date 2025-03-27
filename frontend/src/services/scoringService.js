// Scoring API service

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

/**
 * Save a scoring scenario to the database
 * @param {Object} scenarioData - Complete scoring scenario data
 * @returns {Promise<Object>} API response
 */
export const saveScenario = async (scenarioData) => {
  try {
    const response = await fetch(`${API_URL}/scoring/scenarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scenarioData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error saving scoring scenario:', error);
    throw error;
  }
};

/**
 * Get all scoring scenarios for a user
 * @param {Number} userId - ID of the user
 * @returns {Promise<Object>} API response with scenarios
 */
export const getUserScenarios = async (userId = 1) => {
  try {
    const response = await fetch(`${API_URL}/scoring/scenarios?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching scoring scenarios:', error);
    throw error;
  }
};

/**
 * Get a complete scoring scenario by ID
 * @param {Number} scenarioId - ID of the scenario
 * @returns {Promise<Object>} API response with complete scenario
 */
export const getScenario = async (scenarioId) => {
  try {
    const response = await fetch(`${API_URL}/scoring/scenarios/${scenarioId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching scoring scenario:', error);
    throw error;
  }
};

/**
 * Update a scoring criterion
 * @param {Number} criterionId - ID of the criterion
 * @param {Object} updates - Score updates
 * @returns {Promise<Object>} API response
 */
export const updateCriterion = async (criterionId, updates) => {
  try {
    const response = await fetch(`${API_URL}/scoring/criteria/${criterionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error updating criterion:', error);
    throw error;
  }
};

/**
 * Update an account's score for a criterion
 * @param {Number} accountId - ID of the account
 * @param {Number} criterionId - ID of the criterion
 * @param {Object} updates - Score updates
 * @returns {Promise<Object>} API response
 */
export const updateAccountScore = async (accountId, criterionId, updates) => {
  try {
    const response = await fetch(`${API_URL}/scoring/accounts/${accountId}/criteria/${criterionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error updating account score:', error);
    throw error;
  }
};

/**
 * Record an export/sync event
 * @param {Number} scenarioId - ID of the scenario
 * @param {String} exportType - Type of export (csv, salesforce, etc.)
 * @param {Object} details - Additional details about the export
 * @returns {Promise<Object>} API response
 */
export const recordExport = async (scenarioId, exportType, details = {}) => {
  try {
    const response = await fetch(`${API_URL}/scoring/scenarios/${scenarioId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ exportType, details })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error recording export:', error);
    throw error;
  }
};