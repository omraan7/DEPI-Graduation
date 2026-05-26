import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);

export default router;
