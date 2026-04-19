/**
 * Doctor Service
 * Handles doctor-specific business logic
 */

import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Medication from '../models/Medication.js';
import aiVerificationService from './aiVerificationService.js';

class DoctorService {
  /**
   * Register a new doctor
   */
  async registerDoctor(doctorData) {
    try {
      // Check if doctor already exists
      const existingDoctor = await Doctor.findOne({ 
        $or: [{ email: doctorData.email }, { doctorId: doctorData.doctorId }, { licenseNumber: doctorData.licenseNumber }] 
      });
      
      if (existingDoctor) {
        throw new Error('Doctor with this email, doctor ID, or license number already exists');
      }

      // Create new doctor (not verified by default)
      const doctor = new Doctor({
        ...doctorData,
        isVerified: false,
        verificationRequestedAt: new Date(),
        aiVerification: {
          status: 'pending'
        },
        adminVerification: {
          status: 'pending'
        }
      });

      await doctor.save();
      
      // Trigger AI verification asynchronously
      this.triggerAIVerification(doctor._id);
      
      return { success: true, doctor };
    } catch (error) {
      throw new Error(`Error registering doctor: ${error.message}`);
    }
  }
  
  /**
   * Trigger AI verification for a doctor
   */
  async triggerAIVerification(doctorId) {
    try {
      // Don't block the main registration process
      setImmediate(async () => {
        try {
          const doctor = await Doctor.findById(doctorId);
          if (!doctor) return;
          
          // Perform AI verification
          const aiResult = await aiVerificationService.verifyDoctorDocuments(doctor);
          
          // Update doctor with AI verification result
          doctor.aiVerification = {
            ...doctor.aiVerification,
            ...aiResult
          };
          
          // If AI verified and admin also verified, mark as fully verified
          if (aiResult.status === 'verified' && doctor.adminVerification.status === 'verified') {
            doctor.isVerified = true;
            doctor.verifiedAt = new Date();
          }
          
          await doctor.save();
          
          console.log(`✅ AI verification completed for doctor ${doctor.name}`);
        } catch (error) {
          console.error('Error in AI verification:', error);
        }
      });
    } catch (error) {
      console.error('Error triggering AI verification:', error);
    }
  }

  /**
   * Assign a patient to a doctor
   */
  async assignPatient(doctorId, patientId) {
    try {
      // Find doctor and patient
      const doctor = await Doctor.findOne({ doctorId });
      // Look for patient by patientId instead of _id
      const patient = await Patient.findOne({ patientId });
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      // Add doctor to patient's doctors array if not already present
      if (!patient.doctors.includes(doctor._id)) {
        patient.doctors.push(doctor._id);
        await patient.save();
      }
      
      // Add patient to doctor's patients array if not already present
      if (!doctor.patients.includes(patient._id)) {
        doctor.patients.push(patient._id);
        await doctor.save();
      }
      
      return { success: true, patient, doctor };
    } catch (error) {
      throw new Error(`Error assigning patient: ${error.message}`);
    }
  }

  /**
   * Remove a patient from a doctor's list
   */
  async removePatient(doctorId, patientId) {
    try {
      // Find doctor and patient
      const doctor = await Doctor.findOne({ doctorId });
      const patient = await Patient.findOne({ patientId });
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      // Remove doctor from patient's doctors array
      patient.doctors = patient.doctors.filter(docId => !docId.equals(doctor._id));
      await patient.save();
      
      // Remove patient from doctor's patients array
      doctor.patients = doctor.patients.filter(patId => !patId.equals(patient._id));
      await doctor.save();
      
      return { success: true, message: 'Patient removed successfully' };
    } catch (error) {
      throw new Error(`Error removing patient: ${error.message}`);
    }
  }

  /**
   * Get all patients assigned to a doctor
   */
  async getAssignedPatients(doctorId) {
    try {
      const doctor = await Doctor.findOne({ doctorId }).populate('patients');
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      // Return patients with sensitive data removed
      const patients = doctor.patients.map(patient => ({
        _id: patient._id,
        name: patient.name,
        patientId: patient.patientId,
        mobile: patient.mobile,
        fullMobile: patient.fullMobile,
        createdAt: patient.createdAt,
        lastLoginAt: patient.lastLoginAt
      }));
      
      return patients;
    } catch (error) {
      throw new Error(`Error fetching assigned patients: ${error.message}`);
    }
  }

  /**
   * Add medication for a patient
   */
  async addMedication(doctorId, medicationData) {
    try {
      console.log('DoctorService.addMedication called with:', { doctorId, medicationData });
      
      // Validate input data
      if (!medicationData) {
        throw new Error('Medication data is required');
      }
      
      if (!doctorId) {
        throw new Error('Doctor ID is required');
      }
      
      // Log the exact data received
      console.log('Received medication data:', JSON.stringify(medicationData, null, 2));
      
      const doctor = await Doctor.findOne({ doctorId });
      console.log('Found doctor:', doctor);
      
      if (!doctor) {
        const error = new Error('Doctor not found');
        error.code = 'DOCTOR_NOT_FOUND';
        throw error;
      }
      
      // Verify that the patient is assigned to this doctor
      const patient = await Patient.findOne({ patientId: medicationData.patientId });
      console.log('Found patient:', patient);
      
      if (!patient) {
        const error = new Error('Patient not found');
        error.code = 'PATIENT_NOT_FOUND';
        throw error;
      }
      
      console.log('Doctor ID:', doctor._id);
      console.log('Patient doctors array:', patient.doctors);
      
      // Convert doctor._id to string for comparison
      const doctorIdStr = doctor._id.toString();
      const isAssigned = patient.doctors.some(docId => docId.toString() === doctorIdStr);
      console.log('Patient assigned to doctor:', isAssigned);
      
      if (!isAssigned) {
        const error = new Error('Patient is not assigned to this doctor');
        error.code = 'PATIENT_NOT_ASSIGNED';
        throw error;
      }
      
      // Validate and format time if needed
      let customTime = medicationData.customTime;
      if (customTime) {
        try {
          // Convert 24-hour format to 12-hour format if needed
          customTime = this.formatTimeTo12Hour(customTime);
        } catch (formatError) {
          console.error('Error formatting time:', formatError);
          // If formatting fails, use the original time
          customTime = medicationData.customTime;
        }
      }
      
      console.log('Creating medication with formatted time:', customTime);
      
      // Validate required fields
      if (!medicationData.name || !medicationData.name.trim()) {
        const error = new Error('Medication name is required');
        error.code = 'MISSING_NAME';
        throw error;
      }
      
      if (!medicationData.dosage || !medicationData.dosage.trim()) {
        const error = new Error('Medication dosage is required');
        error.code = 'MISSING_DOSAGE';
        throw error;
      }
      
      if (!customTime || !customTime.trim()) {
        const error = new Error('Medication time is required');
        error.code = 'MISSING_TIME';
        throw error;
      }
      
      if (!medicationData.slot) {
        const error = new Error('Medication slot is required');
        error.code = 'MISSING_SLOT';
        throw error;
      }
      
      if (!medicationData.prescribedBy || !medicationData.prescribedBy.trim()) {
        const error = new Error('Prescribed by is required');
        error.code = 'MISSING_PRESCRIBED_BY';
        throw error;
      }
      
      // Create medication
      const medication = new Medication({
        patient: patient._id,
        name: medicationData.name.trim(),
        dosage: medicationData.dosage.trim(),
        pillCount: parseInt(medicationData.pillCount) || 1,
        customTime: customTime.trim(),
        slot: medicationData.slot,
        frequency: medicationData.frequency || 'Once daily',
        notes: medicationData.notes,
        prescribedBy: medicationData.prescribedBy.trim()
      });
      
      console.log('Medication object created:', medication);
      
      await medication.save();
      
      console.log('Medication saved successfully:', medication);
      
      return { success: true, medication };
    } catch (error) {
      console.error('DoctorService.addMedication error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error stack:', error.stack);
      
      // Provide more specific error messages
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw new Error(`Validation error: ${messages.join(', ')}`);
      }
      
      // Re-throw specific errors with their codes
      if (error.code) {
        throw error;
      }
      
      throw new Error(`Error adding medication: ${error.message}`);
    }
  }
  
  /**
   * Format time to 12-hour format (HH:MM AM/PM)
   */
  formatTimeTo12Hour(timeString) {
    console.log('Formatting time:', timeString);
    
    // Handle null or undefined
    if (!timeString) {
      console.log('Time string is null or undefined, returning as is');
      return timeString;
    }
    
    // Convert to string if it's not already
    const timeStr = String(timeString).trim();
    
    // If empty string, return as is
    if (timeStr === '') {
      console.log('Time string is empty, returning as is');
      return timeStr;
    }
    
    // If already in correct format, return as is
    if (/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(timeStr)) {
      console.log('Time already in correct 12-hour format');
      return timeStr;
    }
    
    // Convert 24-hour format to 12-hour format
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const result = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      console.log('Converted 24-hour to 12-hour format:', result);
      return result;
    }
    
    // Handle single digit hours (e.g., "8:00" -> "8:00 AM")
    if (/^[0-9]:[0-5][0-9]$/.test(timeStr)) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const result = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      console.log('Converted single digit hour to 12-hour format:', result);
      return result;
    }
    
    // If format is not recognized, return as is to avoid breaking the process
    console.log('Time format not recognized, returning as is to avoid breaking the process');
    return timeStr;
  }

  /**
   * Get all medications for a patient assigned to a doctor
   */
  async getPatientMedications(doctorId, patientId) {
    try {
      const doctor = await Doctor.findOne({ doctorId });
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      // Verify that the patient is assigned to this doctor
      const patient = await Patient.findOne({ patientId });
      
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      // Convert doctor._id to string for comparison
      const doctorIdStr = doctor._id.toString();
      const isAssigned = patient.doctors.some(docId => docId.toString() === doctorIdStr);
      
      if (!isAssigned) {
        throw new Error('Patient is not assigned to this doctor');
      }
      
      // Get medications
      const medications = await Medication.find({
        patient: patient._id,
        isActive: true
      }).sort({ customTime: 1 });
      
      return medications;
    } catch (error) {
      throw new Error(`Error fetching medications: ${error.message}`);
    }
  }
  
  /**
   * Manually verify a doctor (admin only)
   */
  async manualVerifyDoctor(doctorId, adminId) {
    try {
      const doctor = await Doctor.findOne({ doctorId });
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      // Update admin verification status
      doctor.adminVerification = {
        status: 'verified',
        verifiedBy: adminId,
        verifiedAt: new Date()
      };
      
      // If AI also verified, mark as fully verified
      if (doctor.aiVerification.status === 'verified') {
        doctor.isVerified = true;
        doctor.verifiedAt = new Date();
      }
      
      await doctor.save();
      
      return { success: true, doctor };
    } catch (error) {
      throw new Error(`Error verifying doctor: ${error.message}`);
    }
  }
  
  /**
   * Get all doctors awaiting verification
   */
  async getPendingDoctors() {
    try {
      const doctors = await Doctor.find({
        $or: [
          { 'aiVerification.status': 'pending' },
          { 'adminVerification.status': 'pending' }
        ]
      }).select('-password');
      
      return doctors;
    } catch (error) {
      throw new Error(`Error fetching pending doctors: ${error.message}`);
    }
  }
}

export default new DoctorService();