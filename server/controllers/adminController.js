import User from '../models/User.js';
import Bus from '../models/Bus.js';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import { sendApprovalEmail } from '../services/emailService.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const where = {};
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password', 'emailVerificationToken'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all bus owners
export const getAllOwners = async (req, res) => {
  try {
    const owners = await User.findAll({
      where: { role: 'owner' },
      attributes: { exclude: ['password', 'emailVerificationToken'] },
      include: [{
        model: Bus,
        as: 'buses',
        attributes: ['id', 'busName', 'busNumber']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ owners });
  } catch (error) {
    console.error('Get all owners error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve/reject bus owner
export const updateOwnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const owner = await User.findByPk(id);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    if (owner.role !== 'owner') {
      return res.status(400).json({ message: 'User is not a bus owner' });
    }

    // Update approval status
    owner.isApproved = isApproved;
    await owner.save();

    // Send approval email
    await sendApprovalEmail(owner.email, owner.name, isApproved);

    res.json({
      message: isApproved 
        ? 'Owner approved successfully' 
        : 'Owner approval revoked',
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
        isApproved: owner.isApproved
      }
    });
  } catch (error) {
    console.error('Update owner status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard analytics
export const getAnalytics = async (req, res) => {
  try {
    // Total revenue
    const revenueResult = await Booking.findAll({
      where: { paymentStatus: 'paid' },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
      ],
      raw: true
    });
    const totalRevenue = parseFloat(revenueResult[0]?.total || 0);

    // Total bookings
    const totalBookings = await Booking.count();

    // Total users
    const totalUsers = await User.count({ where: { role: 'user' } });

    // Total bus owners
    const totalBusOwners = await User.count({ where: { role: 'owner' } });

    // Total buses
    const totalBuses = await Bus.count();

    // Recent bookings
    const recentBookings = await Booking.findAll({
      limit: 10,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Bus,
          as: 'bus',
          attributes: ['id', 'busName', 'busNumber']
        },
        {
          model: Schedule,
          as: 'schedule',
          attributes: ['id', 'from', 'to', 'date']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      totalRevenue,
      totalBookings,
      totalUsers,
      totalBusOwners,
      totalBuses,
      recentBookings
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

