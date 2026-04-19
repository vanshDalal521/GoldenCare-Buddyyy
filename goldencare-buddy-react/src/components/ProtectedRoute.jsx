import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true, allowedRoles = [] }) => {
  const location = useLocation();
  
  // Check for different session types
  const adminSession = localStorage.getItem('gc_admin_session');
  const patientSession = localStorage.getItem('gc_patient_session');
  const doctorSession = localStorage.getItem('gc_doctor_session');
  
  let currentUser = null;
  
  // Determine which session should take precedence based on the route being accessed
  if (allowedRoles.length > 0) {
    // If specific roles are required, check for those roles first
    if (allowedRoles.includes('patient') && patientSession) {
      try {
        currentUser = JSON.parse(patientSession);
        currentUser.role = 'patient';
      } catch (e) {
        localStorage.removeItem('gc_patient_session');
      }
    } else if (allowedRoles.includes('doctor') && doctorSession) {
      try {
        currentUser = JSON.parse(doctorSession);
        currentUser.role = 'doctor';
      } catch (e) {
        localStorage.removeItem('gc_doctor_session');
      }
    } else if (allowedRoles.includes('admin') && adminSession) {
      try {
        currentUser = JSON.parse(adminSession);
        currentUser.role = 'admin';
      } catch (e) {
        localStorage.removeItem('gc_admin_session');
      }
    }
  } else {
    // If no specific roles required, check in order of admin -> doctor -> patient
    if (adminSession) {
      try {
        currentUser = JSON.parse(adminSession);
        currentUser.role = 'admin';
      } catch (e) {
        localStorage.removeItem('gc_admin_session');
      }
    } else if (doctorSession) {
      try {
        currentUser = JSON.parse(doctorSession);
        currentUser.role = 'doctor';
      } catch (e) {
        localStorage.removeItem('gc_doctor_session');
      }
    } else if (patientSession) {
      try {
        currentUser = JSON.parse(patientSession);
        currentUser.role = 'patient';
      } catch (e) {
        localStorage.removeItem('gc_patient_session');
      }
    }
  }
  
  // If route requires authentication
  if (requireAuth) {
    // If not logged in, redirect to login
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    
    // If specific roles are required, check role
    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
      // Redirect to appropriate dashboard based on role
      if (currentUser.role === 'admin') {
        return <Navigate to="/admin-dashboard" replace />;
      } else if (currentUser.role === 'doctor') {
        return <Navigate to="/doctor-dashboard" replace />;
      } else if (currentUser.role === 'patient') {
        return <Navigate to="/patient-dashboard" replace />;
      }
    }
  }
  
  return children;
};

export default ProtectedRoute;