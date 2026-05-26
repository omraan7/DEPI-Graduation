import express from 'express';
const router = express.Router();
import {
  getDashboardStats,
  getPatients,
  getPatientDetail,
  createTreatmentPlan,
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

// All routes here are protected and require 'doctor' role
router.use(protect, authorize('doctor'));

router.get('/dashboard', getDashboardStats);
router.get('/patients', getPatients);
router.get('/patients/:id', getPatientDetail);
router.post('/treatment-plan', createTreatmentPlan);

export default router;
