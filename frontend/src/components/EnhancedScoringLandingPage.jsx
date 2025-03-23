import React, { useState, useEffect } from 'react';
import './EnhancedScoringLandingPage.css';

const EnhancedScoringLandingPage = () => {
  const [greeting, setGreeting] = useState('');
  const [hoverCard, setHoverCard] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Track mouse movement for responsive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simulate completion of a task with animation
  const completeTask = () => {
    setShowCompletionAnimation(true);
    setTimeout(() => setShowCompletionAnimation(false), 2000);
  };

  // Phase data
  const phases = [
    {
      number: 1,
      title: 'Foundation',
      subtitle: 'Rule-based scoring',
      status: 'active',
      color: '#F34E3F' // Vermillion-7
    },
    {
      number: 2,
      title: 'Optimization',
      subtitle: 'Statistical modeling',
      status: 'coming-soon',
      color: '#3737F2' // Blue-5
    },
    {
      number: 3,
      title: 'Intelligence',
      subtitle: 'ML-powered insights',
      status: 'locked',
      color: '#7834BB' // Violet-5
    }
  ];

  // Tasks in current phase
  const tasks = [
    { id: 1, text: 'Define your ideal customer profile', completed: false },
    { id: 2, text: 'Set up basic rules for account evaluation', completed: false },
    { id: 3, text: 'Establish your baseline metrics', completed: true },
    { id: 4, text: 'Import existing account data', completed: true }
  ];

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

  // Calculate progress percentage
  const progress = Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100);

  return (
    <div 
      className="scoring-landing-page"
      style={{ 
        position: 'relative',
        backgroundColor: '#F8F8F8', // Greyscale-10
        minHeight: '100vh',
        padding: '32px',
        fontFamily: 'PolySans, Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        color: '#202020' // Greyscale-2
      }}
    >
      {/* Background subtle gradient that responds to cursor */}
      <div 
        className="responsive-background" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(243, 78, 63, 0.03) 0%, rgba(120, 52, 187, 0.01) 50%, rgba(248, 248, 248, 0) 100%)`,
          transition: 'background 1s ease-out',
          zIndex: 0
        }}
      ></div>

      {/* Confetti animation on task completion */}
      {showCompletionAnimation && (
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
            ></div>
          ))}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              color: '#7834BB' // Violet-5
            }}>
              <span className="sparkle">&#x2728;</span> Account Scoring
            </h1>
            <p style={{ fontSize: '16px', color: '#4A4A4A' /* Greyscale-4 */ }}>
              Build your GTM strategy with intelligent scoring
            </p>
          </div>
          <div style={{ 
            padding: '16px 24px', 
            backgroundColor: 'white', 
            borderRadius: '16px',
            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.05)',
            animation: 'breathe 4s infinite ease-in-out'
          }}>
            <p style={{ fontWeight: 'medium', color: '#7834BB' /* Violet-5 */ }}>
              {greeting}, Alex!
            </p>
          </div>
        </div>

        {/* Phase Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          {phases.map((phase, index) => (
            <div 
              key={index}
              className={`phase-card ${hoverCard === index ? 'hover' : ''}`}
              onMouseEnter={() => setHoverCard(index)}
              onMouseLeave={() => setHoverCard(null)}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: hoverCard === index 
                  ? `0px 15px 25px rgba(0, 0, 0, 0.1)` 
                  : `0px 5px 10px rgba(0, 0, 0, 0.05)`,
                transform: hoverCard === index ? 'translateY(-5px)' : 'translateY(0)',
                transition: 'all 0.3s ease-in-out',
                border: phase.status === 'active' ? `2px solid ${phase.color}` : '2px solid transparent',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '16px'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: phase.status === 'active' ? phase.color : '#DDDDDD', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '16px',
                  transition: 'all 0.3s ease-in-out'
                }}>
                  {phase.number}
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: '24px',  // H3 size instead of H2 for better fit 
                    fontWeight: 'bold', 
                    marginBottom: '4px', 
                    color: phase.status === 'active' ? phase.color : '#202020' 
                  }}>
                    {phase.title}
                  </h2>
                  <div style={{ 
                    height: '2px', 
                    width: '40px', 
                    backgroundColor: phase.color, 
                    marginBottom: '8px',
                    transition: 'width 0.3s ease-in-out',
                    width: hoverCard === index ? '60px' : '40px'
                  }}></div>
                </div>
              </div>
              
              <p style={{ 
                fontSize: '16px', 
                marginBottom: '24px', 
                color: '#4A4A4A' // Greyscale-4
              }}>
                {phase.subtitle}
              </p>
              
              <div style={{ 
                padding: '8px 16px', 
                display: 'inline-block', 
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                backgroundColor: phase.status === 'active' 
                  ? phase.color
                  : 'transparent',
                color: phase.status === 'active' 
                  ? 'white' 
                  : '#909090', // Greyscale-7
                border: phase.status === 'active' 
                  ? 'none' 
                  : '1px solid #DDDDDD', // Greyscale-9
                cursor: phase.status === 'locked' ? 'not-allowed' : 'pointer'
              }}>
                {phase.status === 'active' && 'Active'}
                {phase.status === 'coming-soon' && 'Coming Soon'}
                {phase.status === 'locked' && 'Locked'}
              </div>
            </div>
          ))}
        </div>

        {/* Current Phase Details */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '24px',
          boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px',
          borderLeft: `4px solid ${phases[0].color}`,
          transition: 'transform 0.3s ease-in-out',
          animation: 'breathe 6s infinite ease-in-out'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: phases[0].color 
          }}>
            Current Phase: Foundation
          </h3>
          <div style={{ 
            height: '2px', 
            width: '60px', 
            backgroundColor: phases[0].color, 
            marginBottom: '24px' 
          }}></div>
          
          <div style={{ marginBottom: '24px' }}>
            {tasks.map((task, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '16px',
                  cursor: 'pointer',
                  opacity: task.completed ? 0.8 : 1
                }}
                onClick={() => !task.completed && completeTask()}
              >
                <span style={{ 
                  marginRight: '12px', 
                  fontSize: '18px' 
                }}>
                  {task.completed ? '✓' : '•'}
                </span>
                <p style={{ 
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#909090' : '#202020' // Greyscale-7 if completed
                }}>
                  {task.text}
                </p>
              </div>
            ))}
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <p style={{ marginBottom: '8px' }}>Progress:</p>
            <div style={{ 
              height: '8px', 
              backgroundColor: '#DDDDDD', // Greyscale-9
              borderRadius: '4px', 
              position: 'relative' 
            }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                height: '100%', 
                width: `${progress}%`, 
                backgroundColor: '#F34E3F', // Vermillion-7
                borderRadius: '4px',
                transition: 'width 0.5s ease-out'
              }}></div>
            </div>
            <p style={{ 
              fontSize: '14px', 
              marginTop: '8px',
              color: '#4A4A4A', // Greyscale-4
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>&#x1F44D;</span> You're making great progress!
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ 
              backgroundColor: '#F34E3F', // Vermillion-7
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0 4px 6px rgba(243, 78, 63, 0.2)',
            }}>
              Continue Building
            </button>
            <button style={{ 
              backgroundColor: '#3737F2', // Blue-5
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out'
            }}>
              Preview Results
            </button>
            <button style={{ 
              backgroundColor: 'transparent', 
              color: '#4A4A4A', // Greyscale-4
              border: '1px solid #DDDDDD', // Greyscale-9
              padding: '12px 24px', 
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out'
            }}>
              Save Draft
            </button>
          </div>
        </div>

        {/* Bottom sections */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr',
          gap: '16px'
        }}>
          {/* Recent Activity */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#7834BB' // Violet-5
            }}>
              Recent Activity
            </h3>
            <div style={{ 
              height: '2px', 
              width: '40px', 
              backgroundColor: '#7834BB', // Violet-5
              marginBottom: '16px' 
            }}></div>
            
            {activities.map((activity, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  marginBottom: '16px',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                  cursor: 'pointer'
                }}
                className="activity-item"
              >
                <span style={{ 
                  fontSize: '24px', 
                  marginRight: '12px' 
                }}>
                  {activity.icon}
                </span>
                <div>
                  <p style={{ fontWeight: '500' }}>{activity.text}</p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#909090' // Greyscale-7
                  }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '16px', 
            padding: '24px',
            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '8px',
              color: '#3737F2' // Blue-5
            }}>
              Quick Actions
            </h3>
            <div style={{ 
              height: '2px', 
              width: '40px', 
              backgroundColor: '#3737F2', // Blue-5 
              marginBottom: '24px' 
            }}></div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              {quickActions.map((action, index) => (
                <button 
                  key={index} 
                  className="quick-action-button"
                  style={{ 
                    backgroundColor: index === 0 ? '#3737F2' : 'white', // Blue-5 for first action
                    color: index === 0 ? 'white' : '#4A4A4A', // Greyscale-4 for others 
                    border: index === 0 ? 'none' : '1px solid #DDDDDD', // Greyscale-9
                    padding: '16px', 
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: index === 0 ? '0 4px 6px rgba(55, 55, 242, 0.2)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedScoringLandingPage;