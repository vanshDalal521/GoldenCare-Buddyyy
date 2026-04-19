import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { patientAPI, adminAPI } from '../services/apiService';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}10 50%, 
    ${props => props.theme.colors.accentLight}10 100%
  );
  padding: ${props => props.theme.spacing.xl};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="medical" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.02"/><path d="M20,25 L30,25 M25,20 L25,30" stroke="%23000" stroke-width="0.5" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23medical)"/></svg>') repeat;
    pointer-events: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const LoginCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius['3xl']};
  box-shadow: ${props => props.theme.shadows['2xl']};
  padding: ${props => props.theme.spacing['4xl']};
  width: 100%;
  max-width: 900px;
  position: relative;
  z-index: 1;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, 
      ${props => props.theme.colors.primary}20, 
      ${props => props.theme.colors.accent}20
    );
    border-radius: ${props => props.theme.borderRadius['3xl']};
    z-index: -1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    max-width: 600px;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing['2xl']};
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing['2xl']};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  display: flex;
  flex-direction: column;
  justify-content: center;
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
    transform: rotate(30deg);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.xl};
    border-radius: ${props => props.theme.borderRadius.xl};
  }
`;

const RightPanel = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing['2xl']};
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.xl};
  }
`;

const PanelHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  
  .logo {
    font-size: 3rem;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  .title {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  .subtitle {
    font-size: ${props => props.theme.fontSizes.lg};
    opacity: 0.9;
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const UserTypeToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.15);
  border-radius: ${props => props.theme.borderRadius.full};
  padding: 4px;
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.$active ? props.theme.fontWeights.bold : props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.$active ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)'};
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
  font-size: ${props => props.theme.fontSizes.md};
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
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  
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
    background: ${props => props.theme.colors.card};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: ${props => props.theme.shadows.outline};
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
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  margin-top: ${props => props.theme.spacing.md};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
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
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.sm};
  border: 1px solid ${props => props.theme.colors.error}40;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.successLight};
  color: ${props => props.theme.colors.success};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.sm};
  border: 1px solid ${props => props.theme.colors.success}40;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.muted};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-top: ${props => props.theme.spacing.xl};
  transition: all ${props => props.theme.transitions.normal};
  align-self: center;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateX(-2px);
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.infoLight};
  color: ${props => props.theme.colors.info};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: ${props => props.theme.spacing.md};
  line-height: 1.5;
`;

const FeatureList = styled.div`
  margin-top: auto;
  padding-top: ${props => props.theme.spacing.xl};
  
  .features-title {
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.fontSizes.lg};
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${props => props.theme.spacing.md};
    
    .feature {
      display: flex;
      align-items: center;
      gap: ${props => props.theme.spacing.sm};
      font-size: ${props => props.theme.fontSizes.sm};
      
      .icon {
        font-size: ${props => props.theme.fontSizes.md};
      }
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const AdvancedLogin = () => {
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
          <InfoBox>
            📞 Required for AI voice call reminders & notifications
          </InfoBox>
        </Label>
      </FormGroup>
      
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
            <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
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
          <InfoBox>
            💡 This will be your username for login. Choose something memorable!
          </InfoBox>
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
          <InfoBox>
            📞 Required for AI voice call reminders and notifications
          </InfoBox>
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
            <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              Our team will review your request and contact you shortly.
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

      <SubmitBtn type="submit" disabled={loading}>
        {loading && <span className="loading"></span>}
        {loading ? 'Submitting Request...' : 'Request Access'}
      </SubmitBtn>
    </Form>
  );

  return (
    <LoginContainer>
      <LoginCard>
        <LeftPanel>
          <PanelHeader>
            <div className="logo">🏥</div>
            <div className="title">GoldenCare Buddy</div>
            <div className="subtitle">
              Your trusted companion for healthcare management
            </div>
          </PanelHeader>
          
          <UserTypeToggle>
            <ToggleButton 
              active={userType === 'patient'} 
              onClick={() => setUserType('patient')}
            >
              👤 Patient
            </ToggleButton>
            <ToggleButton 
              active={userType === 'doctor'} 
              onClick={() => setUserType('doctor')}
            >
              👨‍⚕️ Doctor
            </ToggleButton>
          </UserTypeToggle>
          
          <FeatureList>
            <div className="features-title">
              {userType === 'patient' ? 'Patient Features' : 'Doctor Features'}
            </div>
            <div className="features-grid">
              {userType === 'patient' ? (
                <>
                  <div className="feature">
                    <span className="icon">💊</span>
                    <span>Medication tracking</span>
                  </div>
                  <div className="feature">
                    <span className="icon">📊</span>
                    <span>Health progress reports</span>
                  </div>
                  <div className="feature">
                    <span className="icon">🔔</span>
                    <span>Smart reminders</span>
                  </div>
                  <div className="feature">
                    <span className="icon">👨‍👩‍👧‍👦</span>
                    <span>Family dashboard</span>
                  </div>
                  <div className="feature">
                    <span className="icon">🧘</span>
                    <span>Wellness programs</span>
                  </div>
                  <div className="feature">
                    <span className="icon">🤖</span>
                    <span>AI health insights</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="feature">
                    <span className="icon">👥</span>
                    <span>Patient management</span>
                  </div>
                  <div className="feature">
                    <span className="icon">📊</span>
                    <span>Analytics dashboard</span>
                  </div>
                  <div className="feature">
                    <span className="icon">🔔</span>
                    <span>Care alerts</span>
                  </div>
                  <div className="feature">
                    <span className="icon">📋</span>
                    <span>Prescription tools</span>
                  </div>
                  <div className="feature">
                    <span className="icon">📈</span>
                    <span>Compliance tracking</span>
                  </div>
                  <div className="feature">
                    <span className="icon">💬</span>
                    <span>Team communication</span>
                  </div>
                </>
              )}
            </div>
          </FeatureList>
        </LeftPanel>
        
        <RightPanel>
          <PanelHeader>
            <div className="logo">
              {userType === 'patient' ? '👤' : '👨‍⚕️'}
            </div>
            <div className="title">
              {userType === 'patient' ? 'Patient Portal' : 'Doctor Portal'}
            </div>
            <div className="subtitle">
              {userType === 'patient' 
                ? 'Manage your health and medications' 
                : 'Access administrative healthcare tools'}
            </div>
          </PanelHeader>
          
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
          
          <BackLink to="/non-scrollable-login">
            ← Try Non-Scrollable Login
          </BackLink>
        </RightPanel>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdvancedLogin;