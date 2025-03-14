# Website Style Guide

## Brand Colors
- Primary: #F34E3F (Vermillion-7)
- Secondary: #3737F2 (Blue-5)
- Accent: #7834BB (Violet-5)
- Background: #F8F8F8 (Greyscale-10)
- Text: #202020 (Greyscale-2)

## Background-Specific Colors

### Dark Backgrounds
- Violet: Violet-09, Violet-08, Violet-07
- Vermilion: Vermilion-11, Vermilion-08, Vermilion-07
- Teal: Teal-08, Teal-07, Teal-06
- Blue: Blue-09, Blue-08, Blue-07

### Light Backgrounds
- Violet: Violet-06, Violet-05, Violet-04
- Vermilion: Vermilion-06, Vermilion-05, Vermilion-04
- Teal: Teal-05
- Blue: Blue-06, Blue-05, Blue-04

## Color Pairings

### Monochromatic Schemes
- Vermilion Family: Vermilion-00, Vermilion-01, Vermilion-02, Vermilion-07, Vermilion-08, Vermilion-11
- Violet Family: Violet-00, Violet-01, Violet-02, Violet-07, Violet-08
- Teal Family: Teal-00, Teal-01, Teal-02, Teal-07, Teal-08, Teal-11

### Multi-Color Scheme
- Primary palette: Vermilion-00, Violet-00, Violet-01, Vermilion-01, Vermilion-02
- Use for illustrations and gradients on dark backgrounds

### Dark Mode
- Use darker background textures with Vermilion, Violet, or Teal family colors
- Typography: Use lighter shades (07-08) for headings, mid-shades for body text
- Illustrations should incorporate gradient effects with the chosen color family

## Typography

### Brand Typefaces
- Logo: Eastman
- Headlines: PolySans (Bulky, Regular, Slim variants)
- Body: PolySans Mono
- Editorial: Perfectly Nineties
- Google backup: Onest (Bold, Medium, Regular)

### Typography Styles
- Monospace headings for product UI and technical content
- Thin and Thin Italic styles for editorial content
- Code blocks should use PolySans Mono with appropriate syntax highlighting

### Font Sizes
- H1: 48px
- H2: 36px
- H3: 24px
- Body: 16px
- Small text: 14px

## Text Colors

### Dark Backgrounds
- Primary text: Violet-09, Violet-08, Violet-07
- Secondary text: Vermilion-08, Vermilion-07
- Accent text: Teal-08, Teal-07, Teal-06, Blue-09, Blue-08, Blue-07

### Light Backgrounds
- Primary text: Violet-06, Violet-05, Violet-04
- Secondary text: Vermilion-06, Vermilion-05, Vermilion-04
- Accent text: Teal-05, Blue-06, Blue-05, Blue-04

## Components

### Buttons
- Primary: #F34E3F (Vermillion-7) background, white text, 8px border radius
- Secondary: #4C53FF (Blue-6) background, white text, 8px border radius
- Hover states: 10% darker

### Forms
- Input fields: 8px border radius, light gray border (#DDDDDD)
- Focus state: #F34E3F border
- Error state: #FF7867 (Vermillion-8) border and message

### Cards
- White background
- 16px border radius
- Light shadow: 0px 5px 10px rgba(0, 0, 0, 0.05)

## Spacing
- X-Small: 8px
- Small: 16px
- Medium: 24px
- Large: 32px
- X-Large: 48px
- XX-Large: 64px

## Iconography
- Line weight: 1.5px
- Rounded corners
- Icon sizes: 16px, 24px, 32px

## Grid System
- 12-column grid
- 1440px max container width
- 24px gutters
- Responsive breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1023px
  - Desktop: >= 1024px

## Animation
- Transitions: 0.3s ease-in-out
- Hover effects: subtle scale (1.02)
- Page transitions: fade in/out

## Imagery
- Border radius: 8px for small images, 16px for featured images
- Aspect ratios: 16:9 for hero images, 3:2 for cards
- Style: Modern, vibrant, with brand color overlays when appropriate

## Accessibility
- Minimum text contrast ratio: 4.5:1
- Focus states clearly visible
- Alternative text for all images
- Proper heading hierarchy

## Code Implementation
- Use Tailwind CSS utility classes
- Component-based architecture
- Follow BEM naming convention for custom CSS