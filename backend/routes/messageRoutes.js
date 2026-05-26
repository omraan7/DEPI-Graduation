import express from 'express';
const router = express.Router();
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.route('/')
  .post(protect, sendMessage);

router.route('/:userId')
  .get(protect, getMessages);

export default router;
