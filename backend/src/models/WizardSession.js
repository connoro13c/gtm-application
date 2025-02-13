import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class WizardSession extends Model {}

WizardSession.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currentStep: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'data-source'
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
    defaultValue: 'in_progress'
  },
  dataSource: {
    type: DataTypes.JSON,
    allowNull: true
  },
  selectedFields: {
    type: DataTypes.JSON,
    allowNull: true
  },
  modelConfig: {
    type: DataTypes.JSON,
    allowNull: true
  },
  weights: {
    type: DataTypes.JSON,
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  validationErrors: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isDraft: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'WizardSession',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    }
  ]
});

export default WizardSession; 