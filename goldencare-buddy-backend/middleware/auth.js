import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

// JWT authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Role-based authorization middleware
export const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // If specific roles are required, check them
      if (roles && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${roles.join(' or ')}`
        });
      }

      // Load full user data based on role
      let user;
      if (req.user.role === 'patient') {
        user = await Patient.findById(req.user.id);
      } else if (req.user.role === 'doctor') {
        user = await Doctor.findById(req.user.id);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.currentUser = user;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

// Authorize patient middleware
export const authorizePatient = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Patient role required.'
      });
    }

    // Load patient data
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(401).json({
        success: false,
        message: 'Patient not found'
      });
    }

    req.currentUser = patient;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

// Authorize doctor middleware
export const authorizeDoctor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Doctor role required.'
      });
    }

    // Load doctor data
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    req.currentUser = doctor;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

// Doctor-patient relationship validation
export const validateDoctorPatientRelationship = async (req, res, next) => {
  try {
    const { doctorId, patientId } = req.params;
    
    if (!doctorId || !patientId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and Patient ID are required'
      });
    }

    // Verify the current user is the doctor making the request
    if (req.user.role !== 'doctor' || req.user.doctorId !== doctorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get the doctor
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get the patient
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

    // Attach doctor and patient to request
    req.doctor = doctor;
    req.patient = patient;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error validating relationship'
    });
  }
};