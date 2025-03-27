import React, { useState, useEffect } from 'react';
import './FoundationScenarioWizard.css';

const FoundationScenarioWizard = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [scenarioName, setScenarioName] = useState('');
  const [accountFile, setAccountFile] = useState(null);
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [fileError, setFileError] = useState('');
  const [filePreviewData, setFilePreviewData] = useState(null);
  const [selectedIdColumn, setSelectedIdColumn] = useState(null);
  const [selectedNameColumn, setSelectedNameColumn] = useState(null);
  const [suggestedIdColumn, setSuggestedIdColumn] = useState(null);
  const [suggestedNameColumn, setSuggestedNameColumn] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [selectionMode, setSelectionMode] = useState(null); // 'id' or 'name' or null
  const [validationMessage, setValidationMessage] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null); // 'success', 'warning', or 'error'
  
  const criteriaOptions = [
    { id: 'industry_fit', label: 'Industry fit', description: 'How well the account matches your target industries' },
    { id: 'company_size', label: 'Company size', description: 'The size of the company (employees, revenue)' },
    { id: 'buyer_persona', label: 'Buyer persona match', description: 'Presence of key decision makers or influencers' },
    { id: 'recent_engagement', label: 'Recent engagement', description: 'Recent interactions with your content or team' },
    { id: 'timing_urgency', label: 'Timing / urgency', description: 'Signs the account is ready to make a purchase decision' },
    { id: 'strategic_interest', label: 'Strategic interest', description: 'Alignment with your strategic growth areas' },
    { id: 'competitive_presence', label: 'Competitive presence', description: 'Whether competitors are present in the account' },
    { id: 'budget_availability', label: 'Budget availability', description: 'Evidence of available budget for your solution' }
  ];

  const validateStep = () => {
    if (currentStep === 1 && !scenarioName.trim()) {
      return false;
    }
    if (currentStep === 2) {
      if (!accountFile) {
        setFileError('Please upload an account list file');
        return false;
      }
      if (!selectedIdColumn || !selectedNameColumn) {
        setFileError('Please select both Account ID and Account Name columns');
        return false;
      }
    }
    if (currentStep === 3 && selectedCriteria.length < 3) {
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        // Only proceed if we're on a step where Next is available and enabled
        if (currentStep < 4) {
          // Check if button would be enabled
          const isDisabled = 
            (currentStep === 1 && !scenarioName.trim()) || 
            (currentStep === 2 && (!accountFile || !selectedIdColumn || !selectedNameColumn)) ||
            (currentStep === 3 && selectedCriteria.length < 3);
          
          if (!isDisabled) {
            handleNext();
          }
        } else if (currentStep === 4) {
          handleComplete();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, scenarioName, accountFile, selectedIdColumn, selectedNameColumn, selectedCriteria]);

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is CSV or Excel
      if (file.type === 'text/csv' || 
          file.type === 'application/vnd.ms-excel' || 
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        setAccountFile(file);
        setFileError('');
        
        // Parse file for preview
        parseFileForPreview(file);
      } else {
        setFileError('Please upload a CSV or Excel file');
        setAccountFile(null);
        setFilePreviewData(null);
      }
    }
  };
  
  const parseFileForPreview = (file) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // For CSV files
        if (file.type === 'text/csv') {
          const text = event.target.result;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(header => header.trim());
          
          // Get first 10 rows or fewer if file has fewer rows
          const rows = [];
          for (let i = 1; i < Math.min(lines.length, 11); i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',').map(value => value.trim());
              const row = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || '';
              });
              rows.push(row);
            }
          }
          
          setFilePreviewData({ headers, rows });
          
          // Enhanced column analysis
          analyzeColumns(headers, rows);
          
        } 
        // For Excel files, we'd need to use a library like SheetJS/xlsx
        // For simplicity, I'll just show a placeholder here
        else {
          setFilePreviewData({
            headers: ['Sample Column 1', 'Sample Column 2', 'Sample Column 3'],
            rows: [{ 'Sample Column 1': 'Sample data', 'Sample Column 2': 'Sample data', 'Sample Column 3': 'Sample data' }]
          });
          alert('Excel parsing would require an additional library. For now, we recommend using CSV files.');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        setFileError('Error parsing file. Please check the format.');
        setFilePreviewData(null);
      }
    };
    
    reader.onerror = () => {
      setFileError('Error reading file');
      setFilePreviewData(null);
    };
    
    if (file.type === 'text/csv') {
      reader.readAsText(file);
    } else {
      // For Excel files
      reader.readAsArrayBuffer(file);
    }
  };
  
  const analyzeColumns = (headers, rows) => {
    // Score system for column analysis
    const columnScores = {};
    
    // Initialize scores
    headers.forEach(header => {
      columnScores[header] = {
        idScore: 0,
        nameScore: 0,
        uniqueValues: new Set(),
        emptyValues: 0,
        values: []
      };
    });
    
    // Analyze each column
    rows.forEach(row => {
      headers.forEach(header => {
        const value = row[header];
        columnScores[header].values.push(value);
        
        if (value && value.trim()) {
          columnScores[header].uniqueValues.add(value);
        } else {
          columnScores[header].emptyValues++;
        }
      });
    });
    
    // Score for ID columns
    headers.forEach(header => {
      const data = columnScores[header];
      const headerLower = header.toLowerCase();
      
      // Name-based scoring for ID
      if (headerLower.includes('id') || headerLower.includes('identifier')) {
        data.idScore += 20;
      }
      if (headerLower.includes('account') && headerLower.includes('id')) {
        data.idScore += 30; // Even stronger match
      }
      
      // Uniqueness scoring
      const uniquenessRatio = data.uniqueValues.size / Math.max(1, rows.length);
      data.idScore += uniquenessRatio * 30; // Unique values are good for IDs
      
      // Pattern recognition
      const hasSpecialFormat = data.values.some(v => 
        (v && typeof v === 'string' && 
         (v.includes('-') || // UUID-like
          /^[A-Za-z0-9]+$/.test(v) || // Alphanumeric
          v.length > 8)) // Longer values likely to be IDs
      );
      if (hasSpecialFormat) data.idScore += 10;
      
      // Empty values are bad for IDs
      if (data.emptyValues > 0) {
        data.idScore -= (data.emptyValues / rows.length) * 20;
      }
    });
    
    // Score for Name columns
    headers.forEach(header => {
      const data = columnScores[header];
      const headerLower = header.toLowerCase();
      
      // Name-based scoring
      if (headerLower.includes('name')) {
        data.nameScore += 20;
      }
      if (headerLower.includes('account') && headerLower.includes('name')) {
        data.nameScore += 30; // Even stronger match
      }
      if (headerLower.includes('company') || headerLower.includes('organization')) {
        data.nameScore += 25;
      }
      
      // Uniqueness (names can repeat, but not too much)
      const uniquenessRatio = data.uniqueValues.size / Math.max(1, rows.length);
      if (uniquenessRatio > 0.5 && uniquenessRatio < 1.0) {
        data.nameScore += 15; // Some uniqueness, but not total
      }
      
      // Pattern recognition for names
      const hasNameFormat = data.values.some(v => 
        (v && typeof v === 'string' && 
         (/[A-Z][a-z]+/.test(v) || // Capitalized words
          v.includes(' ') || // Multi-word names
          v.includes('.') || // Domain names
          v.includes(',') || // Company names with commas
          v.length > 3)) // Not too short
      );
      if (hasNameFormat) data.nameScore += 15;
      
      // Empty values reduce score
      if (data.emptyValues > 0) {
        data.nameScore -= (data.emptyValues / rows.length) * 15;
      }
    });
    
    // Find best columns
    const bestIdColumn = headers.reduce((best, current) => 
      columnScores[current].idScore > columnScores[best].idScore ? current : best, headers[0]);
      
    const bestNameColumn = headers.reduce((best, current) => 
      columnScores[current].nameScore > columnScores[best].nameScore ? current : best, headers[0]);
    
    // Only suggest if score is above threshold
    const idConfidence = columnScores[bestIdColumn].idScore;
    const nameConfidence = columnScores[bestNameColumn].nameScore;
    
    // Store analysis metadata for validation messages
    headers.forEach(header => {
      columnScores[header].isUnique = 
        columnScores[header].uniqueValues.size === rows.length;
      columnScores[header].hasDuplicates = 
        columnScores[header].uniqueValues.size < rows.length && 
        columnScores[header].uniqueValues.size > 0;
      columnScores[header].hasEmptyValues = 
        columnScores[header].emptyValues > 0;
    });
    
    // Set suggestions if confidence is high enough
    if (idConfidence > 30) {
      setSuggestedIdColumn(bestIdColumn);
    }
    
    if (nameConfidence > 30 && bestNameColumn !== bestIdColumn) {
      setSuggestedNameColumn(bestNameColumn);
    }
    
    // If both suggestions are good, show the suggestion UI
    if (idConfidence > 30 && nameConfidence > 30 && bestNameColumn !== bestIdColumn) {
      setSuggestedIdColumn(bestIdColumn);
      setSuggestedNameColumn(bestNameColumn);
      setShowSuggestion(true);
    } else {
      // Otherwise, go directly to manual selection
      setSelectionMode('id');
    }
    
    // Store analysis for validation feedback
    window.columnAnalysis = columnScores;
  };
  
  const handleColumnSelection = (columnName, type) => {
    if (type === 'id') {
      setSelectedIdColumn(columnName);
      validateColumnSelection(columnName, 'id');
      
      // If ID is selected and we're in ID mode, switch to Name mode if Name isn't selected yet
      if (selectionMode === 'id' && !selectedNameColumn) {
        setSelectionMode('name');
      } else if (selectedNameColumn) {
        setSelectionMode(null); // Both selected, exit selection mode
      }
    } else if (type === 'name') {
      setSelectedNameColumn(columnName);
      validateColumnSelection(columnName, 'name');
      
      // If Name is selected and we're in Name mode, switch to ID mode if ID isn't selected yet
      if (selectionMode === 'name' && !selectedIdColumn) {
        setSelectionMode('id');
      } else if (selectedIdColumn) {
        setSelectionMode(null); // Both selected, exit selection mode
      }
    }
  };
  
  const validateColumnSelection = (columnName, type) => {
    const analysis = window.columnAnalysis?.[columnName];
    if (!analysis) return;
    
    if (type === 'id') {
      if (analysis.isUnique) {
        setValidationMessage('✓ Good choice! This column has unique values for each row.');
        setValidationStatus('success');
      } else if (analysis.hasDuplicates) {
        setValidationMessage('⚠️ This column has duplicate values. IDs should be unique.');
        setValidationStatus('warning');
      } else if (analysis.hasEmptyValues) {
        setValidationMessage('⚠️ This column has empty values which may cause issues later.');
        setValidationStatus('warning');
      } else {
        setValidationMessage(null);
        setValidationStatus(null);
      }
    } else if (type === 'name') {
      if (analysis.hasEmptyValues) {
        setValidationMessage('⚠️ This column has empty values. All accounts should have names.');
        setValidationStatus('warning');
      } else {
        setValidationMessage('✓ Column selected for account names.');
        setValidationStatus('success');
      }
    }
    
    // Clear validation message after 5 seconds
    setTimeout(() => {
      setValidationMessage(null);
      setValidationStatus(null);
    }, 5000);
  };
  
  const handleSuggestionResponse = (accept) => {
    if (accept) {
      // Accept suggestions
      setSelectedIdColumn(suggestedIdColumn);
      setSelectedNameColumn(suggestedNameColumn);
      validateColumnSelection(suggestedIdColumn, 'id');
      validateColumnSelection(suggestedNameColumn, 'name');
      setSelectionMode(null); // Exit selection mode
    } else {
      // Reject suggestions, go to manual selection
      setSelectionMode('id');
    }
    setShowSuggestion(false);
  };

  const toggleCriterion = (criterionId) => {
    if (selectedCriteria.includes(criterionId)) {
      setSelectedCriteria(selectedCriteria.filter(id => id !== criterionId));
    } else {
      // Limit to 5 criteria
      if (selectedCriteria.length < 5) {
        setSelectedCriteria([...selectedCriteria, criterionId]);
      }
    }
  };

  const handleComplete = () => {
    // In a real application, this would send data to the backend
    // and create the scoring scenario
    const scenarioData = {
      scenarioName,
      accountFile,
      fileData: filePreviewData,
      columnMapping: {
        idColumn: selectedIdColumn,
        nameColumn: selectedNameColumn
      },
      selectedCriteria: selectedCriteria.map(id => 
        criteriaOptions.find(option => option.id === id)
      ),
      createdAt: new Date().toISOString(),
      status: 'pending' // Initial status before scoring
    };
    
    console.log('Saving scenario:', scenarioData);
    
    // Pass the scenario data to the parent component to proceed to scoring workflow
    if (typeof onClose === 'function') {
      onClose(scenarioData);
    }
  };

  // Handle component mounting
  useEffect(() => {
    console.log('Wizard mounted');
    return () => console.log('Wizard unmounted');
  }, []);
  
  return (
    <div className="foundation-wizard-container" style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
      <div className="wizard-header">
        <h2>Create Scoring Scenario</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
        
      <div className="wizard-progress">
        <div className="progress-step">
          <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-label">Basics</div>
        </div>
        <div className="progress-connector"></div>
        <div className="progress-step">
          <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className="step-label">Accounts</div>
        </div>
        <div className="progress-connector"></div>
        <div className="progress-step">
          <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          <div className="step-label">Criteria</div>
        </div>
        <div className="progress-connector"></div>
        <div className="progress-step">
          <div className={`step-indicator ${currentStep >= 4 ? 'active' : ''}`}>4</div>
          <div className="step-label">Review</div>
        </div>
      </div>
        
      <div className="wizard-content">
          {currentStep === 1 && (
            <div className="wizard-step">
              <h3>Name Your Scoring Scenario</h3>
              <p>Give your scenario a descriptive name to easily identify it later.</p>
              
              <div className="form-group">
                <label htmlFor="scenarioName">Scenario Name</label>
                <input 
                  type="text" 
                  id="scenarioName" 
                  value={scenarioName} 
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g., Q2 Enterprise Accounts"
                  className="form-input"
                />
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="wizard-step">
              <h3>Upload Account List</h3>
              <p>Upload a list of accounts as a CSV or Excel file. We just need an Account ID and Name to get started.</p>
              
              {!filePreviewData ? (
                <div className="file-upload-container">
                  <div className="file-upload-area" onClick={() => document.getElementById('accountFile').click()}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>Drag & drop your file here or click to browse</p>
                    <span className="file-format-note">Supported formats: CSV, Excel</span>
                    <input 
                      type="file" 
                      id="accountFile" 
                      onChange={handleFileChange} 
                      accept=".csv,.xls,.xlsx"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="file-preview-container">
                  <div className="file-preview-header">
                    <h4>Preview of {accountFile.name}</h4>
                    <button className="change-file-button" onClick={() => {
                      setFilePreviewData(null);
                      setSelectedIdColumn(null);
                      setSelectedNameColumn(null);
                      setAccountFile(null);
                      setShowSuggestion(false);
                      setSelectionMode(null);
                      setValidationMessage(null);
                      setValidationStatus(null);
                    }}>
                      Change File
                    </button>
                  </div>
                  
                  {/* Column Selection Legend */}
                  <div className="column-selection-legend">
                    <div className="legend-item id-legend">
                      <div className="legend-color id-color"></div>
                      <span>Account ID - Must be unique for each account</span>
                    </div>
                    <div className="legend-item name-legend">
                      <div className="legend-color name-color"></div>
                      <span>Account Name - Used for display and reporting</span>
                    </div>
                  </div>
                  
                  {/* Suggestion UI */}
                  {showSuggestion && (
                    <div className="suggestion-container">
                      <div className="suggestion-content">
                        <h4>We analyzed your data</h4>
                        <p>We think <strong className="suggested-column id-suggestion">{suggestedIdColumn}</strong> is your Account ID column and <strong className="suggested-column name-suggestion">{suggestedNameColumn}</strong> is your Account Name column.</p>
                        <p>Is this correct?</p>
                        <div className="suggestion-actions">
                          <button 
                            className="suggestion-accept" 
                            onClick={() => handleSuggestionResponse(true)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Yes, use these columns
                          </button>
                          <button 
                            className="suggestion-reject" 
                            onClick={() => handleSuggestionResponse(false)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            No, I'll select manually
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Selection Mode Instructions */}
                  {!showSuggestion && selectionMode && (
                    <div className={`selection-instructions ${selectionMode}-selection`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="8"></line>
                      </svg>
                      <p>
                        {selectionMode === 'id' 
                          ? 'Please click on the column that contains your unique Account IDs.' 
                          : 'Now, please select the column that contains your Account Names.'}
                      </p>
                    </div>
                  )}
                  
                  {/* Validation Feedback */}
                  {validationMessage && (
                    <div className={`validation-message ${validationStatus}`}>
                      <p>{validationMessage}</p>
                    </div>
                  )}
                  
                  {/* Data Preview Table */}
                  <div className="data-preview-table">
                    <h4>Data Preview (First 10 Rows)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            {filePreviewData.headers.map(header => {
                              const isIdColumn = selectedIdColumn === header;
                              const isNameColumn = selectedNameColumn === header;
                              const isIdSuggestion = showSuggestion && suggestedIdColumn === header;
                              const isNameSuggestion = showSuggestion && suggestedNameColumn === header;
                              const isSelectionModeId = selectionMode === 'id';
                              const isSelectionModeName = selectionMode === 'name';
                              const isNotSelected = !isIdColumn && !isNameColumn;
                              const isDimmed = 
                                (showSuggestion && !isIdSuggestion && !isNameSuggestion) ||
                                (isSelectionModeId && !isIdColumn && selectedIdColumn) ||
                                (isSelectionModeName && !isNameColumn && selectedNameColumn);
                              
                              return (
                                <th 
                                  key={header} 
                                  className={`
                                    ${isIdColumn ? 'selected-id-column' : ''} 
                                    ${isNameColumn ? 'selected-name-column' : ''}
                                    ${isDimmed ? 'dimmed-column' : ''}
                                    ${isIdSuggestion ? 'suggested-id-column' : ''}
                                    ${isNameSuggestion ? 'suggested-name-column' : ''}
                                    ${(isSelectionModeId && isNotSelected) ? 'clickable-column' : ''}
                                    ${(isSelectionModeName && isNotSelected) ? 'clickable-column' : ''}
                                  `}
                                  onClick={() => {
                                    if (selectionMode && isNotSelected) {
                                      handleColumnSelection(header, selectionMode);
                                    }
                                  }}
                                >
                                  {header}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {filePreviewData.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {filePreviewData.headers.map(header => {
                                const isIdColumn = selectedIdColumn === header;
                                const isNameColumn = selectedNameColumn === header;
                                const isIdSuggestion = showSuggestion && suggestedIdColumn === header;
                                const isNameSuggestion = showSuggestion && suggestedNameColumn === header;
                                const isDimmed = 
                                  (showSuggestion && !isIdSuggestion && !isNameSuggestion) ||
                                  (selectionMode === 'id' && !isIdColumn && selectedIdColumn) ||
                                  (selectionMode === 'name' && !isNameColumn && selectedNameColumn);
                                
                                return (
                                  <td 
                                    key={`${rowIndex}-${header}`} 
                                    className={`
                                      ${isIdColumn ? 'selected-id-column' : ''} 
                                      ${isNameColumn ? 'selected-name-column' : ''}
                                      ${isDimmed ? 'dimmed-column' : ''}
                                      ${isIdSuggestion ? 'suggested-id-column' : ''}
                                      ${isNameSuggestion ? 'suggested-name-column' : ''}
                                    `}
                                  >
                                    {row[header] || ''}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Selected Column Summary */}
                  {(selectedIdColumn || selectedNameColumn) && !showSuggestion && (
                    <div className="column-selection-summary">
                      <h4>Selected Columns</h4>
                      <div className="selection-summary">
                        {selectedIdColumn && (
                          <div className="summary-item">
                            <span className="summary-label">Account ID:</span>
                            <span className="summary-value id-value">{selectedIdColumn}</span>
                          </div>
                        )}
                        {selectedNameColumn && (
                          <div className="summary-item">
                            <span className="summary-label">Account Name:</span>
                            <span className="summary-value name-value">{selectedNameColumn}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {fileError && <div className="file-error">{fileError}</div>}
              
              {!filePreviewData && (
                <div className="required-columns">
                  <h4>Required Columns</h4>
                  <ul>
                    <li>Account ID</li>
                    <li>Account Name</li>
                  </ul>
                  <p className="column-note">Additional columns will be preserved but aren't required for scoring.</p>
                </div>
              )}
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="wizard-step">
              <h3>Select Key Criteria</h3>
              <p>Choose 3–5 criteria you use to evaluate accounts. These are judgment-based and require no data science.</p>
              
              <div className="criteria-selection">
                {criteriaOptions.map(criterion => (
                  <div 
                    key={criterion.id} 
                    className={`criterion-card ${selectedCriteria.includes(criterion.id) ? 'selected' : ''}`}
                    onClick={() => toggleCriterion(criterion.id)}
                  >
                    <div className="criterion-header">
                      <div className="criterion-name">{criterion.label}</div>
                      {selectedCriteria.includes(criterion.id) && (
                        <div className="criterion-selected-indicator">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="criterion-description">{criterion.description}</div>
                  </div>
                ))}
              </div>
              
              <div className="selection-status">
                <p>
                  {selectedCriteria.length === 0 
                    ? 'Select at least 3 criteria' 
                    : `${selectedCriteria.length} criteria selected ${selectedCriteria.length < 3 ? '(minimum 3)' : ''}`}
                </p>
                {selectedCriteria.length >= 5 && (
                  <p className="max-reached">Maximum of 5 criteria reached</p>
                )}
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="wizard-step">
              <h3>Review Your Setup</h3>
              <p>Review your scoring scenario details before creating it.</p>
              
              <div className="review-container">
                <div className="review-section">
                  <h4>Scenario Name</h4>
                  <p>{scenarioName}</p>
                </div>
                
                <div className="review-section">
                  <h4>Account List</h4>
                  <p>{accountFile?.name}</p>
                </div>
                
                <div className="review-section">
                  <h4>Column Mapping</h4>
                  <div className="column-mapping-review">
                    <div className="mapping-item">
                      <span className="mapping-label">Account ID:</span>
                      <span className="mapping-value">{selectedIdColumn}</span>
                    </div>
                    <div className="mapping-item">
                      <span className="mapping-label">Account Name:</span>
                      <span className="mapping-value">{selectedNameColumn}</span>
                    </div>
                  </div>
                </div>
                
                <div className="review-section">
                  <h4>Selected Criteria</h4>
                  <ul className="review-criteria-list">
                    {selectedCriteria.map(id => (
                      <li key={id}>
                        {criteriaOptions.find(option => option.id === id)?.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="completion-note">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <p>You're all set to create your foundation scoring scenario! After creation, you'll be able to manually assign scores to each criterion for your accounts.</p>
              </div>
            </div>
          )}
      </div>
      
      <div className="wizard-footer">
        <div>
          {currentStep > 1 && (
            <button className="back-button" onClick={handleBack}>
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
              disabled={currentStep === 1 && !scenarioName.trim() || 
                       currentStep === 2 && !accountFile ||
                       currentStep === 3 && selectedCriteria.length < 3}
            >
              <span className="button-text">Next</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <span className="keyboard-shortcut">⌘ + Enter</span>
            </button>
          ) : (
            <button className="complete-button" onClick={handleComplete}>
              <span className="button-text">Create Scoring Scenario</span>
              <span className="keyboard-shortcut">⌘ + Enter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoundationScenarioWizard;