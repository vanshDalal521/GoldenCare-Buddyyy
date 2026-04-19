import mongoose from 'mongoose';
import Medication from './goldencare-buddy-backend/models/Medication.js';
import Patient from './goldencare-buddy-backend/models/Patient.js';
import Doctor from './goldencare-buddy-backend/models/Doctor.js';

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/goldencare_buddy';

async function testMedicationCreation() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find a test patient
    const patient = await Patient.findOne({ patientId: 'PAT001' });
    console.log('Found patient:', patient);
    
    if (!patient) {
      console.log('No patient found with patientId PAT001');
      return;
    }
    
    // Create a test medication
    const medicationData = {
      patient: patient._id,
      name: 'Test Medication',
      dosage: '500mg',
      pillCount: 1,
      customTime: '08:30 AM',
      slot: 'Morning',
      frequency: 'Once daily',
      notes: 'Test notes',
      prescribedBy: 'Dr. Smith'
    };
    
    console.log('Creating medication with data:', medicationData);
    
    const medication = new Medication(medicationData);
    await medication.save();
    
    console.log('Medication created successfully:', medication);
  } catch (error) {
    console.error('Error creating medication:', error);
    console.error('Error stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

testMedicationCreation();