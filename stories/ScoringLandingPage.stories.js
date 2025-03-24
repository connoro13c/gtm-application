import SimpleScoringLandingPage from './SimpleScoringLandingPage';

export default {
  title: 'Pages/ScoringLandingPage',
  component: SimpleScoringLandingPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        component: 'A vibrant, immersive landing page for the Propensity to Buy scoring journey with magical interactions.'
      }
    }
  },
};

export const Default = () => <SimpleScoringLandingPage />;