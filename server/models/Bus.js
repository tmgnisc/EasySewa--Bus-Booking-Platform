import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  busNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  busName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  busType: {
    type: DataTypes.ENUM('AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'),
    allowNull: false
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of amenities like ["WiFi", "Charging Port", etc.]'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0,
    validate: {
      min: 0,
      max: 5
    }
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of image URLs'
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
  tableName: 'buses',
  timestamps: true
});

// Define associations
Bus.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Bus, { foreignKey: 'ownerId', as: 'buses' });

export default Bus;

