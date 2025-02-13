import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class ScoringResult extends Model {}

ScoringResult.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  modelId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ScoringModels',
      key: 'id'
    }
  },
  runDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  totalAccounts: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  scores: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of account scores with metadata'
  },
  metrics: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Performance metrics for this run'
  },
  distribution: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Score distribution statistics'
  },
  warnings: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Any warnings or issues during scoring'
  },
  dataSnapshot: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Summary of input data state'
  },
  status: {
    type: DataTypes.ENUM('completed', 'failed', 'partial'),
    defaultValue: 'completed'
  },
  errorDetails: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ScoringResult',
  timestamps: true,
  indexes: [
    {
      fields: ['modelId']
    },
    {
      fields: ['runDate']
    },
    {
      fields: ['status']
    }
  ]
});

export default ScoringResult; 