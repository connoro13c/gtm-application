import sequelize from './config/database.js';
import WizardSession from './models/WizardSession.js';
import ScoringModel from './models/ScoringModel.js';
import ScoringResult from './models/ScoringResult.js';

const initializeDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models with the database
    // This will create tables if they don't exist
    // Force: false means it won't drop existing tables
    await sequelize.sync({ force: false });
    console.log('Database models synchronized successfully.');

    // Set up associations
    ScoringResult.belongsTo(ScoringModel, {
      foreignKey: 'modelId',
      as: 'model'
    });

    ScoringModel.hasMany(ScoringResult, {
      foreignKey: 'modelId',
      as: 'results'
    });

    console.log('Model associations established successfully.');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

export default initializeDatabase; 