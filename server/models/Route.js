import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  from: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  to: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  popularityScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'routes',
  timestamps: true
});

export default Route;

