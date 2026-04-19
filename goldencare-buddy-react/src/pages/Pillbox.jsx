import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import notificationService from '../services/notificationService';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { patientAPI } from '../services/apiService.js';
import medicationEventService from '../services/medicationEventService.js';

const PillboxSection = styled.section`
  padding: ${props => props.theme.spacing['4xl']} 0;
  min-height: calc(100vh - 200px);
`;

const PillboxHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['4xl']};
  
  .page-icon {
    font-size: 4rem;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  .subtitle {
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.muted};
    max-width: 600px;
    margin: 0 auto;
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const PillboxTabs = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  background: ${props => props.theme.colors.bg};
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border};
  overflow-x: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const Tab = styled.button`
  flex: 1;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.muted};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.md};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.transitions.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  white-space: nowrap;
  
  .icon {
    font-size: ${props => props.theme.fontSizes.xl};
  }
  
  &.active {
    color: white;
    background: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-1px);
  }
  
  &:hover:not(.active) {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight}20;
  }
`;

const Slot = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
  min-height: 300px;
  animation: ${props => props.$active ? 'fadeIn 0.3s ease-in-out' : 'none'};
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PillList = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
`;

const PillItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 2px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.primaryLight};
  }
  
  &.taken {
    background: ${props => props.theme.colors.successLight};
    border-color: ${props => props.theme.colors.success};
  }
`;

const PillInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  flex: 1;
`;

const PillBubble = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryLight});
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: ${props => props.theme.fontSizes.xl};
  box-shadow: ${props => props.theme.shadows.md};
  
  &.taken {
    background: linear-gradient(135deg, ${props => props.theme.colors.success}, ${props => props.theme.colors.successLight});
  }
`;

const PillDetails = styled.div`
  flex: 1;
  
  .pill-name {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  .pill-notes {
    color: ${props => props.theme.colors.muted};
    font-size: ${props => props.theme.fontSizes.md};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  .pill-time {
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.mutedLight};
  }
`;

const PillActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: row;
  }
`;

const ActionBtn = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: 2px solid transparent;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &.take {
    background: ${props => props.theme.colors.success};
    color: white;
    border-color: ${props => props.theme.colors.success};
    
    &:hover:not(:disabled) {
      background: ${props => props.theme.colors.successLight};
      transform: scale(1.05);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      background: ${props => props.theme.colors.mutedLight};
      border-color: ${props => props.theme.colors.mutedLight};
    }
  }
  
  &.edit {
    background: transparent;
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    
    &:hover {
      background: ${props => props.theme.colors.primary};
      color: white;
    }
  }
  
  &.delete {
    background: transparent;
    color: ${props => props.theme.colors.error};
    border-color: ${props => props.theme.colors.error};
    
    &:hover {
      background: ${props => props.theme.colors.error};
      color: white;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['4xl']};
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: ${props => props.theme.spacing.lg};
    opacity: 0.5;
  }
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  p {
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`;

const AddRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
  margin-top: ${props => props.theme.spacing['2xl']};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const SideCard = styled.aside`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.xl};
  height: fit-content;
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
  }
  
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${props => props.theme.spacing.lg};
    margin-bottom: ${props => props.theme.spacing.lg};
    
    .stat {
      text-align: center;
      padding: ${props => props.theme.spacing.md};
      background: ${props => props.theme.colors.bg};
      border-radius: ${props => props.theme.borderRadius.lg};
      
      .number {
        font-size: ${props => props.theme.fontSizes['2xl']};
        font-weight: ${props => props.theme.fontWeights.bold};
        color: ${props => props.theme.colors.primary};
      }
      
      .label {
        font-size: ${props => props.theme.fontSizes.sm};
        color: ${props => props.theme.colors.muted};
      }
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      padding: ${props => props.theme.spacing.md} 0;
      color: ${props => props.theme.colors.muted};
      line-height: ${props => props.theme.lineHeights.relaxed};
      border-bottom: 1px solid ${props => props.theme.colors.border};
      
      &:last-child {
        border-bottom: none;
      }
      
      &::before {
        content: '✓';
        color: ${props => props.theme.colors.success};
        font-weight: ${props => props.theme.fontWeights.bold};
        margin-right: ${props => props.theme.spacing.sm};
      }
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndex.modal};
  padding: ${props => props.theme.spacing.xl};
  backdrop-filter: blur(4px);
`;

const ModalPanel = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows['2xl']};
  padding: ${props => props.theme.spacing['2xl']};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.border};
  animation: modalSlideIn 0.3s ease-out;
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.xl};
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
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
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.md};
  
  .required {
    color: ${props => props.theme.colors.error};
  }
  
  input, select, textarea {
    margin-top: ${props => props.theme.spacing.sm};
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
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.xl};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column-reverse;
  }
`;

const Pillbox = () => {
  const { t } = useLanguage();
  const [pills, setPills] = useState([]);
  const [activeSlot, setActiveSlot] = useState('morning');
  const [isPatient, setIsPatient] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const slots = [
    { id: 'morning', label: t('morning'), icon: '🌅', value: 'Morning' },
    { id: 'afternoon', label: t('afternoon'), icon: '☀️', value: 'Afternoon' },
    { id: 'evening', label: t('evening'), icon: '🌆', value: 'Evening' },
    { id: 'night', label: t('night'), icon: '🌙', value: 'Night' }
  ];

  // Load pills from API and check user role
  useEffect(() => {
    console.log(`[Pillbox] useEffect triggered. forceRefresh: ${forceRefresh}`);
    // Check if user is a patient
    const patientSession = localStorage.getItem('gc_patient_session');
    const patientUser = patientSession ? JSON.parse(patientSession) : null;
    setIsPatient(!!patientUser);
    
    const currentPatientId = patientUser?.patientId;
    console.log(`[Pillbox] Current patient ID: ${currentPatientId}`);

    // Load medications initially
    const loadMedications = async () => {
      try {
        if (!patientSession) {
          // If no patient session, don't try to fetch medications
          console.log('[Pillbox] No patient session found, setting medications to empty array');
          setPills([]);
          return;
        }
        
        const patientUser = JSON.parse(patientSession);
        const currentPatientId = patientUser?.patientId;
        
        // If no valid patient ID, don't fetch medications
        if (!currentPatientId) {
          console.log('[Pillbox] No valid patient ID found, setting medications to empty array');
          setPills([]);
          return;
        }
        
        console.log(`[Pillbox] Loading medications for patient ${currentPatientId}`);
        // Normalize patientId to string for consistent comparison
        const normalizedPatientId = String(currentPatientId);
        console.log(`[Pillbox] Normalized patient ID: ${normalizedPatientId}`);
        
        const response = await patientAPI.getMedications(normalizedPatientId);
        console.log(`[Pillbox] Medication API response for patient ${normalizedPatientId}:`, response);
        
        if (response.success) {
          // Transform API medications to pill format
          const transformedPills = response.medications.map(med => ({
            id: med._id,
            name: med.name,
            dosage: med.dosage,
            slot: med.slot,
            frequency: med.frequency,
            notes: med.notes,
            prescribedBy: med.prescribedBy,
            takenHistory: med.takenHistory || [],
            time: med.customTime
          }));
          
          console.log(`[Pillbox] Transformed pills for patient ${normalizedPatientId}:`, transformedPills);
          
          // Always update state when forceRefresh is true, otherwise only update if medications have actually changed
          if (forceRefresh) {
            console.log('[Pillbox] Force refresh - updating pills:', transformedPills);
            setPills(transformedPills);
            console.log('[Pillbox] Resetting forceRefresh to false');
            setForceRefresh(false); // Reset forceRefresh flag
          } else {
            setPills(prevPills => {
              // Sort pills by ID to ensure consistent ordering
              const sortedPrevPills = [...prevPills].sort((a, b) => a.id?.localeCompare(b.id));
              const sortedNewPills = [...transformedPills].sort((a, b) => a.id?.localeCompare(b.id));
              
              const prevPillsStr = JSON.stringify(sortedPrevPills);
              const newPillsStr = JSON.stringify(sortedNewPills);
              
              if (prevPillsStr !== newPillsStr) {
                console.log('[Pillbox] Pills updated:', transformedPills);
                return transformedPills;
              }
              console.log('[Pillbox] No pill changes detected');
              return prevPills;
            });
          }
        } else {
          console.log('[Pillbox] API response not successful, setting pills to empty array');
          setPills([]);
        }
      } catch (error) {
        console.error('Error fetching medications:', error);
        // Set pills to empty array on error
        setPills([]);
      }
    };

    // Load medications immediately
    loadMedications();

    // Set up polling for updates
    const pollInterval = setInterval(() => {
      console.log('[Pillbox] Polling for medication updates');
      loadMedications();
    }, 5000);

    // Subscribe to medication events for this patient
    let unsubscribe = null;
    if (currentPatientId) {
      console.log(`[Pillbox] Subscribing to medication updates for patient ${currentPatientId}`);
      // Normalize patientId to string for consistent comparison
      const normalizedPatientId = String(currentPatientId);
      console.log(`[Pillbox] Patient ID type: ${typeof normalizedPatientId}, value: "${normalizedPatientId}"`);
      unsubscribe = medicationEventService.subscribe(normalizedPatientId, () => {
        console.log(`[Pillbox] Received medication update event for patient ${normalizedPatientId}`);
        console.log(`[Pillbox] Setting forceRefresh to true`);
        setForceRefresh(true);
        setLastUpdate(Date.now());
        loadMedications();
      });
    }
    
    // Also listen for global medication update events
    const handleGlobalMedicationUpdate = (event) => {
      const { patientId } = event.detail;
      // Only update if this event is for the current patient
      if (String(patientId) === String(currentPatientId)) {
        console.log(`[Pillbox] Received global medication update event for patient ${patientId}`);
        console.log(`[Pillbox] Setting forceRefresh to true`);
        setForceRefresh(true);
        setLastUpdate(Date.now());
        loadMedications();
      }
    };
    
    window.addEventListener('medicationUpdate', handleGlobalMedicationUpdate);

    // Cleanup function
    return () => {
      console.log('[Pillbox] Cleaning up useEffect');
      clearInterval(pollInterval);
      if (unsubscribe) {
        console.log(`[Pillbox] Unsubscribing from medication updates for patient ${currentPatientId}`);
        unsubscribe();
      }
      window.removeEventListener('medicationUpdate', handleGlobalMedicationUpdate);
    };
  }, [lastUpdate, forceRefresh]);

  const handleTabClick = (slot) => {
    setActiveSlot(slot);
  };

  const handleTakePill = async (id) => {
    const pill = pills.find(p => p.id === id);
    const today = new Date().toDateString();
    const alreadyTaken = pill.takenHistory?.some(entry => 
      new Date(entry.ts || entry.timestamp).toDateString() === today
    );
    
    if (!alreadyTaken) {
      try {
        // Call API to mark medication as taken
        const patientSession = localStorage.getItem('gc_patient_session');
        const patientUser = patientSession ? JSON.parse(patientSession) : null;
        
        if (patientUser) {
          const response = await patientAPI.markMedicationTaken(null, id); // token not needed for now
          console.log(`[Pillbox] Mark medication as taken response:`, response);
          
          if (response.success) {
            setPills(prevPills => 
              prevPills.map(pill => 
                pill.id === id 
                  ? { 
                      ...pill, 
                      takenHistory: [...(pill.takenHistory || []), { ts: Date.now(), timestamp: new Date() }] 
                    }
                  : pill
              )
            );
            
            // Show success animation
            const pillElement = document.querySelector(`[data-pill-id="${id}"]`);
            if (pillElement) {
              gsap.fromTo(pillElement, 
                { scale: 1 }, 
                { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 }
              );
            }
          }
        }
      } catch (error) {
        console.error('Error marking medication as taken:', error);
        // Still update UI even if API call fails
        setPills(prevPills => 
          prevPills.map(pill => 
            pill.id === id 
              ? { 
                  ...pill, 
                  takenHistory: [...(pill.takenHistory || []), { ts: Date.now(), timestamp: new Date() }] 
                }
              : pill
          )
        );
      }
    }
  };

  const getPillsForSlot = (slot) => {
    return pills.filter(pill => pill.slot === slot);
  };

  const getTotalPills = () => pills.length;
  const getTakenToday = () => {
    const today = new Date().toDateString();
    return pills.filter(pill => 
      pill.takenHistory?.some(entry => 
        new Date(entry.ts || entry.timestamp).toDateString() === today
      )
    ).length;
  };

  const renderPillItem = (pill) => {
    const today = new Date().toDateString();
    const takenToday = pill.takenHistory?.some(entry => 
      new Date(entry.ts || entry.timestamp).toDateString() === today
    );
    
    const timeMap = {
      'Morning': '8:00 AM',
      'Afternoon': '2:00 PM', 
      'Evening': '6:00 PM',
      'Night': '10:00 PM'
    };

    return (
      <PillItem key={pill.id} className={takenToday ? 'taken' : ''} data-pill-id={pill.id}>
        <PillInfo>
          <PillBubble className={takenToday ? 'taken' : ''}>
            {takenToday ? '✓' : pill.name.charAt(0).toUpperCase()}
          </PillBubble>
          <PillDetails>
            <div className="pill-name">{pill.name}</div>
            {pill.dosage && (
              <div className="pill-notes">{pill.dosage} • {pill.frequency}</div>
            )}
            {pill.notes && (
              <div className="pill-notes">{pill.notes}</div>
            )}
            <div className="pill-time">Scheduled: {pill.time || timeMap[pill.slot]}</div>
            {pill.prescribedBy && (
              <div className="pill-time" style={{ color: '#3b93d0', fontWeight: 600 }}>
                👨‍⚕️ Prescribed by: {pill.prescribedBy}
              </div>
            )}
          </PillDetails>
        </PillInfo>
        <PillActions>
          <ActionBtn
            className="take"
            onClick={() => handleTakePill(pill.id)}
            disabled={takenToday}
          >
            {takenToday ? (
              <>
                <span>✓</span>
                Taken
              </>
            ) : (
              <>
                <span>💊</span>
                Take Now
              </>
            )}
          </ActionBtn>
        </PillActions>
      </PillItem>
    );
  };

  const currentSlotPills = getPillsForSlot(slots.find(s => s.id === activeSlot)?.value || 'Morning');

  return (
    <>
      <PillboxSection>
        <div className="wrap">
          <PillboxHeader>
            <div className="page-icon">💊</div>
            <h1>{t('digital_pillbox')}</h1>
            <div className="subtitle">
              {t('manage_medications_description')}
            </div>
          </PillboxHeader>
          
          <div className="grid-2">
            <div>
              <PillboxTabs>
                {slots.map((slot) => (
                  <Tab 
                    key={slot.id}
                    className={activeSlot === slot.id ? 'active' : ''}
                    onClick={() => handleTabClick(slot.id)}
                  >
                    <span className="icon">{slot.icon}</span>
                    {slot.label}
                  </Tab>
                ))}
              </PillboxTabs>

              {slots.map((slot) => (
                <Slot key={slot.id} $active={activeSlot === slot.id}>
                  {currentSlotPills.length > 0 ? (
                    <PillList>
                      {currentSlotPills.map(renderPillItem)}
                    </PillList>
                  ) : (
                    <EmptyState>
                      <div className="empty-icon">💊</div>
                      <h3>{t('no_medications_for_slot', { slot: slot.label })}</h3>
                      <p>
                        {isPatient 
                          ? t('doctor_will_prescribe')
                          : t('add_first_medication')
                        }
                      </p>
                    </EmptyState>
                  )}
                </Slot>
              ))}

              {!isPatient && (
                <AddRow>
                  <button className="btn outline" onClick={() => alert('Contact your doctor to manage your medications')}>
                    👨‍⚕️ {t('contact_doctor')}
                  </button>
                </AddRow>
              )}
              
              {/* Notification Settings Button */}
              <AddRow>
                <button 
                  className="btn secondary" 
                  onClick={() => notificationService.requestPermission().then(granted => {
                    if (granted) {
                      alert('✅ Notifications enabled! You will receive medication reminders.');
                    } else {
                      alert('❌ Notifications denied. Enable them in browser settings to receive reminders.');
                    }
                  })}
                >
                  🔔 {t('enable_notifications')}
                </button>
                <button 
                  className="btn ghost" 
                  onClick={() => notificationService.testNotification()}
                >
                  🧪 {t('test_notification')}
                </button>
              </AddRow>
            </div>

            <SideCard>
              <h3>
                <span>📊</span>
                {t('todays_progress')}
              </h3>
              <div className="stats">
                <div className="stat">
                  <div className="number">{getTakenToday()}</div>
                  <div className="label">{t('taken')}</div>
                </div>
                <div className="stat">
                  <div className="number">{getTotalPills()}</div>
                  <div className="label">{t('total')}</div>
                </div>
              </div>
              <h3>
                <span>💡</span>
                {isPatient ? t('tips_for_success') : t('medication_info')}
              </h3>
              <ul>
                {isPatient ? (
                  <>
                    <li>{t('tip_consistent_times')}</li>
                    <li>{t('tip_doctor_manages')}</li>
                    <li>{t('tip_mark_daily')}</li>
                    <li>{t('tip_contact_doctor')}</li>
                    <li>{t('tip_never_skip')}</li>
                  </>
                ) : (
                  <>
                    <li>{t('tip_set_times')}</li>
                    <li>{t('tip_keep_bottles')}</li>
                    <li>{t('tip_use_app_daily')}</li>
                    <li>{t('tip_ask_family')}</li>
                    <li>{t('tip_never_skip')}</li>
                  </>
                )}
              </ul>
            </SideCard>
          </div>
        </div>
      </PillboxSection>
    </>
  );
};

export default Pillbox;
