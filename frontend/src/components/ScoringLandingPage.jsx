import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Home from './Home';

const ScoringLandingPage = () => {
  const [showPulse, setShowPulse] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [isPersistent, setIsPersistent] = useState(false);
  
  // Create pulse effect on page load
  useEffect(() => {
    setShowPulse(true);
    const timer = setTimeout(() => setShowPulse(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  // Dynamic background elements
  const DynamicBackground = () => {
    return (
      <div className="dynamic-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="grid-overlay"></div>
      </div>
    );
  };

  // Node definitions and mappings
  const categoryMapping = {
    'Scoring & Planning': ['node1', 'node2', 'node4'], // Account Scoring, Account Segmentation, Territory Planning
    'Planning & Strategy': ['node7', 'node9'], // Quota Setting, Compensation Planning
    'Execution & Operations': ['node5', 'node6', 'node10'], // Sales Execution, Pipeline Management, Customer Success
    'Strategy & Adjustments': ['node3', 'node8'] // Marketing Alignment, Revenue Forecasting
  };
  
  const categoryColors = {
    'Scoring & Planning': '#89CFF0',
    'Planning & Strategy': '#F08080',
    'Execution & Operations': '#90EE90',
    'Strategy & Adjustments': '#FFD700'
  };
  
  const categoryDescriptions = {
    'Scoring & Planning': '🔵 Identifying & Prioritizing Accounts — This section ensures that the right accounts are identified, scored, and assigned to the appropriate segments and territories.',
    'Planning & Strategy': '🔴 Defining Sales Goals & Incentives — This section aligns territory coverage, quotas, and sales incentives to ensure GTM efforts drive revenue growth.',
    'Execution & Operations': '🟢 Day-to-Day Sales Motion & Deal Management — This section ensures that the sales team is executing against targets efficiently, with proper deal tracking and customer retention efforts.',
    'Strategy & Adjustments': '🟡 Refining & Aligning GTM Strategy — This section ensures that GTM motions are data-driven, optimized, and continuously improving.'
  };

  const nodeDescriptions = {
    'node1': {
      title: 'Account Scoring',
      category: 'Scoring & Planning',
      description: 'Scores accounts based on firmographics, intent signals, product usage, and engagement.',
      purpose: 'Foundation of GTM strategy, determining propensity to buy scores for accounts.',
      flow: 'A high propensity-to-buy (PTB) score influences how accounts are grouped (e.g., Enterprise vs. SMB).',
      connections: ['Account Segmentation', 'Marketing Alignment'],
      keyPoints: [
        'Consolidates firmographic, behavioral, and intent signals',
        'Creates a unified account PTB score for prioritization',
        'Enables data-driven targeting decisions across sales and marketing'
      ]
    },
    'node2': {
      title: 'Account Segmentation',
      category: 'Scoring & Planning',
      description: 'Group accounts by characteristics to optimize targeting and resource allocation.',
      purpose: 'After scoring, accounts are grouped to ensure optimal messaging and targeting.',
      flow: 'Segmentation feeds into territory definitions, ensuring accounts are assigned based on ICP fit and opportunity size.',
      connections: ['Territory Planning', 'Sales Execution'],
      keyPoints: [
        'Creates focused audience segments based on scoring',
        'Aligns messaging with specific customer needs by segment',
        'Enables more efficient resource allocation across segments'
      ]
    },
    'node3': {
      title: 'Marketing Alignment',
      category: 'Strategy & Adjustments',
      description: 'Ensures marketing insights influence sales prioritization.',
      purpose: 'Aligns marketing efforts with sales strategy based on account scoring insights.',
      flow: 'High engagement from marketing campaigns increases an account\'s PTB score, making them a sales priority.',
      connections: ['Account Scoring', 'Pipeline Management'],
      keyPoints: [
        'Coordinates marketing campaigns with sales priorities',
        'Focuses ABM efforts on high-value account segments',
        'Provides intent signals that feed back into scoring models'
      ]
    },
    'node4': {
      title: 'Territory Planning',
      category: 'Scoring & Planning',
      description: 'Design optimal territories using account scoring to balance opportunity.',
      purpose: 'Defines sales rep workload and territory assignments based on scored accounts.',
      flow: 'Segmentation feeds into territory definitions, ensuring accounts are assigned based on ICP fit and opportunity size.',
      connections: ['Quota Setting', 'Revenue Forecasting'],
      keyPoints: [
        'Creates balanced territories using account scoring',
        'Assigns accounts to reps based on segment, geography, and potential',
        'Optimizes coverage to maximize conversion of high-scoring accounts'
      ]
    },
    'node5': {
      title: 'Sales Execution',
      category: 'Execution & Operations',
      description: 'Tactical implementation of account-based strategy guided by scoring insights.',
      purpose: 'Execution of sales strategies shaped by compensation and account scoring.',
      flow: 'Sales execution is shaped by incentive structures—for example, if expansion is prioritized, AEs will focus more on existing customer engagement.',
      connections: ['Pipeline Management', 'Account Segmentation'],
      keyPoints: [
        'Prioritizes outreach based on account scoring',
        'Implements segment-specific selling approaches',
        'Aligns sales plays with compensation incentives'
      ]
    },
    'node6': {
      title: 'Pipeline Management',
      category: 'Execution & Operations',
      description: 'Tracks deal progress, sales velocity, and pipeline health to ensure reps are focused on the right opportunities.',
      purpose: 'Ensures tracking of deals from marketing through to close.',
      flow: 'Sales activities feed into CRM & forecasting tools, providing visibility into deals at different stages.',
      connections: ['Revenue Forecasting', 'Marketing Alignment'],
      keyPoints: [
        'Tracks conversion rates by segment and scoring tier',
        'Identifies bottlenecks in the sales process',
        'Connects marketing-sourced opportunities with sales outcomes'
      ]
    },
    'node7': {
      title: 'Quota Setting',
      category: 'Planning & Strategy',
      description: 'Set realistic and balanced quotas informed by account scoring data.',
      purpose: 'Defines sales rep revenue expectations based on assigned accounts and territories.',
      flow: 'Once territories are assigned, quota expectations are calculated based on past conversion rates, average deal size, and pipeline coverage.',
      connections: ['Compensation Planning', 'Territory Planning'],
      keyPoints: [
        'Sets targets based on territory potential from account scoring',
        'Balances quotas across teams using objective data',
        'Adjusts expectations based on segment performance'
      ]
    },
    'node8': {
      title: 'Revenue Forecasting',
      category: 'Strategy & Adjustments',
      description: 'Predicts future revenue based on pipeline size, conversion rates, and deal movement.',
      purpose: 'Provides visibility into expected revenue for planning and adjustments.',
      flow: 'Data from the pipeline is aggregated into forecasting models, allowing leadership to anticipate bookings and revenue.',
      connections: ['Pipeline Management', 'Customer Success'],
      keyPoints: [
        'Incorporates scoring data to improve forecast accuracy',
        'Segments projections by territory, product, and customer type',
        'Enables data-driven strategy adjustments'
      ]
    },
    'node9': {
      title: 'Compensation Planning',
      category: 'Planning & Strategy',
      description: 'Aligns sales incentives with revenue goals, ensuring reps are compensated fairly for achieving targets.',
      purpose: 'Motivates sales behaviors that align with GTM strategy.',
      flow: 'Quota attainment directly influences commission structures, accelerators, and bonuses.',
      connections: ['Quota Setting', 'Sales Execution'],
      keyPoints: [
        'Designs incentives that reinforce strategic priorities',
        'Rewards focus on high-scoring, high-value accounts',
        'Creates balanced incentives across customer acquisition and retention'
      ]
    },
    'node10': {
      title: 'Customer Success & Retention',
      category: 'Execution & Operations',
      description: 'Ensures renewals and expansions are incorporated into overall GTM strategy.',
      purpose: 'Maintains and grows revenue from existing customers.',
      flow: 'Expansion revenue from existing accounts is a critical input into revenue projections.',
      connections: ['Revenue Forecasting', 'Account Scoring'],
      keyPoints: [
        'Prioritizes customer retention efforts based on account value',
        'Feeds usage and engagement data back into scoring models',
        'Identifies expansion opportunities in existing accounts'
      ]
    }
  };
  
  // Handle category selection with persistence
  // This function is unused - all buttons now use direct DOM manipulation
  const handleCategoryHover = (category) => {
    console.log('Hovering over category:', category);
    // IMPORTANT: THIS FUNCTION IS NO LONGER USED BY ANY BUTTON
    // Instead, each button has its own direct manipulation logic
  };  
  
  // Handle mouse leaving category buttons
  // This function is unused - all buttons now use direct DOM manipulation
  const handleCategoryLeave = () => {
    // IMPORTANT: THIS FUNCTION IS NO LONGER USED BY ANY BUTTON
    // Instead, each button has its own direct manipulation logic
  };
  
  const handleCategoryClick = (category) => {
    console.log('Clicked on category:', category);
    // Toggle behavior - if already active, deactivate
    if (activeCategory === category && isPersistent) {
      setActiveCategory(null);
      setIsPersistent(false);
    } else {
      setActiveCategory(category);
      setIsPersistent(true);
      
      // Extra handling for Execution & Operations
      if (category === 'Execution & Operations') {
        // Use a timeout to ensure the DOM has updated
        setTimeout(() => {
          console.log('Forcing highlight for Execution nodes on click');
          document.querySelectorAll('#node5, #node6, #node10').forEach(node => {
            if (node) {
              node.style.transform = 'translate(-50%, -50%) scale(1.5)';
              node.style.boxShadow = '0 0 15px white, 0 0 30px #90EE90';
              node.style.zIndex = '100';
              node.style.backgroundColor = '#90EE90';
            }
          });
        }, 50);
      }
    }
  };
  
  // Handle node interactions
  const handleNodeHover = (nodeId) => {
    setActiveNode(nodeId);
  };
  
  const handleBackgroundClick = (e) => {
    // Only reset if clicking directly on the background (not on nodes or other elements)
    if (e.target.classList.contains('main-content') || e.target.classList.contains('visualization-container')) {
      console.log('Background clicked, resetting state');
      setIsPersistent(false);
      setActiveCategory(null);
      setActiveNode(null);
      
      // Reset all nodes
      document.querySelectorAll('.web-node').forEach(node => {
        node.style.transform = 'translate(-50%, -50%)';
        node.style.boxShadow = '';
        node.style.zIndex = '10';
      });
    }
  };
  
  // Effect to synchronize DOM with our state
  useEffect(() => {
    // First, let's log what we're working with for debugging
    console.log('Active Category:', activeCategory);
    console.log('Web nodes on page:', document.querySelectorAll('.web-node').length);
    
    // Try to find and manipulate nodes directly when state changes
    const highlightActiveCategory = () => {
      // Reset all nodes first
      document.querySelectorAll('.web-node').forEach(node => {
        console.log('Found node:', node.id);
        node.style.transform = 'translate(-50%, -50%)';
        node.style.boxShadow = '';
        node.style.zIndex = '10';
        // Reset background color to its original
        if (node.id === 'node1' || node.id === 'node2' || node.id === 'node4') {
          node.style.backgroundColor = '#89CFF0'; // Light blue
        } else if (node.id === 'node7' || node.id === 'node9') {
          node.style.backgroundColor = '#F08080'; // Red/Pink
        } else if (node.id === 'node5' || node.id === 'node6' || node.id === 'node10') {
          node.style.backgroundColor = '#90EE90'; // Green
        } else if (node.id === 'node3' || node.id === 'node8') {
          node.style.backgroundColor = '#FFD700'; // Yellow
        }
      });
      
      // Apply highlighting based on active category
      if (activeCategory) {
        console.log('Applying category highlight for:', activeCategory);
        const categoryColor = categoryColors[activeCategory];
        const nodesToHighlight = categoryMapping[activeCategory] || [];
        console.log('Nodes to highlight:', nodesToHighlight);
        
        // Direct selection by IDs for more reliability
        if (activeCategory === 'Scoring & Planning') {
          highlightNodesByIds(['node1', 'node2', 'node4'], categoryColor);
        } else if (activeCategory === 'Planning & Strategy') {
          highlightNodesByIds(['node7', 'node9'], categoryColor);
        } else if (activeCategory === 'Execution & Operations') {
          // Add extra logging for Execution & Operations
          console.log('Highlighting Execution & Operations nodes');
          console.log('Looking for nodes: node5, node6, node10');
          document.querySelectorAll('.web-node').forEach(node => {
            console.log('Found node:', node.id);
          });
          
          // Try three different ways to find these nodes
          const node5 = document.getElementById('node5');
          const node6 = document.getElementById('node6');
          const node10 = document.getElementById('node10');
          console.log('Direct getElementById:', { node5, node6, node10 });
          
          // Force highlight these specific nodes by selector
          document.querySelectorAll('#node5, #node6, #node10').forEach(node => {
            console.log('Force highlighting node:', node.id);
            node.style.transform = 'translate(-50%, -50%) scale(1.5)';
            node.style.boxShadow = `0 0 15px white, 0 0 30px ${categoryColor}`;
            node.style.zIndex = '100';
            node.style.backgroundColor = categoryColor;
          });
          
          // Also try the regular method
          highlightNodesByIds(['node5', 'node6', 'node10'], categoryColor);
        } else if (activeCategory === 'Strategy & Adjustments') {
          highlightNodesByIds(['node3', 'node8'], categoryColor);
        }
      }
      
      // Extra highlighting for active node
      if (activeNode) {
        const node = document.getElementById(activeNode);
        if (node) {
          node.style.transform = 'translate(-50%, -50%) scale(1.8)';
          node.style.boxShadow = '0 0 20px white, 0 0 40px white';
          node.style.zIndex = '200';
        }
      }
    };
    
    // Helper function to highlight nodes by IDs
    const highlightNodesByIds = (nodeIds, color) => {
      nodeIds.forEach(id => {
        const nodeElement = document.getElementById(id);
        console.log(`Looking for node ${id}:`, nodeElement ? 'found' : 'not found');
        
        if (nodeElement) {
          console.log('Highlighting node:', id);
          nodeElement.style.transform = 'translate(-50%, -50%) scale(1.5)';
          nodeElement.style.boxShadow = `0 0 15px white, 0 0 30px ${color}`;
          nodeElement.style.zIndex = '100';
          nodeElement.style.backgroundColor = color;
        } else {
          // Alternative method for finding nodes if getElementById fails
          const alternativeSelector = `.web-node[id="${id}"]`;
          const altNodes = document.querySelectorAll(alternativeSelector);
          console.log(`Alternative search for ${id} found ${altNodes.length} nodes`);
          
          altNodes.forEach(node => {
            console.log('Highlighting alternative node:', id);
            node.style.transform = 'translate(-50%, -50%) scale(1.5)';
            node.style.boxShadow = `0 0 15px white, 0 0 30px ${color}`;
            node.style.zIndex = '100';
            node.style.backgroundColor = color;
          });
        }
      });
    };
    
    // Run highlighting
    highlightActiveCategory();
    
    // Also attach click handlers to nodes
    document.querySelectorAll('.web-node').forEach(node => {
      node.addEventListener('mouseenter', () => handleNodeHover(node.id));
      node.addEventListener('click', () => setActiveNode(node.id));
    });
    
    return () => {
      // Clean up event listeners
      document.querySelectorAll('.web-node').forEach(node => {
        node.removeEventListener('mouseenter', () => handleNodeHover(node.id));
        node.removeEventListener('click', () => setActiveNode(node.id));
      });
    };
  }, [activeCategory, activeNode, isPersistent]);

  return (
    <div className="scoring-landing-page">
      <DynamicBackground />
      {showPulse && <div className="initial-pulse" />}
      
      <div className="page-content">
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="title-container"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h1 className="hero-title" style={{color: 'orange'}}>
              <span>The GTM App</span>
            </h1>
            <p className="hero-subtitle">Transform your GTM with intelligent execution</p>
          </motion.div>
        </motion.div>
        
        {/* Navigation buttons for GTM Strategy categories */}
        {/* Adding a style block for button hover effects */}
        <style>
          {`
          /* Base styles for Firefox compatibility */
          svg.connections-svg {
            overflow: visible;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
          
          .web-node {
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            z-index: 10;
            box-sizing: border-box;
          }

          .btn-primary:hover {
            background-color: #D93B2D; /* 10% darker than Vermillion-7 */
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(243, 78, 63, 0.2);
          }
          .btn-secondary:hover {
            background-color: #2C2CD1; /* 10% darker than Blue-5 */
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(55, 55, 242, 0.2);
          }
          .btn-outline:hover {
            background-color: rgba(120, 52, 187, 0.05);
            border-color: #7834BB;
            color: #7834BB;
          }
          
          /* Firefox-specific fixes */
          @-moz-document url-prefix() {
            .web-container {
              position: relative;
              width: 100%;
              height: 500px;
              overflow: visible;
            }
          }
          `}
        </style>
        <style>
          {`
            .category-btn {
              outline: none !important;
              position: relative !important;
              z-index: 100 !important;
              user-select: none !important;
            }
            .category-btn:hover {
              transform: scale(1.05) !important;
              box-shadow: 0 0 15px rgba(255,255,255,0.5) !important;
            }
            .gtm-navigation {
              position: relative !important;
              z-index: 100 !important;
              width: 100% !important;
              pointer-events: auto !important;
            }
            .content-container {
              display: flex;
              gap: 30px;
              height: 100%;
            }
            @media (max-width: 1024px) {
              .content-container {
                flex-direction: column;
                gap: 20px;
              }
              .node-details-panel {
                max-width: 100% !important;
                width: auto !important;
                min-width: auto !important;
              }
              /* Firefox-specific fixes */
              @-moz-document url-prefix() {
                .web-node {
                  position: absolute !important;
                  transform: translate(-50%, -50%) !important;
                }
                .web-container, .connections-svg {
                  width: 100% !important;
                  height: 100% !important;
                }
              }
            }
          `}
        </style>
        <motion.div 
          className="gtm-navigation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            margin: '20px 0 40px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 50  // Ensure buttons are above other elements
          }}
        >
          <button 
            style={{
              backgroundColor: activeCategory === 'Scoring & Planning' ? '#89CFF0' : 'rgba(137, 207, 240, 0.7)',
              border: 'none',
              borderRadius: '8px',
              padding: '16px 28px', /* Increased padding for larger hit area */
              color: '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: activeCategory === 'Scoring & Planning' ? '0 0 15px #89CFF0' : '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              transform: activeCategory === 'Scoring & Planning' ? 'scale(1.05)' : 'scale(1)',
              position: 'relative', /* Ensure the button has proper positioning */
              zIndex: 55, /* High z-index to prevent hover issues */
              pointerEvents: 'auto', /* Explicitly enable pointer events */
              margin: '5px' /* Add margin to prevent buttons from being too close */
            }}
            onClick={() => {
              handleCategoryClick('Scoring & Planning');
              // Navigate to enhanced scoring page
              window.location.href = '/enhanced-combined';
            }}
            onMouseEnter={() => {
              console.log('Force highlighting Scoring & Planning nodes');
              console.log('Looking for nodes: node1, node2, node4');
              
              // Always set this category as active and persistent
              setActiveNode(null);
              setActiveCategory('Scoring & Planning');
              setIsPersistent(true);
              
              // Reset all nodes first
              document.querySelectorAll('.web-node').forEach(node => {
                console.log('Resetting node:', node.id);
                node.style.transform = 'translate(-50%, -50%)';
                node.style.boxShadow = '';
                node.style.zIndex = '10';
              });
              
              // Force highlight on all Scoring & Planning nodes
              document.querySelectorAll('#node1, #node2, #node4').forEach(node => {
                console.log('Highlighting node:', node.id);
                node.style.transform = 'translate(-50%, -50%) scale(1.5)';
                node.style.boxShadow = '0 0 15px white, 0 0 30px #89CFF0';
                node.style.zIndex = '100';
                node.style.backgroundColor = '#89CFF0';
              });
            }}
            onMouseLeave={() => {
              // Do nothing on mouse leave to maintain persistence
              // The state will only change when another category is hovered
            }}
            className="scoring-planning-btn category-btn btn-primary"
          >
            Scoring & Planning
          </button>
          <button 
            style={{
              backgroundColor: activeCategory === 'Planning & Strategy' ? '#F08080' : 'rgba(240, 128, 128, 0.7)',
              border: 'none',
              borderRadius: '8px',
              padding: '16px 28px', /* Increased padding for larger hit area */
              color: '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: activeCategory === 'Planning & Strategy' ? '0 0 15px #F08080' : '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              transform: activeCategory === 'Planning & Strategy' ? 'scale(1.05)' : 'scale(1)',
              position: 'relative', /* Ensure the button has proper positioning */
              zIndex: 55, /* High z-index to prevent hover issues */
              pointerEvents: 'auto', /* Explicitly enable pointer events */
              margin: '5px' /* Add margin to prevent buttons from being too close */
            }}
            onClick={() => handleCategoryClick('Planning & Strategy')}
            onMouseEnter={() => {
              console.log('Force highlighting Planning & Strategy nodes');
              console.log('Looking for nodes: node7, node9');

              // Always set this category as active and persistent
              setActiveNode(null);
              setActiveCategory('Planning & Strategy');
              setIsPersistent(true);
              
              // Reset all nodes first
              document.querySelectorAll('.web-node').forEach(node => {
                console.log('Resetting node:', node.id);
                node.style.transform = 'translate(-50%, -50%)';
                node.style.boxShadow = '';
                node.style.zIndex = '10';
              });
              
              // Force highlight on all Planning & Strategy nodes
              document.querySelectorAll('#node7, #node9').forEach(node => {
                console.log('Highlighting node:', node.id);
                node.style.transform = 'translate(-50%, -50%) scale(1.5)';
                node.style.boxShadow = '0 0 15px white, 0 0 30px #F08080';
                node.style.zIndex = '100';
                node.style.backgroundColor = '#F08080';
              });
            }}
            onMouseLeave={() => {
              // Do nothing on mouse leave to maintain persistence
              // The state will only change when another category is hovered
            }}
            className="planning-strategy-btn category-btn btn-secondary"
          >
            Planning & Strategy
          </button>
          <button 
            style={{
              backgroundColor: activeCategory === 'Execution & Operations' ? '#90EE90' : 'rgba(144, 238, 144, 0.7)',
              border: 'none',
              borderRadius: '8px',
              padding: '16px 28px', /* Increased padding for larger hit area */
              color: '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: activeCategory === 'Execution & Operations' ? '0 0 15px #90EE90' : '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              transform: activeCategory === 'Execution & Operations' ? 'scale(1.05)' : 'scale(1)',
              position: 'relative', /* Ensure the button has proper positioning */
              zIndex: 55, /* High z-index to prevent hover issues */
              pointerEvents: 'auto', /* Explicitly enable pointer events */
              margin: '5px' /* Add margin to prevent buttons from being too close */
            }}
            onClick={() => handleCategoryClick('Execution & Operations')}
            onMouseEnter={() => {
              console.log('Force highlighting Execution & Operations nodes');
              console.log('Looking for nodes: node5, node6, node10');

              // Always set this category as active and persistent
              setActiveNode(null);
              setActiveCategory('Execution & Operations');
              setIsPersistent(true);
              
              // Reset all nodes first
              document.querySelectorAll('.web-node').forEach(node => {
                console.log('Resetting node:', node.id);
                node.style.transform = 'translate(-50%, -50%)';
                node.style.boxShadow = '';
                node.style.zIndex = '10';
              });
              
              // Force highlight on all Execution & Operations nodes
              document.querySelectorAll('#node5, #node6, #node10').forEach(node => {
                console.log('Highlighting node:', node.id);
                node.style.transform = 'translate(-50%, -50%) scale(1.5)';
                node.style.boxShadow = '0 0 15px white, 0 0 30px #90EE90';
                node.style.zIndex = '100';
                node.style.backgroundColor = '#90EE90';
              });
            }}
            onMouseLeave={() => {
              // Do nothing on mouse leave to maintain persistence
              // The state will only change when another category is hovered
            }}
            className="execution-operations-btn category-btn btn-outline"
          >
            Execution & Operations
          </button>
          <button 
            style={{
              backgroundColor: activeCategory === 'Strategy & Adjustments' ? '#FFD700' : 'rgba(255, 215, 0, 0.7)',
              border: 'none',
              borderRadius: '8px',
              padding: '16px 28px', /* Increased padding for larger hit area */
              color: '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: activeCategory === 'Strategy & Adjustments' ? '0 0 15px #FFD700' : '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              transform: activeCategory === 'Strategy & Adjustments' ? 'scale(1.05)' : 'scale(1)',
              position: 'relative', /* Ensure the button has proper positioning */
              zIndex: 55, /* High z-index to prevent hover issues */
              pointerEvents: 'auto', /* Explicitly enable pointer events */
              margin: '5px' /* Add margin to prevent buttons from being too close */
            }}
            onClick={() => handleCategoryClick('Strategy & Adjustments')}
            onMouseEnter={() => {
              console.log('Force highlighting Strategy & Adjustments nodes');
              console.log('Looking for nodes: node3, node8');

              // Always set this category as active and persistent
              setActiveNode(null);
              setActiveCategory('Strategy & Adjustments');
              setIsPersistent(true);
              
              // Reset all nodes first
              document.querySelectorAll('.web-node').forEach(node => {
                console.log('Resetting node:', node.id);
                node.style.transform = 'translate(-50%, -50%)';
                node.style.boxShadow = '';
                node.style.zIndex = '10';
              });
              
              // Force highlight on all Strategy & Adjustments nodes
              document.querySelectorAll('#node3, #node8').forEach(node => {
                console.log('Highlighting node:', node.id);
                node.style.transform = 'translate(-50%, -50%) scale(1.5)';
                node.style.boxShadow = '0 0 15px white, 0 0 30px #FFD700';
                node.style.zIndex = '100';
                node.style.backgroundColor = '#FFD700';
              });
            }}
            onMouseLeave={() => {
              // Do nothing on mouse leave to maintain persistence
              // The state will only change when another category is hovered
            }}
            className="strategy-adjustments-btn category-btn btn-primary"
          >
            Strategy & Adjustments
          </button>
        </motion.div>
        
        <div className="main-content" onClick={handleBackgroundClick}>
          <div className="content-container" style={{ position: 'relative', zIndex: 40, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
            <div className="visualization-container" style={{ flex: '1.5', minWidth: '0', minHeight: '750px', overflow: 'visible' }}>
              <Home activeCategory={activeCategory} activeNode={activeNode} />
            </div>
            
            {(activeNode || activeCategory) && (
              <motion.div 
                className="node-details-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  flex: '1', 
                  width: '400px',
                  minWidth: '400px',
                  backgroundColor: 'rgba(30, 38, 55, 0.9)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'auto',
                  maxHeight: '600px',
                  position: 'sticky',
                  top: '20px'
                }}
              >
                {activeNode && (
                  <>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#FFF' }}>
                      {nodeDescriptions[activeNode]?.title || 'Node Details'}
                    </h2>
                    
                    <div style={{ display: 'inline-block', marginBottom: '16px', padding: '4px 10px', borderRadius: '4px', backgroundColor: categoryColors[nodeDescriptions[activeNode]?.category || ''], color: '#333', fontWeight: 'bold', fontSize: '14px' }}>
                      {nodeDescriptions[activeNode]?.category || ''}
                    </div>
                    
                    <div style={{ borderLeft: '3px solid ' + categoryColors[nodeDescriptions[activeNode]?.category || ''], paddingLeft: '15px', margin: '15px 0' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#FFF' }}>Purpose</h3>
                      <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {nodeDescriptions[activeNode]?.purpose || 'No purpose available.'}
                      </p>
                    </div>
                    
                    <div style={{ borderLeft: '3px solid ' + categoryColors[nodeDescriptions[activeNode]?.category || ''], paddingLeft: '15px', margin: '15px 0' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#FFF' }}>Flow</h3>
                      <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {nodeDescriptions[activeNode]?.flow || 'No flow available.'}
                      </p>
                    </div>
                    
                    {nodeDescriptions[activeNode]?.connections && (
                      <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#FFF' }}>Connects With</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {nodeDescriptions[activeNode].connections.map((conn, idx) => (
                            <span key={idx} style={{ 
                              display: 'inline-block', 
                              padding: '5px 10px', 
                              backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                              borderRadius: '4px',
                              color: '#FFF',
                              fontSize: '14px'
                            }}>{conn}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {nodeDescriptions[activeNode]?.keyPoints && (
                      <div>
                        <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#FFF' }}>Key Points</h3>
                        <ul style={{ paddingLeft: '20px' }}>
                          {nodeDescriptions[activeNode].keyPoints.map((point, idx) => (
                            <li key={idx} style={{ marginBottom: '8px', color: 'rgba(255, 255, 255, 0.8)' }}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
                
                {!activeNode && activeCategory && (
                  <>
                    <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#FFF', borderBottom: '2px solid ' + categoryColors[activeCategory], paddingBottom: '10px' }}>
                      {activeCategory}
                    </h2>
                    
                    <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      {categoryDescriptions[activeCategory]}
                    </p>
                    
                    {activeCategory === 'Execution & Operations' && (
                      <div style={{ 
                        padding: '15px', 
                        backgroundColor: 'rgba(144, 238, 144, 0.15)', 
                        borderRadius: '8px',
                        marginBottom: '20px',
                        borderLeft: '4px solid #90EE90'
                      }}>
                        <p style={{ fontSize: '15px', color: '#FFF', lineHeight: '1.4' }}>
                          <strong>Day-to-Day Sales Motion & Deal Management</strong> — This section ensures that the sales team is executing against targets efficiently, with proper deal tracking and customer retention efforts.
                        </p>
                      </div>
                    )}
                    
                    <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#FFF' }}>Components</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {categoryMapping[activeCategory]?.map(nodeId => (
                        <div key={nodeId} 
                          style={{ 
                            padding: '12px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                            borderRadius: '8px',
                            cursor: 'pointer',
                            borderLeft: '4px solid ' + categoryColors[activeCategory]
                          }}
                          onClick={() => setActiveNode(nodeId)}
                        >
                          <h4 style={{ fontSize: '16px', marginBottom: '6px', color: '#FFF' }}>
                            {nodeDescriptions[nodeId]?.title}
                          </h4>
                          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                            {nodeDescriptions[nodeId]?.purpose}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringLandingPage;