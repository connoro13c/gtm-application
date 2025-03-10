import React, { useState } from 'react';
import { CheckCircle, Info, Star, BarChart, TrendingUp, Brain } from 'lucide-react';

// Mock data for algorithm options
const ALGORITHM_OPTIONS = [
  {
    id: 'random-forest',
    name: 'Random Forest',
    description: 'A versatile ensemble learning method using multiple decision trees for robust predictions.',
    icon: TrendingUp,
    strengths: [
      'Handles both categorical and numerical data well',
      'Resistant to overfitting on large datasets',
      'Provides feature importance metrics'
    ],
    useCases: [
      'General-purpose scoring with diverse data types',
      'When explainability of scores is important',
      'For datasets with missing values'
    ],
    complexity: 'Medium',
    interpretability: 'High',
    dataRequirements: 'Moderate',
    recommended: true
  },
  {
    id: 'gradient-boost',
    name: 'Gradient Boosting',
    description: 'An advanced technique that builds models sequentially to correct errors from previous models.',
    icon: BarChart,
    strengths: [
      'Often achieves highest accuracy',
      'Handles imbalanced data well',
      'Effective with limited sample size'
    ],
    useCases: [
      'When maximizing prediction accuracy is critical',
      'For nuanced scoring with complex relationships',
      'When you have high-quality, clean data'
    ],
    complexity: 'High',
    interpretability: 'Medium',
    dataRequirements: 'High',
    recommended: false
  },
  {
    id: 'neural-network',
    name: 'Neural Network',
    description: 'Deep learning approach that can capture complex non-linear relationships in your data.',
    icon: Brain,
    strengths: [
      'Captures complex patterns and relationships',
      'Adapts well to diverse data types',
      'Can incorporate unstructured data (text, images)'
    ],
    useCases: [
      'When you have large amounts of data',
      'For incorporating diverse data types including unstructured data',
      'When pattern complexity exceeds traditional methods'
    ],
    complexity: 'Very High',
    interpretability: 'Low',
    dataRequirements: 'Very High',
    recommended: false
  }
];

// Mock data for previous algorithm configurations
const PREVIOUS_CONFIGURATIONS = [
  {
    id: 'prev-config-1',
    name: 'Q4 2024 Enterprise Scoring',
    algorithmType: 'random-forest',
    dateCreated: '2024-12-15',
    accuracy: 87.3,
    createdBy: 'Sarah Johnson'
  },
  {
    id: 'prev-config-2',
    name: 'Mid-Market Propensity Model',
    algorithmType: 'gradient-boost',
    dateCreated: '2024-11-03',
    accuracy: 91.2,
    createdBy: 'Michael Chen'
  },
  {
    id: 'prev-config-3',
    name: 'SMB Quick Assessment',
    algorithmType: 'random-forest',
    dateCreated: '2024-10-22',
    accuracy: 82.5,
    createdBy: 'Alex Rodriguez'
  }
];

const AlgorithmSelection = ({ data, updateData }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(data.selectedAlgorithm || null);
  const [selectedConfig, setSelectedConfig] = useState(data.selectedConfig || null);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(null);
  
  const handleAlgorithmSelect = (algorithmId) => {
    setSelectedAlgorithm(algorithmId);
    setSelectedConfig(null); // Clear selected configuration when algorithm changes
    
    updateData({
      selectedAlgorithm: algorithmId,
      selectedConfig: null
    });
  };
  
  const handleConfigSelect = (configId) => {
    const config = PREVIOUS_CONFIGURATIONS.find(c => c.id === configId);
    
    if (config) {
      setSelectedConfig(configId);
      setSelectedAlgorithm(config.algorithmType);
      
      updateData({
        selectedAlgorithm: config.algorithmType,
        selectedConfig: configId
      });
    }
  };
  
  const getAlgorithmById = (id) => {
    return ALGORITHM_OPTIONS.find(algo => algo.id === id) || null;
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-09 mb-2">Select Algorithm</h3>
        <p className="text-greyscale-8">
          Choose the algorithm that best fits your scoring needs, or start with a previous configuration.
        </p>
      </div>
      
      {/* Algorithm Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {ALGORITHM_OPTIONS.map(algorithm => (
          <button 
            key={algorithm.id}
            type="button"
            className={`p-4 rounded-lg border cursor-pointer transition-colors w-full text-left ${
              selectedAlgorithm === algorithm.id 
                ? 'border-vermilion-7 bg-vermilion-7 bg-opacity-5' 
                : 'border-greyscale-6 hover:border-greyscale-5'
            }`}
            onClick={() => handleAlgorithmSelect(algorithm.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-greyscale-5 flex items-center justify-center mr-3">
                  <algorithm.icon size={20} className="text-blue-5" />
                </div>
                <h4 className="font-medium text-white">{algorithm.name}</h4>
              </div>
              
              {algorithm.recommended && (
                <div className="px-2 py-1 bg-green-6 bg-opacity-20 rounded-full flex items-center">
                  <Star size={12} className="text-green-6 mr-1" />
                  <span className="text-xs text-green-6">Recommended</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-greyscale-7 mb-3">
              {algorithm.description}
            </p>
            
            <div className="flex justify-between text-xs text-greyscale-8 mb-3">
              <div>
                <div className="mb-1">Complexity</div>
                <div className={`font-medium ${
                  algorithm.complexity === 'Low' ? 'text-green-6' :
                  algorithm.complexity === 'Medium' ? 'text-blue-5' :
                  algorithm.complexity === 'High' ? 'text-amber-500' :
                  'text-vermilion-7'
                }`}>
                  {algorithm.complexity}
                </div>
              </div>
              
              <div>
                <div className="mb-1">Interpretability</div>
                <div className={`font-medium ${
                  algorithm.interpretability === 'High' ? 'text-green-6' :
                  algorithm.interpretability === 'Medium' ? 'text-blue-5' :
                  'text-vermilion-7'
                }`}>
                  {algorithm.interpretability}
                </div>
              </div>
              
              <div>
                <div className="mb-1">Data Needs</div>
                <div className={`font-medium ${
                  algorithm.dataRequirements === 'Low' ? 'text-green-6' :
                  algorithm.dataRequirements === 'Moderate' ? 'text-blue-5' :
                  algorithm.dataRequirements === 'High' ? 'text-amber-500' :
                  'text-vermilion-7'
                }`}>
                  {algorithm.dataRequirements}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="text-blue-5 text-sm hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAlgorithmInfo(algorithm.id);
                }}
              >
                <Info size={14} className="inline mr-1" />
                Learn More
              </button>
              
              {selectedAlgorithm === algorithm.id && (
                <CheckCircle size={18} className="text-vermilion-7" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      {/* Previous Configurations */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-09 mb-4">Previous Configurations</h3>
        
        <div className="space-y-3">
          {PREVIOUS_CONFIGURATIONS.map(config => (
            <button
              key={config.id}
              type="button"
              className={`p-4 rounded-lg border cursor-pointer transition-colors w-full text-left ${
                selectedConfig === config.id 
                  ? 'border-vermilion-7 bg-vermilion-7 bg-opacity-5' 
                  : 'border-greyscale-6 hover:border-greyscale-5'
              }`}
              onClick={() => handleConfigSelect(config.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{config.name}</h4>
                  <div className="text-sm text-greyscale-7 mt-1">
                    <span>
                      {getAlgorithmById(config.algorithmType)?.name || config.algorithmType}
                    </span>
                    <span className="mx-2">•</span>
                    <span>Created: {new Date(config.dateCreated).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>By: {config.createdBy}</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <div className="text-sm text-greyscale-7">Accuracy</div>
                    <div className={`font-medium ${
                      config.accuracy > 90 ? 'text-green-6' :
                      config.accuracy > 80 ? 'text-blue-5' :
                      'text-amber-500'
                    }`}>
                      {config.accuracy}%
                    </div>
                  </div>
                  
                  {selectedConfig === config.id && (
                    <CheckCircle size={18} className="text-vermilion-7" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Algorithm Info Modal */}
      {showAlgorithmInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-greyscale-3 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const algorithm = getAlgorithmById(showAlgorithmInfo);
              
              if (!algorithm) return null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-greyscale-5 flex items-center justify-center mr-3">
                        <algorithm.icon size={20} className="text-blue-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{algorithm.name}</h3>
                    </div>
                    
                    {algorithm.recommended && (
                      <div className="px-2 py-1 bg-green-6 bg-opacity-20 rounded-full flex items-center">
                        <Star size={12} className="text-green-6 mr-1" />
                        <span className="text-xs text-green-6">Recommended</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-greyscale-8 mb-6">
                    {algorithm.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-blue-09 mb-3">Key Strengths</h4>
                      <ul className="space-y-2">
                        {algorithm.strengths.map((strength) => (
                          <li key={`strength-${algorithm.id}-${strength}`} className="flex items-start">
                            <CheckCircle size={16} className="text-green-6 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-white">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-blue-09 mb-3">Ideal Use Cases</h4>
                      <ul className="space-y-2">
                        {algorithm.useCases.map((useCase) => (
                          <li key={`useCase-${algorithm.id}-${useCase}`} className="flex items-start">
                            <CheckCircle size={16} className="text-blue-5 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-white">{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-greyscale-4 rounded-lg">
                      <div className="text-sm text-greyscale-7 mb-1">Complexity</div>
                      <div className={`font-medium ${
                        algorithm.complexity === 'Low' ? 'text-green-6' :
                        algorithm.complexity === 'Medium' ? 'text-blue-5' :
                        algorithm.complexity === 'High' ? 'text-amber-500' :
                        'text-vermilion-7'
                      }`}>
                        {algorithm.complexity}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-greyscale-4 rounded-lg">
                      <div className="text-sm text-greyscale-7 mb-1">Interpretability</div>
                      <div className={`font-medium ${
                        algorithm.interpretability === 'High' ? 'text-green-6' :
                        algorithm.interpretability === 'Medium' ? 'text-blue-5' :
                        'text-vermilion-7'
                      }`}>
                        {algorithm.interpretability}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-greyscale-4 rounded-lg">
                      <div className="text-sm text-greyscale-7 mb-1">Data Requirements</div>
                      <div className={`font-medium ${
                        algorithm.dataRequirements === 'Low' ? 'text-green-6' :
                        algorithm.dataRequirements === 'Moderate' ? 'text-blue-5' :
                        algorithm.dataRequirements === 'High' ? 'text-amber-500' :
                        'text-vermilion-7'
                      }`}>
                        {algorithm.dataRequirements}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 border border-greyscale-6 rounded-md text-white"
                      onClick={() => setShowAlgorithmInfo(null)}
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      
      {/* Validation Message */}
      {!selectedAlgorithm && (
        <div className="mt-4 p-3 bg-amber-500 bg-opacity-20 text-amber-500 rounded-md">
          Please select an algorithm or previous configuration to proceed.
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelection;
