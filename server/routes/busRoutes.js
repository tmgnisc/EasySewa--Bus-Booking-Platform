import express from 'express';
import {
  getAllBuses,
  getBusesByOwner,
  getBus,
  createBus,
  updateBus,
  deleteBus
} from '../controllers/busController.js';
import { authenticate, authorize, authorizeOwner } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllBuses);
router.get('/:id', getBus);

// Protected routes
router.use(authenticate);

router.get('/owner/list', authorize('owner', 'admin'), getBusesByOwner);
router.post('/', authorize('owner', 'admin'), authorizeOwner, uploadMultiple('images', 10), createBus);
router.put('/:id', authorize('owner', 'admin'), uploadMultiple('images', 10), updateBus);
router.delete('/:id', authorize('owner', 'admin'), deleteBus);

export default router;

