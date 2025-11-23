import sequelize from '../config/database.js';
import User from './User.js';
import Bus from './Bus.js';
import Schedule from './Schedule.js';
import Booking from './Booking.js';
import Route from './Route.js';
import Testimonial from './Testimonial.js';

// Initialize all models
const models = {
  User,
  Bus,
  Schedule,
  Booking,
  Route,
  Testimonial
};

// Sync database - creates tables if they don't exist
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ force, alter: !force });
    console.log('✅ All models synchronized successfully.');
    
    return true;
  } catch (error) {
    console.error('❌ Unable to sync database:', error);
    throw error;
  }
};

export default models;

