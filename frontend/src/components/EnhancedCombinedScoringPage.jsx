import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './EnhancedCombinedScoringPage.css';

const EnhancedCombinedScoringPage = () => {
  const [activeTab, setActiveTab] = useState('foundation');
  const [showPulse, setShowPulse] = useState(false);
  
  // Create pulse effect on page load
  useEffect(() => {
    setShowPulse(true);
    const timer = setTimeout(() => setShowPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    {
      id: 'foundation',
      label: 'Foundation',
      icon: '✦',
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF9E9E 100%)',
      description: 'Rule-Based Scoring',
      longDescription: 'Establish a baseline with simple, heuristic-based scoring.',
      benefits: [
        'Rapid implementation',
        'Transparent logic',
        'No historical data needed'
      ]
    },
    {
      id: 'optimization',
      icon: '📊',
      label: 'Optimization',
      color: '#4ECDC4',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #7BE0D6 100%)',
      description: 'Statistical Model',
      longDescription: 'Move from rules to data-driven scoring using historical patterns.'
    },
    {
      id: 'intelligence',
      icon: '🧠',
      label: 'Intelligence',
      color: '#A78BFA',
      gradient: 'linear-gradient(135deg, #A78BFA 0%, #C4A8FF 100%)',
      description: 'Machine Learning',
      longDescription: 'Implement advanced machine learning for deeper pattern recognition.'
    },
    {
      id: 'automation',
      icon: '⚡',
      label: 'Automation',
      color: '#FFD166',
      gradient: 'linear-gradient(135deg, #FFD166 0%, #FFE1A0 100%)',
      description: 'Smart Workflows',
      longDescription: 'Automate scoring updates and integrate with your GTM systems.'
    }
  ];

  return (
    <div className="enhanced-combined-scoring-page">
      {/* Dynamic Background */}
      <div className="dynamic-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="grid-overlay"></div>
      </div>
      
      {showPulse && <div className="initial-pulse" />}
      
      <div className="page-content">
        {/* Back Button */}
        <motion.button 
          className="back-button"
          onClick={() => window.location.href = '/'}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>←</span> Back to GTM App
        </motion.button>
        
        {/* Hero Section */}
        <div className="hero-section">
          <motion.div 
            className="title-container"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h1 className="hero-title">
              <span className="gradient-text">Propensity</span> to <br />
              <span>Buy</span>
            </h1>
            <p className="hero-subtitle">
              Transforming GTM strategy with intelligent account scoring
            </p>
          </motion.div>
          
          {/* Start Journey Button */}
          <motion.button
            className="start-journey-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
        </div>
        
        {/* Main Content */}
        <div className="main-content-container">
          {/* Left Column: Tabs and Content */}
          <div className="left-column">
            {/* Tab Buttons */}
            <div className="tabs-container">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    '--tab-color': tab.color,
                    '--tab-color-transparent': `${tab.color}CC`
                  }}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Content Card */}
            <motion.div 
              className="content-card"
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div 
                className="content-header"
                style={{
                  background: tabs.find(t => t.id === activeTab)?.gradient
                }}
              >
                <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
                <p>{tabs.find(t => t.id === activeTab)?.description}</p>
              </div>
              
              {/* Content */}
              <div className="content-body">
                <p className="content-description">
                  {tabs.find(t => t.id === activeTab)?.longDescription}
                </p>
                
                {/* Benefits for Foundation */}
                {activeTab === 'foundation' && (
                  <div className="benefits-section">
                    <h3>Key Benefits</h3>
                    <ul>
                      {tabs[0].benefits.map((benefit, index) => (
                        <li key={index}>
                          <span className="benefit-dot" style={{ background: tabs[0].color }}></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="action-buttons">
                  <button 
                    className="primary-button"
                    style={{
                      background: tabs.find(t => t.id === activeTab)?.gradient
                    }}
                  >
                    Begin {tabs.find(t => t.id === activeTab)?.label} Phase
                  </button>
                  <button className="secondary-button">
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Visualization */}
          <div className="right-column">
            <motion.div 
              className="visualization-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {/* 3D Sphere */}
              <div className="sphere-container">
                <div className="sphere">
                  {/* Orbits */}
                  <div className="orbit orbit-1"></div>
                  <div className="orbit orbit-2"></div>
                  <div className="orbit orbit-3"></div>
                  
                  {/* Colored Dots */}
                  {tabs.map((tab, index) => (
                    <div 
                      key={index}
                      className={`sphere-dot dot-${index + 1} ${activeTab === tab.id ? 'active' : ''}`}
                      style={{ '--dot-color': tab.color }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Indicator Dots */}
              <div className="indicator-dots">
                {tabs.map((tab, index) => (
                  <div 
                    key={index}
                    className={`indicator-dot ${activeTab === tab.id ? 'active' : ''}`}
                    style={{ background: tab.color }}
                    onClick={() => setActiveTab(tab.id)}
                  ></div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="feature-cards">
          {tabs.map((tab, index) => (
            <motion.div 
              key={index}
              className={`feature-card ${activeTab === tab.id ? 'active' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              onClick={() => setActiveTab(tab.id)}
            >
              <div 
                className="card-accent"
                style={{ background: tab.color }}
              ></div>
              <div className="card-icon" style={{ color: tab.color }}>{tab.icon}</div>
              <h3>{tab.label}</h3>
              <p>{tab.description}</p>
              <p className="card-description">{tab.longDescription}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCombinedScoringPage;