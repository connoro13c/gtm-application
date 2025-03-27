import React, { useState, useEffect } from 'react';
import './AccountScoringWorkflow.css';
import { saveScenario, recordExport } from '../services/scoringService';

const AccountScoringWorkflow = ({ scenarioData, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [scoringRules, setScoringRules] = useState({});
  const [accountScores, setAccountScores] = useState([]);
  const [exportType, setExportType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize scoring rules when component mounts or when criteria changes
  useEffect(() => {
    if (scenarioData?.selectedCriteria) {
      const initialRules = {};
      scenarioData.selectedCriteria.forEach(criterion => {
        initialRules[criterion.id] = {
          low: 10,
          medium: 30,
          high: 50
        };
      });
      setScoringRules(initialRules);
    }
  }, [scenarioData]);
  
  // Initialize account scores when file data changes
  useEffect(() => {
    if (scenarioData?.fileData?.rows && scenarioData.columnMapping) {
      // Extract account data from the file
      const accounts = scenarioData.fileData.rows.map(row => {
        const accountData = {
          id: row[scenarioData.columnMapping.idColumn],
          name: row[scenarioData.columnMapping.nameColumn],
          scores: {}
        };
        
        // Initialize scores as empty for each criterion
        scenarioData.selectedCriteria.forEach(criterion => {
          accountData.scores[criterion.id] = null; // null means not scored yet
        });
        
        return accountData;
      });
      setAccountScores(accounts);
    }
  }, [scenarioData]);
  
  // Handle updating a scoring rule
  const handleRuleUpdate = (criterionId, level, value) => {
    const valueNum = parseInt(value, 10);
    if (isNaN(valueNum) || valueNum < 0 || valueNum > 100) return;
    
    setScoringRules(prevRules => ({
      ...prevRules,
      [criterionId]: {
        ...prevRules[criterionId],
        [level]: valueNum
      }
    }));
  };
  
  // Handle updating an account's score for a specific criterion
  const handleScoreUpdate = (accountIndex, criterionId, level) => {
    setAccountScores(prevScores => {
      const newScores = [...prevScores];
      newScores[accountIndex] = {
        ...newScores[accountIndex],
        scores: {
          ...newScores[accountIndex].scores,
          [criterionId]: level
        }
      };
      return newScores;
    });
  };
  
  // Calculate total score for an account
  const calculateTotalScore = (account) => {
    if (!account || !account.scores) return 0;
    
    let total = 0;
    Object.entries(account.scores).forEach(([criterionId, level]) => {
      if (level && scoringRules[criterionId]) {
        total += scoringRules[criterionId][level];
      }
    });
    
    return total;
  };
  
  // Determine tier based on total score
  const getScoreTier = (score) => {
    if (score >= 100) return { label: 'High', color: '#4CAF50' };
    if (score >= 50) return { label: 'Medium', color: '#FFC107' };
    return { label: 'Low', color: '#F44336' };
  };
  
  // Check if all accounts have been scored
  const areAllAccountsScored = () => {
    return accountScores.every(account => 
      Object.values(account.scores).every(score => score !== null)
    );
  };
  
  // Handle next step action
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };
  
  // Handle back action
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  // Handle export action
  const handleExport = async (type) => {
    setIsLoading(true);
    setExportType(type);
    
    // Prepare export data
    const exportData = accountScores.map(account => {
      const totalScore = calculateTotalScore(account);
      const tier = getScoreTier(totalScore);
      
      const exportItem = {
        AccountID: account.id,
        AccountName: account.name,
        TotalScore: totalScore,
        Tier: tier.label
      };
      
      // Add individual scores
      scenarioData.selectedCriteria.forEach(criterion => {
        const scoreLevel = account.scores[criterion.id];
        const scoreValue = scoreLevel ? scoringRules[criterion.id][scoreLevel] : 0;
        exportItem[criterion.label] = scoreValue;
      });
      
      return exportItem;
    });
    
    try {
      // Prepare account scores for database in the required format
      const accountCriterionScores = [];
      accountScores.forEach(account => {
        scenarioData.selectedCriteria.forEach(criterion => {
          const level = account.scores[criterion.id];
          if (level) {
            accountCriterionScores.push({
              accountId: account.id,
              criterionId: criterion.id,
              level,
              value: scoringRules[criterion.id][level]
            });
          }
        });
      });
      
      // Save the complete scenario to the database
      const savingData = {
        userId: 1, // Default to user 1 for now
        scenarioName: scenarioData.scenarioName,
        criteria: scenarioData.selectedCriteria.map(criterion => ({
          ...criterion,
          scoreLow: scoringRules[criterion.id].low,
          scoreMedium: scoringRules[criterion.id].medium,
          scoreHigh: scoringRules[criterion.id].high
        })),
        accounts: accountScores.map(account => ({
          id: account.id,
          name: account.name,
          totalScore: calculateTotalScore(account),
          tier: getScoreTier(calculateTotalScore(account)).label
        })),
        accountScores: accountCriterionScores,
        exportType: type,
        exportDetails: {
          date: new Date().toISOString(),
          recordCount: accountScores.length
        }
      };
      
      // Save to database
      const saveResult = await saveScenario(savingData);
      console.log('Scenario saved to database:', saveResult);
      
      // Process specific export type
      if (type === 'csv') {
        // Create and download CSV file
        const headers = Object.keys(exportData[0]).join(',');
        const rows = exportData.map(item => Object.values(item).join(','));
        const csvContent = [headers, ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${scenarioData.scenarioName}_scores.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (saveResult.success && saveResult.scenario && saveResult.scenario.id) {
        // Record the specific export type if not CSV (which is already recorded)
        await recordExport(saveResult.scenario.id, type, {
          date: new Date().toISOString(),
          recordCount: accountScores.length
        });
      }
      
      setIsLoading(false);
      onComplete({
        ...scenarioData,
        id: saveResult.success ? saveResult.scenario.id : null,
        scoringRules,
        accountScores: exportData,
        exportType
      });
    } catch (error) {
      console.error('Error during export:', error);
      setIsLoading(false);
      alert('There was an error during export. Please try again.');
    }
  };
  
  // Cancel action
  const handleCancel = () => {
    onCancel();
  };
  
  return (
    <div className="account-scoring-workflow">
      <div className="workflow-header">
        <h2>Score Your Accounts</h2>
        <button className="close-button" onClick={handleCancel}>×</button>
      </div>
      
      <div className="workflow-progress">
        <div className="progress-step">
          <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-label">Define Levels</div>
        </div>
        <div className="progress-connector"></div>
        <div className="progress-step">
          <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className="step-label">Score Accounts</div>
        </div>
        <div className="progress-connector"></div>
        <div className="progress-step">
          <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          <div className="step-label">Review</div>
        </div>
        <div className="progress-connector"></div>
        <div className="progress-step">
          <div className={`step-indicator ${currentStep >= 4 ? 'active' : ''}`}>4</div>
          <div className="step-label">Export</div>
        </div>
      </div>
      
      <div className="workflow-content">
        {currentStep === 1 && (
          <div className="workflow-step">
            <h3>Define Scoring Levels for Each Criterion</h3>
            <p>Assign point values to Low / Medium / High levels for each factor.</p>
            
            <div className="scoring-rules-container">
              {scenarioData?.selectedCriteria?.map(criterion => (
                <div key={criterion.id} className="criterion-rules">
                  <h4>{criterion.label}</h4>
                  <p>{criterion.description}</p>
                  
                  <div className="level-inputs">
                    <div className="level-input">
                      <label>Low</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={scoringRules[criterion.id]?.low || 10} 
                        onChange={(e) => handleRuleUpdate(criterion.id, 'low', e.target.value)}
                      />
                    </div>
                    <div className="level-input">
                      <label>Medium</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={scoringRules[criterion.id]?.medium || 30} 
                        onChange={(e) => handleRuleUpdate(criterion.id, 'medium', e.target.value)}
                      />
                    </div>
                    <div className="level-input">
                      <label>High</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={scoringRules[criterion.id]?.high || 50} 
                        onChange={(e) => handleRuleUpdate(criterion.id, 'high', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="rules-overview">
              <h4>Scoring System</h4>
              <ul>
                <li>Score points are summed across all criteria</li>
                <li>🔴 <strong>Low tier (0-49 points)</strong> - Low priority accounts</li>
                <li>🟡 <strong>Medium tier (50-99 points)</strong> - Medium priority accounts</li>
                <li>🟢 <strong>High tier (100+ points)</strong> - High priority accounts</li>
              </ul>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="workflow-step">
            <h3>Score Each Account</h3>
            <p>Apply your criteria to each account using the dropdowns below. We'll calculate the total score automatically.</p>
            
            <div className="scoring-table-container">
              <table className="scoring-table">
                <thead>
                  <tr>
                    <th>Account Name</th>
                    {scenarioData?.selectedCriteria?.map(criterion => (
                      <th key={criterion.id}>{criterion.label}</th>
                    ))}
                    <th>Total Score</th>
                    <th>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {accountScores.map((account, index) => {
                    const totalScore = calculateTotalScore(account);
                    const tier = getScoreTier(totalScore);
                    
                    return (
                      <tr key={account.id}>
                        <td className="account-name">{account.name}</td>
                        
                        {scenarioData?.selectedCriteria?.map(criterion => (
                          <td key={criterion.id}>
                            <select 
                              value={account.scores[criterion.id] || ''}
                              onChange={(e) => handleScoreUpdate(index, criterion.id, e.target.value)}
                              className={account.scores[criterion.id] ? `level-${account.scores[criterion.id]}` : ''}
                            >
                              <option value="">Select...</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </td>
                        ))}
                        
                        <td className="total-score">{totalScore}</td>
                        <td>
                          <span className="tier-label" style={{ backgroundColor: tier.color }}>
                            {tier.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="scoring-progress">
              <p>
                {areAllAccountsScored() 
                  ? "✅ All accounts have been scored!" 
                  : `${accountScores.filter(account => Object.values(account.scores).every(score => score !== null)).length} of ${accountScores.length} accounts scored`}
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="workflow-step">
            <h3>Review Scores</h3>
            <p>Here's a summary of your account scoring results. Make sure everything looks correct before proceeding.</p>
            
            <div className="score-summary">
              <div className="summary-card">
                <h4>Total Accounts</h4>
                <div className="summary-value">{accountScores.length}</div>
              </div>
              
              <div className="summary-card">
                <h4>High Tier (100+)</h4>
                <div className="summary-value tier-high">
                  {accountScores.filter(account => calculateTotalScore(account) >= 100).length}
                </div>
              </div>
              
              <div className="summary-card">
                <h4>Medium Tier (50-99)</h4>
                <div className="summary-value tier-medium">
                  {accountScores.filter(account => {
                    const score = calculateTotalScore(account);
                    return score >= 50 && score < 100;
                  }).length}
                </div>
              </div>
              
              <div className="summary-card">
                <h4>Low Tier (0-49)</h4>
                <div className="summary-value tier-low">
                  {accountScores.filter(account => calculateTotalScore(account) < 50).length}
                </div>
              </div>
            </div>
            
            <div className="top-accounts">
              <h4>Top Accounts</h4>
              <table className="top-accounts-table">
                <thead>
                  <tr>
                    <th>Account Name</th>
                    <th>Total Score</th>
                    <th>Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {accountScores
                    .slice()
                    .sort((a, b) => calculateTotalScore(b) - calculateTotalScore(a))
                    .slice(0, 5)
                    .map(account => {
                      const totalScore = calculateTotalScore(account);
                      const tier = getScoreTier(totalScore);
                      
                      return (
                        <tr key={account.id}>
                          <td>{account.name}</td>
                          <td>{totalScore}</td>
                          <td>
                            <span className="tier-label" style={{ backgroundColor: tier.color }}>
                              {tier.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="workflow-step">
            <h3>Export Your Results</h3>
            <p>What would you like to do with your scoring results?</p>
            
            <div className="export-options">
              <div className="export-option" onClick={() => handleExport('csv')}>
                <div className="export-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="8" y1="15" x2="16" y2="15"></line>
                  </svg>
                </div>
                <div className="export-details">
                  <h4>Export as CSV</h4>
                  <p>Download a spreadsheet with all account scores</p>
                </div>
              </div>
              
              <div className="export-option" onClick={() => handleExport('salesforce')}>
                <div className="export-icon salesforce">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div className="export-details">
                  <h4>Push to Salesforce</h4>
                  <p>Update Salesforce with account scores and tiers</p>
                </div>
              </div>
              
              <div className="export-option" onClick={() => handleExport('hubspot')}>
                <div className="export-icon hubspot">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="4"></circle>
                    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                    <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                  </svg>
                </div>
                <div className="export-details">
                  <h4>Push to HubSpot</h4>
                  <p>Update HubSpot with account scores and tiers</p>
                </div>
              </div>
            </div>
            
            {isLoading && (
              <div className="export-loading">
                <div className="loading-spinner"></div>
                <p>Processing your {exportType === 'csv' ? 'download' : 'integration'}...</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="workflow-footer">
        <div>
          {currentStep > 1 && (
            <button className="back-button" onClick={handleBack} disabled={isLoading}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          )}
        </div>
        
        <div>
          {currentStep < 4 ? (
            <button 
              className="next-button" 
              onClick={handleNext}
              disabled={
                (currentStep === 2 && !areAllAccountsScored()) ||
                isLoading
              }
            >
              <span className="button-text">Next</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AccountScoringWorkflow;