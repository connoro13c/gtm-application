import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Import routes (to be created)
import sessionRoutes from './routes/sessions.js';
import modelRoutes from './routes/models.js';
import resultRoutes from './routes/results.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/results', resultRoutes);

// Database connection and sync
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 