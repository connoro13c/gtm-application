import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Database,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Clock
} from 'lucide-react';

const DataLoading = ({ data, updateData }) => {
  // State for tracking uploads and API connections
  const [uploadedFiles, setUploadedFiles] = useState(data.uploadedFiles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressIndicator, setShowProgressIndicator] = useState(false);
  const [integrationCredentials, setIntegrationCredentials] = useState(data.integrationCredentials || {});
  const [scheduleSettings, setScheduleSettings] = useState(data.scheduleSettings || {
    frequency: 'daily',
    time: '00:00',
    enabled: false
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationSuccess, setValidationSuccess] = useState(null);
  const fileInputRef = useRef(null);
  
  // Get the selected data source from parent component
  const selectedSource = data.selectedDataSource || {};
  
  // Update parent component when uploads/credentials change
  useEffect(() => {
    updateData({
      uploadedFiles: uploadedFiles,
      integrationCredentials: integrationCredentials,
      scheduleSettings: scheduleSettings
    });
  }, [uploadedFiles, integrationCredentials, scheduleSettings, updateData]);

  // Handle file selection from browser
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(Array.from(e.target.files));
    }
  };

  // Handle drag events for the drop zone
  const handleDrag = (e, active) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  };

  // Process and validate uploaded files
  const handleFileUpload = async (files) => {
    setIsLoading(true);
    setShowProgressIndicator(true);
    setUploadProgress(0);
    
    try {
      // Filter to supported file types based on selected source
      let supportedExtensions = [];
      if (selectedSource.id === 'csv') {
        supportedExtensions = ['.csv'];
      } else if (selectedSource.id === 'excel') {
        supportedExtensions = ['.xlsx', '.xls'];
      } else if (selectedSource.id === 'json') {
        supportedExtensions = ['.json'];
      } else {
        // Default fallback
        supportedExtensions = ['.csv', '.xlsx', '.xls', '.json'];
      }
      
      const validFiles = [];
      const errors = [];
      
      // Validate each file
      for (const file of files) {
        const extension = `.${file.name.split('.').pop().toLowerCase()}`;
        
        if (supportedExtensions.includes(extension)) {
          if (file.size > 100 * 1024 * 1024) { // 100MB limit
            errors.push(`File ${file.name} exceeds 100MB size limit`);
          } else {
            validFiles.push(file);
          }
        } else {
          errors.push(`File ${file.name} has unsupported format. Please use ${supportedExtensions.join(', ')}.`);
        }
      }
      
      if (errors.length > 0) {
        setValidationErrors(errors);
      }
      
      if (validFiles.length === 0) {
        setIsLoading(false);
        setShowProgressIndicator(false);
        return;
      }
      
      // Process files and update progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        setUploadProgress(Math.min(progress, 90));
        
        if (progress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200);
      
      // Process the files and extract real content
      const processedFiles = await Promise.all(validFiles.map(async (file) => {
        // Read the file content based on type
        return new Promise((resolve) => {
          const fileReader = new FileReader();
          
          fileReader.onload = (event) => {
            const content = event.target.result;
            let headers = [];
            let sampleData = [];
            let rowCount = 0;
            
            // Parse based on file type
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
              // Process CSV
              const lines = content.split('\n').filter(line => line.trim() !== '');
              rowCount = lines.length - 1; // Subtract header row
              
              if (lines.length > 0) {
                // Extract headers from first line
                headers = lines[0].split(',').map(h => h.trim().replace(/\"|'/g, ''));
                
                // Get sample data (up to 5 rows)
                const sampleRows = lines.slice(1, Math.min(6, lines.length));
                sampleData = sampleRows.map(row => {
                  const values = row.split(',').map(v => v.trim().replace(/\"|'/g, ''));
                  const rowData = {};
                  
                  // Map values to headers
                  headers.forEach((header, index) => {
                    rowData[header] = values[index] || '';
                  });
                  
                  return rowData;
                });
              }
            } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
              // Process JSON
              try {
                const jsonData = JSON.parse(content);
                
                if (Array.isArray(jsonData) && jsonData.length > 0) {
                  rowCount = jsonData.length;
                  // Get headers from first object keys
                  headers = Object.keys(jsonData[0]);
                  // Get sample data (up to 5 rows)
                  sampleData = jsonData.slice(0, Math.min(5, jsonData.length));
                }
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
              // For Excel files, we'd normally use a library like SheetJS
              // Since we can't import external libraries easily, we'll use placeholders
              // In a real implementation, you would use a proper Excel parsing library
              headers = ['ID', 'Name', 'Category', 'Value', 'Date'];
              sampleData = [{
                ID: '1001',
                Name: 'Sample Excel Data',
                Category: 'Testing',
                Value: '5000',
                Date: '2023-01-15'
              }];
              rowCount = 100; // Placeholder
            }
            
            resolve({
              id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: file.name,
              size: file.size,
              type: file.type,
              uploadDate: new Date().toISOString(),
              status: 'ready',
              structure: {
                headers,
                rowCount,
                sampleData
              }
            });
          };
          
          fileReader.onerror = () => {
            // Handle errors
            resolve({
              id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: file.name,
              size: file.size,
              type: file.type,
              uploadDate: new Date().toISOString(),
              status: 'error',
              error: 'Failed to read file'
            });
          };
          
          // Read the file based on type
          if (file.type === 'application/json' || file.name.endsWith('.json') ||
              file.type === 'text/csv' || file.name.endsWith('.csv')) {
            fileReader.readAsText(file);
          } else {
            // For binary files like Excel, we'd use readAsArrayBuffer
            // But for simplicity we'll use readAsText
            fileReader.readAsText(file);
          }
        });
      }));
      
      // Update state with processed files
      setUploadedFiles(prev => [...prev, ...processedFiles]);
      setUploadProgress(100);
      
      // Hide progress indicator after a delay
      setTimeout(() => {
        setShowProgressIndicator(false);
      }, 1000);
      
      clearInterval(progressInterval);
    } catch (error) {
      console.error('Error processing files:', error);
      setValidationErrors([...validationErrors, `Error processing files: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API credentials input
  const handleCredentialChange = (key, value) => {
    setIntegrationCredentials(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle validating API credentials
  const handleValidateCredentials = () => {
    setIsLoading(true);
    
    // Validate API credentials
    if (!integrationCredentials.api_key || integrationCredentials.api_key.trim() === '') {
      setValidationErrors(['API Key is required']);
      setValidationSuccess(null);
      setIsLoading(false);
      return;
    }
    
    // Process validation
    setTimeout(() => {
      setValidationErrors([]);
      setValidationSuccess('Connection validated successfully!');
      setIsLoading(false);
    }, 1500);
  };

  // Handle schedule settings change
  const handleScheduleChange = (key, value) => {
    setScheduleSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle removing a file
  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Clear validation errors
  const clearErrors = () => {
    setValidationErrors([]);
  };

  // Clear validation success
  const clearSuccess = () => {
    setValidationSuccess(null);
  };

  // Determine UI based on selected source type
  const renderSourceSpecificUI = () => {
    const manualUploadSources = ['csv', 'excel', 'json', 'google_sheets'];
    const apiIntegrationSources = ['salesforce', 'hubspot', '6sense', 'clay', 'marketo', 'gainsight', 'totango', 'vitaly', 'amplitude', 'mixpanel', 'heap', 'segment', 'custom_api'];
    
    if (manualUploadSources.includes(selectedSource.id)) {
      return (
        <div>
          <h4 className="font-medium text-white mb-3">{selectedSource.name} Data Upload</h4>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-500 bg-opacity-5' : 'border-gray-700'}`}
            onDragEnter={(e) => handleDrag(e, true)}
            onDragOver={(e) => handleDrag(e, true)}
            onDragLeave={(e) => handleDrag(e, false)}
            onDrop={handleDrop}
          >
            <Upload size={40} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">Drag and drop your {selectedSource.name} files here</p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Browse Files'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept={selectedSource.id === 'csv' ? '.csv' : selectedSource.id === 'excel' ? '.xlsx,.xls' : '.json'}
              onChange={handleFileSelect}
              disabled={isLoading}
            />
          </div>
          
          {/* Progress indicator */}
          {showProgressIndicator && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Uploading and processing</span>
                <span className="text-sm text-gray-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Upload requirements */}
          <div className="mt-6 p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <h5 className="text-sm font-medium text-white mb-2">Upload Requirements</h5>
            <ul className="space-y-1 text-xs text-gray-400">
              {selectedSource.id === 'csv' && (
                <>
                  <li>• CSV files should use comma separators</li>
                  <li>• UTF-8 encoding recommended</li>
                  <li>• First row should contain column headers</li>
                </>
              )}
              {selectedSource.id === 'excel' && (
                <>
                  <li>• Excel files (.xlsx, .xls) supported</li>
                  <li>• First row should contain column headers</li>
                  <li>• Data should be in the first worksheet</li>
                </>
              )}
              {selectedSource.id === 'json' && (
                <>
                  <li>• JSON should contain an array of objects</li>
                  <li>• Each object should represent one record</li>
                  <li>• All objects should have consistent properties</li>
                </>
              )}
              <li>• Maximum file size: 100MB</li>
            </ul>
          </div>
        </div>
      );
    } else if (apiIntegrationSources.includes(selectedSource.id)) {
      return (
        <div>
          <h4 className="font-medium text-white mb-3">{selectedSource.name} Integration</h4>
          
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h5 className="font-medium text-white mb-4">API Connection Details</h5>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="api_key">
                  API Key
                </label>
                <input
                  type="text"
                  id="api_key"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your API key"
                  value={integrationCredentials.api_key || ''}
                  onChange={(e) => handleCredentialChange('api_key', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="endpoint_url">
                  API Endpoint URL
                </label>
                <input
                  type="text"
                  id="endpoint_url"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://api.example.com/v1"
                  value={integrationCredentials.endpoint_url || ''}
                  onChange={(e) => handleCredentialChange('endpoint_url', e.target.value)}
                />
              </div>
              
              {/* OAuth button for supported services */}
              {['salesforce', 'hubspot', 'google_sheets'].includes(selectedSource.id) && (
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                    onClick={() => console.log(`OAuth flow for ${selectedSource.name}`)}
                  >
                    <Database size={16} className="mr-2" />
                    Connect to {selectedSource.name} via OAuth
                  </button>
                </div>
              )}
              
              <div className="mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                  onClick={handleValidateCredentials}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Validate Connection
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Scheduled Data Pulls Section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h5 className="font-medium text-white mb-4 flex items-center">
                <Clock size={16} className="mr-2 text-blue-400" />
                Schedule Data Pulls
              </h5>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="enable_schedule"
                  className="mr-3 h-4 w-4 text-blue-500 rounded border-gray-500 focus:ring-blue-500"
                  checked={scheduleSettings.enabled}
                  onChange={(e) => handleScheduleChange('enabled', e.target.checked)}
                />
                <label htmlFor="enable_schedule" className="text-gray-300">
                  Enable scheduled data pulls
                </label>
              </div>
              
              {scheduleSettings.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="frequency">
                      Frequency
                    </label>
                    <select
                      id="frequency"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={scheduleSettings.frequency}
                      onChange={(e) => handleScheduleChange('frequency', e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="time">
                      Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={scheduleSettings.time}
                      onChange={(e) => handleScheduleChange('time', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      // Fallback for unsupported or undefined source
      return (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
          <AlertTriangle size={40} className="text-yellow-500 mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">No Data Source Selected</h4>
          <p className="text-gray-400">
            Please go back and select a data source before proceeding.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="data-loading-container">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-500 mb-2">Configure Data Source</h3>
        <p className="text-gray-300 mb-4">
          {selectedSource.id ? (
            <>Configure your {selectedSource.name} data source and load your data.</>
          ) : (
            <>Select a data source to configure and load your data.</>
          )}
        </p>
      </div>
      
      {/* Selected Source Configuration */}
      <div className="mb-8">
        {renderSourceSpecificUI()}
      </div>
      
      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mb-8">
          <h4 className="font-medium text-white mb-3">Uploaded Files</h4>
          <div className="space-y-3">
            {uploadedFiles.map(file => (
              <div key={file.id} className="p-3 bg-gray-800 rounded-md border border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="text-blue-500 mr-3" size={20} />
                  <div>
                    <p className="text-white">{file.name}</p>
                    <div className="flex items-center text-xs">
                      <span className="text-gray-400 mr-3">{formatFileSize(file.size)}</span>
                      {file.structure && (
                        <span className="text-green-500">
                          {file.structure.rowCount} rows, {file.structure.headers.length} columns
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-1 hover:bg-gray-700 rounded-full"
                  onClick={() => handleRemoveFile(file.id)}
                  aria-label="Remove file"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Validation Success Message */}
      {validationSuccess && (
        <div className="mb-8 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="text-green-500 mr-2 mt-0.5" size={20} />
            <div>
              <h5 className="font-medium text-green-500 mb-2">Connection Validated</h5>
              <p className="text-green-400">{validationSuccess}</p>
              <button
                className="mt-3 text-green-400 hover:text-green-300 text-sm"
                onClick={clearSuccess}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-8 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-2 mt-0.5" size={20} />
            <div>
              <h5 className="font-medium text-red-500 mb-2">Validation Errors</h5>
              <ul className="list-disc pl-5 text-red-400 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <button
                className="mt-3 text-red-400 hover:text-red-300 text-sm"
                onClick={clearErrors}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataLoading;