import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import Patient from './goldencare-buddy-backend/models/Patient.js';
import Medication from './goldencare-buddy-backend/models/Medication.js';

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/goldencare-buddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Find the patient
    const patient = await Patient.findOne({ patientId: 'vans0390600' });
    console.log('Patient found:', patient);
    
    if (patient) {
      // Find medications for this patient
      const medications = await Medication.find({ patient: patient._id });
      console.log('Medications found:', medications);
      
      // Also try to find all medications to see what's in the database
      const allMedications = await Medication.find({});
      console.log('All medications in database:', allMedications);
    } else {
      console.log('Patient not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});