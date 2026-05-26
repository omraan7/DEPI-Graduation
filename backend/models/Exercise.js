import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    targetBodyParts: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
