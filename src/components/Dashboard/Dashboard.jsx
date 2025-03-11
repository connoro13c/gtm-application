import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, AlertTriangle, 
  BarChart2, Users, Database, 
  FileText, ArrowRight, Play, 
  PlusCircle, X
} from 'lucide-react';

import ScoringRunWizard from '../ScoringRun/ScoringRunWizard';

// Mock data for the dashboard
const mockData = {
  metrics: {
    totalAccounts: { value: 1245, trend: 'up', percentage: 12 },
    averagePropensityScore: { value: 68, trend: 'up', percentage: 5 },
    highValueAccounts: { value: 312, trend: 'down', percentage: 3 },
    newAccountsAdded: { value: 45, trend: 'up', percentage: 8 },
    criticalMissingData: { value: 23, trend: 'down', percentage: 15 }
  },
  predictiveSuccess: {
    lastRunAccuracy: '92%',
    improvementVsPrevious: '+3.5%',
    nextScheduledRun: '2025-03-15'
  },
  positiveDrivers: [
    { title: 'Increased Engagement', description: 'Customer engagement metrics have improved by 15% across digital channels.' },
    { title: 'Tech Stack Updates', description: 'Target accounts have added complementary technologies to their stack.' },
    { title: 'Expansion Signals', description: 'Accounts showing growth indicators like hiring and new locations.' }
  ],
  negativeDrivers: [
    { title: 'Budget Constraints', description: 'Financial indicators suggest tightening budgets in target segments.' },
    { title: 'Competitor Activity', description: 'Increased competitor presence in 18% of high-value accounts.' },
    { title: 'Stalled Opportunities', description: 'Extended sales cycles with no movement in the past 60 days.' }
  ],
  quickActions: [
    { title: 'Start New Scoring Run', description: 'Create and configure a new account scoring run', icon: Play, primary: true },
    { title: 'Scenario Management', description: 'View, create, or manage scoring scenarios', icon: BarChart2 },
    { title: 'Data Sources', description: 'Manage data sources and integrations', icon: Database },
    { title: 'Account Scoring', description: 'View detailed individual account scoring', icon: Users },
    { title: 'Reports & Insights', description: 'Access predictive insights and reports', icon: FileText }
  ],
  recentRuns: [
    { id: 1, name: 'Q1 2025 Baseline', status: 'complete', date: '2025-03-01', accuracy: '92%' },
    { id: 2, name: 'Enterprise Focus', status: 'complete', date: '2025-02-15', accuracy: '89%' },
    { id: 3, name: 'SMB Expansion', status: 'draft', date: '2025-03-08', accuracy: '-' }
  ]
};

// MetricCard Component
const MetricCard = ({ title, value, trend, percentage, alert }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <h3 className="text-h3 text-violet-08">{title}</h3>
        {alert && <AlertTriangle className="text-vermilion-7" size={20} aria-hidden="true" />}
      </div>
      <div className="mt-2 flex items-end">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <div className={`ml-2 flex items-center ${trend === 'up' ? 'text-green-6' : 'text-vermilion-7'}`}>
            {trend === 'up' ? <TrendingUp size={16} aria-hidden="true" /> : <TrendingDown size={16} aria-hidden="true" />}
            <span className="text-sm ml-1">{percentage}%</span>
          </div>
        )}
      </div>
      {alert && <p className="text-vermilion-7 text-sm mt-1">Needs attention</p>}
    </div>
  );
};

// Chart Placeholder Component
const ChartPlaceholder = ({ data }) => {
  return (
    <div className="card p-6">
      <h3 className="text-h3 mb-4 text-teal-08">Predictive Success Trendline</h3>
      <div className="h-64 bg-greyscale-11 rounded flex items-center justify-center">
        <p className="text-teal-07">Interactive chart will be implemented here</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <p className="text-teal-07 text-sm">Last Scoring Run Accuracy</p>
          <p className="font-bold text-lg">{data.lastRunAccuracy}</p>
        </div>
        <div>
          <p className="text-teal-07 text-sm">Improvement vs Previous</p>
          <p className="font-bold text-lg text-green-6">{data.improvementVsPrevious}</p>
        </div>
        <div>
          <p className="text-teal-07 text-sm">Next Scheduled Run</p>
          <p className="font-bold text-lg">{data.nextScheduledRun}</p>
        </div>
      </div>
    </div>
  );
};

// DriverCard Component
const DriverCard = ({ title, description, isPositive }) => {
  return (
    <div className={`p-4 rounded-lg shadow-sm ${isPositive ? 'bg-green-6 bg-opacity-10 border-l-4 border-green-6' : 'bg-vermilion-7 bg-opacity-10 border-l-4 border-vermilion-7'}`}>
      <h4 className={`font-medium ${isPositive ? 'text-green-6' : 'text-vermilion-7'}`}>{title}</h4>
      <p className="text-vermilion-07 text-sm mt-1">{description}</p>
    </div>
  );
};

// QuickActionCard Component
const QuickActionCard = ({ title, description, icon: Icon, primary = false, onClick }) => {
  return (
    <button 
      type="button"
      className={`card w-full text-left hover:shadow-lg transition-shadow cursor-pointer ${primary ? 'border-l-4 border-vermilion-7' : ''}`}
      onClick={onClick}
      aria-label={title}
    >
      <div className="flex items-start">
        <div className={`${primary ? 'bg-vermilion-7' : 'bg-blue-5 bg-opacity-10'} p-2 rounded-full mr-3`}>
          <Icon className={`${primary ? 'text-white' : 'text-blue-5'}`} size={20} aria-hidden="true" />
        </div>
        <div>
          <h4 className="font-medium text-blue-08">{title}</h4>
          <p className="text-blue-07 text-sm mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" className="text-blue-6 text-sm flex items-center hover:underline">
          <span>View</span>
          <ArrowRight size={14} className="ml-1" aria-hidden="true" />
        </button>
      </div>
    </button>
  );
};

// Scoring Run Wizard Steps
const WIZARD_STEPS = [
  { id: 'initial', title: 'Start New Run' },
  { id: 'data-source', title: 'Data Source Selection' },
  { id: 'data-mapping', title: 'Data Mapping & Cleaning' },
  { id: 'algorithm', title: 'Algorithm Selection' },
  { id: 'configuration', title: 'Algorithm Configuration' },
  { id: 'execution', title: 'Run Execution' },
  { id: 'results', title: 'Results Review' }
];

// New Scoring Run Modal Component
const NewScoringRunModal = ({ isOpen, onClose, onStart }) => {
  const [runName, setRunName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (runName.trim()) {
      onStart({ name: runName, description });
      setRunName('');
      setDescription('');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-greyscale-3 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-violet-08">Start New Scoring Run</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="runName" className="block text-blue-08 mb-2">Run Name <span className="text-vermilion-7">*</span></label>
            <input
              id="runName"
              type="text"
              className="w-full p-2 border border-greyscale-6 rounded-md bg-greyscale-2 text-white"
              value={runName}
              onChange={(e) => setRunName(e.target.value)}
              required
              // Removed autoFocus for accessibility
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-blue-08 mb-2">Description (Optional)</label>
            <textarea
              id="description"
              className="w-full p-2 border border-greyscale-6 rounded-md bg-greyscale-2 text-white h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button" 
              className="px-4 py-2 border border-greyscale-6 rounded-md text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-vermilion-7 text-white rounded-md disabled:opacity-50"
              disabled={!runName.trim()}
            >
              Start
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(mockData);
  const [showNewRunModal, setShowNewRunModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  
  useEffect(() => {
    // This would be replaced with actual API calls in a real implementation
    console.log('Dashboard component mounted - would fetch real data here');
  }, []);
  
  const handleActionClick = (actionTitle) => {
    if (actionTitle === 'Start New Scoring Run') {
      setShowNewRunModal(true);
    } else {
      console.log(`Action clicked: ${actionTitle}`);
    }
  };
  
  const [currentWizardStep, setCurrentWizardStep] = useState(0);
  const [runSession, setRunSession] = useState(null);
  
  const handleStartRun = (runData) => {
    console.log('Starting new scoring run:', runData);
    // Here we would typically make an API call to create a new run
    setShowNewRunModal(false);
    
    // Create a new run session
    const sessionId = `run-${Date.now()}`;
    const newRun = {
      id: sessionId,
      name: runData.name,
      description: runData.description,
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      accuracy: '-',
      currentStep: 1, // Move to the first actual step (data source selection)
      progress: {}
    };
    
    // Add to recent runs and set as current session
    setData(prev => ({
      ...prev,
      recentRuns: [newRun, ...prev.recentRuns.slice(0, 9)] // Keep only the 10 most recent
    }));
    
    setRunSession(newRun);
    setCurrentWizardStep(1); // Move to data source selection step
    
    // Navigate to the scoring run wizard
    navigateToWizard(sessionId);
  };
  
  const navigateToWizard = (sessionId) => {
    // Log the navigation
    console.log(`Navigating to scoring run wizard for session ${sessionId}`);
    // Show the wizard component
    setShowWizard(true);
  };
  
  const handleWizardClose = () => {
    setShowWizard(false);
    setRunSession(null);
  };
  
  const handleWizardComplete = (results) => {
    console.log('Scoring run completed with results:', results);
    setShowWizard(false);
    // Update the run status
    if (runSession) {
      const updatedRun = {
        ...runSession,
        status: 'completed',
        accuracy: results?.accuracy || '95%' // Mock accuracy
      };
      
      // Update in the recent runs list
      setData(prev => ({
        ...prev,
        recentRuns: prev.recentRuns.map(run => 
          run.id === updatedRun.id ? updatedRun : run
        )
      }));
    }
  };
  
  return (
    <div className="p-6 bg-greyscale-3 min-h-screen">
      {/* New Scoring Run Modal */}
      <NewScoringRunModal 
        isOpen={showNewRunModal} 
        onClose={() => setShowNewRunModal(false)} 
        onStart={handleStartRun}
      />
      
      {/* Scoring Run Wizard */}
      {showWizard && runSession && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-greyscale-2 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-greyscale-6">
              <h2 className="text-xl font-semibold text-white">Scoring Run: {runSession.name}</h2>
              <button 
                type="button"
                onClick={handleWizardClose} 
                className="text-greyscale-7 hover:text-white"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <ScoringRunWizard 
              runData={runSession} 
              onClose={handleWizardClose} 
              onComplete={handleWizardComplete} 
            />
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-h1 mb-6 text-violet-08">Dashboard</h1>
        
        {/* Section 1: High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <MetricCard 
            title="Total Accounts" 
            value={data.metrics.totalAccounts.value} 
            trend={data.metrics.totalAccounts.trend} 
            percentage={data.metrics.totalAccounts.percentage} 
          />
          <MetricCard 
            title="Average Propensity Score" 
            value={data.metrics.averagePropensityScore.value} 
            trend={data.metrics.averagePropensityScore.trend} 
            percentage={data.metrics.averagePropensityScore.percentage} 
          />
          <MetricCard 
            title="High-Value Accounts" 
            value={data.metrics.highValueAccounts.value} 
            trend={data.metrics.highValueAccounts.trend} 
            percentage={data.metrics.highValueAccounts.percentage} 
          />
          <MetricCard 
            title="New Accounts Added" 
            value={data.metrics.newAccountsAdded.value} 
            trend={data.metrics.newAccountsAdded.trend} 
            percentage={data.metrics.newAccountsAdded.percentage} 
          />
          <MetricCard 
            title="Critical Missing Data" 
            value={data.metrics.criticalMissingData.value} 
            trend={data.metrics.criticalMissingData.trend} 
            percentage={data.metrics.criticalMissingData.percentage} 
            alert={true} 
          />
        </div>
        
        {/* Section 2: Predictive Success Trendline */}
        <div className="mb-6">
          <ChartPlaceholder data={data.predictiveSuccess} />
        </div>
        
        {/* Section 3: Drivers of Account Score Movements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-h3 mb-3 text-vermilion-08">Positive Drivers</h3>
            <div className="space-y-3">
              {data.positiveDrivers.map((driver) => (
                <DriverCard 
                  key={`positive-${driver.title}`} 
                  title={driver.title} 
                  description={driver.description} 
                  isPositive={true} 
                />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-h3 mb-3 text-vermilion-08">Negative Drivers</h3>
            <div className="space-y-3">
              {data.negativeDrivers.map((driver) => (
                <DriverCard 
                  key={`negative-${driver.title}`} 
                  title={driver.title} 
                  description={driver.description} 
                  isPositive={false} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Section 4: Quick Access & Actions */}
        <div>
          <h3 className="text-h3 mb-3 text-blue-09">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.quickActions.map((action) => (
              <QuickActionCard 
                key={`action-${action.title}`} 
                title={action.title} 
                description={action.description} 
                icon={action.icon}
                primary={action.primary}
                onClick={() => handleActionClick(action.title)}
              />
            ))}
          </div>
        </div>
        
        {/* Section 5: Recent Scoring Runs */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-h3 text-blue-09">Recent Scoring Runs</h3>
            <button type="button" className="text-blue-6 text-sm flex items-center hover:underline">
              <span>View All</span>
              <ArrowRight size={14} className="ml-1" aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-4 min-w-max">
              {data.recentRuns.map((run) => (
                <div key={`run-${run.id}`} className="w-64 card p-4 flex-shrink-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-violet-08">{run.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      run.status === 'complete' ? 'bg-green-6 bg-opacity-20 text-green-6' : 
                      run.status === 'draft' ? 'bg-blue-5 bg-opacity-20 text-blue-5' : 
                      'bg-vermilion-7 bg-opacity-20 text-vermilion-7'
                    }`}>
                      {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-teal-07 text-sm">Date: {run.date}</p>
                    <p className="text-teal-07 text-sm">Accuracy: {run.accuracy}</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button type="button" className="text-blue-6 text-sm flex items-center hover:underline">
                      <span>View Details</span>
                      <ArrowRight size={14} className="ml-1" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add New Run Card */}
              <button 
                type="button"
                className="w-64 card p-4 flex-shrink-0 border-dashed border-2 border-greyscale-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-5 transition-colors"
                onClick={() => setShowNewRunModal(true)}
                aria-label="Start New Scoring Run"
              >
                <PlusCircle size={32} className="text-blue-5 mb-2" aria-hidden="true" />
                <p className="text-blue-7 font-medium">Start New Scoring Run</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
