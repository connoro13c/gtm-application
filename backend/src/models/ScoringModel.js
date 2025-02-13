import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class ScoringModel extends Model {}

ScoringModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dataSourceConfig: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Configuration for data source (SFDC, Sheets, etc.)'
  },
  fieldMappings: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Selected fields and their roles'
  },
  modelType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of ML model (random_forest, logistic, etc.)'
  },
  modelParameters: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Model-specific parameters'
  },
  weights: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Feature weights and scoring parameters'
  },
  metrics: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Model performance metrics'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'archived'),
    defaultValue: 'active'
  },
  lastRun: {
    type: DataTypes.DATE,
    allowNull: true
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  sequelize,
  modelName: 'ScoringModel',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['name']
    }
  ]
});

export default ScoringModel; 