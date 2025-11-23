import express from 'express';
import { register, login, getMe, verifyEmail } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadOwnerDocuments } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', uploadOwnerDocuments, register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.get('/me', authenticate, getMe);

export default router;

