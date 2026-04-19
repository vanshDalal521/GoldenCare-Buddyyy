import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { doctorAPI } from '../services/apiService';
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

const slideInUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, 
    #3182ce 0%, 
    #48bb78 25%,
    #38b2ac 50%,
    #805ad5 75%,
    #3182ce 100%
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  padding: 2rem;
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
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ${slideInUp} 0.8s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3182ce, #48bb78, #38b2ac, #805ad5);
  }
  
  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-out;
  
  .icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: ${float} 4s ease-in-out infinite;
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: #1a202c;
    background: linear-gradient(135deg, #63b3ed, #48bb78);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .subtitle {
    color: #718096;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .verification-status {
    background: #feebc8;
    color: #d69e2e;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.9rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
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
  
  .required {
    color: #e53e3e;
  }
  
  input {
    margin-top: 0.5rem;
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
  }
`;

const SubmitBtn = styled.button`
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
    animation: none;
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
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const InfoBox = styled.div`
  background: #ebf8ff;
  color: #3182ce;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #bee3f8;
  animation: ${fadeIn} 1s ease-out;
  
  .title {
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .description {
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  
  p {
    margin-bottom: 1rem;
    color: #718096;
  }
  
  a {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #3182ce, #48bb78);
    color: white;
    text-decoration: none;
    border-radius: 0.75rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  align-self: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  margin-top: 1rem;
  
  &:hover {
    color: #3182ce;
    background: #f1f5f9;
    transform: translateX(-5px);
  }
`;

const DoctorLogin = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    doctorId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.doctorId.trim()) {
      setError('Please enter your Doctor ID or email');
      return false;
    }
    
    if (!formData.password) {
      setError('Please enter your password');
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
      // Connect to the doctor API for login
      const response = await doctorAPI.login(
        formData.doctorId,
        formData.password
      );

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
          token: response.token // SAVE THE TOKEN
        }));

        setSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/doctor-dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Invalid credentials. Please check your Doctor ID and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <div className="icon">👨‍⚕️</div>
          <div className="title">Doctor Login</div>
          <div className="subtitle">
            Access your doctor dashboard
          </div>
          <div className="verification-status">
            🔍 AI + Admin Verification Required
          </div>
        </LoginHeader>
        
        <InfoBox>
          <div className="title">
            <span className="icon">ℹ️</span>
            <span>New Doctor?</span>
          </div>
          <div className="description">
            You need to register first and wait for admin verification before you can log in.
          </div>
        </InfoBox>
        
        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              <span className="icon">⚠️</span>
              <span>{error}</span>
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              <span className="icon">✅</span>
              <span>{success}</span>
            </SuccessMessage>
          )}
          
          <FormGroup>
            <Label>
              Doctor ID or Email <span className="required">*</span>
              <input
                type="text"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                placeholder="Enter your Doctor ID or email"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </Label>
          </FormGroup>
          
          <SubmitBtn type="submit" disabled={loading}>
            {loading && <span className="loading"></span>}
            {loading ? 'Signing in...' : 'Sign in to Dashboard'}
          </SubmitBtn>
        </Form>
        
        <RegisterLink>
          <p>Don't have an account? Register as a doctor</p>
          <Link to="/doctor-register">
            Register Now
          </Link>
        </RegisterLink>
        
        <BackLink to="/login">
          ← Back to main login
        </BackLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default DoctorLogin;