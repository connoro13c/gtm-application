# Dashboard Wireframe & UX/UI Specification

## 🎯 Dashboard Purpose

Provide immediate insights into account scoring health, predictive accuracy, data quality, and quick access to critical workflows and scenarios.

## 📐 Key Components & Layout

### Navigation Structure

We've implemented a side drawer navigation pattern instead of a top navigation bar as originally specified. This provides better space utilization and aligns with modern web application patterns.

#### Side Drawer Navigation:

- Collapsible drawer with toggle functionality
- Application logo in the header
- Expandable navigation sections:
  - Dashboard (highlighted when active)
  - Accounts
  - Account Scoring
  - Segmentation
  - Territory Management
  - Data Management
  - Reports & Dashboards
  - Settings
- Responsive design that adapts to desktop, tablet, and mobile viewports

### Dashboard Layout

#### Section 1: High-Level Metrics (Primary KPIs)

**Implementation Status: ✅ Completed**

- Total Accounts: Numeric count with trend indicator (up/down with percentage)
- Average Propensity Score: Numeric average with visual indicator (up/down trend)
- High-Value Accounts: Number of accounts scoring above a defined threshold (>80)
- New Accounts Added: Accounts added since the last scoring run
- Critical Missing Data: Clearly marked with alert icon and "Needs attention" indicator

#### Section 2: Predictive Success Trendline (Prominent Visual)

**Implementation Status: ✅ Completed (Placeholder for Chart Library)**

- Large, interactive chart prominently placed for immediate visibility
- Placeholder for line graph comparing scoring runs by date and predictive accuracy %
- Interactive elements to be implemented with a charting library:
  - Hover-over tooltips showing run details and insights
  - Clickable points linking to detailed scenario insights
- Summary metrics below the chart:
  - Last Scoring Run Accuracy
  - Improvement vs Previous Run
  - Next Scheduled Run

#### Section 3: Drivers of Account Score Movements

**Implementation Status: ✅ Completed**

- Positive Drivers: Clearly displayed top 3 drivers with visual indicators
  - Increased Engagement
  - Tech Stack Updates
  - Expansion Signals
- Negative Drivers: Explicit display of top 3 reasons accounts are declining
  - Budget Constraints
  - Competitor Activity
  - Stalled Opportunities
- Each driver includes a title and descriptive text explaining the impact

#### Section 4: Quick Access & Actions

**Implementation Status: ✅ Completed**

- Scenario Management: Quick link to view, create, or manage scenarios
- Data Sources Management: Direct access to manage data sources
- Account Scoring Page: Quick navigation for detailed individual account scoring
- Predictive Insights & Reports: Direct link to reports and actionable insights
- Each action includes an icon, title, and descriptive text

## ⚙️ Interactivity & UX Considerations

**Implementation Status: ✅ Completed**

- Intuitive navigation with clear visual hierarchy
- Prominent action buttons with descriptive text
- Clear visual indicators (colors/icons) to quickly identify status and urgency
- Responsive grid layout that adapts to different screen sizes
- Loading state and error handling for data fetching

## 🎨 Design System

- Color scheme: Primary brand color with complementary accent colors
- Typography: Clear hierarchy with appropriate sizing for headings and body text
- Card-based UI components with consistent padding and shadow styling
- Consistent iconography using Lucide React icons
- Status indicators using appropriate colors (green for positive, red for negative, amber for alerts)

## 📱 Responsive Behavior

- **Desktop (>1024px)**: Full grid layout with 4-5 columns for metrics
- **Tablet (768px-1024px)**: Adjusted grid with 2 columns for metrics
- **Mobile (<768px)**: Single column layout with stacked components

## ✅ Implementation Status

- ✅ Side Drawer Navigation: Implemented in `src/components/Navigation/SideDrawer.jsx`
- ✅ Dashboard Layout: Implemented in `src/components/Dashboard/Dashboard.jsx`
- ✅ High-Level Metrics: Implemented with MetricCard components
- ✅ Predictive Success Trendline: Implemented with placeholder for chart library
- ✅ Drivers of Account Score Movements: Implemented with DriverCard components
- ✅ Quick Access & Actions: Implemented with QuickActionCard components
- ⏳ Integration with real backend data: Placeholder data used, API integration pending
- ⏳ Interactive charts: Placeholder implemented, real chart library integration pending

## 🔜 Next Steps

- Integrate a chart library (e.g., Recharts, Chart.js) for the Predictive Success Trendline
- Connect to real backend API data instead of mock data
- Implement user authentication and role-based access control
- Add detailed tooltips and help text for metrics
- Implement drill-down functionality for metrics and drivers