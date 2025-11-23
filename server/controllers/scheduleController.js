import Schedule from '../models/Schedule.js';
import Bus from '../models/Bus.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import { Op } from 'sequelize';

// Get all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const where = {};
    if (from) where.from = from;
    if (to) where.to = to;
    if (date) where.date = date;

    const schedules = await Schedule.findAll({
      where,
      include: [{
        model: Bus,
        as: 'bus',
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'name']
        }]
      }],
      order: [['date', 'ASC'], ['departureTime', 'ASC']]
    });

    res.json({ schedules });
  } catch (error) {
    console.error('Get all schedules error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get schedules by bus
export const getSchedulesByBus = async (req, res) => {
  try {
    const { busId } = req.params;

    const schedules = await Schedule.findAll({
      where: { busId },
      include: [{
        model: Bus,
        as: 'bus'
      }],
      order: [['date', 'ASC'], ['departureTime', 'ASC']]
    });

    res.json({ schedules });
  } catch (error) {
    console.error('Get schedules by bus error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single schedule
export const getSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByPk(id, {
      include: [{
        model: Bus,
        as: 'bus',
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        }]
      }]
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ schedule });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create schedule
export const createSchedule = async (req, res) => {
  try {
    const { busId, from, to, departureTime, arrivalTime, date, price, duration } = req.body;

    // Validate required fields
    if (!busId || !from || !to || !departureTime || !arrivalTime || !date || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if bus exists and user has permission
    const bus = await Bus.findByPk(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && bus.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create schedule
    const schedule = await Schedule.create({
      busId,
      from,
      to,
      departureTime,
      arrivalTime,
      date,
      price: parseFloat(price),
      availableSeats: bus.totalSeats,
      duration: duration || calculateDuration(departureTime, arrivalTime)
    });

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update schedule
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, departureTime, arrivalTime, date, price, duration } = req.body;

    const schedule = await Schedule.findByPk(id, {
      include: [{ model: Bus, as: 'bus' }]
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && schedule.bus.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    if (from) schedule.from = from;
    if (to) schedule.to = to;
    if (departureTime) schedule.departureTime = departureTime;
    if (arrivalTime) schedule.arrivalTime = arrivalTime;
    if (date) schedule.date = date;
    if (price) schedule.price = parseFloat(price);
    if (duration) schedule.duration = duration;

    await schedule.save();

    res.json({
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByPk(id, {
      include: [{ model: Bus, as: 'bus' }]
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check ownership or admin
    if (req.user.role !== 'admin' && schedule.bus.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await schedule.destroy();

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to calculate duration
const calculateDuration = (departure, arrival) => {
  // Simple duration calculation - can be enhanced
  return '3h 30m';
};

