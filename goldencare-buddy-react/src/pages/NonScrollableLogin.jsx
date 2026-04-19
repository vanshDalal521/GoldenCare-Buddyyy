import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { patientAPI, adminAPI } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext.jsx';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 4px 20px rgba(49, 130, 206, 0.3); }
  50% { transform: scale(1.02); box-shadow: 0 8px 30px rgba(49, 130, 206, 0.5); }
  100% { transform: scale(1); box-shadow: 0 4px 20px rgba(49, 130, 206, 0.3); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, 
    ${props => props.theme.colors.primary} 0%, 
    ${props => props.theme.colors.accent} 30%,
    ${props => props.theme.colors.health} 70%,
    ${props => props.theme.colors.medical} 100%
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  padding: ${props => props.theme.spacing.xl};
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
    animation: ${float} 12s ease-in-out infinite;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 20%;
    right: 10%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    animation: ${float} 8s ease-in-out infinite reverse;
    z-index: 0;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: ${props => props.theme.borderRadius['3xl']};
  box-shadow: ${props => props.theme.shadows['2xl']};
  padding: ${props => props.theme.spacing['4xl']};
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ${fadeIn} 0.8s ease-out;
  transform: translateY(0);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing['2xl']};
    margin: ${props => props.theme.spacing.md};
    max-width: 95%;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['3xl']};
  animation: ${fadeIn} 1s ease-out;
  
  .logo {
    font-size: 5rem;
    margin-bottom: ${props => props.theme.spacing.lg};
    animation: ${float} 4s ease-in-out infinite;
    display: inline-block;
  }
  
  .title {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.black};
    margin-bottom: ${props => props.theme.spacing.sm};
    color: ${props => props.theme.colors.text};
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.muted};
    font-weight: ${props => props.theme.fontWeights.medium};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const UserTypeSelector = styled.div`
  display: flex;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primaryLight}10, 
    ${props => props.theme.colors.accentLight}10
  );
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 6px;
  margin-bottom: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
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
  
  .icon {
    font-size: 1.3rem;
  }
  
  &:hover {
    background: ${props => props.$active 
      ? `linear-gradient(135deg, ${props.theme.colors.primaryDark}, ${props.theme.colors.accentDark})` 
      : props.theme.colors.border};
    transform: translateY(-2px);
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
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-top: ${props => props.theme.spacing.lg};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.border};
    transform: translateX(-5px);
  }
`;

const SuperLoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin: ${props => props.theme.spacing.lg} 0;
  padding: ${props => props.theme.spacing.md};
  background: linear-gradient(135deg, ${props => props.theme.colors.accentLight}, ${props => props.theme.colors.primaryLight});
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
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

const UniqueIdInfo = styled.div`
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primaryLight}20, 
    ${props => props.theme.colors.accentLight}20
  );
  border: 1px solid ${props => props.theme.colors.primaryLight}40;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.md} 0;
  
  .title {
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.sm};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
  }
  
  .description {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.text};
    line-height: 1.4;
  }
  
  .patient-id {
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight}30;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: ${props => props.theme.borderRadius.sm};
    display: inline-block;
    margin-top: ${props => props.theme.spacing.xs};
  }
`;

const ToggleFormLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fontWeights.semibold};
  text-decoration: underline;
  cursor: pointer;
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: ${props => props.theme.spacing.md} 0;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const NonScrollableLogin = () => {
  const { t } = useLanguage();
  const [userType, setUserType] = useState('patient'); // 'patient' or 'doctor'
  const [formData, setFormData] = useState({
    patientId: '',
    password: '',
    mobile: '',
    username: '',
    doctorPassword: '',
    name: '',
    signupPassword: '',
    confirmPassword: '',
    signupMobile: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoFilledPatientId, setAutoFilledPatientId] = useState(false); // Add this state
  const navigate = useNavigate();

  // Auto-fill patient ID if coming from registration
  useEffect(() => {
    const lastRegisteredPatientId = localStorage.getItem('gc_last_registered_patient_id');
    if (lastRegisteredPatientId) {
      setFormData(prev => ({
        ...prev,
        patientId: lastRegisteredPatientId
      }));
      setAutoFilledPatientId(true); // Set the flag when auto-filling
      // Remove the stored patient ID after using it
      localStorage.removeItem('gc_last_registered_patient_id');
    }
  }, []);

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

  const generateUniquePatientId = (name) => {
    // Create a unique patient ID based on name and timestamp
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${cleanName}${timestamp}${randomNum}`;
  };

  const handleGeneratePatientId = () => {
    if (formData.name.trim()) {
      const newPatientId = generateUniquePatientId(formData.name);
      setFormData({
        ...formData,
        patientId: newPatientId
      });
    }
  };

  const validatePatientLogin = () => {
    if (!formData.patientId.trim()) {
      setError(t('please_enter_patient_id'));
      return false;
    }
    
    if (!formData.password) {
      setError(t('please_enter_password'));
      return false;
    }
    
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError(t('please_enter_valid_mobile'));
      return false;
    }
    
    return true;
  };

  const validatePatientSignup = () => {
    if (!formData.name.trim()) {
      setError(t('please_enter_full_name'));
      return false;
    }
    
    if (!formData.patientId.trim()) {
      setError(t('please_generate_patient_id'));
      return false;
    }
    
    if (!formData.signupPassword) {
      setError(t('please_enter_password'));
      return false;
    }
    
    if (formData.signupPassword.length < 6) {
      setError(t('password_min_length'));
      return false;
    }
    
    if (formData.signupPassword !== formData.confirmPassword) {
      setError(t('passwords_do_not_match'));
      return false;
    }
    
    return true;
  };

  const validateDoctorLogin = () => {
    if (!formData.username.trim()) {
      setError(t('please_enter_username'));
      return false;
    }
    
    if (!formData.doctorPassword) {
      setError(t('please_enter_password'));
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
      setError(t('invalid_patient_credentials'));
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
        patientId: formData.patientId.trim(),
        mobile: formData.mobile,
        password: formData.signupPassword,
        countryCode: '+91'
      });

      if (response.success) {
        setSuccess(t('registration_successful'));
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || t('registration_failed'));
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
      setError(t('invalid_doctor_credentials'));
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
          {t('patient_id')} <span className="required">*</span>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            placeholder={t('enter_your_patient_id')}
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
          {t('password')} <span className="required">*</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('enter_your_password')}
            required
            autoComplete="current-password"
          />
        </Label>
      </FormGroup>
      
      <FormGroup>
        <Label>
          {t('mobile_number')} <span className="required">*</span>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder={t('enter_10_digit_mobile')}
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
          {t('mobile_required_for_notifications')}
        </div>
      </InfoBox>
      
      <SubmitBtn type="submit" disabled={loading}>
        {loading && <span className="loading"></span>}
        {loading ? t('signing_in') : t('access_my_dashboard')}
      </SubmitBtn>
      
      <ToggleFormLink type="button" onClick={() => setShowSignupForm(true)}>
        {t('dont_have_account')} {t('sign_up_now')}
      </ToggleFormLink>
    </Form>
  );

  const renderPatientSignup = () => (
    <Form onSubmit={handlePatientSignup}>
      {success ? (
        <SuccessMessage>
          <span>✅</span>
          <div>
            <strong>{t('registration_successful')}</strong>
            <p style={{ marginTop: '0.25rem', marginBottom: 0, fontSize: '0.75rem' }}>
              {t('redirecting_to_login')}
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
          {t('full_name')} <span className="required">*</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('enter_your_full_name')}
            required
            autoComplete="name"
          />
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          {t('patient_id')} <span className="required">*</span>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            placeholder={t('your_patient_id_will_appear_here')}
            required
            autoComplete="username"
            readOnly={!!generatedPatientId}
          />
        </Label>
      </FormGroup>
      
      {formData.name.trim() && !generatedPatientId && (
        <UniqueIdInfo>
          <div className="title">
            <span className="icon">🆔</span>
            <span>{t('generate_your_patient_id')}</span>
          </div>
          <div className="description">
            {t('click_button_below_to_generate')}
          </div>
          <button 
            type="button" 
            onClick={handleGeneratePatientId}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {t('generate_patient_id')}
          </button>
        </UniqueIdInfo>
      )}
      
      {generatedPatientId && (
        <UniqueIdInfo>
          <div className="title">
            <span className="icon">✅</span>
            <span>{t('your_patient_id')}</span>
          </div>
          <div className="description">
            {t('save_this_id_for_login')}
          </div>
          <div className="patient-id">
            {generatedPatientId}
          </div>
        </UniqueIdInfo>
      )}
      
      <FormGroup>
        <Label>
          {t('mobile_number')} <span className="required">*</span>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder={t('enter_10_digit_mobile')}
            required
            pattern="[0-9]{10}"
            maxLength="10"
            autoComplete="tel"
          />
        </Label>
      </FormGroup>
      
      <FormGroup>
        <Label>
          {t('password')} <span className="required">*</span>
          <input
            type="password"
            name="signupPassword"
            value={formData.signupPassword}
            onChange={handleChange}
            placeholder={t('create_strong_password')}
            required
            autoComplete="new-password"
            minLength="6"
          />
        </Label>
      </FormGroup>
      
      <FormGroup>
        <Label>
          {t('confirm_password')} <span className="required">*</span>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={t('re_enter_password')}
            required
            autoComplete="new-password"
            minLength="6"
          />
        </Label>
      </FormGroup>
      
      <InfoBox>
        <span className="icon">🔒</span>
        <div>
          {t('password_min_length')}
        </div>
      </InfoBox>
      
      <SubmitBtn type="submit" disabled={loading || !generatedPatientId}>
        {loading && <span className="loading"></span>}
        {loading ? t('creating_account') : t('create_account')}
      </SubmitBtn>
      
      <ToggleFormLink type="button" onClick={() => {
        setShowSignupForm(false);
        setError('');
        setSuccess('');
      }}>
        ← {t('back_to_login')}
      </ToggleFormLink>
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
          {t('username')} <span className="required">*</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={t('enter_your_username')}
            required
            autoComplete="username"
          />
        </Label>
      </FormGroup>
      
      <FormGroup>
        <Label>
          {t('password')} <span className="required">*</span>
          <input
            type="password"
            name="doctorPassword"
            value={formData.doctorPassword}
            onChange={handleChange}
            placeholder={t('enter_your_password')}
            required
            autoComplete="current-password"
          />
        </Label>
      </FormGroup>
      
      <SubmitBtn type="submit" disabled={loading}>
        {loading && <span className="loading"></span>}
        {loading ? t('signing_in') : t('access_patient_management')}
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
            {userType === 'patient' 
              ? t('patient_portal') 
              : t('doctor_portal')}
          </div>
        </Header>
        
        <UserTypeSelector>
          <SelectorButton 
            active={userType === 'patient'} 
            onClick={() => {
              setUserType('patient');
              setShowSignupForm(false);
              setError('');
              setSuccess('');
            }}
          >
            <span className="icon">👤</span>
            <span>{t('patient')}</span>
          </SelectorButton>
          <SelectorButton 
            active={userType === 'doctor'} 
            onClick={() => {
              setUserType('doctor');
              setError('');
              setSuccess('');
            }}
          >
            <span className="icon">👨‍⚕️</span>
            <span>{t('doctor')}</span>
          </SelectorButton>
        </UserTypeSelector>
        
        {userType === 'patient' ? (
          showSignupForm ? renderPatientSignup() : renderPatientLogin()
        ) : (
          renderDoctorLogin()
        )}
        
        <BackLink to="/">
          ← {t('back_to_home')}
        </BackLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default NonScrollableLogin;