import BasicPropensityToBuy from '../components/BasicPropensityToBuy';

export default {
  title: 'Pages/Enhanced/PropensityToBuy',
  component: BasicPropensityToBuy,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = () => <BasicPropensityToBuy />;

Default.storyName = 'Basic Propensity To Buy Page';