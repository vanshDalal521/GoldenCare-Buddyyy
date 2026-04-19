import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Generate token
const token = jwt.sign(
  { id: 'some_id', doctorId: 'DOC001', role: 'doctor' },
  JWT_SECRET,
  { expiresIn: '24h' }
);

async function testAddMed() {
  const res = await fetch('http://localhost:3001/api/doctors/DOC001/medications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      patientId: 'vans7719847',
      name: 'Test Med',
      dosage: '10mg',
      pillCount: 1,
      customTime: '09:00 AM',
      slot: 'Morning',
      frequency: 'Once daily',
      notes: 'Test note',
      prescribedBy: 'Dr. Test'
    })
  });
  const data = await res.json();
  console.log(data);
}
testAddMed();
