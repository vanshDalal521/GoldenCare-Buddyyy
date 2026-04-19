import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doctorAPI } from '../services/apiService';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const AuthContainer = styled.div`
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
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="medical" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.02"/><path d="M20,25 L30,25 M25,20 L25,30" stroke="%23000" stroke-width="0.5" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23medical)"/></svg>') repeat;
    pointer-events: none;
  }
`;

const AuthCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: ${props => props.theme.spacing['4xl']};
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 1;
  border: 1px solid ${props => props.theme.colors.border};
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, 
      ${props => props.theme.colors.accent}20, 
      ${props => props.theme.colors.primary}20
    );
    border-radius: ${props => props.theme.borderRadius['2xl']};
    z-index: -1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing['2xl']};
  }
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  
  .icon {
    font-size: 3.5rem;
    margin-bottom: ${props => props.theme.spacing.lg};
    background: linear-gradient(135deg, ${props => props.theme.colors.accent}, ${props => props.theme.colors.primary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.muted};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  font-size: ${props => props.theme.fontSizes.lg};
  line-height: ${props => props.theme.lineHeights.relaxed};
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.muted};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  position: relative;
  
  &.active {
    color: ${props => props.theme.colors.primary};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 3px;
      background: ${props => props.theme.colors.primary};
      border-radius: 3px 3px 0 0;
    }
  }
  
  &:hover:not(.active) {
    color: ${props => props.theme.colors.text};
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  &.documents {
    grid-column: 1 / -1;
    background: ${props => props.theme.colors.bg};
    padding: ${props => props.theme.spacing.lg};
    border-radius: ${props => props.theme.borderRadius.lg};
    border: 1px dashed ${props => props.theme.colors.border};
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  
  .required {
    color: ${props => props.theme.colors.error};
  }
  
  input, select, textarea {
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
    
    &:invalid {
      border-color: ${props => props.theme.colors.error};
    }
  }
  
  .file-input-container {
    display: flex;
    gap: ${props => props.theme.spacing.md};
    align-items: center;
  }
  
  .file-input {
    flex: 1;
  }
  
  .file-type {
    width: 150px;
  }
`;

const SubmitBtn = styled.button`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  background: linear-gradient(135deg, ${props => props.theme.colors.accent}, ${props => props.theme.colors.primary});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;
  grid-column: 1 / -1;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
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
  grid-column: 1 / -1;
  
  .icon {
    font-size: ${props => props.theme.fontSizes.lg};
  }
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
  grid-column: 1 / -1;
  
  .icon {
    font-size: ${props => props.theme.fontSizes.lg};
  }
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
  grid-column: 1 / -1;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateX(-2px);
  }
`;

const DocumentItem = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: white;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .file-info {
    flex: 1;
    
    .file-name {
      font-weight: ${props => props.theme.fontWeights.semibold};
      color: ${props => props.theme.colors.text};
    }
    
    .file-type {
      font-size: ${props => props.theme.fontSizes.sm};
      color: ${props => props.theme.colors.muted};
    }
  }
  
  .remove-btn {
    background: ${props => props.theme.colors.errorLight};
    color: ${props => props.theme.colors.error};
    border: none;
    border-radius: ${props => props.theme.borderRadius.md};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    cursor: pointer;
    font-weight: ${props => props.theme.fontWeights.semibold};
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      background: ${props => props.theme.colors.error};
      color: white;
    }
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.infoLight};
  color: ${props => props.theme.colors.info};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.info}40;
  grid-column: 1 / -1;
  
  .title {
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  .description {
    font-size: ${props => props.theme.fontSizes.sm};
    opacity: 0.9;
  }
  
  ul {
    margin: ${props => props.theme.spacing.sm} 0;
    padding-left: ${props => props.theme.spacing.lg};
    
    li {
      margin-bottom: ${props => props.theme.spacing.xs};
    }
  }
`;

const DoctorAuth = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [loginData, setLoginData] = useState({
    doctorId: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
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

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await doctorAPI.login(
        loginData.doctorId,
        loginData.password
      );

      if (response.success) {
        // Store doctor session
        localStorage.setItem('gc_doctor_session', JSON.stringify({
          ...response.doctor,
          role: 'doctor',
          loginTime: Date.now()
        }));

        setSuccess('Login successful! Redirecting to dashboard...');
        
        // Redirect to doctor dashboard after a short delay
        setTimeout(() => {
          navigate('/doctor-dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials or account not verified. Please make sure you have registered and been verified by an admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
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
        name: registerData.name,
        email: registerData.email,
        doctorId: registerData.doctorId,
        password: registerData.password,
        specialization: registerData.specialization,
        licenseNumber: registerData.licenseNumber,
        yearsOfExperience: parseInt(registerData.yearsOfExperience),
        mobile: registerData.mobile,
        countryCode: registerData.countryCode,
        documents: documentUrls // In a real implementation, this would be the actual URLs
      });

      if (response.success) {
        setSuccess('Doctor registration requested successfully! Awaiting AI and admin verification. You will receive an email when your account is approved.');
        
        // Reset form
        setRegisterData({
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
        
        // Switch to login tab after a short delay
        setTimeout(() => {
          setActiveTab('login');
        }, 3000);
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
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <div className="icon">👨‍⚕️</div>
          <Title>Doctor Portal</Title>
          <Subtitle>
            Access your doctor dashboard or register as a new doctor
          </Subtitle>
        </AuthHeader>
        
        <TabContainer>
          <Tab 
            className={activeTab === 'login' ? 'active' : ''} 
            onClick={() => setActiveTab('login')}
          >
            Login
          </Tab>
          <Tab 
            className={activeTab === 'register' ? 'active' : ''} 
            onClick={() => setActiveTab('register')}
          >
            Register
          </Tab>
        </TabContainer>
        
        {activeTab === 'login' ? (
          <>
            <InfoBox>
              <div className="title">Verification Required</div>
              <div className="description">
                Only verified doctors can access the dashboard. If you haven't registered yet, please use the Register tab.
              </div>
            </InfoBox>
            
            <Form onSubmit={handleLogin}>
              {error && (
                <ErrorMessage>
                  <span className="icon">⚠️</span>
                  {error}
                </ErrorMessage>
              )}
              
              {success && (
                <SuccessMessage>
                  <span className="icon">✅</span>
                  {success}
                </SuccessMessage>
              )}
              
              <FormGroup className="full-width">
                <Label>
                  Doctor ID or Email <span className="required">*</span>
                  <input
                    type="text"
                    name="doctorId"
                    value={loginData.doctorId}
                    onChange={handleLoginChange}
                    placeholder="Enter your Doctor ID or email"
                    required
                    autoComplete="username"
                  />
                </Label>
              </FormGroup>
              
              <FormGroup className="full-width">
                <Label>
                  Password <span className="required">*</span>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
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
          </>
        ) : (
          <>
            <InfoBox>
              <div className="title">Verification Process</div>
              <div className="description">
                <ul>
                  <li>AI verification will automatically review your documents</li>
                  <li>An admin will manually verify your credentials</li>
                  <li>You'll receive an email when your account is approved</li>
                  <li>Only verified doctors can access the dashboard</li>
                </ul>
              </div>
            </InfoBox>
            
            <Form onSubmit={handleRegister}>
              {error && (
                <ErrorMessage>
                  <span className="icon">⚠️</span>
                  {error}
                </ErrorMessage>
              )}
              
              {success && (
                <SuccessMessage>
                  <span className="icon">✅</span>
                  {success}
                </SuccessMessage>
              )}
              
              <FormGroup>
                <Label>
                  Full Name <span className="required">*</span>
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
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
                    value={registerData.email}
                    onChange={handleRegisterChange}
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
                    value={registerData.doctorId}
                    onChange={handleRegisterChange}
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
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="Enter password"
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
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Confirm password"
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
                    value={registerData.specialization}
                    onChange={handleRegisterChange}
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
                    value={registerData.licenseNumber}
                    onChange={handleRegisterChange}
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
                    value={registerData.yearsOfExperience}
                    onChange={handleRegisterChange}
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
                      value={registerData.countryCode}
                      onChange={handleRegisterChange}
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
                      value={registerData.mobile}
                      onChange={handleRegisterChange}
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
          </>
        )}
        
        <BackLink to="/login">
          ← Back to main login
        </BackLink>
      </AuthCard>
    </AuthContainer>
  );
};

export default DoctorAuth;