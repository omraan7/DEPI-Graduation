import mongoose from 'mongoose';

const sessionLogSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
    },
    exerciseName: {
      type: String, // fallback if no specific exercise ID
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    repsCompleted: {
      type: Number,
      default: 0,
    },
    maxAngle: {
      type: Number, // Example: max shoulder angle reached during the session
    },
    painLevelAfter: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SessionLog = mongoose.model('SessionLog', sessionLogSchema);
export default SessionLog;
