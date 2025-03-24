import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/enhanced-scoring-page.css';

const EnhancedScoringPage = () => {
  const [activeTab, setActiveTab] = useState('foundation');
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

  const tabs = [
    {
      id: 'foundation',
      icon: '✦',
      label: 'Foundation',
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
    <div className="enhanced-scoring-page">
      <DynamicBackground />
      {showPulse && <div className="initial-pulse" />}
      
      <div className="page-content">
        {/* Back Button */}
        <motion.button 
          className="back-button"
          onClick={() => window.location.href = '/'}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            padding: '10px 20px',
            color: 'white',
            cursor: 'pointer',
            marginBottom: '40px',
            width: 'fit-content'
          }}
        >
          <span>←</span> Back to GTM App
        </motion.button>
        
        {/* Hero Section with Gradient Title */}
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            marginBottom: '60px',
            textAlign: 'left',
            maxWidth: '1200px'
          }}
        >
          <motion.div 
            className="title-container"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h1 className="hero-title" style={{
              fontSize: '80px',
              fontWeight: 'bold',
              marginBottom: '10px',
              color: 'white',
              background: 'linear-gradient(to right, #FF6B6B, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block'
            }}>
              <span>Propensity</span> to <br />
              <span style={{ color: 'white', WebkitTextFillColor: 'white' }}>Buy</span>
            </h1>
            <p className="hero-subtitle" style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '600px',
              lineHeight: '1.6',
              marginBottom: '40px'
            }}>
              Transforming GTM strategy with intelligent account scoring
            </p>
            
            {/* Start Journey Button */}
            <motion.button
              className="start-journey-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(90deg, #FF6B6B 0%, #A78BFA 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                padding: '16px 36px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(167, 139, 250, 0.4)',
                position: 'absolute',
                right: '40px',
                top: '40px'
              }}
            >
              Start Your Journey
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Tabs Section */}
        <div className="tabs-container" style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === tab.id ? tab.gradient : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50px',
                padding: '10px 20px',
                color: activeTab === tab.id ? '#1A202C' : 'white',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Two-Column Layout */}
        <div className="content-layout" style={{
          display: 'flex',
          gap: '40px',
          width: '100%'
        }}>
          {/* Left Column - Content */}
          <motion.div 
            className="content-column"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              flex: '1',
              minWidth: '0'
            }}
          >
            {/* Tab Content Box */}
            <div className="tab-content" style={{
              background: 'rgba(26, 32, 44, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '30px'
            }}>
              {/* Current Tab Header */}
              <div 
                className="tab-header" 
                style={{
                  padding: '20px 30px',
                  background: tabs.find(t => t.id === activeTab)?.gradient || '',
                  borderRadius: '12px',
                  marginBottom: '30px'
                }}
              >
                <h2 style={{ 
                  color: '#1A202C',
                  fontSize: '28px',
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}>
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p style={{
                  color: '#1A202C',
                  fontSize: '18px',
                  opacity: 0.9
                }}>
                  {tabs.find(t => t.id === activeTab)?.description}
                </p>
              </div>

              {/* Tab Description */}
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '30px'
              }}>
                {tabs.find(t => t.id === activeTab)?.longDescription}
              </p>

              {/* Benefits for Foundation Tab */}
              {activeTab === 'foundation' && (
                <div className="benefits-section">
                  <h3 style={{
                    fontSize: '20px',
                    color: 'white',
                    marginBottom: '20px'
                  }}>
                    Key Benefits
                  </h3>
                  <ul style={{
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {tabs[0].benefits.map((benefit, index) => (
                      <li 
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '15px',
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}
                      >
                        <span style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: tabs[0].color
                        }}></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Buttons */}
              <div className="action-buttons" style={{
                display: 'flex',
                gap: '15px',
                marginTop: '30px'
              }}>
                <button style={{
                  background: tabs.find(t => t.id === activeTab)?.gradient || '',
                  color: '#1A202C',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  Begin {tabs.find(t => t.id === activeTab)?.label} Phase
                </button>
                <button style={{
                  background: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer'
                }}>
                  Learn More
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Visualization */}
          <motion.div 
            className="visualization-column"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              flex: '1',
              minWidth: '0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* 3D Sphere Visualization */}
            <div className="visualization" style={{
              width: '100%',
              height: '500px',
              background: 'radial-gradient(circle, rgba(22, 26, 35, 0.7) 0%, rgba(13, 17, 23, 0.7) 100%)',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.5)'
            }}>
              {/* This is where we'd render a 3D sphere - just a placeholder for now */}
              <div className="sphere" style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'transparent',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                position: 'relative',
                transform: 'rotateX(60deg) rotateZ(0deg)',
                transformStyle: 'preserve-3d'
              }}>
                {/* Orbit circles */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  transform: 'rotateX(70deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '110%',
                  height: '110%',
                  top: '-5%',
                  left: '-5%',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  transform: 'rotateX(60deg)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '90%',
                  height: '90%',
                  top: '5%',
                  left: '5%',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  transform: 'rotateX(80deg)'
                }}></div>
                
                {/* Animated dots */}
                {tabs.map((tab, i) => (
                  <div 
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: tab.color,
                      boxShadow: `0 0 10px ${tab.color}`,
                      top: `${20 + i * 20}%`,
                      left: `${40 + i * 15}%`,
                      transform: 'translate(-50%, -50%)',
                      animation: `float${i+1} 8s ease-in-out infinite`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Card Grid Section */}
        <motion.div 
          className="card-grid"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '25px',
            marginTop: '60px',
            width: '100%'
          }}
        >
          {tabs.map((card, index) => (
            <div 
              key={index}
              className="feature-card"
              style={{
                background: 'rgba(26, 32, 44, 0.7)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '30px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%',
                minHeight: '250px'
              }}
            >
              {/* Colored border on the left */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: card.color,
                borderTopLeftRadius: '16px',
                borderBottomLeftRadius: '16px'
              }}></div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '15px'
              }}>
                {card.label}
              </h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                {card.description}<br />
                {card.longDescription}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Animation keyframes */}
            {/* Animation keyframes */}
    </div>
  );
};

export default EnhancedScoringPage;