import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart2, Download, Share2, Filter, ArrowUpDown, Search, ChevronRight, Save, RefreshCw } from 'lucide-react';

// Mock data for scoring results
const MOCK_RESULTS = {
  runName: 'Q2 2023 Account Scoring',
  runDate: '2023-06-15T14:30:00Z',
  algorithm: 'Random Forest',
  totalAccounts: 2547,
  averageScore: 68.3,
  scoreDistribution: [
    { range: '0-20', count: 127, percentage: 5 },
    { range: '21-40', count: 185, percentage: 7.3 },
    { range: '41-60', count: 612, percentage: 24 },
    { range: '61-80', count: 1200, percentage: 47.1 },
    { range: '81-100', count: 423, percentage: 16.6 }
  ],
  topAccounts: [
    { id: 'acc-1', name: 'Global Services Ltd', industry: 'Professional Services', score: 94, previousScore: 89, change: 5 },
    { id: 'acc-2', name: 'TechCorp Inc', industry: 'Technology', score: 92, previousScore: 85, change: 7 },
    { id: 'acc-3', name: 'Acme Manufacturing', industry: 'Manufacturing', score: 91, previousScore: 91, change: 0 },
    { id: 'acc-4', name: 'Retail Giants', industry: 'Retail', score: 89, previousScore: 76, change: 13 },
    { id: 'acc-5', name: 'Healthcare Solutions', industry: 'Healthcare', score: 88, previousScore: 90, change: -2 }
  ],
  keyInsights: [
    'High-value accounts showed an average score increase of 8.2 points compared to previous scoring runs',
    'Technology sector accounts have the highest average score (76.4)',
    'Accounts with recent product demos are 3.2x more likely to be in the top scoring tier',
    'Engagement metrics were the strongest predictor of high scores across all industries'
  ],
  recommendedActions: [
    'Focus sales efforts on the 423 accounts with scores above 80',
    'Review the 127 accounts with scores below 20 for potential disqualification',
    'Schedule product demos for mid-tier accounts (scores 40-60) to improve engagement',
    'Increase marketing engagement for accounts in the 61-80 range to push them into the top tier'
  ]
};

/**
 * Results Review component for the final step of the scoring run wizard
 * @param {Object} props - Component props
 * @param {Object} props.data - The wizard data
 * @param {Function} props.updateData - Function to update wizard data
 * @returns {JSX.Element} ResultsReview component
 */
const ResultsReview = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Use mock results if no real results available
  const results = data.results || MOCK_RESULTS;
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Handle saving results
  const handleSaveResults = () => {
    // In a real app, this would call an API to save the results
    updateData({
      resultsSaved: true,
      savedAt: new Date().toISOString()
    });
    
    // Show success message or notification
    alert('Results saved successfully!');
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-blue-09 mb-2">Scoring Results</h3>
        <p className="text-greyscale-8">
          Review the results of your scoring run, analyze insights, and take action on your accounts.
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          className="px-4 py-2 bg-vermilion-7 text-white rounded-md flex items-center"
          onClick={handleSaveResults}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveResults()}
        >
          <Save size={16} className="mr-2" />
          Save Results
        </button>
        
        <button
          type="button"
          className="px-4 py-2 border border-greyscale-6 text-white rounded-md flex items-center"
          onClick={() => {}}
          onKeyDown={(e) => e.key === 'Enter' && {}}
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
        
        <button
          type="button"
          className="px-4 py-2 border border-greyscale-6 text-white rounded-md flex items-center"
          onClick={() => {}}
          onKeyDown={(e) => e.key === 'Enter' && {}}
        >
          <Share2 size={16} className="mr-2" />
          Share
        </button>
        
        <button
          type="button"
          className="px-4 py-2 border border-greyscale-6 text-white rounded-md flex items-center"
          onClick={() => {}}
          onKeyDown={(e) => e.key === 'Enter' && {}}
        >
          <RefreshCw size={16} className="mr-2" />
          Run Again
        </button>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-greyscale-6">
        <div className="flex space-x-6">
          <button
            type="button"
            className={`py-3 border-b-2 ${
              activeTab === 'overview' 
                ? 'border-vermilion-7 text-vermilion-7' 
                : 'border-transparent text-greyscale-7 hover:text-white'
            }`}
            onClick={() => setActiveTab('overview')}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('overview')}
          >
            Overview
          </button>
          
          <button
            type="button"
            className={`py-3 border-b-2 ${
              activeTab === 'accounts' 
                ? 'border-vermilion-7 text-vermilion-7' 
                : 'border-transparent text-greyscale-7 hover:text-white'
            }`}
            onClick={() => setActiveTab('accounts')}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('accounts')}
          >
            Accounts
          </button>
          
          <button
            type="button"
            className={`py-3 border-b-2 ${
              activeTab === 'insights' 
                ? 'border-vermilion-7 text-vermilion-7' 
                : 'border-transparent text-greyscale-7 hover:text-white'
            }`}
            onClick={() => setActiveTab('insights')}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('insights')}
          >
            Insights
          </button>
        </div>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-greyscale-4 rounded-lg">
              <div className="text-sm text-greyscale-7 mb-1">Total Accounts</div>
              <div className="text-2xl font-medium text-white">{results.totalAccounts.toLocaleString()}</div>
            </div>
            
            <div className="p-4 bg-greyscale-4 rounded-lg">
              <div className="text-sm text-greyscale-7 mb-1">Average Score</div>
              <div className="text-2xl font-medium text-white">{results.averageScore.toFixed(1)}</div>
            </div>
            
            <div className="p-4 bg-greyscale-4 rounded-lg">
              <div className="text-sm text-greyscale-7 mb-1">High-Value Accounts (80+)</div>
              <div className="text-2xl font-medium text-green-6">{results.scoreDistribution[4].count.toLocaleString()}</div>
            </div>
            
            <div className="p-4 bg-greyscale-4 rounded-lg">
              <div className="text-sm text-greyscale-7 mb-1">Low-Value Accounts (&lt;40)</div>
              <div className="text-2xl font-medium text-vermilion-7">
                {(results.scoreDistribution[0].count + results.scoreDistribution[1].count).toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Score Distribution */}
          <div className="mb-6">
            <h4 className="font-medium text-blue-09 mb-3 flex items-center">
              <BarChart2 size={18} className="mr-2" />
              Score Distribution
            </h4>
            
            <div className="p-4 bg-greyscale-4 rounded-lg">
              <div className="h-8 flex rounded-md overflow-hidden mb-3">
                {results.scoreDistribution.map((segment, index) => (
                  <div 
                  key={segment.range}
                  className={`h-full ${
                    index === 0 ? 'bg-vermilion-7' :
                    index === 1 ? 'bg-amber-500' :
                    index === 2 ? 'bg-blue-5' :
                    index === 3 ? 'bg-blue-7' :
                    'bg-green-6'
                  }`}
                  style={{ width: `${segment.percentage}%` }}
                  title={`${segment.range}: ${segment.count} accounts (${segment.percentage}%)`}
                />
                ))}
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {results.scoreDistribution.map((segment, index) => (
                  <div key={segment.range} className="text-center">
                    <div className={`text-xs font-medium mb-1 ${
                      index === 0 ? 'text-vermilion-7' :
                      index === 1 ? 'text-amber-500' :
                      index === 2 ? 'text-blue-5' :
                      index === 3 ? 'text-blue-7' :
                      'text-green-6'
                    }`}>
                      {segment.range}
                    </div>
                    <div className="text-sm text-white">{segment.count}</div>
                    <div className="text-xs text-greyscale-7">{segment.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Top Accounts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-09 flex items-center">
                <BarChart2 size={18} className="mr-2" />
                Top Scoring Accounts
              </h4>
              
              <button
                type="button"
                className="text-sm text-blue-5 flex items-center"
                onClick={() => setActiveTab('accounts')}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('accounts')}
              >
                View All
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-greyscale-7 border-b border-greyscale-6">
                    <th className="pb-2 font-medium">Account</th>
                    <th className="pb-2 font-medium">Industry</th>
                    <th className="pb-2 font-medium text-right">Score</th>
                    <th className="pb-2 font-medium text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {results.topAccounts.map(account => (
                    <tr key={account.id} className="border-b border-greyscale-6 hover:bg-greyscale-4">
                      <td className="py-3 text-white">{account.name}</td>
                      <td className="py-3 text-greyscale-8">{account.industry}</td>
                      <td className="py-3 text-right">
                        <span className="text-green-6 font-medium">{account.score}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`${
                          account.change > 0 ? 'text-green-6' : 
                          account.change < 0 ? 'text-vermilion-7' : 
                          'text-greyscale-7'
                        }`}>
                          {account.change > 0 ? '+' : ''}{account.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Accounts Tab */}
      {activeTab === 'accounts' && (
        <div>
          {/* Search and Filter */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-greyscale-7" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 bg-greyscale-4 border border-greyscale-6 rounded-md text-white focus:outline-none focus:border-blue-5"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              type="button"
              className="px-4 py-2 border border-greyscale-6 text-white rounded-md flex items-center"
              onClick={() => {}}
              onKeyDown={(e) => e.key === 'Enter' && {}}
            >
              <Filter size={16} className="mr-2" aria-hidden="true" />
              Filter
            </button>
          </div>
          
          {/* Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-greyscale-7 border-b border-greyscale-6">
                  <th className="pb-2 font-medium">Account</th>
                  <th className="pb-2 font-medium">Industry</th>
                  <th className="pb-2 font-medium text-right">
                    <button 
                      type="button"
                      className="flex items-center justify-end cursor-pointer bg-transparent border-0 p-0"
                      onClick={() => handleSort('score')}
                      aria-label="Sort by score"
                    >
                      Score
                      <ArrowUpDown size={14} className="ml-1" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="pb-2 font-medium text-right">
                  <button 
                    type="button"
                    className="flex items-center justify-end cursor-pointer bg-transparent border-0 p-0"
                    onClick={() => handleSort('change')}
                    aria-label="Sort by change"
                  >
                    Change
                    <ArrowUpDown size={14} className="ml-1" aria-hidden="true" />
                  </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Show top accounts for demo, in a real app this would be paginated */}
                {results.topAccounts.map(account => (
                  <tr key={account.id} className="border-b border-greyscale-6 hover:bg-greyscale-4">
                    <td className="py-3 text-white">{account.name}</td>
                    <td className="py-3 text-greyscale-8">{account.industry}</td>
                    <td className="py-3 text-right">
                      <span className={`font-medium ${
                        account.score >= 80 ? 'text-green-6' :
                        account.score >= 60 ? 'text-blue-5' :
                        account.score >= 40 ? 'text-amber-500' :
                        'text-vermilion-7'
                      }`}>
                        {account.score}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`${
                        account.change > 0 ? 'text-green-6' : 
                        account.change < 0 ? 'text-vermilion-7' : 
                        'text-greyscale-7'
                      }`}>
                        {account.change > 0 ? '+' : ''}{account.change}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Add more mock accounts */}
                <tr key="midwest-supplies" className="border-b border-greyscale-6 hover:bg-greyscale-4">
                  <td className="py-3 text-white">Midwest Supplies</td>
                  <td className="py-3 text-greyscale-8">Distribution</td>
                  <td className="py-3 text-right">
                    <span className="text-blue-5 font-medium">76</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-green-6">+4</span>
                  </td>
                </tr>
                <tr key="financial-partners" className="border-b border-greyscale-6 hover:bg-greyscale-4">
                  <td className="py-3 text-white">Financial Partners</td>
                  <td className="py-3 text-greyscale-8">Financial Services</td>
                  <td className="py-3 text-right">
                    <span className="text-blue-5 font-medium">72</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-vermilion-7">-3</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center text-greyscale-7 text-sm">
            Showing 7 of {results.totalAccounts} accounts
          </div>
        </div>
      )}
      
      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div>
          {/* Key Insights */}
          <div className="mb-6">
            <h4 className="font-medium text-blue-09 mb-3">Key Insights</h4>
            <div className="space-y-3">
              {results.keyInsights.map((insight, index) => (
                <div key={`insight-${insight.substring(0, 20)}-${index}`} className="p-4 bg-greyscale-4 rounded-lg">
                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-blue-7 bg-opacity-20 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-xs text-blue-5">{index + 1}</span>
                    </div>
                    <p className="text-white">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended Actions */}
          <div>
            <h4 className="font-medium text-blue-09 mb-3">Recommended Actions</h4>
            <div className="space-y-3">
              {results.recommendedActions.map((action, index) => (
                <div key={`action-${action.substring(0, 20)}-${index}`} className="p-4 bg-greyscale-4 rounded-lg">
;                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-vermilion-7 bg-opacity-20 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-xs text-vermilion-7">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white">{action}</p>
                      <button
                        type="button"
                        className="mt-2 px-3 py-1 bg-vermilion-7 bg-opacity-20 text-vermilion-7 text-sm rounded-md hover:bg-opacity-30 transition-colors"
                        onClick={() => {}}
                        onKeyDown={(e) => e.key === 'Enter' && {}}
                      >
                        Take Action
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ResultsReview.propTypes = {
  data: PropTypes.shape({
    results: PropTypes.object,
    resultsSaved: PropTypes.bool,
    savedAt: PropTypes.string
  }).isRequired,
  updateData: PropTypes.func.isRequired
};

export default ResultsReview;
