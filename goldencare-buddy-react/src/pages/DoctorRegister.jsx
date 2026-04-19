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

const RegisterContainer = styled.div`
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
`;

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
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

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-out;
  
  .icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: ${float} 4s ease-in-out infinite;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #1a202c;
  background: linear-gradient(135deg, #63b3ed, #48bb78);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  &.documents {
    grid-column: 1 / -1;
    background: #f8fafc;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px dashed #cbd5e0;
    animation: ${fadeIn} 1.2s ease-out;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
  color: #1a202c;
  font-size: 0.9rem;
  
  .required {
    color: #e53e3e;
  }
  
  input, select, textarea {
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
    
    &:invalid {
      border-color: #e53e3e;
    }
  }
  
  .file-input-container {
    display: flex;
    gap: 0.75rem;
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
    width: 150px;
    
    @media (max-width: 768px) {
      width: 100%;
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
  grid-column: 1 / -1;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(49, 130, 206, 0.3);
    animation: ${pulse} 2s infinite;
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
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
  grid-column: 1 / -1;
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
  grid-column: 1 / -1;
  animation: ${fadeIn} 0.3s ease-out;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  text-decoration: none;
  font-weight: 500;
  margin-top: 2rem;
  transition: all 0.2s ease;
  align-self: center;
  grid-column: 1 / -1;
  
  &:hover {
    color: #3182ce;
    transform: translateX(-5px);
  }
`;

const DocumentItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .file-info {
    flex: 1;
    
    .file-name {
      font-weight: 600;
      color: #1a202c;
    }
    
    .file-type {
      font-size: 0.8rem;
      color: #718096;
    }
  }
  
  .remove-btn {
    background: #fed7d7;
    color: #e53e3e;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    
    &:hover {
      background: #e53e3e;
      color: white;
    }
  }
`;

const LoginLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
  transition: all 0.2s ease;
  align-self: center;
  grid-column: 1 / -1;
  justify-content: center;
  
  &:hover {
    color: #2c5282;
    text-decoration: underline;
  }
`;

const DoctorRegister = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    doctorId: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    mobile: '',
    countryCode: '+91'
  });
  const [documents, setDocuments] = useState([]); // For document uploads
  const [newDocument, setNewDocument] = useState({ type: 'Medical License', file: null });
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

  const handleDocumentChange = (e) => {
    if (e.target.name === 'file') {
      setNewDocument({
        ...newDocument,
        file: e.target.files[0]
      });
    } else {
      setNewDocument({
        ...newDocument,
        [e.target.name]: e.target.value
      });
    }
  };

  const addDocument = () => {
    if (newDocument.file) {
      setDocuments([
        ...documents,
        {
          id: Date.now(),
          type: newDocument.type,
          file: newDocument.file,
          name: newDocument.file.name
        }
      ]);
      setNewDocument({ type: 'Medical License', file: null });
    }
  };

  const removeDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (documents.length === 0) {
      setError('Please upload at least one document for verification');
      setLoading(false);
      return;
    }

    try {
      // In a real implementation, we would upload documents to a storage service
      // and include the URLs in the registration request
      console.log('Documents to upload:', documents);
      
      // For demo purposes, we'll simulate document upload
      const documentUrls = documents.map((doc, index) => ({
        type: doc.type,
        fileName: doc.name,
        fileUrl: `https://example.com/documents/${index}_${doc.name}`
      }));
      
      // Register doctor
      const response = await doctorAPI.register({
        name: formData.name,
        email: formData.email,
        doctorId: formData.doctorId,
        password: formData.password,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        mobile: formData.mobile,
        countryCode: formData.countryCode,
        documents: documentUrls // In a real implementation, this would be the actual URLs
      });

      if (response.success) {
        setSuccess('Doctor registration requested successfully! Awaiting AI and admin verification.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          doctorId: '',
          password: '',
          confirmPassword: '',
          specialization: '',
          licenseNumber: '',
          yearsOfExperience: '',
          mobile: '',
          countryCode: '+91'
        });
        setDocuments([]);
      } else {
        setError(response.message || 'Error registering doctor');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Error registering doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <div className="icon">👨‍⚕️</div>
          <Title>Doctor Registration</Title>
          <Subtitle>
            Join our healthcare platform and start providing care to patients
          </Subtitle>
        </RegisterHeader>
        
        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorMessage>
              <span>⚠️</span>
              {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              <span>✅</span>
              {success}
            </SuccessMessage>
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
              />
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
            </Label>
          </FormGroup>
          
          <FormGroup>
            <Label>
              Doctor ID <span className="required">*</span>
              <input
                type="text"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                placeholder="Enter unique doctor ID"
                required
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
                placeholder="Enter password (min. 6 characters)"
                required
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
                placeholder="Confirm your password"
                required
              />
            </Label>
          </FormGroup>
          
          <FormGroup>
            <Label>
              Specialization <span className="required">*</span>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Geriatrics, Cardiology"
                required
              />
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
                placeholder="Enter medical license number"
                required
              />
            </Label>
          </FormGroup>
          
          <FormGroup>
            <Label>
              Years of Experience <span className="required">*</span>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="Enter years of experience"
                min="0"
                required
              />
            </Label>
          </FormGroup>
          
          <FormGroup className="full-width">
            <Label>
              Mobile Number <span className="required">*</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  style={{ width: '100px' }}
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  required
                  style={{ flex: 1 }}
                />
              </div>
            </Label>
          </FormGroup>
          
          <FormGroup className="full-width documents">
            <Label>
              Documents for Verification <span className="required">*</span>
              <p style={{ fontSize: '14px', color: '#666', margin: '8px 0 16px 0' }}>
                Upload documents for AI verification. Supported formats: PDF, JPG, PNG
              </p>
              
              {documents.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  {documents.map(doc => (
                    <DocumentItem key={doc.id}>
                      <div className="file-info">
                        <div className="file-name">{doc.name}</div>
                        <div className="file-type">{doc.type}</div>
                      </div>
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => removeDocument(doc.id)}
                      >
                        Remove
                      </button>
                    </DocumentItem>
                  ))}
                </div>
              )}
              
              <div className="file-input-container">
                <select
                  name="type"
                  value={newDocument.type}
                  onChange={handleDocumentChange}
                  className="file-type"
                >
                  <option value="Medical License">Medical License</option>
                  <option value="Degree Certificate">Degree Certificate</option>
                  <option value="ID Proof">ID Proof</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="file"
                  name="file"
                  onChange={handleDocumentChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="file-input"
                />
                <button 
                  type="button" 
                  onClick={addDocument}
                  disabled={!newDocument.file}
                  style={{
                    padding: '12px 24px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: newDocument.file ? 'pointer' : 'not-allowed',
                    opacity: newDocument.file ? 1 : 0.7
                  }}
                >
                  Add
                </button>
              </div>
            </Label>
          </FormGroup>
          
          <SubmitBtn type="submit" disabled={loading}>
            {loading && <span className="loading"></span>}
            {loading ? 'Registering...' : 'Register as Doctor'}
          </SubmitBtn>
        </Form>
        
        <LoginLink to="/login">
          Already have an account? Sign in
        </LoginLink>
        
        <BackLink to="/">
          ← Back to Home
        </BackLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default DoctorRegister;