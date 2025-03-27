const router = require('express').Router();
const ScoringSessionsDA = require('../db/scoringSessionsDA');

// Helper to handle async route handlers
const asyncHandler = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new scoring scenario with criteria, accounts, and scores
router.post('/scoring/scenarios', asyncHandler(async (req, res) => {
  const { userId, scenarioName, criteria, accounts, accountScores } = req.body;
  
  // 1. Create the scenario
  const scenario = await ScoringSessionsDA.createScenario({
    userId: userId || 1, // Default to user 1 for now
    scenarioName
  });
  
  // 2. Add criteria to the scenario
  const criteriaWithScores = criteria.map(criterion => ({
    criterionId: criterion.id,
    label: criterion.label,
    description: criterion.description,
    scoreLow: criterion.scoreLow || 10,
    scoreMedium: criterion.scoreMedium || 30,
    scoreHigh: criterion.scoreHigh || 50
  }));
  
  const insertedCriteria = await ScoringSessionsDA.addCriteria(
    scenario.id, criteriaWithScores
  );
  
  // 3. Add accounts to the scenario
  const accountsWithScores = accounts.map(account => ({
    accountId: account.id,
    accountName: account.name,
    totalScore: account.totalScore,
    tier: account.tier
  }));
  
  const insertedAccounts = await ScoringSessionsDA.addAccounts(
    scenario.id, accountsWithScores
  );
  
  // 4. Add individual account scores
  if (accountScores && accountScores.length > 0) {
    // Create a mapping from original account IDs to DB account IDs
    const accountIdMap = {};
    insertedAccounts.forEach(account => {
      accountIdMap[account.account_id] = account.id;
    });
    
    // Create a mapping from criterion IDs to DB criterion IDs
    const criterionIdMap = {};
    insertedCriteria.forEach(criterion => {
      criterionIdMap[criterion.criterion_id] = criterion.id;
    });
    
    // Transform account scores to use DB IDs
    const transformedScores = accountScores.map(score => ({
      accountId: accountIdMap[score.accountId],
      criterionId: criterionIdMap[score.criterionId],
      scoreLevel: score.level,
      scoreValue: score.value
    }));
    
    await ScoringSessionsDA.addAccountScores(transformedScores);
  }
  
  // 5. If export type was provided, record it
  if (req.body.exportType) {
    await ScoringSessionsDA.recordExport(
      scenario.id, req.body.exportType, req.body.exportDetails || {}
    );
  }
  
  // Return the complete scenario data
  const completeScenario = await ScoringSessionsDA.getCompleteScenario(scenario.id);
  res.status(201).json({
    success: true,
    message: 'Scoring scenario created successfully',
    scenario: completeScenario
  });
}));

// Get all scoring scenarios for a user
router.get('/scoring/scenarios', asyncHandler(async (req, res) => {
  const userId = req.query.userId || 1; // Default to user 1
  
  const scenarios = await ScoringSessionsDA.getUserScenarios(userId);
  
  res.json({
    success: true,
    scenarios
  });
}));

// Get a complete scoring scenario by ID
router.get('/scoring/scenarios/:id', asyncHandler(async (req, res) => {
  const scenarioId = req.params.id;
  
  const scenario = await ScoringSessionsDA.getCompleteScenario(scenarioId);
  
  if (!scenario) {
    return res.status(404).json({
      success: false,
      message: 'Scoring scenario not found'
    });
  }
  
  res.json({
    success: true,
    scenario
  });
}));

// Update a scoring scenario
router.put('/scoring/scenarios/:id', asyncHandler(async (req, res) => {
  const scenarioId = req.params.id;
  const { scenarioName, status } = req.body;
  
  const updatedScenario = await ScoringSessionsDA.updateScenario(scenarioId, {
    scenarioName,
    status
  });
  
  res.json({
    success: true,
    message: 'Scenario updated successfully',
    scenario: updatedScenario
  });
}));

// Update scoring criteria for a scenario
router.put('/scoring/criteria/:id', asyncHandler(async (req, res) => {
  const criterionId = req.params.id;
  const { scoreLow, scoreMedium, scoreHigh } = req.body;
  
  const updatedCriterion = await ScoringSessionsDA.updateCriterion(criterionId, {
    scoreLow,
    scoreMedium,
    scoreHigh
  });
  
  res.json({
    success: true,
    message: 'Criterion updated successfully',
    criterion: updatedCriterion
  });
}));

// Update an account's score for a specific criterion
router.put('/scoring/accounts/:accountId/criteria/:criterionId', asyncHandler(async (req, res) => {
  const { accountId, criterionId } = req.params;
  const { scoreLevel, scoreValue } = req.body;
  
  const updatedScore = await ScoringSessionsDA.updateAccountScore(
    accountId, criterionId, { scoreLevel, scoreValue }
  );
  
  res.json({
    success: true,
    message: 'Account score updated successfully',
    score: updatedScore
  });
}));

// Update an account's total score and tier
router.put('/scoring/accounts/:accountId', asyncHandler(async (req, res) => {
  const { accountId } = req.params;
  const { totalScore, tier } = req.body;
  
  const updatedAccount = await ScoringSessionsDA.updateAccountTotal(
    accountId, totalScore, tier
  );
  
  res.json({
    success: true,
    message: 'Account score updated successfully',
    account: updatedAccount
  });
}));

// Delete a scoring scenario (soft delete)
router.delete('/scoring/scenarios/:id', asyncHandler(async (req, res) => {
  const scenarioId = req.params.id;
  
  const success = await ScoringSessionsDA.deleteScenario(scenarioId);
  
  if (!success) {
    return res.status(404).json({
      success: false,
      message: 'Scoring scenario not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Scoring scenario deleted successfully'
  });
}));

// Record export/sync event
router.post('/scoring/scenarios/:id/export', asyncHandler(async (req, res) => {
  const scenarioId = req.params.id;
  const { exportType, details } = req.body;
  
  const exportRecord = await ScoringSessionsDA.recordExport(
    scenarioId, exportType, details
  );
  
  res.status(201).json({
    success: true,
    message: `Export to ${exportType} recorded successfully`,
    export: exportRecord
  });
}));

module.exports = router;