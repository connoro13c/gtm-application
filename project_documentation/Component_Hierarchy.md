# Component/Page Hierarchy

## Root Component

The root component serves as the top-level wrapper, handling global state, authentication flows, and routing. It contains the main layout structure including the side navigation drawer and content area.

## Main Navigation (Drawer-Style Side Navigation)

The main navigation drawer provides direct access to core workflows and functionality defined by the UX wireframes and PRD documentation. It has been implemented as a collapsible side drawer with expandable navigation sections.

## Navigation Structure

```
Root Component
├── SideDrawer (src/components/Navigation/SideDrawer.jsx)
│   ├── Dashboard
│   │   ├── Overview
│   │   ├── Pipeline Health
│   │   ├── Territory Coverage
│   │   └── Quick Metrics
│   ├── Accounts
│   │   ├── Account List
│   │   ├── Assigned Accounts
│   │   ├── Filter by Rep
│   │   └── Sort by Score
│   │
│   ├── Account Scoring
│   │   ├── ML Model Selector
│   │   ├── Parameter Configurator
│   │   └── Calculate Scores
│   │
│   ├── Segmentation
│   │   ├── Current Segmentation
│   │   └── Recommended Segmentation
│   │
│   ├── Territory Management
│   │   ├── Territory Rules
│   │   ├── Assignment Overrides
│   │   └── Performance Reports
│   │
│   ├── Data Management
│   │   ├── Data Import
│   │   ├── Data Export
│   │   └── Data Hygiene
│   │
│   ├── Reports & Dashboards
│   │   ├── Overview Metrics
│   │   ├── Pipeline Health
│   │   └── Segmentation Performance
│   │
│   └── Settings
│       ├── User Profiles
│       ├── Permissions & Roles
│       └── System Preferences
│
└── Content Area
    ├── Dashboard (src/components/Dashboard/Dashboard.jsx)
    │   ├── High-Level Metrics
    │   │   ├── Total Accounts
    │   │   ├── Average Propensity Score
    │   │   ├── High-Value Accounts
    │   │   ├── New Accounts Added
    │   │   └── Critical Missing Data
    │   ├── Predictive Success Trendline
    │   ├── Drivers of Account Score Movements
    │   │   ├── Positive Drivers
    │   │   └── Negative Drivers
    │   └── Quick Access & Actions
    │
    ├── Accounts
    ├── Account Scoring
    ├── Segmentation
    ├── Territory Management
    ├── Data Management
    ├── Reports & Dashboards
    └── Settings
```

## Component Implementation

### SideDrawer Component

The SideDrawer component (`src/components/Navigation/SideDrawer.jsx`) features:

- Collapsible/expandable navigation with toggle functionality
- Nested navigation items with expand/collapse capability
- Active state highlighting for current route
- Responsive design with different behaviors for desktop, tablet, and mobile
- Icon and text display with collapsible text for compact mode

### Dashboard Component

The Dashboard component (`src/components/Dashboard/Dashboard.jsx`) implements:

- High-Level Metrics section with KPI cards
- Predictive Success Trendline visualization
- Drivers of Account Score Movements section
- Quick Access & Actions section for common tasks
- Responsive grid layout for different screen sizes

## Responsiveness

- **Desktop (>1024px)**: Persistent side navigation drawer, expandable/collapsible with button control.
- **Tablet (600px–1024px):** Collapsible drawer via toggle button, collapses to icon-only view.
- **Mobile (<600px)**: Fully collapsible via hamburger menu with full-screen overlay when expanded.

## Detailed Components/Pages

- **Dashboard**: Entry point with aggregated metrics, predictive success trends, score movement drivers, and quick access actions.
- **Account List**: Core working page with account-level details and scoring (to be implemented).
- **Account Scoring**: ML-driven scoring calculations and parameter adjustments (to be implemented).
- **Territory Management**: Administrative view for rules, assignments, and adjustments (to be implemented).
- **Account Segmentation**: Visualization and management of current vs suggested segments (to be implemented).

---

This component hierarchy directly aligns with the UX wireframes, PRD details, and previously defined workflows, ensuring consistency and clarity for the development team. The implementation provides a solid foundation for building out the remaining components of the GTM application.