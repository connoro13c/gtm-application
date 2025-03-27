import React, { useState, useEffect } from 'react';
import { getUserScenarios, getScenario } from '../services/scoringService';
import './ScoringScenariosList.css';

const ScoringScenariosList = ({ onSelectScenario, onClose }) => {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getUserScenarios();
      if (response.success) {
        setScenarios(response.scenarios);
      } else {
        setError('Error loading scenarios: ' + response.message);
      }
    } catch (err) {
      setError('Failed to load scenarios. Please try again.');
      console.error('Error fetching scenarios:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = async (scenarioId) => {
    if (scenarioId === selectedScenarioId) {
      // If already selected, load the full details
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getScenario(scenarioId);
        if (response.success) {
          onSelectScenario(response.scenario);
          onClose();
        } else {
          setError('Error loading scenario details: ' + response.message);
        }
      } catch (err) {
        setError('Failed to load scenario details. Please try again.');
        console.error('Error fetching scenario details:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Just mark as selected
      setSelectedScenarioId(scenarioId);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="scenarios-list-container">
      <div className="scenarios-list-header">
        <h2>Your Scoring Scenarios</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="scenarios-list-content">
        {isLoading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <p>Loading scenarios...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button className="retry-button" onClick={loadScenarios}>Retry</button>
          </div>
        )}
        
        {!isLoading && !error && scenarios.length === 0 && (
          <div className="empty-state">
            <p>You don't have any saved scoring scenarios yet.</p>
            <button className="create-scenario-button" onClick={onClose}>Create Your First Scenario</button>
          </div>
        )}
        
        {!isLoading && !error && scenarios.length > 0 && (
          <div className="scenarios-grid">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id} 
                className={`scenario-card ${selectedScenarioId === scenario.id ? 'selected' : ''}`}
                onClick={() => handleSelectScenario(scenario.id)}
              >
                <h3>{scenario.scenario_name}</h3>
                <div className="scenario-meta">
                  <span className="date">{formatDate(scenario.created_at)}</span>
                </div>
                <div className="scenario-action">
                  {selectedScenarioId === scenario.id ? (
                    <button className="load-scenario-button">
                      Open Scenario
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  ) : (
                    <span className="card-hint">Click to select</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="scenarios-list-footer">
        <button className="cancel-button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ScoringScenariosList;