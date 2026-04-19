import mongoose from 'mongoose';
import Patient from './goldencare-buddy-backend/models/Patient.js';
import Doctor from './goldencare-buddy-backend/models/Doctor.js';

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/goldencare_buddy';

async function testRelationship() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find a test doctor
    const doctor = await Doctor.findOne({ doctorId: 'DOC001' });
    console.log('Found doctor:', doctor?.name, doctor?.doctorId);
    console.log('Doctor patients array:', doctor?.patients);
    
    // Find a test patient
    const patient = await Patient.findOne({ patientId: 'PAT001' });
    console.log('Found patient:', patient?.name, patient?.patientId);
    console.log('Patient doctors array:', patient?.doctors);
    
    if (doctor && patient) {
      console.log('Doctor ID:', doctor._id.toString());
      console.log('Patient ID:', patient._id.toString());
      console.log('Patient assigned to doctor:', patient.doctors.includes(doctor._id));
      console.log('Doctor assigned to patient:', doctor.patients.includes(patient._id));
    }
  } catch (error) {
    console.error('Error testing relationship:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

testRelationship();