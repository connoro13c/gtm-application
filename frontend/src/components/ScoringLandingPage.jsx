import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Home from './Home';

const ScoringLandingPage = () => {
  const [showPulse, setShowPulse] = useState(false);
  
  // Create pulse effect on page load
  useEffect(() => {
    setShowPulse(true);
    const timer = setTimeout(() => setShowPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Dynamic background elements
  const DynamicBackground = () => {
    return (
      <div className="dynamic-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="grid-overlay"></div>
      </div>
    );
  };

  return (
    <div className="scoring-landing-page">
      <DynamicBackground />
      {showPulse && <div className="initial-pulse" />}
      
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
            <span>Account Scoring</span>
            </h1>
            <p className="hero-subtitle">Transform your GTM strategy with intelligent account scoring</p>
          </motion.div>
        </motion.div>
        
        <div className="main-content">
          <Home />
        </div>
      </div>
    </div>
  );
};

export default ScoringLandingPage;