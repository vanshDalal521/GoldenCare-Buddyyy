import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const patientSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  patientId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
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
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true // Allow null for old records but unique if provided
  },
  countryCode: {
    type: String,
    default: '+91' // Default to India
  },
  
  // Assigned Doctors
  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],
  
  // FCM Token for Push Notifications
  fcmToken: {
    type: String,
    default: null
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
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

// Wellness tracking data
patientSchema.add({
  wellness: {
    type: {
      hydration: {
        type: {
          glasses: { type: Number, default: 0 },
          goal: { type: Number, default: 8 },
          lastUpdated: { type: Date, default: Date.now }
        },
        default: {}
      },
      exercises: [{
        id: Number,
        name: String,
        completed: Boolean
      }],
      breathing: {
        type: {
          completed: { type: Boolean, default: false },
          duration: { type: Number, default: 0 },
          lastUpdated: { type: Date, default: Date.now }
        },
        default: {}
      },
      mood: {
        type: String,
        default: ''
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    default: {
      hydration: { glasses: 0, goal: 8, lastUpdated: new Date() },
      exercises: [
        { id: 1, name: 'Gentle Stretching', completed: false },
        { id: 2, name: 'Walking', completed: false },
        { id: 3, name: 'Balance Exercise', completed: false }
      ],
      breathing: { completed: false, duration: 0, lastUpdated: new Date() },
      mood: '',
      lastUpdated: new Date()
    }
  }
});

// Create full phone number with country code
patientSchema.virtual('fullMobile').get(function() {
  // Ensure countryCode defaults to '+91' if not set
  const countryCode = this.countryCode || '+91';
  return `${countryCode}${this.mobile}`;
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
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
patientSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Ensure virtuals are included in JSON
patientSchema.set('toJSON', { virtuals: true });
patientSchema.set('toObject', { virtuals: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
