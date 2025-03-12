import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Database, FileSpreadsheet, Settings, Play, BarChart, CheckCircle } from 'lucide-react';

// Step Components
import DataSourceSelection from './WizardSteps/DataSourceSelection';
import DataMapping from './WizardSteps/DataMapping';
import AlgorithmSelection from './WizardSteps/AlgorithmSelection';
import AlgorithmConfiguration from './WizardSteps/AlgorithmConfiguration';
import RunExecution from './WizardSteps/RunExecution';
import ResultsReview from './WizardSteps/ResultsReview';

const WIZARD_STEPS = [
  { 
    id: 'data-source', 
    title: 'Data Source Selection',
    description: 'Select the data sources for your scoring run',
    icon: Database
  },
  { 
    id: 'data-mapping', 
    title: 'Data Mapping & Cleaning',
    description: 'Map and clean your data for accurate scoring',
    icon: FileSpreadsheet
  },
  { 
    id: 'algorithm-selection', 
    title: 'Algorithm Selection',
    description: 'Choose the right algorithm for your scoring needs',
    icon: Settings
  },
  { 
    id: 'algorithm-config', 
    title: 'Algorithm Configuration',
    description: 'Fine-tune your algorithm parameters',
    icon: Settings
  },
  { 
    id: 'run-execution', 
    title: 'Run Execution',
    description: 'Execute your scoring run',
    icon: Play
  },
  { 
    id: 'results', 
    title: 'Results Review',
    description: 'Review and analyze your scoring results',
    icon: BarChart
  }
];

const ScoringRunWizard = ({ runData, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    name: runData?.name || '',
    description: runData?.description || '',
    dataSources: [],
    uploadedFiles: [],
    dataMapping: {},
    selectedAlgorithm: null,
    algorithmConfig: {},
    executionStatus: 'pending',
    results: null,
    isDraft: true,
    lastSaved: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Auto-save as draft every 2 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (wizardData.isDraft) {
        saveAsDraft();
      }
    }, 120000); // 2 minutes
    
    return () => clearInterval(autoSaveInterval);
  }, [wizardData]);
  
  const saveAsDraft = async () => {
    setIsLoading(true);
    try {
      // API call to save draft would go here
      // const response = await api.saveScoringRunDraft(wizardData);
      setWizardData({
        ...wizardData,
        lastSaved: new Date()
      });
      setError(null);
    } catch (err) {
      setError('Failed to save draft. Please try again.');
      console.error('Error saving draft:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // API call to finalize scoring run would go here
      // const response = await api.finalizeScoringRun(wizardData);
      setWizardData({
        ...wizardData,
        isDraft: false
      });
      onComplete(wizardData);
    } catch (err) {
      setError('Failed to complete scoring run. Please try again.');
      console.error('Error completing scoring run:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateWizardData = (stepData) => {
    setWizardData({
      ...wizardData,
      ...stepData
    });
  };
  
  const renderStepContent = () => {
    switch (WIZARD_STEPS[currentStep].id) {
      case 'data-source':
        return <DataSourceSelection 
          data={wizardData} 
          updateData={updateWizardData} 
        />;
      case 'data-mapping':
        return <DataMapping 
          data={wizardData} 
          updateData={updateWizardData} 
        />;
      case 'algorithm-selection':
        return <AlgorithmSelection 
          data={wizardData} 
          updateData={updateWizardData} 
        />;
      case 'algorithm-config':
        return <AlgorithmConfiguration 
          data={wizardData} 
          updateData={updateWizardData} 
        />;
      case 'run-execution':
        return <RunExecution 
          data={wizardData} 
          updateData={updateWizardData} 
        />;
      case 'results':
        return <ResultsReview 
          data={wizardData} 
          updateData={updateWizardData} 
        />;
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-greyscale-3 rounded-lg shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-violet-08">
            {runData?.name || 'New Scoring Run'}: {WIZARD_STEPS[currentStep].title}
          </h2>
          <div className="flex items-center space-x-2">
            {wizardData.lastSaved && (
              <span className="text-sm text-greyscale-7">
                Last saved: {new Date(wizardData.lastSaved).toLocaleTimeString()}
              </span>
            )}
            <button 
              type="button" 
              className="px-4 py-2 border border-greyscale-6 rounded-md text-white"
              onClick={saveAsDraft}
              disabled={isLoading}
            >
              Save as Draft
            </button>
            <button 
              type="button" 
              className="px-4 py-2 border border-greyscale-6 rounded-md text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {WIZARD_STEPS.map((step, index) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center"
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index < currentStep 
                      ? 'bg-green-6 text-white' 
                      : index === currentStep 
                        ? 'bg-vermilion-7 text-white' 
                        : 'bg-greyscale-6 text-greyscale-8'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle size={20} />
                  ) : (
                    <step.icon size={20} />
                  )}
                </div>
                <span className={`text-xs ${
                  index === currentStep ? 'text-vermilion-7 font-medium' : 'text-greyscale-7'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-greyscale-6 w-full" />
            <div 
              className="absolute top-0 left-0 h-1 bg-vermilion-7" 
              style={{ width: `${(currentStep / (WIZARD_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-vermilion-7 bg-opacity-20 text-vermilion-7 rounded-md">
            {error}
          </div>
        )}
        
        {/* Step Content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button 
            type="button" 
            className="px-4 py-2 border border-greyscale-6 rounded-md text-white flex items-center"
            onClick={handleBack}
            disabled={currentStep === 0 || isLoading}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </button>
          
          <button 
            type="button" 
            className="px-4 py-2 bg-vermilion-7 text-white rounded-md flex items-center disabled:opacity-50"
            onClick={handleNext}
            disabled={isLoading}
          >
            {currentStep === WIZARD_STEPS.length - 1 ? 'Complete' : 'Next'}
            {currentStep < WIZARD_STEPS.length - 1 && <ArrowRight size={16} className="ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoringRunWizard;
