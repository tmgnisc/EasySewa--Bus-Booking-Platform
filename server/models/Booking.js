import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Schedule from './Schedule.js';
import Bus from './Bus.js';

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  scheduleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Schedule,
      key: 'id'
    }
  },
  busId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Bus,
      key: 'id'
    }
  },
  seats: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of seat numbers like ["A1", "A2"]'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  bookingDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
    defaultValue: 'confirmed'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded'),
    defaultValue: 'pending'
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
  tableName: 'bookings',
  timestamps: true
});

// Define associations
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Schedule, { foreignKey: 'scheduleId', as: 'schedule' });
Booking.belongsTo(Bus, { foreignKey: 'busId', as: 'bus' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Schedule.hasMany(Booking, { foreignKey: 'scheduleId', as: 'bookings' });
Bus.hasMany(Booking, { foreignKey: 'busId', as: 'bookings' });

export default Booking;

