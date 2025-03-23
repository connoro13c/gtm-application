import React from 'react';
import EnhancedScoringLandingPage from '../frontend/src/components/EnhancedScoringLandingPage';

export default {
  title: 'Pages/EnhancedScoringLandingPage',
  component: EnhancedScoringLandingPage,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => <EnhancedScoringLandingPage {...args} />;

export const Default = Template.bind({});
Default.args = {};