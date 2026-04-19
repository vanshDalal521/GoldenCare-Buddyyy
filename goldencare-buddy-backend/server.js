import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import models
import Patient from './models/Patient.js';
import Medication from './models/Medication.js';
import CallLog from './models/CallLog.js';
import Doctor from './models/Doctor.js';
import MedicalRecord from './models/MedicalRecord.js';
import jwt from 'jsonwebtoken';

// Import routes
import medicalRecordsRoutes from './routes/medicalRecords.js';

// Import middleware
import { authenticateToken, requireRole } from './middleware/auth.js';

// Import services (dynamically after environment variables are loaded)
let twilioService;
let doctorService;
let isDoctorServiceLoaded = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: messages
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Serve static audio files
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/goldencare-buddy')
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Import services AFTER environment variables are loaded
  import('./services/schedulerService.js').then((module) => {
    const schedulerService = module.default;
    // Start scheduler after DB connection
    schedulerService.start();
  });
  
  // Import doctor service
  import('./services/doctorService.js').then((module) => {
    doctorService = module.default;
    isDoctorServiceLoaded = true;
    console.log('✅ Doctor service loaded');
  }).catch((error) => {
    console.error('❌ Failed to load doctor service:', error);
    isDoctorServiceLoaded = false;
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ==================== MANUAL TWILIO TESTING ====================
app.get('/api/test-call', async (req, res) => {
  try {
    const twilioServiceModule = await import('./services/twilioService.js');
    const twilioService = twilioServiceModule.default;

    const patient = {
      _id: '12345demo12345',
      name: 'Vansh',
      fullMobile: '+919253395564'
    };
    
    const medication = {
      _id: '54321med54321',
      name: 'Aspirin',
      dosage: '50mg',
      pillCount: 1,
      customTime: '08:00 AM'
    };

    console.log(`[TEST] Triggering manual live AI call to ${patient.fullMobile}...`);
    const result = await twilioService.makeVoiceCall(patient, medication);
    
    res.json({ success: true, message: 'Test call fired perfectly', data: result });
  } catch (error) {
    console.error('[TEST] Call failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== START SERVER ====================

// ==================== PATIENT ROUTES ====================

/**
 * Register new patient
 */
app.post('/api/patients/register', async (req, res) => {
  try {
    const { name, patientId, password, mobile, countryCode, email } = req.body;

    // Validation
    if (!name || !patientId || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, patientId, password, mobile'
      });
    }

    // Check if patient ID already exists
    const existingPatientId = await Patient.findOne({ patientId });
    if (existingPatientId) {
      return res.status(409).json({
        success: false,
        message: 'Patient ID already exists'
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await Patient.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email address is already registered'
        });
      }
    }

    // Create new patient
    const patient = new Patient({
      name,
      patientId,
      password, // In production, hash this!
      mobile,
      email,
      countryCode: countryCode || '+91'
    });

    await patient.save();

    console.log(`✅ New patient registered: ${name} (${patientId})`);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        patientId: patient.patientId,
        mobile: patient.mobile,
        fullMobile: patient.fullMobile
      }
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering patient',
      error: error.message
    });
  }
});

/**
 * Patient login
 */
app.post('/api/patients/login', async (req, res) => {
  try {
    const { patientId, password } = req.body;

    // Find patient by patientId
    const patient = await Patient.findOne({ patientId });
    
    if (!patient) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password using bcrypt
    const isMatch = await patient.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    patient.lastLoginAt = new Date();
    await patient.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: patient._id, 
        patientId: patient.patientId, 
        role: 'patient' 
      },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        patientId: patient.patientId,
        mobile: patient.mobile,
        fullMobile: patient.fullMobile
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
});

/**
 * Get patient's medications
 */
app.get('/api/patients/:patientId/medications', async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const medications = await Medication.find({
      patient: patient._id,
      isActive: true
    }).sort({ customTime: 1 });

    res.json({
      success: true,
      medications
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medications',
      error: error.message
    });
  }
});

/**
 * Get patient profile
 */
app.get('/api/patients/profile', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      patient: {
        id: patient._id,
        name: patient.name,
        patientId: patient.patientId,
        mobile: patient.mobile,
        email: patient.email,
        wellness: patient.wellness
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

/**
 * Update patient profile
 */
app.put('/api/patients/profile', authenticateToken, async (req, res) => {
  try {
    const { email, mobile, name } = req.body;
    
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (email) patient.email = email;
    if (mobile) patient.mobile = mobile;
    if (name) patient.name = name;

    await patient.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        patientId: patient.patientId,
        mobile: patient.mobile,
        email: patient.email
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

/**
 * Get patient health data
 */
app.get('/api/patients/health', async (req, res) => {
  try {
    // In a real implementation, you would authenticate the user
    // For now, we'll return a basic health data structure
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health data',
      error: error.message
    });
  }
});

/**
 * Update patient health data
 */
app.post('/api/patients/health', async (req, res) => {
  try {
    // In a real implementation, you would authenticate the user and update health data
    // For now, we'll return a basic response
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  } catch (error) {
    console.error('Error updating health data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating health data',
      error: error.message
    });
  }
});

/**
 * Get patient wellness data
 */
app.get('/api/patients/:patientId/wellness', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Find patient by patientId
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Return the patient's wellness data
    res.json({
      success: true,
      wellness: patient.wellness || {}
    });
  } catch (error) {
    console.error('Error fetching wellness data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching wellness data',
      error: error.message
    });
  }
});

/**
 * Update patient wellness data
 */
app.post('/api/patients/:patientId/wellness', async (req, res) => {
  try {
    const { patientId } = req.params;
    const wellnessData = req.body;
    
    // Find patient by patientId
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Update the patient's wellness data
    patient.wellness = {
      ...patient.wellness,
      ...wellnessData,
      lastUpdated: new Date()
    };
    
    await patient.save();
    
    res.json({
      success: true,
      message: 'Wellness data updated successfully',
      wellness: patient.wellness
    });
  } catch (error) {
    console.error('Error updating wellness data:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating wellness data',
      error: error.message
    });
  }
});

/**
 * Mark medication as taken
 */
app.post('/api/patients/medications/:medicationId/taken', async (req, res) => {
  try {
    const { medicationId } = req.params;
    
    // Find the medication
    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }
    
    // Add to taken history
    medication.takenHistory = medication.takenHistory || [];
    medication.takenHistory.push({
      timestamp: new Date()
    });
    
    await medication.save();
    
    res.json({
      success: true,
      message: 'Medication marked as taken',
      medication
    });
  } catch (error) {
    console.error('Error marking medication as taken:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking medication as taken',
      error: error.message
    });
  }
});

/**
 * Mark medication as taken
 */
app.post('/api/medications/:medicationId/mark-taken', async (req, res) => {
  try {
    const { medicationId } = req.params;
    const { method = 'web', confirmedVia = 'button-click' } = req.body;

    const medication = await Medication.findById(medicationId);
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    if (medication.isTakenToday()) {
      return res.status(400).json({
        success: false,
        message: 'Medication already taken today'
      });
    }

    await medication.markAsTaken(method, confirmedVia);

    res.json({
      success: true,
      message: 'Medication marked as taken',
      medication
    });
  } catch (error) {
    console.error('Error marking medication as taken:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking medication as taken',
      error: error.message
    });
  }
});

// ==================== DOCTOR/ADMIN ROUTES ====================

/**
 * Doctor login
 */
app.post('/api/doctors/login', async (req, res) => {
  try {
    const { doctorId, password } = req.body;

    // Find doctor by doctorId
    const doctor = await Doctor.findOne({ 
      $or: [{ doctorId }, { email: doctorId }] 
    });
    
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if doctor is verified
    if (!doctor.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Doctor account not verified. Please wait for verification.'
      });
    }

    // Compare password
    const isMatch = await doctor.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    doctor.lastLoginAt = new Date();
    await doctor.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: doctor._id, 
        doctorId: doctor.doctorId, 
        role: 'doctor' 
      },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        doctorId: doctor.doctorId,
        specialization: doctor.specialization,
        mobile: doctor.mobile,
        fullMobile: doctor.fullMobile
      }
    });
  } catch (error) {
    console.error('Error during doctor login:', error);
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
});

/**
 * Get doctor profile
 */
app.get('/api/doctors/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        doctorId: doctor.doctorId,
        specialization: doctor.specialization,
        mobile: doctor.mobile,
        fullMobile: doctor.fullMobile
      }
    });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor profile',
      error: error.message
    });
  }
});

/**
 * Get patients assigned to a doctor
 */
app.get('/api/doctors/:doctorId/patients', async (req, res) => {
  try {
    // Check if doctorService is loaded
    if (!doctorService) {
      return res.status(503).json({
        success: false,
        message: 'Doctor service not loaded yet. Please try again in a moment.'
      });
    }
    
    const { doctorId } = req.params;

    const patients = await doctorService.getAssignedPatients(doctorId);

    res.json({
      success: true,
      patients
    });
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor patients',
      error: error.message
    });
  }
});

/**
 * Assign patient to doctor (authenticated route)
 */
app.post('/api/doctors/:doctorId/assign-patient', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { patientId } = req.body;

    // Verify the doctor making the request
    if (req.user.doctorId !== doctorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find doctor
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Find patient
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if already assigned
    const isAlreadyAssigned = patient.doctors.some(docId => docId.toString() === doctor._id.toString());
    if (isAlreadyAssigned) {
      return res.status(409).json({
        success: false,
        message: 'Patient is already assigned to this doctor'
      });
    }

    // Add doctor to patient's doctors array
    patient.doctors.push(doctor._id);
    await patient.save();

    // Add patient to doctor's patients array
    doctor.patients.push(patient._id);
    await doctor.save();

    res.json({
      success: true,
      message: 'Patient assigned successfully',
      patient: {
        id: patient._id,
        name: patient.name,
        patientId: patient.patientId
      },
      doctor: {
        id: doctor._id,
        name: doctor.name,
        doctorId: doctor.doctorId
      }
    });
  } catch (error) {
    console.error('Error assigning patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning patient',
      error: error.message
    });
  }
});

/**
 * Get patient details for a doctor
 */
app.get('/api/doctors/:doctorId/patients/:patientId', async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;

    // Find doctor
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Find patient
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if patient is assigned to this doctor
    const isAssigned = patient.doctors.some(docId => docId.toString() === doctor._id.toString());
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'Patient is not assigned to this doctor'
      });
    }

    // Return patient data without sensitive information
    const patientData = {
      _id: patient._id,
      name: patient.name,
      patientId: patient.patientId,
      mobile: patient.mobile,
      fullMobile: patient.fullMobile,
      createdAt: patient.createdAt,
      lastLoginAt: patient.lastLoginAt
    };

    res.json({
      success: true,
      patient: patientData
    });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient details',
      error: error.message
    });
  }
});

/**
 * Get patient medications for a doctor
 */
app.get('/api/doctors/:doctorId/patients/:patientId/medications', async (req, res) => {
  try {
    // Check if doctorService is loaded
    if (!doctorService) {
      return res.status(503).json({
        success: false,
        message: 'Doctor service not loaded yet. Please try again in a moment.'
      });
    }
    
    const { doctorId, patientId } = req.params;

    const medications = await doctorService.getPatientMedications(doctorId, patientId);

    res.json({
      success: true,
      medications
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medications',
      error: error.message
    });
  }
});

/**
 * Add medication for patient (doctor only)
 */
app.post('/api/doctors/:doctorId/medications', async (req, res) => {
  try {
    // Check if doctorService is loaded
    if (!doctorService) {
      return res.status(503).json({
        success: false,
        message: 'Doctor service not loaded yet. Please try again in a moment.'
      });
    }
    
    const { doctorId } = req.params;
    const medicationData = req.body;
    
    console.log('Adding medication for doctor:', doctorId);
    console.log('Medication data:', medicationData);
    
    // Validate that medicationData exists
    if (!medicationData) {
      return res.status(400).json({
        success: false,
        message: 'Medication data is required'
      });
    }
    
    // Validate that doctorId exists
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      });
    }

    const result = await doctorService.addMedication(doctorId, medicationData);
    
    console.log('Medication added successfully:', result);

    res.status(201).json({
      success: true,
      message: 'Medication added successfully',
      ...result
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific error codes
    if (error.code) {
      switch (error.code) {
        case 'DOCTOR_NOT_FOUND':
          return res.status(404).json({
            success: false,
            message: error.message
          });
        case 'PATIENT_NOT_FOUND':
          return res.status(404).json({
            success: false,
            message: error.message
          });
        case 'PATIENT_NOT_ASSIGNED':
          return res.status(403).json({
            success: false,
            message: error.message
          });
        case 'MISSING_NAME':
        case 'MISSING_DOSAGE':
        case 'MISSING_TIME':
        case 'MISSING_SLOT':
        case 'MISSING_PRESCRIBED_BY':
          return res.status(400).json({
            success: false,
            message: error.message
          });
      }
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages.join(', ')}`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error adding medication',
      error: error.message
    });
  }
});

/**
 * Remove medication for a patient (doctor only)
 */
app.delete('/api/doctors/:doctorId/patients/:patientId/medications/:medicationId', async (req, res) => {
  try {
    const { doctorId, patientId, medicationId } = req.params;
    
    console.log(`[Backend] Deleting medication ${medicationId} for patient ${patientId} by doctor ${doctorId}`);
    
    // Verify doctor and patient relationship
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Check if patient is assigned to this doctor
    const isAssigned = patient.doctors.some(docId => docId.toString() === doctor._id.toString());
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'Patient is not assigned to this doctor'
      });
    }
    
    // Find and delete the medication using MongoDB ObjectId
    const medication = await Medication.findOne({
      _id: medicationId,
      patient: patient._id,
      isActive: true
    });
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found or already deleted'
      });
    }
    
    // Mark as inactive instead of hard delete
    medication.isActive = false;
    await medication.save();
    
    console.log(`✅ Medication deleted: ${medication.name} for ${patient.name}`);
    
    // Notify about the medication update
    console.log(`[Backend] Notifying about medication deletion for patient ${patientId}`);
    
    res.json({
      success: true,
      message: 'Medication deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting medication',
      error: error.message
    });
  }
});

/**
 * Remove patient from doctor's list
 */
app.delete('/api/doctors/:doctorId/patients/:patientId', async (req, res) => {
  try {
    // Check if doctorService is loaded
    if (!doctorService) {
      return res.status(503).json({
        success: false,
        message: 'Doctor service not loaded yet. Please try again in a moment.'
      });
    }
    
    const { doctorId, patientId } = req.params;
    
    const result = await doctorService.removePatient(doctorId, patientId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error removing patient:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing patient'
    });
  }
});

/**
 * Add medication for a patient (authenticated route)
 */
app.post('/api/medications', authenticateToken, requireRole(['doctor']), async (req, res) => {
  try {
    const {
      patientId,
      name,
      dosage,
      pillCount,
      customTime,
      slot,
      frequency,
      notes,
      prescribedBy
    } = req.body;

    // Validation
    if (!patientId || !name || !dosage || !customTime || !slot || !prescribedBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientId, name, dosage, customTime, slot, prescribedBy'
      });
    }

    // Find patient
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Verify doctor-patient relationship
    const isAssigned = patient.doctors.some(docId => docId.toString() === req.currentUser._id.toString());
    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: 'Patient is not assigned to this doctor'
      });
    }

    // Create medication
    const medication = new Medication({
      patient: patient._id,
      name,
      dosage,
      pillCount: pillCount || 1,
      customTime,
      slot,
      frequency: frequency || 'Once daily',
      notes,
      prescribedBy
    });

    await medication.save();

    console.log(`✅ Medication added: ${name} for ${patient.name} at ${customTime}`);

    res.status(201).json({
      success: true,
      message: 'Medication added successfully',
      medication
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding medication',
      error: error.message
    });
  }
});

/**
 * Update medication
 */
app.put('/api/medications/:medicationId', async (req, res) => {
  try {
    const { medicationId } = req.params;
    const updates = req.body;

    const medication = await Medication.findByIdAndUpdate(
      medicationId,
      updates,
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.json({
      success: true,
      message: 'Medication updated successfully',
      medication
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medication',
      error: error.message
    });
  }
});

/**
 * Delete medication
 */
app.delete('/api/medications/:medicationId', async (req, res) => {
  try {
    const { medicationId } = req.params;

    const medication = await Medication.findByIdAndUpdate(
      medicationId,
      { isActive: false },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.json({
      success: true,
      message: 'Medication deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting medication',
      error: error.message
    });
  }
});

/**
 * Get all patients (for doctor dashboard)
 */
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
});

// ==================== MEDICAL RECORDS ROUTES ====================
app.use('/api/medical-records', medicalRecordsRoutes);

// ==================== TWILIO WEBHOOKS ====================

/**
 * TwiML endpoint for medication reminder
 */
app.get('/twiml/medication-reminder', (req, res) => {
  const { audioUrl, medicationId, voiceMessage } = req.query;
  
  const twiml = twilioService.generateMedicationReminderTwiML(audioUrl, medicationId, voiceMessage);
  
  res.type('text/xml');
  res.send(twiml);
});

/**
 * Handle patient response (digit pressed)
 */
app.post('/api/twilio/handle-response', async (req, res) => {
  try {
    const { Digits, CallSid } = req.body;
    const { medicationId } = req.query;

    const twiml = await twilioService.handlePatientResponse(Digits, medicationId, CallSid);
    
    res.type('text/xml');
    res.send(twiml);
  } catch (error) {
    console.error('Error handling Twilio response:', error);
    res.type('text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>An error occurred. Please try again later.</Say>
</Response>`);
  }
});

/**
 * Twilio status callback
 */
app.post('/api/twilio/status', async (req, res) => {
  try {
    const { CallSid, CallStatus } = req.body;
    
    // Import the Twilio service
    const twilioServiceModule = await import('./services/twilioService.js');
    const twilioService = twilioServiceModule.default;
    
    await twilioService.updateCallStatus(CallSid, CallStatus);
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating call status:', error);
    res.sendStatus(500);
  }
});

// ==================== TESTING/MANUAL TRIGGER ROUTES ====================

/**
 * Manually trigger a voice call (for testing)
 */
app.post('/api/test/trigger-call/:medicationId', async (req, res) => {
  try {
    // Import scheduler service
    const schedulerModule = await import('./services/schedulerService.js');
    const schedulerService = schedulerModule.default;
    
    const { medicationId } = req.params;
    
    const result = await schedulerService.triggerManualReminder(medicationId);
    
    res.json(result);
  } catch (error) {
    console.error('Error triggering manual call:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering call',
      error: error.message
    });
  }
});

/**
 * Manually trigger doctor notification for missed medication (for testing)
 */
app.post('/api/test/notify-doctor/:medicationId', async (req, res) => {
  try {
    const { medicationId } = req.params;
    
    // Get medication with patient populated
    const medication = await Medication.findById(medicationId).populate({
      path: 'patient',
      options: { 
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
    });
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }
    
    if (!medication.patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Import the doctor notification service
    const doctorNotificationService = (await import('./services/doctorNotificationService.js')).default;
    
    // Use dummy doctor info for testing
    const doctorInfo = {
      name: 'Doctor Smith',
      phone: '+1234567890'
    };
    
    // Notify doctor
    await doctorNotificationService.notifyDoctorForMissedMedication(medication, medication.patient, doctorInfo);
    
    res.json({
      success: true,
      message: `Doctor notification triggered for ${medication.name}`
    });
  } catch (error) {
    console.error('Error triggering doctor notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering doctor notification',
      error: error.message
    });
  }
});

/**
 * Simulate patient pressing 1 (medication taken)
 */
app.post('/api/test/simulate-patient-press-1/:medicationId', async (req, res) => {
  try {
    const { medicationId } = req.params;
    
    // Import the Twilio service
    const twilioServiceModule = await import('./services/twilioService.js');
    const twilioService = twilioServiceModule.default;
    
    // Simulate the patient pressing 1
    // Use a proper call SID format for testing
    const callSid = `SIM_TEST_${Date.now()}`;
    const twimlResponse = await twilioService.handlePatientResponse('1', medicationId, callSid);
    
    res.type('text/xml');
    res.send(twimlResponse);
  } catch (error) {
    console.error('Error simulating patient press 1:', error);
    res.status(500).json({
      success: false,
      message: 'Error simulating patient press 1',
      error: error.message
    });
  }
});

/**
 * Simulate patient pressing 2 (snooze - reminder in 10 minutes)
 */
app.post('/api/test/simulate-patient-press-2/:medicationId', async (req, res) => {
  try {
    const { medicationId } = req.params;
    
    // Import the Twilio service
    const twilioServiceModule = await import('./services/twilioService.js');
    const twilioService = twilioServiceModule.default;
    
    // Simulate the patient pressing 2
    // Use a proper call SID format for testing
    const callSid = `SIM_TEST_${Date.now()}`;
    const twimlResponse = await twilioService.handlePatientResponse('2', medicationId, callSid);
    
    res.type('text/xml');
    res.send(twimlResponse);
  } catch (error) {
    console.error('Error simulating patient press 2:', error);
    res.status(500).json({
      success: false,
      message: 'Error simulating patient press 2',
      error: error.message
    });
  }
});

/**
 * Simulate missed medication (doctor notification)
 */
app.post('/api/test/simulate-missed-medication/:medicationId', async (req, res) => {
  try {
    const { medicationId } = req.params;
    
    // Get medication with patient populated
    const medication = await Medication.findById(medicationId).populate('patient');
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }
    
    if (!medication.patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Import the doctor notification service
    const doctorNotificationService = (await import('./services/doctorNotificationService.js')).default;
    
    // Use dummy doctor info for testing
    const doctorInfo = {
      name: 'Dr. Smith',
      phone: '+1234567890', // This is a dummy number for testing
      email: 'dr.smith@example.com'
    };
    
    // Notify doctor (this will be simulated since we don't have real credentials)
    try {
      await doctorNotificationService.notifyDoctorForMissedMedication(medication, medication.patient, doctorInfo);
    } catch (error) {
      console.log('⚠️  Doctor notification would be sent in production (simulated in test mode)');
      console.log(`   Medication: ${medication.name}`);
      console.log(`   Patient: ${medication.patient.name}`);
      console.log(`   Doctor: ${doctorInfo.name}`);
    }
    
    res.json({
      success: true,
      message: `Doctor notified for missed medication: ${medication.name} (simulated)`,
      simulated: true
    });
  } catch (error) {
    console.error('Error simulating missed medication:', error);
    res.status(500).json({
      success: false,
      message: 'Error simulating missed medication',
      error: error.message
    });
  }
});

/**
 * Get scheduler status
 */
app.get('/api/scheduler/status', async (req, res) => {
  try {
    // Import scheduler service to check status
    const schedulerModule = await import('./services/schedulerService.js');
    const schedulerService = schedulerModule.default;
    const status = schedulerService.getStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting scheduler status',
      error: error.message
    });
  }
});

/**
 * Manually trigger scheduler check (for testing)
 */
app.post('/api/scheduler/trigger-check', async (req, res) => {
  try {
    // Import scheduler service
    const schedulerModule = await import('./services/schedulerService.js');
    const schedulerService = schedulerModule.default;
    const result = await schedulerService.triggerCheck();
    res.json(result);
  } catch (error) {
    console.error('Error triggering scheduler check:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering scheduler check',
      error: error.message
    });
  }
});

/**
 * Get call logs
 */
app.get('/api/call-logs', async (req, res) => {
  try {
    const { patientId, limit = 50 } = req.query;

    let query = {};
    if (patientId) {
      const patient = await Patient.findOne({ patientId });
      if (patient) {
        query.patient = patient._id;
      }
    }

    const callLogs = await CallLog.find(query)
      .populate('patient', 'name patientId mobile')
      .populate('medication', 'name dosage customTime')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      callLogs
    });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching call logs',
      error: error.message
    });
  }
});

// ==================== ADMIN ROUTES ====================

/**
 * Admin login
 */
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // For demo purposes, we'll use a simple check
    // In production, you would check against a database
    const validAdmin = username === 'admin' && password === 'admin123';
    
    if (!validAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: 'admin-1',
        username: 'admin',
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
});

/**
 * Get all doctors (admin only)
 */
app.get('/api/admin/doctors', async (req, res) => {
  try {
    // In a real implementation, you would authenticate the admin
    // For now, we'll return a basic response
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
});

/**
 * Create a new doctor (admin only)
 */
app.post('/api/admin/doctors', async (req, res) => {
  try {
    // In a real implementation, you would authenticate the admin and create a doctor
    // For now, we'll return a basic response
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating doctor',
      error: error.message
    });
  }
});

/**
 * Get all patients (admin only)
 */
app.get('/api/admin/patients', async (req, res) => {
  try {
    // In a real implementation, you would authenticate the admin
    // For now, we'll return a basic response
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
});

/**
 * Create a new patient (admin only)
 */
app.post('/api/admin/patients', async (req, res) => {
  try {
    // In a real implementation, you would authenticate the admin and create a patient
    // For now, we'll return a basic response
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating patient',
      error: error.message
    });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  // Import scheduler service to check status
  import('./services/schedulerService.js').then((schedulerModule) => {
    const schedulerService = schedulerModule.default;
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      scheduler: schedulerService.getStatus()
    });
  }).catch((error) => {
    console.error('Error importing scheduler service:', error);
    res.status(500).json({
      status: 'ERROR',
      error: 'Could not load scheduler service'
    });
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'GoldenCare Buddy Backend API',
    version: '1.0.0',
    endpoints: {
      patients: '/api/patients',
      medications: '/api/medications',
      callLogs: '/api/call-logs',
      health: '/health'
    }
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 GoldenCare Buddy Backend Server`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`\n📞 Twilio Status: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configured' : '⚠️  Not configured (simulation mode)'}`);
  console.log(`🤖 Gemini AI Status: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '⚠️  Not configured'}`);
  
  // Import scheduler service to check status
  const schedulerModule = await import('./services/schedulerService.js');
  const schedulerService = schedulerModule.default;
  console.log(`\n⏰ Medication Scheduler: ${schedulerService.isRunning ? '✅ Running' : '❌ Stopped'}`);
  console.log(`\n💡 Ready to make AI voice calls!\n`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  const schedulerModule = await import('./services/schedulerService.js');
  const schedulerService = schedulerModule.default;
  schedulerService.stop();
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
