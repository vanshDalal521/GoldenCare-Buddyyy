import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { patientAPI } from '../services/apiService';
import medicationEventService from '../services/medicationEventService.js';
import medicalRecordService from '../services/medicalRecordService';
import LiquidBackground from '../components/LiquidBackground.jsx';

const DashboardSection = styled.section`
  padding: ${props => props.theme.spacing['4xl']} 0;
  min-height: calc(100vh - 100px);
  position: relative;
  overflow: hidden;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing['2xl']};
  
  @media (min-width: ${props => props.theme.breakpoints.desktop}) {
    grid-template-columns: minmax(0, 2fr) 300px;
    align-items: start;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing['2xl']};

  @media (max-width: ${props => props.theme.breakpoints.desktop}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;


const DashboardCard = styled.div`
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  padding: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  
  &:hover {
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.6);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.primaryDark};
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
  }
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.8), rgba(66, 153, 225, 0.8));
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing['4xl']};
  margin-bottom: ${props => props.theme.spacing['3xl']};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    z-index: 1;
  }
  
  h2 {
    margin: 0 0 ${props => props.theme.spacing.sm} 0;
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.extrabold};
    position: relative;
    z-index: 2;
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: ${props => props.theme.fontSizes['2xl']};
    }
  }
  
  p {
    margin: 0;
    opacity: 0.95;
    font-size: ${props => props.theme.fontSizes.lg};
    position: relative;
    z-index: 2;
  }
`;

const MedicationCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.xl};
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: ${props => props.theme.borderRadius.xl};
  margin-bottom: ${props => props.theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MedicationIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
`;

const MedicationInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 4px 0;
    color: ${props => props.theme.colors.text};
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: ${props => props.theme.colors.muted};
    font-size: 14px;
  }
`;

const StatusBadge = styled.div`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  
  &.taken {
    background: rgba(16, 185, 129, 0.1);
    color: ${props => props.theme.colors.success};
  }
  
  &.pending {
    background: rgba(245, 158, 11, 0.1);
    color: ${props => props.theme.colors.warning};
  }
  
  &.missed {
    background: rgba(239, 68, 68, 0.1);
    color: ${props => props.theme.colors.error};
  }
`;

const UploadCard = styled(DashboardCard)`
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primaryLight}10 0%,
    ${props => props.theme.colors.accentLight}10 100%
  );
  border: 2px dashed ${props => props.theme.colors.primary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  text-align: center;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight}20;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.primary};
`;

const UploadTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  font-weight: ${props => props.theme.fontWeights.bold};
`;

const UploadDescription = styled.p`
  color: ${props => props.theme.colors.muted};
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
`;

const FileInput = styled.input`
  display: none;
`;

const QuickAction = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.lg};
  border: 1.5px solid ${props => props.theme.colors.primary}40;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  color: ${props => props.theme.colors.primaryDark};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  margin-bottom: ${props => props.theme.spacing.md};
  text-align: left;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 8px 20px ${props => props.theme.colors.primary}30;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ReportCard = styled.div`
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const ReportItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: translateX(4px);
  }
`;

const AnalyzeButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ef4444;
    color: white;
    transform: scale(1.05);
  }
`;

const AnalysisCard = styled(DashboardCard)`
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid ${props => props.theme.colors.primary}30;
  animation: slideIn 0.5s cubic-bezier(0.19, 1, 0.22, 1);

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

const ScanningOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, transparent, ${props => props.theme.colors.primary}, transparent);
  animation: scan 2s linear infinite;
  z-index: 10;

  @keyframes scan {
    0% { top: 0; }
    100% { top: 100%; }
  }
`;

const MedicationTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: 16px;

  th {
    text-align: left;
    padding: 8px 12px;
    color: ${props => props.theme.colors.muted};
    font-size: 13px;
    font-weight: 600;
  }

  td {
    padding: 12px;
    background: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    border-top: 1px solid rgba(0,0,0,0.03);
    border-bottom: 1px solid rgba(0,0,0,0.03);

    &:first-child {
      border-left: 1px solid rgba(0,0,0,0.03);
      border-radius: 8px 0 0 8px;
      font-weight: 600;
      color: ${props => props.theme.colors.primaryDark};
    }

    &:last-child {
      border-right: 1px solid rgba(0,0,0,0.03);
      border-radius: 0 8px 8px 0;
    }
  }
`;


const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};

  .title {
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes.sm};
  }

  .date {
    font-size: ${props => props.theme.fontSizes.xs};
    color: ${props => props.theme.colors.muted};
  }
`;

const ReportContent = styled.div`
  color: ${props => props.theme.colors.mutedDark};
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.6;
`;

const Button = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;


const PatientDashboard = () => {
  const { t, language } = useLanguage();
  // State for medications and patient name
  const [medications, setMedications] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [forceRefresh, setForceRefresh] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null
  });
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  // Create a ref to store the loadMedications function so it can be called externally
  const loadMedicationsRef = useRef();

  // Function to trigger manual refresh
  const refreshMedications = () => {
    setForceRefresh(true);
    setLastUpdate(Date.now());
  };

  // Make refreshMedications available globally for doctor updates
  useEffect(() => {
    window.refreshPatientMedications = refreshMedications;
    return () => {
      delete window.refreshPatientMedications;
    };
  }, []);

  const navigate = useNavigate();

  // Re-render when language changes
  useEffect(() => {
    // This effect will run whenever the language changes
    // It ensures that all translated content is updated
  }, [language]);

  // Refresh medications when window becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[PatientDashboard] Window became visible, refreshing medications');
        setForceRefresh(true);
        setLastUpdate(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Load patient medications and poll for updates
  useEffect(() => {
    console.log(`[PatientDashboard] useEffect triggered. forceRefresh: ${forceRefresh}`);
    // Set patient name from session
    const patientSession = localStorage.getItem('gc_patient_session');
    const patientUser = patientSession ? JSON.parse(patientSession) : null;
    const currentPatientId = patientUser?.patientId;

    console.log(`[PatientDashboard] Current patient ID: ${currentPatientId}`);
    console.log(`[PatientDashboard] Patient ID type: ${typeof currentPatientId}, value: "${currentPatientId}"`);
    // Normalize patientId to string for consistent comparison
    const normalizedPatientId = currentPatientId ? String(currentPatientId) : null;
    console.log(`[PatientDashboard] Normalized patient ID: ${normalizedPatientId}`);
    
    // Log medication event service state
    console.log(`[PatientDashboard] MedicationEventService state:`, {
      registeredPatientIds: medicationEventService.getRegisteredPatientIds(),
      listenerCount: normalizedPatientId ? medicationEventService.getListenerCount(normalizedPatientId) : 0
    });

    if (patientUser?.name) {
      setPatientName(patientUser.name);
    }

    // Load medications initially
    const loadMedications = async () => {
      try {
        const patientSession = localStorage.getItem('gc_patient_session');
        if (!patientSession) {
          // If no patient session, don't try to fetch medications
          console.log('[PatientDashboard] No patient session found, setting medications to empty array');
          setMedications([]);
          return;
        }
        
        const patientUser = JSON.parse(patientSession);
        const currentPatientId = patientUser?.patientId;
        
        // If no valid patient ID, don't fetch medications
        if (!currentPatientId) {
          console.log('[PatientDashboard] No valid patient ID found, setting medications to empty array');
          setMedications([]);
          return;
        }
        
        console.log(`[PatientDashboard] Loading medications for patient ${currentPatientId}`);
        console.log(`[PatientDashboard] Patient ID type: ${typeof currentPatientId}, value: "${currentPatientId}"`);
        // Normalize patientId to string for consistent comparison
        const normalizedPatientId = String(currentPatientId);
        console.log(`[PatientDashboard] Normalized patient ID: ${normalizedPatientId}`);
        
        if (patientUser?.name) {
          setPatientName(patientUser.name);
        }
        
        const response = await patientAPI.getMedications(normalizedPatientId);
        console.log(`[PatientDashboard] Medication API response for patient ${normalizedPatientId}:`, response);
        
        if (response.success) {
          // Add status based on time and taken history
          const medsWithStatus = response.medications.map(med => {
            const today = new Date().toDateString();
            const takenToday = med.takenHistory?.some(entry => 
              new Date(entry.timestamp).toDateString() === today
            );
            
            const timeMap = {
              'Morning': '8:00 AM',
              'Afternoon': '2:00 PM',
              'Evening': '6:00 PM',
              'Night': '10:00 PM'
            };

            return {
              ...med,
              time: timeMap[med.slot] || '8:00 AM',
              status: takenToday ? 'taken' : 'pending'
            };
          });
          
          console.log(`[PatientDashboard] Processed medications with status for patient ${normalizedPatientId}:`, medsWithStatus);
          
          // Always update state when forceRefresh is true, otherwise only update if medications have actually changed
          if (forceRefresh) {
            console.log('[PatientDashboard] Force refresh - updating medications:', medsWithStatus);
            setMedications(medsWithStatus);
            console.log('[PatientDashboard] Resetting forceRefresh to false');
            setForceRefresh(false); // Reset forceRefresh flag
          } else {
            setMedications(prevMeds => {
              // Sort medications by ID to ensure consistent ordering
              const sortedPrevMeds = [...prevMeds].sort((a, b) => a.id?.localeCompare(b.id) || a._id?.localeCompare(b._id));
              const sortedNewMeds = [...medsWithStatus].sort((a, b) => a.id?.localeCompare(b.id) || a._id?.localeCompare(b._id));
              
              const prevMedsStr = JSON.stringify(sortedPrevMeds);
              const newMedsStr = JSON.stringify(sortedNewMeds);
              
              if (prevMedsStr !== newMedsStr) {
                console.log('[PatientDashboard] Medications updated:', medsWithStatus);
                return medsWithStatus;
              }
              console.log('[PatientDashboard] No medication changes detected');
              return prevMeds;
            });
          }
        } else {
          console.log('[PatientDashboard] API response not successful, setting medications to empty array');
          setMedications([]);
        }
      } catch (error) {
        console.error('Error fetching medications:', error);
        // Set medications to empty array on error
        setMedications([]);
      }
    };

    // Load medications immediately
    loadMedications();

    // Set up polling for updates (Reduced frequency for better performance)
    const pollInterval = setInterval(() => {
      console.log('[PatientDashboard] Polling for medication updates');
      loadMedications();
    }, 30000); // 30 seconds is sufficient with real-time events

    // Subscribe to medication events for this patient
    let unsubscribe = null;
    if (normalizedPatientId) {
      console.log(`[PatientDashboard] Subscribing to medication updates for patient ${normalizedPatientId}`);
      console.log(`[PatientDashboard] Patient ID type: ${typeof normalizedPatientId}, value: "${normalizedPatientId}"`);
      console.log(`[PatientDashboard] MedicationEventService state before subscription:`, {
        registeredPatientIds: medicationEventService.getRegisteredPatientIds(),
        listenerCount: medicationEventService.getListenerCount(normalizedPatientId)
      });
      unsubscribe = medicationEventService.subscribe(normalizedPatientId, () => {
        console.log(`[PatientDashboard] Received medication update event for patient ${normalizedPatientId}`);
        console.log(`[PatientDashboard] Setting forceRefresh to true`);
        setForceRefresh(true);
        setLastUpdate(Date.now());
        loadMedications();
      });
      console.log(`[PatientDashboard] Subscription completed for patient ${normalizedPatientId}`);
      console.log(`[PatientDashboard] MedicationEventService state after subscription:`, {
        registeredPatientIds: medicationEventService.getRegisteredPatientIds(),
        listenerCount: medicationEventService.getListenerCount(normalizedPatientId)
      });
    }
    
    // Also listen for global medication update events
    const handleGlobalMedicationUpdate = (event) => {
      const { patientId } = event.detail;
      // Only update if this event is for the current patient
      if (String(patientId) === normalizedPatientId) {
        console.log(`[PatientDashboard] Received global medication update event for patient ${patientId}`);
        console.log(`[PatientDashboard] Setting forceRefresh to true`);
        setForceRefresh(true);
        setLastUpdate(Date.now());
        loadMedications();
      } else {
        console.log(`[PatientDashboard] Global medication update event for patient ${patientId} ignored (current patient: ${normalizedPatientId})`);
        // As a fallback, refresh medications for any update
        console.log(`[PatientDashboard] Fallback: Refreshing medications due to global update`);
        setForceRefresh(true);
        setLastUpdate(Date.now());
        loadMedications();
      }
    };
    
    window.addEventListener('medicationUpdate', handleGlobalMedicationUpdate);

    // Cleanup function
    return () => {
      console.log('[PatientDashboard] Cleaning up useEffect');
      clearInterval(pollInterval);
      if (unsubscribe) {
        console.log(`[PatientDashboard] Unsubscribing from medication updates for patient ${normalizedPatientId}`);
        unsubscribe();
      }
      window.removeEventListener('medicationUpdate', handleGlobalMedicationUpdate);
    };
  }, [lastUpdate, forceRefresh]);

  // Direct translation properties that will update when language changes
  const welcomeTitle = t('welcome_back', { name: patientName });
  const healthOverview = t('here_is_your_health');
  const medicationsTitle = t('todays_medications', { count: medications.length });
  const noMedsTitle = t('no_medications_yet');
  const noMedsDescription = t('no_medications_prescribed');
  const healthSummaryTitle = t('health_summary');
  const medicationsTaken = t('medications_taken', { count: medications.filter(m => m.status === 'taken').length });
  const medicationsPending = t('medications_pending', { count: medications.filter(m => m.status === 'pending').length });
  const noMedsSummary = t('no_medications_prescribed_summary');
  const hydrationStatus = t('hydration_status');
  const breathingExercise = t('breathing_exercise_completed');
  const quickActionsTitle = t('quick_actions');
  const markMedTaken = t('mark_medication_taken');
  const logWater = t('log_water_intake');
  const startBreathing = t('start_breathing_exercise');
  const viewMessages = t('view_family_messages');
  const viewProfile = t('view_my_profile'); // Added this translation
  const todayTipsTitle = t('todays_tips');
  const tip1 = t('take_afternoon_medication');
  const tip2 = t('drink_water');
  const tip3 = t('practice_deep_breathing');
  const tip4 = t('get_gentle_movement');
  const familyMessagesTitle = t('family_messages');
  const message1 = t('how_are_you_feeling');
  const message2 = t('dont_forget_vitamins');
  const prescribedBy = t('prescribed_by');
  const statusTaken = t('status_taken');
  const statusPending = t('status_pending');
  const statusMissed = t('status_missed');

  const getStatusClass = (status) => {
    switch (status) {
      case 'taken': return 'taken';
      case 'pending': return 'pending';
      case 'missed': return 'missed';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'taken': return statusTaken;
      case 'pending': return statusPending;
      case 'missed': return statusMissed;
      default: return statusPending;
    }
  };

  // Helper to render formatted explanation text
  const renderExplanation = (text) => {
    if (!text) return null;
    
    // Split by lines and process basic markdown
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Headers (### Header)
      if (line.startsWith('### ')) {
        return <h4 key={i} style={{ color: '#1e293b', marginTop: '20px', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>{line.replace('### ', '')}</h4>;
      }
      
      // Bolding (**Text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const processedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: '#4f46e5' }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      
      return <div key={i} style={{ marginBottom: '8px' }}>{processedLine}</div>;
    });
  };

  const [email, setEmail] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!email) return;
    setUpdatingEmail(true);
    try {
      const session = localStorage.getItem('gc_patient_session');
      if (!session) return;
      const { token } = JSON.parse(session);
      
      await patientAPI.updateProfile(token, { email });
      setUploadSuccess(true); // Reuse for success feedback
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Failed to update email');
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData(prev => ({
        ...prev,
        file: file
      }));
      
      // Automatically upload the file
      uploadFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const uploadFile = async (file) => {
    if (!file) return;
    
    setUploading(true);
    setUploadSuccess(false);
    
    try {
      // Create a simple form data with just the file
      // In a real implementation, you might want to add more metadata
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('recordType', 'Other');
      
      await medicalRecordService.uploadRecord(formData);
      
      setUploadSuccess(true);
      // Reset file input
      setUploadData({ file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Show success message
      setTimeout(() => setUploadSuccess(false), 3000);
      
      // Refresh record list
      fetchRecords();
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await medicalRecordService.getRecords();
      setMedicalRecords(response);
      
      // Also fetch patient profile to get current email
      const session = localStorage.getItem('gc_patient_session');
      if (session) {
        const { token } = JSON.parse(session);
        const profileResponse = await patientAPI.getProfile(token);
        if (profileResponse && profileResponse.patient && profileResponse.patient.email) {
          setEmail(profileResponse.patient.email);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAnalyze = async (record) => {
    setAnalyzingId(record._id);
    setSelectedAnalysis(null);
    
    try {
      const result = await medicalRecordService.analyzeRecord(record._id);
      setSelectedAnalysis(result);
      // Update local record state if needed
      setMedicalRecords(prev => prev.map(r => r._id === record._id ? result : r));
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('AI Analysis failed. Please try again.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      await medicalRecordService.deleteRecord(recordId);
      setMedicalRecords(prev => prev.filter(r => r._id !== recordId));
      if (selectedAnalysis?._id === recordId) {
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete report. Please try again.');
    }
  };

  return (
    <DashboardSection>
      <LiquidBackground />
      <div className="wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', padding: '0 8px' }}>
          <div style={{ animation: 'fadeInLeft 0.8s ease-out' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              Welcome back, <span style={{ color: '#6366f1' }}>{(patientName || 'Friend').split(' ')[0]}!</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Ready to take control of your health today?</p>
          </div>
          <div style={{ textAlign: 'right', animation: 'fadeInRight 0.8s ease-out' }}>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>{medications.length} Medications Total</div>
          </div>
        </div>

        <DashboardGrid style={{ marginBottom: '32px' }}>
          <DashboardCard style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none' }}>
            <WelcomeCard style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: 0 }}>
              <h2>Your Daily Health Goals</h2>
              <p>You've completed {Math.round((medications.filter(m => m.status === 'taken').length / medications.length) * 100) || 0}% of your medication tasks today. Stay hydrated and don't forget your evening doses!</p>
            </WelcomeCard>
          </DashboardCard>
          
          <UploadCard onClick={handleUploadClick}>
            <FileInput
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <UploadIcon>
              {uploading ? '⏳' : uploadSuccess ? '✅' : '📤'}
            </UploadIcon>
            <UploadTitle>
              {uploading ? 'Uploading...' : uploadSuccess ? 'Upload Successful!' : 'Upload Medical Reports'}
            </UploadTitle>
            <UploadDescription>
              {uploadSuccess 
                ? 'Your report has been uploaded and is ready for AI analysis.'
                : 'Upload reports to get an AI-powered simplified explanation.'}
            </UploadDescription>
          </UploadCard>
        </DashboardGrid>

        {/* AI Analysis Insight Section (Shown when an analysis is selected or in progress) */}

        {/* AI Analysis Insight Section (Shown when an analysis is selected or in progress) */}
        {(analyzingId || selectedAnalysis) && (
          <AnalysisCard style={{ position: 'relative', overflow: 'hidden', border: 'none', background: 'rgba(255, 255, 255, 0.95)' }}>
            {analyzingId && <ScanningOverlay />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>✨ GoldenCare AI Insights</h3>
              {selectedAnalysis && (
                <button 
                  onClick={() => setSelectedAnalysis(null)}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '20px' }}
                >
                  ✕
                </button>
              )}
            </div>

            {analyzingId ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'pulse 2s infinite' }}>🧠</div>
                <h4>AI is scanning your report...</h4>
                <p style={{ color: '#666' }}>We're simplifying the medical terms and finding your medications.</p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#4f46e5', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📝</span> Clinical Interpretation:
                  </h4>
                  <div style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.7', 
                    color: '#374151', 
                    background: '#f8fafc', 
                    padding: '24px', 
                    borderRadius: '12px', 
                    borderLeft: '4px solid #6366f1',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    {renderExplanation(selectedAnalysis.analysisExplanation)}
                  </div>
                </div>

                {selectedAnalysis.extractedMedications && selectedAnalysis.extractedMedications.length > 0 && (
                  <div>
                    <h4 style={{ color: '#4f46e5', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                      <span>💊</span> Extracted Medication List:
                    </h4>
                    <MedicationTable>
                      <thead>
                        <tr>
                          <th>Medication</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Instructions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAnalysis.extractedMedications.map((med, idx) => (
                          <tr key={idx}>
                            <td>{med.name}</td>
                            <td>{med.dosage}</td>
                            <td>{med.frequency}</td>
                            <td>{med.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </MedicationTable>
                  </div>
                )}
                
                <p style={{ marginTop: '24px', fontSize: '11px', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }}>
                  ⚠️ Disclamer: AI insights are for assistance only. Always consult your doctor for medical advice.
                </p>
              </div>
            )}
          </AnalysisCard>
        )}

        {/* My Medical Reports List */}
        {medicalRecords.length > 0 && (
          <DashboardCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>📋 My Medical Reports</h3>
              <span style={{ fontSize: '12px', color: '#666' }}>{medicalRecords.length} files</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {medicalRecords.map(record => (
                <ReportItem key={record._id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '24px' }}>
                      {record.fileType.includes('pdf') ? '📄' : record.fileType.includes('image') ? '🖼️' : '📁'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>{record.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(record.uploadedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {record.isAnalyzed ? (
                      <AnalyzeButton 
                        onClick={() => setSelectedAnalysis(record)}
                        style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', boxShadow: 'none' }}
                      >
                        Insights
                      </AnalyzeButton>
                    ) : (
                      <AnalyzeButton 
                        onClick={() => handleAnalyze(record)}
                        disabled={analyzingId === record._id}
                      >
                        {analyzingId === record._id ? 'Scanning...' : '✨ Analyze'}
                      </AnalyzeButton>
                    )}
                    <DeleteButton onClick={() => handleDeleteRecord(record._id)}>
                      🗑️
                    </DeleteButton>
                  </div>
                </ReportItem>
              ))}
            </div>
          </DashboardCard>
        )}
        
        <DashboardGrid>
          <div>
            <DashboardCard>
              <h3>💊 {medicationsTitle}</h3>
              {medications.length > 0 ? (
                <>
                  {medications.map(med => (
                    <MedicationCard key={med.id || med._id}>
                      <MedicationIcon>
                        {med.name.charAt(0).toUpperCase()}
                      </MedicationIcon>
                      <MedicationInfo>
                        <h4>{med.name}</h4>
                        <p>{med.dosage} • {med.time} • {med.slot}</p>
                        {med.notes && (
                          <p style={{ fontSize: '12px', marginTop: '4px', color: '#666' }}>
                            {med.notes}
                          </p>
                        )}
                      </MedicationInfo>
                      <StatusBadge className={getStatusClass(med.status)}>
                        {getStatusText(med.status)}
                      </StatusBadge>
                    </MedicationCard>
                  ))}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>💊</div>
                  <h3 style={{ opacity: 0.8 }}>{noMedsTitle}</h3>
                  <p style={{ color: '#666', marginBottom: '24px' }}>{noMedsDescription}</p>
                </div>
              )}
            </DashboardCard>
            
            <DashboardCard>
              <h3>📊 {healthSummaryTitle}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <ReportCard style={{ margin: 0 }}>
                  <ReportHeader>
                    <div className="title">Medication Adherence</div>
                  </ReportHeader>
                  <ReportContent>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
                      {medications.length > 0 ? Math.round((medications.filter(m => m.status === 'taken').length / medications.length) * 100) : 0}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{medicationsTaken}</div>
                  </ReportContent>
                </ReportCard>
                
                <ReportCard style={{ margin: 0 }}>
                  <ReportHeader>
                    <div className="title">Hydration Status</div>
                  </ReportHeader>
                  <ReportContent>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6' }}>Good</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{hydrationStatus}</div>
                  </ReportContent>
                </ReportCard>
                
                <ReportCard style={{ margin: 0 }}>
                  <ReportHeader>
                    <div className="title">Mental Wellness</div>
                  </ReportHeader>
                  <ReportContent>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#8b5cf6' }}>Active</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{breathingExercise}</div>
                  </ReportContent>
                </ReportCard>
              </div>
            </DashboardCard>
          </div>
          
          <Sidebar>
            <DashboardCard>
              <h3>⚡ {quickActionsTitle}</h3>
              <QuickAction onClick={() => navigate('/pillbox')}>
                <span>💊</span> {markMedTaken}
              </QuickAction>
              <QuickAction onClick={() => navigate('/wellness')}>
                <span>💧</span> {logWater}
              </QuickAction>
              <QuickAction onClick={() => navigate('/wellness')}>
                <span>🧘</span> {startBreathing}
              </QuickAction>
              <QuickAction onClick={() => navigate('/family')}>
                <span>💬</span> {viewMessages}
              </QuickAction>
              <QuickAction onClick={() => navigate('/profile')}>
                <span>👤</span> {viewProfile}
              </QuickAction>
            </DashboardCard>

            <DashboardCard>
              <h3>📩 Email Reminders</h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Receive medication descriptions and times directly in your inbox.
              </p>
              <form onSubmit={handleEmailUpdate}>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    marginBottom: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                <Button 
                  type="submit" 
                  disabled={updatingEmail}
                  style={{ width: '100%', padding: '10px' }}
                >
                  {updatingEmail ? 'Updating...' : 'Set Notification Email'}
                </Button>
              </form>
            </DashboardCard>
            
            <DashboardCard>
              <h3>💡 {todayTipsTitle}</h3>
              <ReportCard>
                <ReportContent>
                  <strong style={{ display: 'block', marginBottom: '4px', color: '#4f46e5' }}>Tip of the day</strong>
                  {tip1}
                </ReportContent>
              </ReportCard>
              <ReportCard>
                <ReportContent>
                  {tip2}
                </ReportContent>
              </ReportCard>
            </DashboardCard>
            
            <DashboardCard>
              <h3>💬 {familyMessagesTitle}</h3>
              <ReportCard>
                <ReportHeader>
                  <div className="title" style={{ fontWeight: 700 }}>Sarah (Daughter)</div>
                  <div className="date">2h ago</div>
                </ReportHeader>
                <ReportContent style={{ fontStyle: 'italic' }}>
                  "{message1}"
                </ReportContent>
              </ReportCard>
            </DashboardCard>
          </Sidebar>
        </DashboardGrid>
      </div>
    </DashboardSection>
  );
};

export default PatientDashboard;