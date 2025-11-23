import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import Bus from '../models/Bus.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import { sendBookingNotificationToOwner } from '../services/emailService.js';

// Get booked seats for a schedule
export const getBookedSeats = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const bookings = await Booking.findAll({
      where: {
        scheduleId,
        status: { [Op.ne]: 'cancelled' } // Exclude cancelled bookings
      },
      attributes: ['seats']
    });

    // Flatten all booked seats
    const bookedSeats = [];
    bookings.forEach(booking => {
      if (Array.isArray(booking.seats)) {
        bookedSeats.push(...booking.seats);
      }
    });

    res.json({ bookedSeats });
  } catch (error) {
    console.error('Get booked seats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    let where = {};

    // Filter by user role
    if (req.user.role === 'user') {
      where.userId = req.user.id;
    } else if (req.user.role === 'owner') {
      // Get bookings for owner's buses
      const buses = await Bus.findAll({ where: { ownerId: req.user.id } });
      const busIds = buses.map(bus => bus.id);
      where.busId = { [Op.in]: busIds };
    }
    // Admin can see all bookings

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Schedule,
          as: 'schedule',
          attributes: ['id', 'from', 'to', 'date', 'departureTime', 'arrivalTime']
        },
        {
          model: Bus,
          as: 'bus',
          attributes: ['id', 'busName', 'busNumber', 'busType']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single booking
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Schedule,
          as: 'schedule'
        },
        {
          model: Bus,
          as: 'bus',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'user' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { scheduleId, seats } = req.body;

    if (!scheduleId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Schedule ID and seats are required' });
    }

    // Get schedule
    const schedule = await Schedule.findByPk(scheduleId, {
      include: [{ model: Bus, as: 'bus' }]
    });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Check available seats
    if (schedule.availableSeats < seats.length) {
      return res.status(400).json({ 
        message: 'Not enough available seats' 
      });
    }

    // Calculate total amount
    const totalAmount = schedule.price * seats.length;

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      scheduleId,
      busId: schedule.busId,
      seats,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'pending'
    });

    // Update available seats
    schedule.availableSeats -= seats.length;
    await schedule.save();

    // Get booking with relations
    const bookingWithRelations = await Booking.findByPk(booking.id, {
      include: [
        { model: Schedule, as: 'schedule' },
        { model: Bus, as: 'bus', include: [{ model: User, as: 'owner' }] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    // Send email notification to bus owner
    if (bookingWithRelations.bus?.owner) {
      try {
        await sendBookingNotificationToOwner(
          bookingWithRelations.bus.owner.email,
          bookingWithRelations.bus.owner.name,
          bookingWithRelations
        );
      } catch (emailError) {
        console.error('Error sending email to owner:', emailError);
        // Don't fail the booking if email fails
      }
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: bookingWithRelations
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findByPk(id, {
      include: [{ model: Schedule, as: 'schedule' }]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'user' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    // If cancelled, restore seats
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      booking.schedule.availableSeats += booking.seats.length;
      await booking.schedule.save();
    }

    await booking.save();

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [{ model: Schedule, as: 'schedule' }]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'user' && booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Update booking
    booking.status = 'cancelled';
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }

    // Restore seats
    booking.schedule.availableSeats += booking.seats.length;
    await booking.schedule.save();
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

