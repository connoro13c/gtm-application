import React from 'react';

const SimpleScoringLandingPage = () => {
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
            Account Scoring
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
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          {[
            {
              title: 'Foundation',
              subtitle: 'Rule-Based Scoring',
              color: '#FF4B4B',
              gradient: 'linear-gradient(135deg, #FF4B4B 0%, #FF8F70 100%)'
            },
            {
              title: 'Optimization',
              subtitle: 'Statistical Model',
              color: '#4B7BFF',
              gradient: 'linear-gradient(135deg, #4B7BFF 0%, #38CFFF 100%)'
            },
            {
              title: 'Intelligence',
              subtitle: 'Machine Learning',
              color: '#9747FF',
              gradient: 'linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)'
            },
            {
              title: 'Automation',
              subtitle: 'Real-Time AI',
              color: '#00C48C',
              gradient: 'linear-gradient(135deg, #00C48C 0%, #38EFC3 100%)'
            }
          ].map((phase, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(30, 38, 55, 0.7)',
              borderRadius: '24px',
              padding: '30px',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: phase.gradient
              }}></div>
              
              <h2 style={{
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: '8px',
                color: 'white'
              }}>{phase.title}</h2>
              
              <h3 style={{
                fontSize: '18px',
                fontWeight: 500,
                opacity: 0.9,
                color: 'white',
                marginBottom: '20px'
              }}>{phase.subtitle}</h3>
              
              <p style={{
                fontSize: '16px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '24px'
              }}>
                {index === 0 ? 'Establish a baseline with simple, heuristic-based scoring.' : 
                 index === 1 ? 'Move from rules to data-driven scoring using historical patterns.' :
                 index === 2 ? 'Implement advanced machine learning for deeper pattern recognition.' :
                 'Deploy real-time scoring with automated optimization.'}
              </p>
              
              <button style={{
                padding: '12px 28px',
                borderRadius: '12px',
                background: index === 0 ? phase.gradient : 'transparent',
                border: index === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                {index === 0 ? 'Begin Phase' : 'Learn More'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
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
          background: 'radial-gradient(circle, rgba(255, 75, 75, 0.6) 0%, rgba(255, 75, 75, 0) 70%)',
          filter: 'blur(15px)',
          opacity: 0.3,
          top: '-100px',
          left: '-100px'
        }}></div>
        
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(75, 123, 255, 0.6) 0%, rgba(75, 123, 255, 0) 70%)',
          filter: 'blur(15px)',
          opacity: 0.3,
          bottom: '-150px',
          right: '-100px'
        }}></div>
        
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(151, 71, 255, 0.6) 0%, rgba(151, 71, 255, 0) 70%)',
          filter: 'blur(15px)',
          opacity: 0.3,
          top: '60%',
          left: '15%'
        }}></div>
      </div>
    </div>
  );
};

export default SimpleScoringLandingPage;