// Medical Record Service for GoldenCare Buddy
const API_BASE_URL = '/api';

class MedicalRecordService {
  // Get authentication token from localStorage (handles both patient and doctor sessions)
  getToken() {
    // Try patient session first
    const patientSession = localStorage.getItem('gc_patient_session');
    if (patientSession) {
      try {
        const session = JSON.parse(patientSession);
        return session.token || null;
      } catch (e) { console.error('Error parsing patient session', e); }
    }

    // Try doctor session if no patient session
    const doctorSession = localStorage.getItem('gc_doctor_session');
    if (doctorSession) {
      try {
        const session = JSON.parse(doctorSession);
        return session.token || null;
      } catch (e) { console.error('Error parsing doctor session', e); }
    }
    
    return null;
  }

  // Upload a medical record (for patients)
  async uploadRecord(formData) {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found. Please log in again.');

    const response = await fetch(`${API_BASE_URL}/medical-records/patient/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Upload failed');
    return result;
  }

  // Upload a medical record (for doctors)
  async doctorUploadRecord(formData) {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found. Please log in again.');

    const response = await fetch(`${API_BASE_URL}/medical-records/doctor/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Doctor upload failed');
    return result;
  }

  // Get all medical records for the current patient
  async getRecords() {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/medical-records/patient`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch records');
    return result;
  }

  // Get records for a specific patient (for doctors)
  async getDoctorViewRecords() {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/medical-records/doctor`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch doctor patient records');
    return result;
  }

  // Get a specific medical record
  async getRecordById(id) {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch record');
    return result;
  }

  // Delete a medical record
  async deleteRecord(id) {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to delete record');
    return result;
  }
  
  // Download a medical record file
  async downloadRecord(id) {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/medical-records/${id}/download`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Failed to download record');
    }
    
    return response;
  }
  
  // Analyze a medical record using AI
  async analyzeRecord(id) {
    const token = this.getToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/medical-records/${id}/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'AI Analysis failed');
    return result;
  }
}

export default new MedicalRecordService();