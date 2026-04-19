import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  // Basic record information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  recordType: {
    type: String,
    required: true,
    enum: ['Lab Report', 'Imaging', 'Prescription', 'Vaccination', 'Discharge Summary', 'Other']
  },
  
  // File information
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number, // in bytes
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  
  // Patient association
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientId: {
    type: String,
    required: true,
    trim: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  
  // Doctor association (if uploaded by doctor)
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  doctorName: {
    type: String,
    trim: true
  },
  
  // Upload information
  uploadedBy: {
    type: String,
    required: true,
    enum: ['patient', 'doctor']
  },
  uploadedById: {
    type: String,
    required: true
  },
  uploadedByName: {
    type: String,
    required: true
  },
  
  // AI Analysis Results
  isAnalyzed: {
    type: Boolean,
    default: false
  },
  analysisExplanation: {
    type: String,
    required: false
  },
  extractedMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    notes: String
  }],
  
  // Timestamps
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
medicalRecordSchema.index({ patient: 1, uploadedAt: -1 });
medicalRecordSchema.index({ patientId: 1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ recordType: 1 });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;