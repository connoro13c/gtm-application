import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import DataLoadingPage from './pages/DataLoadingPage';
import './App.css';

function App() {
  console.log('App component rendering');
  
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="data-loading" element={<DataLoadingPage />} />
        {/* Add more routes here as needed */}
      </Route>
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;