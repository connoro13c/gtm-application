import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SimpleEnhancedScoring = () => {
  const [activeTab, setActiveTab] = useState('foundation');
  
  const tabs = [
    {
      id: 'foundation',
      label: 'Foundation',
      color: '#FF6B6B',
      description: 'Rule-Based Scoring',
      longDescription: 'Establish a baseline with simple, heuristic-based scoring.'
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
    }
  ];

  return (
    <div style={{
      background: '#0F172A',
      minHeight: '100vh',
      color: 'white',
      padding: '40px'
    }}>
      <h1 style={{
        fontSize: '60px',
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        Propensity to Buy
      </h1>
      
      <p style={{
        fontSize: '20px',
        color: 'rgba(255, 255, 255, 0.7)',
        maxWidth: '600px',
        marginBottom: '40px'
      }}>
        Transforming GTM strategy with intelligent account scoring
      </p>
      
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? tab.color : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 20px',
              color: activeTab === tab.id ? '#1A202C' : 'white',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '800px'
      }}>
        <h2 style={{
          fontSize: '24px',
          marginBottom: '10px',
          color: tabs.find(t => t.id === activeTab)?.color
        }}>
          {tabs.find(t => t.id === activeTab)?.label}
        </h2>
        <p>
          {tabs.find(t => t.id === activeTab)?.longDescription}
        </p>
      </div>
    </div>
  );
};

export default SimpleEnhancedScoring;