import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; - removed to fix flickering
import './EnhancedCombinedScoringPage.css';
import FoundationScenarioWizard from './FoundationScenarioWizard';

const EnhancedCombinedScoringPage = () => {
  const [activeTab, setActiveTab] = useState('foundation');
  const [showPulse, setShowPulse] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showScenarioWizard, setShowScenarioWizard] = useState(false);
  
  // Create pulse effect on page load
  useEffect(() => {
    setShowPulse(true);
    const timer = setTimeout(() => setShowPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle tab change with proper animations
  const handleTabChange = (tabId) => {
    if (isAnimating || tabId === activeTab) return; // Prevent unnecessary changes
    
    // Simply change the active tab - animations handled by motion components
    setActiveTab(tabId);
  };

  const tabs = [
    {
      id: 'foundation',
      icon: '✦',
      label: 'Foundation',
      color: '#F34E3F', // Primary Vermillion
      gradient: 'linear-gradient(135deg, #F34E3F 0%, #FFA293 100%)', // Vermillion-7 to Vermillion-9
      description: 'Rule-Based Scoring',
      longDescription: 'Establish a baseline with simple, heuristic-based scoring.',
      benefits: [
        'Rapid implementation',
        'Transparent logic',
        'No historical data needed'
      ],
      texture: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23F34E3F\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
    },
    {
      id: 'optimization',
      icon: '📊',
      label: 'Optimization',
      color: '#3737F2', // Secondary Blue
      gradient: 'linear-gradient(135deg, #3737F2 0%, #6D77FF 100%)', // Blue-5 to Blue-7
      description: 'Statistical Model',
      longDescription: 'Move from rules to data-driven scoring using historical patterns.',
      texture: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%233737F2\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
    },
    {
      id: 'intelligence',
      icon: '🧠',
      label: 'Intelligence',
      color: '#7834BB', // Violet accent
      gradient: 'linear-gradient(135deg, #7834BB 0%, #A96AF3 100%)', // Violet-5 to Violet-7
      description: 'Machine Learning',
      longDescription: 'Implement advanced machine learning for deeper pattern recognition.',
      texture: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%237834BB\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
    },
    {
      id: 'automation',
      icon: '⚡',
      label: 'Automation',
      color: '#00A0C8', // Teal-7
      gradient: 'linear-gradient(135deg, #00A0C8 0%, #4DB8DA 100%)', // Teal-7 to Teal-8
      description: 'Smart Workflows',
      longDescription: 'Automate scoring updates and integrate with your GTM systems.',
      texture: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%2300A0C8\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
    }
  ];

  return (
    <div className="enhanced-combined-scoring-page" style={{ backgroundColor: '#0F172A' }}>
      {/* Dynamic Background */}
      <div className="dynamic-background" style={{ height: '200vh' }}>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="grid-overlay"></div>
      </div>
      
      {showPulse && <div className="initial-pulse" />}
      
      <div className="page-content">
        {/* Back Button */}
        <button 
          className="back-button"
          onClick={() => window.location.href = '/'}
        >
          <span>←</span> Back to GTM App
        </button>
        
        {/* Compare View Toggle */}
        <div className="compare-view-toggle">
          <button 
            className="compare-button"
            onClick={() => alert('Compare view functionality would go here')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8"></polyline>
              <line x1="4" y1="20" x2="21" y2="3"></line>
              <polyline points="21 16 21 21 16 21"></polyline>
              <line x1="15" y1="15" x2="21" y2="21"></line>
              <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
            Compare Approaches
          </button>
        </div>
        
        {/* Hero Section */}
        <div className="hero-section">
          <div className="title-container">
            <h1 className="hero-title">Account Scoring</h1>
            <p className="hero-subtitle">
              Transforming GTM strategy with intelligent account scoring
            </p>
          </div>
          
          {/* Start Journey Button */}
          <button className="start-journey-button">
            Start Your Journey
          </button>
        </div>
        
        {/* Top Section - Tab selector */}
        {/* Journey Path Visualization */}
        <div className="journey-path-container">
          <div className="journey-stepper">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isPassed = tabs.findIndex(t => t.id === activeTab) >= index;
              const isLast = index === tabs.length - 1;
              
              return (
                <React.Fragment key={tab.id}>
                  <div 
                    className={`stepper-node ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                    onClick={() => handleTabChange(tab.id)}
                  >

                    <div 
                      className="stepper-icon"
                      style={{ 
                        backgroundColor: isActive || isPassed ? tab.color : 'rgba(255,255,255,0.2)',
                        boxShadow: isActive ? `0 0 15px ${tab.color}` : 'none'
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        {tab.id === 'foundation' && (
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        )}
                        {tab.id === 'optimization' && (
                          <>
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                          </>
                        )}
                        {tab.id === 'intelligence' && (
                          <>
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                          </>
                        )}
                        {tab.id === 'automation' && (
                          <>
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </>
                        )}
                      </svg>
                    </div>
                    <div className="stepper-content">
                      <div className="stepper-label">{tab.label}</div>
                      <div className="stepper-description">{tab.description}</div>
                    </div>
                  </div>
                  
                  {!isLast && (
                    <div className={`stepper-connector ${isPassed ? 'active' : ''}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isPassed ? tab.color : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
        {/* Unified Content Area */}
        <div className="unified-container" style={{ backgroundColor: 'transparent', padding: 0 }}>
          <div 
            className="unified-card"
            style={{ 
              background: 'rgba(248, 250, 252, 0.95)', // Off-white background
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              border: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {/* Modern Header with Improved Icon */}
            <div className="unified-header" style={{ background: 'white', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <div className="header-content">
                <div className="header-icon-wrapper">
                  <div className="header-icon">
                    {activeTab === 'foundation' && (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    )}
                    {activeTab === 'optimization' && (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    )}
                    {activeTab === 'intelligence' && (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    )}
                    {activeTab === 'automation' && (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="header-text">
                  <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
                  <p>{tabs.find(t => t.id === activeTab)?.description}</p>
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="unified-body" style={{ backgroundColor: 'transparent' }}>
              <div className="content-columns">
                {/* Left Column: Description and Benefits */}
                <div className="content-column description-column">
                  <h3 className="section-title">About {tabs.find(t => t.id === activeTab)?.label}</h3>
                  <p className="unified-description">
                    {tabs.find(t => t.id === activeTab)?.longDescription}
                  </p>
                  
                  {/* Benefits Section (only for Foundation) */}
                  {activeTab === 'foundation' && (
                    <div className="benefits-section">
                      <h3 className="section-title">Key Benefits</h3>
                      <ul className="benefits-list">
                        {tabs[0].benefits.map((benefit, index) => (
                          <li key={index}>
                            <span className="benefit-dot" style={{ background: tabs[0].color }}></span>
                            <span style={{ color: '#1A202C' }}>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Implementation Stage Indicator */}
                  <div className="level-indicator">
                    <div className="level-badge" style={{ backgroundColor: tabs.find(t => t.id === activeTab)?.color, color: '#1A202C' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      {activeTab === 'foundation' ? 'Ready to Implement' : 
                       activeTab === 'automation' ? 'Advanced Integration' : 'Ready for Setup'}
                    </div>
                  </div>
                </div>
                
                {/* Right Column: Code Example */}
                <div className="content-column code-column" style={{ backgroundColor: 'rgba(30, 41, 59, 0.07)', border: '1px solid rgba(30, 41, 59, 0.1)' }}>
                  <h3 className="section-title">Example Implementation</h3>
                  <div className="code-example syntax-highlighted" style={{ backgroundColor: 'rgba(30, 41, 59, 0.9)' }}>
                    {activeTab === 'foundation' && (
                      <pre><code className="language-javascript">{`// Rule-based scoring example
const scoreAccount = (account) => {
  let score = 0;
  
  // Company size factor
  if (account.employees > 1000) score += 30;
  else if (account.employees > 100) score += 20;
  else score += 10;
  
  // Industry factor
  if (account.industry === 'Technology') score += 25;
  else if (account.industry === 'Healthcare') score += 20;
  else score += 15;
  
  return score;
};`}</code></pre>
                    )}
                    
                    {activeTab === 'optimization' && (
                      <pre><code className="language-javascript">{`// Statistical optimization example
import { calculateWeights } from './statistical-model';

const scoreAccount = async (account, historicalData) => {
  // Get optimized weights from statistical model
  const weights = await calculateWeights(historicalData);
  
  return {
    companyScore: account.employees * weights.sizeWeight,
    industryScore: industryFactors[account.industry] * weights.industryWeight,
    engagementScore: account.interactions * weights.engagementWeight,
    totalScore: calculateTotalScore(account, weights)
  };
};`}</code></pre>
                    )}
                    
                    {activeTab === 'intelligence' && (
                      <pre><code className="language-javascript">{`// Machine learning model example
import { predictPropensity } from './ml-model';

const scoreAccount = async (account) => {
  // Features for the ML model
  const features = [
    account.employees,
    account.revenue,
    account.interactions,
    account.lastPurchaseDate,
    ...extractDemographics(account)
  ];
  
  // Get propensity score from ML model
  const propensityScore = await predictPropensity(features);
  
  return {
    score: propensityScore,
    confidence: propensityScore.confidence,
    factors: propensityScore.contributingFactors
  };
};`}</code></pre>
                    )}
                    
                    {activeTab === 'automation' && (
                      <pre><code className="language-javascript">{`// Automated workflow example
import { scheduleJob } from './workflow-engine';
import { notifyTeam } from './notification-service';

// Schedule automatic rescoring weekly
scheduleJob({
  name: 'account-rescoring',
  schedule: 'every monday at 2am',
  handler: async () => {
    const accounts = await fetchAccountsForScoring();
    const scoringResults = await batchScore(accounts);
    
    // Trigger actions based on score changes
    const significantChanges = detectSignificantChanges(scoringResults);
    if (significantChanges.length > 0) {
      notifyTeam('sales', { accounts: significantChanges });
    }
  }
});`}</code></pre>
                    )}
                  </div>
                </div>
              </div>
            
              {/* Progress Indicator (now placed in the main card) */}
              <div className="implementation-status" style={{ backgroundColor: 'transparent', border: 'none' }}>
                <div className="status-header">
                  <div className="status-label" style={{ color: '#1A202C' }}>Your Implementation Progress</div>
                  <div className="status-text" style={{ color: '#1A202C' }}>
                    {activeTab === 'foundation' ? 'Getting Started' : 
                     activeTab === 'optimization' ? 'In Progress' : 
                     activeTab === 'intelligence' ? 'Advanced Implementation' : 
                     'Near Completion'}
                  </div>
                </div>
                <div className="status-bar-container">
                  <div 
                    className="status-bar-fill"
                    style={{ 
                      width: activeTab === 'foundation' ? '25%' : 
                            activeTab === 'optimization' ? '50%' : 
                            activeTab === 'intelligence' ? '75%' : '90%',
                      background: tabs.find(t => t.id === activeTab)?.gradient
                    }}
                  ></div>
                  <div className="status-markers">
                    {tabs.map((tab, index) => {
                      const tabIndex = tabs.findIndex(t => t.id === activeTab);
                      const position = (index + 1) * 25 - 12.5;
                      return (
                        <div 
                          key={`marker-${tab.id}`}
                          className={`status-marker ${index <= tabIndex ? 'active' : ''}`}
                          style={{ 
                            left: `${position}%`,
                            backgroundColor: index <= tabIndex ? tab.color : 'rgba(30,41,59,0.3)'
                          }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons - Based on PRD Flows */}
              <div className="action-buttons">
                <button 
                  className="primary-button"
                  style={{
                    background: tabs.find(t => t.id === activeTab)?.gradient
                  }}
                  onClick={() => {
                    if (activeTab === 'foundation') {
                      console.log('Opening scenario wizard');
                      setShowScenarioWizard(true);
                      console.log('showScenarioWizard set to true');
                    } else {
                      alert(`Action for ${activeTab} would happen here`);
                    }
                  }}
                >
                  {activeTab === 'foundation' ? 'Create Scoring Scenario' : 
                   activeTab === 'optimization' ? 'Run Optimization Model' :
                   activeTab === 'intelligence' ? 'Configure ML Parameters' :
                   'Set Up Automated Workflow'}
                </button>
                <button 
                  className="secondary-button"
                  onClick={() => alert(`Secondary action for ${activeTab} would happen here`)}
                >
                  {activeTab === 'foundation' ? 'View Scenario Gallery' : 
                   activeTab === 'optimization' ? 'Compare Scenarios' :
                   activeTab === 'intelligence' ? 'Import Data Sources' :
                   'Schedule Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full page background overlay */}
      <div className="full-page-overlay"></div>
      
      {/* Simple Foundation Scoring Scenario Wizard */}
      {showScenarioWizard && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FoundationScenarioWizard onClose={() => setShowScenarioWizard(false)} />
        </div>
      )}
    </div>
  );
};

export default EnhancedCombinedScoringPage;