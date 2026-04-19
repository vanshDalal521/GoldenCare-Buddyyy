import express from 'express';
import multer from 'multer';
import medicalRecordService from '../services/medicalRecordService.js';
import { authenticateToken, authorizePatient, authorizeDoctor } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common medical document types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and Word documents are allowed.'));
    }
  }
});

// Patient uploads a medical record
router.post('/patient/upload', 
  authenticateToken, 
  authorizePatient, 
  upload.single('file'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const recordData = {
        title: req.body.title,
        description: req.body.description,
        recordType: req.body.recordType,
        patient: req.user.id,
        uploadedBy: 'patient',
        uploadedById: req.user.id
      };
      
      const record = await medicalRecordService.createRecord(recordData, req.file);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Doctor uploads a medical record for a patient
router.post('/doctor/upload', 
  authenticateToken, 
  authorizeDoctor, 
  upload.single('file'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const recordData = {
        title: req.body.title,
        description: req.body.description,
        recordType: req.body.recordType,
        patient: req.body.patientId,
        doctor: req.user.id,
        uploadedBy: 'doctor',
        uploadedById: req.user.id
      };
      
      const record = await medicalRecordService.createRecord(recordData, req.file);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all records for a patient (patient view)
router.get('/patient', authenticateToken, authorizePatient, async (req, res) => {
  try {
    const records = await medicalRecordService.getPatientRecords(req.user.patientId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all records for a doctor's patients
router.get('/doctor', authenticateToken, authorizeDoctor, async (req, res) => {
  try {
    const records = await medicalRecordService.getDoctorPatientRecords(req.user.id);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific record by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const record = await medicalRecordService.getRecordById(req.params.id);
    
    // Check if user has permission to view this record
    if (req.user.role === 'patient' && record.patientId !== req.user.patientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && !record.doctor && record.patient.doctors.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(record);
  } catch (error) {
    if (error.message === 'Medical record not found') {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete a record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await medicalRecordService.deleteRecord(
      req.params.id, 
      req.user.id, 
      req.user.role
    );
    res.json(result);
  } catch (error) {
    if (error.message === 'Medical record not found') {
      return res.status(404).json({ error: 'Record not found' });
    }
    if (error.message === 'Permission denied') {
      return res.status(403).json({ error: 'Permission denied' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update record visibility
router.patch('/:id/visibility', authenticateToken, async (req, res) => {
  try {
    const { isPublic } = req.body;
    const record = await medicalRecordService.updateRecordVisibility(
      req.params.id,
      isPublic,
      req.user.id,
      req.user.role
    );
    res.json(record);
  } catch (error) {
    if (error.message === 'Medical record not found') {
      return res.status(404).json({ error: 'Record not found' });
    }
    if (error.message === 'Permission denied') {
      return res.status(403).json({ error: 'Permission denied' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Download a record file
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const record = await medicalRecordService.getRecordById(req.params.id);
    
    // Check if user has permission to download this record
    if (req.user.role === 'patient' && record.patientId !== req.user.patientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (req.user.role === 'doctor' && !record.doctor && record.patient.doctors.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if file exists
    if (!require('fs').existsSync(record.filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', record.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${record.fileName}"`);
    
    // Stream the file
    const fileStream = require('fs').createReadStream(record.filePath);
    fileStream.pipe(res);
    
    // Handle stream errors
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  } catch (error) {
    if (error.message === 'Medical record not found') {
      return res.status(404).json({ error: 'Record not found' });
    }
    console.error('Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze a medical record using AI
router.post('/:id/analyze', authenticateToken, authorizePatient, async (req, res) => {
  try {
    const record = await medicalRecordService.getRecordById(req.params.id);
    
    // Check if user has permission to analyze this record
    if (record.patientId !== req.user.patientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const analyzedRecord = await medicalRecordService.analyzeRecord(req.params.id);
    res.json(analyzedRecord);
  } catch (error) {
    if (error.message === 'Medical record not found') {
      return res.status(404).json({ error: 'Record not found' });
    }
    console.error('AI Analysis Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;