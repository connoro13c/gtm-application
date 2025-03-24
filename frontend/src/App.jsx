import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScoringLandingPage from './components/ScoringLandingPage'
import CoreScoringLandingPage from '../coresassets/components/ScoringLandingPage'
import './components/ScoringLandingPage.css'
import '../coresassets/components/ScoringLandingPage.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ScoringLandingPage />} />
          <Route path="/scoring" element={<CoreScoringLandingPage />} />
          {/* Catch-all route to handle direct URL access in Firefox */}
          <Route path="*" element={<ScoringLandingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App