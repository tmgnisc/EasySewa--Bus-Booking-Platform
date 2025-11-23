import express from 'express';
import {
  getAllUsers,
  getAllOwners,
  updateOwnerStatus,
  getAnalytics,
  deleteUser
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);
router.put('/owners/:id/approve', updateOwnerStatus);
router.get('/analytics', getAnalytics);
router.delete('/users/:id', deleteUser);

export default router;

