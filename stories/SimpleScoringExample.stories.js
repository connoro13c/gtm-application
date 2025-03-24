import SimpleScoringExample from './SimpleScoringExample';

export default {
  title: 'Pages/Enhanced-Scoring',
  component: SimpleScoringExample,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
};

export const Default = () => <SimpleScoringExample />;

Default.storyName = 'Enhanced Scoring Page';