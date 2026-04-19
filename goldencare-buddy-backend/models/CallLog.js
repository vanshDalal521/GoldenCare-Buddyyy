import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
  // References
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  
  // Twilio Call Information
  callSid: {
    type: String,
    required: true
  },
  callStatus: {
    type: String,
    enum: ['initiated', 'queued', 'ringing', 'in-progress', 'answered', 'completed', 'busy', 'no-answer', 'failed', 'canceled'],
    default: 'initiated'
  },
  
  // Call Details
  duration: {
    type: Number, // in seconds
    default: 0
  },
  phoneNumber: {
    type: String,
    required: true
  },
  
  // Patient Response
  patientConfirmed: {
    type: Boolean,
    default: false
  },
  digitPressed: {
    type: String, // What digit patient pressed (1 for confirm, 2 for snooze, etc.)
    default: null
  },
  
  // AI Voice Details
  audioUrl: {
    type: String // URL of generated AI voice audio
  },
  voiceMessage: {
    type: String // Text message that was converted to speech
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
    required: true
  },
  calledAt: {
    type: Date,
    default: Date.now
  },
  
  // Retry Information
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

// Index for efficient queries
callLogSchema.index({ patient: 1, scheduledFor: 1 });
callLogSchema.index({ callSid: 1 }, { unique: true });
callLogSchema.index({ callStatus: 1 });

const CallLog = mongoose.model('CallLog', callLogSchema);

export default CallLog;
