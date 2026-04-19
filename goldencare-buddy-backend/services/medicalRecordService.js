import MedicalRecord from '../models/MedicalRecord.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import fs from 'fs';
import path from 'path';
import aiReportService from './aiReportService.js';

class MedicalRecordService {
  // Create a new medical record
  async createRecord(recordData, file) {
    try {
      // Validate that the patient exists
      let patient;
      try {
        // Try to find by _id first (ObjectId)
        patient = await Patient.findById(recordData.patient);
      } catch (err) {
        // If casting fails, it's likely a custom patientId string
        patient = null;
      }

      if (!patient) {
        // Fallback: search by the custom patientId field
        patient = await Patient.findOne({ patientId: recordData.patient });
      }

      if (!patient) {
        throw new Error(`Patient not found with ID: ${recordData.patient}`);
      }
      
      // If uploaded by doctor, validate doctor exists
      let doctor = null;
      if (recordData.uploadedBy === 'doctor') {
        doctor = await Doctor.findById(recordData.doctor);
        if (!doctor) {
          throw new Error('Doctor not found');
        }
      }
      
      // Create file path
      const uploadDir = path.join(process.cwd(), 'uploads', 'medical-records');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Move file to storage
      fs.writeFileSync(filePath, file.buffer);
      
      // Create record in database
      const newRecord = new MedicalRecord({
        ...recordData,
        patient: patient._id, // Ensure we use the proper ObjectId
        doctor: doctor ? doctor._id : null, // Ensure we use the proper ObjectId
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: filePath,
        patientId: patient.patientId,
        patientName: patient.name,
        doctorName: doctor ? doctor.name : null,
        uploadedByName: recordData.uploadedBy === 'patient' ? patient.name : doctor.name
      });
      
      await newRecord.save();
      
      return newRecord;
    } catch (error) {
      console.error('Create Record Error:', error);
      throw new Error(`Failed to create medical record: ${error.message}`);
    }
  }
  
  // Get all records for a patient
  async getPatientRecords(patientId) {
    try {
      const records = await MedicalRecord.find({ patientId })
        .sort({ uploadedAt: -1 })
        .populate('doctor', 'name');
      
      return records;
    } catch (error) {
      throw new Error(`Failed to fetch patient records: ${error.message}`);
    }
  }
  
  // Get all records for a doctor's patients
  async getDoctorPatientRecords(doctorId) {
    try {
      // First, find all patients assigned to this doctor
      const patients = await Patient.find({ doctors: doctorId });
      const patientIds = patients.map(patient => patient.patientId);
      
      // Then, get all records for those patients
      const records = await MedicalRecord.find({ patientId: { $in: patientIds } })
        .sort({ uploadedAt: -1 })
        .populate('patient', 'name patientId')
        .populate('doctor', 'name');
      
      return records;
    } catch (error) {
      throw new Error(`Failed to fetch doctor's patient records: ${error.message}`);
    }
  }
  
  // Get a specific record by ID
  async getRecordById(recordId) {
    try {
      const record = await MedicalRecord.findById(recordId)
        .populate('patient', 'name patientId')
        .populate('doctor', 'name');
      
      if (!record) {
        throw new Error('Medical record not found');
      }
      
      return record;
    } catch (error) {
      throw new Error(`Failed to fetch medical record: ${error.message}`);
    }
  }
  
  // Delete a record
  async deleteRecord(recordId, userId, userType) {
    try {
      const record = await MedicalRecord.findById(recordId);
      
      if (!record) {
        throw new Error('Medical record not found');
      }
      
      // Check permissions
      if (userType === 'patient' && record.uploadedBy === 'patient' && record.uploadedById !== userId) {
        throw new Error('Permission denied');
      }
      
      if (userType === 'doctor' && record.uploadedBy === 'doctor' && record.uploadedById !== userId) {
        throw new Error('Permission denied');
      }
      
      // Delete file from storage
      if (fs.existsSync(record.filePath)) {
        fs.unlinkSync(record.filePath);
      }
      
      // Delete record from database
      await MedicalRecord.findByIdAndDelete(recordId);
      
      return { success: true, message: 'Record deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete medical record: ${error.message}`);
    }
  }
  
  // Update record visibility
  async updateRecordVisibility(recordId, isPublic, userId, userType) {
    try {
      const record = await MedicalRecord.findById(recordId);
      
      if (!record) {
        throw new Error('Medical record not found');
      }
      
      // Check permissions
      if (record.uploadedById !== userId) {
        throw new Error('Permission denied');
      }
      
      record.isPublic = isPublic;
      record.updatedAt = Date.now();
      
      await record.save();
      
      return record;
    } catch (error) {
      throw new Error(`Failed to update record visibility: ${error.message}`);
    }
  }

  // Analyze a medical record using AI
  async analyzeRecord(recordId) {
    try {
      const record = await MedicalRecord.findById(recordId);
      
      if (!record) {
        throw new Error('Medical record not found');
      }
      
      console.log(`[AI Analysis] Starting analysis for record: ${recordId}`);
      
      // Perform AI analysis
      const analysisResult = await aiReportService.analyzeRecord(record);
      
      // Update record with analysis results
      record.analysisExplanation = analysisResult.explanation;
      record.extractedMedications = analysisResult.medications;
      record.isAnalyzed = true;
      record.updatedAt = Date.now();
      
      await record.save();
      
      console.log(`[AI Analysis] Analysis completed for record: ${recordId}`);
      
      return record;
    } catch (error) {
      console.error('AI Analysis Error in Service:', error);
      throw new Error(`Failed to analyze medical record: ${error.message}`);
    }
  }
}

export default new MedicalRecordService();