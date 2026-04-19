// Test script to verify token storage and retrieval
console.log('=== Token Storage Test ===');

// Check what's in localStorage
const patientSession = localStorage.getItem('gc_patient_session');
console.log('Raw patient session from localStorage:', patientSession);

if (patientSession) {
  try {
    const parsedSession = JSON.parse(patientSession);
    console.log('Parsed session:', parsedSession);
    console.log('Token in session:', parsedSession.token);
    console.log('Token type:', typeof parsedSession.token);
  } catch (error) {
    console.error('Error parsing session:', error);
  }
} else {
  console.log('No patient session found in localStorage');
}

// Test the medical record service getToken method
import medicalRecordService from './goldencare-buddy-react/src/services/medicalRecordService';

console.log('Testing medicalRecordService.getToken():');
const token = medicalRecordService.getToken();
console.log('Token from service:', token);