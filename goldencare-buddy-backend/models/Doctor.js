import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const doctorSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  doctorId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Professional Information
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Contact Information
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number!`
    }
  },
  countryCode: {
    type: String,
    default: '+91' // Default to India
  },
  
  // Document Storage for Verification
  documents: [{
    type: {
      type: String,
      enum: ['Medical License', 'Degree Certificate', 'ID Proof', 'Other'],
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // AI Verification Status
  aiVerification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'manual_review'],
      default: 'pending'
    },
    verifiedAt: {
      type: Date
    },
    rejectionReason: {
      type: String
    },
    aiConfidenceScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Manual Verification by Admin
  adminVerification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    verifiedAt: {
      type: Date
    },
    rejectionReason: {
      type: String
    }
  },
  
  // Verification Status (both AI and Admin must approve)
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationRequestedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Patients assigned to this doctor
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create full phone number with country code
doctorSchema.virtual('fullMobile').get(function() {
  return `${this.countryCode}${this.mobile}`;
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Method to assign a patient to this doctor
doctorSchema.methods.assignPatient = async function(patientId) {
  try {
    // Look for patient by patientId instead of _id
    const patient = await mongoose.model('Patient').findOne({ patientId });
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    // Add doctor to patient's doctors array if not already present
    if (!patient.doctors.includes(this._id)) {
      patient.doctors.push(this._id);
      await patient.save();
    }
    
    // Add patient to doctor's patients array if not already present
    if (!this.patients.includes(patient._id)) {
      this.patients.push(patient._id);
      await this.save();
    }
    
    return { success: true, patient, doctor: this };
  } catch (error) {
    throw new Error(`Error assigning patient: ${error.message}`);
  }
};

// Method to get all patients assigned to this doctor
doctorSchema.methods.getAssignedPatients = async function() {
  try {
    const patients = await mongoose.model('Patient').find({
      _id: { $in: this.patients }
    }).select('-password');
    
    return patients;
  } catch (error) {
    throw new Error(`Error fetching assigned patients: ${error.message}`);
  }
};

// Method to check if doctor is fully verified
doctorSchema.methods.isFullyVerified = function() {
  return this.aiVerification.status === 'verified' && 
         this.adminVerification.status === 'verified' && 
         this.isVerified;
};

// Ensure virtuals are included in JSON
doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;