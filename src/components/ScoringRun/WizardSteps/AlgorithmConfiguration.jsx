import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, BarChart, TrendingUp, AlertTriangle } from 'lucide-react';

// Mock data for algorithm parameters
const MOCK_ALGORITHM_PARAMS = {
  'random-forest': [
    {
      id: 'num_trees',
      name: 'Number of Trees',
      description: 'The number of decision trees in the forest. More trees can improve accuracy but increase computation time.',
      min: 50,
      max: 500,
      default: 100,
      step: 10,
      impact: 'Medium',
      category: 'Model Structure'
    },
    {
      id: 'max_depth',
      name: 'Maximum Tree Depth',
      description: 'The maximum depth of each decision tree. Deeper trees can model more complex patterns but may overfit.',
      min: 3,
      max: 30,
      default: 10,
      step: 1,
      impact: 'High',
      category: 'Model Structure'
    },
    {
      id: 'min_samples_split',
      name: 'Minimum Samples to Split',
      description: 'The minimum number of samples required to split an internal node. Higher values prevent overfitting.',
      min: 2,
      max: 20,
      default: 5,
      step: 1,
      impact: 'Medium',
      category: 'Model Structure'
    },
    {
      id: 'firmographic_weight',
      name: 'Firmographic Data Weight',
      description: 'The weight given to firmographic data (industry, size, revenue) in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 35,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'engagement_weight',
      name: 'Engagement Data Weight',
      description: 'The weight given to engagement data (website visits, email opens, etc.) in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 25,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'product_usage_weight',
      name: 'Product Usage Weight',
      description: 'The weight given to product usage data in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 30,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'support_weight',
      name: 'Support Activity Weight',
      description: 'The weight given to support activity data in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 10,
      step: 5,
      impact: 'Medium',
      category: 'Feature Weights'
    }
  ],
  'gradient-boost': [
    {
      id: 'learning_rate',
      name: 'Learning Rate',
      description: 'Step size shrinkage used to prevent overfitting. Lower values require more boosting rounds.',
      min: 0.01,
      max: 0.3,
      default: 0.1,
      step: 0.01,
      impact: 'High',
      category: 'Model Structure'
    },
    {
      id: 'n_estimators',
      name: 'Number of Estimators',
      description: 'The number of boosting stages to perform. More estimators can improve accuracy but increase computation time.',
      min: 50,
      max: 1000,
      default: 200,
      step: 50,
      impact: 'Medium',
      category: 'Model Structure'
    },
    {
      id: 'max_depth',
      name: 'Maximum Tree Depth',
      description: 'Maximum depth of the individual regression estimators. Deeper trees can model more complex patterns but may overfit.',
      min: 3,
      max: 15,
      default: 6,
      step: 1,
      impact: 'High',
      category: 'Model Structure'
    },
    {
      id: 'firmographic_weight',
      name: 'Firmographic Data Weight',
      description: 'The weight given to firmographic data (industry, size, revenue) in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 30,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'engagement_weight',
      name: 'Engagement Data Weight',
      description: 'The weight given to engagement data (website visits, email opens, etc.) in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 35,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'product_usage_weight',
      name: 'Product Usage Weight',
      description: 'The weight given to product usage data in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 25,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'support_weight',
      name: 'Support Activity Weight',
      description: 'The weight given to support activity data in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 10,
      step: 5,
      impact: 'Medium',
      category: 'Feature Weights'
    }
  ],
  'neural-network': [
    {
      id: 'hidden_layers',
      name: 'Hidden Layers',
      description: 'The number of hidden layers in the neural network. More layers can model more complex patterns.',
      min: 1,
      max: 5,
      default: 2,
      step: 1,
      impact: 'High',
      category: 'Model Structure'
    },
    {
      id: 'neurons_per_layer',
      name: 'Neurons per Layer',
      description: 'The number of neurons in each hidden layer. More neurons can capture more complex patterns.',
      min: 10,
      max: 200,
      default: 50,
      step: 10,
      impact: 'High',
      category: 'Model Structure'
    },
    {
      id: 'learning_rate',
      name: 'Learning Rate',
      description: 'Step size for gradient descent. Lower values can lead to more precise results but slower training.',
      min: 0.001,
      max: 0.1,
      default: 0.01,
      step: 0.001,
      impact: 'High',
      category: 'Model Structure'
    },
    {
      id: 'dropout_rate',
      name: 'Dropout Rate',
      description: 'Fraction of input units to drop during training to prevent overfitting.',
      min: 0,
      max: 0.5,
      default: 0.2,
      step: 0.05,
      impact: 'Medium',
      category: 'Model Structure'
    },
    {
      id: 'firmographic_weight',
      name: 'Firmographic Data Weight',
      description: 'The weight given to firmographic data (industry, size, revenue) in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 25,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'engagement_weight',
      name: 'Engagement Data Weight',
      description: 'The weight given to engagement data (website visits, email opens, etc.) in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 30,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'product_usage_weight',
      name: 'Product Usage Weight',
      description: 'The weight given to product usage data in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 35,
      step: 5,
      impact: 'High',
      category: 'Feature Weights'
    },
    {
      id: 'support_weight',
      name: 'Support Activity Weight',
      description: 'The weight given to support activity data in the scoring algorithm.',
      min: 0,
      max: 100,
      default: 10,
      step: 5,
      impact: 'Medium',
      category: 'Feature Weights'
    }
  ]
};

// Mock data for sample accounts
const MOCK_SAMPLE_ACCOUNTS = [
  {
    id: 'acc-1',
    name: 'Acme Corporation',
    industry: 'Manufacturing',
    employees: 2500,
    revenue: '$50M - $100M',
    currentScore: 78,
    predictedScore: 78,
    keyFactors: [
      { name: 'High engagement', impact: 15, positive: true },
      { name: 'Recent product demo', impact: 12, positive: true },
      { name: 'Industry fit', impact: 8, positive: true },
      { name: 'Low product usage', impact: 10, positive: false }
    ]
  },
  {
    id: 'acc-2',
    name: 'TechStart Inc',
    industry: 'Technology',
    employees: 85,
    revenue: '$1M - $5M',
    currentScore: 62,
    predictedScore: 62,
    keyFactors: [
      { name: 'Recent funding', impact: 14, positive: true },
      { name: 'High growth rate', impact: 10, positive: true },
      { name: 'Limited budget', impact: 12, positive: false },
      { name: 'Low engagement', impact: 8, positive: false }
    ]
  },
  {
    id: 'acc-3',
    name: 'Global Services Ltd',
    industry: 'Professional Services',
    employees: 750,
    revenue: '$10M - $50M',
    currentScore: 91,
    predictedScore: 91,
    keyFactors: [
      { name: 'Perfect fit solution', impact: 18, positive: true },
      { name: 'High engagement', impact: 15, positive: true },
      { name: 'Active product usage', impact: 12, positive: true },
      { name: 'Multiple stakeholders', impact: 8, positive: true }
    ]
  }
];

const AlgorithmConfiguration = ({ data, updateData }) => {
  const [algorithmParams, setAlgorithmParams] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleAccounts, setSampleAccounts] = useState(MOCK_SAMPLE_ACCOUNTS);
  
  // Initialize algorithm parameters based on selected algorithm
  useEffect(() => {
    // Only run this effect when the algorithm changes or when there's no config yet
    const shouldInitialize = 
      data.selectedAlgorithm && 
      (!data.algorithmConfig || Object.keys(data.algorithmConfig).length === 0);
      
    if (shouldInitialize) {
      // Initialize with defaults
      const defaultParams = {};
      const params = MOCK_ALGORITHM_PARAMS[data.selectedAlgorithm] || [];
      
      for (const param of params) {
        defaultParams[param.id] = param.default;
      }
      
      setAlgorithmParams(defaultParams);
      updateData(prevData => ({
        ...prevData,
        algorithmConfig: defaultParams
      }));
    } else if (data.algorithmConfig && Object.keys(data.algorithmConfig).length > 0) {
      // Use existing config
      setAlgorithmParams(data.algorithmConfig);
    }
  }, [data.selectedAlgorithm, data.algorithmConfig, updateData]); // Include all dependencies
  
  // Update sample account scores when parameters change
  useEffect(() => {
    // Skip if we don't have parameters yet
    if (Object.keys(algorithmParams).length === 0) return;
    
    // Use a callback approach to avoid circular dependency with sampleAccounts
    setSampleAccounts(prevAccounts => {
      // Map through previous accounts to calculate new scores
      return prevAccounts.map(account => {
        // Calculate a simple adjustment based on weight changes
        let adjustment = 0;
        
        if (algorithmParams.firmographic_weight) {
          const defaultWeight = MOCK_ALGORITHM_PARAMS[data.selectedAlgorithm]?.find(p => p.id === 'firmographic_weight')?.default || 0;
          const weightDiff = algorithmParams.firmographic_weight - defaultWeight;
          adjustment += weightDiff * 0.1;
        }
        
        if (algorithmParams.engagement_weight) {
          const defaultWeight = MOCK_ALGORITHM_PARAMS[data.selectedAlgorithm]?.find(p => p.id === 'engagement_weight')?.default || 0;
          const weightDiff = algorithmParams.engagement_weight - defaultWeight;
          adjustment += weightDiff * 0.1;
        }
        
        // Apply the adjustment to the predicted score
        let newScore = account.currentScore + adjustment;
        newScore = Math.max(0, Math.min(100, newScore)); // Keep score between 0-100
        
        return {
          ...account,
          predictedScore: Math.round(newScore)
        };
      });
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmParams, data.selectedAlgorithm]); // Only depend on these two values
  
  const handleParamChange = (paramId, value) => {
    const newParams = {
      ...algorithmParams,
      [paramId]: value
    };
    
    setAlgorithmParams(newParams);
    updateData({ algorithmConfig: newParams });
  };
  
  const handleAIRecommendations = async () => {
    setIsProcessing(true);
    setShowAIRecommendations(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate AI recommendations by adjusting parameters
    const newParams = { ...algorithmParams };
    const params = MOCK_ALGORITHM_PARAMS[data.selectedAlgorithm] || [];
    
    // Make some "intelligent" adjustments
    for (const param of params) {
      if (param.category === 'Feature Weights') {
        // Adjust weights based on "AI analysis"
        if (param.id === 'engagement_weight') {
          newParams[param.id] = param.default + 10;
        } else if (param.id === 'firmographic_weight') {
          newParams[param.id] = param.default - 5;
        } else if (param.id === 'product_usage_weight') {
          newParams[param.id] = param.default + 5;
        }
      } else if (param.impact === 'High') {
        // Adjust high-impact parameters
        if (param.id === 'max_depth') {
          newParams[param.id] = Math.min(param.max, param.default + 2);
        } else if (param.id === 'learning_rate' && param.default > 0.05) {
          newParams[param.id] = param.default - 0.02;
        }
      }
    }
    
    setAlgorithmParams(newParams);
    updateData({ algorithmConfig: newParams });
    
    setIsProcessing(false);
  };
  
  // Get available parameter categories
  const getCategories = () => {
    const params = MOCK_ALGORITHM_PARAMS[data.selectedAlgorithm] || [];
    const categories = ['All', ...new Set(params.map(param => param.category))];
    return categories;
  };
  
  // Filter parameters by category
  const getFilteredParams = () => {
    const params = MOCK_ALGORITHM_PARAMS[data.selectedAlgorithm] || [];
    return activeCategory === 'All' 
      ? params 
      : params.filter(param => param.category === activeCategory);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-09 mb-2">Configure Algorithm Parameters</h3>
        <p className="text-greyscale-8">
          Fine-tune your algorithm parameters to optimize scoring accuracy. Changes will be reflected in real-time on sample accounts.
        </p>
      </div>
      
      {/* AI Recommendations Button */}
      <div className="mb-6">
        <button
          type="button"
          className="w-full p-3 bg-blue-7 bg-opacity-20 text-blue-5 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-colors"
          onClick={handleAIRecommendations}
          disabled={isProcessing}
        >
          <Sparkles size={18} className="mr-2" />
          {isProcessing ? 'Processing...' : 'Get AI-Powered Parameter Recommendations'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Parameter Categories */}
          <div className="mb-4 border-b border-greyscale-6">
            <div className="flex space-x-4 overflow-x-auto">
              {getCategories().map(category => (
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
          
          {/* Parameters */}
          <div className="space-y-6">
            {getFilteredParams().map(param => (
              <div key={param.id} className="p-4 bg-greyscale-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-white">{param.name}</h4>
                      <button
                        type="button"
                        className="ml-2 text-greyscale-7 hover:text-white"
                        title={param.description}
                      >
                        <HelpCircle size={14} />
                      </button>
                      {param.impact === 'High' && (
                        <span className="ml-2 px-2 py-0.5 bg-vermilion-7 bg-opacity-20 text-vermilion-7 text-xs rounded-full">
                          High Impact
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-greyscale-7 mt-1">{param.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-greyscale-7">Current Value</div>
                    <div className="font-medium text-white">
                      {typeof algorithmParams[param.id] === 'number' 
                        ? algorithmParams[param.id].toLocaleString(undefined, {
                            minimumFractionDigits: param.step < 1 ? 2 : 0,
                            maximumFractionDigits: param.step < 1 ? 2 : 0
                          }) 
                        : algorithmParams[param.id]}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-greyscale-7">{param.min}</span>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={algorithmParams[param.id] || param.default}
                    onChange={(e) => handleParamChange(param.id, Number.parseFloat(e.target.value))}
                    className="flex-grow h-2 bg-greyscale-6 rounded-full appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-greyscale-7">{param.max}</span>
                </div>
                
                {param.category === 'Feature Weights' && (
                  <div className="mt-2 h-2 bg-greyscale-6 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-5"
                      style={{ width: `${algorithmParams[param.id]}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Feature Weight Balance Warning */}
          {activeCategory === 'Feature Weights' || activeCategory === 'All' ? (
            (() => {
              const weightParams = getFilteredParams().filter(param => param.category === 'Feature Weights');
              const totalWeight = weightParams.reduce((sum, param) => sum + (algorithmParams[param.id] || 0), 0);
              
              if (totalWeight !== 100 && weightParams.length > 0) {
                return (
                  <div className="mt-4 p-3 bg-amber-500 bg-opacity-20 text-amber-500 rounded-md flex items-start">
                    <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Feature weights don't add up to 100%</p>
                      <p className="text-sm mt-1">
                        Current total: {totalWeight}%. For optimal results, feature weights should sum to 100%.
                      </p>
                    </div>
                  </div>
                );
              }
              
              return null;
            })()
          ) : null}
        </div>
        
        {/* Sample Accounts Preview */}
        <div>
          <h4 className="font-medium text-blue-09 mb-4 flex items-center">
            <BarChart size={16} className="mr-2" />
            Real-time Score Preview
          </h4>
          
          <div className="space-y-4">
            {sampleAccounts.map(account => {
              const scoreDiff = account.predictedScore - account.currentScore;
              
              return (
                <div key={account.id} className="p-4 bg-greyscale-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-white">{account.name}</h5>
                      <div className="text-sm text-greyscale-7 mt-1">
                        {account.industry} • {account.employees.toLocaleString()} employees • {account.revenue}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-greyscale-7">Predicted Score</div>
                      <div className="flex items-center">
                        <span className={`text-lg font-medium ${
                          account.predictedScore >= 80 ? 'text-green-6' :
                          account.predictedScore >= 60 ? 'text-blue-5' :
                          account.predictedScore >= 40 ? 'text-amber-500' :
                          'text-vermilion-7'
                        }`}>
                          {account.predictedScore}
                        </span>
                        
                        {scoreDiff !== 0 && (
                          <span className={`ml-2 text-sm ${
                            scoreDiff > 0 ? 'text-green-6' : 'text-vermilion-7'
                          }`}>
                            {scoreDiff > 0 ? '+' : ''}{scoreDiff}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Score visualization */}
                  <div className="mb-3">
                    <div className="h-2 bg-greyscale-6 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          account.predictedScore >= 80 ? 'bg-green-6' :
                          account.predictedScore >= 60 ? 'bg-blue-5' :
                          account.predictedScore >= 40 ? 'bg-amber-500' :
                          'bg-vermilion-7'
                        }`}
                        style={{ width: `${account.predictedScore}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Key factors */}
                  <div>
                    <div className="text-xs text-greyscale-7 mb-2">Key Factors</div>
                    <div className="grid grid-cols-2 gap-2">
                      {account.keyFactors.map((factor) => (
                        <div key={`${factor.name}-${factor.impact}-${factor.positive}`} className="flex items-center">
                          <div className={`w-1 h-4 rounded-full mr-2 ${factor.positive ? 'bg-green-6' : 'bg-vermilion-7'}`} />
                          <span className="text-xs text-white truncate">{factor.name}</span>
                          <span className={`ml-1 text-xs ${factor.positive ? 'text-green-6' : 'text-vermilion-7'}`}>
                            {factor.positive ? '+' : '-'}{factor.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* AI Recommendations Modal */}
      {showAIRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-greyscale-3 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <Sparkles size={20} className="text-blue-5 mr-2" />
              <h3 className="text-lg font-medium text-blue-09">AI Parameter Recommendations</h3>
            </div>
            
            <p className="text-greyscale-8 mb-4">
              {isProcessing 
                ? 'Analyzing your data and optimizing parameters...' 
                : 'The AI has adjusted parameters to optimize scoring accuracy based on your data.'}
            </p>
            
            {!isProcessing && (
              <div className="mb-4 p-3 bg-blue-7 bg-opacity-10 rounded-md">
                <p className="text-sm text-blue-5">
                  <span className="font-medium">AI Insights:</span> {' '}
                  Based on your data, I've increased the weight of engagement metrics and product usage while reducing 
                  firmographic weight. I've also fine-tuned model complexity parameters for better accuracy.
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 border border-greyscale-6 rounded-md text-white"
                onClick={() => setShowAIRecommendations(false)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmConfiguration;
