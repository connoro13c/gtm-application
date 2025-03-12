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
  Plus
} from 'lucide-react';

const DataLoading = ({ data, updateData }) => {
  // State for tracking selected data sources and uploads
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState(data.uploadedFiles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressIndicator, setShowProgressIndicator] = useState(false);
  const [integrationCredentials, setIntegrationCredentials] = useState({});
  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: 'daily',
    time: '00:00',
    enabled: false
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);
  
  // Data sources organized by category as per the wireframe
  const DATA_SOURCES = {
    crm: [
      { id: 'salesforce', name: 'Salesforce', icon: Database, color: 'blue' },
      { id: 'hubspot', name: 'HubSpot', icon: Database, color: 'orange' }
    ],
    marketing: [
      { id: '6sense', name: '6sense', icon: Database, color: 'green' },
      { id: 'clay', name: 'Clay', icon: Database, color: 'purple' },
      { id: 'marketo', name: 'Marketo', icon: Database, color: 'purple' }
    ],
    postsales: [
      { id: 'gainsight', name: 'Gainsight', icon: Database, color: 'blue' },
      { id: 'totango', name: 'Totango', icon: Database, color: 'teal' },
      { id: 'vitaly', name: 'Vitaly', icon: Database, color: 'indigo' }
    ],
    product: [
      { id: 'amplitude', name: 'Amplitude', icon: Database, color: 'blue' },
      { id: 'mixpanel', name: 'Mixpanel', icon: Database, color: 'purple' },
      { id: 'heap', name: 'Heap', icon: Database, color: 'orange' },
      { id: 'segment', name: 'Segment', icon: Database, color: 'green' }
    ],
    manual: [
      { id: 'csv', name: 'CSV Upload', icon: FileText, color: 'red' },
      { id: 'excel', name: 'Excel', icon: FileSpreadsheet, color: 'green' },
      { id: 'json', name: 'JSON', icon: FileText, color: 'amber' },
      { id: 'google_sheets', name: 'Google Sheets', icon: FileSpreadsheet, color: 'green' }
    ],
    custom: [
      { id: 'custom_api', name: 'Custom API', icon: Database, color: 'gray' }
    ]
  };

  // Update parent component when uploads change
  useEffect(() => {
    updateData({
      uploadedFiles: uploadedFiles,
      integrationCredentials: integrationCredentials,
      scheduleSettings: scheduleSettings
    });
  }, [uploadedFiles, integrationCredentials, scheduleSettings, updateData]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSource(null); // Reset source when category changes
  };

  // Handle data source selection
  const handleSourceSelect = (source) => {
    setSelectedSource(source);
    
    // For manual uploads, trigger file browser
    if (['csv', 'excel', 'json'].includes(source.id)) {
      fileInputRef.current?.click();
    }
  };

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
      // Filter to supported file types
      const supportedExtensions = ['.csv', '.xlsx', '.xls', '.json'];
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
          errors.push(`File ${file.name} has unsupported format. Please use CSV, Excel, or JSON.`);
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
      
      // Simulate processing with progress updates
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        setUploadProgress(Math.min(progress, 90)); // Go to 90% max until complete
        
        if (progress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200);
      
      // Simulate file processing
      // In a real app, this would process the files and extract structure
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process each file (simulated)
      const processedFiles = validFiles.map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        status: 'ready',
        structure: {
          headers: ['Column1', 'Column2', 'Column3'], // Simulated structure
          rowCount: Math.floor(Math.random() * 1000) + 50,
          sampleData: [{ Column1: 'Sample', Column2: 'Data', Column3: 'Row' }]
        }
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

  return (
    <div className="data-loading-container">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-500 mb-2">Select Data Source</h3>
        <p className="text-gray-300 mb-4">
          Choose from the available data sources or upload your own files.
        </p>
      </div>
      
      {/* Source Categories */}
      <div className="mb-8">
        <h4 className="font-medium text-white mb-3">Data Source Categories</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(DATA_SOURCES).map(([category, sources]) => {
            const displayNames = {
              crm: 'CRM & Sales',
              marketing: 'Marketing Tools',
              postsales: 'Post-sales Data',
              product: 'Product Usage',
              manual: 'Manual Upload',
              custom: 'Custom Integration'
            };
            
            return (
              <button
                key={category}
                className={`p-4 rounded-lg border ${selectedCategory === category ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-gray-700'} hover:border-blue-500 hover:bg-blue-500 hover:bg-opacity-5 transition-colors flex flex-col items-center justify-center text-center`}
                onClick={() => handleCategorySelect(category)}
              >
                {category === 'crm' && <Database className="mb-2 text-blue-500" size={24} />}
                {category === 'marketing' && <Database className="mb-2 text-purple-500" size={24} />}
                {category === 'postsales' && <Database className="mb-2 text-green-500" size={24} />}
                {category === 'product' && <Database className="mb-2 text-amber-500" size={24} />}
                {category === 'manual' && <FileText className="mb-2 text-red-500" size={24} />}
                {category === 'custom' && <Database className="mb-2 text-gray-500" size={24} />}
                <span className="text-white">{displayNames[category]}</span>
                <span className="text-xs text-gray-400 mt-1">{sources.length} sources</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Available Sources in Selected Category */}
      {selectedCategory && (
        <div className="mb-8">
          <h4 className="font-medium text-white mb-3">Available Sources</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DATA_SOURCES[selectedCategory].map(source => {
              const SourceIcon = source.icon;
              return (
                <button
                  key={source.id}
                  className={`p-4 rounded-lg border ${selectedSource?.id === source.id ? `border-${source.color}-500 bg-${source.color}-500 bg-opacity-10` : 'border-gray-700'} hover:border-${source.color}-500 hover:bg-${source.color}-500 hover:bg-opacity-5 transition-colors flex flex-col items-center justify-center text-center`}
                  onClick={() => handleSourceSelect(source)}
                >
                  <SourceIcon className={`mb-2 text-${source.color}-500`} size={24} />
                  <span className="text-white">{source.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Integration or Upload UI */}
      {selectedSource && (
        <div className="mb-8">
          <h4 className="font-medium text-white mb-3">{selectedSource.name} Integration</h4>
          
          {/* Manual upload UI */}
          {['csv', 'excel', 'json'].includes(selectedSource.id) && (
            <div>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-500 bg-opacity-5' : 'border-gray-700'}`}
                onDragEnter={(e) => handleDrag(e, true)}
                onDragOver={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDrop={handleDrop}
              >
                <Upload size={40} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Drag and drop your {selectedSource.name} files here</p>
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
            </div>
          )}
          
          {/* API integration UI */}
          {['salesforce', 'hubspot', '6sense', 'clay', 'marketo', 'gainsight', 'totango', 'vitaly', 'amplitude', 'mixpanel', 'heap', 'segment', 'custom_api'].includes(selectedSource.id) && (
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
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    onClick={() => console.log('Validate credentials')}
                  >
                    Validate Connection
                  </button>
                </div>
              </div>
              
              {/* Scheduled Data Pulls Section */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h5 className="font-medium text-white mb-4">Schedule Data Pulls</h5>
                
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
          )}
        </div>
      )}
      
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
      
      {/* Tips section */}
      <div className="mt-8 p-4 bg-gray-800 rounded border border-gray-700">
        <h4 className="font-medium text-white mb-2">Tips for Data Loading</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>For direct API integration, you'll need appropriate API keys or OAuth permissions</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>CSV files should use comma separators with UTF-8 encoding</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Scheduled data pulls will run at the specified time in your account's timezone</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>For large files, the upload and processing may take several minutes</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataLoading;