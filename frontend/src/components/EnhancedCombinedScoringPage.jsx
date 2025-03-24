import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EnhancedCombinedScoringPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showPulse, setShowPulse] = useState(false);
  const [greeting, setGreeting] = useState('Good morning');
  const [hoverCard, setHoverCard] = useState(null);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  
  // Task completion state
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Define your ideal customer profile', completed: false },
    { id: 2, text: 'Set up basic rules for account evaluation', completed: false },
    { id: 3, text: 'Establish your baseline metrics', completed: true },
    { id: 4, text: 'Import existing account data', completed: true }
  ]);

  // Calculate progress percentage
  const progress = Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100);
  
  // Recent activity
  const activities = [
    { id: 1, icon: '🏆', text: 'Rule created', time: '2 hours ago' },
    { id: 2, icon: '📊', text: 'Data imported', time: 'Yesterday' }
  ];

  // Quick actions
  const quickActions = [
    { id: 1, text: 'Import CRM Data' },
    { id: 2, text: 'Define Scoring Rules' },
    { id: 3, text: 'Set Thresholds' },
    { id: 4, text: 'View Sample Results' }
  ];
  
  // Track cursor for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Create pulse effect on page load
  useEffect(() => {
    setShowPulse(true);
    const timer = setTimeout(() => setShowPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  // Simulate completion of a task with animation
  const completeTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    setShowCompletionAnimation(true);
    setTimeout(() => setShowCompletionAnimation(false), 2000);
  };
  
  // Rich data for the phases
  const phases = [
    {
      title: 'Foundation',
      subtitle: 'Rule-Based Scoring',
      description: 'Establish a baseline with simple, heuristic-based scoring.',
      color: '#FF4B4B',
      gradient: 'linear-gradient(135deg, #FF4B4B 0%, #FF8F70 100%)',
      icon: '✨',
      benefits: ['Rapid implementation', 'Transparent logic', 'No historical data needed']
    },
    {
      title: 'Optimization',
      subtitle: 'Statistical Model',
      description: 'Move from rules to data-driven scoring using historical patterns.',
      color: '#4B7BFF',
      gradient: 'linear-gradient(135deg, #4B7BFF 0%, #38CFFF 100%)',
      icon: '📊',
      benefits: ['Data-validated weights', 'Higher accuracy', 'Reduced manual configuration']
    },
    {
      title: 'Intelligence',
      subtitle: 'Machine Learning',
      description: 'Implement advanced machine learning for deeper pattern recognition.',
      color: '#9747FF',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)',
      icon: '🧠',
      benefits: ['Complex pattern recognition', 'Non-linear relationships', 'Continuous learning']
    },
    {
      title: 'Automation',
      subtitle: 'Real-Time AI',
      description: 'Deploy real-time scoring with automated optimization.',
      color: '#00C48C',
      gradient: 'linear-gradient(135deg, #00C48C 0%, #38EFC3 100%)',
      icon: '⚡',
      benefits: ['Real-time updates', 'Anomaly detection', 'Automated re-training']
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
        
        {/* Animated data points */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="data-point"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.2 + Math.random() * 0.5
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: 20 + Math.random() * 30,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>
    );
  };

  // Interactive cursor follow element
  const CursorFollower = () => {
    return (
      <motion.div 
        className="cursor-follower"
        animate={{
          x: cursorPosition.x - 25,
          y: cursorPosition.y - 25,
        }}
        transition={{
          type: "spring",
          mass: 0.1,
          stiffness: 120,
          damping: 10
        }}
      />
    );
  };

  // 3D Data visualization
  const DataVisualization = () => {
    return (
      <div className="data-visualization">
        <motion.div 
          className="data-sphere"
          animate={{ 
            rotateY: [0, 360],
            rotateX: [10, -10, 10]
          }}
          transition={{ 
            rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="orbit" 
              style={{ 
                transform: `rotateX(${i * 22.5}deg) rotateY(${i * 45}deg)`,
                borderColor: phases[i % 4].color 
              }}
            >
              <div 
                className="data-node" 
                style={{ 
                  backgroundColor: phases[i % 4].color,
                  boxShadow: `0 0 15px ${phases[i % 4].color}`
                }}
              />
            </div>
          ))}
        </motion.div>
        
        <motion.div 
          className="glow-effect"
          animate={{ 
            opacity: [0.5, 0.8, 0.5], 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
        />
      </div>
    );
  };

  // Data flow visualization
  const DataFlow = () => {
    return (
      <div className="data-flow-container">
        <div className="data-flow">
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i}
              className="data-particle"
              style={{ 
                backgroundColor: phases[i % 4].color,
                width: 3 + Math.random() * 6,
                height: 3 + Math.random() * 6,
                opacity: 0.3 + Math.random() * 0.7
              }}
              initial={{ 
                x: "-10%", 
                y: -10 + Math.random() * 120 
              }}
              animate={{ 
                x: "110%", 
                y: -10 + Math.random() * 120 
              }}
              transition={{ 
                duration: 2 + Math.random() * 8, 
                repeat: Infinity, 
                delay: Math.random() * 2, 
                ease: "linear" 
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Phase selector tabs
  const PhaseTabs = () => {
    return (
      <div className="phase-tabs">
        {phases.map((phase, index) => (
          <motion.div 
            key={index}
            className={`phase-tab ${activeStep === index ? 'active' : ''}`}
            onClick={() => setActiveStep(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: activeStep === index ? phase.gradient : 'rgba(30, 38, 55, 0.7)',
              borderBottom: `3px solid ${phase.color}`
            }}
          >
            <span className="phase-icon">{phase.icon}</span>
            <span className="phase-name">{phase.title}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  // Confetti animation component
  const ConfettiAnimation = () => {
    if (!showCompletionAnimation) return null;
    
    return (
      <div className="confetti-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: [
                '#F34E3F', // Vermillion-7
                '#3737F2', // Blue-5
                '#7834BB', // Violet-5
                '#4C53FF', // Blue-6
                '#FF7867', // Vermillion-8
              ][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>
    );
  };
  
  // Phase content area
  const PhaseContent = () => {
    const phase = phases[activeStep];
    
    return (
      <motion.div 
        className="phase-content"
        key={activeStep}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: the30 }}
      >
        {/* Phase header */}
        <div 
          className="phase-header" 
          style={{ background: phase.gradient }}
        >
          <div className="phase-number">{activeStep + 1}</div>
          <h2>{phase.title}</h2>
          <h3>{phase.subtitle}</h3>
        </div>
        
        {/* Phase description */}
        <p className="phase-description">{phase.description}</p>
        
        {/* Progress section */}
        <div className="progress-section">
          <h4>Progress</h4>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{
                  width: `${progress}%`,
                  background: phase.gradient
                }}
              />
            </div>
            <div className="progress-text">{progress}% Complete</div>
          </div>
        </div>
        
        {/* Task list */}
        <div className="task-list">
          <h4>Current Tasks</h4>
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
              onClick={() => completeTask(task.id)}
            >
              <div className="task-checkbox">
                {task.completed ? 
                  <span className="checkbox-icon">✓</span> : 
                  <span className="checkbox-icon"></span>
                }
              </div>
              <div className="task-text">{task.text}</div>
            </div>
          ))}
        </div>
        
        {/* Benefits */}
        <div className="benefits-section">
          <h4>Key Benefits</h4>
          <ul className="benefits-list">
            {phase.benefits.map((benefit, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span 
                  className="benefit-dot" 
                  style={{ background: phase.gradient }}
                />
                {benefit}
              </motion.li>
            ))}
          </ul>
        </div>
        
        {/* Action buttons */}
        <div className="action-buttons">
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
        </div>
      </motion.div>
    );
  };

  return (
    <div className="combined-scoring-page">
      {/* Dynamic elements */}
      <DynamicBackground />
      {showPulse && <div className="initial-pulse" />}
      <CursorFollower />
      <ConfettiAnimation />
      
      {/* Back button */}
      <motion.button 
        className="back-button"
        onClick={() => navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="back-icon">←</span> Back to GTM App
      </motion.button>
      
      <div className="page-content">
        {/* Header section */}
        <div className="header-section">
          <div className="title-area">
            <motion.h1 
              className="main-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Account Scoring
            </motion.h1>
            <motion.p 
              className="subtitle"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Build the foundation for your GTM strategy with intelligent account scoring
            </motion.p>
          </div>
          
          <motion.div 
            className="greeting-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            style={{ 
              animation: 'breathe 4s infinite ease-in-out'
            }}
          >
            <p className="greeting-text">{greeting}, Alex!</p>
          </motion.div>
        </div>

        {/* Phase tabs */}
        <PhaseTabs />
        
        {/* Main content area */}
        <div className="main-content-area">
          {/* Left panel - Phase details */}
          <div className="left-panel">
            <AnimatePresence mode="wait">
              <PhaseContent />
            </AnimatePresence>
          </div>
          
          {/* Right panel - Data visualization */}
          <div className="right-panel">
            <DataVisualization />
            <DataFlow />
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="bottom-section">
          {/* Recent activity */}
          <div className="recent-activity-panel">
            <h3>Recent Activity</h3>
            <div className="activity-items">
              {activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-details">
                    <p className="activity-text">{activity.text}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="quick-actions-panel">
            <h3>Quick Actions</h3>
            <div className="action-grid">
              {quickActions.map((action, index) => (
                <motion.button 
                  key={action.id} 
                  className={`quick-action-btn ${index === 0 ? 'primary' : 'secondary'}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: index === 0 ? phases[1].gradient : 'transparent',
                    border: index === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {action.text}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCombinedScoringPage;