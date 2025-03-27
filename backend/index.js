const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const dataRoutes = require('./routes/dataset');
const sessionRoutes = require('./routes/session');
const scoringSessionsRoutes = require('./routes/scoringSessions');

// Use routes
app.use('/api', dataRoutes);
app.use('/api', sessionRoutes);
app.use('/api', scoringSessionsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));