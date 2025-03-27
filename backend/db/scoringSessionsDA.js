const db = require('./index');

const ScoringSessionsDA = {
  /**
   * Create a new scoring scenario
   * @param {Object} scenarioData - Basic scenario info
   * @returns {Promise<Object>} - The created scenario with ID
   */
  async createScenario(scenarioData) {
    const { userId, scenarioName } = scenarioData;
    
    const result = await db.query(
      'INSERT INTO scoring_scenarios (user_id, scenario_name) VALUES ($1, $2) RETURNING *',
      [userId, scenarioName]
    );
    
    return result.rows[0];
  },
  
  /**
   * Add criteria to a scenario
   * @param {Number} scenarioId - ID of the scenario
   * @param {Array} criteria - Array of criteria objects
   * @returns {Promise<Array>} - The created criteria with IDs
   */
  async addCriteria(scenarioId, criteria) {
    // Start a transaction for inserting multiple criteria
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      const insertedCriteria = [];
      
      for (const criterion of criteria) {
        const { criterionId, label, description, scoreLow, scoreMedium, scoreHigh } = criterion;
        
        const result = await client.query(
          `INSERT INTO scoring_criteria 
          (scenario_id, criterion_id, criterion_label, criterion_description, 
           score_low, score_medium, score_high) 
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [scenarioId, criterionId, label, description, scoreLow, scoreMedium, scoreHigh]
        );
        
        insertedCriteria.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
      return insertedCriteria;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
  
  /**
   * Add accounts to a scenario
   * @param {Number} scenarioId - ID of the scenario
   * @param {Array} accounts - Array of account objects
   * @returns {Promise<Array>} - The created accounts with IDs
   */
  async addAccounts(scenarioId, accounts) {
    // Start a transaction for inserting multiple accounts
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      const insertedAccounts = [];
      
      for (const account of accounts) {
        const { accountId, accountName, totalScore, tier } = account;
        
        const result = await client.query(
          `INSERT INTO scoring_accounts 
          (scenario_id, account_id, account_name, total_score, tier) 
          VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [scenarioId, accountId, accountName, totalScore, tier]
        );
        
        insertedAccounts.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
      return insertedAccounts;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
  
  /**
   * Add criterion scores for accounts
   * @param {Array} scores - Array of score objects
   * @returns {Promise<Array>} - The created scores with IDs
   */
  async addAccountScores(scores) {
    // Start a transaction for inserting multiple scores
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      const insertedScores = [];
      
      for (const score of scores) {
        const { accountId, criterionId, scoreLevel, scoreValue } = score;
        
        const result = await client.query(
          `INSERT INTO account_criterion_scores 
          (account_id, criterion_id, score_level, score_value) 
          VALUES ($1, $2, $3, $4) RETURNING *`,
          [accountId, criterionId, scoreLevel, scoreValue]
        );
        
        insertedScores.push(result.rows[0]);
      }
      
      await client.query('COMMIT');
      return insertedScores;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
  
  /**
   * Record an export/sync event
   * @param {Number} scenarioId - ID of the scenario
   * @param {String} exportType - Type of export (csv, salesforce, etc.)
   * @param {Object} details - Additional details about the export
   * @returns {Promise<Object>} - The created export record
   */
  async recordExport(scenarioId, exportType, details = {}) {
    const result = await db.query(
      'INSERT INTO scoring_exports (scenario_id, export_type, export_details) VALUES ($1, $2, $3) RETURNING *',
      [scenarioId, exportType, JSON.stringify(details)]
    );
    
    return result.rows[0];
  },
  
  /**
   * Get all scoring scenarios for a user
   * @param {Number} userId - ID of the user
   * @returns {Promise<Array>} - Array of scenarios
   */
  async getUserScenarios(userId) {
    const result = await db.query(
      `SELECT * FROM scoring_scenarios 
       WHERE user_id = $1 AND status != 'deleted' 
       ORDER BY created_at DESC`,
      [userId]
    );
    
    return result.rows;
  },
  
  /**
   * Get a full scoring scenario with all related data
   * @param {Number} scenarioId - ID of the scenario
   * @returns {Promise<Object>} - Complete scenario data
   */
  async getCompleteScenario(scenarioId) {
    // Get basic scenario info
    const scenarioResult = await db.query(
      'SELECT * FROM scoring_scenarios WHERE id = $1',
      [scenarioId]
    );
    
    if (scenarioResult.rows.length === 0) {
      return null; // Scenario not found
    }
    
    const scenario = scenarioResult.rows[0];
    
    // Get criteria for this scenario
    const criteriaResult = await db.query(
      'SELECT * FROM scoring_criteria WHERE scenario_id = $1',
      [scenarioId]
    );
    
    // Get accounts for this scenario
    const accountsResult = await db.query(
      'SELECT * FROM scoring_accounts WHERE scenario_id = $1',
      [scenarioId]
    );
    
    // Get all account scores
    const accountIds = accountsResult.rows.map(account => account.id);
    let accountScores = [];
    
    if (accountIds.length > 0) {
      const scoresResult = await db.query(
        `SELECT * FROM account_criterion_scores 
         WHERE account_id = ANY($1)`,
        [accountIds]
      );
      
      accountScores = scoresResult.rows;
    }
    
    // Get export history
    const exportsResult = await db.query(
      'SELECT * FROM scoring_exports WHERE scenario_id = $1 ORDER BY export_date DESC',
      [scenarioId]
    );
    
    // Assemble the complete scenario object
    return {
      ...scenario,
      criteria: criteriaResult.rows,
      accounts: accountsResult.rows.map(account => {
        // Find scores for this account
        const scores = accountScores.filter(score => score.account_id === account.id);
        return { ...account, scores };
      }),
      exports: exportsResult.rows
    };
  },
  
  /**
   * Update an existing scoring scenario
   * @param {Number} scenarioId - ID of the scenario
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - The updated scenario
   */
  async updateScenario(scenarioId, updates) {
    const { scenarioName, status } = updates;
    
    const fields = [];
    const values = [];
    let paramCounter = 1;
    
    if (scenarioName !== undefined) {
      fields.push(`scenario_name = $${paramCounter}`);
      values.push(scenarioName);
      paramCounter++;
    }
    
    if (status !== undefined) {
      fields.push(`status = $${paramCounter}`);
      values.push(status);
      paramCounter++;
    }
    
    // Always update the updated_at timestamp
    fields.push(`updated_at = NOW()`);
    
    // Add scenarioId as the last parameter
    values.push(scenarioId);
    
    const result = await db.query(
      `UPDATE scoring_scenarios 
       SET ${fields.join(', ')} 
       WHERE id = $${paramCounter} 
       RETURNING *`,
      values
    );
    
    return result.rows[0];
  },
  
  /**
   * Update scoring criteria for a scenario
   * @param {Number} criterionId - ID of the criterion
   * @param {Object} updates - Score updates
   * @returns {Promise<Object>} - The updated criterion
   */
  async updateCriterion(criterionId, updates) {
    const { scoreLow, scoreMedium, scoreHigh } = updates;
    
    const fields = [];
    const values = [];
    let paramCounter = 1;
    
    if (scoreLow !== undefined) {
      fields.push(`score_low = $${paramCounter}`);
      values.push(scoreLow);
      paramCounter++;
    }
    
    if (scoreMedium !== undefined) {
      fields.push(`score_medium = $${paramCounter}`);
      values.push(scoreMedium);
      paramCounter++;
    }
    
    if (scoreHigh !== undefined) {
      fields.push(`score_high = $${paramCounter}`);
      values.push(scoreHigh);
      paramCounter++;
    }
    
    // Add criterionId as the last parameter
    values.push(criterionId);
    
    const result = await db.query(
      `UPDATE scoring_criteria 
       SET ${fields.join(', ')} 
       WHERE id = $${paramCounter} 
       RETURNING *`,
      values
    );
    
    return result.rows[0];
  },
  
  /**
   * Update an account score
   * @param {Number} accountId - ID of the account
   * @param {Number} criterionId - ID of the criterion
   * @param {Object} updates - Score updates
   * @returns {Promise<Object>} - The updated score
   */
  async updateAccountScore(accountId, criterionId, updates) {
    const { scoreLevel, scoreValue } = updates;
    
    // Check if the score exists
    const checkResult = await db.query(
      'SELECT * FROM account_criterion_scores WHERE account_id = $1 AND criterion_id = $2',
      [accountId, criterionId]
    );
    
    if (checkResult.rows.length === 0) {
      // Insert new score if it doesn't exist
      const insertResult = await db.query(
        `INSERT INTO account_criterion_scores 
        (account_id, criterion_id, score_level, score_value, updated_at) 
        VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [accountId, criterionId, scoreLevel, scoreValue]
      );
      
      return insertResult.rows[0];
    } else {
      // Update existing score
      const updateResult = await db.query(
        `UPDATE account_criterion_scores 
         SET score_level = $1, score_value = $2, updated_at = NOW() 
         WHERE account_id = $3 AND criterion_id = $4 
         RETURNING *`,
        [scoreLevel, scoreValue, accountId, criterionId]
      );
      
      return updateResult.rows[0];
    }
  },
  
  /**
   * Update an account's total score and tier
   * @param {Number} accountId - ID of the account
   * @param {Number} totalScore - New total score
   * @param {String} tier - New tier
   * @returns {Promise<Object>} - The updated account
   */
  async updateAccountTotal(accountId, totalScore, tier) {
    const result = await db.query(
      `UPDATE scoring_accounts 
       SET total_score = $1, tier = $2, updated_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [totalScore, tier, accountId]
    );
    
    return result.rows[0];
  },
  
  /**
   * Delete a scoring scenario (soft delete)
   * @param {Number} scenarioId - ID of the scenario
   * @returns {Promise<Boolean>} - Success flag
   */
  async deleteScenario(scenarioId) {
    const result = await db.query(
      "UPDATE scoring_scenarios SET status = 'deleted', updated_at = NOW() WHERE id = $1",
      [scenarioId]
    );
    
    return result.rowCount > 0;
  },
};

module.exports = ScoringSessionsDA;