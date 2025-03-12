import React, { useState, useEffect, useRef } from 'react';
import { Plus, RefreshCw, AlertTriangle, CheckCircle, Database, FileSpreadsheet, FileText, Upload, X } from 'lucide-react';

// In a real implementation, this would be fetched from an API
// Initialize as empty until real data is loaded
const EXTERNAL_DATA_SOURCES = [];

const DataSourceSelection = ({ data, updateData }) => {
  const [dataSources, setDataSources] = useState(EXTERNAL_DATA_SOURCES);
  const [selectedSources, setSelectedSources] = useState(data.dataSources || []);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileIssuesModal, setFileIssuesModal] = useState(null);
  const [fileErrorModal, setFileErrorModal] = useState(null);
  const fileInputRef = useRef(null);
  
  // Update parent component when selections change
  useEffect(() => {
    updateData({ 
      dataSources: selectedSources,
      uploadedFiles: uploadedFiles
    });
    console.log('DataSourceSelection updated data:', { dataSources: selectedSources, uploadedFiles });
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
        {dataSources.length > 0 ? (
          dataSources.map(source => (
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
                    <div className="text-sm text-white">{source.recordCount?.toLocaleString() || 0} records</div>
                    <div className={`text-xs ${
                      source.missingDataPercentage > 10 ? 'text-vermilion-7' :
                      source.missingDataPercentage > 5 ? 'text-amber-500' :
                      'text-green-6'
                    }`}>
                      {source.missingDataPercentage || 0}% missing data
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
              
              {source.status === 'error' && source.errorMessage && (
                <div className="mt-3 p-2 bg-vermilion-7 bg-opacity-10 text-vermilion-7 text-sm rounded">
                  <span className="font-medium">Error:</span> {source.errorMessage}
                </div>
              )}
            </button>
          ))
        ) : (
          <div className="p-8 text-center border border-dashed border-greyscale-6 rounded-lg">
            <Database size={32} className="text-greyscale-7 mx-auto mb-4" />
            <h4 className="text-md font-medium text-white mb-2">No External Data Sources Connected</h4>
            <p className="text-greyscale-7 mb-4">
              You haven't connected any external data sources yet. Use the button below to add Salesforce, Google Sheets, or other integrations.
            </p>
          </div>
        )}
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
                  className={`p-3 bg-greyscale-4 rounded-md flex justify-between items-center ${file.status === 'error' ? 'border border-vermilion-7' : ''}`}
                >
                  <div className="flex items-center">
                    {file.status === 'error' ? (
                      <AlertTriangle size={20} className="text-vermilion-7 mr-2" />
                    ) : file.status === 'ready' ? (
                      <CheckCircle size={20} className="text-green-6 mr-2" />
                    ) : (
                      <FileText size={20} className="text-vermilion-7 mr-2" />
                    )}
                    <div>
                      <p className="text-white">{file.name}</p>
                      <p className="text-xs text-greyscale-7">{formatFileSize(file.size)}</p>
                      {file.structure && (
                        <p className="text-xs text-green-6">
                          {file.structure.headers.length} columns, {file.structure.rowCount} rows
                        </p>
                      )}
                      {file.validationIssues && file.validationIssues.length > 0 && (
                        <div className="mt-1">
                          {file.validationIssues.filter(issue => issue.severity === 'error').length > 0 ? (
                            <button
                              type="button"
                              className="text-xs text-vermilion-7 hover:underline focus:outline-none"
                              onClick={() => showFileIssues(file)}
                              aria-label="View file errors"
                            >
                              {file.validationIssues.filter(issue => issue.severity === 'error').length} error(s) - Click to view
                            </button>
                          ) : file.validationIssues.filter(issue => issue.severity === 'warning').length > 0 ? (
                            <button
                              type="button"
                              className="text-xs text-amber-500 hover:underline focus:outline-none"
                              onClick={() => showFileIssues(file)}
                              aria-label="View file warnings"
                            >
                              {file.validationIssues.filter(issue => issue.severity === 'warning').length} warning(s) - Click to view
                            </button>
                          ) : null}
                        </div>
                      )}
                      {file.error && (
                        <div className="mt-1">
                          <button
                            type="button"
                            className="text-xs text-vermilion-7 hover:underline focus:outline-none"
                            onClick={() => showFileError(file)}
                            aria-label="View error details"
                          >
                            Error: {file.error.substring(0, 30)}{file.error.length > 30 ? '...' : ''} - Click for details
                          </button>
                        </div>
                      )}
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
      
      {/* File Issues Modal */}
      {fileIssuesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-greyscale-3 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-blue-09">Validation Issues: {fileIssuesModal.name}</h3>
              <button
                type="button"
                className="text-greyscale-7 hover:text-white"
                onClick={() => setFileIssuesModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              {fileIssuesModal.validationIssues && fileIssuesModal.validationIssues.length > 0 ? (
                <div className="space-y-3">
                  {fileIssuesModal.validationIssues.map((issue, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded ${
                        issue.severity === 'error' ? 'bg-vermilion-7 bg-opacity-20 text-vermilion-7' : 
                        issue.severity === 'warning' ? 'bg-amber-500 bg-opacity-20 text-amber-500' : 
                        'bg-blue-5 bg-opacity-20 text-blue-5'
                      }`}
                    >
                      <div className="flex items-start">
                        {issue.severity === 'error' ? <AlertTriangle size={16} className="mr-2 mt-0.5" /> : 
                         issue.severity === 'warning' ? <AlertTriangle size={16} className="mr-2 mt-0.5" /> : 
                         <RefreshCw size={16} className="mr-2 mt-0.5" />}
                        <div>
                          <p className="font-medium">{issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}</p>
                          <p>{issue.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-greyscale-7">No validation issues found.</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-greyscale-6 rounded-md text-white"
                onClick={() => setFileIssuesModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* File Error Modal */}
      {fileErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-greyscale-3 rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-vermilion-7">Error Processing File: {fileErrorModal.name}</h3>
              <button
                type="button"
                className="text-greyscale-7 hover:text-white"
                onClick={() => setFileErrorModal(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="p-4 bg-vermilion-7 bg-opacity-10 rounded-md text-vermilion-7">
                <p className="font-medium mb-2">Error Details:</p>
                <p>{fileErrorModal.error}</p>
              </div>
              
              <div className="mt-4">
                <p className="text-white mb-2">Possible solutions:</p>
                <ul className="list-disc pl-5 text-greyscale-7 space-y-1">
                  <li>Check if the file format matches its extension</li>
                  <li>Verify the file is not corrupted</li>
                  <li>For CSV files, check that the comma separation is consistent</li>
                  <li>For JSON files, validate that it contains valid JSON objects</li>
                  <li>Try exporting the file again from its source application</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-greyscale-6 rounded-md text-white mr-2"
                onClick={() => {
                  setFileErrorModal(null);
                  // Remove the file from uploaded files
                  setUploadedFiles(prev => prev.filter(f => f.id !== fileErrorModal.id));
                }}
              >
                Remove File
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-greyscale-6 rounded-md text-white"
                onClick={() => setFileErrorModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Process and handle file upload with enterprise-grade validation and processing
  async function handleFileUpload(files) {
    // Show loading state during processing
    setIsLoading(true);
    
    try {
      // Filter out unsupported file types with detailed validation
      const supportedExtensions = ['.csv', '.xlsx', '.json'];
      const validFiles = [];
      const invalidFiles = [];
      
      // Validate each file before processing
      for (const file of files) {
        const extension = `.${file.name.split('.').pop().toLowerCase()}`;
        if (supportedExtensions.includes(extension)) {
          // Additional size validation - 100MB limit for enterprise use
          if (file.size > 100 * 1024 * 1024) {
            invalidFiles.push({
              name: file.name,
              reason: 'File exceeds 100MB size limit'
            });
          } else {
            validFiles.push(file);
          }
        } else {
          invalidFiles.push({
            name: file.name,
            reason: 'Unsupported file format'
          });
        }
      }
      
      // Handle invalid files
      if (invalidFiles.length > 0) {
        // In a real application, you would show these errors in the UI
        console.error('Some files could not be processed:', invalidFiles);
        // Here you would display a proper error message to the user
      }
      
      if (validFiles.length > 0) {
        // Process each file concurrently with robust error handling
        const processedFiles = await Promise.allSettled(
          validFiles.map(async (file) => {
            try {
              // Extract structure with detailed metadata
              const fileStructure = await readFileStructure(file);
              
              // Create a unique ID for the file
              const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              
              return {
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                lastUpdated: new Date().toISOString(),
                processed: true,
                structure: fileStructure,
                status: 'ready',
                validationIssues: fileStructure.validationIssues || []
              };
            } catch (error) {
              console.error(`Error processing file ${file.name}:`, error);
              return {
                id: `error-${Date.now()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                lastUpdated: new Date().toISOString(),
                processed: false,
                status: 'error',
                error: error.message || 'Unknown error processing file'
              };
            }
          })
        );
        
        // Filter and process results
        const successfulFiles = processedFiles
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);
          
        const failedFiles = processedFiles
          .filter(result => result.status === 'rejected' || (result.status === 'fulfilled' && result.value.status === 'error'))
          .map(result => result.status === 'rejected' ? { error: result.reason } : result.value);
        
        if (failedFiles.length > 0) {
          console.warn('Some files failed to process:', failedFiles);
          // In a production app, you would display these errors to the user
        }
        
        // Update state with successfully processed files
        const newFiles = [...uploadedFiles, ...successfulFiles];
        setUploadedFiles(newFiles);
        
        // Log detailed information about processed files
        console.log('Files processed:', {
          success: successfulFiles.length,
          failed: failedFiles.length,
          details: successfulFiles
        });
      }
    } catch (error) {
      console.error('Unexpected error during file processing:', error);
      // Here you would show a user-friendly error message
    } finally {
      setIsLoading(false);
    }
  }
  
  // Read and extract structure from file with enterprise-grade parsing
  async function readFileStructure(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const extension = `.${file.name.split('.').pop().toLowerCase()}`;
      const validationIssues = [];
      
      reader.onload = (event) => {
        try {
          let headers = [];
          let sampleData = [];
          let fullData = [];
          let dataQualityMetrics = {
            totalRows: 0,
            emptyValues: 0,
            incompleteRows: 0,
            dataTypes: {}
          };
          
          // Process based on file type with robust parsing
          if (extension === '.csv') {
            const content = event.target.result;
            const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
            
            if (lines.length === 0) {
              validationIssues.push({ severity: 'error', message: 'CSV file is empty' });
              resolve({
                headers: [],
                sampleData: [],
                fullData: [],
                rowCount: 0,
                extension,
                validationIssues
              });
              return;
            }
            
            // Robust CSV parsing with quotes and escapes handling
            const parseCSVLine = (line) => {
              const values = [];
              let inQuotes = false;
              let currentValue = '';
              
              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const nextChar = line[i + 1];
                
                if (char === '"' && (inQuotes && nextChar === '"')) {
                  // Handle escaped quotes inside quotes
                  currentValue += '"';
                  i++; // Skip the next quote
                } else if (char === '"') {
                  // Toggle quote state
                  inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                  // End of field
                  values.push(currentValue);
                  currentValue = '';
                } else {
                  // Regular character
                  currentValue += char;
                }
              }
              
              values.push(currentValue); // Add the last value
              return values;
            };
            
            // Extract headers
            headers = parseCSVLine(lines[0]).map(header => header.trim());
            
            // Check for empty or duplicate headers
            const emptyHeaders = headers.filter(h => h === '');
            if (emptyHeaders.length > 0) {
              validationIssues.push({ 
                severity: 'warning', 
                message: `Found ${emptyHeaders.length} empty column headers` 
              });
              
              // Replace empty headers with placeholders
              headers = headers.map((h, i) => h === '' ? `Column_${i + 1}` : h);
            }
            
            const headerCounts = {};
            headers.forEach(h => {
              headerCounts[h] = (headerCounts[h] || 0) + 1;
            });
            
            const duplicateHeaders = Object.keys(headerCounts).filter(h => headerCounts[h] > 1);
            if (duplicateHeaders.length > 0) {
              validationIssues.push({ 
                severity: 'warning', 
                message: `Found duplicate headers: ${duplicateHeaders.join(', ')}` 
              });
              
              // Make duplicate headers unique
              let counts = {};
              headers = headers.map(h => {
                counts[h] = (counts[h] || 0) + 1;
                return counts[h] > 1 ? `${h}_${counts[h]}` : h;
              });
            }
            
            // Process data rows
            const dataRows = lines.slice(1);
            dataQualityMetrics.totalRows = dataRows.length;
            
            fullData = dataRows.map((row, rowIndex) => {
              const values = parseCSVLine(row);
              let rowObj = {};
              let emptyCount = 0;
              
              // Initialize data type tracking for each column
              if (rowIndex === 0) {
                headers.forEach(header => {
                  dataQualityMetrics.dataTypes[header] = {
                    number: 0,
                    date: 0,
                    boolean: 0,
                    string: 0,
                    empty: 0
                  };
                });
              }
              
              // Map values to object properties
              headers.forEach((header, i) => {
                const value = values[i] || '';
                rowObj[header] = value;
                
                // Track empty values
                if (value === '') {
                  emptyCount++;
                  dataQualityMetrics.emptyValues++;
                  dataQualityMetrics.dataTypes[header].empty++;
                } else {
                  // Determine and track data type
                  if (!isNaN(Number(value))) {
                    dataQualityMetrics.dataTypes[header].number++;
                  } else if (/^\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}/.test(value)) {
                    dataQualityMetrics.dataTypes[header].date++;
                  } else if (/^true$|^false$/i.test(value)) {
                    dataQualityMetrics.dataTypes[header].boolean++;
                  } else {
                    dataQualityMetrics.dataTypes[header].string++;
                  }
                }
              });
              
              // Track incomplete rows
              if (emptyCount > 0) {
                dataQualityMetrics.incompleteRows++;
              }
              
              return rowObj;
            });
            
            // Get sample data for display
            sampleData = fullData.slice(0, 5);
            
          } else if (extension === '.json') {
            // Parse JSON with robust validation
            const jsonData = JSON.parse(event.target.result);
            
            // Handle different JSON structures
            if (Array.isArray(jsonData)) {
              // Array of objects format
              fullData = jsonData;
              dataQualityMetrics.totalRows = fullData.length;
              
              if (fullData.length === 0) {
                validationIssues.push({ severity: 'error', message: 'JSON file contains an empty array' });
                resolve({
                  headers: [],
                  sampleData: [],
                  fullData: [],
                  rowCount: 0,
                  extension,
                  validationIssues
                });
                return;
              }
              
              // Extract headers from all objects to handle inconsistent schemas
              // This is important for enterprise data that might have varying fields
              const allKeys = new Set();
              fullData.forEach(item => {
                Object.keys(item).forEach(key => allKeys.add(key));
              });
              headers = Array.from(allKeys);
              
              // Analyze data quality
              headers.forEach(header => {
                dataQualityMetrics.dataTypes[header] = {
                  number: 0,
                  date: 0,
                  boolean: 0,
                  string: 0,
                  empty: 0
                };
              });
              
              fullData.forEach(item => {
                let emptyCount = 0;
                
                headers.forEach(header => {
                  const value = item[header];
                  
                  if (value === undefined || value === null || value === '') {
                    emptyCount++;
                    dataQualityMetrics.emptyValues++;
                    dataQualityMetrics.dataTypes[header].empty++;
                  } else {
                    // Type detection
                    const valueType = typeof value;
                    if (valueType === 'number') {
                      dataQualityMetrics.dataTypes[header].number++;
                    } else if (valueType === 'boolean') {
                      dataQualityMetrics.dataTypes[header].boolean++;
                    } else if (valueType === 'string') {
                      if (/^\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}/.test(value)) {
                        dataQualityMetrics.dataTypes[header].date++;
                      } else {
                        dataQualityMetrics.dataTypes[header].string++;
                      }
                    }
                  }
                });
                
                if (emptyCount > 0) {
                  dataQualityMetrics.incompleteRows++;
                }
              });
            } else if (typeof jsonData === 'object' && jsonData !== null) {
              // Single object format - convert to array
              fullData = [jsonData];
              headers = Object.keys(jsonData);
              dataQualityMetrics.totalRows = 1;
              
              // Initialize data types
              headers.forEach(header => {
                const value = jsonData[header];
                dataQualityMetrics.dataTypes[header] = {
                  number: 0,
                  date: 0,
                  boolean: 0,
                  string: 0,
                  empty: 0
                };
                
                if (value === undefined || value === null || value === '') {
                  dataQualityMetrics.emptyValues++;
                  dataQualityMetrics.dataTypes[header].empty++;
                } else {
                  const valueType = typeof value;
                  if (valueType === 'number') {
                    dataQualityMetrics.dataTypes[header].number++;
                  } else if (valueType === 'boolean') {
                    dataQualityMetrics.dataTypes[header].boolean++;
                  } else if (valueType === 'string') {
                    if (/^\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}/.test(value)) {
                      dataQualityMetrics.dataTypes[header].date++;
                    } else {
                      dataQualityMetrics.dataTypes[header].string++;
                    }
                  }
                }
              });
            } else {
              validationIssues.push({ 
                severity: 'error', 
                message: 'JSON file must contain an array of objects or a single object' 
              });
              resolve({
                headers: [],
                sampleData: [],
                fullData: [],
                rowCount: 0,
                extension,
                validationIssues
              });
              return;
            }
            
            // Set sample data
            sampleData = fullData.slice(0, 5);
            
          } else if (extension === '.xlsx') {
            // For XLSX files, we need a dedicated library
            // In production, we would use a library like xlsx, exceljs, or SheetJS
            validationIssues.push({
              severity: 'warning',
              message: 'XLSX support requires installing a dedicated library. Please use CSV or JSON format.'
            });
            
            // Return minimal structure to avoid breaking the flow
            // In production, you would implement proper XLSX parsing
            headers = ['Column1', 'Column2', 'Column3'];
            sampleData = [
              { 'Column1': 'Sample', 'Column2': 'Data', 'Column3': 'Row' }
            ];
            fullData = sampleData;
            dataQualityMetrics.totalRows = 1;
            
            console.warn('XLSX parsing requires additional library implementation.');
          }
          
          // Determine most likely data type for each column
          const inferredDataTypes = {};
          Object.keys(dataQualityMetrics.dataTypes).forEach(header => {
            const types = dataQualityMetrics.dataTypes[header];
            const total = Object.values(types).reduce((sum, count) => sum + count, 0) - types.empty;
            
            // Default to string if no values
            if (total === 0) {
              inferredDataTypes[header] = 'string';
              return;
            }
            
            // Find the most common type
            let maxType = 'string';
            let maxCount = 0;
            
            Object.keys(types).forEach(type => {
              if (type !== 'empty' && types[type] > maxCount) {
                maxCount = types[type];
                maxType = type;
              }
            });
            
            inferredDataTypes[header] = maxType;
          });
          
          // Validation warnings based on data quality
          if (dataQualityMetrics.emptyValues > 0) {
            const emptyPercentage = (dataQualityMetrics.emptyValues / 
              (dataQualityMetrics.totalRows * headers.length) * 100).toFixed(1);
              
            validationIssues.push({
              severity: emptyPercentage > 20 ? 'warning' : 'info',
              message: `${emptyPercentage}% of cells contain empty values (${dataQualityMetrics.emptyValues} cells)`
            });
          }
          
          if (dataQualityMetrics.incompleteRows > 0) {
            const incompletePercentage = (dataQualityMetrics.incompleteRows / 
              dataQualityMetrics.totalRows * 100).toFixed(1);
              
            validationIssues.push({
              severity: incompletePercentage > 30 ? 'warning' : 'info',
              message: `${incompletePercentage}% of rows (${dataQualityMetrics.incompleteRows}) are missing data in some columns`
            });
          }
          
          // Return comprehensive structure information
          resolve({
            headers,
            sampleData,
            fullData,
            rowCount: fullData.length,
            extension,
            inferredDataTypes,
            dataQualityMetrics,
            validationIssues
          });
        } catch (error) {
          console.error('Error processing file:', error);
          validationIssues.push({
            severity: 'error',
            message: error.message || 'Unknown error parsing file'
          });
          
          reject({
            error: error.message,
            validationIssues
          });
        }
      };
      
      reader.onerror = () => {
        reject({
          error: 'Error reading file',
          validationIssues: [{
            severity: 'error',
            message: 'Failed to read file content'
          }]
        });
      };
      
      // Read the file according to its type
      try {
        if (extension === '.json' || extension === '.csv') {
          reader.readAsText(file);
        } else if (extension === '.xlsx') {
          reader.readAsArrayBuffer(file);
        } else {
          reject({
            error: 'Unsupported file format',
            validationIssues: [{
              severity: 'error',
              message: 'Unsupported file format'
            }]
          });
        }
      } catch (error) {
        reject({
          error: error.message || 'Failed to start file reading',
          validationIssues: [{
            severity: 'error',
            message: error.message || 'Failed to start file reading'
          }]
        });
      }
    });
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
  
  // Show validation issues for a file
  function showFileIssues(file) {
    setFileIssuesModal(file);
  }
  
  // Show error details for a file
  function showFileError(file) {
    setFileErrorModal(file);
  }
};

export default DataSourceSelection;