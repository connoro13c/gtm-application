import { Box, Stepper, Step, StepLabel, Button, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataSourceSelection } from './DataSourceSelection';
import { FieldSelection } from './FieldSelection';
import { ModelSelection } from './ModelSelection';
import { ScoringParameters } from './ScoringParameters';
import { Review } from './Review';
import * as wizardSessionService from '../../services/wizardSessionService';

const STEPS = [
  'Data Source',
  'Field Selection',
  'Model Configuration',
  'Scoring Parameters',
  'Review'
];

export const Wizard = ({ onComplete, userId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [formData, setFormData] = useState({
    dataSource: null,
    sourceData: null,
    selectedFields: {
      identifier: [],
      target: [],
      engagement: [],
      firmographics: [],
      features: []
    },
    model: {
      type: '',
      parameters: {}
    },
    weights: {}
  });
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize or restore session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check for existing draft sessions
        const userSessions = await wizardSessionService.getUserSessions(userId);
        const draftSession = userSessions.find(s => s.isDraft);
        
        if (draftSession) {
          setSessionId(draftSession.id);
          setFormData({
            dataSource: draftSession.dataSource,
            sourceData: draftSession.sourceData,
            selectedFields: draftSession.selectedFields || {
              identifier: [],
              target: [],
              engagement: [],
              firmographics: [],
              features: []
            },
            model: draftSession.modelConfig || {
              type: '',
              parameters: {}
            },
            weights: draftSession.weights || {}
          });
          // Set active step based on progress
          const stepIndex = STEPS.findIndex(step => 
            step.toLowerCase().replace(' ', '-') === draftSession.currentStep
          );
          if (stepIndex !== -1) {
            setActiveStep(stepIndex);
          }
        } else {
          // Create new session
          const newSession = await wizardSessionService.createSession(userId);
          setSessionId(newSession.id);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        setError('Failed to initialize session. Please try again.');
      }
    };

    if (userId) {
      initializeSession();
    }
  }, [userId]);

  // Save progress when form data changes
  useEffect(() => {
    const saveProgress = async () => {
      if (!sessionId) return;
      
      setIsSaving(true);
      try {
        await wizardSessionService.updateSession(sessionId, {
          currentStep: STEPS[activeStep].toLowerCase().replace(' ', '-'),
          dataSource: formData.dataSource,
          sourceData: formData.sourceData,
          selectedFields: formData.selectedFields,
          modelConfig: formData.model,
          weights: formData.weights
        });
      } catch (error) {
        console.error('Error saving progress:', error);
        setError('Failed to save progress. Your changes may not be preserved.');
      } finally {
        setIsSaving(false);
      }
    };

    const debounceTimer = setTimeout(saveProgress, 1000);
    return () => clearTimeout(debounceTimer);
  }, [formData, activeStep, sessionId]);

  const handleNext = async () => {
    if (activeStep === STEPS.length - 1) {
      // Validate entire session before completing
      const validation = await wizardSessionService.validateSession(sessionId);
      if (!validation.isValid) {
        setError(`Please fix the following errors: ${validation.errors.join(', ')}`);
        return;
      }
      
      // Complete session and notify parent
      await wizardSessionService.completeSession(sessionId);
      onComplete(formData);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSaveAsDraft = async () => {
    try {
      await wizardSessionService.saveAsDraft(sessionId);
      // Optionally redirect or show confirmation
    } catch (error) {
      console.error('Error saving draft:', error);
      setError('Failed to save draft. Please try again.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DataSourceSelection formData={formData} setFormData={setFormData} />;
      case 1:
        return <FieldSelection formData={formData} setFormData={setFormData} />;
      case 2:
        return <ModelSelection formData={formData} setFormData={setFormData} />;
      case 3:
        return <ScoringParameters formData={formData} setFormData={setFormData} />;
      case 4:
        return <Review formData={formData} />;
      default:
        return 'Unknown step';
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 0:
        return formData.dataSource !== null;
      case 1:
        return formData.selectedFields.identifier.length > 0 && 
               formData.selectedFields.target.length > 0;
      case 2:
        return formData.model.type !== '';
      case 3:
        return Object.keys(formData.weights).length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (error) {
    return (
      <Alert 
        severity="error" 
        onClose={() => setError(null)}
        sx={{ mb: 2 }}
      >
        {error}
      </Alert>
    );
  }

  const canProceed = isStepComplete(activeStep);

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleSaveAsDraft}
            disabled={isSaving}
          >
            Save as Draft
          </Button>

          <Box>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canProceed || isSaving}
            >
              {activeStep === STEPS.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </Box>
        </Box>

        {isSaving && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Saving progress...
          </Alert>
        )}
      </Box>
    </Box>
  );
};

Wizard.propTypes = {
  onComplete: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
}; 