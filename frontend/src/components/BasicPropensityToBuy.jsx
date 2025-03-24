import React from 'react';

const BasicPropensityToBuy = () => {
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
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(151, 71, 255, 0.3)'
          }}>
            Start Your Journey
          </button>
        </div>
        
        {/* Feature Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px',
          marginTop: '40px'
        }}>
          {[
            {
              title: 'Foundation',
              subtitle: 'Rule-Based Scoring',
              color: '#FF4B4B'
            },
            {
              title: 'Optimization',
              subtitle: 'Statistical Model',
              color: '#3737F2'
            },
            {
              title: 'Intelligence',
              subtitle: 'Machine Learning',
              color: '#7834BB'
            }
          ].map((card, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(30, 38, 55, 0.7)',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative'
            }}>
              {/* Colored accent */}
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
              
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '8px'
              }}>{card.title}</h2>
              
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'normal',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '20px'
              }}>{card.subtitle}</h3>
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
        zIndex: -1,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 75, 75, 0.4) 0%, rgba(255, 75, 75, 0) 70%)',
          filter: 'blur(40px)',
          opacity: 0.5,
          top: '-100px',
          left: '-100px'
        }}></div>
        
        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(55, 55, 242, 0.4) 0%, rgba(55, 55, 242, 0) 70%)',
          filter: 'blur(40px)',
          opacity: 0.5,
          bottom: '-150px',
          right: '-100px'
        }}></div>
      </div>
    </div>
  );
};

export default BasicPropensityToBuy;