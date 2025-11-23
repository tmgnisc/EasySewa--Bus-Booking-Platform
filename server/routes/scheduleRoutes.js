import express from 'express';
import {
  getAllSchedules,
  getSchedulesByBus,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllSchedules);
router.get('/:id', getSchedule);
router.get('/bus/:busId', getSchedulesByBus);

// Protected routes
router.use(authenticate);

router.post('/', authorize('owner', 'admin'), createSchedule);
router.put('/:id', authorize('owner', 'admin'), updateSchedule);
router.delete('/:id', authorize('owner', 'admin'), deleteSchedule);

export default router;

