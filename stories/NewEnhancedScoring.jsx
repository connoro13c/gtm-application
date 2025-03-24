import React, { useState } from 'react';

const NewEnhancedScoring = () => {
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
      {/* Back Button */}
      <button 
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
      </button>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '72px', 
            fontWeight: 800,
            background: 'linear-gradient(90deg, #FF6B6B 0%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px'
          }}>
            Propensity to <span style={{ color: 'white', WebkitTextFillColor: 'white' }}>Buy</span>
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            marginBottom: '40px'
          }}>
            Transforming GTM strategy with intelligent account scoring
          </p>
          
          {/* Start Journey Button */}
          <button style={{
            position: 'absolute',
            right: '40px',
            top: '40px',
            padding: '16px 36px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #A78BFA 100%)',
            color: 'white',
            fontSize: '18px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(167, 139, 250, 0.3)'
          }}>
            Start Your Journey
          </button>
        </div>
        
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === tab.id ? 
                  `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}CC 100%)` : 
                  'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50px',
                padding: '10px 20px',
                color: activeTab === tab.id ? '#1A202C' : 'white',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Two-Column Layout */}
        <div style={{
          display: 'flex',
          gap: '40px',
          width: '100%'
        }}>
          {/* Left Column - Content */}
          <div style={{
            flex: '1',
            minWidth: '0'
          }}>
            {/* Tab Content Box */}
            <div style={{
              background: 'rgba(26, 32, 44, 0.8)',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '30px'
            }}>
              {/* Current Tab Header */}
              <div style={{
                padding: '20px 30px',
                background: `linear-gradient(135deg, ${tabs.find(t => t.id === activeTab)?.color} 0%, ${tabs.find(t => t.id === activeTab)?.color}CC 100%)`,
                borderRadius: '12px',
                marginBottom: '30px'
              }}>
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
                <div>
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
              <div style={{
                display: 'flex',
                gap: '15px',
                marginTop: '30px'
              }}>
                <button style={{
                  background: `linear-gradient(135deg, ${tabs.find(t => t.id === activeTab)?.color} 0%, ${tabs.find(t => t.id === activeTab)?.color}CC 100%)`,
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
          </div>

          {/* Right Column - Visualization */}
          <div style={{
            flex: '1',
            minWidth: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* 3D Sphere Visualization */}
            <div style={{
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
              {/* Placeholder sphere */}
              <div style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'transparent',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                position: 'relative',
                transform: 'rotate(45deg)'
              }}>
                {/* Orbit circles */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 255, 255, 0.1)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '110%',
                  height: '110%',
                  top: '-5%',
                  left: '-5%',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 255, 255, 0.1)'
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '90%',
                  height: '90%',
                  top: '5%',
                  left: '5%',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 255, 255, 0.1)'
                }}></div>
                
                {/* Dots */}
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
                      top: `${30 + i * 15}%`,
                      left: `${40 + i * 15}%`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Grid Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '25px',
          marginTop: '60px',
          width: '100%'
        }}>
          {tabs.map((card, index) => (
            <div 
              key={index}
              style={{
                background: 'rgba(26, 32, 44, 0.7)',
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
        </div>
      </div>
      
      {/* Background Elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.4) 0%, rgba(255, 107, 107, 0) 70%)',
          filter: 'blur(40px)',
          opacity: 0.6,
          top: '-100px',
          left: '-100px'
        }}></div>
        
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78, 205, 196, 0.4) 0%, rgba(78, 205, 196, 0) 70%)',
          filter: 'blur(40px)',
          opacity: 0.6,
          bottom: '-150px',
          right: '-100px'
        }}></div>
        
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, rgba(167, 139, 250, 0) 70%)',
          filter: 'blur(40px)',
          opacity: 0.6,
          top: '60%',
          left: '15%'
        }}></div>

        <div style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 209, 102, 0.4) 0%, rgba(255, 209, 102, 0) 70%)',
          filter: 'blur(40px)',
          opacity: 0.6,
          top: '20%',
          right: '15%'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          zIndex: -1
        }}></div>
      </div>
    </div>
  );
};

export default NewEnhancedScoring;