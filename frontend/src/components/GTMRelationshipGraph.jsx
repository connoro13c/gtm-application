import React, { useState, useEffect, useRef } from 'react';

const GTMRelationshipGraph = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [draggedNode, setDraggedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [perspective] = useState(800); // 3D perspective value
  
  // Node definitions with descriptions, colors and connection mappings based on GTM Strategy image
  const nodeDefinitions = [
    { 
      id: 'node1',
      title: 'Account Scoring', 
      description: 'The foundation of GTM strategy, determining propensity to buy scores for accounts.',
      color: '#89CFF0', // Light blue - Scoring & Planning
      category: 'Scoring & Planning',
      connects: ['node5', 'node2', 'node7', 'node9'] // Sales Execution, Account Segmentation, Quota Setting, Compensation Planning
    },
    { 
      id: 'node2',
      title: 'Account Segmentation', 
      description: 'Group accounts by characteristics to optimize targeting and resource allocation.',
      color: '#89CFF0', // Light blue - Scoring & Planning
      category: 'Scoring & Planning',
      connects: ['node6'] // Pipeline Management
    },
    { 
      id: 'node3',
      title: 'Marketing Alignment', 
      description: 'Align marketing efforts with sales strategy based on account scoring insights.',
      color: '#FFD700', // Yellow - Strategy & Adjustments
      category: 'Strategy & Adjustments',
      connects: ['node1', 'node6'] // Account Scoring, Pipeline Management
    },
    { 
      id: 'node4',
      title: 'Territory Planning', 
      description: 'Design optimal territories using account scoring to balance opportunity.',
      color: '#89CFF0', // Light blue - Scoring & Planning
      category: 'Scoring & Planning',
      connects: ['node7', 'node8'] // Quota Setting, Revenue Forecasting
    },
    { 
      id: 'node5',
      title: 'Sales Execution', 
      description: 'Tactical implementation of account-based strategy guided by scoring insights.',
      color: '#90EE90', // Green - Execution & Operations
      category: 'Execution & Operations',
      connects: ['node2'] // Account Segmentation
    },
    { 
      id: 'node6',
      title: 'Pipeline Management', 
      description: 'Track and optimize sales pipeline based on account scoring predictions.',
      color: '#90EE90', // Green - Execution & Operations
      category: 'Execution & Operations',
      connects: ['node8'] // Revenue Forecasting
    },
    { 
      id: 'node7',
      title: 'Quota Setting', 
      description: 'Set realistic and balanced quotas informed by account scoring data.',
      color: '#F08080', // Pink/Red - Planning & Strategy
      category: 'Planning & Strategy',
      connects: [] 
    },
    { 
      id: 'node8',
      title: 'Revenue Forecasting', 
      description: 'Predict future revenue streams based on account propensity scores.',
      color: '#FFD700', // Yellow - Strategy & Adjustments
      category: 'Strategy & Adjustments',
      connects: []
    },
    { 
      id: 'node9',
      title: 'Compensation Planning', 
      description: 'Develop compensation plans based on quota and territory assignments.',
      color: '#F08080', // Pink/Red - Planning & Strategy
      category: 'Planning & Strategy',
      connects: []
    },
    { 
      id: 'node10',
      title: 'Customer Success & Retention', 
      description: 'Manage customer relationships to ensure satisfaction and reduce churn.',
      color: '#90EE90', // Green - Execution & Operations
      category: 'Execution & Operations',
      connects: ['node8'] // Revenue Forecasting
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
      // Create positions in a 3D spiral pattern
      const angleStep = (2 * Math.PI) / nodeDefinitions.length;
      const angle = index * angleStep;
      const radius = 200; // Radius of the circle
      const z = 50 - Math.random() * 100; // Random z position for 3D effect
      
      initialPositions[node.id] = {
        x: 450 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        z: z, // Add z coordinate for 3D effect
        vx: 0,  // velocity x component for Fruchterman-Reingold
        vy: 0,  // velocity y component for Fruchterman-Reingold
        vz: 0,  // velocity z component
        // Add oscillation variables
        phaseX: Math.random() * Math.PI * 2, // Random starting phase
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2, // Z-axis phase
        centerX: 450 + Math.cos(angle) * radius,
        centerY: 250 + Math.sin(angle) * radius,
        centerZ: z,
        amplitudeX: 5 + Math.random() * 5, // Reduced for stability with F-R forces
        amplitudeY: 5 + Math.random() * 5, // Reduced for stability with F-R forces
        amplitudeZ: 5 + Math.random() * 10, // Z-axis amplitude
        frequencyX: 0.15 + Math.random() * 0.1, // Varied frequencies for natural motion
        frequencyY: 0.1 + Math.random() * 0.05, // Varied frequencies for natural motion
        frequencyZ: 0.12 + Math.random() * 0.08 // Z-axis frequency
      };
    });
    setNodePositions(initialPositions);
  }, []);
  
  // Force-directed layout using Fruchterman-Reingold algorithm with oscillation
  useEffect(() => {
    // Skip initial render when positions aren't set yet
    if (Object.keys(nodePositions).length === 0) return;
    
    // Use requestAnimationFrame for smoother animations
    let animationFrameId;
    
    const updatePositions = () => {
      const time = Date.now() / 1000; // Current time in seconds
      const updatedPositions = {...nodePositions};
      
      // Fruchterman-Reingold parameters
      const k = 70; // Optimal distance between nodes (increased)
      const gravity = 0.03; // Gravity force to center (reduced)
      const damping = 0.9; // Velocity damping factor (increased)
      const temperature = 1.5; // Controls maximum node movement (increased)
      const centerX = 450; // Center of the graph X
      const centerY = 250; // Center of the graph Y
      
      // Calculate repulsive forces between all pairs of nodes
      for (let i = 0; i < nodeDefinitions.length; i++) {
        const nodeId1 = nodeDefinitions[i].id;
        // Don't skip dragged node to maintain connections properly
        
        const pos1 = updatedPositions[nodeId1];
        pos1.fx = 0; // Reset forces
        pos1.fy = 0;
        
        // Apply gravity toward center
        const gx = (centerX - pos1.x) * gravity;
        const gy = (centerY - pos1.y) * gravity;
        pos1.fx += gx;
        pos1.fy += gy;
        
        // Calculate repulsive forces from all other nodes
        for (let j = 0; j < nodeDefinitions.length; j++) {
          if (i === j) continue; // Skip self
          
          const nodeId2 = nodeDefinitions[j].id;
          const pos2 = updatedPositions[nodeId2];
          
          // Calculate distance and direction
          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1; // Avoid division by zero
          
          // Repulsive force (inversely proportional to distance)
          const repulsive = k * k / distance;
          const fx = dx / distance * repulsive;
          const fy = dy / distance * repulsive;
          pos1.fx += fx;
          pos1.fy += fy;
        }
      }
      
      // Calculate attractive forces along edges
      nodeDefinitions.forEach(node => {
        const nodeId1 = node.id;
        // Include dragged nodes in force calculations
        // This is essential for proper connection line movement
        
        const pos1 = updatedPositions[nodeId1];
        
        // Process connections defined in the node
        node.connects.forEach(nodeId2 => {
          const pos2 = updatedPositions[nodeId2];
          if (!pos2) return; // Only skip if position is missing
          
          // Calculate distance and direction
          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 0.1;
          
          // Attractive force (proportional to distance)
          const attractive = distance * distance / k;
          const fx = dx / distance * attractive;
          const fy = dy / distance * attractive;
          pos1.fx -= fx;
          pos1.fy -= fy;
        });
      });
      
      // No need for additional connections as they're all captured in the node definitions
      
      // No additional connections processing needed
      
      // Update positions based on forces
      Object.keys(updatedPositions).forEach(nodeId => {
        // Important: Allow physics for all nodes including dragged node
        // This is the key to maintaining connections during drag
        const isDragged = draggedNode === nodeId;
        
        const pos = updatedPositions[nodeId];
        
        // Update velocity based on forces
        pos.vx = (pos.vx + pos.fx) * damping;
        pos.vy = (pos.vy + pos.fy) * damping;
        pos.vz = (pos.vz + (Math.random() - 0.5) * 0.2) * damping; // Z movement with random force
        
        // Limit velocity (temperature)
        const velocity = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy + pos.vz * pos.vz);
        if (velocity > temperature) {
          pos.vx = pos.vx / velocity * temperature;
          pos.vy = pos.vy / velocity * temperature;
          pos.vz = pos.vz / velocity * temperature;
        }
        
        // Critical: Update positions for ALL nodes including dragged ones
        // For non-dragged nodes: apply physics movement
        // For dragged nodes: mouse position is already set in handleMouseMove
        // This ensures connecting lines follow nodes properly during drag
        if (!isDragged) {
          pos.centerX += pos.vx;
          pos.centerY += pos.vy;
          pos.centerZ += pos.vz;
        }
        
        // Constrain Z movement to prevent nodes from going too far
        if (Math.abs(pos.centerZ) > 100) {
          pos.centerZ = Math.sign(pos.centerZ) * 100;
          pos.vz *= -0.5; // Bounce
        }
        
        // Add 3D oscillation for organic feel (skip for dragged node)
        if (!isDragged) {
          const primaryX = Math.sin(time * pos.frequencyX + pos.phaseX);
          const primaryY = Math.cos(time * pos.frequencyY + pos.phaseY);
          const primaryZ = Math.sin(time * pos.frequencyZ + pos.phaseZ);
          pos.x = pos.centerX + primaryX * pos.amplitudeX;
          pos.y = pos.centerY + primaryY * pos.amplitudeY;
          pos.z = pos.centerZ + primaryZ * pos.amplitudeZ;
        }
        
        // For dragged nodes, carefully update the node position and all connections
        if (isDragged) {
          // For dragged nodes, we want to apply the mouse position directly
          // But still allow force calculations to affect connected nodes
          
          // Keep the current position (controlled by mouse) but allow
          // forces to be transmitted to connected nodes
          
          // This ensures mouse control while keeping connections intact
          pos.fx = 0; // Reset forces so they don't accumulate
          pos.fy = 0;
          
          // centerX/Y were already updated in handleMouseMove
          // Just ensure x,y match the centerX,y exactly for dragged nodes
          pos.x = pos.centerX;
          pos.y = pos.centerY;
        }
        
        // Keep nodes within bounds
        const bounds = {
          minX: 50, maxX: 850,
          minY: 50, maxY: 450
        };
        
        if (pos.x < bounds.minX) { pos.x = bounds.minX; pos.centerX = bounds.minX; pos.vx *= -0.5; }
        if (pos.x > bounds.maxX) { pos.x = bounds.maxX; pos.centerX = bounds.maxX; pos.vx *= -0.5; }
        if (pos.y < bounds.minY) { pos.y = bounds.minY; pos.centerY = bounds.minY; pos.vy *= -0.5; }
        if (pos.y > bounds.maxY) { pos.y = bounds.maxY; pos.centerY = bounds.maxY; pos.vy *= -0.5; }
      });
      
      setNodePositions(updatedPositions);
      
      // Request next animation frame
      animationFrameId = requestAnimationFrame(updatePositions);
    };
    
    // Start animation loop
    animationFrameId = requestAnimationFrame(updatePositions);
    
    // Clean up animation frame on unmount
    return () => cancelAnimationFrame(animationFrameId);
  }, [draggedNode, nodeDefinitions]);
  
  const handleNodeHover = (nodeId) => {
    if (!isDragging) {
      // Just highlight the node
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
      
      // Create a new object to trigger state update
      const updatedPositions = {...nodePositions};
      const pos = updatedPositions[draggedNode];
      
      // Update the node's position based on mouse movement while preserving the offset
      const newX = e.clientX - dragOffsetRef.current.x;
      const newY = e.clientY - dragOffsetRef.current.y;
      
      // Apply change immediately to both center and visual position
      // This is critical for connections to follow properly
      pos.x = newX;
      pos.y = newY;
      pos.centerX = newX;
      pos.centerY = newY;
      
      // Apply bounds
      const bounds = {
        minX: 50, maxX: 850,
        minY: 50, maxY: 450
      };
      
      if (pos.x < bounds.minX) { pos.x = bounds.minX; pos.centerX = bounds.minX; }
      if (pos.x > bounds.maxX) { pos.x = bounds.maxX; pos.centerX = bounds.maxX; }
      if (pos.y < bounds.minY) { pos.y = bounds.minY; pos.centerY = bounds.minY; }
      if (pos.y > bounds.maxY) { pos.y = bounds.maxY; pos.centerY = bounds.maxY; }
      
      // Reset velocity to avoid node flying off
      // Important for preventing momentum after releasing
      pos.vx = 0;
      pos.vy = 0;
      pos.vz = 0;
      
      // Update state to trigger re-render and connection updates
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
      // Just highlight the node
      setActiveNode(nodeId);
    }
  };

  return (
    <div className="data-visualization">
      <div className="relationship-web">
        <h2 className="web-title">GTM Strategy: Explicit Directional Flow with Arrows</h2>
        
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
                    <g key={`${node.id}-${targetId}`}>
                      <defs>
                        <marker 
                          id={`arrowhead-${node.id}-${targetId}`} 
                          markerWidth="10" 
                          markerHeight="7" 
                          refX="9" 
                          refY="3.5" 
                          orient="auto">
                          <polygon 
                            points="0 0, 10 3.5, 0 7" 
                            fill="rgba(50,50,50,0.8)" 
                          />
                        </marker>
                      </defs>
                      <line 
                        x1={sourcePos.x} 
                        y1={sourcePos.y}
                        x2={targetPos.x} 
                        y2={targetPos.y}
                        className={`connection-line ${activeNode === node.id || activeNode === targetId ? 'active' : ''}`}
                        style={{
                          strokeOpacity: 0.8,
                          strokeWidth: 2,
                          stroke: 'rgba(50,50,50,0.7)',
                          markerEnd: `url(#arrowhead-${node.id}-${targetId})`
                        }}
                      />
                    </g>
                  );
                }
                return null;
              })
            ))}
            
            {/* All connections are handled from node definitions */}
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
                transform: `translate(-50%, -50%) perspective(${perspective}px) translateZ(${nodePositions[node.id]?.z || 0}px)`,
                boxShadow: `0 ${5 + Math.abs(nodePositions[node.id]?.z || 0) / 10}px ${10 + Math.abs(nodePositions[node.id]?.z || 0) / 5}px rgba(0,0,0,0.2)`,
                zIndex: Math.round(50 + (nodePositions[node.id]?.z || 0)),
                scale: `${1 + (nodePositions[node.id]?.z || 0) / 200}`
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
          <div className="legend-categories">
            <div className="legend-category">
              <div className="legend-color" style={{ backgroundColor: '#89CFF0' }}></div>
              <div className="legend-text">Scoring & Planning</div>
            </div>
            <div className="legend-category">
              <div className="legend-color" style={{ backgroundColor: '#F08080' }}></div>
              <div className="legend-text">Planning & Strategy</div>
            </div>
            <div className="legend-category">
              <div className="legend-color" style={{ backgroundColor: '#90EE90' }}></div>
              <div className="legend-text">Execution & Operations</div>
            </div>
            <div className="legend-category">
              <div className="legend-color" style={{ backgroundColor: '#FFD700' }}></div>
              <div className="legend-text">Strategy & Adjustments</div>
            </div>
          </div>
          <div className="legend-nodes">
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
    </div>
  );
};

export default GTMRelationshipGraph;