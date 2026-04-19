import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { patientAPI, adminAPI } from '../services/apiService';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 20px rgba(49, 130, 206, 0.3); }
  50% { transform: scale(1.02); box-shadow: 0 8px 30px rgba(49, 130, 206, 0.5); }
  100% { transform: scale(1); box-shadow: 0 4px 20px rgba(49, 130, 206, 0.3); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary} 0%, 
    ${props => props.theme.colors.accent} 100%
  );
  padding: ${props => props.theme.spacing.md};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    animation: ${float} 8s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 20%;
    right: 10%;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    animation: ${float} 6s ease-in-out infinite reverse;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.theme.borderRadius['3xl']};
  box-shadow: ${props => props.theme.shadows['2xl']};
  padding: ${props => props.theme.spacing['4xl']};
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing['2xl']};
    margin: ${props => props.theme.spacing.md};
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['3xl']};
  
  .logo {
    font-size: 4rem;
    margin-bottom: ${props => props.theme.spacing.lg};
    animation: ${float} 4s ease-in-out infinite;
  }
  
  .title {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.black};
    margin-bottom: ${props => props.theme.spacing.sm};
    color: ${props => props.theme.colors.text};
  }
  
  .subtitle {
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.muted};
    font-weight: ${props => props.theme.fontWeights.medium};
  }
`;

const UserTypeSelector = styled.div`
  display: flex;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 6px;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SelectorButton = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$active ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})` : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: ${props => props.$active ? props.theme.fontWeights.bold : props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    background: ${props => props.$active 
      ? `linear-gradient(135deg, ${props.theme.colors.primaryDark}, ${props.theme.colors.accentDark})` 
      : props.theme.colors.border};
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 1.3rem;
  }
`;

const FormTabs = styled.div`
  display: flex;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 4px;
  margin-bottom: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.border};
`;

const TabButton = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text};
  font-weight: ${props => props.$active ? props.theme.fontWeights.bold : props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.primaryDark : props.theme.colors.border};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
  
  .required {
    color: ${props => props.theme.colors.error};
  }
  
  input {
    margin-top: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.lg};
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.lg};
    font-size: ${props => props.theme.fontSizes.md};
    font-family: inherit;
    transition: all ${props => props.theme.transitions.normal};
    background: rgba(245, 245, 245, 0.7);
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: ${props => props.theme.shadows.outline};
      background: white;
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.mutedLight};
    }
  }
`;

const SubmitBtn = styled.button`
  padding: ${props => props.theme.spacing.xl};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.bold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  margin-top: ${props => props.theme.spacing.sm};
  box-shadow: 0 4px 20px rgba(49, 130, 206, 0.3);
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    animation: ${pulse} 2s infinite;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    animation: none;
  }
  
  .loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: ${props => props.theme.spacing.sm};
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.errorLight};
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.sm};
  border: 1px solid ${props => props.theme.colors.error}40;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  animation: ${fadeIn} 0.3s ease-out;
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.successLight};
  color: ${props => props.theme.colors.success};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.sm};
  border: 1px solid ${props => props.theme.colors.success}40;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  animation: ${fadeIn} 0.3s ease-out;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.muted};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.sm};
  transition: all ${props => props.theme.transitions.normal};
  align-self: center;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.border};
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.infoLight};
  color: ${props => props.theme.colors.info};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.xs};
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  
  .icon {
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.lg} 0;
  
  .line {
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
  
  .text {
    color: ${props => props.theme.colors.muted};
    font-size: ${props => props.theme.fontSizes.xs};
    font-weight: ${props => props.theme.fontWeights.medium};
  }
`;

const FeatureHighlights = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing['2xl']} 0;
  
  .feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md};
    background: rgba(49, 130, 206, 0.05);
    border-radius: ${props => props.theme.borderRadius.lg};
    text-align: center;
    
    .icon {
      font-size: 1.5rem;
      color: ${props => props.theme.colors.primary};
    }
    
    .text {
      font-size: ${props => props.theme.fontSizes.xs};
      font-weight: ${props => props.theme.fontWeights.medium};
      color: ${props => props.theme.colors.text};
    }
  }
`;

const StunningLogin = () => {
  const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'
  const [formType, setFormType] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    // Patient login
    patientId: '',
    password: '',
    mobile: '',
    // Patient signup
    name: '',
    signupPatientId: '',
    signupMobile: '',
    signupPassword: '',
    confirmPassword: '',
    // Doctor login/signup
    username: '',
    doctorPassword: '',
    doctorName: '',
    doctorEmail: '',
    doctorSignupPassword: '',
    doctorConfirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoFilledPatientId, setAutoFilledPatientId] = useState(false); // Add this state
  const navigate = useNavigate();

  // Auto-fill patient ID if coming from registration
  useEffect(() => {
    const lastRegisteredPatientId = localStorage.getItem('gc_last_registered_patient_id');
    if (lastRegisteredPatientId && userType === 'patient' && formType === 'login') {
      setFormData(prev => ({
        ...prev,
        patientId: lastRegisteredPatientId
      }));
      setAutoFilledPatientId(true); // Set the flag when auto-filling
      // Remove the stored patient ID after using it
      localStorage.removeItem('gc_last_registered_patient_id');
    }
  }, [userType, formType]);

  const handleChange = (e) => {
    // Prevent changes to patientId if it was auto-filled
    if (e.target.name === 'patientId' && autoFilledPatientId) {
      return; // Don't update if ID was auto-filled and user tries to change it
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validatePatientLogin = () => {
    if (!formData.patientId.trim()) {
      setError('Please enter your patient ID');
      return false;
    }
    
    if (!formData.password) {
      setError('Please enter your password');
      return false;
    }
    
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    return true;
  };

  const validatePatientSignup = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!formData.signupPatientId.trim()) {
      setError('Please create a patient ID');
      return false;
    }
    
    if (formData.signupPatientId.length < 4) {
      setError('Patient ID must be at least 4 characters long');
      return false;
    }
    
    if (!formData.signupMobile || formData.signupMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    if (!formData.signupPassword) {
      setError('Please enter a password');
      return false;
    }
    
    if (formData.signupPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.signupPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const validateDoctorLogin = () => {
    if (!formData.username.trim()) {
      setError('Please enter your username');
      return false;
    }
    
    if (!formData.doctorPassword) {
      setError('Please enter your password');
      return false;
    }
    
    return true;
  };

  const validateDoctorSignup = () => {
    if (!formData.doctorName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return false;
    }
    
    if (!formData.doctorEmail.trim() || !/\S+@\S+\.\S+/.test(formData.doctorEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.doctorSignupPassword) {
      setError('Please enter a password');
      return false;
    }
    
    if (formData.doctorSignupPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.doctorSignupPassword !== formData.doctorConfirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    
    if (!validatePatientLogin()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await patientAPI.login(formData.patientId, formData.password);

      if (response.success) {
        // Store patient session with mobile number
        localStorage.setItem('gc_patient_session', JSON.stringify({
          id: response.patient.id,
          patientId: response.patient.patientId,
          role: 'patient',
          loginTime: Date.now(),
          name: response.patient.name,
          mobile: formData.mobile,
          fullMobile: response.patient.fullMobile,
          token: response.token
        }));
        
        // Request notification permission
        await requestNotificationPermission();
        
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid patient ID or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSignup = async (e) => {
    e.preventDefault();
    
    if (!validatePatientSignup()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await patientAPI.register({
        name: formData.name.trim(),
        patientId: formData.signupPatientId.trim(),
        mobile: formData.signupMobile,
        password: formData.signupPassword,
        countryCode: '+91'
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    
    if (!validateDoctorLogin()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await adminAPI.login({
        username: formData.username,
        password: formData.doctorPassword
      });

      if (response.success) {
        // Store admin session
        localStorage.setItem('gc_admin_session', JSON.stringify({
          id: response.admin.id,
          username: response.admin.username,
          role: 'admin',
          loginTime: Date.now()
        }));

        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSignup = async (e) => {
    e.preventDefault();
    
    if (!validateDoctorSignup()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // For demo purposes, we'll just show a success message
      // In a real app, this would connect to an API
      setSuccess(true);
      setTimeout(() => {
        setFormType('login');
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      } catch (error) {
        console.error('Notification permission error:', error);
      }
    }
  };

  const renderPatientLogin = () => (
    <Form onSubmit={handlePatientLogin}>
      {error && (
        <ErrorMessage>
          <span>⚠️</span>
          {error}
        </ErrorMessage>
      )}
      
      <FormGroup>
        <Label>
          Patient ID <span className="required">*</span>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            placeholder="Enter your patient ID"
            required
            autoComplete="username"
            readOnly={autoFilledPatientId} // Add this line
            style={autoFilledPatientId ? { backgroundColor: '#f0f8ff', borderColor: '#3182ce' } : {}} // Add visual indicator
          />
          {autoFilledPatientId && (
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#3182ce', 
              fontWeight: 'bold', 
              marginTop: '0.25rem',
              fontStyle: 'italic'
            }}>
              This ID was auto-filled from your registration
            </div>
          )}
        </Label>
      </FormGroup>
      
      <FormGroup>
        <Label>
          Password <span className="required">*</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </Label>
      </FormGroup>
      
      <FormGroup>
        <Label>
          Mobile Number <span className="required">*</span>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            required
            pattern="[0-9]{10}"
            maxLength="10"
            autoComplete="tel"
          />
        </Label>
      </FormGroup>
      
      <InfoBox>
        <span className="icon">📞</span>
        <div>
          Required for AI voice call reminders & notifications
        </div>
      </InfoBox>
      
      <SubmitBtn type="submit" disabled={loading}>
        {loading && <span className="loading"></span>}
        {loading ? 'Signing in...' : 'Access My Dashboard'}
      </SubmitBtn>
    </Form>
  );

  const renderPatientSignup = () => (
    <Form onSubmit={handlePatientSignup}>
      {success ? (
        <SuccessMessage>
          <span>✅</span>
          <div>
            <strong>Registration Successful!</strong>
            <p style={{ marginTop: '0.25rem', marginBottom: 0, fontSize: '0.75rem' }}>
              Redirecting to login page...
            </p>
          </div>
        </SuccessMessage>
      ) : error && (
        <ErrorMessage>
          <span>⚠️</span>
          {error}
        </ErrorMessage>
      )}
      
      <FormGroup>
        <Label>
          Full Name <span className="required">*</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            autoComplete="name"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Create Patient ID <span className="required">*</span>
          <input
            type="text"
            name="signupPatientId"
            value={formData.signupPatientId}
            onChange={handleChange}
            placeholder="Create a unique patient ID"
            required
            autoComplete="username"
            minLength="4"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Mobile Number <span className="required">*</span>
          <input
            type="tel"
            name="signupMobile"
            value={formData.signupMobile}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            required
            pattern="[0-9]{10}"
            maxLength="10"
            autoComplete="tel"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Password <span className="required">*</span>
          <input
            type="password"
            name="signupPassword"
            value={formData.signupPassword}
            onChange={handleChange}
            placeholder="Create a strong password"
            required
            autoComplete="new-password"
            minLength="6"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Confirm Password <span className="required">*</span>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
            autoComplete="new-password"
            minLength="6"
          />
        </Label>
      </FormGroup>

      <InfoBox>
        <span className="icon">🔒</span>
        <div>
          Password must be at least 6 characters long
        </div>
      </InfoBox>

      <SubmitBtn type="submit" disabled={loading}>
        {loading && <span className="loading"></span>}
        {loading ? 'Creating Account...' : 'Create Account'}
      </SubmitBtn>
    </Form>
  );

  const renderDoctorLogin = () => (
    <Form onSubmit={handleDoctorLogin}>
      {error && (
        <ErrorMessage>
          <span>⚠️</span>
          {error}
        </ErrorMessage>
      )}
      
      <FormGroup>
        <Label>
          Username <span className="required">*</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            autoComplete="username"
          />
        </Label>
      </FormGroup>
      
      <FormGroup>
        <Label>
          Password <span className="required">*</span>
          <input
            type="password"
            name="doctorPassword"
            value={formData.doctorPassword}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </Label>
      </FormGroup>
      
      <SubmitBtn type="submit" disabled={loading}>
        {loading && <span className="loading"></span>}
        {loading ? 'Signing in...' : 'Access Dashboard'}
      </SubmitBtn>
    </Form>
  );

  const renderDoctorSignup = () => (
    <Form onSubmit={handleDoctorSignup}>
      {success ? (
        <SuccessMessage>
          <span>✅</span>
          <div>
            <strong>Registration Request Submitted!</strong>
            <p style={{ marginTop: '0.25rem', marginBottom: 0, fontSize: '0.75rem' }}>
              Our team will contact you shortly.
            </p>
          </div>
        </SuccessMessage>
      ) : error && (
        <ErrorMessage>
          <span>⚠️</span>
          {error}
        </ErrorMessage>
      )}
      
      <FormGroup>
        <Label>
          Full Name <span className="required">*</span>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            autoComplete="name"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Username <span className="required">*</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Create a unique username"
            required
            autoComplete="username"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Email Address <span className="required">*</span>
          <input
            type="email"
            name="doctorEmail"
            value={formData.doctorEmail}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            autoComplete="email"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Password <span className="required">*</span>
          <input
            type="password"
            name="doctorSignupPassword"
            value={formData.doctorSignupPassword}
            onChange={handleChange}
            placeholder="Create a strong password"
            required
            autoComplete="new-password"
            minLength="6"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          Confirm Password <span className="required">*</span>
          <input
            type="password"
            name="doctorConfirmPassword"
            value={formData.doctorConfirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
            autoComplete="new-password"
            minLength="6"
          />
        </Label>
      </FormGroup>

      <InfoBox>
        <span className="icon">🏥</span>
        <div>
          Doctor accounts require verification
        </div>
      </InfoBox>

      <SubmitBtn type="submit" disabled={loading}>
        {loading && <span className="loading"></span>}
        {loading ? 'Submitting Request...' : 'Request Access'}
      </SubmitBtn>
    </Form>
  );

  return (
    <LoginContainer>
      <LoginCard>
        <Header>
          <div className="logo">🏥</div>
          <div className="title">GoldenCare Buddy</div>
          <div className="subtitle">
            Healthcare management made simple
          </div>
        </Header>
        
        <UserTypeSelector>
          <SelectorButton 
            active={userType === 'patient'} 
            onClick={() => setUserType('patient')}
          >
            <span className="icon">👤</span>
            <span>Patient</span>
          </SelectorButton>
          <SelectorButton 
            active={userType === 'doctor'} 
            onClick={() => setUserType('doctor')}
          >
            <span className="icon">👨‍⚕️</span>
            <span>Doctor</span>
          </SelectorButton>
        </UserTypeSelector>
        
        <FormTabs>
          <TabButton 
            active={formType === 'login'} 
            onClick={() => setFormType('login')}
          >
            Sign In
          </TabButton>
          <TabButton 
            active={formType === 'signup'} 
            onClick={() => setFormType('signup')}
          >
            Create Account
          </TabButton>
        </FormTabs>
        
        {userType === 'patient' ? (
          formType === 'login' ? renderPatientLogin() : renderPatientSignup()
        ) : (
          formType === 'login' ? renderDoctorLogin() : renderDoctorSignup()
        )}
        
        <FeatureHighlights>
          <div className="feature">
            <div className="icon">💊</div>
            <div className="text">Medication Tracking</div>
          </div>
          <div className="feature">
            <div className="icon">🔔</div>
            <div className="text">Smart Reminders</div>
          </div>
          <div className="feature">
            <div className="icon">📊</div>
            <div className="text">Health Analytics</div>
          </div>
          <div className="feature">
            <div className="icon">👨‍⚕️</div>
            <div className="text">Expert Care</div>
          </div>
        </FeatureHighlights>
        
        <BackLink to="/non-scrollable-login">
          ← Try Non-Scrollable Login
        </BackLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default StunningLogin;