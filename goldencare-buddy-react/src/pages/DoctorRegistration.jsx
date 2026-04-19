import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { doctorAPI } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext.jsx';

// Enhanced Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.7); }
  70% { transform: scale(1.02); box-shadow: 0 0 0 15px rgba(49, 130, 206, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(49, 130, 206, 0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-10px);}
  60% {transform: translateY(-5px);}
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
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
  overflow-x: hidden;
  
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
  padding: 3rem;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  color: white;
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
    background: radial-gradient(circle, rgba(49, 130, 206, 0.1) 0%, rgba(255,255,255,0) 70%);
    animation: ${float} 15s ease-in-out infinite;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 10%;
    right: 10%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(72, 187, 120, 0.2);
    box-shadow: 0 0 60px rgba(72, 187, 120, 0.5);
    animation: ${pulse} 4s infinite;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Add new decorative elements
const DecorativeCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(49, 130, 206, 0.15) 0%, transparent 70%);
  z-index: 0;
`;

const Circle1 = styled(DecorativeCircle)`
  width: 200px;
  height: 200px;
  top: 20%;
  left: 15%;
  animation: ${float} 12s ease-in-out infinite;
`;

const Circle2 = styled(DecorativeCircle)`
  width: 150px;
  height: 150px;
  bottom: 25%;
  right: 20%;
  animation: ${float} 10s ease-in-out infinite reverse;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.2rem;
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #63b3ed, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  color: #e2e8f0;
`;

const QuoteContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border-left: 4px solid #3182ce;
  max-width: 500px;
  text-align: center;
`;

const QuoteText = styled.p`
  font-style: italic;
  color: #e2e8f0;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const QuoteAuthor = styled.p`
  color: #90cdf4;
  font-size: 0.9rem;
  margin-top: 0.8rem;
  font-weight: 600;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  overflow-y: auto;
  min-height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 5%;
    left: 5%;
    width: 80px;
    height: 80px;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    background: rgba(56, 178, 172, 0.15);
    animation: ${rotate} 15s linear infinite;
    z-index: 0;
  }

  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    padding: 1rem;
    align-items: center;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  z-index: 1;
  animation: ${fadeIn} 1s ease-out;
`;

const Logo = styled.div`
  font-size: 6rem;
  margin-bottom: 1rem;
  animation: ${float} 5s ease-in-out infinite;
  display: inline-block;
  background: linear-gradient(135deg, #63b3ed, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BrandTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #63b3ed, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(99, 179, 237, 0.3);
  animation: ${slideInRight} 1s ease-out;
`;

const BrandSubtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 90%;
  margin: 0 auto 2rem;
  line-height: 1.7;
  animation: ${slideInLeft} 1s ease-out;
  color: #e2e8f0;
`;

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  z-index: 1;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 1.8rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px) scale(1.03);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #3182ce, #48bb78);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.2rem;
  animation: ${bounce} 2s infinite;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: white;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  opacity: 0.85;
  line-height: 1.6;
  color: #e2e8f0;
`;

const RegisterFormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 3rem;
  border-radius: 2.5rem;
  background: white;
  box-shadow: 0 35px 70px -15px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  margin: 2rem 0;
  align-self: center;
  z-index: 1;
  animation: ${slideInUp} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid rgba(49, 130, 206, 0.2);
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, #3182ce, #48bb78, #38b2ac, #805ad5);
    border-radius: 2.5rem 2.5rem 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(49, 130, 206, 0.08) 0%, transparent 70%);
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    padding: 2rem;
    max-width: 95%;
  }
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3182ce, #48bb78);
    margin: 1rem auto;
    border-radius: 2px;
  }
`;

const RegisterTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.8rem;
  color: #1a202c;
  background: linear-gradient(135deg, #3182ce, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const RegisterSubtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  &.documents {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #f0f9ff, #e6fffa);
    padding: 2rem;
    border-radius: 1.5rem;
    border: 2px dashed #90cdf4;
    animation: ${fadeIn} 1.2s ease-out;
    box-shadow: inset 0 2px 15px rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: "📁";
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 1.8rem;
      opacity: 0.7;
    }
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  font-size: 1.1rem;
  
  .required {
    color: #e53e3e;
  }
  
  input, select, textarea {
    padding: 1.4rem 1.7rem;
    border: 2px solid #e2e8f0;
    border-radius: 1.2rem;
    font-size: 1.1rem;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    background: #f8fafc;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
    
    &:focus {
      outline: none;
      border-color: #3182ce;
      box-shadow: 0 0 0 4px rgba(49, 130, 206, 0.25);
      background: white;
      transform: translateY(-2px);
    }
    
    &::placeholder {
      color: #94a3b8;
    }
    
    /* Remove the default invalid styling */
    &:invalid {
      border-color: #e2e8f0; /* Reset to default border color */
    }
  }
  
  .file-input-container {
    display: flex;
    gap: 1.3rem;
    align-items: center;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }
  
  .file-input {
    flex: 1;
  }
  
  .file-type {
    width: 200px;
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  
  /* Professional error styling */
  .error-message {
    color: #e53e3e;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
`;

const SubmitBtn = styled.button`
  padding: 1rem 1.8rem;
  background: linear-gradient(135deg, #3182ce, #48bb78);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  grid-column: 1 / -1;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
  margin: 1.5rem auto 0;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(49, 130, 206, 0.4);
    background: linear-gradient(135deg, #48bb78, #3182ce);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .loading {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fed7d7, #feb2b2);
  color: #e53e3e;
  padding: 1.2rem;
  border-radius: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  grid-column: 1 / -1;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 6px 15px rgba(229, 62, 62, 0.2);
  border: 1px solid #feb2b2;
  
  span:first-child {
    font-size: 1.5rem;
  }
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #c6f6d5, #9ae6b4);
  color: #38a169;
  padding: 1.2rem;
  border-radius: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  grid-column: 1 / -1;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 6px 15px rgba(56, 161, 105, 0.2);
  border: 1px solid #9ae6b4;
  
  span:first-child {
    font-size: 1.5rem;
  }
`;

const DocumentItem = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 1.2rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #3182ce, #48bb78);
  }
  
  .file-info {
    flex: 1;
    
    .file-name {
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.9rem;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    
    .file-type {
      font-size: 1rem;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
  }
  
  .remove-btn {
    background: linear-gradient(135deg, #fed7d7, #feb2b2);
    color: #e53e3e;
    border: none;
    border-radius: 50px;
    padding: 0.6rem 1rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.9rem;
    
    &:hover {
      background: linear-gradient(135deg, #e53e3e, #c53030);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 10px rgba(229, 62, 62, 0.2);
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    .file-info {
      .file-name {
        margin-bottom: 0.8rem;
      }
    }
    
    .remove-btn {
      align-self: flex-end;
      width: auto;
    }
  }
`;

const InfoBox = styled.div`
  background: linear-gradient(135deg, 
    #ebf8ff 0%, 
    #e6fffa 100%
  );
  color: #3182ce;
  padding: 1.8rem;
  border-radius: 1.2rem;
  margin-bottom: 1.8rem;
  border: 2px solid #bee3f8;
  grid-column: 1 / -1;
  animation: ${fadeIn} 1s ease-out;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  
  .title {
    font-weight: 800;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.3rem;
  }
  
  .description {
    font-size: 1.05rem;
    opacity: 0.95;
    line-height: 1.7;
  }
  
  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.7rem;
      position: relative;
      padding-left: 1.8rem;
      font-size: 1rem;
      
      &::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #48bb78;
        font-weight: bold;
        font-size: 1.2rem;
      }
    }
  }
`;

const LoginLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  color: #3182ce;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1.2rem;
  transition: all 0.3s ease;
  align-self: center;
  grid-column: 1 / -1;
  justify-content: center;
  padding: 1rem 1.8rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  &:hover {
    color: #2c5282;
    text-decoration: underline;
    background: rgba(255, 255, 255, 1);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  color: #718096;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
  align-self: center;
  grid-column: 1 / -1;
  justify-content: center;
  padding: 1rem 1.8rem;
  border-radius: 1rem;
  background: rgba(247, 250, 252, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  &:hover {
    color: #3182ce;
    background: rgba(247, 250, 252, 1);
    transform: translateX(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const DoctorRegistration = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    password: '',
    confirmPassword: '',
    documents: []
  });
  const [documentInputs, setDocumentInputs] = useState([{ file: null, type: '' }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...documentInputs];
    newDocuments[index][field] = value;
    setDocumentInputs(newDocuments);
  };

  const addDocumentField = () => {
    setDocumentInputs(prev => [...prev, { file: null, type: '' }]);
  };

  const removeDocumentField = (index) => {
    setDocumentInputs(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }
    
    if (!formData.experience) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(formData.experience) || formData.experience < 0 || formData.experience > 50) {
      newErrors.experience = 'Experience must be between 0 and 50 years';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Check if at least one document is uploaded
    if (documentInputs.length === 0 || documentInputs.every(doc => !doc.file)) {
      newErrors.documents = 'At least one document is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      // Prepare form data for submission
      const submissionData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'documents') {
          submissionData.append(key, formData[key]);
        }
      });
      
      // Add documents
      documentInputs.forEach((doc, index) => {
        if (doc.file) {
          submissionData.append(`document_${index}`, doc.file);
          submissionData.append(`document_${index}_type`, doc.type);
        }
      });
      
      const response = await doctorAPI.register(submissionData);
      
      if (response.success) {
        setMessage('Registration successful! Please wait for admin approval.');
        setMessageType('success');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          specialization: '',
          licenseNumber: '',
          experience: '',
          password: '',
          confirmPassword: '',
          documents: []
        });
        setDocumentInputs([{ file: null, type: '' }]);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage(response.message || 'Registration failed. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LeftPanel>
        <Circle1 />
        <Circle2 />
        <LogoContainer>
          <Logo>👨‍⚕️</Logo>
          <BrandTitle>GoldenCare Buddy</BrandTitle>
          <BrandSubtitle>Professional healthcare management platform</BrandSubtitle>
        </LogoContainer>
        
        <FeaturesContainer>
          <FeatureCard>
            <FeatureIcon>📋</FeatureIcon>
            <FeatureTitle>Patient Management</FeatureTitle>
            <FeatureDescription>Efficiently manage your patient records and appointments</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💊</FeatureIcon>
            <FeatureTitle>Medication Tracking</FeatureTitle>
            <FeatureDescription>Monitor and track patient medication schedules</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📞</FeatureIcon>
            <FeatureTitle>AI Voice Calls</FeatureTitle>
            <FeatureDescription>Automated voice reminders for patient care</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Health Analytics</FeatureTitle>
            <FeatureDescription>Comprehensive health data analysis and reporting</FeatureDescription>
          </FeatureCard>
        </FeaturesContainer>
        
        <StatsContainer>
          <StatCard>
            <StatNumber>10K+</StatNumber>
            <StatLabel>Patients Served</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>500+</StatNumber>
            <StatLabel>Doctors Registered</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>98%</StatNumber>
            <StatLabel>Patient Satisfaction</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Support Available</StatLabel>
          </StatCard>
        </StatsContainer>
        
        <QuoteContainer>
          <QuoteText>"The best way to take care of the future is to take care of the present moment."</QuoteText>
          <QuoteAuthor>- GoldenCare Buddy Team</QuoteAuthor>
        </QuoteContainer>
      </LeftPanel>
      
      <RightPanel>
        <RegisterFormContainer>
          <RegisterHeader>
            <RegisterTitle>Doctor Registration</RegisterTitle>
            <RegisterSubtitle>Join our network of healthcare professionals</RegisterSubtitle>
          </RegisterHeader>
          
          {message && (
            messageType === 'success' ? (
              <SuccessMessage>
                <span>✅</span>
                <span>{message}</span>
              </SuccessMessage>
            ) : (
              <ErrorMessage>
                <span>⚠️</span>
                <span>{message}</span>
              </ErrorMessage>
            )
          )}
          
          <InfoBox>
            <div className="title">📋 Registration Information</div>
            <div className="description">
              Please provide accurate information for verification. All fields marked with <span style={{ color: '#e53e3e' }}>*</span> are required.
              <ul>
                <li>You'll receive an email notification once your account is approved</li>
                <li>Document verification may take 1-2 business days</li>
                <li>Ensure all documents are clear and legible</li>
              </ul>
            </div>
          </InfoBox>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                First Name <span className="required">*</span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
                {errors.firstName && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.firstName}</span>
                  </div>
                )}
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                Last Name <span className="required">*</span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
                {errors.lastName && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.lastName}</span>
                  </div>
                )}
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                Email <span className="required">*</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.email}</span>
                  </div>
                )}
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                Phone Number <span className="required">*</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
                {errors.phone && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.phone}</span>
                  </div>
                )}
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                Specialization <span className="required">*</span>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Other">Other</option>
                </select>
                {errors.specialization && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.specialization}</span>
                  </div>
                )}
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                License Number <span className="required">*</span>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter your medical license number"
                  required
                />
                {errors.licenseNumber && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.licenseNumber}</span>
                  </div>
                )}
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                Years of Experience <span className="required">*</span>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  min="0"
                  max="50"
                  required
                />
                {errors.experience && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.experience}</span>
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
                  placeholder="Create a password"
                  required
                />
                {errors.password && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.password}</span>
                  </div>
                )}
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
                  placeholder="Confirm your password"
                  required
                />
                {errors.confirmPassword && (
                  <div className="error-message">
                    <span>⚠️</span>
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </Label>
            </FormGroup>
            
            <FormGroup className="full-width documents">
              <Label>
                Required Documents <span className="required">*</span>
                <div style={{ marginTop: '1rem' }}>
                  {documentInputs.map((doc, index) => (
                    <DocumentItem key={index}>
                      <div className="file-info">
                        <div className="file-name">
                          📄 Document {index + 1}
                        </div>
                        <div className="file-type">
                          <select
                            className="file-type"
                            value={doc.type}
                            onChange={(e) => handleDocumentChange(index, 'type', e.target.value)}
                            style={{ 
                              padding: '1.4rem 1.7rem', 
                              borderRadius: '1.2rem', 
                              border: '2px solid #e2e8f0',
                              background: '#f8fafc',
                              fontSize: '1.1rem',
                              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)',
                              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                          >
                            <option value="">Select document type</option>
                            <option value="medical_license">Medical License</option>
                            <option value="id_proof">ID Proof</option>
                            <option value="degree_certificate">Degree Certificate</option>
                            <option value="experience_letter">Experience Letter</option>
                          </select>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="file-input"
                        onChange={(e) => handleDocumentChange(index, 'file', e.target.files[0])}
                        style={{ 
                          padding: '1.4rem 1.7rem', 
                          borderRadius: '1.2rem', 
                          border: '2px solid #e2e8f0',
                          background: '#f8fafc',
                          fontSize: '1.1rem',
                          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)',
                          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                          flex: 1,
                          minWidth: 0,
                          boxSizing: 'border-box'
                        }}
                      />
                      {documentInputs.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeDocumentField(index)}
                        >
                          Remove
                        </button>
                      )}
                    </DocumentItem>
                  ))}
                  <button
                    type="button"
                    onClick={addDocumentField}
                    style={{
                      marginTop: '1rem',
                      padding: '1rem 1.8rem',
                      background: 'linear-gradient(135deg, #3182ce, #48bb78)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      width: 'fit-content',
                      margin: '1rem auto 0'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(49, 130, 206, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(49, 130, 206, 0.3)';
                    }}
                  >
                    <span>📁</span> Add Another Document
                  </button>
                </div>
                {errors.documents && (
                  <div className="error-message" style={{ marginTop: '0.5rem' }}>
                    <span>⚠️</span>
                    <span>{errors.documents}</span>
                  </div>
                )}
              </Label>
            </FormGroup>
            
            <SubmitBtn type="submit" disabled={loading}>
              {loading && <span className="loading"></span>}
              {loading ? 'Registering...' : 'Register as Doctor'}
            </SubmitBtn>
          </Form>
          
          <LoginLink to="/login">
            👤 Already have an account? Sign in
          </LoginLink>
          
          <BackLink to="/">
            ← Back to Home
          </BackLink>
        </RegisterFormContainer>
      </RightPanel>
    </Container>
  );
};

export default DoctorRegistration;