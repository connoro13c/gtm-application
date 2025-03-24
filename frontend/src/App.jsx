import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScoringLandingPage from './components/ScoringLandingPage'
import CoreScoringLandingPage from '../coresassets/components/ScoringLandingPage'
import EnhancedCombinedScoringPage from './components/EnhancedCombinedScoringPage'
import './components/ScoringLandingPage.css'
import '../coresassets/components/ScoringLandingPage.css'
import './components/EnhancedCombinedScoringPage.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ScoringLandingPage />} />
          <Route path="/scoring" element={<CoreScoringLandingPage />} />
          <Route path="/enhanced-combined" element={<EnhancedCombinedScoringPage />} />
          {/* Catch-all route to handle direct URL access in Firefox */}
          <Route path="*" element={<ScoringLandingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App