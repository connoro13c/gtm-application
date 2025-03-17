import React, { useState, useEffect, useRef } from 'react';

const GTMRelationshipGraph = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [draggedNode, setDraggedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  
  // Node definitions with descriptions, colors and connection mappings
  const nodeDefinitions = [
    { 
      id: 'node1',
      title: 'Account Scoring', 
      description: 'The foundation of GTM strategy, determining propensity to buy scores for accounts.',
      color: '#9747FF',
      connects: ['node3', 'node5']
    },
    { 
      id: 'node2',
      title: 'Account Segmentation', 
      description: 'Group accounts by characteristics to optimize targeting and resource allocation.',
      color: '#FF4B4B',
      connects: ['node5', 'node6']
    },
    { 
      id: 'node3',
      title: 'Marketing Alignment', 
      description: 'Align marketing efforts with sales strategy based on account scoring insights.',
      color: '#4B7BFF',
      connects: ['node2', 'node6']
    },
    { 
      id: 'node4',
      title: 'Territory Planning', 
      description: 'Design optimal territories using account scoring to balance opportunity.',
      color: '#00C48C',
      connects: ['node7', 'node8']
    },
    { 
      id: 'node5',
      title: 'Sales Execution', 
      description: 'Tactical implementation of account-based strategy guided by scoring insights.',
      color: '#9747FF',
      connects: []
    },
    { 
      id: 'node6',
      title: 'Pipeline Management', 
      description: 'Track and optimize sales pipeline based on account scoring predictions.',
      color: '#FF4B4B',
      connects: ['node8']
    },
    { 
      id: 'node7',
      title: 'Quota Setting', 
      description: 'Set realistic and balanced quotas informed by account scoring data.',
      color: '#4B7BFF',
      connects: ['node9']
    },
    { 
      id: 'node8',
      title: 'Revenue Forecasting', 
      description: 'Predict future revenue streams based on account propensity scores.',
      color: '#00C48C',
      connects: ['node7']
    },
    { 
      id: 'node9',
      title: 'Compensation Planning', 
      description: 'Develop compensation plans based on quota and territory assignments.',
      color: '#9747FF',
      connects: []
    }
  ];
  
  // Create refs for node elements
  const nodeRefs = useRef({});
  nodeDefinitions.forEach(node => {
    if (!nodeRefs.current[node.id]) {
      nodeRefs.current[node.id] = React.createRef();
    }
  });
  
  // Generate initial positions for each node
  useEffect(() => {
    const initialPositions = {};
    nodeDefinitions.forEach((node, index) => {
      // Create positions in a circle-like pattern
      const angleStep = (2 * Math.PI) / nodeDefinitions.length;
      const angle = index * angleStep;
      const radius = 200; // Radius of the circle
      
      initialPositions[node.id] = {
        x: 450 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        // Add oscillation variables
        phaseX: Math.random() * Math.PI * 2, // Random starting phase
        phaseY: Math.random() * Math.PI * 2,
        centerX: 450 + Math.cos(angle) * radius,
        centerY: 250 + Math.sin(angle) * radius,
        amplitudeX: 10 + Math.random() * 10, // Subtle horizontal movement
        amplitudeY: 15 + Math.random() * 15, // Slightly more vertical movement
        frequencyX: 0.3 + Math.random() * 0.2, // Varied frequencies for natural motion
        frequencyY: 0.2 + Math.random() * 0.2
      };
    });
    setNodePositions(initialPositions);
  }, []);
  
  // Oscillation animation logic
  // Simplified animation using setInterval for guaranteed movement
  useEffect(() => {
    // Skip initial render when positions aren't set yet
    if (Object.keys(nodePositions).length === 0) return;
    
    // Use a simple interval for visible animation
    const interval = setInterval(() => {
      const time = Date.now() / 1000; // Current time in seconds
      const updatedPositions = {...nodePositions};
      
      // Update positions for each node with very visible movement
      Object.keys(updatedPositions).forEach(nodeId => {
        // Skip animation for node being dragged
        if (draggedNode === nodeId) return;
        
        const pos = updatedPositions[nodeId];
        
        // Calculate new position using subtle sin/cos oscillation
        // Using different patterns for natural movement
        const primaryX = Math.sin(time * pos.frequencyX + pos.phaseX);
        const primaryY = Math.cos(time * pos.frequencyY + pos.phaseY);
        const secondaryX = Math.sin(time * pos.frequencyX * 1.3 + pos.phaseX) * 0.2;
        const secondaryY = Math.cos(time * pos.frequencyY * 1.7 + pos.phaseY) * 0.2;
        
        // Combine primary and secondary motion for natural bobbing
        pos.x = pos.centerX + (primaryX + secondaryX) * pos.amplitudeX;
        pos.y = pos.centerY + (primaryY + secondaryY) * pos.amplitudeY;
        
        // Keep nodes within bounds
        const bounds = {
          minX: 50, maxX: 850,
          minY: 50, maxY: 450
        };
        
        if (pos.x < bounds.minX) pos.x = bounds.minX;
        if (pos.x > bounds.maxX) pos.x = bounds.maxX;
        if (pos.y < bounds.minY) pos.y = bounds.minY;
        if (pos.y > bounds.maxY) pos.y = bounds.maxY;
      });
      
      setNodePositions(updatedPositions);
    }, 50); // Update every 50ms for smooth animation
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [draggedNode]);
  
  const handleNodeHover = (nodeId) => {
    if (!isDragging) {
      setActiveNode(nodeId);
    }
  };

  const handleNodeMouseDown = (e, nodeId) => {
    // Prevent default to avoid text selection during drag
    e.preventDefault();
    
    // Calculate offset between mouse position and node center
    const nodePos = nodePositions[nodeId];
    dragOffsetRef.current = {
      x: e.clientX - nodePos.x,
      y: e.clientY - nodePos.y
    };
    
    setDraggedNode(nodeId);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging && draggedNode) {
      e.preventDefault();
      
      const updatedPositions = {...nodePositions};
      const pos = updatedPositions[draggedNode];
      
      // Update the node's position based on mouse movement while preserving the offset
      pos.x = e.clientX - dragOffsetRef.current.x;
      pos.y = e.clientY - dragOffsetRef.current.y;
      
      // Also update the centerX and centerY to make this the new oscillation center
      pos.centerX = pos.x;
      pos.centerY = pos.y;
      
      // Apply bounds
      const bounds = {
        minX: 50, maxX: 850,
        minY: 50, maxY: 450
      };
      
      if (pos.x < bounds.minX) { pos.x = bounds.minX; pos.centerX = bounds.minX; }
      if (pos.x > bounds.maxX) { pos.x = bounds.maxX; pos.centerX = bounds.maxX; }
      if (pos.y < bounds.minY) { pos.y = bounds.minY; pos.centerY = bounds.minY; }
      if (pos.y > bounds.maxY) { pos.y = bounds.maxY; pos.centerY = bounds.maxY; }
      
      setNodePositions(updatedPositions);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedNode(null);
    }
  };
  
  // Add event listeners for mouse move and mouse up
  useEffect(() => {
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Clean up on unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, draggedNode]);
  
  const handleNodeClick = (nodeId) => {
    // Only handle click if we're not dragging
    if (!isDragging) {
      const node = nodeDefinitions.find(n => n.id === nodeId);
      alert(`Navigating to ${node.title} section`);
    }
  };

  return (
    <div className="data-visualization">
      <div className="relationship-web">
        <h2 className="web-title">GTM Strategy: Relationship of Major Components</h2>
        
        {/* Dynamic web visualization with SVG */}
        <div className="web-container">
          <svg className="connections-svg" width="900" height="500">
            {/* Connection lines that dynamically follow node positions */}
            {Object.keys(nodePositions).length > 0 && nodeDefinitions.map(node => (
              node.connects.map(targetId => {
                // Only draw if both nodes' positions are available
                if (nodePositions[node.id] && nodePositions[targetId]) {
                  const sourcePos = nodePositions[node.id];
                  const targetPos = nodePositions[targetId];
                  return (
                    <line 
                      key={`${node.id}-${targetId}`}
                      x1={sourcePos.x} 
                      y1={sourcePos.y}
                      x2={targetPos.x} 
                      y2={targetPos.y}
                      className={`connection-line ${activeNode === node.id || activeNode === targetId ? 'active' : ''}`}
                    />
                  );
                }
                return null;
              })
            ))}
            
            {/* Add additional connecting lines for completeness */}
            {Object.keys(nodePositions).length > 0 && (
              <>
                <line 
                  x1={nodePositions.node4?.x || 0} 
                  y1={nodePositions.node4?.y || 0}
                  x2={nodePositions.node7?.x || 0} 
                  y2={nodePositions.node7?.y || 0}
                  className="connection-line"
                />
                <line 
                  x1={nodePositions.node2?.x || 0} 
                  y1={nodePositions.node2?.y || 0}
                  x2={nodePositions.node5?.x || 0} 
                  y2={nodePositions.node5?.y || 0}
                  className="connection-line"
                />
                <line 
                  x1={nodePositions.node1?.x || 0} 
                  y1={nodePositions.node1?.y || 0}
                  x2={nodePositions.node2?.x || 0} 
                  y2={nodePositions.node2?.y || 0}
                  className="connection-line"
                />
              </>
            )}
          </svg>
          
          {/* Moving nodes */}
          {nodeDefinitions.map(node => (
            <div 
              key={node.id}
              ref={nodeRefs.current[node.id]}
              id={node.id}
              className={`web-node ${activeNode === node.id ? 'active' : ''}`}
              style={{
                backgroundColor: node.color,
                left: nodePositions[node.id]?.x || 0,
                top: nodePositions[node.id]?.y || 0,
                transform: `translate(-50%, -50%)`
              }}
              onClick={() => handleNodeClick(node.id)}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onMouseEnter={() => handleNodeHover(node.id)}
              onMouseLeave={() => !isDragging && setActiveNode(null)}
            ></div>
          ))}
        </div>
      
        {/* Legend */}
        <div className="relationship-legend">
          {nodeDefinitions.map(node => (
            <div 
              key={node.id} 
              className={`legend-item ${activeNode === node.id ? 'active' : ''}`}
              onClick={() => handleNodeClick(node.id)}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onMouseEnter={() => handleNodeHover(node.id)}
              onMouseLeave={() => !isDragging && setActiveNode(null)}
            >
              <div 
                className="legend-color" 
                style={{ backgroundColor: node.color }}
              ></div>
              <div className="legend-text">{node.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GTMRelationshipGraph;