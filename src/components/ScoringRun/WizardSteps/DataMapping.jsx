import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, Sparkles, Database, Key, Tag, Layers, Check, X } from 'lucide-react';

// Data categories for bucketing
const DATA_CATEGORIES = [
  { id: 'identification', name: 'Account Identification', icon: Key, color: 'blue' },
  { id: 'firmographic', name: 'Firmographic', icon: Database, color: 'green' },
  { id: 'engagement', name: 'Engagement', icon: ArrowRight, color: 'purple' },
  { id: 'health', name: 'Customer Health', icon: CheckCircle, color: 'amber' },
  { id: 'product', name: 'Product Usage', icon: Layers, color: 'indigo' },
  { id: 'marketing', name: 'Marketing', icon: Sparkles, color: 'pink' },
  { id: 'other', name: 'Other', icon: Tag, color: 'gray' }
];

const DataMapping = ({ data, updateData }) => {
  // State for source data fields
  const [sourceFields, setSourceFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [draggedRows, setDraggedRows] = useState([]);
  const [mappedFields, setMappedFields] = useState(data.dataMapping || {});
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiSuggestionsRequested, setAiSuggestionsRequested] = useState(false);
  const [showSuggestionSuccess, setShowSuggestionSuccess] = useState(false);
  const [mappingProgress, setMappingProgress] = useState({
    total: 0,
    mapped: 0,
    percentage: 0
  });
  const [mappingStep, setMappingStep] = useState('all'); // 'critical' or 'all'
  const [mappingStatus, setMappingStatus] = useState({
    isComplete: false,
    isCriticalComplete: false
  });
  
  // Refs for drag and drop functionality
  const dragSourceRef = useRef(null);
  
  // Update parent component when mappings change
  useEffect(() => {
    updateData({ dataMapping: mappedFields });
  }, [mappedFields, updateData]);

  // Calculate mapping progress
  useEffect(() => {
    if (sourceFields.length > 0) {
      const mappedCount = Object.keys(mappedFields).length;
      const percentage = Math.round((mappedCount / sourceFields.length) * 100);
      
      setMappingProgress({
        total: sourceFields.length,
        mapped: mappedCount,
        percentage
      });
      
      // Update mapping status
      const isComplete = percentage === 100;
      const criticalFields = sourceFields.filter(field => field.id.includes('account_id') || field.id.includes('company_name'));
      const mappedCriticalFields = criticalFields.filter(field => mappedFields[field.id]);
      const isCriticalComplete = mappedCriticalFields.length === criticalFields.length;
      
      setMappingStatus({
        isComplete,
        isCriticalComplete
      });
    }
  }, [mappedFields, sourceFields]);
  
  // Load source fields from the selected data source
  useEffect(() => {
    console.log('DataMapping received data:', { dataSources: data.dataSources, uploadedFiles: data.uploadedFiles });
    const loadSourceFields = async () => {
      setIsLoading(true);
      try {
        const noDataSources = !data.dataSources || data.dataSources.length === 0;
        const noUploadedFiles = !data.uploadedFiles || data.uploadedFiles.length === 0;
        
        if (noDataSources && noUploadedFiles) {
        setSourceFields([]);
        return;
        }
          
          // Log received data for debugging
          console.log('Data mapping received:', {
            dataSources: data.dataSources,
            uploadedFiles: data.uploadedFiles ? data.uploadedFiles.length : 0
          });
        
        // Check if we have uploaded files
        const hasUploadedFiles = data.uploadedFiles && data.uploadedFiles.length > 0;
        
        // Process fields from real data sources
        let allFields = [];
        if (hasUploadedFiles) {
          console.log('Processing uploaded files for mapping', data.uploadedFiles);
          
          const fileFields = data.uploadedFiles.flatMap((file, index) => {
            // Check if file has processed structure
            if (file.structure && file.structure.headers && file.structure.headers.length > 0) {
              // Get processed structure from file
              const { headers, sampleData, inferredDataTypes = {} } = file.structure;
              
              // Convert headers to field definitions
              return headers.map(header => {
                // Get example data for this field from the first row if available
                const exampleData = sampleData && sampleData.length > 0 ? sampleData[0][header] : '';
                
                // Get inferred data type or make a best guess based on example data
                let dataType = inferredDataTypes[header] || 'string';
                if (!inferredDataTypes[header]) {
                  // Fallback data type inference
                  if (exampleData !== undefined && exampleData !== null) {
                    if (!isNaN(Number(exampleData))) {
                      dataType = 'number';
                    } else if (/^\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4}/.test(exampleData)) {
                      dataType = 'date';
                    } else if (/^true$|^false$/i.test(exampleData)) {
                      dataType = 'boolean';
                    }
                  }
                }
                
                // Create a unique field ID that includes the file name and header
                const fieldId = `${file.name.replace(/[^a-zA-Z0-9]/g, '_')}_${header.replace(/[^a-zA-Z0-9]/g, '_')}`;
                
                return {
                  id: fieldId,
                  // Just use the header name directly without file prefix for cleaner display
                  name: header,
                  dataType,
                  example: exampleData !== undefined ? String(exampleData) : '',
                  mapped: false,
                  sourceFile: file.name,
                  sourceHeader: header,
                  fileId: file.id || `file-${index}`
                };
              });
            } else {
              console.warn('File missing structure or headers:', file.name);
              return [];
            }
          });
          
          // Log the processed fields
          console.log(`Generated ${fileFields.length} fields from uploaded files`);
          
          // Add to all fields
          allFields = [...allFields, ...fileFields];
        }
        
        setSourceFields(allFields);
        
        // AI suggestions will be generated when user clicks the button
        // not automatically
        console.log('Fields loaded, AI suggestions can be requested by the user');
      } catch (error) {
        console.error('Error loading source fields:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSourceFields();
  }, [data.dataSources, data.uploadedFiles]);
  
  // Generate AI suggestions for field categorization from secure backend API
  const generateAiSuggestions = useCallback(async (fields) => {
    setIsProcessingAI(true);
    
    try {
      // Prepare the fields data to send to the backend API
      const fieldsData = fields.map(field => ({
        id: field.id,
        name: field.name || field.sourceHeader || '',
        dataType: field.dataType || 'string',
        example: field.example || '',
        sourceFile: field.sourceFile || ''
      }));
      
      console.log('Frontend: Sending AI categorization request to backend');
      console.log('API URL:', import.meta.env.VITE_API_URL);
      
      // Call the secure backend API that handles the AI integration
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/field-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields: fieldsData })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.suggestions) {
        setAiSuggestions(data.suggestions);
      } else {
        throw new Error('Invalid response format from AI API');
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      
      // Fallback to local suggestion generation if API call fails
      const fallbackSuggestions = generateLocalSuggestions(fields);
      setAiSuggestions(fallbackSuggestions);
    } finally {
      setIsProcessingAI(false);
    }
  }, []);
  
  // Local fallback function for generating category suggestions
  const generateLocalSuggestions = (fields) => {
    const suggestions = {};
    
    fields.forEach(field => {
      const fieldName = (field.name || field.sourceHeader || '').toLowerCase();
      const fieldId = field.id;
      
      // Identification fields
      if (fieldName.includes('id') || fieldName.includes('identifier') || fieldName.includes('key') || 
          fieldName.includes('name') || fieldName.includes('company') || fieldName.includes('account')) {
        suggestions[fieldId] = 'identification';
      }
      // Firmographic fields
      else if (fieldName.includes('industry') || fieldName.includes('revenue') || fieldName.includes('employee') || 
               fieldName.includes('size') || fieldName.includes('country') || fieldName.includes('region') || 
               fieldName.includes('sector') || fieldName.includes('founded') || fieldName.includes('created')) {
        suggestions[fieldId] = 'firmographic';
      }
      // Engagement fields
      else if (fieldName.includes('engage') || fieldName.includes('visit') || fieldName.includes('click') || 
               fieldName.includes('open') || fieldName.includes('conversion') || fieldName.includes('activity')) {
        suggestions[fieldId] = 'engagement';
      }
      // Health fields
      else if (fieldName.includes('health') || fieldName.includes('score') || fieldName.includes('nps') || 
               fieldName.includes('satisfaction') || fieldName.includes('ticket') || fieldName.includes('support') || 
               fieldName.includes('issue')) {
        suggestions[fieldId] = 'health';
      }
      // Product usage fields
      else if (fieldName.includes('usage') || fieldName.includes('login') || fieldName.includes('user') || 
               fieldName.includes('active') || fieldName.includes('session') || fieldName.includes('feature')) {
        suggestions[fieldId] = 'product';
      }
      // Marketing fields
      else if (fieldName.includes('campaign') || fieldName.includes('marketing') || fieldName.includes('event') || 
               fieldName.includes('webinar') || fieldName.includes('download') || fieldName.includes('lead')) {
        suggestions[fieldId] = 'marketing';
      }
      // Default to other for unrecognized fields
      else {
        suggestions[fieldId] = 'other';
      }
    });
    
    return suggestions;
  };
  
  // Handle row selection with ctrl/shift click
  const handleRowSelect = (fieldId, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd click - toggle selection
      setSelectedRows(prev => 
        prev.includes(fieldId) 
          ? prev.filter(id => id !== fieldId) 
          : [...prev, fieldId]
      );
    } else if (event.shiftKey && selectedRows.length > 0) {
      // Shift click - select range
      const allFieldIds = sourceFields.map(field => field.id);
      const lastSelectedIndex = allFieldIds.indexOf(selectedRows[selectedRows.length - 1]);
      const currentIndex = allFieldIds.indexOf(fieldId);
      
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      
      const rangeSelection = allFieldIds.slice(start, end + 1);
      setSelectedRows(prev => {
        const newSelection = [...new Set([...prev, ...rangeSelection])];
        return newSelection;
      });
    } else {
      // Regular click - select just this row
      setSelectedRows([fieldId]);
    }
  };
  
  // Handle drag start
  const handleDragStart = (event, fieldIds) => {
    setDraggedRows(fieldIds.length > 0 ? fieldIds : [event.currentTarget.dataset.fieldId]);
    dragSourceRef.current = event.currentTarget;
    
    // Set custom drag image if needed
    if (fieldIds.length > 1) {
      const dragImage = document.createElement('div');
      dragImage.textContent = `${fieldIds.length} fields`;
      dragImage.style.backgroundColor = '#3737F2'; // Primary blue
      dragImage.style.color = 'white';
      dragImage.style.padding = '4px 8px';
      dragImage.style.borderRadius = '4px';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      
      event.dataTransfer.setDragImage(dragImage, 0, 0);
      
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
  };
  
  // Handle drop on category bucket
  const handleDrop = (categoryId) => {
    if (draggedRows.length === 0) return;
    
    // Map the dragged fields to the category
    const newMappedFields = { ...mappedFields };
    
    // Using for...of instead of forEach for better performance and control flow
    for (const fieldId of draggedRows) {
      newMappedFields[fieldId] = categoryId;
    }
    
    setMappedFields(newMappedFields);
    
    // Update the mapped status in source fields
    setSourceFields(prevFields => 
      prevFields.map(field => 
        draggedRows.includes(field.id) 
          ? { ...field, mapped: true } 
          : field
      )
    );
    
    // Clear selection and dragged rows
    setDraggedRows([]);
    setSelectedRows([]);
  };
  
  // Accept a single AI suggestion
  const handleAcceptSuggestion = (fieldId) => {
    if (!aiSuggestions[fieldId]) return;
    
    const categoryId = aiSuggestions[fieldId];
    
    // Map the field to the suggested category
    setMappedFields(prev => ({
      ...prev,
      [fieldId]: categoryId
    }));
    
    // Update the mapped status in source fields
    setSourceFields(prevFields => 
      prevFields.map(field => 
        field.id === fieldId 
          ? { ...field, mapped: true } 
          : field
      )
    );
  };
  
  // Accept all AI suggestions
  const handleAcceptAllSuggestions = () => {
    // Map all fields according to AI suggestions
    setMappedFields(aiSuggestions);
    
    // Update the mapped status in all source fields
    setSourceFields(prevFields => 
      prevFields.map(field => ({
        ...field,
        mapped: !!aiSuggestions[field.id]
      }))
    );
  };
  
  // Remove a field from a category
  const handleRemoveMapping = (fieldId) => {
    // Remove the mapping
    setMappedFields(prev => {
      const newMappings = { ...prev };
      delete newMappings[fieldId];
      return newMappings;
    });
    
    // Update the mapped status in source fields
    setSourceFields(prevFields => 
      prevFields.map(field => 
        field.id === fieldId 
          ? { ...field, mapped: false } 
          : field
      )
    );
  };
  
  // Get fields mapped to a specific category
  const getFieldsByCategory = (categoryId) => {
    return sourceFields.filter(field => 
      mappedFields[field.id] === categoryId
    );
  };
  
  // Render the category bucket
  const renderCategoryBucket = (category) => {
    const mappedCategoryFields = getFieldsByCategory(category.id);
    const CategoryIcon = category.icon;
    
    return (
      <div 
        key={category.id}
        className={`p-4 bg-gray-800 rounded-lg mb-3 border-2 border-dashed border-gray-700 hover:border-${category.color}-600 transition-colors`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(category.id)}
      >
        <div className="flex items-center mb-2">
          <CategoryIcon size={16} className={`text-${category.color}-500 mr-2`} />
          <h4 className="font-medium text-white">{category.name}</h4>
          <span className="ml-auto text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
            {mappedCategoryFields.length} fields
          </span>
        </div>
        
        <div className="space-y-2">
          {mappedCategoryFields.map(field => (
            <div 
              key={field.id} 
              className="flex items-center p-2 bg-gray-700 rounded text-sm text-white"
            >
              <span className="truncate">{field.name}</span>
              <button
                type="button"
                className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => handleRemoveMapping(field.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleRemoveMapping(field.id);
                  }
                }}
                aria-label={`Remove ${field.name} from ${category.name}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
          
          {mappedCategoryFields.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              <p>Drag fields here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calculate overall progress percentage
  const progressPercentage = mappingProgress.percentage;
  
  return (
    <div className="data-mapping-container relative">
      {/* AI Processing Overlay */}
      {isProcessingAI && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="relative mb-6">
              <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
              <div className="w-24 h-24 border-t-4 border-r-4 border-vermilion-7 border-solid rounded-full animate-spin absolute top-0 mx-auto opacity-70" style={{ animationDuration: '1.5s', left: 'calc(50% - 3rem)' }}></div>
              <Sparkles className="text-blue-400 w-10 h-10 absolute" style={{ top: 'calc(50% - 1.25rem)', left: 'calc(50% - 1.25rem)' }} />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">AI Processing Your Data</h3>
            <p className="text-gray-300 mb-4">
              Our AI is analyzing your data fields to provide intelligent categorization suggestions.
              This may take a moment...
            </p>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Success notification for AI suggestions */}
      {showSuggestionSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2" />
            <div>
              <h4 className="font-medium">AI Suggestions Ready!</h4>
              <p className="text-sm">Field categorization suggestions have been generated.</p>
            </div>
            <button
              className="ml-4 text-white hover:text-gray-200"
              onClick={() => setShowSuggestionSuccess(false)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-500 mb-2">Map Your Data Fields</h3>
        <p className="text-gray-300 mb-4">
          Drag and drop fields from your data source into the appropriate categories.
          You can also use the AI suggestions to automatically categorize your fields.
        </p>

        {/* Progress bar */}
        <div className="mt-2 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Mapping Progress</span>
            <span className="text-sm text-gray-300">
              {mappingProgress.mapped} of {mappingProgress.total} fields mapped ({progressPercentage}%)
            </span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded">
            <div 
              className={`h-full rounded ${
                progressPercentage >= 100 ? 'bg-green-500' : 
                progressPercentage >= 70 ? 'bg-blue-500' : 
                progressPercentage >= 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`} 
              style={{width: `${progressPercentage}%`}}
            />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading your data fields...</p>
        </div>
      ) : sourceFields.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <Database size={48} className="text-gray-400 mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">No Fields Available</h4>
          <p className="text-gray-400 mb-4">
            We couldn't find any fields in the selected data sources. Please check your data sources and try again.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side: Data fields table */}
          <div className="w-full md:w-1/2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Source Fields</h4>
              
              {/* AI Suggestion Action Button */}
              {!aiSuggestionsRequested || Object.keys(aiSuggestions).length === 0 ? (
                <button
                  type="button"
                  className="flex items-center px-4 py-2 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    setIsProcessingAI(true);
                    setAiSuggestionsRequested(true);
                    // Generate AI suggestions for the fields
                    generateAiSuggestions(sourceFields)
                      .then(() => {
                        // Show success notification
                        setShowSuggestionSuccess(true);
                        // Hide success notification after 5 seconds
                        setTimeout(() => {
                          setShowSuggestionSuccess(false);
                        }, 5000);
                      })
                      .catch(error => {
                        console.error('Failed to get AI suggestions:', error);
                        // Could add an error notification here
                      })
                      .finally(() => {
                        setIsProcessingAI(false);
                      });
                  }}
                  disabled={isProcessingAI || sourceFields.length === 0}
                  aria-label="Get AI suggestions"
                >
                  {isProcessingAI ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="mr-2" />
                      Get AI Suggestions
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="flex items-center px-4 py-2 bg-vermilion-7 rounded-md text-white text-sm hover:bg-vermilion-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAcceptAllSuggestions}
                  disabled={isProcessingAI || Object.keys(aiSuggestions).length === 0}
                  aria-label="Accept all AI suggestions"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleAcceptAllSuggestions();
                    }
                  }}
                >
                  <Sparkles size={16} className="mr-2" />
                  Accept All AI Suggestions
                </button>
              )}
            </div>
            
            {/* Data fields table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700 text-gray-400">
                    <th className="px-4 py-2 text-left font-medium">Field Name</th>
                    <th className="px-4 py-2 text-left font-medium">Example</th>
                    <th className="px-4 py-2 text-left font-medium">Data Categorization</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceFields.map(field => {
                    const isSelected = selectedRows.includes(field.id);
                    const suggestedCategory = aiSuggestions[field.id];
                    const mappedCategory = mappedFields[field.id];
                    const categoryObj = DATA_CATEGORIES.find(cat => cat.id === (mappedCategory || suggestedCategory));
                    
                    return (
                      <tr
                        key={field.id}
                        className={`border-t border-gray-700 ${isSelected ? 'bg-blue-900 bg-opacity-30' : ''} ${field.mapped ? 'opacity-60' : ''} hover:bg-gray-700 cursor-pointer`}
                        onClick={(e) => handleRowSelect(field.id, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRowSelect(field.id, e);
                          }
                        }}
                        tabIndex="0"
                        draggable
                        onDragStart={(e) => handleDragStart(e, selectedRows.includes(field.id) ? selectedRows : [field.id])}
                        data-field-id={field.id}
                      >
                        <td className="px-4 py-2 text-white">{field.name || field.sourceHeader || field.id}</td>
                        <td className="px-4 py-2 text-gray-400">{field.example}</td>
                        <td className="px-4 py-2">
                          {field.mapped ? (
                            <span className={`px-2 py-1 rounded-full text-xs text-${categoryObj?.color || 'gray'}-500 bg-${categoryObj?.color || 'gray'}-500 bg-opacity-20`}>
                              {categoryObj?.name || 'Unknown'}
                            </span>
                          ) : suggestedCategory ? (
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {(() => {
                                  const cat = DATA_CATEGORIES.find(cat => cat.id === suggestedCategory);
                                  const Icon = cat?.icon || Tag;
                                  return <Icon size={14} className={`text-${cat?.color || 'gray'}-500 mr-1.5`} />;
                                })()}
                                <span className="text-gray-400">{DATA_CATEGORIES.find(cat => cat.id === suggestedCategory)?.name}</span>
                              </div>
                              <button
                                type="button"
                                className="p-1 rounded-full bg-green-600 bg-opacity-20 text-green-500 hover:bg-opacity-30 transition-colors ml-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptSuggestion(field.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    handleAcceptSuggestion(field.id);
                                  }
                                }}
                                tabIndex="0"
                                aria-label={`Accept suggestion for ${field.name}`}
                              >
                                <Check size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500">Drag to assign</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Selection info */}
            {selectedRows.length > 0 && (
              <div className="mt-2 text-xs text-gray-400">
                {selectedRows.length} fields selected. Drag to assign to a category.
              </div>
            )}
          </div>
          
          {/* Right side: Category buckets */}
          <div className="w-full md:w-1/2">
            <h4 className="font-medium text-white mb-3">Data Categories</h4>
            <div className="space-y-4">
              {DATA_CATEGORIES.map(category => renderCategoryBucket(category))}
            </div>
          </div>
        </div>
      )}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Mapping Progress</h4>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                mappingStep === 'critical' 
                  ? (!mappingStatus.isCriticalComplete ? 'bg-vermilion-7 bg-opacity-20 text-vermilion-7' : 'bg-green-6 bg-opacity-20 text-green-6')
                  : mappingStatus.isComplete ? 'bg-green-6 bg-opacity-20 text-green-6' : 'bg-amber-500 bg-opacity-20 text-amber-500'
              }`}>
                {mappingStep === 'critical' 
                  ? (mappingStatus.isCriticalComplete ? 'Critical Fields Mapped' : 'Critical Fields Needed') 
                  : (mappingStatus.isComplete ? 'Complete' : 'In Progress')}
              </div>
            </div>

      {/* Tips section */}
      <div className="mt-8 p-4 bg-gray-800 rounded border border-gray-700">
        <h4 className="font-medium text-white mb-2">Tips for Data Mapping</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Drag and drop fields from the table to the category buckets on the right</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Use Ctrl/Cmd + click to select multiple fields for bulk mapping</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Shift + click to select a range of fields</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>The "Accept All AI Suggestions" button will map all fields based on AI recommendations</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataMapping;
