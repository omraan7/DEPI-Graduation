import PainRecord from '../models/PainRecord.js';
import Exercise from '../models/Exercise.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import TreatmentPlan from '../models/TreatmentPlan.js';
import SessionLog from '../models/SessionLog.js';

// @desc    Save pain map data
// @route   POST /api/patient/pain
// @access  Private (Patient)
const addPainRecord = async (req, res, next) => {
  try {
    const { painLevel, bodyParts, notes } = req.body;

    const record = new PainRecord({
      patient: req.user._id,
      painLevel,
      bodyParts,
      notes,
    });

    const createdRecord = await record.save();
    res.status(201).json(createdRecord);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient pain records
// @route   GET /api/patient/pain
// @access  Private (Patient/Doctor)
const getPainRecords = async (req, res, next) => {
  try {
    // If patient, get own records. If doctor, get records for a specific patient ID passed in query
    let query = { patient: req.user._id };
    if (req.user.role === 'doctor' && req.query.patientId) {
      query = { patient: req.query.patientId };
    }

    const records = await PainRecord.find(query).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended exercises / active treatment plan
// @route   GET /api/patient/exercises
// @access  Private (Patient)
const getMyExercises = async (req, res, next) => {
  try {
    // Check if patient has an active treatment plan
    const plan = await TreatmentPlan.findOne({
      patient: req.user._id,
      status: 'Active',
    }).populate('exercises.exercise');

    if (plan) {
      res.json(plan.exercises);
    } else {
      // Return default easy exercises if no plan
      const defaultExercises = await Exercise.find({ difficulty: 'Easy' }).limit(5);
      res.json(defaultExercises.map(ex => ({ exercise: ex })));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient alerts/notifications
// @route   GET /api/patient/alerts
// @access  Private
const getAlerts = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor recommendations
// @route   GET /api/patient/doctors
// @access  Private
const getRecommendedDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Log an exercise session
// @route   POST /api/patient/session
// @access  Private (Patient)
const addSessionLog = async (req, res, next) => {
  try {
    const { exerciseId, exerciseName, durationMinutes, repsCompleted, maxAngle, painLevelAfter, notes } = req.body;

    const log = new SessionLog({
      patient: req.user._id,
      exercise: exerciseId,
      exerciseName,
      durationMinutes,
      repsCompleted,
      maxAngle,
      painLevelAfter,
      notes,
    });

    const createdLog = await log.save();
    res.status(201).json(createdLog);
  } catch (error) {
    next(error);
  }
};

export { addPainRecord, getPainRecords, getMyExercises, getAlerts, getRecommendedDoctors, addSessionLog };
