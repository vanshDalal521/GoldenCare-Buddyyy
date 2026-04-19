import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { patientAPI } from '../services/apiService';
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

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['3xl']};
  animation: ${fadeIn} 1s ease-out;
  
  .icon {
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

const SignUpSection = styled.div`
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.infoLight}, 
    ${props => props.theme.colors.accentLight}
  );
  color: ${props => props.theme.colors.text};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin: ${props => props.theme.spacing.xl} 0;
  border: 1px solid ${props => props.theme.colors.info}40;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.sm};
  animation: ${fadeIn} 1.2s ease-out;
  
  .title {
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.fontSizes.lg};
  }
  
  .description {
    font-size: ${props => props.theme.fontSizes.md};
    opacity: 0.9;
    line-height: ${props => props.theme.lineHeights.relaxed};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  .signup-link {
    color: ${props => props.theme.colors.primary};
    font-weight: ${props => props.theme.fontWeights.bold};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.muted};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: all ${props => props.theme.transitions.normal};
  align-self: center;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-top: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSizes.md};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.border};
    transform: translateX(-5px);
  }
`;

const WelcomeFeatures = styled.div`
  margin-top: ${props => props.theme.spacing['2xl']};
  padding-top: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.border};
  animation: ${fadeIn} 1.4s ease-out;
  
  .features-title {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.lg};
    text-align: center;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.muted};
    
    .feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${props => props.theme.spacing.sm};
      padding: ${props => props.theme.spacing.md};
      border-radius: ${props => props.theme.borderRadius.md};
      transition: all 0.2s ease;
      text-align: center;
      
      .icon {
        font-size: 1.5rem;
      }
      
      &:hover {
        background: ${props => props.theme.colors.border};
        transform: translateY(-3px);
      }
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const PatientLogin = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    patientId: '',
    password: '',
    mobile: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await patientAPI.login(
        formData.patientId,
        formData.password
      );

      if (response.success) {
        // Store patient session with mobile number and token
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

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <div className="icon">👤</div>
          <div className="title">{t('patient_login')}</div>
          <div className="subtitle">
            {t('access_your_healthcare_dashboard')}
          </div>
        </LoginHeader>
        
        {error && (
          <ErrorMessage>
            <span className="icon">⚠️</span>
            <span>{error}</span>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
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
              />
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
          
          <SubmitBtn type="submit" disabled={loading}>
            {loading && <span className="loading"></span>}
            {loading ? t('signing_in') : t('access_my_dashboard')}
          </SubmitBtn>
        </Form>
        
        <WelcomeFeatures>
          <div className="features-title">{t('what_you_can_do')}</div>
          <div className="features-grid">
            <div className="feature">
              <span className="icon">💊</span>
              <span>{t('track_medications')}</span>
            </div>
            <div className="feature">
              <span className="icon">📊</span>
              <span>{t('view_health_progress')}</span>
            </div>
            <div className="feature">
              <span className="icon">🔔</span>
              <span>{t('get_reminders')}</span>
            </div>
            <div className="feature">
              <span className="icon">👨‍👩‍👧‍👦</span>
              <span>{t('connect_with_family')}</span>
            </div>
            <div className="feature">
              <span className="icon">🤖</span>
              <span>{t('ai_health_insights')}</span>
            </div>
            <div className="feature">
              <span className="icon">📞</span>
              <span>{t('voice_call_reminders')}</span>
            </div>
          </div>
        </WelcomeFeatures>
        
        <BackLink to="/login">
          ← {t('back_to_main_login')}
        </BackLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default PatientLogin;