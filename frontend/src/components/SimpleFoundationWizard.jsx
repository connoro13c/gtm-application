import React, { useState } from 'react';

const SimpleFoundationWizard = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [scenarioName, setScenarioName] = useState('');
  
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)' }}>
      <div style={{ backgroundColor: '#F34E3F', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Create Scoring Scenario</h2>
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer', padding: 0 }}
        >
          ×
        </button>
      </div>
      
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '20px', margin: '0 0 16px 0' }}>Name Your Scoring Scenario</h3>
        <p style={{ color: '#4A5568', margin: '0 0 24px 0' }}>Give your scenario a descriptive name to easily identify it later.</p>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#2D3748' }}>
            Scenario Name
          </label>
          <input 
            type="text" 
            value={scenarioName} 
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="e.g., Q2 Enterprise Accounts"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              border: '1px solid #CBD5E0', 
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', padding: '16px 24px', backgroundColor: '#F8F8F8', display: 'flex', justifyContent: 'space-between' }}>
        <button 
          onClick={() => onClose()}
          style={{ 
            backgroundColor: 'white',
            color: '#4A5568',
            border: '1px solid #CBD5E0',
            borderRadius: '8px', 
            padding: '10px 20px',
            fontWeight: 500, 
            cursor: 'pointer',
          }}
        >
          Back
        </button>
        
        <button 
          onClick={() => alert('This would advance to the next step in a complete implementation')}
          style={{ 
            backgroundColor: '#F34E3F',
            color: 'white', 
            border: 'none',
            borderRadius: '8px', 
            padding: '12px 24px',
            fontWeight: 600, 
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SimpleFoundationWizard;