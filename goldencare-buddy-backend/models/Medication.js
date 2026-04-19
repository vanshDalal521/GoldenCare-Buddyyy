import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  // Patient Reference
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  
  // Medication Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true, // e.g., "500mg", "1000 IU"
    trim: true
  },
  pillCount: {
    type: Number,
    required: true,
    default: 1, // How many pills to take (1, 2, etc.)
    min: 1
  },
  
  // Timing Information
  customTime: {
    type: String,
    required: true, // e.g., "12:00 AM", "08:30 AM", "02:45 PM"
    validate: {
      validator: function(v) {
        // Validates multiple time formats:
        // 1. 12-hour format: HH:MM AM/PM
        // 2. 24-hour format: HH:MM
        return /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(v) || 
               /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use either: HH:MM AM/PM or HH:MM (24-hour format)`
    }
  },
  slot: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
    required: true
  },
  
  // Instructions
  frequency: {
    type: String,
    default: 'Once daily'
  },
  notes: {
    type: String,
    trim: true
  },
  
  // Prescription Information
  prescribedBy: {
    type: String,
    required: true
  },
  prescribedDate: {
    type: Date,
    default: Date.now
  },
  
  // Taken History
  takenHistory: [{
    timestamp: {
      type: Date,
      required: true
    },
    method: {
      type: String,
      enum: ['web', 'notification', 'voice-call', 'manual'],
      default: 'web'
    },
    confirmedVia: {
      type: String,
      enum: ['button-click', 'phone-press-1', 'notification-action', null],
      default: null
    }
  }],
  
  // Active Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
medicationSchema.index({ patient: 1, isActive: 1 });
medicationSchema.index({ customTime: 1 });

// Method to check if medication was taken today
medicationSchema.methods.isTakenToday = function() {
  const today = new Date().toDateString();
  return this.takenHistory.some(entry => 
    new Date(entry.timestamp).toDateString() === today
  );
};

// Method to mark as taken
medicationSchema.methods.markAsTaken = function(method = 'web', confirmedVia = null) {
  if (!this.isTakenToday()) {
    this.takenHistory.push({
      timestamp: new Date(),
      method,
      confirmedVia
    });
    return this.save();
  }
  return Promise.resolve(this);
};

// Pre-save hook to format time to standard 12-hour format
medicationSchema.pre('save', function(next) {
  console.log('Medication pre-save hook called, customTime:', this.customTime);
  if (this.customTime) {
    // Handle null or undefined
    if (!this.customTime) {
      return next();
    }
    
    // If already in correct format, continue as is
    if (/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(this.customTime)) {
      console.log('Time already in correct format in pre-save');
    }
    // Convert 24-hour format to 12-hour format
    else if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(this.customTime)) {
      const [hours, minutes] = this.customTime.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      this.customTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      console.log('Converted to 12-hour format in pre-save:', this.customTime);
    }
    // Handle single digit hours (e.g., "8:00" -> "8:00 AM")
    else if (/^[0-9]:[0-5][0-9]$/.test(this.customTime)) {
      const [hours, minutes] = this.customTime.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      this.customTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      console.log('Converted single digit hour to 12-hour format in pre-save:', this.customTime);
    }
    // If format is not recognized, continue as is
    else {
      console.log('Time format not recognized in pre-save, keeping as is');
    }
  }
  console.log('Medication pre-save hook completed, customTime:', this.customTime);
  next();
});

const Medication = mongoose.model('Medication', medicationSchema);

export default Medication;