import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, X, AlertCircle, CheckCircle, RefreshCw, Filter } from 'lucide-react';

const DataValidation = ({ data, updateData }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [filtersApplied, setFiltersApplied] = useState({
    showErrors: true,
    showWarnings: true,
    showValid: true
  });
  
  // Run validation when component mounts
  useEffect(() => {
    validateData();
  }, []);
  
  // Simulate data validation process
  const validateData = async () => {
    setIsValidating(true);
    
    try {
      // Check if we have mapped fields and uploaded files
      if (!data.dataMapping || Object.keys(data.dataMapping).length === 0) {
        setValidationErrors(['No field mappings found. Please go back and map your fields.']);
        setValidationResults(null);
        return;
      }
      
      if (!data.uploadedFiles || data.uploadedFiles.length === 0) {
        setValidationErrors(['No files uploaded. Please go back and upload your data files.']);
        setValidationResults(null);
        return;
      }
      
      // Validation processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate identifier fields
      const identifierFields = Object.entries(data.dataMapping)
        .filter(([_, category]) => category === 'identifier')
        .map(([fieldId]) => fieldId);
      
      if (identifierFields.length === 0) {
        setValidationErrors(['No identifier field mapped. At least one field must be mapped as a Unique Identifier.']);
        setValidationResults(null);
        return;
      }
      
      // Generate validation results for each file
      const results = data.uploadedFiles.map(file => {
        const issues = [];
        
        // Check for common data issues based on the file structure
        if (file.structure) {
          // Check for identifier field values
          const idFieldHeader = file.structure.headers.find(h => h.includes('ID') || h.includes('Id'));
          if (idFieldHeader) {
            const hasEmptyIds = file.structure.sampleData.some(row => !row[idFieldHeader]);
            if (hasEmptyIds) {
              issues.push({ 
                type: 'error', 
                message: 'Missing required values in identifier fields', 
                field: idFieldHeader, 
                count: 3 
              });
            }
          }
        }
        
        // Add data quality checks
        issues.push({ 
          type: 'warning', 
          message: 'Possible duplicate account names detected', 
          field: 'Account Name', 
          count: 2 
        });
        
        // Add data type validation
        issues.push({ 
          type: 'warning', 
          message: 'Non-numeric values in revenue field', 
          field: 'Annual Revenue', 
          count: 5 
        });
        
        // If file looks good overall
        if (issues.length === 0) {
          issues.push({ 
            type: 'info', 
            message: 'Data appears to be clean with no major issues', 
            field: null, 
            count: 0 
          });
        }
        
        return {
          fileId: file.id,
          fileName: file.name,
          recordCount: file.structure?.rowCount || 468,
          validRecords: 463,
          issues: issues
        };
      });
      
      setValidationResults(results);
      setValidationErrors([]);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationErrors(['An error occurred during validation. Please try again.']);
    } finally {
      setIsValidating(false);
    }
  };
  
  // Filter the validation issues
  const getFilteredIssues = (issues) => {
    if (!issues) return [];
    
    return issues.filter(issue => {
      if (issue.type === 'error' && filtersApplied.showErrors) return true;
      if (issue.type === 'warning' && filtersApplied.showWarnings) return true;
      if (issue.type === 'info' && filtersApplied.showValid) return true;
      return false;
    });
  };
  
  // Toggle a specific filter
  const toggleFilter = (filterName) => {
    setFiltersApplied(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };
  
  // Calculate overall status
  const getOverallStatus = () => {
    if (!validationResults) return 'unknown';
    
    const hasErrors = validationResults.some(result => 
      result.issues.some(issue => issue.type === 'error')
    );
    
    const hasWarnings = validationResults.some(result => 
      result.issues.some(issue => issue.type === 'warning')
    );
    
    if (hasErrors) return 'error';
    if (hasWarnings) return 'warning';
    return 'success';
  };
  
  // Get icon based on issue type
  const getIssueIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle size={16} className="text-red-500 mr-2" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500 mr-2" />;
      case 'info':
        return <CheckCircle size={16} className="text-green-500 mr-2" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="data-validation-container">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-500 mb-2">Data Validation</h3>
        <p className="text-gray-300 mb-4">
          Validate your data to ensure it's ready for processing. We'll check for missing values,
          duplicates, and other common issues.
        </p>
      </div>
      
      {/* Validation Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={validateData}
          disabled={isValidating}
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              Validate Data
            </>
          )}
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-400">Filters:</div>
          
          <button
            type="button"
            className={`px-3 py-1 rounded text-xs flex items-center ${filtersApplied.showErrors ? 'bg-red-500 bg-opacity-20 text-red-500' : 'bg-gray-700 text-gray-400'}`}
            onClick={() => toggleFilter('showErrors')}
          >
            <AlertCircle size={12} className="mr-1" />
            Errors
          </button>
          
          <button
            type="button"
            className={`px-3 py-1 rounded text-xs flex items-center ${filtersApplied.showWarnings ? 'bg-amber-500 bg-opacity-20 text-amber-500' : 'bg-gray-700 text-gray-400'}`}
            onClick={() => toggleFilter('showWarnings')}
          >
            <AlertTriangle size={12} className="mr-1" />
            Warnings
          </button>
          
          <button
            type="button"
            className={`px-3 py-1 rounded text-xs flex items-center ${filtersApplied.showValid ? 'bg-green-500 bg-opacity-20 text-green-500' : 'bg-gray-700 text-gray-400'}`}
            onClick={() => toggleFilter('showValid')}
          >
            <Check size={12} className="mr-1" />
            Valid
          </button>
        </div>
      </div>
      
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-2 mt-0.5" size={20} />
            <div>
              <h5 className="font-medium text-red-500 mb-2">Validation Errors</h5>
              <ul className="list-disc pl-5 text-red-400 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Validation Results */}
      {isValidating ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Validating your data...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment depending on the size of your dataset.</p>
        </div>
      ) : validationResults ? (
        <div>
          {/* Overall Status Summary */}
          <div className="mb-6 p-4 rounded-lg border flex items-center justify-between"
               style={{
                 backgroundColor: getOverallStatus() === 'success' ? 'rgba(34, 197, 94, 0.1)' : 
                                getOverallStatus() === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 
                                'rgba(239, 68, 68, 0.1)',
                 borderColor: getOverallStatus() === 'success' ? 'rgb(34, 197, 94)' : 
                             getOverallStatus() === 'warning' ? 'rgb(245, 158, 11)' : 
                             'rgb(239, 68, 68)'
               }}
          >
            <div className="flex items-center">
              {getOverallStatus() === 'success' ? (
                <CheckCircle size={24} className="text-green-500 mr-3" />
              ) : getOverallStatus() === 'warning' ? (
                <AlertTriangle size={24} className="text-amber-500 mr-3" />
              ) : (
                <AlertCircle size={24} className="text-red-500 mr-3" />
              )}
              
              <div>
                <h4 className="font-medium text-white">
                  {getOverallStatus() === 'success' ? 'Data is valid' : 
                   getOverallStatus() === 'warning' ? 'Data contains warnings' : 
                   'Data contains errors'}
                </h4>
                <p className="text-sm text-gray-400">
                  {getOverallStatus() === 'success' ? 
                    'Your data is ready for processing.' : 
                    getOverallStatus() === 'warning' ? 
                    'Your data has some warnings but can still be processed.' : 
                    'Please fix the errors before proceeding.'}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-300">
                Total Files: {validationResults.length}
              </div>
              <div className="text-sm text-gray-300">
                Total Records: {validationResults.reduce((sum, result) => sum + result.recordCount, 0)}
              </div>
            </div>
          </div>
          
          {/* File by File Results */}
          <div className="space-y-4">
            {validationResults.map(result => {
              const filteredIssues = getFilteredIssues(result.issues);
              
              return (
                <div key={result.fileId} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  {/* File Header */}
                  <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-white">{result.fileName}</h5>
                      <div className="text-sm text-gray-400 mt-1">
                        {result.recordCount} total records
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {result.issues.some(issue => issue.type === 'error') && (
                        <span className="px-2 py-1 bg-red-500 bg-opacity-20 text-red-500 rounded text-xs">
                          {result.issues.filter(issue => issue.type === 'error').length} Errors
                        </span>
                      )}
                      
                      {result.issues.some(issue => issue.type === 'warning') && (
                        <span className="px-2 py-1 bg-amber-500 bg-opacity-20 text-amber-500 rounded text-xs">
                          {result.issues.filter(issue => issue.type === 'warning').length} Warnings
                        </span>
                      )}
                      
                      {result.issues.every(issue => issue.type === 'info') && (
                        <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-500 rounded text-xs">
                          Valid
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Issues List */}
                  {filteredIssues.length > 0 ? (
                    <div className="divide-y divide-gray-700">
                      {filteredIssues.map((issue, index) => (
                        <div key={index} className="p-3 flex items-start">
                          {getIssueIcon(issue.type)}
                          
                          <div className="flex-1">
                            <p className={issue.type === 'error' ? 'text-red-400' : 
                                        issue.type === 'warning' ? 'text-amber-400' : 'text-green-400'}>
                              {issue.message}
                            </p>
                            
                            {issue.field && issue.count > 0 && (
                              <p className="text-sm text-gray-400 mt-1">
                                Field: {issue.field} | Affected records: {issue.count}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No issues match the current filters
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <AlertTriangle size={48} className="text-gray-400 mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">No Validation Results</h4>
          <p className="text-gray-400 mb-4">
            Click the "Validate Data" button to check your data for issues.
          </p>
        </div>
      )}
      
      {/* Tips Section */}
      <div className="mt-8 p-4 bg-gray-800 rounded border border-gray-700">
        <h4 className="font-medium text-white mb-2">Tips for Data Validation</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">u2022</span>
            <span>Errors must be fixed before proceeding with data processing</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">u2022</span>
            <span>Warnings indicate potential issues but won't block processing</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">u2022</span>
            <span>Missing values in identifier fields will cause matching problems</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">u2022</span>
            <span>Use the filters to focus on specific types of issues</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataValidation;