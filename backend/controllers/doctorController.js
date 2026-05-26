import User from '../models/User.js';
import TreatmentPlan from '../models/TreatmentPlan.js';
import PainRecord from '../models/PainRecord.js';
import MedicalReport from '../models/MedicalReport.js';
import SessionLog from '../models/SessionLog.js';

// @desc    Get doctor dashboard stats
// @route   GET /api/doctor/dashboard
// @access  Private (Doctor)
const getDashboardStats = async (req, res, next) => {
  try {
    // Basic stats: number of patients, active plans
    // In a real app, we'd have a specific association between doctor and patient
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const activePlans = await TreatmentPlan.countDocuments({ doctor: req.user._id, status: 'Active' });

    res.json({
      totalPatients,
      activePlans,
      todayAppointments: 0, // Placeholder
      unreadMessages: 0 // Placeholder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of patients
// @route   GET /api/doctor/patients
// @access  Private (Doctor)
const getPatients = async (req, res, next) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').lean();
    
    // Enrich with calculated data for UI
    const enrichedPatients = await Promise.all(patients.map(async (p) => {
      const plan = await TreatmentPlan.findOne({ patient: p._id }).sort({ createdAt: -1 });
      const latestPain = await PainRecord.findOne({ patient: p._id }).sort({ date: -1 });
      const sessionsCount = await SessionLog.countDocuments({ patient: p._id });
      
      const totalSessions = plan ? (plan.exercises.length * 10) : 10; // mock total
      const progress = Math.min(100, Math.round((sessionsCount / totalSessions) * 100));
      
      return {
        id: p._id,
        name: p.name,
        avatar: p.name.charAt(0).toUpperCase(),
        age: p.age || 35,
        injury: plan?.title?.toLowerCase().includes('knee') ? 'knee' : 'shoulder', // derived
        sessions: sessionsCount,
        totalSessions,
        progress,
        painLevel: latestPain ? latestPain.painLevel : 5,
        status: progress >= 100 ? 'completed' : 'inprogress',
        lastSeen: 'Today'
      };
    }));

    res.json(enrichedPatients);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient detail
// @route   GET /api/doctor/patients/:id
// @access  Private (Doctor)
const getPatientDetail = async (req, res, next) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');
    if (!patient) {
      res.status(404);
      throw new Error('Patient not found');
    }

    const plans = await TreatmentPlan.find({ patient: req.params.id }).populate('exercises.exercise');
    const painRecords = await PainRecord.find({ patient: req.params.id }).sort({ date: -1 }).limit(10);
    const medicalReports = await MedicalReport.find({ patient: req.params.id });
    const sessionLogs = await SessionLog.find({ patient: req.params.id }).populate('exercise').sort({ createdAt: -1 });

    res.json({
      patient: {
        id: patient._id,
        name: patient.name,
        avatar: patient.name.charAt(0).toUpperCase(),
        age: patient.age || 35,
        injury: plans.length > 0 && plans[0].title.toLowerCase().includes('knee') ? 'knee' : 'shoulder',
        status: 'inprogress',
        progress: 45, // calculated in a real app
        painLevel: painRecords.length > 0 ? painRecords[0].painLevel : 5,
        sessions: sessionLogs.length,
        totalSessions: 10,
        lastSeen: 'Today'
      },
      plans,
      painRecords,
      medicalReports,
      sessionLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a treatment plan
// @route   POST /api/doctor/treatment-plan
// @access  Private (Doctor)
const createTreatmentPlan = async (req, res, next) => {
  try {
    const { patientId, title, description, startDate, endDate, exercises } = req.body;

    const plan = new TreatmentPlan({
      patient: patientId,
      doctor: req.user._id,
      title,
      description,
      startDate,
      endDate,
      exercises
    });

    const createdPlan = await plan.save();
    res.status(201).json(createdPlan);
  } catch (error) {
    next(error);
  }
};

export { getDashboardStats, getPatients, getPatientDetail, createTreatmentPlan };
