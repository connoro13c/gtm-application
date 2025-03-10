import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Clock, CheckCircle, AlertTriangle, Loader } from 'lucide-react';

const RunExecution = ({ data, updateData }) => {
  const [executionStatus, setExecutionStatus] = useState(data.executionStatus || 'pending');
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  
  // Stages of the scoring run process
  const stages = [
    { id: 'data-loading', name: 'Data Loading', percentage: 10 },
    { id: 'data-preprocessing', name: 'Data Preprocessing', percentage: 25 },
    { id: 'feature-engineering', name: 'Feature Engineering', percentage: 40 },
    { id: 'model-training', name: 'Model Training', percentage: 60 },
    { id: 'scoring-accounts', name: 'Scoring Accounts', percentage: 85 },
    { id: 'generating-insights', name: 'Generating Insights', percentage: 95 },
    { id: 'finalizing', name: 'Finalizing Results', percentage: 100 }
  ];
  
  // Current stage
  const [currentStage, setCurrentStage] = useState(0);
  
  // Start or resume the scoring run
  const startRun = () => {
    setIsRunning(true);
    setExecutionStatus('running');
    
    // Add initial log
    addLog('Starting scoring run...');
    
    // Update parent component
    updateData({ executionStatus: 'running' });
    
    // Simulate the first stage starting
    setTimeout(() => {
      setCurrentStage(0);
      setProgress(1);
      setTimeRemaining(calculateTimeRemaining(1));
      addLog(`Starting ${stages[0].name}...`);
    }, 500);
  };
  
  // Pause the scoring run
  const pauseRun = () => {
    setIsRunning(false);
    setExecutionStatus('paused');
    
    // Add log
    addLog('Scoring run paused.');
    
    // Update parent component
    updateData({ executionStatus: 'paused' });
  };
  
  // Add a log message
  const addLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [...prevLogs, { timestamp, message }]);
  }, []);
  
  // Calculate estimated time remaining
  const calculateTimeRemaining = useCallback((currentProgress) => {
    // In a real app, this would be based on actual processing time and remaining work
    // For this demo, we'll use a simple formula
    const totalEstimatedSeconds = 180; // 3 minutes total
    const secondsElapsed = (currentProgress / 100) * totalEstimatedSeconds;
    const secondsRemaining = totalEstimatedSeconds - secondsElapsed;
    
    return Math.max(0, Math.round(secondsRemaining));
  }, []);
  
  // Format time remaining as mm:ss
  const formatTimeRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Simulate the scoring run progress
  useEffect(() => {
    let progressInterval;
    
    if (isRunning && progress < 100) {
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          // Calculate new progress
          const newProgress = Math.min(100, prevProgress + 0.5);
          
          // Update time remaining
          setTimeRemaining(calculateTimeRemaining(newProgress));
          
          // Check if we've reached a new stage
          const currentStageObj = stages[currentStage];
          const nextStage = stages[currentStage + 1];
          
          if (nextStage && newProgress >= nextStage.percentage) {
            setCurrentStage(prevStage => prevStage + 1);
            addLog(`Completed ${currentStageObj.name}.`);
            addLog(`Starting ${nextStage.name}...`);
          }
          
          // Check if we're done
          if (newProgress >= 100) {
            setExecutionStatus('completed');
            updateData({ 
              executionStatus: 'completed',
              results: {
                completedAt: new Date().toISOString(),
                accountsScored: 2547,
                averageScore: 68.3,
                highScoreAccounts: 423,
                lowScoreAccounts: 312
              }
            });
            addLog('Scoring run completed successfully!');
            clearInterval(progressInterval);
          }
          
          return newProgress;
        });
      }, 200); // Update every 200ms for smooth animation
    }
    
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isRunning, progress, currentStage, updateData, addLog, calculateTimeRemaining]);
  
  // Simulate a random error (uncomment to test error handling)
  // useEffect(() => {
  //   if (isRunning && progress > 45 && progress < 46) {
  //     setError('Error processing account data: Missing required fields in 23 accounts.');
  //     setIsRunning(false);
  //     setExecutionStatus('error');
  //     updateData({ executionStatus: 'error' });
  //     addLog('ERROR: Missing required fields in 23 accounts.');
  //   }
  // }, [progress, isRunning]);
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-09 mb-2">Run Execution</h3>
        <p className="text-greyscale-8">
          Execute your scoring run with the configured parameters. You can run this in the background while continuing other work.
        </p>
      </div>
      
      {/* Status Card */}
      <div className="p-6 bg-greyscale-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              executionStatus === 'completed' ? 'bg-green-6 bg-opacity-20' :
              executionStatus === 'error' ? 'bg-vermilion-7 bg-opacity-20' :
              executionStatus === 'running' ? 'bg-blue-5 bg-opacity-20' :
              'bg-greyscale-6'
            }`}>
              {executionStatus === 'completed' ? (
                <CheckCircle size={20} className="text-green-6" />
              ) : executionStatus === 'error' ? (
                <AlertTriangle size={20} className="text-vermilion-7" />
              ) : executionStatus === 'running' ? (
                <Loader size={20} className="text-blue-5 animate-spin" />
              ) : (
                <Play size={20} className="text-greyscale-7" />
              )}
            </div>
            
            <div>
              <h4 className="font-medium text-white">Scoring Run Status</h4>
              <div className={`text-sm ${
                executionStatus === 'completed' ? 'text-green-6' :
                executionStatus === 'error' ? 'text-vermilion-7' :
                executionStatus === 'running' ? 'text-blue-5' :
                'text-greyscale-7'
              }`}>
                {executionStatus === 'completed' ? 'Completed' :
                 executionStatus === 'error' ? 'Error' :
                 executionStatus === 'running' ? 'Running' :
                 executionStatus === 'paused' ? 'Paused' : 'Ready to Start'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {executionStatus === 'running' ? (
              <button
                type="button"
                className="px-4 py-2 border border-greyscale-6 rounded-md text-white flex items-center"
                onClick={pauseRun}
              >
                <Pause size={16} className="mr-2" />
                Pause
              </button>
            ) : executionStatus === 'paused' || executionStatus === 'pending' ? (
              <button
                type="button"
                className="px-4 py-2 bg-vermilion-7 text-white rounded-md flex items-center"
                onClick={startRun}
              >
                <Play size={16} className="mr-2" />
                {executionStatus === 'paused' ? 'Resume' : 'Start'}
              </button>
            ) : null}
            
            {executionStatus === 'running' && timeRemaining !== null && (
              <div className="flex items-center text-greyscale-7">
                <Clock size={16} className="mr-1" />
                <span>{formatTimeRemaining(timeRemaining)} remaining</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-greyscale-7 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-greyscale-6 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-200 ${
                executionStatus === 'completed' ? 'bg-green-6' :
                executionStatus === 'error' ? 'bg-vermilion-7' :
                'bg-blue-5'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage, index) => (
            <div 
              key={stage.id}
              className={`p-3 rounded-md border ${
                index === currentStage && isRunning
                  ? 'border-blue-5 bg-blue-7 bg-opacity-10'
                  : index < currentStage || (index === currentStage && !isRunning && progress > 0)
                    ? 'border-green-6 bg-green-6 bg-opacity-5'
                    : 'border-greyscale-6'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                  index === currentStage && isRunning
                    ? 'bg-blue-5 bg-opacity-20'
                    : index < currentStage || (index === currentStage && !isRunning && progress > 0)
                      ? 'bg-green-6 bg-opacity-20'
                      : 'bg-greyscale-6'
                }`}>
                  {index === currentStage && isRunning ? (
                    <Loader size={12} className="text-blue-5 animate-spin" />
                  ) : index < currentStage || (index === currentStage && !isRunning && progress > 0) ? (
                    <CheckCircle size={12} className="text-green-6" />
                  ) : (
                    <span className="text-xs text-greyscale-7">{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${
                  index === currentStage && isRunning
                    ? 'text-blue-5 font-medium'
                    : index < currentStage || (index === currentStage && !isRunning && progress > 0)
                      ? 'text-green-6'
                      : 'text-greyscale-7'
                }`}>
                  {stage.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-vermilion-7 bg-opacity-20 text-vermilion-7 rounded-lg flex items-start">
          <AlertTriangle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error during scoring run</p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              className="mt-3 px-3 py-1 bg-vermilion-7 text-white rounded-md text-sm"
              onClick={() => {
                setError(null);
                setExecutionStatus('pending');
                setProgress(0);
                setCurrentStage(0);
                updateData({ executionStatus: 'pending' });
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {/* Logs */}
      <div>
        <h4 className="font-medium text-blue-09 mb-3">Execution Logs</h4>
        <div className="bg-greyscale-2 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-greyscale-7 italic">Logs will appear here once the run starts...</div>
          ) : (
            logs.map((log) => (
              <div key={`${log.timestamp}-${log.message.substring(0, 10)}`} className="mb-1">
                <span className="text-greyscale-7">[{log.timestamp}]</span>{' '}
                <span className={log.message.startsWith('ERROR') ? 'text-vermilion-7' : 'text-white'}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Background Processing Notice */}
      <div className="mt-6 p-4 bg-blue-7 bg-opacity-10 text-blue-5 rounded-lg flex items-start">
        <Info size={20} className="mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Background Processing Available</p>
          <p className="mt-1">
            You can continue working on other tasks while this scoring run executes in the background.
            You'll be notified when the process completes.
          </p>
        </div>
      </div>
    </div>
  );
};

// Add missing Info icon
const Info = ({ size, className }) => {
  const titleId = "info-icon-title";
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-labelledby={titleId}
      role="img"
    >
      <title id={titleId}>Information Icon</title>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
};

export default RunExecution;
