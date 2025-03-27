import React, { useState } from 'react';
import FoundationScenarioWizard from './FoundationScenarioWizard';
import AccountScoringWorkflow from './AccountScoringWorkflow';
import './AccountScoringProcess.css';

const AccountScoringProcess = ({ onClose, initialScenario = null }) => {
  // If initialScenario is provided, start in scoring phase
  const [currentPhase, setCurrentPhase] = useState(initialScenario ? 'scoring' : 'setup'); // 'setup', 'scoring', 'completed'
  const [scenarioData, setScenarioData] = useState(initialScenario);
  const [finalResult, setFinalResult] = useState(null);
  
  // Handle completion of the initial setup phase
  const handleSetupComplete = (data) => {
    setScenarioData(data);
    setCurrentPhase('scoring');
  };
  
  // Handle cancellation of the setup phase
  const handleSetupCancel = () => {
    onClose();
  };
  
  // Handle completion of the scoring workflow
  const handleScoringComplete = (result) => {
    setFinalResult(result);
    setCurrentPhase('completed');
    
    // In a real application, we would send the final result to the backend
    console.log('Final scoring result:', result);
    
    // Notify the parent component
    if (typeof onClose === 'function') {
      onClose(result);
    }
  };
  
  // Handle cancellation of the scoring workflow
  const handleScoringCancel = () => {
    // Go back to setup phase
    setCurrentPhase('setup');
  };
  
  return (
    <div className="account-scoring-process-container">
      {currentPhase === 'setup' && (
        <FoundationScenarioWizard 
          onClose={handleSetupComplete} 
          onCancel={handleSetupCancel}
        />
      )}
      
      {currentPhase === 'scoring' && scenarioData && (
        <AccountScoringWorkflow 
          scenarioData={scenarioData}
          onComplete={handleScoringComplete}
          onCancel={handleScoringCancel}
        />
      )}
      
      {currentPhase === 'completed' && (
        <div className="process-completed">
          <div className="completion-checkmark">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>Scoring Complete!</h2>
          <p>Your accounts have been scored and the data has been {finalResult?.exportType === 'csv' ? 'exported' : 'synced'}.</p>
          <button className="done-button" onClick={() => onClose(finalResult)}>Done</button>
        </div>
      )}
    </div>
  );
};

export default AccountScoringProcess;