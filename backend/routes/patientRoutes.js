import express from 'express';
const router = express.Router();
import {
  addPainRecord,
  getPainRecords,
  getMyExercises,
  getAlerts,
  getRecommendedDoctors,
  addSessionLog,
} from '../controllers/patientController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

router.route('/pain')
  .post(protect, authorize('patient'), addPainRecord)
  .get(protect, getPainRecords); // Doctor can also access via query param

router.get('/exercises', protect, authorize('patient'), getMyExercises);
router.get('/alerts', protect, getAlerts);
router.get('/doctors', protect, authorize('patient'), getRecommendedDoctors);
router.post('/session', protect, authorize('patient'), addSessionLog);

export default router;
