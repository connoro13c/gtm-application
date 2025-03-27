# UI/UX Design Guide

## Design Philosophy

Our application embraces a modern, clean interface with purposeful animations and interactive elements. The design balances professional functionality with engaging user experiences through:

- **Clarity**: Clear visual hierarchy and intuitive navigation
- **Consistency**: Standardized components and predictable interactions
- **Efficiency**: Streamlined workflows and intelligent defaults
- **Engagement**: Purposeful animations and visual feedback

## Color System

### Primary Color Palette
- **Primary**: #F34E3F (Vermillion-7) - Used for primary actions, key highlights
- **Secondary**: #3737F2 (Blue-5) - Used for secondary actions, supporting elements
- **Accent**: #7834BB (Violet-5) - Used for tertiary elements, selected states

### Supporting Colors
- **Success**: #3C886F (Green-6) - Confirmations, success states
- **Warning**: #FF7867 (Vermillion-8) - Alerts, warnings
- **Error**: #FF4C38 (Vermillion-6) - Error states
- **Info**: #4DB8DA (Teal-8) - Informational elements

### Background Colors
- **Light Mode**: #F8F8F8 (Greyscale-10)
- **Dark Mode**: #0F172A (Deep navy) - Primary dark background
- **Card backgrounds**: Light mode: white / Dark mode: rgba(26, 32, 44, 0.9)

## Typography

- **Primary Font**: PolySans (Bulky, Regular, Slim variants)
- **Monospace**: PolySans Mono - Used for technical content, code blocks
- **Fallback**: Inter, -apple-system, sans-serif

### Text Hierarchy
- **H1**: 48px / 32px (responsive)
- **H2**: 36px / 24px (responsive)
- **H3**: 24px / 20px (responsive)
- **Body**: 16px / 14px (responsive)
- **Small**: 14px

## Component Library

### Buttons
- **Primary**: Vermillion background (#F34E3F), white text, 8px border radius
- **Secondary**: Blue background (#3737F2), white text, 8px border radius
- **Tertiary/Text**: No background, primary color text
- **Disabled**: 40% opacity
- **Hover**: 10% darker shade, subtle scale (1.02)

### Cards
- **Border Radius**: 16px
- **Border**: 1px solid rgba(255, 255, 255, 0.1) in dark mode
- **Spacing**: 30px internal padding
- **Shadow**: 0 10px 30px rgba(0, 0, 0, 0.2) on hover
- **Animation**: 0.3s transform on hover (translateY(-5px))

### Forms
- **Input Fields**: 8px border radius, light border (#DDDDDD)
- **Focus State**: Primary color border
- **Error State**: Warning color border with message
- **Dropdowns**: Custom styling with subtle animation

### Wizards & Multi-step Flows
- **Progress Indicator**: Step numbers with connecting lines
- **Active Step**: Primary color highlight
- **Completed Step**: Success color checkmark
- **Navigation**: Back/Next buttons consistently positioned

## Interaction Patterns

### Animations
- **Page Transitions**: Fade in/out (0.3s ease-in-out)
- **Micro-interactions**: Subtle scale and color shifts
- **Loading States**: Pulse animations, spinners with brand colors
- **Scrolling**: Smooth scroll behavior

### Data Visualization
- **Charts**: Consistent color coding based on brand palette
- **Graphs**: Interactive nodes with hover states
- **Tables**: Alternating row colors, hover highlighting

### Responsive Behavior
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1023px
  - Desktop: ≥ 1024px
- **Layout**: 12-column grid system, 24px gutters
- **Container**: 1440px maximum width

## Accessibility Standards

- **Contrast**: Minimum 4.5:1 ratio for all text
- **Focus States**: Clearly visible focus indicators
- **Keyboard Navigation**: Full support for keyboard-only users
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Motion Sensitivity**: Reduced motion option for animations

## Design Patterns

### Navigation
- **Primary**: Side drawer with collapsible sections
- **Tabs**: Used for related content within the same context
- **Breadcrumbs**: For deep hierarchical navigation

### State Feedback
- **Loading**: Branded loading spinners or skeleton screens
- **Empty States**: Helpful illustrations with action prompts
- **Success/Error**: Toast notifications with appropriate colors

### Content Organization
- **Card Grids**: For browsing collections of items
- **Dashboard Layouts**: Flexible grid for data visualization
- **Wizards**: For complex multi-step processes

## Implementation Guidelines

- Use React functional components with hooks
- Leverage Framer Motion for complex animations
- Implement responsive layouts with CSS Grid/Flexbox
- Follow component-based architecture for reusability
- Maintain proper keyboard focus management
- Ensure consistent naming in CSS classes (BEM convention)