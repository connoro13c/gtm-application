import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Database, Key, Tag, Layers, Check, X, AlertTriangle } from 'lucide-react';

// Data categories based on wireframe
const DATA_CATEGORIES = [
  { id: 'firmographic', name: 'Firmographic', icon: Database, color: 'green' },
  { id: 'sales', name: 'Sales Engagement', icon: ArrowRight, color: 'blue' },
  { id: 'marketing', name: 'Marketing Engagement', icon: Tag, color: 'purple' },
  { id: 'customer', name: 'Customer Health', icon: Check, color: 'amber' },
  { id: 'product', name: 'Product Usage', icon: Layers, color: 'indigo' },
  { id: 'identifier', name: 'Unique Identifier', icon: Key, color: 'red' },
  { id: 'other', name: 'Other', icon: Tag, color: 'gray' }
];

const DataMapping = ({ data, updateData }) => {
  // State for tracking mapping
  const [sourceFields, setSourceFields] = useState([]);
  const [mappedFields, setMappedFields] = useState(data.dataMapping || {});
  const [selectedRows, setSelectedRows] = useState([]);
  const [draggedFields, setDraggedFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mappingProgress, setMappingProgress] = useState({ total: 0, mapped: 0, percentage: 0 });
  const [hasCriticalMappings, setHasCriticalMappings] = useState(false);
  
  // Load source fields from uploaded files
  useEffect(() => {
    if (data.uploadedFiles && data.uploadedFiles.length > 0) {
      // Extract fields from all uploaded files
      const fields = data.uploadedFiles.flatMap((file) => {
        if (file.structure && file.structure.headers) {
          return file.structure.headers.map(header => ({
            id: `${file.id}_${header}`,
            name: header,
            sourceFile: file.name,
            sourceFileId: file.id,
            example: file.structure.sampleData?.[0]?.[header] || '',
            dataType: guessDataType(file.structure.sampleData?.[0]?.[header]),
            mapped: false
          }));
        }
        return [];
      });
      
      setSourceFields(fields);
      setMappingProgress({
        total: fields.length,
        mapped: Object.keys(mappedFields).length,
        percentage: fields.length > 0 ? Math.round((Object.keys(mappedFields).length / fields.length) * 100) : 0
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [data.uploadedFiles, mappedFields]);
  
  // Update parent component when mappings change
  useEffect(() => {
    updateData({ dataMapping: mappedFields });
    
    // Check if we have critical ID mappings
    const hasIdMapping = Object.values(mappedFields).includes('identifier');
    setHasCriticalMappings(hasIdMapping);
    
    // Update mapping progress
    if (sourceFields.length > 0) {
      setMappingProgress({
        total: sourceFields.length,
        mapped: Object.keys(mappedFields).length,
        percentage: Math.round((Object.keys(mappedFields).length / sourceFields.length) * 100)
      });
    }
  }, [mappedFields, sourceFields.length, updateData]);
  
  // Helper to guess data type from a value
  const guessDataType = (value) => {
    if (value === undefined || value === null) return 'unknown';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string') {
      // Check for date patterns
      if (/^\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}/.test(value)) return 'date';
      // Check if string is numeric
      if (!isNaN(value) && !isNaN(parseFloat(value))) return 'number';
      return 'string';
    }
    return 'unknown';
  };
  
  // Handle row selection
  const handleRowSelect = (fieldId, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Toggle selection with ctrl/cmd key
      setSelectedRows(prev =>
        prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]
      );
    } else if (event.shiftKey && selectedRows.length > 0) {
      // Range selection with shift key
      const allIds = sourceFields.map(f => f.id);
      const lastSelectedIndex = allIds.indexOf(selectedRows[selectedRows.length - 1]);
      const currentIndex = allIds.indexOf(fieldId);
      const start = Math.min(lastSelectedIndex, currentIndex);
      const end = Math.max(lastSelectedIndex, currentIndex);
      const rangeSelection = allIds.slice(start, end + 1);
      setSelectedRows([...new Set([...selectedRows, ...rangeSelection])]);
    } else {
      // Single selection
      setSelectedRows([fieldId]);
    }
  };
  
  // Handle drag start
  const handleDragStart = (event, fieldId) => {
    if (selectedRows.includes(fieldId)) {
      setDraggedFields(selectedRows);
    } else {
      setDraggedFields([fieldId]);
      setSelectedRows([fieldId]);
    }
    
    // Create a drag image
    if (selectedRows.length > 1) {
      const dragImage = document.createElement('div');
      dragImage.textContent = `${selectedRows.length} fields`;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      dragImage.style.padding = '4px 8px';
      dragImage.style.background = 'rgba(59, 130, 246, 0.9)';
      dragImage.style.color = 'white';
      dragImage.style.borderRadius = '4px';
      document.body.appendChild(dragImage);
      event.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };
  
  // Handle drop on category
  const handleDrop = (categoryId) => {
    const newMappings = { ...mappedFields };
    draggedFields.forEach(fieldId => {
      newMappings[fieldId] = categoryId;
    });
    setMappedFields(newMappings);
    setDraggedFields([]);
    setSelectedRows([]);
  };
  
  // Remove a field mapping
  const handleRemoveMapping = (fieldId) => {
    const newMappings = { ...mappedFields };
    delete newMappings[fieldId];
    setMappedFields(newMappings);
  };
  
  // Get fields mapped to a category
  const getFieldsByCategory = (categoryId) => {
    return sourceFields.filter(field => mappedFields[field.id] === categoryId);
  };
  
  // Auto-map fields based on field names and data patterns
  const generateSuggestions = () => {
    const newMappings = { ...mappedFields };
    
    sourceFields.forEach(field => {
      if (newMappings[field.id]) return; // Skip already mapped fields
      
      const name = field.name.toLowerCase();
      
      // Map based on field name patterns
      if (name.includes('id') || name.includes('identifier') || name.includes('key')) {
        newMappings[field.id] = 'identifier';
      } else if (name.includes('industry') || name.includes('revenue') || name.includes('employee')) {
        newMappings[field.id] = 'firmographic';
      } else if (name.includes('sale') || name.includes('opportunity') || name.includes('deal')) {
        newMappings[field.id] = 'sales';
      } else if (name.includes('campaign') || name.includes('lead') || name.includes('marketing')) {
        newMappings[field.id] = 'marketing';
      } else if (name.includes('health') || name.includes('nps') || name.includes('csat')) {
        newMappings[field.id] = 'customer';
      } else if (name.includes('usage') || name.includes('login') || name.includes('active')) {
        newMappings[field.id] = 'product';
      } else {
        // Default map based on known common field patterns
        if (name === 'account name' || name === 'company') {
          newMappings[field.id] = 'firmographic';
        } else if (name === 'region' || name === 'country') {
          newMappings[field.id] = 'firmographic';
        } else if (name.includes('score')) {
          newMappings[field.id] = 'customer';
        } else {
          newMappings[field.id] = 'other';
        }
      }
    });
    
    setMappedFields(newMappings);
  };
  
  return (
    <div className="data-mapping-container">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-500 mb-2">Map Your Data Fields</h3>
        <p className="text-gray-300 mb-4">
          Drag and drop fields from your data source into the appropriate categories.
          Make sure to map at least one field as a Unique Identifier.
        </p>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-300">Mapping Progress</span>
            <span className="text-sm text-gray-300">
              {mappingProgress.mapped} of {mappingProgress.total} fields mapped ({mappingProgress.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${hasCriticalMappings ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${mappingProgress.percentage}%` }}
            ></div>
          </div>
          
          {/* Critical fields warning */}
          {!hasCriticalMappings && mappingProgress.mapped > 0 && (
            <div className="mt-2 text-sm text-amber-400 flex items-center">
              <AlertTriangle size={16} className="mr-2" />
              You need to map at least one field as a Unique Identifier
            </div>
          )}
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
            We couldn't find any fields in your uploaded files. Please go back and upload files with data.
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left panel: Source fields */}
          <div className="w-full md:w-1/2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Source Fields</h4>
              
              <button
                type="button"
                className="flex items-center px-4 py-2 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-600 transition-colors"
                onClick={generateSuggestions}
              >
                <Sparkles size={16} className="mr-2" />
                Auto-Map Fields
              </button>
            </div>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700 text-gray-400">
                    <th className="px-4 py-2 text-left font-medium">Field Name</th>
                    <th className="px-4 py-2 text-left font-medium">Type</th>
                    <th className="px-4 py-2 text-left font-medium">Example</th>
                    <th className="px-4 py-2 text-left font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceFields.map(field => {
                    const isSelected = selectedRows.includes(field.id);
                    const mappedCategory = mappedFields[field.id];
                    const categoryObj = DATA_CATEGORIES.find(cat => cat.id === mappedCategory);
                    
                    return (
                      <tr
                        key={field.id}
                        className={`border-t border-gray-700 ${isSelected ? 'bg-blue-900 bg-opacity-30' : ''} hover:bg-gray-700 cursor-pointer`}
                        onClick={(e) => handleRowSelect(field.id, e)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, field.id)}
                      >
                        <td className="px-4 py-2 text-white">{field.name}</td>
                        <td className="px-4 py-2 text-gray-400">
                          <span className="capitalize">{field.dataType}</span>
                        </td>
                        <td className="px-4 py-2 text-gray-400 truncate max-w-[120px]">{field.example}</td>
                        <td className="px-4 py-2">
                          {mappedCategory ? (
                            <span className={`px-2 py-1 rounded-full text-xs text-${categoryObj?.color || 'gray'}-500 bg-${categoryObj?.color || 'gray'}-500 bg-opacity-20`}>
                              {categoryObj?.name || 'Unknown'}
                            </span>
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
            
            {selectedRows.length > 0 && (
              <div className="mt-2 text-xs text-gray-400">
                {selectedRows.length} fields selected. Drag to assign to a category.
              </div>
            )}
          </div>
          
          {/* Right panel: Category buckets */}
          <div className="w-full md:w-1/2">
            <h4 className="font-medium text-white mb-3">Data Categories</h4>
            
            <div className="space-y-4">
              {DATA_CATEGORIES.map(category => {
                const CategoryIcon = category.icon;
                const mappedCategoryFields = getFieldsByCategory(category.id);
                
                return (
                  <div
                    key={category.id}
                    className={`p-4 bg-gray-800 rounded-lg border-2 border-dashed ${category.id === 'identifier' && !mappedCategoryFields.length ? 'border-red-500 bg-red-500 bg-opacity-10' : `border-gray-700 hover:border-${category.color}-600`} transition-all`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(category.id)}
                  >
                    <div className="flex items-center mb-3">
                      <CategoryIcon size={18} className={`text-${category.color}-500 mr-2`} />
                      <h5 className="font-medium text-white">{category.name}</h5>
                      {category.id === 'identifier' && (
                        <span className="ml-2 text-xs text-red-500 bg-red-500 bg-opacity-10 px-2 py-0.5 rounded">
                          Required
                        </span>
                      )}
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
                            aria-label={`Remove ${field.name} from ${category.name}`}
                          >
                            <X size={14} />
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
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Tips section */}
      <div className="mt-8 p-4 bg-gray-800 rounded border border-gray-700">
        <h4 className="font-medium text-white mb-2">Tips for Data Mapping</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">u2022</span>
            <span>You <strong>must</strong> map at least one field as a Unique Identifier (account ID, domain, etc.)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">u2022</span>
            <span>Use Ctrl/Cmd + click to select multiple fields for bulk mapping</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">u2022</span>
            <span>Shift + click to select a range of fields</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">u2022</span>
            <span>The "Auto-Map Fields" button will automatically categorize your fields based on their names</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataMapping;