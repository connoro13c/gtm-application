import React from 'react';

const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      backgroundColor: 'red', 
      color: 'white',
      border: '5px solid black',
      borderRadius: '10px',
      fontSize: '24px',
      textAlign: 'center'
    }}>
      <h1>Test Component</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

export default TestComponent;
