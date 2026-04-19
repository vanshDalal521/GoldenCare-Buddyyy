import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { patientAPI } from '../services/apiService';

const ProfileContainer = styled.div`
  min-height: 100vh;
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="profile-pattern" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="%23000" opacity="0.03"/><path d="M15,20 L25,20 M20,15 L20,25" stroke="%23000" stroke-width="0.5" opacity="0.03"/></pattern></defs><rect width="100" height="100" fill="url(%23profile-pattern)"/></svg>') repeat;
    pointer-events: none;
  }
`;

const ProfileCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: ${props => props.theme.spacing['4xl']};
  max-width: 800px;
  margin: 0 auto;
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
      ${props => props.theme.colors.primary}20, 
      ${props => props.theme.colors.accent}20
    );
    border-radius: ${props => props.theme.borderRadius['2xl']};
    z-index: -1;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing['2xl']};
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['3xl']};
  
  .avatar-container {
    position: relative;
    display: inline-block;
    margin: 0 auto ${props => props.theme.spacing.lg};
  }
  
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: white;
    border: 4px solid white;
    box-shadow: ${props => props.theme.shadows.lg};
    overflow: hidden;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .edit-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    background: ${props => props.theme.colors.primary};
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: ${props => props.theme.shadows.md};
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      background: ${props => props.theme.colors.primaryDark};
      transform: scale(1.1);
    }
  }
  
  .name {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  .patient-id {
    background: ${props => props.theme.colors.primaryLight}20;
    color: ${props => props.theme.colors.primary};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.full};
    font-weight: ${props => props.theme.fontWeights.semibold};
    display: inline-block;
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

const Section = styled.div`
  margin-bottom: ${props => props.theme.spacing['3xl']};
  
  .section-title {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.xl};
    padding-bottom: ${props => props.theme.spacing.md};
    border-bottom: 2px solid ${props => props.theme.colors.border};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.md};
    
    .icon {
      font-size: 1.5rem;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  
  .label {
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.fontSizes.sm};
  }
  
  .value {
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.text};
    padding: ${props => props.theme.spacing.md};
    background: ${props => props.theme.colors.bg};
    border-radius: ${props => props.theme.borderRadius.lg};
    border: 1px solid ${props => props.theme.colors.border};
  }
  
  .editable {
    cursor: pointer;
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      border-color: ${props => props.theme.colors.primary};
      background: ${props => props.theme.colors.primaryLight}10;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
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
`;

const Input = styled.input`
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
`;

const SubmitBtn = styled.button`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  position: relative;
  overflow: hidden;
  
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

const CancelBtn = styled.button`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.muted};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.theme.colors.mutedDark};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
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
  
  .icon {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`;

const ProfilePicOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProfilePicOption = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  transition: all ${props => props.theme.transitions.normal};
  background: ${props => props.theme.colors.bg};
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &.default {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    color: white;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ActionButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.primary {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
    color: white;
  }
  
  &.secondary {
    background: ${props => props.theme.colors.bg};
    color: ${props => props.theme.colors.text};
    border: 1px solid ${props => props.theme.colors.border};
  }
  
  &.danger {
    background: linear-gradient(135deg, ${props => props.theme.colors.error}, ${props => props.theme.colors.errorDark});
    color: white;
  }
  
  &.cancel {
    background: ${props => props.theme.colors.muted};
    color: white;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
`;

const EditImageControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
  justify-content: center;
`;

const EditImageButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.remove {
    background: linear-gradient(135deg, ${props => props.theme.colors.error}, ${props => props.theme.colors.errorDark});
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.xl};
    font-size: ${props => props.theme.fontSizes.md};
  }
`;

const RemoveButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: linear-gradient(135deg, #e53e3e, #c53030);
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: 0 4px 6px rgba(229, 62, 62, 0.2);
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    background: linear-gradient(135deg, #c53030, #9b2c2c);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(229, 62, 62, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(229, 62, 62, 0.2);
  }
`;

const Profile = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showProfilePicOptions, setShowProfilePicOptions] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Professional avatar options
  const profilePicOptions = [
    'https://i.pravatar.cc/150?img=1', 
    'https://i.pravatar.cc/150?img=2', 
    'https://i.pravatar.cc/150?img=3', 
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5', 
    'https://i.pravatar.cc/150?img=6', 
    'https://i.pravatar.cc/150?img=7', 
    'https://i.pravatar.cc/150?img=8'
  ];

  useEffect(() => {
    const fetchPatientData = () => {
      try {
        const patientSession = localStorage.getItem('gc_patient_session');
        if (!patientSession) {
          navigate('/login');
          return;
        }

        const patient = JSON.parse(patientSession);
        setPatientData(patient);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [navigate]);

  const handleEditField = (field, value) => {
    setEditingField(field);
    setEditForm({ [field]: value });
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditForm({});
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // In a real implementation, you would call the API to update the field
      // For now, we'll just update the local state
      setPatientData(prev => ({
        ...prev,
        ...editForm
      }));
      
      setSuccess('Profile updated successfully');
      setEditingField(null);
      setEditForm({});
      
      // Update localStorage
      const updatedSession = {
        ...patientData,
        ...editForm
      };
      localStorage.setItem('gc_patient_session', JSON.stringify(updatedSession));
      
      // Dispatch storage event to update header
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'gc_patient_session',
        newValue: JSON.stringify(updatedSession)
      }));
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingField) {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setChangePasswordForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setChangingPassword(true);

    try {
      if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (changePasswordForm.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // In a real implementation, you would call the API to change the password
      // For now, we'll just show a success message
      setSuccess('Password changed successfully');
      setChangePasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gc_patient_session');
    navigate('/');
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        updateProfilePic(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectProfilePic = (pic) => {
    updateProfilePic(pic);
    setShowProfilePicOptions(false);
  };

  const updateProfilePic = (picData) => {
    try {
      const updatedPatient = {
        ...patientData,
        profilePic: picData
      };
      
      setPatientData(updatedPatient);
      setSuccess('Profile picture updated successfully');
      
      // Update localStorage
      localStorage.setItem('gc_patient_session', JSON.stringify(updatedPatient));
      
      // Dispatch storage event to update header
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'gc_patient_session',
        newValue: JSON.stringify(updatedPatient)
      }));
    } catch (err) {
      setError('Failed to update profile picture');
    }
  };

  const removeProfilePic = () => {
    try {
      const updatedPatient = {
        ...patientData,
        profilePic: null
      };
      
      setPatientData(updatedPatient);
      setSuccess('Profile picture removed successfully');
      
      // Update localStorage
      localStorage.setItem('gc_patient_session', JSON.stringify(updatedPatient));
      
      // Dispatch storage event to update header
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'gc_patient_session',
        newValue: JSON.stringify(updatedPatient)
      }));
    } catch (err) {
      setError('Failed to remove profile picture');
    }
  };

  if (loading) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading profile...
          </div>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <ErrorMessage>
            <span className="icon">⚠️</span>
            {error}
          </ErrorMessage>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <div className="avatar-container">
            <div className="avatar">
              {patientData?.profilePic ? (
                <img 
                  src={patientData.profilePic} 
                  alt="Profile" 
                  className="avatar-image"
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #3182ce, #48bb78)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '3rem'
                }}>
                  {patientData?.name ? patientData.name.charAt(0).toUpperCase() : 'P'}
                </div>
              )}
            </div>
            <div 
              className="edit-overlay"
              onClick={() => setShowProfilePicOptions(!showProfilePicOptions)}
              title="Change profile picture"
            >
              ✏️
            </div>
          </div>
          
          {showProfilePicOptions && (
            <div style={{ marginBottom: '1rem' }}>
              <ButtonContainer>
                <ActionButton 
                  className="primary" 
                  onClick={() => fileInputRef.current.click()}
                >
                  <span>📁</span>
                  <span>Upload Photo</span>
                </ActionButton>
                <RemoveButton 
                  onClick={() => {
                    setShowProfilePicOptions(false);
                    removeProfilePic();
                  }}
                >
                  <span>🗑️</span>
                  <span>Remove Image</span>
                </RemoveButton>
                <ActionButton 
                  className="cancel" 
                  onClick={() => setShowProfilePicOptions(false)}
                >
                  <span>❌</span>
                  <span>Cancel</span>
                </ActionButton>
              </ButtonContainer>
              
              <ProfilePicOptions>
                <ProfilePicOption 
                  selected={!patientData?.profilePic}
                  onClick={() => updateProfilePic(null)}
                  className="default"
                >
                  {patientData?.name ? patientData.name.charAt(0).toUpperCase() : 'P'}
                </ProfilePicOption>
                {profilePicOptions.map((pic, index) => (
                  <ProfilePicOption 
                    key={index}
                    selected={patientData?.profilePic === pic}
                    onClick={() => handleSelectProfilePic(pic)}
                  >
                    <img 
                      src={pic} 
                      alt={`Avatar ${index + 1}`} 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </ProfilePicOption>
                ))}
              </ProfilePicOptions>
            </div>
          )}
          
          {patientData?.profilePic && !showProfilePicOptions && (
            <EditImageControls>
              <EditImageButton onClick={() => fileInputRef.current.click()}>
                Edit Image
              </EditImageButton>
              <EditImageButton 
                className="remove" 
                onClick={removeProfilePic}
              >
                Remove Image
              </EditImageButton>
            </EditImageControls>
          )}
          
          <FileInput
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicUpload}
            accept="image/*"
          />
          
          <h1 className="name">{patientData?.name || 'Patient Name'}</h1>
          <div className="patient-id">ID: {patientData?.patientId || 'N/A'}</div>
        </ProfileHeader>

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

        <Section>
          <h2 className="section-title">
            <span className="icon">📋</span>
            Account Information
          </h2>
          <InfoGrid>
            <InfoItem>
              <div className="label">Full Name</div>
              {editingField === 'name' ? (
                <Form onSubmit={handleSaveEdit}>
                  <Input
                    type="text"
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                  <ButtonGroup>
                    <SubmitBtn type="submit">Save</SubmitBtn>
                    <CancelBtn type="button" onClick={handleCancelEdit}>Cancel</CancelBtn>
                  </ButtonGroup>
                </Form>
              ) : (
                <div 
                  className="value editable" 
                  onClick={() => handleEditField('name', patientData?.name || '')}
                >
                  {patientData?.name || 'N/A'}
                </div>
              )}
            </InfoItem>

            <InfoItem>
              <div className="label">Patient ID</div>
              <div className="value">{patientData?.patientId || 'N/A'}</div>
            </InfoItem>

            <InfoItem>
              <div className="label">Username</div>
              <div className="value">{patientData?.patientId || 'N/A'}</div>
            </InfoItem>

            <InfoItem>
              <div className="label">Phone Number</div>
              {editingField === 'mobile' ? (
                <Form onSubmit={handleSaveEdit}>
                  <Input
                    type="tel"
                    name="mobile"
                    value={editForm.mobile || ''}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                  <ButtonGroup>
                    <SubmitBtn type="submit">Save</SubmitBtn>
                    <CancelBtn type="button" onClick={handleCancelEdit}>Cancel</CancelBtn>
                  </ButtonGroup>
                </Form>
              ) : (
                <div 
                  className="value editable" 
                  onClick={() => handleEditField('mobile', patientData?.mobile || '')}
                >
                  {patientData?.mobile ? `${patientData.mobile.substring(0, 3)}-${patientData.mobile.substring(3, 6)}-${patientData.mobile.substring(6)}` : 'N/A'}
                </div>
              )}
            </InfoItem>

            <InfoItem>
              <div className="label">Account Created</div>
              <div className="value">
                {patientData?.loginTime ? new Date(patientData.loginTime).toLocaleDateString() : 'N/A'}
              </div>
            </InfoItem>

            <InfoItem>
              <div className="label">Last Login</div>
              <div className="value">
                {patientData?.loginTime ? new Date(patientData.loginTime).toLocaleString() : 'N/A'}
              </div>
            </InfoItem>
          </InfoGrid>
        </Section>

        <Section>
          <h2 className="section-title">
            <span className="icon">🔒</span>
            Change Password
          </h2>
          <Form onSubmit={handleChangePassword}>
            <FormGroup>
              <Label>
                Current Password <span className="required">*</span>
                <Input
                  type="password"
                  name="currentPassword"
                  value={changePasswordForm.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                New Password <span className="required">*</span>
                <Input
                  type="password"
                  name="newPassword"
                  value={changePasswordForm.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                Confirm New Password <span className="required">*</span>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={changePasswordForm.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </Label>
            </FormGroup>

            <SubmitBtn type="submit" disabled={changingPassword}>
              {changingPassword && <span className="loading"></span>}
              {changingPassword ? 'Changing Password...' : 'Change Password'}
            </SubmitBtn>
          </Form>
        </Section>

        <Section>
          <h2 className="section-title">
            <span className="icon">⚙️</span>
            Account Management
          </h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn secondary"
              onClick={handleLogout}
              style={{ 
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              🔐 Logout
            </button>
            <button 
              className="btn error"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // In a real implementation, you would call the API to delete the account
                  handleLogout();
                }
              }}
              style={{ 
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              🗑️ Delete Account
            </button>
          </div>
        </Section>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;