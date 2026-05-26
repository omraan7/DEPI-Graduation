import mongoose from 'mongoose';

const treatmentPlanSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    exercises: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true,
        },
        frequencyPerWeek: {
          type: Number,
          required: true,
          default: 3,
        },
        reps: {
          type: Number,
        },
        sets: {
          type: Number,
        },
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Paused'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const TreatmentPlan = mongoose.model('TreatmentPlan', treatmentPlanSchema);
export default TreatmentPlan;
