import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doctorAPI } from '../services/apiService';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}10 50%, 
    ${props => props.theme.colors.accentLight}10 100%
  );
  padding: ${props => props.theme.spacing.xl};
  position: relative;
`;

const ProfileCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing.xl};
  position: relative;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: ${props => props.theme.spacing.md};
    padding: ${props => props.theme.spacing.lg};
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
  
  .name {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  .doctor-id {
    background: ${props => props.theme.colors.primaryLight}20;
    color: ${props => props.theme.colors.primary};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.full};
    font-weight: ${props => props.theme.fontWeights.semibold};
    display: inline-block;
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.lg};
  margin: 0;
  margin-top: ${props => props.theme.spacing.xl};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const InfoLabel = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const InfoValue = styled.div`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.text};
  word-break: break-all;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: ${props => props.$secondary ? 'transparent' : `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})`};
  color: ${props => props.$secondary ? props.theme.colors.text : 'white'};
  border: ${props => props.$secondary ? `1px solid ${props.theme.colors.border}` : 'none'};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.errorLight};
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DoctorProfile = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        const doctorSession = localStorage.getItem('gc_doctor_session');
        if (!doctorSession) {
          navigate('/login');
          return;
        }
        
        const doctor = JSON.parse(doctorSession);
        const response = await doctorAPI.getProfile(doctor.doctorId);
        
        if (response.success) {
          setDoctorData(response.doctor);
        } else {
          setError(response.message || 'Failed to fetch doctor profile');
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Failed to fetch doctor profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctorProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('gc_doctor_session');
    navigate('/login');
  };

  const handleBackToDashboard = () => {
    navigate('/doctor-dashboard');
  };

  if (loading) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <LoadingSpinner />
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
                {doctorData?.name ? doctorData.name.charAt(0).toUpperCase() : 'D'}
              </div>
            </div>
          </div>
          <h1 className="name">{doctorData?.name || 'Doctor Name'}</h1>
          <div className="doctor-id">ID: {doctorData?.doctorId || 'N/A'}</div>
          <Subtitle>Your personal information</Subtitle>
        </ProfileHeader>
        
        {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
        
        {doctorData && (
          <>
            <InfoGrid>
              <InfoCard>
                <InfoLabel>Name</InfoLabel>
                <InfoValue>{doctorData.name}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{doctorData.email}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Doctor ID</InfoLabel>
                <InfoValue>{doctorData.doctorId}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Specialization</InfoLabel>
                <InfoValue>{doctorData.specialization}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Mobile</InfoLabel>
                <InfoValue>{doctorData.fullMobile || doctorData.mobile}</InfoValue>
              </InfoCard>
            </InfoGrid>
            
            <ButtonGroup>
              <Button onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>
              <Button $secondary onClick={handleLogout}>
                Logout
              </Button>
            </ButtonGroup>
          </>
        )}
      </ProfileCard>
    </ProfileContainer>
  );
};

export default DoctorProfile;