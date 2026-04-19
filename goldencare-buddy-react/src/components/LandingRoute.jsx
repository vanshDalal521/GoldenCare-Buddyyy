import { Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';

const LandingRoute = () => {
  // Check if user is logged in
  const adminSession = localStorage.getItem('gc_admin_session');
  const patientSession = localStorage.getItem('gc_patient_session');
  const doctorSession = localStorage.getItem('gc_doctor_session');
  
  // If admin is logged in, redirect to admin dashboard
  if (adminSession) {
    try {
      JSON.parse(adminSession); // Validate session
      return <Navigate to="/admin-dashboard" replace />;
    } catch (e) {
      localStorage.removeItem('gc_admin_session');
    }
  }
  
  // If doctor is logged in, redirect to doctor dashboard
  if (doctorSession) {
    try {
      JSON.parse(doctorSession); // Validate session
      return <Navigate to="/doctor-dashboard" replace />;
    } catch (e) {
      localStorage.removeItem('gc_doctor_session');
    }
  }
  
  // If patient is logged in, redirect to home page
  if (patientSession) {
    try {
      JSON.parse(patientSession); // Validate session
      return <Navigate to="/home" replace />;
    } catch (e) {
      localStorage.removeItem('gc_patient_session');
    }
  }
  
  // If not logged in, show landing page
  return <Landing />;
};

export default LandingRoute;