import { themes } from '@storybook/theming';
import GTMTheme from './GTMTheme';
import './global.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: GTMTheme,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F8F8F8',
        },
        {
          name: 'dark',
          value: '#020202',
        },
        {
          name: 'vermilion',
          value: '#FFF0EE',
        },
        {
          name: 'violet',
          value: '#F6EDFF',
        },
        {
          name: 'blue',
          value: '#EEEEFF',
        },
      ],
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
  },
};

export default preview;