import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Database, FileText, FileSpreadsheet } from 'lucide-react';
import DataSourceSelection from './WizardSteps/DataSourceSelection';
import DataLoading from './WizardSteps/DataLoading';
import DataMapping from './WizardSteps/DataMapping';
import DataValidation from './WizardSteps/DataValidation';

const STEPS = [
  { id: 'source-selection', name: 'Select Data Source', component: DataSourceSelection },
  { id: 'data-loading', name: 'Data Loading', component: DataLoading },
  { id: 'data-mapping', name: 'Data Mapping', component: DataMapping },
  { id: 'data-validation', name: 'Data Validation', component: DataValidation }
];

const DataLoadingWizard = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [wizardData, setWizardData] = useState({
    selectedDataSource: null,
    dataSources: [],
    uploadedFiles: [],
    integrationCredentials: {},
    scheduleSettings: {},
    dataMapping: {}
  });

  // Calculate current step
  const currentStep = STEPS[currentStepIndex];
  const CurrentStepComponent = currentStep.component;

  // Handle data updates from steps
  const updateStepData = (newData) => {
    setWizardData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  // Navigate to next step
  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Check if next button should be disabled
  const isNextDisabled = () => {
    switch (currentStep.id) {
      case 'source-selection':
        return !wizardData.selectedDataSource;
      case 'data-loading':
        return wizardData.uploadedFiles.length === 0 && 
               Object.keys(wizardData.integrationCredentials).length === 0;
      case 'data-mapping':
        // Check if at least the critical fields are mapped
        const mappedFields = Object.keys(wizardData.dataMapping || {}).length;
        return mappedFields === 0;
      default:
        return false;
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6">
      {/* Wizard Header with Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Data Loading Wizard</h2>
        
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            // Determine step status
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isPending = index > currentStepIndex;
            
            return (
              <React.Fragment key={step.id}>
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isActive ? 'border-blue-500 bg-blue-500 bg-opacity-20' : isCompleted ? 'border-green-500 bg-green-500 bg-opacity-20' : 'border-gray-600 bg-gray-800'}`}
                  >
                    <span className={`text-sm font-medium ${isActive ? 'text-blue-500' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>
                  </div>
                  <span className={`mt-2 text-sm ${isActive ? 'text-blue-500 font-medium' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                    {step.name}
                  </span>
                </div>
                
                {/* Connector line between steps */}
                {index < STEPS.length - 1 && (
                  <div 
                    className={`flex-1 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-700'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* Step Content */}
      <div className="mb-8">
        <CurrentStepComponent 
          data={wizardData} 
          updateData={updateStepData} 
        />
      </div>
      
      {/* Wizard Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-800">
        <button
          type="button"
          className="px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </button>
        
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={isNextDisabled()}
        >
          {currentStepIndex === STEPS.length - 1 ? 'Finish' : 'Next'}
          {currentStepIndex !== STEPS.length - 1 && <ArrowRight size={16} className="ml-2" />}
        </button>
      </div>
    </div>
  );
};

export default DataLoadingWizard;