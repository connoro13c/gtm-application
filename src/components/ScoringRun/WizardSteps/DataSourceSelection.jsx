import React, { useState, useEffect, useRef } from 'react';
import { Plus, RefreshCw, AlertTriangle, CheckCircle, Database, FileSpreadsheet, FileText, Upload, X } from 'lucide-react';

// Mock data for existing data sources
const MOCK_DATA_SOURCES = [
  {
    id: 'ds-1',
    name: 'Salesforce Accounts',
    type: 'salesforce',
    lastRefreshed: '2025-03-09T14:30:00',
    status: 'active',
    recordCount: 2547,
    missingDataPercentage: 3.2
  },
  {
    id: 'ds-2',
    name: 'Marketing Engagement Data',
    type: 'google_sheets',
    lastRefreshed: '2025-03-08T09:15:00',
    status: 'active',
    recordCount: 1832,
    missingDataPercentage: 8.7
  },
  {
    id: 'ds-3',
    name: 'Customer Success Health Scores',
    type: 'csv',
    lastRefreshed: '2025-03-05T16:45:00',
    status: 'error',
    recordCount: 1245,
    missingDataPercentage: 12.3,
    errorMessage: 'Missing required fields: account_id, health_score'
  },
  {
    id: 'ds-4',
    name: 'Product Usage Metrics',
    type: 'google_sheets',
    lastRefreshed: '2025-03-10T10:00:00',
    status: 'syncing',
    recordCount: 2103,
    missingDataPercentage: 5.1
  }
];

const DataSourceSelection = ({ data, updateData }) => {
  const [dataSources, setDataSources] = useState(MOCK_DATA_SOURCES);
  const [selectedSources, setSelectedSources] = useState(data.dataSources || []);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  // Update parent component when selections change
  useEffect(() => {
    updateData({ 
      dataSources: selectedSources,
      uploadedFiles: uploadedFiles
    });
  }, [selectedSources, uploadedFiles, updateData]);
  
  const handleSourceSelect = (sourceId) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter(id => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };
  
  const handleRefreshSource = async (sourceId, e) => {
    e.stopPropagation(); // Prevent triggering selection
    
    setIsLoading(true);
    // Simulate API call to refresh data source
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the data source with new refresh time
      setDataSources(dataSources.map(source => 
        source.id === sourceId 
          ? { 
              ...source, 
              lastRefreshed: new Date().toISOString(),
              status: 'active'
            } 
          : source
      ));
    } catch (error) {
      console.error('Error refreshing data source:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSourceIcon = (type) => {
    switch (type) {
      case 'salesforce':
        return <Database size={24} className="text-blue-5" />;
      case 'google_sheets':
        return <FileSpreadsheet size={24} className="text-green-6" />;
      case 'csv':
        return <FileText size={24} className="text-vermilion-7" />;
      default:
        return <Database size={24} className="text-greyscale-7" />;
    }
  };
  
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-6" />;
      case 'syncing':
        return <RefreshCw size={16} className="text-blue-5 animate-spin" />;
      case 'error':
        return <AlertTriangle size={16} className="text-vermilion-7" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-09 mb-2">Select Data Sources</h3>
        <p className="text-greyscale-8">
          Choose the data sources you want to use for this scoring run. You need at least one data source to proceed.
        </p>
      </div>
      
      {/* Data Sources List */}
      <div className="space-y-4 mb-6">
        {dataSources.map(source => (
          <button 
            key={source.id}
            className={`p-4 rounded-lg border w-full text-left ${
              selectedSources.includes(source.id) 
                ? 'border-vermilion-7 bg-vermilion-7 bg-opacity-5' 
                : 'border-greyscale-6'
          } cursor-pointer transition-colors`}
          onClick={() => handleSourceSelect(source.id)}
          type="button"
          aria-pressed={selectedSources.includes(source.id)}
        >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  {getSourceIcon(source.type)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-white">{source.name}</h4>
                    <div className="ml-2 flex items-center">
                      {getStatusIndicator(source.status)}
                      <span className={`ml-1 text-xs ${
                        source.status === 'active' ? 'text-green-6' : 
                        source.status === 'syncing' ? 'text-blue-5' : 
                        'text-vermilion-7'
                      }`}>
                        {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-greyscale-7 mt-1">
                    Last updated: {formatDate(source.lastRefreshed)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-white">{source.recordCount.toLocaleString()} records</div>
                  <div className={`text-xs ${
                    source.missingDataPercentage > 10 ? 'text-vermilion-7' :
                    source.missingDataPercentage > 5 ? 'text-amber-500' :
                    'text-green-6'
                  }`}>
                    {source.missingDataPercentage}% missing data
                  </div>
                </div>
                
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-greyscale-5 transition-colors"
                  onClick={(e) => handleRefreshSource(source.id, e)}
                  disabled={isLoading || source.status === 'syncing'}
                >
                  <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''} text-greyscale-7`} />
                </button>
                
                <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedSources.includes(source.id) ? 'border-vermilion-7 bg-vermilion-7' : 'border-greyscale-6'}">
                  {selectedSources.includes(source.id) && (
                    <CheckCircle size={16} className="text-white" />
                  )}
                </div>
              </div>
            </div>
            
            {source.status === 'error' && (
              <div className="mt-3 p-2 bg-vermilion-7 bg-opacity-10 text-vermilion-7 text-sm rounded">
                <span className="font-medium">Error:</span> {source.errorMessage}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Add New Data Source Button */}
      <button
        type="button"
        className="w-full p-4 border border-dashed border-greyscale-6 rounded-lg flex items-center justify-center text-greyscale-7 hover:bg-greyscale-4 transition-colors"
        onClick={() => setIsAddingNew(true)}
      >
        <Plus size={20} className="mr-2" />
        Add New Data Source
      </button>
      
      {/* Validation Message */}
      {selectedSources.length === 0 && (
        <div className="mt-4 p-3 bg-amber-500 bg-opacity-20 text-amber-500 rounded-md">
          Please select at least one data source to proceed.
        </div>
      )}
      
      {/* File Upload Section */}
      <div className="mt-8 mb-4">
        <h3 className="text-lg font-medium text-blue-09 mb-2">Upload Local Files</h3>
        <p className="text-greyscale-8 mb-4">
          Upload CSV, Excel, or JSON files from your local machine to use as data sources.
        </p>
        
        {/* Drag & Drop Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-vermilion-7 bg-vermilion-7 bg-opacity-5' : 'border-greyscale-6'}`}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            
            const files = Array.from(e.dataTransfer.files);
            handleFileUpload(files);
          }}
        >
          <Upload size={40} className="text-greyscale-7 mx-auto mb-4" />
          <p className="text-greyscale-7 mb-2">Drag and drop files here</p>
          <p className="text-greyscale-8 text-sm mb-4">Supported formats: CSV, Excel (.xlsx), JSON</p>
          
          <button
            type="button"
            className="px-4 py-2 bg-vermilion-7 text-white rounded-md"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".csv,.xlsx,.json"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              handleFileUpload(files);
              e.target.value = ''; // Reset input
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          />
        </div>
        
        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-blue-09 mb-2">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`} 
                  className="p-3 bg-greyscale-4 rounded-md flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <FileText size={20} className="text-vermilion-7 mr-2" />
                    <div>
                      <p className="text-white">{file.name}</p>
                      <p className="text-xs text-greyscale-7">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-1 hover:bg-greyscale-5 rounded-full"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={16} className="text-greyscale-7" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Add New Data Source Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-greyscale-3 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-blue-09">Add New Data Source</h3>
              <button
                type="button"
                className="text-greyscale-7 hover:text-white"
                onClick={() => setIsAddingNew(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="text-md font-medium text-blue-09 mb-2">Connect to External Source</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  className="p-4 border border-greyscale-6 rounded-lg flex flex-col items-center justify-center hover:bg-greyscale-4"
                  onClick={() => console.log('Salesforce connection clicked')}
                >
                  <Database size={24} className="text-blue-5 mb-2" />
                  <span className="text-white">Salesforce</span>
                </button>
                <button
                  type="button"
                  className="p-4 border border-greyscale-6 rounded-lg flex flex-col items-center justify-center hover:bg-greyscale-4"
                  onClick={() => console.log('Google Sheets connection clicked')}
                >
                  <FileSpreadsheet size={24} className="text-green-6 mb-2" />
                  <span className="text-white">Google Sheets</span>
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-greyscale-6 rounded-md text-white"
                onClick={() => setIsAddingNew(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Handle file upload
  function handleFileUpload(files) {
    // Filter out unsupported file types
    const supportedExtensions = ['.csv', '.xlsx', '.json'];
    const validFiles = files.filter(file => {
      const extension = `.${file.name.split('.').pop().toLowerCase()}`;
      return supportedExtensions.includes(extension);
    });
    
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  }
  
  // Remove a file from the uploaded files list
  function removeFile(index) {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }
  
  // Format file size for display
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
  }
};

export default DataSourceSelection;
