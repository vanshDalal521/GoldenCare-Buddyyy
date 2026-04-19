/**
 * Generic fetch wrapper with error handling
 */
const API_BASE_URL = '/api';

async function apiFetch(endpoint, options = {}) {
  try {
    console.log('API Fetch:', endpoint, options);
    // Log the body being sent if it exists
    if (options.body) {
      console.log('Request body:', options.body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      cache: 'no-store', // Crucial to prevent aggressive browser caching on GET refreshes
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('API Response:', response.status, data);
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } else {
      // Handle non-JSON responses (like HTML error pages)
      const text = await response.text();
      console.log('API Response (non-JSON):', response.status, text);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Return a default success response for non-JSON responses
      return { success: true, message: 'Request completed successfully' };
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Patient API functions
export const patientAPI = {
  login: async (patientId, password) => {
    return apiFetch('/patients/login', {
      method: 'POST',
      body: JSON.stringify({ patientId, password }),
    });
  },
  
  register: async (patientData) => {
    return apiFetch('/patients/register', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },
  
  getProfile: async (token) => {
    return apiFetch('/patients/profile', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  
  updateProfile: async (token, profileData) => {
    return apiFetch('/patients/profile', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
  },
  
  getMedications: async (patientId, token) => {
    return apiFetch(`/patients/${patientId}/medications`);
  },
  
  markMedicationTaken: async (token, medicationId) => {
    return apiFetch(`/patients/medications/${medicationId}/taken`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  
  getHealthData: async (token) => {
    return apiFetch('/patients/health', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  
  getWellnessData: async (patientId) => {
    return apiFetch(`/patients/${patientId}/wellness`);
  },
  
  updateWellnessData: async (patientId, wellnessData) => {
    return apiFetch(`/patients/${patientId}/wellness`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wellnessData),
    });
  },
  
  updateHealthData: async (token, healthData) => {
    return apiFetch('/patients/health', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(healthData),
    });
  },
};

// Doctor API functions
export const doctorAPI = {
  login: async (doctorId, password) => {
    return apiFetch('/doctors/login', {
      method: 'POST',
      body: JSON.stringify({ doctorId, password }),
    });
  },
  
  register: async (doctorData) => {
    return apiFetch('/doctors/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });
  },
  
  getProfile: async (doctorId) => {
    return apiFetch(`/doctors/${doctorId}`);
  },
  
  getPatients: async (doctorId) => {
    return apiFetch(`/doctors/${doctorId}/patients`);
  },
  
  assignPatient: async (doctorId, patientId) => {
    const session = localStorage.getItem('gc_doctor_session');
    const token = session ? JSON.parse(session).token : null;
    return apiFetch(`/doctors/${doctorId}/assign-patient`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ patientId }),
    });
  },
  
  getPatientDetails: async (doctorId, patientId) => {
    return apiFetch(`/doctors/${doctorId}/patients/${patientId}`);
  },
  
  getPatientMedications: async (doctorId, patientId) => {
    return apiFetch(`/doctors/${doctorId}/patients/${patientId}/medications`);
  },
  
  addMedication: async (doctorId, medicationData) => {
    const session = localStorage.getItem('gc_doctor_session');
    const token = session ? JSON.parse(session).token : null;
    return apiFetch(`/doctors/${doctorId}/medications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(medicationData),
    });
  },
  
  removeMedication: async (doctorId, patientId, medicationId) => {
    const session = localStorage.getItem('gc_doctor_session');
    const token = session ? JSON.parse(session).token : null;
    return apiFetch(`/doctors/${doctorId}/patients/${patientId}/medications/${medicationId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  },
  
  removePatient: async (doctorId, patientId) => {
    const session = localStorage.getItem('gc_doctor_session');
    const token = session ? JSON.parse(session).token : null;
    return apiFetch(`/doctors/${doctorId}/patients/${patientId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  },
};

// Admin API functions
export const adminAPI = {
  login: async (username, password) => {
    return apiFetch('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  
  getDoctors: async (token) => {
    return apiFetch('/admin/doctors', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  
  createDoctor: async (token, doctorData) => {
    return apiFetch('/admin/doctors', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });
  },
  
  getPatients: async (token) => {
    return apiFetch('/admin/patients', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
  },
  
  createPatient: async (token, patientData) => {
    return apiFetch('/admin/patients', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
  },
};