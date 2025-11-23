import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  handleWebhook
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Webhook route (no auth, Stripe handles it) - handled in server.js

// Protected routes
router.use(authenticate);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;

