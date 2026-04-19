/**
 * Script to register a test doctor account with documents for testing
 */

// Import required modules
import fetch from 'node-fetch';

async function registerTestDoctor() {
  try {
    console.log('Registering test doctor account...');
    
    const response = await fetch('http://localhost:3001/api/doctors/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Dr. Sarah Johnson',
        email: 'dr.sarah@example.com',
        doctorId: 'DOC002',
        password: 'securepassword123',
        specialization: 'Pediatrics',
        licenseNumber: 'PED789012',
        yearsOfExperience: 8,
        mobile: '9876543211',
        countryCode: '+1',
        documents: [
          {
            type: 'Medical License',
            fileName: 'medical_license.pdf',
            fileUrl: 'https://example.com/documents/medical_license.pdf'
          },
          {
            type: 'Degree Certificate',
            fileName: 'md_certificate.pdf',
            fileUrl: 'https://example.com/documents/md_certificate.pdf'
          }
        ]
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Test doctor registered successfully!');
      console.log('Doctor ID: DOC002');
      console.log('Password: securepassword123');
      console.log('Verification status: Awaiting AI and admin verification');
      console.log('\nNext steps:');
      console.log('1. The AI verification will run automatically');
      console.log('2. An admin needs to manually verify the doctor');
      console.log('3. Once both verifications pass, the doctor can log in');
    } else {
      console.log('ℹ️  Registration response:', data.message);
      console.log('Doctor ID: DOC002');
      console.log('Password: securepassword123');
    }
  } catch (error) {
    console.error('Error registering test doctor:', error.message);
    console.log('Make sure the backend server is running on port 3001');
    console.log('Doctor ID: DOC002');
    console.log('Password: securepassword123');
  }
}

// Run the function
registerTestDoctor();