import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Doctor who reviewed or created it
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // Path to PDF/Image report
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

const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);
export default MedicalReport;
