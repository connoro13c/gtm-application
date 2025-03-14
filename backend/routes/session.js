const router = require('express').Router();

// Session state management endpoints
router.post('/session-state/save', (req, res) => {
  // Save wizard state to wizard_session_states
  const { userId, sessionId, wizard_step, state_data } = req.body;
  
  // Implementation to save state in database
  res.json({ success: true, message: 'Session state saved' });
});

router.get('/session-state/load', (req, res) => {
  // Retrieve wizard state from wizard_session_states
  const { sessionId } = req.query;
  
  // Implementation to retrieve state from database
  res.json({
    success: true,
    state: {
      wizard_step: 'data_mapping',
      state_data: {
        // Sample state data for the data mapping interface
        selectedSources: ['salesforce', 'csv_upload'],
        mappedFields: {
          account_name: ['Company', 'AccountName'],
          domain: ['Website', 'Domain']
        }
      }
    }
  });
});

module.exports = router;