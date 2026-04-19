import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/goldencare-buddy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  // Import models after connection
  import('./goldencare-buddy-backend/models/Doctor.js').then((DoctorModule) => {
    const Doctor = DoctorModule.default;
    
    // Test finding the default doctor
    Doctor.findOne({ doctorId: 'DOC001' })
      .then(doctor => {
        console.log('Doctor found:', doctor);
        process.exit(0);
      })
      .catch(err => {
        console.error('Error finding doctor:', err);
        process.exit(1);
      });
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
