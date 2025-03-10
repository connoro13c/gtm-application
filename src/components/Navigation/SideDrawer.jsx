import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoPrimary from '../../assets/Logo_Primary.png';
import WordmarkDark from '../../assets/Wordmark_Dark.png';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  PieChart,
  MapIcon, // Renamed to avoid shadowing global Map object
  Database,
  FileBarChart,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const SideDrawer = ({ onDrawerStateChange }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({
    dashboard: true,
    accounts: false,
    scoring: false,
    segmentation: false,
    territory: false,
    data: false,
    reports: false,
    settings: false
  });

  // Handle hover events for the drawer
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // Notify parent component when drawer state changes
  useEffect(() => {
    if (onDrawerStateChange) {
      onDrawerStateChange(isOpen);
    }
  }, [isOpen, onDrawerStateChange]);

  const toggleExpand = (item) => {
    setExpandedItems({
      ...expandedItems,
      [item]: !expandedItems[item]
    });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavItem = ({ icon, title, path, subItems, itemKey }) => {
    const hasChildren = subItems && subItems.length > 0;
    const isItemActive = path ? isActive(path) : false;
    const isExpanded = expandedItems[itemKey];

    return (
      <div className="mb-1">
        <button 
          type="button"
          className={`flex items-center w-full px-4 py-2 text-sm rounded-md cursor-pointer text-left ${
            isItemActive ? 'bg-primary/10 text-primary' : 'hover:bg-greyscale-4 text-white'
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(itemKey);
            }
          }}
          aria-expanded={isExpanded}
        >
          <div className="flex items-center flex-1">
            {icon}
            {isOpen && <span className="ml-3">{title}</span>}
          </div>
          {isOpen && hasChildren && (
            <div>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </button>

        {isOpen && isExpanded && hasChildren && (
          <div className="pl-10 mt-1 space-y-1">
            {subItems.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                className={`block px-4 py-2 text-sm rounded-md ${
                  isActive(child.path) ? 'bg-primary/10 text-primary' : 'hover:bg-greyscale-4 text-white'
                }`}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Drawer */}
      <div 
        className={`
          fixed top-0 left-0 z-40 h-full bg-greyscale-2 border-r border-greyscale-4 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-16'}
          translate-x-0 cursor-pointer
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-greyscale-4 shadow-sm bg-greyscale-2 h-[57px] overflow-hidden">
          <div className="flex items-center">
            {/* Logo - always visible */}
            <div className="h-7 flex-shrink-0">
              <img 
                src={LogoPrimary} 
                alt="GTM Application Logo" 
                className="h-full object-contain" 
              />
            </div>
            
            {/* Wordmark - revealed on drawer open with transition */}
            <div 
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 max-w-40 ml-3' : 'opacity-0 max-w-0 ml-0'}
              `}
            >
              <img 
                src={WordmarkDark} 
                alt="GTM Wordmark" 
                className="h-7 object-contain" 
              />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-2 overflow-y-auto h-[calc(100vh-4rem)]">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            title="Dashboard" 
            path="/" 
            itemKey="dashboard"
            subItems={[
              { title: 'Overview', path: '/' },
              { title: 'Pipeline Health', path: '/dashboard/pipeline' },
              { title: 'Territory Coverage', path: '/dashboard/territory' },
              { title: 'Quick Metrics', path: '/dashboard/metrics' }
            ]}
          />

          <NavItem 
            icon={<Users size={20} />} 
            title="Accounts" 
            path="/accounts" 
            itemKey="accounts"
            subItems={[
              { title: 'Account List', path: '/accounts/list' },
              { title: 'Assigned Accounts', path: '/accounts/assigned' },
              { title: 'Filter by Rep', path: '/accounts/filter-rep' },
              { title: 'Sort by Score', path: '/accounts/sort-score' }
            ]}
          />

          <NavItem 
            icon={<BarChart3 size={20} />} 
            title="Account Scoring" 
            path="/scoring" 
            itemKey="scoring"
            subItems={[
              { title: 'ML Model Selector', path: '/scoring/model-selector' },
              { title: 'Parameter Configurator', path: '/scoring/parameters' },
              { title: 'Calculate Scores', path: '/scoring/calculate' }
            ]}
          />

          <NavItem 
            icon={<PieChart size={20} />} 
            title="Segmentation" 
            path="/segmentation" 
            itemKey="segmentation"
            subItems={[
              { title: 'Current Segmentation', path: '/segmentation/current' },
              { title: 'Recommended Segmentation', path: '/segmentation/recommended' }
            ]}
          />

          <NavItem 
            icon={<MapIcon size={20} />} 
            title="Territory Management" 
            path="/territory" 
            itemKey="territory"
            subItems={[
              { title: 'Territory Rules', path: '/territory/rules' },
              { title: 'Assignment Overrides', path: '/territory/overrides' },
              { title: 'Performance Reports', path: '/territory/reports' }
            ]}
          />

          <NavItem 
            icon={<Database size={20} />} 
            title="Data Management" 
            path="/data" 
            itemKey="data"
            subItems={[
              { title: 'Data Import', path: '/data/import' },
              { title: 'Data Export', path: '/data/export' },
              { title: 'Data Hygiene', path: '/data/hygiene' }
            ]}
          />

          <NavItem 
            icon={<FileBarChart size={20} />} 
            title="Reports & Dashboards" 
            path="/reports" 
            itemKey="reports"
            subItems={[
              { title: 'Overview Metrics', path: '/reports/overview' },
              { title: 'Pipeline Health', path: '/reports/pipeline' },
              { title: 'Segmentation Performance', path: '/reports/segmentation' }
            ]}
          />

          <NavItem 
            icon={<Settings size={20} />} 
            title="Settings" 
            path="/settings" 
            itemKey="settings"
            subItems={[
              { title: 'User Profiles', path: '/settings/profiles' },
              { title: 'Permissions & Roles', path: '/settings/permissions' },
              { title: 'System Preferences', path: '/settings/preferences' }
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
