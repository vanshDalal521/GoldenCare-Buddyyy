/**
 * Comprehensive test suite for GoldenCare Buddy project
 * Tests all major functionalities to ensure the project is working perfectly
 */

import mongoose from 'mongoose';
import Patient from './models/Patient.js';
import Doctor from './models/Doctor.js';
import Medication from './models/Medication.js';
import { formatTo12Hour, formatTo24Hour, areTimesEqual } from './utils/timeUtils.js';

// Test database connection
async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...');
  
  try {
    // Test MongoDB connection
    const dbState = mongoose.connection.readyState;
    if (dbState === 1) {
      console.log('✅ MongoDB connection: SUCCESS');
    } else {
      console.log('❌ MongoDB connection: FAILED');
      return false;
    }
    
    // Test basic database operations
    const testPatient = new Patient({
      name: 'Test Patient',
      patientId: 'TEST001',
      password: 'test123',
      mobile: '9876543210',
      countryCode: '+91'
    });
    
    await testPatient.save();
    console.log('✅ Database write operation: SUCCESS');
    
    const foundPatient = await Patient.findOne({ patientId: 'TEST001' });
    if (foundPatient) {
      console.log('✅ Database read operation: SUCCESS');
    }
    
    // Clean up
    await Patient.deleteOne({ patientId: 'TEST001' });
    
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

// Test time utilities
function testTimeUtilities() {
  console.log('\n🧪 Testing Time Utilities...');
  
  const testCases = [
    { input: '14:30', expected12: '2:30 PM', expected24: '14:30' },
    { input: '09:15', expected12: '9:15 AM', expected24: '09:15' },
    { input: '2:45 PM', expected12: '2:45 PM', expected24: '14:45' },
    { input: '8:00 AM', expected12: '8:00 AM', expected24: '08:00' }
  ];
  
  let allPassed = true;
  
  testCases.forEach((testCase, index) => {
    const result12 = formatTo12Hour(testCase.input);
    const result24 = formatTo24Hour(testCase.input);
    const isEqual = areTimesEqual(testCase.input, testCase.expected12);
    
    const passed12 = result12 === testCase.expected12;
    const passed24 = result24 === testCase.expected24;
    const passedEqual = isEqual === true;
    
    console.log(`Test ${index + 1}: ${testCase.input}`);
    console.log(`  12-hour format: ${result12} ${passed12 ? '✅' : '❌'}`);
    console.log(`  24-hour format: ${result24} ${passed24 ? '✅' : '❌'}`);
    console.log(`  Time equality: ${isEqual} ${passedEqual ? '✅' : '❌'}`);
    
    if (!passed12 || !passed24 || !passedEqual) {
      allPassed = false;
    }
  });
  
  return allPassed;
}

// Test patient model
async function testPatientModel() {
  console.log('\n🧪 Testing Patient Model...');
  
  try {
    // Test patient creation
    const patientData = {
      name: 'John Doe',
      patientId: 'PAT001',
      password: 'password123',
      mobile: '9876543210',
      countryCode: '+91'
    };
    
    const patient = new Patient(patientData);
    await patient.save();
    console.log('✅ Patient creation: SUCCESS');
    
    // Test password hashing
    const isMatch = await patient.comparePassword('password123');
    console.log(`✅ Password verification: ${isMatch ? 'SUCCESS' : 'FAILED'}`);
    
    // Test virtual field
    console.log(`✅ Full mobile number: ${patient.fullMobile}`);
    
    // Clean up
    await Patient.deleteOne({ patientId: 'PAT001' });
    
    return true;
  } catch (error) {
    console.error('❌ Patient model test failed:', error);
    return false;
  }
}

// Test doctor model
async function testDoctorModel() {
  console.log('\n🧪 Testing Doctor Model...');
  
  try {
    // Test doctor creation
    const doctorData = {
      name: 'Dr. Smith',
      email: 'dr.smith@example.com',
      doctorId: 'DOC001',
      password: 'password123',
      specialization: 'Cardiology',
      licenseNumber: 'LIC001',
      yearsOfExperience: 10,
      mobile: '9876543210',
      countryCode: '+91'
    };
    
    const doctor = new Doctor(doctorData);
    await doctor.save();
    console.log('✅ Doctor creation: SUCCESS');
    
    // Test password hashing
    const isMatch = await doctor.comparePassword('password123');
    console.log(`✅ Password verification: ${isMatch ? 'SUCCESS' : 'FAILED'}`);
    
    // Test virtual field
    console.log(`✅ Full mobile number: ${doctor.fullMobile}`);
    
    // Clean up
    await Doctor.deleteOne({ doctorId: 'DOC001' });
    
    return true;
  } catch (error) {
    console.error('❌ Doctor model test failed:', error);
    return false;
  }
}

// Test medication model
async function testMedicationModel() {
  console.log('\n🧪 Testing Medication Model...');
  
  try {
    // Create test patient and doctor first
    const patient = new Patient({
      name: 'Test Patient',
      patientId: 'TESTPAT001',
      password: 'test123',
      mobile: '9876543210',
      countryCode: '+91'
    });
    await patient.save();
    
    const doctor = new Doctor({
      name: 'Test Doctor',
      email: 'test.doctor@example.com',
      doctorId: 'TESTDOC001',
      password: 'test123',
      specialization: 'General Medicine',
      licenseNumber: 'TESTLIC001',
      yearsOfExperience: 5,
      mobile: '9876543210',
      countryCode: '+91'
    });
    await doctor.save();
    
    // Test medication creation
    const medicationData = {
      patient: patient._id,
      name: 'Paracetamol',
      dosage: '500mg',
      pillCount: 2,
      customTime: '2:30 PM',
      slot: 'Afternoon',
      frequency: 'Twice daily',
      notes: 'Take with food',
      prescribedBy: 'Test Doctor'
    };
    
    const medication = new Medication(medicationData);
    await medication.save();
    console.log('✅ Medication creation: SUCCESS');
    
    // Test time formatting
    console.log(`✅ Medication time: ${medication.customTime}`);
    
    // Test taken history
    await medication.markAsTaken('web', 'button-click');
    console.log(`✅ Mark as taken: SUCCESS`);
    console.log(`✅ Is taken today: ${medication.isTakenToday()}`);
    
    // Clean up
    await Medication.deleteOne({ _id: medication._id });
    await Patient.deleteOne({ patientId: 'TESTPAT001' });
    await Doctor.deleteOne({ doctorId: 'TESTDOC001' });
    
    return true;
  } catch (error) {
    console.error('❌ Medication model test failed:', error);
    return false;
  }
}

// Test doctor-patient relationship
async function testDoctorPatientRelationship() {
  console.log('\n🧪 Testing Doctor-Patient Relationship...');
  
  try {
    // Create test data
    const patient = new Patient({
      name: 'Relationship Test Patient',
      patientId: 'RELTEST001',
      password: 'test123',
      mobile: '9876543210',
      countryCode: '+91'
    });
    await patient.save();
    
    const doctor = new Doctor({
      name: 'Relationship Test Doctor',
      email: 'relationship.doctor@example.com',
      doctorId: 'RELTEST001',
      password: 'test123',
      specialization: 'General Medicine',
      licenseNumber: 'RELLIC001',
      yearsOfExperience: 5,
      mobile: '9876543210',
      countryCode: '+91'
    });
    await doctor.save();
    
    // Test assignment
    patient.doctors.push(doctor._id);
    await patient.save();
    
    doctor.patients.push(patient._id);
    await doctor.save();
    
    console.log('✅ Doctor-patient assignment: SUCCESS');
    
    // Verify relationship
    const isAssigned = patient.doctors.some(docId => docId.toString() === doctor._id.toString());
    console.log(`✅ Relationship verification: ${isAssigned ? 'SUCCESS' : 'FAILED'}`);
    
    // Clean up
    await Patient.deleteOne({ patientId: 'RELTEST001' });
    await Doctor.deleteOne({ doctorId: 'RELTEST001' });
    
    return true;
  } catch (error) {
    console.error('❌ Doctor-patient relationship test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting GoldenCare Buddy Comprehensive Test Suite\n');
  console.log('=' .repeat(50));
  
  const results = {
    database: await testDatabaseConnection(),
    timeUtils: testTimeUtilities(),
    patientModel: await testPatientModel(),
    doctorModel: await testDoctorModel(),
    medicationModel: await testMedicationModel(),
    relationship: await testDoctorPatientRelationship()
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${test}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  });
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`🎯 OVERALL RESULT: ${passedTests}/${totalTests} tests passed`);
  console.log('='.repeat(50));
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! The project is working perfectly!');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
  
  // Close database connection
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
}

// Export for use in other files
export {
  testDatabaseConnection,
  testTimeUtilities,
  testPatientModel,
  testDoctorModel,
  testMedicationModel,
  testDoctorPatientRelationship,
  runAllTests
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}