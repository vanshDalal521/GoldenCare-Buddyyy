import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { doctorAPI, patientAPI } from '../services/apiService';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}05 50%, 
    ${props => props.theme.colors.accentLight}05 100%
  );
  perspective: 1000px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing['4xl']};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary} 0%, 
    ${props => props.theme.colors.primaryDark} 100%
  );
  color: white;
  position: relative;
  overflow: hidden;
  animation: ${fadeInLeft} 0.8s ease-out;
  transform-style: preserve-3d;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #ff9a9e, #fad0c4, #a1c4fd);
    transform: translateZ(20px);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primaryLight}20;
    top: -100px;
    right: -100px;
    animation: ${float} 8s ease-in-out infinite;
    transform: translateZ(30px);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing['2xl']};
    min-height: 50vh;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing['2xl']};
  animation: ${fadeInRight} 0.8s ease-out;
  transform-style: preserve-3d;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.xl};
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['3xl']};
  z-index: 2;
  transform: translateZ(50px);
`;

const Logo = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.lg};
  animation: ${pulse} 2s ease-in-out infinite;
  transform: translateZ(40px);
  text-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

const BrandTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.extrabold};
  margin-bottom: ${props => props.theme.spacing.md};
  color: white;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transform: translateZ(30px);
`;

const BrandSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.xl};
  opacity: 0.95;
  max-width: 90%;
  margin: 0 auto;
  line-height: ${props => props.theme.lineHeights.relaxed};
  color: rgba(255, 255, 255, 0.9);
  transform: translateZ(20px);
`;

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing['2xl']};
  z-index: 2;
  transform: translateZ(30px);
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  transform: translateZ(20px);
  transform-style: preserve-3d;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateZ(30px) translateY(-10px) scale(1.03);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.md};
  transform: translateZ(10px);
`;

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: white;
  transform: translateZ(10px);
`;

const FeatureDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
  transform: translateZ(5px);
`;

const LoginFormContainer = styled.div`
  width: 100%;
  max-width: 450px;
  padding: ${props => props.theme.spacing['3xl']};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 50px rgba(49, 130, 206, 0.15),
    0 40px 60px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
  animation: ${fadeIn} 0.8s ease-out;
  transform: translateZ(40px);
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: translateZ(50px) translateY(-5px);
    box-shadow: 
      0 35px 60px -12px rgba(0, 0, 0, 0.3),
      0 0 60px rgba(49, 130, 206, 0.2),
      0 50px 70px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    border-radius: ${props => props.theme.borderRadius['2xl']} ${props => props.theme.borderRadius['2xl']} 0 0;
    transform: translateZ(10px);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    max-width: 100%;
    padding: ${props => props.theme.spacing['2xl']};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.xl};
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  transform: translateZ(10px);
`;

const LoginTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.extrabold};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
  background: linear-gradient(120deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateZ(10px);
  text-shadow: 0 2px 5px rgba(49, 130, 206, 0.1);
`;

const LoginSubtitle = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.lg};
  transform: translateZ(5px);
`;

const UserTypeSelector = styled.div`
  display: flex;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: 
    inset 0 2px 5px rgba(0, 0, 0, 0.05),
    0 5px 15px rgba(0, 0, 0, 0.05);
  transform: translateZ(10px);
  transform-style: preserve-3d;
`;

const UserTypeButton = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$active ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark})` : 'transparent'};
  color: ${props => props.$active ? 'white' : props.theme.colors.muted};
  font-weight: ${props => props.$active ? props.theme.fontWeights.semibold : props.theme.fontWeights.normal};
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  transform: translateZ(5px);
  transform-style: preserve-3d;
  box-shadow: ${props => props.$active ? `0 5px 15px ${props.theme.colors.primary}40` : 'none'};
  
  &:hover {
    background: ${props => props.$active 
      ? `linear-gradient(135deg, ${props.theme.colors.primaryDark}, ${props.theme.colors.primary})` 
      : props.theme.colors.bgDark};
    transform: translateZ(10px) ${props => props.$active ? 'translateY(-3px)' : 'translateY(-2px)'};
    box-shadow: ${props => props.$active 
      ? `0 8px 20px ${props.theme.colors.primary}50` 
      : `0 3px 10px rgba(0, 0, 0, 0.05)`};
  }
  
  ${props => props.$active && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: ${props.theme.borderRadius.lg};
      box-shadow: 0 5px 15px ${props.theme.colors.primary}30;
      z-index: -1;
    }
  `}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  transform: translateZ(10px);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  transform: translateZ(5px);
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transform: translateZ(5px);
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: ${props => props.theme.colors.card};
  box-shadow: 
    inset 0 2px 5px rgba(0, 0, 0, 0.03),
    0 2px 5px rgba(0, 0, 0, 0.05);
  transform: translateZ(5px);
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 
      0 0 0 3px ${props => props.theme.colors.primary}20,
      inset 0 2px 8px rgba(0, 0, 0, 0.05),
      0 5px 15px rgba(49, 130, 206, 0.1);
    background: white;
    transform: translateZ(8px) translateY(-2px);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.mutedLight};
  }
`;

const SubmitButton = styled.button`
  padding: ${props => props.theme.spacing.xl};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.bold};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  margin-top: ${props => props.theme.spacing.sm};
  box-shadow: 
    0 8px 20px ${props => props.theme.colors.primary}30,
    0 3px 5px rgba(0, 0, 0, 0.1);
  transform: translateZ(10px);
  transform-style: preserve-3d;
  
  &:hover:not(:disabled) {
    transform: translateZ(15px) translateY(-5px);
    box-shadow: 
      0 15px 30px ${props => props.theme.colors.primary}40,
      0 5px 10px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, ${props => props.theme.colors.primaryDark}, ${props => props.theme.colors.primary});
  }
  
  &:active:not(:disabled) {
    transform: translateZ(10px) translateY(-2px);
    box-shadow: 
      0 5px 15px ${props => props.theme.colors.primary}30,
      0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
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
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20px;
    height: 200%;
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(25deg);
    transition: all 0.6s;
  }
  
  &:hover::after {
    left: 120%;
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.errorLight};
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  animation: ${fadeIn} 0.3s ease-out;
  border-left: 4px solid ${props => props.theme.colors.error};
  transform: translateZ(10px);
  box-shadow: 0 5px 15px rgba(229, 62, 62, 0.1);
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.xl};
  font-size: ${props => props.theme.fontSizes.md};
  transform: translateZ(5px);
`;

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.semibold};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transform: translateZ(5px);
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
    text-decoration: underline;
    transform: translateZ(8px) translateX(3px);
  }
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.muted};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-top: ${props => props.theme.spacing['2xl']};
  transition: all 0.2s ease;
  transform: translateZ(5px);
  
  &:hover {
    color: ${props => props.theme.colors.text};
    transform: translateZ(8px) translateX(-3px);
  }
`;

const Login = () => {
  const { t } = useLanguage();
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    patientId: '',
    password: '',
    username: '',
    doctorPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoFilledPatientId, setAutoFilledPatientId] = useState(false);
  const navigate = useNavigate();

  // Auto-fill patient ID if coming from registration
  useEffect(() => {
    const lastRegisteredPatientId = localStorage.getItem('gc_last_registered_patient_id');
    if (lastRegisteredPatientId) {
      setFormData(prev => ({
        ...prev,
        patientId: lastRegisteredPatientId
      }));
      setAutoFilledPatientId(true);
      // Remove the stored patient ID after using it
      localStorage.removeItem('gc_last_registered_patient_id');
    }
  }, []);

  const handleChange = (e) => {
    // Allow changes to patientId even if it was auto-filled
    // Only prevent changes if autoFilledPatientId is true and user is trying to manually edit
    if (e.target.name === 'patientId' && autoFilledPatientId) {
      // Reset auto-filled state when user manually changes the field
      setAutoFilledPatientId(false);
      // Remove the stored patient ID
      localStorage.removeItem('gc_last_registered_patient_id');
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (userType === 'patient') {
      if (!formData.patientId.trim()) {
        setError('Please enter your patient ID');
        return false;
      }
      if (!formData.password) {
        setError('Please enter your password');
        return false;
      }
    } else {
      // Doctor validation
      if (!formData.username.trim()) {
        setError('Please enter your doctor ID or email');
        return false;
      }
      if (!formData.doctorPassword) {
        setError('Please enter your password');
        return false;
      }
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
      if (userType === 'patient') {
        // Patient login with actual API
        const response = await patientAPI.login(formData.patientId, formData.password);

        if (response.success) {
          // Store patient session with token
          localStorage.setItem('gc_patient_session', JSON.stringify({
            id: response.patient.id,
            patientId: response.patient.patientId,
            name: response.patient.name,
            role: 'patient',
            loginTime: Date.now(),
            mobile: response.patient.mobile,
            fullMobile: response.patient.fullMobile,
            token: response.token
          }));
          navigate('/home');
        } else {
          setError(response.message || 'Invalid credentials');
        }
      } else {
        // Doctor login with database integration
        const response = await doctorAPI.login(formData.username, formData.doctorPassword);

        if (response.success) {
          // Store doctor session
          localStorage.setItem('gc_doctor_session', JSON.stringify({
            id: response.doctor.id,
            doctorId: response.doctor.doctorId,
            name: response.doctor.name,
            email: response.doctor.email,
            role: 'doctor',
            loginTime: Date.now(),
            specialization: response.doctor.specialization,
            fullMobile: response.doctor.fullMobile,
            isVerified: response.doctor.isVerified,
            token: response.token // SAVE THE TOKEN
          }));
          navigate('/doctor-dashboard');
        } else {
          setError(response.message || 'Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LeftPanel>
        <LogoContainer>
          <Logo>🏥</Logo>
          <BrandTitle>GoldenCare Buddy</BrandTitle>
          <BrandSubtitle>Your trusted healthcare companion for medication management and wellness</BrandSubtitle>
        </LogoContainer>
        
        <FeaturesContainer>
          <FeatureCard>
            <FeatureIcon>🔔</FeatureIcon>
            <FeatureTitle>Medication Reminders</FeatureTitle>
            <FeatureDescription>Never miss a dose with our smart reminder system</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📞</FeatureIcon>
            <FeatureTitle>AI Voice Calls</FeatureTitle>
            <FeatureDescription>Automated voice assistance for medication adherence</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Health Tracking</FeatureTitle>
            <FeatureDescription>Monitor your health progress with detailed analytics</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Secure Data</FeatureTitle>
            <FeatureDescription>HIPAA compliant data protection for your privacy</FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>
      </LeftPanel>
      
      <RightPanel>
        <LoginFormContainer>
          <LoginHeader>
            <LoginTitle>Welcome Back 👋</LoginTitle>
            <LoginSubtitle>
              {userType === 'patient' 
                ? 'Sign in to your patient account' 
                : 'Sign in to your doctor account'}
            </LoginSubtitle>
          </LoginHeader>
          
          <UserTypeSelector>
            <UserTypeButton 
              $active={userType === 'patient'} 
              onClick={() => setUserType('patient')}
            >
              👤 Patient
            </UserTypeButton>
            <UserTypeButton 
              $active={userType === 'doctor'} 
              onClick={() => setUserType('doctor')}
            >
              👨‍⚕️ Doctor
            </UserTypeButton>
          </UserTypeSelector>
          
          {error && (
            <ErrorMessage>
              <span>⚠️</span>
              <span>{error}</span>
            </ErrorMessage>
          )}
          
          <Form onSubmit={handleSubmit}>
            {userType === 'patient' ? (
              <>
                <FormGroup>
                  <Label htmlFor="patientId">Patient ID 🏷️</Label>
                  <Input
                    type="text"
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    placeholder="Enter your patient ID"
                    required
                    disabled={loading}
                    readOnly={autoFilledPatientId}
                    style={autoFilledPatientId ? { backgroundColor: '#f0f8ff', borderColor: '#3182ce' } : {}}
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
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="password">Password 🔐</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </FormGroup>
              </>
            ) : (
              <>
                <FormGroup>
                  <Label htmlFor="username">Doctor ID or Email 📧</Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your doctor ID or email"
                    required
                    disabled={loading}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="doctorPassword">Password 🔐</Label>
                  <Input
                    type="password"
                    id="doctorPassword"
                    name="doctorPassword"
                    value={formData.doctorPassword}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </FormGroup>
              </>
            )}
            
            <SubmitButton type="submit" disabled={loading}>
              {loading && <span className="loading"></span>}
              {loading ? 'Signing In...' : 'Sign In ✨'}
            </SubmitButton>
          </Form>
          
          <FooterLinks>
            {userType === 'patient' ? (
              <>
                <FooterLink to="/patient-register">Create Account 🌟</FooterLink>
                <FooterLink to="/doctor-register">Doctor Sign Up 🩺</FooterLink>
              </>
            ) : (
              <>
                <FooterLink to="/doctor-register">Doctor Sign Up 🩺</FooterLink>
                <FooterLink to="/patient-register">Patient Sign Up 🌿</FooterLink>
              </>
            )}
          </FooterLinks>
          
          <HomeLink to="/">
            ← Back to Home 🏠
          </HomeLink>
        </LoginFormContainer>
      </RightPanel>
    </Container>
  );
};

export default Login;