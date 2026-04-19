/**
 * Script to manually verify the test doctor account
 */

// Import required modules
import fetch from 'node-fetch';

async function verifyTestDoctor() {
  try {
    console.log('Manually verifying test doctor account...');
    
    const response = await fetch('http://localhost:3001/api/doctors/DOC002/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId: 'admin_123' // In a real implementation, this would be the actual admin ID
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Test doctor verified successfully!');
      console.log('Doctor ID: DOC002');
      console.log('Password: securepassword123');
      console.log('You can now log in as this doctor.');
    } else {
      console.log('ℹ️  Verification response:', data.message);
    }
  } catch (error) {
    console.error('Error verifying test doctor:', error.message);
    console.log('Make sure the backend server is running on port 3001');
  }
}

// Run the function
verifyTestDoctor();