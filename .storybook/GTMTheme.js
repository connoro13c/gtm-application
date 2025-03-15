import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  
  // Brand colors
  colorPrimary: '#F34E3F', // Vermillion-7
  colorSecondary: '#3737F2', // Blue-5
  
  // UI colors
  appBg: '#F8F8F8', // Greyscale-10
  appContentBg: '#FFFFFF',
  appBorderColor: '#DDDDDD', // Greyscale-9
  appBorderRadius: 8,
  
  // Text colors
  textColor: '#202020', // Greyscale-2
  textInverseColor: '#FFFFFF',
  
  // Toolbar colors
  barTextColor: '#606060', // Greyscale-5
  barSelectedColor: '#F34E3F', // Vermillion-7
  barBg: '#FFFFFF',
  
  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  fontCode: '"PolySans Mono", monospace',
  
  // Brand assets
  brandTitle: 'GTM Application',
  brandUrl: './'
});