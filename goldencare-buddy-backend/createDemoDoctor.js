/**
 * Script: Creates a fully verified demo doctor account directly in MongoDB.
 * Run with: node createDemoDoctor.js
 */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goldencare';
const DOCTOR_ID = 'DOC001';
const EMAIL = 'dr.vansh@goldencare.com';
const PASSWORD = 'Doctor@123';

const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  doctorId: { type: String, unique: true },
  password: String,
  specialization: String,
  licenseNumber: { type: String, unique: true },
  yearsOfExperience: Number,
  mobile: String,
  countryCode: { type: String, default: '+91' },
  documents: [{ type: { type: String }, fileName: String, fileUrl: String, uploadedAt: { type: Date, default: Date.now } }],
  aiVerification: { status: { type: String, default: 'verified' }, verifiedAt: Date },
  adminVerification: { status: { type: String, default: 'verified' }, verifiedAt: Date },
  isVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date
}, { timestamps: true });

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

async function createDemoDoctor() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if doctor already exists
    const existing = await Doctor.findOne({ $or: [{ doctorId: DOCTOR_ID }, { email: EMAIL }] });
    
    if (existing) {
      // Update to make sure it's verified
      existing.isVerified = true;
      existing.aiVerification = { status: 'verified', verifiedAt: new Date() };
      existing.adminVerification = { status: 'verified', verifiedAt: new Date() };
      
      // Update password too
      const salt = await bcrypt.genSalt(10);
      existing.password = await bcrypt.hash(PASSWORD, salt);
      await existing.save();
      
      console.log('\n✅ Existing doctor account updated and verified!\n');
    } else {
      // Create new doctor
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(PASSWORD, salt);
      
      const doctor = new Doctor({
        name: 'Dr. Vansh Dalal',
        email: EMAIL,
        doctorId: DOCTOR_ID,
        password: hashedPassword,
        specialization: 'General Medicine',
        licenseNumber: 'GEN123456',
        yearsOfExperience: 10,
        mobile: '9876543210',
        countryCode: '+91',
        documents: [
          { type: 'Medical License', fileName: 'license.pdf', fileUrl: 'https://example.com/license.pdf' },
          { type: 'Degree Certificate', fileName: 'degree.pdf', fileUrl: 'https://example.com/degree.pdf' }
        ],
        aiVerification: { status: 'verified', verifiedAt: new Date() },
        adminVerification: { status: 'verified', verifiedAt: new Date() },
        isVerified: true,
        isActive: true
      });

      await doctor.save();
      console.log('\n✅ Demo doctor account created successfully!\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🩺  DOCTOR LOGIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Doctor ID  : ${DOCTOR_ID}`);
    console.log(`  Email      : ${EMAIL}`);
    console.log(`  Password   : ${PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Login at: http://localhost:5173/doctor-dashboard');
    console.log('  (Use the Doctor Login page)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDemoDoctor();
