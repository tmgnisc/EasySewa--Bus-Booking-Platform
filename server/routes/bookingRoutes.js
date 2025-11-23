import express from 'express';
import {
  getAllBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllBookings);
router.get('/:id', getBooking);
router.post('/', authorize('user', 'admin'), createBooking);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

export default router;

