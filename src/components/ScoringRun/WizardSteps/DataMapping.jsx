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
  const [mappingProgress, setMappingProgress] = useState({
    total: 0,
    mapped: 0,
    percentage: 0
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
    }
  }, [mappedFields, sourceFields]);
  
  // Load source fields from the selected data source
  useEffect(() => {
    const loadSourceFields = async () => {
      setIsLoading(true);
      try {
        if (!data.dataSources || data.dataSources.length === 0) {
          setSourceFields([]);
          return;
        }
        
        // In a real implementation, this would be an API call to fetch fields from the selected data sources
        // For now, we'll simulate the API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // This would be the response from the API - simulating a CSV file with columns
        const mockFields = [
          { id: 'account_id', name: 'Account ID', dataType: 'string', example: 'ACC-12345', mapped: false },
          { id: 'company_name', name: 'Company Name', dataType: 'string', example: 'Acme Corp', mapped: false },
          { id: 'industry', name: 'Industry', dataType: 'string', example: 'Technology', mapped: false },
          { id: 'revenue', name: 'Annual Revenue', dataType: 'number', example: '$5.2M', mapped: false },
          { id: 'employees', name: 'Employee Count', dataType: 'number', example: '250', mapped: false },
          { id: 'country', name: 'Country', dataType: 'string', example: 'United States', mapped: false },
          { id: 'created_date', name: 'Created Date', dataType: 'date', example: '2023-06-15', mapped: false },
          { id: 'email_opens', name: 'Email Opens', dataType: 'number', example: '32', mapped: false },
          { id: 'website_visits', name: 'Website Visits', dataType: 'number', example: '128', mapped: false },
          { id: 'event_attendances', name: 'Event Attendances', dataType: 'number', example: '3', mapped: false },
          { id: 'health_score', name: 'Health Score', dataType: 'number', example: '85', mapped: false },
          { id: 'nps', name: 'NPS', dataType: 'number', example: '8', mapped: false },
          { id: 'support_tickets', name: 'Support Tickets', dataType: 'number', example: '5', mapped: false },
          { id: 'logins_per_month', name: 'Logins Per Month', dataType: 'number', example: '45', mapped: false },
          { id: 'active_users', name: 'Active Users', dataType: 'number', example: '12', mapped: false }
        ];
        
        setSourceFields(mockFields);
        
        // Generate AI suggestions after loading the data
        generateAiSuggestions(mockFields);
      } catch (error) {
        console.error('Error loading source fields:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSourceFields();
  }, [data.dataSources]);
  
  // Generate AI suggestions for field categorization
  const generateAiSuggestions = useCallback(async (fields) => {
    setIsProcessingAI(true);
    
    try {
      // In a real implementation, this would be an API call to an AI service
      // For now, we'll simulate AI suggestions with a timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock AI suggestions for field categorization
      const suggestions = {
        account_id: 'identification',
        company_name: 'identification',
        industry: 'firmographic',
        revenue: 'firmographic',
        employees: 'firmographic',
        country: 'firmographic',
        created_date: 'firmographic',
        email_opens: 'engagement',
        website_visits: 'engagement',
        event_attendances: 'marketing',
        health_score: 'health',
        nps: 'health',
        support_tickets: 'health',
        logins_per_month: 'product',
        active_users: 'product'
      };
      
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setIsProcessingAI(false);
    }
  }, []);
  
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
    <div className="data-mapping-container">
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
              <button
                type="button"
                className="flex items-center px-3 py-1.5 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAcceptAllSuggestions}
                disabled={isProcessingAI || Object.keys(aiSuggestions).length === 0}
                aria-label="Accept all AI suggestions"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleAcceptAllSuggestions();
                  }
                }}
              >
                <Sparkles size={14} className="mr-1.5" />
                Accept All AI Suggestions
              </button>
            </div>
            
            {/* Data fields table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700 text-gray-400">
                    <th className="px-4 py-2 text-left font-medium">ID</th>
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">Example</th>
                    <th className="px-4 py-2 text-left font-medium">Category</th>
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
                        <td className="px-4 py-2 text-white">{field.id}</td>
                        <td className="px-4 py-2 text-white">{field.name}</td>
                        <td className="px-4 py-2 text-gray-400">{field.example}</td>
                        <td className="px-4 py-2">
                          {field.mapped ? (
                            <span className={`px-2 py-1 rounded-full text-xs text-${categoryObj?.color || 'gray'}-500 bg-${categoryObj?.color || 'gray'}-500 bg-opacity-20`}>
                              {categoryObj?.name || 'Unknown'}
                            </span>
                          ) : suggestedCategory ? (
                            <div className="flex items-center">
                              <span className="text-gray-400 mr-2">AI: {DATA_CATEGORIES.find(cat => cat.id === suggestedCategory)?.name}</span>
                              <button
                                type="button"
                                className="p-1 rounded-full bg-green-600 bg-opacity-20 text-green-500 hover:bg-opacity-30 transition-colors"
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
