import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Bus from './Bus.js';

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  busId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Bus,
      key: 'id'
    }
  },
  from: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  to: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  departureTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  arrivalTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  availableSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  duration: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'e.g., "3h 30m"'
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
  tableName: 'schedules',
  timestamps: true
});

// Define associations
Schedule.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });
Bus.hasMany(Schedule, { foreignKey: 'busId', as: 'schedules' });

export default Schedule;

