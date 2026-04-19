import bcrypt from 'bcrypt';
import * as sqliteService from '../database/sqliteService.js';

async function initDatabase() {
  try {
    console.log('Initializing database...');
    // Initialize database
    await sqliteService.initializeDatabase();
    
    console.log('✅ Database initialized');
    
    // Create a default doctor
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('doctor123', salt);
    
    const doctorData = {
      name: 'Dr. Smith',
      email: 'dr.smith@hospital.com',
      doctorId: 'DOC001',
      password: hashedPassword,
      specialization: 'General Physician',
      licenseNumber: 'DOC_LICENSE_001',
      yearsOfExperience: 10,
      mobile: '9876543210',
      countryCode: '+91',
      isVerified: true,
      isActive: true
    };
    
    try {
      const doctor = await sqliteService.createDoctor(doctorData);
      console.log('✅ Default doctor created:', doctor.name);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('ℹ️  Default doctor already exists');
      } else {
        throw error;
      }
    }
    
    // Create a default patient
    const patientSalt = await bcrypt.genSalt(10);
    const patientHashedPassword = await bcrypt.hash('patient123', patientSalt);
    
    const patientData = {
      name: 'John Doe',
      patientId: 'PAT001',
      password: patientHashedPassword,
      mobile: '9876543211',
      countryCode: '+91',
      isActive: true
    };
    
    try {
      const patient = await sqliteService.createPatient(patientData);
      console.log('✅ Default patient created:', patient.name);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        console.log('ℹ️  Default patient already exists');
      } else {
        throw error;
      }
    }
    
    // Assign patient to doctor
    try {
      await sqliteService.assignPatientToDoctor('DOC001', 'PAT001');
      console.log('✅ Patient assigned to doctor');
    } catch (error) {
      console.log('ℹ️  Patient-doctor assignment already exists or failed:', error.message);
    }
    
    console.log('✅ Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

console.log('Starting database initialization...');
initDatabase();