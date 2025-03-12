import React from 'react';
import DataLoadingWizard from '../components/DataFlow/DataLoadingWizard';

const DataLoadingPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Data Loading</h1>
        <p className="text-gray-400 mt-2">
          Load, map, and validate your data for account scoring and segmentation.
        </p>
      </div>
      
      <DataLoadingWizard />
    </div>
  );
};

export default DataLoadingPage;