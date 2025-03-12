import React, { useState } from 'react';
import {
  Database,
  FileText,
  FileSpreadsheet,
  Layers,
  MessageSquare,
  BarChart,
  Users
} from 'lucide-react';

const DataSourceSelection = ({ data, updateData }) => {
  const [selectedSource, setSelectedSource] = useState(data.selectedDataSource || null);

  // Data sources organized by category as per the wireframe
  const DATA_SOURCES = {
    crm: [
      { id: 'salesforce', name: 'Salesforce', icon: Database, color: 'blue' },
      { id: 'hubspot', name: 'HubSpot', icon: Database, color: 'orange' }
    ],
    marketing: [
      { id: '6sense', name: '6sense', icon: BarChart, color: 'green' },
      { id: 'clay', name: 'Clay', icon: Users, color: 'purple' },
      { id: 'marketo', name: 'Marketo', icon: MessageSquare, color: 'pink' }
    ],
    postsales: [
      { id: 'gainsight', name: 'Gainsight', icon: BarChart, color: 'blue' },
      { id: 'totango', name: 'Totango', icon: Layers, color: 'teal' },
      { id: 'vitaly', name: 'Vitaly', icon: Users, color: 'indigo' }
    ],
    product: [
      { id: 'amplitude', name: 'Amplitude', icon: BarChart, color: 'blue' },
      { id: 'mixpanel', name: 'Mixpanel', icon: BarChart, color: 'purple' },
      { id: 'heap', name: 'Heap', icon: Layers, color: 'orange' },
      { id: 'segment', name: 'Segment', icon: Layers, color: 'green' }
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

  // Handle data source selection
  const handleSourceSelect = (category, source) => {
    setSelectedSource({
      ...source,
      category
    });
    
    // Update parent component
    updateData({
      selectedDataSource: {
        ...source,
        category
      }
    });
  };

  return (
    <div className="data-source-container">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-500 mb-2">Select Data Source</h3>
        <p className="text-gray-300 mb-4">
          Choose a data source to load information from. Select from the categories below.
        </p>
      </div>
      
      {/* Source Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(DATA_SOURCES).map(([category, sources]) => {
          const displayNames = {
            crm: 'CRM & Sales Data',
            marketing: 'Marketing Tools',
            postsales: 'Post-sales Data',
            product: 'Product Usage Data',
            manual: 'Manual Data Sources',
            custom: 'Custom Integration'
          };
          
          return (
            <div key={category} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="mb-4 pb-2 border-b border-gray-700">
                <h4 className="font-medium text-white">{displayNames[category]}</h4>
                <p className="text-sm text-gray-400">{sources.length} sources available</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {sources.map(source => {
                  const SourceIcon = source.icon;
                  const isSelected = selectedSource?.id === source.id;
                  
                  return (
                    <button
                      key={source.id}
                      className={`p-3 rounded-lg border text-left ${isSelected ? `border-${source.color}-500 bg-${source.color}-500 bg-opacity-10` : 'border-gray-700'} hover:border-${source.color}-500 hover:bg-${source.color}-500 hover:bg-opacity-5 transition-colors`}
                      onClick={() => handleSourceSelect(category, source)}
                    >
                      <div className="flex items-center">
                        <SourceIcon className={`mr-2 text-${source.color}-500`} size={18} />
                        <span className="text-white text-sm">{source.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected Source Information */}
      {selectedSource && (
        <div className="p-4 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-500">
          <h4 className="text-white font-medium mb-2">Selected: {selectedSource.name}</h4>
          <p className="text-sm text-gray-300">
            You've selected {selectedSource.name} as your data source. Click "Next" to proceed with 
            setting up this data source and loading your data.
          </p>
        </div>
      )}
      
      {/* Tips section */}
      <div className="mt-8 p-4 bg-gray-800 rounded border border-gray-700">
        <h4 className="font-medium text-white mb-2">Tips for Selecting a Data Source</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Choose the data source that contains your most accurate and up-to-date account information</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>CRM data (Salesforce, HubSpot) typically provides core account information</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>Marketing and product usage tools offer engagement and activity data</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-blue-500">•</span>
            <span>For CSV uploads, ensure your data is properly formatted with headers</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataSourceSelection;