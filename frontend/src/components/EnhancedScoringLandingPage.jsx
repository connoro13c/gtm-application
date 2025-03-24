import React, { useState } from 'react';
import './EnhancedScoringLandingPage.css';

const EnhancedScoringLandingPage = () => {
  const [activeTab, setActiveTab] = useState('foundation');
  
  const tabs = [
    {
      id: 'foundation',
      label: 'Foundation',
      color: '#FF6B6B',
      description: 'Rule-Based Scoring',
      longDescription: 'Establish a baseline with simple, heuristic-based scoring.',
      benefits: ['Rapid implementation', 'Transparent logic', 'No historical data needed']
    },
    {
      id: 'optimization',
      label: 'Optimization',
      color: '#4ECDC4',
      description: 'Statistical Model',
      longDescription: 'Move from rules to data-driven scoring using historical patterns.'
    },
    {
      id: 'intelligence',
      label: 'Intelligence',
      color: '#A78BFA',
      description: 'Machine Learning',
      longDescription: 'Implement advanced machine learning for deeper pattern recognition.'
    },
    {
      id: 'automation',
      label: 'Automation',
      color: '#FFD166',
      description: 'Smart Workflows',
      longDescription: 'Automate scoring updates and integrate with your GTM systems.'
    }
  ];

  return (
    <div className="enhanced-scoring-landing-page">
      <div className="dynamic-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="grid-overlay"></div>
      </div>
      
      <div className="page-content">
        {/* Back Button */}
        <button className="back-button" onClick={() => window.location.href = '/'}>
          <span>←</span> Back to GTM App
        </button>
        
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            <span className="gradient-text">Propensity</span> to <br />
            <span>Buy</span>
          </h1>
          <p className="hero-subtitle">
            Transforming GTM strategy with intelligent account scoring
          </p>
          
          {/* Start Journey Button */}
          <button className="start-journey-button">
            Start Your Journey
          </button>
        </div>
        
        {/* Tabs */}
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
              {tab.label}
            </button>
          ))}
        </div>

        {/* Two-Column Layout */}
        <div className="content-layout">
          {/* Left Column - Content */}
          <div className="content-column">
            {/* Tab Content Box */}
            <div className="tab-content">
              {/* Current Tab Header */}
              <div 
                className="tab-header"
                style={{
                  '--tab-color': tabs.find(t => t.id === activeTab)?.color,
                  '--tab-color-transparent': `${tabs.find(t => t.id === activeTab)?.color}CC`
                }}
              >
                <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
                <p>{tabs.find(t => t.id === activeTab)?.description}</p>
              </div>

              {/* Tab Description */}
              <p className="tab-description">
                {tabs.find(t => t.id === activeTab)?.longDescription}
              </p>

              {/* Benefits for Foundation Tab */}
              {activeTab === 'foundation' && (
                <div className="benefits-section">
                  <h3>Key Benefits</h3>
                  <ul>
                    {tabs[0].benefits.map((benefit, index) => (
                      <li key={index} style={{ '--dot-color': tabs[0].color }}>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Buttons */}
              <div className="action-buttons">
                <button 
                  className="primary-button"
                  style={{
                    '--button-color': tabs.find(t => t.id === activeTab)?.color,
                    '--button-color-transparent': `${tabs.find(t => t.id === activeTab)?.color}CC`
                  }}
                >
                  Begin {tabs.find(t => t.id === activeTab)?.label} Phase
                </button>
                <button className="secondary-button">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Visualization */}
          <div className="visualization-column">
            {/* 3D Sphere Visualization */}
            <div className="visualization">
              {/* Placeholder sphere */}
              <div className="sphere">
                {/* Orbit circles */}
                <div className="orbit orbit-1"></div>
                <div className="orbit orbit-2"></div>
                <div className="orbit orbit-3"></div>
                
                {/* Dots */}
                {tabs.map((tab, i) => (
                  <div 
                    key={i}
                    className={`dot dot-${i+1}`}
                    style={{ '--dot-color': tab.color }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Grid Section */}
        <div className="card-grid">
          {tabs.map((card, index) => (
            <div key={index} className="feature-card">
              {/* Colored border on the left */}
              <div 
                className="card-accent"
                style={{ '--card-color': card.color }}
              ></div>
              
              <h3>{card.label}</h3>
              <p>
                {card.description}<br />
                {card.longDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedScoringLandingPage;