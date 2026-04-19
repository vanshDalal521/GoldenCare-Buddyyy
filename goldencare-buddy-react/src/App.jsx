import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

// Language Context
import { LanguageProvider } from './contexts/LanguageContext.jsx';



// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import LandingRoute from './components/LandingRoute';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import DoctorLogin from './pages/DoctorLogin';
import PatientLogin from './pages/PatientLogin';
import PatientRegister from './pages/PatientRegister';
import NonScrollableLogin from './pages/NonScrollableLogin';
import DoctorPatientManagement from './pages/DoctorPatientManagement';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import HelpCenter from './pages/HelpCenter';
import UserGuide from './pages/UserGuide';
import Accessibility from './pages/Accessibility';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Pillbox from './pages/Pillbox';
import Family from './pages/Family';
import Wellness from './pages/Wellness';
import AI from './pages/AI';
// Legal pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Cookies from './pages/Cookies';
import HIPAACompliance from './pages/HIPAACompliance';
// Doctor pages
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAuth from './pages/DoctorAuth';
import DoctorPatientRecords from './pages/DoctorPatientRecords';
import PatientRecords from './pages/PatientRecords';
import DoctorRegistration from './pages/DoctorRegistration';
import DoctorDatabaseLogin from './pages/DoctorDatabaseLogin';
import DoctorProfile from './pages/DoctorProfile';
// Test pages
import TestUpload from './pages/TestUpload';

// Test Component
import TestComponent from './TestComponent';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <ErrorBoundary fullscreen={true}>
          <GlobalStyles />
          <Router>
            <ScrollToTop />
            <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Routes>
                {/* Test route */}
                <Route path="/test" element={<TestComponent />} />
                <Route path="/test-upload" element={<><Header /><main style={{ flex: 1 }}><TestUpload /></main><Footer /></>} />
                
                {/* Landing page - redirects to dashboard if logged in */}
                <Route path="/" element={<LandingRoute />} />
                <Route path="/explore" element={<><Header /><main style={{ flex: 1 }}><Explore /></main><Footer /></>} />
                <Route path="/about" element={<><Header /><main style={{ flex: 1 }}><About /></main><Footer /></>} />
                
                {/* Public utility pages */}
                <Route path="/help-center" element={<><Header /><main style={{ flex: 1 }}><HelpCenter /></main><Footer /></>} />
                <Route path="/user-guide" element={<><Header /><main style={{ flex: 1 }}><UserGuide /></main><Footer /></>} />
                <Route path="/accessibility" element={<><Header /><main style={{ flex: 1 }}><Accessibility /></main><Footer /></>} />
                
                {/* Legal pages */}
                <Route path="/privacy-policy" element={<><Header /><main style={{ flex: 1 }}><PrivacyPolicy /></main><Footer /></>} />
                <Route path="/terms-of-service" element={<><Header /><main style={{ flex: 1 }}><TermsOfService /></main><Footer /></>} />
                <Route path="/cookies" element={<><Header /><main style={{ flex: 1 }}><Cookies /></main><Footer /></>} />
                <Route path="/hipaa-compliance" element={<><Header /><main style={{ flex: 1 }}><HIPAACompliance /></main><Footer /></>} />
                
                {/* Authentication pages - publicly accessible, no header/footer */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/doctor-login" element={<DoctorLogin />} />
                <Route path="/doctor-auth" element={<DoctorAuth />} />
                <Route path="/patient-login" element={<PatientLogin />} />
                <Route path="/patient-register" element={<PatientRegister />} />
                <Route path="/doctor-register" element={<DoctorRegistration />} />
                <Route path="/doctor-database-login" element={<DoctorDatabaseLogin />} />
                
                {/* Protected patient pages - require patient login */}
                <Route path="/home" element={
                  <ProtectedRoute requireAuth={true}>
                    <><Header /><main style={{ flex: 1 }}><Home /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/pillbox" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                    <><Header /><main style={{ flex: 1 }}><Pillbox /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/patient-records" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                    <><Header /><main style={{ flex: 1 }}><PatientRecords /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/family" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['patient', 'doctor']}>
                    <><Header /><main style={{ flex: 1 }}><Family /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/wellness" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                    <><Header /><main style={{ flex: 1 }}><Wellness /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/ai" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                    <><Header /><main style={{ flex: 1 }}><AI /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/patient-dashboard" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                    <><Header /><main style={{ flex: 1 }}><PatientDashboard /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['patient']}>
                    <><Header /><main style={{ flex: 1 }}><Profile /></main><Footer /></>
                  </ProtectedRoute>
                } />
                
                {/* Protected doctor pages - require doctor login */}
                <Route path="/doctor-dashboard" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['doctor']}>
                    <><Header /><main style={{ flex: 1 }}><DoctorDashboard /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/doctor-profile" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['doctor']}>
                    <><Header /><main style={{ flex: 1 }}><DoctorProfile /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/doctor-patient-records" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['doctor']}>
                    <><Header /><main style={{ flex: 1 }}><DoctorPatientRecords /></main><Footer /></>
                  </ProtectedRoute>
                } />
                
                {/* Protected admin pages - require admin login */}
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
                    <><Header /><main style={{ flex: 1 }}><AdminDashboard /></main><Footer /></>
                  </ProtectedRoute>
                } />
                <Route path="/doctor-patient-management" element={
                  <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
                    <><Header /><main style={{ flex: 1 }}><DoctorPatientManagement /></main><Footer /></>
                  </ProtectedRoute>
                } />
                
                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;