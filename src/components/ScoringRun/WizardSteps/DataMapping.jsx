import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, ArrowRight, Sparkles, Database, Key, FileText, ThumbsUp, ThumbsDown, Tag, Layers, Check, X } from 'lucide-react';

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
  
  // Refs for drag and drop functionality
  const dragSourceRef = useRef(null);
  const dragTargetRef = useRef(null);
  
  // Update parent component when mappings change
  useEffect(() => {
    updateData({ dataMapping: mappedFields });
  }, [mappedFields, updateData]);
  
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
      dragImage.style.backgroundColor = '#2563eb';
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
        className={`p-4 bg-greyscale-4 rounded-lg mb-3 border-2 border-dashed border-greyscale-6 hover:border-${category.color}-600 transition-colors`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(category.id)}
      >
        <div className="flex items-center mb-2">
          <CategoryIcon size={16} className={`text-${category.color}-500 mr-2`} />
          <h4 className="font-medium text-white">{category.name}</h4>
          <span className="ml-auto text-xs text-greyscale-7 bg-greyscale-5 px-2 py-1 rounded-full">
            {mappedCategoryFields.length} fields
          </span>
        </div>
        
        <div className="space-y-2">
          {mappedCategoryFields.map(field => (
            <div 
              key={field.id} 
              className="flex items-center p-2 bg-greyscale-5 rounded text-sm text-white"
            >
              <span className="truncate">{field.name}</span>
              <button
                type="button"
                className="ml-auto text-greyscale-7 hover:text-vermilion-7 transition-colors"
                onClick={() => handleRemoveMapping(field.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleRemoveMapping(field.id);
                  }
                }}
                aria-label={`Remove ${field.name} from ${category.name}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {mappedCategoryFields.length === 0 && (
            <div className="text-center py-4 text-sm text-greyscale-7">
              <p>Drag fields here</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="data-mapping-container">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-09 mb-2">Map Your Data Fields</h3>
        <p className="text-greyscale-8">
          Drag and drop fields from your data source into the appropriate categories.
          You can also use the AI suggestions to automatically categorize your fields.
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-5 mx-auto mb-4"></div>
          <p className="text-greyscale-8">Loading your data fields...</p>
        </div>
      ) : sourceFields.length === 0 ? (
        <div className="text-center py-12 bg-greyscale-3 rounded-lg">
          <Database size={48} className="text-greyscale-7 mx-auto mb-4" />
          <h4 className="text-white font-medium mb-2">No Fields Available</h4>
          <p className="text-greyscale-8 mb-4">
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
                className="flex items-center px-3 py-1.5 bg-blue-7 rounded-md text-white text-sm hover:bg-blue-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-greyscale-3 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-greyscale-4 text-greyscale-7">
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
                        className={`border-t border-greyscale-5 ${isSelected ? 'bg-blue-900 bg-opacity-30' : ''} ${field.mapped ? 'opacity-60' : ''}`}
                        onClick={(e) => handleRowSelect(field.id, e)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, selectedRows.includes(field.id) ? selectedRows : [field.id])}
                        data-field-id={field.id}
                      >
                        <td className="px-4 py-2 text-white">{field.id}</td>
                        <td className="px-4 py-2 text-white">{field.name}</td>
                        <td className="px-4 py-2 text-greyscale-7">{field.example}</td>
                        <td className="px-4 py-2">
                          {field.mapped ? (
                            <span className={`px-2 py-1 rounded-full text-xs text-${categoryObj?.color || 'gray'}-500 bg-${categoryObj?.color || 'gray'}-500 bg-opacity-20`}>
                              {categoryObj?.name || 'Unknown'}
                            </span>
                          ) : suggestedCategory ? (
                            <div className="flex items-center">
                              <span className="text-greyscale-7 mr-2">AI: {DATA_CATEGORIES.find(cat => cat.id === suggestedCategory)?.name}</span>
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
                                aria-label={`Accept suggestion for ${field.name}`}
                              >
                                <Check size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-greyscale-7">Drag to assign</span>
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
              <div className="mt-2 text-xs text-greyscale-7">
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-greyscale-7">Critical Fields (ID & Name)</div>
                <div className="text-lg font-medium text-white">
                  {mappingStatus.criticalMapped} / {mappingStatus.criticalTotal}
                  <span className="text-sm text-greyscale-7 ml-2">
                    ({Math.round((mappingStatus.criticalMapped / mappingStatus.criticalTotal) * 100)}%)
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-greyscale-7">Required Fields</div>
                <div className="text-lg font-medium text-white">
                  {mappingStatus.requiredMapped} / {mappingStatus.requiredTotal}
                  <span className="text-sm text-greyscale-7 ml-2">
                    ({Math.round((mappingStatus.requiredMapped / mappingStatus.requiredTotal) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 relative h-2 bg-greyscale-6 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${
                  mappingStep === 'critical' 
                    ? (!mappingStatus.isCriticalComplete ? 'bg-vermilion-7' : 'bg-green-6')
                    : mappingStatus.isComplete ? 'bg-green-6' : 'bg-amber-500'
                }`}
                style={{ width: mappingStep === 'critical' 
                  ? `${(mappingStatus.criticalMapped / mappingStatus.criticalTotal) * 100}%`
                  : `${(mappingStatus.requiredMapped / mappingStatus.requiredTotal) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* AI Suggestions Section - Only show in critical step */}
      {mappingStep === 'critical' && aiSuggestions && (
        <div className="mb-6 p-4 bg-blue-7 bg-opacity-10 rounded-lg border border-blue-7 border-opacity-20">
          <div className="flex items-center mb-3">
            <Sparkles size={18} className="text-blue-5 mr-2" />
            <h4 className="font-medium text-blue-09">AI-Suggested Field Mappings</h4>
          </div>
          
          <p className="text-greyscale-8 mb-4 text-sm">
            Our AI has analyzed your data structure and suggested the following mappings for critical fields:
          </p>
          
          {/* ID Field Suggestion */}
          {aiSuggestions.idField && (
            <div className="mb-4 p-3 bg-greyscale-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Key size={16} className="text-blue-5 mr-2" />
                  <span className="font-medium text-white">Unique ID Field</span>
                </div>
                <div className="px-2 py-1 rounded-full text-xs text-blue-5">
                  {aiSuggestions.idConfidence}% confidence
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-greyscale-5 rounded mb-3">
                <div>
                  <span className="text-white font-medium">{aiSuggestions.idField.name}</span>
                  <span className="text-xs text-greyscale-7 ml-2">from {aiSuggestions.idField.source}</span>
                </div>
                <div className="flex items-center">
                  <button 
                    type="button"
                    className="p-1 bg-green-6 bg-opacity-20 text-green-6 rounded hover:bg-opacity-30 transition-colors"
                    onClick={() => handleAcceptSuggestion(aiSuggestions.idField.id, 'account_id')}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button 
                    type="button"
                    className="p-1 bg-vermilion-7 bg-opacity-20 text-vermilion-7 rounded hover:bg-opacity-30 transition-colors"
                    onClick={() => handleRejectSuggestion('id')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleRejectSuggestion('id');
                      }
                    }}
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-greyscale-7">
                <span className="font-medium">Sample values:</span> {aiSuggestions.idField.sampleValues.join(', ')}
              </div>
            </div>
          )}
          
          {/* Name Field Suggestion */}
          {aiSuggestions.nameField && (
            <div className="p-3 bg-greyscale-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FileText size={16} className="text-blue-5 mr-2" />
                  <span className="font-medium text-white">Account Name Field</span>
                </div>
                <div className="px-2 py-1 bg-blue-5 bg-opacity-20 rounded-full text-xs text-blue-5">
                  {aiSuggestions.nameConfidence}% confidence
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-greyscale-5 rounded mb-3">
                <div>
                  <span className="text-white font-medium">{aiSuggestions.nameField.name}</span>
                  <span className="text-xs text-greyscale-7 ml-2">from {aiSuggestions.nameField.source}</span>
                </div>
                <div className="flex items-center">
                  <button 
                    type="button"
                    className="p-1 bg-green-6 bg-opacity-20 text-green-6 rounded hover:bg-opacity-30 transition-colors"
                    onClick={() => handleAcceptSuggestion(aiSuggestions.nameField.id, 'account_name')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleAcceptSuggestion(aiSuggestions.nameField.id, 'account_name');
                      }
                    }}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button 
                    type="button"
                    className="p-1 bg-vermilion-7 bg-opacity-20 text-vermilion-7 rounded hover:bg-opacity-30 transition-colors"
                    onClick={() => handleRejectSuggestion('name')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleRejectSuggestion('name');
                      }
                    }}
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-greyscale-7">
                <span className="font-medium">Sample values:</span> {aiSuggestions.nameField.sampleValues.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Category Tabs - Only show after critical fields are mapped */}
      {(mappingStep !== 'critical' || mappingStatus.isCriticalComplete) && (
        <div className="mb-4 border-b border-greyscale-6">
          <div className="flex space-x-4 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                className={`py-2 px-4 border-b-2 whitespace-nowrap ${
                  activeCategory === category 
                    ? 'border-vermilion-7 text-vermilion-7' 
                    : 'border-transparent text-greyscale-7 hover:text-white'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Data Preview Table - Only show after critical fields are mapped */}
      {!isLoading && showDataPreview && sampleData.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">Data Preview</h4>
            <button 
              type="button"
              className="text-xs text-blue-5 hover:text-blue-4 transition-colors"
              onClick={() => setShowDataPreview(!showDataPreview)}
            >
              {showDataPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {/* Find the ID and Name fields that are mapped */}
                  {Object.entries(mappings).map(([sourceId, targetId]) => {
                    if (targetId === 'account_id' || targetId === 'account_name') {
                      const sourceField = sourceFields.find(f => f.id === sourceId);
                      return (
                        <th 
                          key={sourceId} 
                          className="p-2 bg-greyscale-5 text-left text-xs font-medium text-greyscale-8 border-b border-greyscale-6"
                        >
                          {sourceField?.name || 'Unknown Field'}
                        </th>
                      );
                    }
                    return null;
                  }).filter(Boolean)}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, index) => {
                  // Create a unique key from the row data or fall back to index
                  const rowKey = Object.values(row).join('-') || `row-${index}`;
                  return (
                  <tr key={rowKey} className={index % 2 === 0 ? 'bg-greyscale-4' : 'bg-greyscale-3'}>
                    {Object.entries(mappings).map(([sourceId, targetId]) => {
                      if (targetId === 'account_id' || targetId === 'account_name') {
                        return (
                          <td 
                            key={sourceId} 
                            className="p-2 text-sm text-white border-b border-greyscale-6"
                          >
                            {row[sourceId] || '-'}
                          </td>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          
          <div className="mt-2 text-xs text-greyscale-7 text-right">
            Showing {sampleData.length} sample records
          </div>
        </div>
      )}
      
      {/* Mapping Interface */}
      <div className="space-y-4">
        {filteredTargetFields.map(targetField => {
          // Skip this field if we're in critical step and it's not a critical field
          if (mappingStep === 'critical' && !targetField.critical) {
            return null;
          }
          
          // Skip this field if we're in required step and it's not required or it's critical
          if (mappingStep === 'required' && (!targetField.required || targetField.critical)) {
            return null;
          }
          
          // Skip this field if we're in optional step and it's required
          if (mappingStep === 'optional' && targetField.required) {
            return null;
          }
          
          // Find source fields that map to this target field
          const mappedSourceFieldIds = Object.entries(mappings)
            .filter(([_, targetId]) => targetId === targetField.id)
            .map(([sourceId]) => sourceId);
          
          const mappedSourceFields = sourceFields.filter(field => 
            mappedSourceFieldIds.includes(field.id)
          );
          
          return (
            <div key={targetField.id} className="p-4 bg-greyscale-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-white">{targetField.name}</h4>
                    <span className="ml-2 px-2 py-0.5 bg-greyscale-6 rounded-full text-xs text-greyscale-8">
                      {targetField.category}
                    </span>
                    {targetField.required && (
                      <span className="ml-2 px-2 py-0.5 bg-vermilion-7 bg-opacity-20 rounded-full text-xs text-vermilion-7">
                        Required
                      </span>
                    )}
                    <button
                      type="button"
                      className="ml-2 text-greyscale-7 hover:text-white"
                      title={targetField.description}
                      aria-label={`Help for ${targetField.name}: ${targetField.description}`}
                    >
                      <HelpCircle size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-greyscale-7 mt-1">{targetField.description}</p>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  mappedSourceFields.length > 0 
                    ? 'bg-green-6 bg-opacity-20 text-green-6' 
                    : targetField.required ? 'bg-vermilion-7 bg-opacity-20 text-vermilion-7' : 'bg-greyscale-6 text-greyscale-8'
                }`}>
                  {mappedSourceFields.length > 0 ? 'Mapped' : 'Unmapped'}
                </div>
              </div>
              
              {/* Mapped Source Fields */}
              {mappedSourceFields.length > 0 && (
                <div className="mb-3 space-y-2">
                  {mappedSourceFields.map(sourceField => (
                    <div key={sourceField.id} className="flex items-center justify-between p-2 bg-greyscale-5 rounded">
                      <div className="flex items-center">
                        <CheckCircle size={14} className="text-green-6 mr-2" />
                        <span className="text-white">{sourceField.name}</span>
                        <span className="ml-2 text-xs text-greyscale-7">from {sourceField.source}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="mr-3 text-xs text-greyscale-7">
                          <span className="font-medium">Type:</span> {sourceField.dataType}
                        </div>
                        <button
                          type="button"
                          className="text-vermilion-7 hover:text-vermilion-6 text-sm"
                          onClick={() => handleMappingChange(sourceField.id, null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleMappingChange(sourceField.id, null);
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Sample Values for Mapped Fields */}
              {mappedSourceFields.length > 0 && (
                <div className="mb-3 p-2 bg-greyscale-5 rounded text-xs text-greyscale-7">
                  <span className="font-medium">Sample values:</span>{' '}
                  {mappedSourceFields.map(field => field.sampleValues.join(', ')).join(' | ')}
                </div>
              )}
              
              {/* Add Mapping Dropdown */}
              <div className="mt-3">
                <select
                  className="w-full p-2 bg-greyscale-3 border border-greyscale-6 rounded text-white"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleMappingChange(e.target.value, targetField.id);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">+ Add field mapping</option>
                  {filteredSourceFields
                    .filter(field => !(field.id in mappings && mappings[field.id]))
                    .map(field => (
                      <option key={field.id} value={field.id}>
                        {field.name} ({field.source}) - {field.dataType}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          );
        }).filter(Boolean)}
      </div>
      
      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        {mappingStep !== 'critical' && (
          <button
            type="button"
            className="px-4 py-2 border border-greyscale-6 rounded-md text-white hover:bg-greyscale-6 transition-colors"
            onClick={() => setMappingStep(mappingStep === 'optional' ? 'required' : 'critical')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setMappingStep(mappingStep === 'optional' ? 'required' : 'critical');
              }
            }}
          >
            Back
          </button>
        )}
        
        <div className="ml-auto">
          {mappingStep === 'critical' && mappingStatus.isCriticalComplete && (
            <button
              type="button"
              className="px-4 py-2 bg-blue-7 rounded-md text-white hover:bg-blue-6 transition-colors"
              onClick={() => setMappingStep('required')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setMappingStep('required');
                }
              }}
            >
              Continue to Required Fields
            </button>
          )}
          
          {mappingStep === 'required' && mappingStatus.isComplete && (
            <button
              type="button"
              className="px-4 py-2 bg-blue-7 rounded-md text-white hover:bg-blue-6 transition-colors"
              onClick={() => setMappingStep('optional')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setMappingStep('optional');
                }
              }}
            >
              Continue to Optional Fields
            </button>
          )}
        </div>
      </div>
      
      {/* Unmapped Required Fields Warning */}
      {((mappingStep === 'critical' && !mappingStatus.isCriticalComplete) || 
         (mappingStep === 'required' && !mappingStatus.isComplete)) && (
        <div className="mt-6 p-3 bg-vermilion-7 bg-opacity-20 text-vermilion-7 rounded-md flex items-start">
          <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {mappingStep === 'critical' ? 'Critical fields not mapped' : 'Required fields not mapped'}
            </p>
            <p className="text-sm mt-1">
              {mappingStep === 'critical' 
                ? `${mappingStatus.criticalTotal - mappingStatus.criticalMapped} critical fields need to be mapped before proceeding.`
                : `${mappingStatus.requiredTotal - mappingStatus.requiredMapped} required fields need to be mapped before proceeding.`
              }
            </p>
            <ul className="mt-2 text-sm list-disc list-inside">
              {targetFields
                .filter(field => 
                  (mappingStep === 'critical' && field.critical) || 
                  (mappingStep === 'required' && field.required && !field.critical)
                )
                .filter(field => {
                  const isMapped = Object.values(mappings).includes(field.id);
                  return !isMapped;
                })
                .map(field => (
                  <li key={field.id}>{field.name}</li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataMapping;
