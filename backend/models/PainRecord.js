import mongoose from 'mongoose';

const painRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    painLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    bodyParts: [
      {
        part: { type: String, required: true },
        intensity: { type: Number, required: true },
      },
    ],
    notes: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PainRecord = mongoose.model('PainRecord', painRecordSchema);
export default PainRecord;
