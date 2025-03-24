import { useState } from 'react';

const SimpleScoringExample = () => {
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
    <div style={{ 
      backgroundColor: '#0D1117',
      color: 'white',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: '64px', 
            fontWeight: 800,
            background: 'linear-gradient(90deg, #FF4B4B 0%, #9747FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            Propensity to Buy
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Transform your GTM strategy with intelligent account scoring
          </p>
          <button style={{
            marginTop: '30px',
            padding: '16px 36px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #FF4B4B 0%, #9747FF 100%)',
            color: 'white',
            fontSize: '18px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(151, 71, 255, 0.3)'
          }}>
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleScoringExample;