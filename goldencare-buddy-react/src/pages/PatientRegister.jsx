import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { patientAPI } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext.jsx';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.7); }
  70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(49, 130, 206, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(49, 130, 206, 0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background: linear-gradient(-45deg, 
    #3182ce 0%, 
    #48bb78 25%,
    #38b2ac 50%,
    #805ad5 75%,
    #3182ce 100%
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  
  /* Enable scrolling on mobile devices */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(26, 32, 44, 0.85);
  backdrop-filter: blur(10px);
  color: white;
  animation: ${slideInLeft} 1s ease-out;
  position: relative;
  overflow: hidden;
  min-height: 100vh;

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

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  animation: ${slideInRight} 1s ease-out;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    padding: 1rem;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  z-index: 1;
`;

const Logo = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: ${float} 4s ease-in-out infinite;
`;

const BrandTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #63b3ed, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BrandSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 80%;
  margin: 0 auto;
  line-height: 1.6;
`;

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 3rem;
  z-index: 1;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const RegisterFormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 1.5rem;
  background: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  margin: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3182ce, #48bb78, #38b2ac, #805ad5);
  }
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #1a202c;
`;

const RegisterSubtitle = styled.p`
  color: #718096;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #1a202c;
  font-size: 0.9rem;
  
  .note {
    font-weight: normal;
    font-size: 0.8rem;
    color: #718096;
    margin-top: 0.25rem;
  }
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    background: white;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SubmitButton = styled.button`
  padding: 1.25rem;
  background: linear-gradient(135deg, #3182ce, #48bb78);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(49, 130, 206, 0.3);
    animation: ${pulse} 2s infinite;
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
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const GenerateIdButton = styled.button`
  padding: 0.75rem;
  background: linear-gradient(135deg, #ed8936, #dd6b20);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  width: 100%;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(237, 137, 54, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  &:focus {
    outline: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  color: #e53e3e;
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const SuccessMessage = styled.div`
  background: #c6f6d5;
  color: #38a169;
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #718096;
  text-decoration: none;
  font-weight: 500;
  margin-top: 2rem;
  transition: all 0.2s ease;

  &:hover {
    color: #3182ce;
  }
`;

const PatientRegister = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    patientId: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [idGenerated, setIdGenerated] = useState(false); // Add this state
  const navigate = useNavigate();

  // Function to generate a unique patient ID
  const generatePatientId = () => {
    setIsGeneratingId(true);
    // Generate a unique patient ID based on name and random numbers
    const namePart = formData.name.trim().split(' ')[0].toLowerCase().substring(0, 4);
    const timestampPart = Date.now().toString().slice(-4); // Last 4 digits of timestamp
    const randomPart = Math.floor(100 + Math.random() * 900); // 3-digit random number
    const generatedId = `${namePart}${timestampPart}${randomPart}`;
  
    setFormData(prev => ({
      ...prev,
      patientId: generatedId
    }));
  
    setIdGenerated(true); // Set the flag when ID is generated
    setTimeout(() => setIsGeneratingId(false), 500);
  };

  const handleChange = (e) => {
    // Prevent changes to patientId if it was generated
    if (e.target.name === 'patientId' && idGenerated) {
      return; // Don't update if ID was generated and user tries to change it
    }
  
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!formData.patientId.trim()) {
      setError('Please create or generate a patient ID');
      return false;
    }
    
    if (formData.patientId.length < 4) {
      setError('Patient ID must be at least 4 characters long');
      return false;
    }
    
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
      // Call the actual patient registration API
      const response = await patientAPI.register({
        name: formData.name,
        patientId: formData.patientId,
        password: formData.password,
        mobile: formData.mobile,
        email: formData.email
      });
      
      if (response.success) {
        setSuccess(true);
        // Store the patient ID in localStorage to be used in the login page
        localStorage.setItem('gc_last_registered_patient_id', formData.patientId);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LeftPanel>
        <LogoContainer>
          <Logo>📝</Logo>
          <BrandTitle>GoldenCare Buddy</BrandTitle>
          <BrandSubtitle>
            Create your account to start managing your healthcare journey
          </BrandSubtitle>
        </LogoContainer>
        
        <FeaturesContainer>
          <FeatureCard>
            <FeatureIcon>💊</FeatureIcon>
            <FeatureTitle>Medication Tracking</FeatureTitle>
            <FeatureDescription>Never miss a dose with smart reminders</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔔</FeatureIcon>
            <FeatureTitle>AI Voice Calls</FeatureTitle>
            <FeatureDescription>Personalized health check-ins</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>👨‍👩‍👧‍👦</FeatureIcon>
            <FeatureTitle>Family Dashboard</FeatureTitle>
            <FeatureDescription>Manage care for your loved ones</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Health Analytics</FeatureTitle>
            <FeatureDescription>Track your progress over time</FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>
      </LeftPanel>
      
      <RightPanel>
        <RegisterFormContainer>
          <RegisterHeader>
            <RegisterTitle>Patient Registration</RegisterTitle>
            <RegisterSubtitle>Create your patient account</RegisterSubtitle>
          </RegisterHeader>
          
          {success ? (
            <SuccessMessage>
              <strong>Registration Successful!</strong>
              <p>Redirecting to patient login page...</p>
            </SuccessMessage>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && (
                <ErrorMessage>
                  <span>⚠️</span>
                  {error}
                </ErrorMessage>
              )}
              
              <FormGroup>
                <Label>
                  Full Name <span style={{ color: '#e53e3e' }}>*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  Patient ID <span style={{ color: '#e53e3e' }}>*</span>
                  <div className="note">Enter your own ID or generate a unique one below</div>
                  {idGenerated && (
                    <div className="note" style={{ color: '#3182ce', fontWeight: 'bold' }}>
                      This ID was auto-generated and cannot be changed
                    </div>
                  )}
                </Label>
                <Input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  placeholder="Create or generate a unique patient ID"
                  required
                  minLength="4"
                  readOnly={idGenerated}
                  style={idGenerated ? { backgroundColor: '#f0f8ff', borderColor: '#3182ce' } : {}} // Add visual indicator
                />
                <GenerateIdButton type="button" onClick={generatePatientId} disabled={isGeneratingId || !formData.name.trim()}>
                  {isGeneratingId ? 'Generating...' : 'Generate Unique ID'}
                </GenerateIdButton>
              </FormGroup>
              
              <FormGroup>
                <Label>
                  Mobile Number <span style={{ color: '#e53e3e' }}>*</span>
                </Label>
                <Input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  Email Address <span style={{ color: '#e53e3e' }}>*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  Password <span style={{ color: '#e53e3e' }}>*</span>
                </Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength="6"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  Confirm Password <span style={{ color: '#e53e3e' }}>*</span>
                </Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  minLength="6"
                />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={loading}>
                {loading && <span className="loading"></span>}
                {loading ? 'Creating Account...' : 'Create Account'}
              </SubmitButton>
            </Form>
          )}
          
          <HomeLink to="/login">
            ← Back to Login
          </HomeLink>
        </RegisterFormContainer>
      </RightPanel>
    </Container>
  );
};

export default PatientRegister;