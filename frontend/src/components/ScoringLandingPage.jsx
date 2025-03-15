import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScoringLandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showPulse, setShowPulse] = useState(false);
  
  // Cursor tracking removed for performance

  // Create pulse effect on page load
  useEffect(() => {
    setShowPulse(true);
    const timer = setTimeout(() => setShowPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Rich data for the phases
  const phases = [
    {
      title: 'Foundation',
      subtitle: 'Rule-Based Scoring',
      description: 'Establish a baseline with simple, heuristic-based scoring.',
      color: '#FF4B4B',
      gradient: 'linear-gradient(135deg, #FF4B4B 0%, #FF8F70 100%)',
      icon: 'u2728',
      benefits: ['Rapid implementation', 'Transparent logic', 'No historical data needed'],
      illustration: 'data-foundation.svg'
    },
    {
      title: 'Optimization',
      subtitle: 'Statistical Model',
      description: 'Move from rules to data-driven scoring using historical patterns.',
      color: '#4B7BFF',
      gradient: 'linear-gradient(135deg, #4B7BFF 0%, #38CFFF 100%)',
      icon: 'ud83dudcca',
      benefits: ['Data-validated weights', 'Higher accuracy', 'Reduced manual configuration'],
      illustration: 'data-optimization.svg'
    },
    {
      title: 'Intelligence',
      subtitle: 'Machine Learning',
      description: 'Implement advanced machine learning for deeper pattern recognition.',
      color: '#9747FF',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
      icon: 'ud83eudde0',
      benefits: ['Complex pattern recognition', 'Non-linear relationships', 'Continuous learning'],
      illustration: 'data-intelligence.svg'
    },
    {
      title: 'Automation',
      subtitle: 'Real-Time AI',
      description: 'Deploy real-time scoring with automated optimization.',
      color: '#00C48C',
      gradient: 'linear-gradient(135deg, #00C48C 0%, #38EFC3 100%)',
      icon: 'u26a1',
      benefits: ['Real-time updates', 'Anomaly detection', 'Automated re-training'],
      illustration: 'data-automation.svg'
    }
  ];

  // Dynamic background elements
  const DynamicBackground = () => {
    return (
      <div className="dynamic-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="grid-overlay"></div>
        
        {/* Animated data points removed */}
      </div>
    );
  };

  // Interactive cursor follow element - removed for performance
  const CursorFollower = () => {
    return null;
  };

  // 3D Data visualization - simplified for performance
  const DataVisualization = () => {
    return (
      <div className="data-visualization">
        <div className="data-sphere-static">
          {/* 3D visualization removed for performance */}
          <div className="static-visualization-text">Data Visualization</div>
        </div>
      </div>
    );
  };

  // Interactive phase selector
  const PhaseSelector = () => {
    return (
      <div className="phase-selector">
        {phases.map((phase, index) => (
          <motion.div 
            key={index}
            className={`phase-indicator ${activeStep === index ? 'active' : ''}`}
            onClick={() => setActiveStep(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              background: activeStep === index ? phase.gradient : 'rgba(255, 255, 255, 0.1)',
              boxShadow: activeStep === index ? `0 4px 10px ${phase.color}60` : 'none',
              color: activeStep === index ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <span className="phase-icon">{phase.icon}</span>
            <span className="phase-label">{phase.title}</span>
            {/* Active highlight removed */}
          </motion.div>
        ))}
      </div>
    );
  };

  // Detailed phase content
  const PhaseContent = () => {
    const phase = phases[activeStep];
    
    return (
      <motion.div 
        className="phase-content"
        key={activeStep}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="phase-header" style={{ background: phase.gradient }}>
          <div className="phase-number">{activeStep + 1}</div>
          <h2>{phase.title}</h2>
          <h3>{phase.subtitle}</h3>
        </div>
        
        <div className="phase-details">
          <p className="phase-description">{phase.description}</p>
          
          <div className="benefits-container">
            <h4>Key Benefits</h4>
            <ul className="benefits-list">
              {phase.benefits.map((benefit, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <span className="benefit-bullet" style={{ background: phase.gradient }}></span>
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>
          
          <motion.div 
            className="action-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button 
              className="primary-btn"
              whileHover={{ scale: 1.05, boxShadow: `0 5px 15px ${phase.color}50` }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                background: phase.gradient
              }}
            >
              Begin {phase.title} Phase
            </motion.button>
            
            <motion.button 
              className="secondary-btn"
              whileHover={{ 
                scale: 1.05, 
                color: phase.color, 
                borderColor: phase.color 
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Magical data flow visualization
  const DataFlow = () => {
    return (
      <div className="data-flow-container">
        <div className="data-flow">
          {/* Data flow particles removed for performance reasons */}
        </div>
      </div>
    );
  };

  return (
    <div className="scoring-landing-page">
      <DynamicBackground />
      {showPulse && <div className="initial-pulse" />}
      <CursorFollower />
      
      <div className="page-content">
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="title-container"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h1 className="hero-title">
              <span className="title-highlight">Propensity</span> to Buy
            </h1>
            <p className="hero-subtitle">Transforming GTM strategy with intelligent account scoring</p>
          </motion.div>
          
          <motion.div 
            className="cta-container"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <motion.button 
              className="cta-button" 
              whileHover={{ scale: 1.05, boxShadow: "0 5px 25px rgba(255, 75, 75, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <span className="button-glow"></span>
            </motion.button>
          </motion.div>
        </motion.div>
        
        <div className="main-content">
          <div className="left-panel">
            <PhaseSelector />
            <AnimatePresence mode="wait">
              <PhaseContent />
            </AnimatePresence>
          </div>
          
          <div className="right-panel">
            <DataVisualization />
            <DataFlow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringLandingPage;