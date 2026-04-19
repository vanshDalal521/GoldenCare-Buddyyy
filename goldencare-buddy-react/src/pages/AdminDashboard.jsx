import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doctorAPI } from '../services/apiService';
import { Link } from 'react-router-dom';
import WellnessReport from '../components/WellnessReport';

const DashboardSection = styled.section`
  padding: ${props => props.theme.spacing['4xl']} 0;
  min-height: calc(100vh - 200px);
  background: ${props => props.theme.colors.bg};
  
  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text};
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: ${props => props.theme.fontSizes['3xl']};
      text-align: center;
    }
  }
  
  .muted {
    color: ${props => props.theme.colors.muted};
    font-size: ${props => props.theme.fontSizes.lg};
    margin-bottom: ${props => props.theme.spacing['3xl']};
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      text-align: center;
    }
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const DashboardCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
  }
`;

const StatCard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['3xl']};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${props => props.theme.spacing.lg};
  }
`;

const StatItem = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing['2xl']};
  text-align: center;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  .number {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.extrabold};
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  .label {
    color: ${props => props.theme.colors.muted};
    font-size: ${props => props.theme.fontSizes.md};
    font-weight: ${props => props.theme.fontWeights.semibold};
  }
`;

const PatientCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.sm};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PatientAvatar = styled.div`
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

const PatientInfo = styled.div`
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
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  
  &.active {
    background: ${props => props.theme.colors.successLight};
    color: ${props => props.theme.colors.success};
  }
  
  &.warning {
    background: ${props => props.theme.colors.warningLight};
    color: ${props => props.theme.colors.warning};
  }
  
  &.inactive {
    background: ${props => props.theme.colors.errorLight};
    color: ${props => props.theme.colors.error};
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  
  .btn {
    width: 100%;
    justify-content: flex-start;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const DoctorDatabaseLink = styled(Link)`
  display: block;
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, #3182ce, #48bb78);
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  text-align: center;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: 0 4px 15px rgba(49, 130, 206, 0.3);
  margin-top: ${props => props.theme.spacing.xl};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(49, 130, 206, 0.4);
    background: linear-gradient(135deg, #48bb78, #3182ce);
  }
  
  .icon {
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

const AlertsList = styled.div`
  p {
    padding: ${props => props.theme.spacing.md};
    margin: 0 0 ${props => props.theme.spacing.sm} 0;
    background: ${props => props.theme.colors.bg};
    border-radius: ${props => props.theme.borderRadius.md};
    color: ${props => props.theme.colors.text};
    border-left: 3px solid ${props => props.theme.colors.warning};
    
    &:last-child {
      margin-bottom: 0;
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
  display: ${props => props.show ? 'flex' : 'none'};
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
  max-width: 600px;
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

const MedicationList = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  max-height: 300px;
  overflow-y: auto;
`;

const MedicationItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.border};
  
  .med-info {
    flex: 1;
    
    h4 {
      margin: 0 0 4px 0;
      font-size: ${props => props.theme.fontSizes.md};
      color: ${props => props.theme.colors.text};
    }
    
    p {
      margin: 0;
      font-size: ${props => props.theme.fontSizes.sm};
      color: ${props => props.theme.colors.muted};
    }
  }
  
  .actions {
    display: flex;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const SmallBtn = styled.button`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  background: transparent;
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
    border-color: ${props => props.theme.colors.error};
  }
`;

const SystemStatus = styled.div`
  p {
    padding: ${props => props.theme.spacing.sm} 0;
    margin: 0;
    color: ${props => props.theme.colors.text};
    font-weight: ${props => props.theme.fontWeights.medium};
    
    &:not(:last-child) {
      border-bottom: 1px solid ${props => props.theme.colors.border};
    }
  }
`;

const AdminDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [patientMedications, setPatientMedications] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slot: 'Morning',
    notes: '',
    dosage: '',
    frequency: 'Once daily'
  });
  const [doctors, setDoctors] = useState([]); // Add doctors state
  const [pendingDoctors, setPendingDoctors] = useState([]); // Add pending doctors state
  const navigate = useNavigate();

  // Load doctors
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // For now, we'll simulate with sample data
    setTimeout(() => {
      const sampleDoctors = [
        {
          _id: 'doc1',
          name: 'Dr. Sharma',
          email: 'dr.sharma@example.com',
          doctorId: 'DOC001',
          specialization: 'Geriatrics',
          isVerified: true,
          createdAt: new Date('2023-01-15')
        },
        {
          _id: 'doc2',
          name: 'Dr. Patel',
          email: 'dr.patel@example.com',
          doctorId: 'DOC002',
          specialization: 'Cardiology',
          isVerified: false,
          createdAt: new Date('2023-05-20')
        }
      ];
      setDoctors(sampleDoctors);
      
      // Pending doctors
      const samplePendingDoctors = [
        {
          _id: 'doc3',
          name: 'Dr. Johnson',
          email: 'dr.johnson@example.com',
          doctorId: 'DOC003',
          specialization: 'Neurology',
          isVerified: false,
          aiVerification: { status: 'pending' },
          adminVerification: { status: 'pending' },
          createdAt: new Date('2023-06-01')
        }
      ];
      setPendingDoctors(samplePendingDoctors);
    }, 1000);
  }, []);

  const adminSession = localStorage.getItem('gc_admin_session');
  const adminUser = adminSession ? JSON.parse(adminSession) : null;
  const doctorName = adminUser?.name || 'Dr. Sharma';

  const slots = [
    { id: 'morning', label: 'Morning', icon: '🌅', value: 'Morning' },
    { id: 'afternoon', label: 'Afternoon', icon: '☀️', value: 'Afternoon' },
    { id: 'evening', label: 'Evening', icon: '🌆', value: 'Evening' },
    { id: 'night', label: 'Night', icon: '🌙', value: 'Night' }
  ];

  const stats = [
    { label: 'Total Patients', value: '24' },
    { label: 'Active Today', value: '18' },
    { label: 'Medications', value: '156' },
    { label: 'Alerts', value: '3' }
  ];

  const patients = [
    { id: 'demo_patient', name: 'Mr. Vansh', status: 'active', adherence: 95 },
    { id: 'patient_2', name: 'Mrs. Sushma', status: 'warning', adherence: 78 },
    { id: 'patient_3', name: 'Mr. Rohan', status: 'active', adherence: 88 },
    { id: 'patient_4', name: 'Mrs. Priya', status: 'inactive', adherence: 45 }
  ];

  // Load patient medications when modal opens
  useEffect(() => {
    if (selectedPatient) {
      const patientMedsKey = `gc_patient_meds_${selectedPatient.id}`;
      const meds = JSON.parse(localStorage.getItem(patientMedsKey) || '[]');
      setPatientMedications(meds);
    }
  }, [selectedPatient]);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowMedicationModal(true);
  };

  const handleCloseModal = () => {
    setShowMedicationModal(false);
    setSelectedPatient(null);
    setFormData({
      name: '',
      slot: 'Morning',
      notes: '',
      dosage: '',
      frequency: 'Once daily'
    });
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    const { name, slot, notes, dosage, frequency } = formData;
    
    if (!name.trim()) {
      alert('Please enter a medication name');
      return;
    }

    const newMed = {
      id: 'med_' + Math.random().toString(36).slice(2, 9),
      name: name.trim(),
      slot,
      notes: notes.trim(),
      dosage: dosage.trim(),
      frequency,
      prescribedBy: doctorName,
      prescribedDate: new Date().toISOString(),
      takenHistory: []
    };

    const updatedMeds = [...patientMedications, newMed];
    setPatientMedications(updatedMeds);
    
    // Save to localStorage for the specific patient
    const patientMedsKey = `gc_patient_meds_${selectedPatient.id}`;
    localStorage.setItem(patientMedsKey, JSON.stringify(updatedMeds));

    // Reset form
    setFormData({
      name: '',
      slot: 'Morning',
      notes: '',
      dosage: '',
      frequency: 'Once daily'
    });

    alert(`Medication "${name}" added successfully for ${selectedPatient.name}!`);
  };

  const handleDeleteMedication = (medId) => {
    if (window.confirm('Are you sure you want to remove this medication?')) {
      const updatedMeds = patientMedications.filter(med => med.id !== medId);
      setPatientMedications(updatedMeds);
      
      const patientMedsKey = `gc_patient_meds_${selectedPatient.id}`;
      localStorage.setItem(patientMedsKey, JSON.stringify(updatedMeds));
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'warning': return 'warning';
      case 'inactive': return 'inactive';
      default: return 'inactive';
    }
  };

  return (
    <DashboardSection>
      <div className="wrap">
        <h1>Admin Dashboard</h1>
        <p className="muted">Monitor and manage all patients and their health data.</p>

        <StatCard>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <div className="number">{stat.value}</div>
              <div className="label">{stat.label}</div>
            </StatItem>
          ))}
        </StatCard>

        <DashboardGrid>
          <div>
            <DashboardCard>
              <h3>Patient Overview</h3>
              {patients.map(patient => (
                <PatientCard key={patient.id} onClick={() => handlePatientClick(patient)}>
                  <PatientAvatar>
                    {patient.name.split(' ')[1].charAt(0)}
                  </PatientAvatar>
                  <PatientInfo>
                    <h4>{patient.name}</h4>
                    <p>Adherence: {patient.adherence}% • Click to manage medications</p>
                  </PatientInfo>
                  <StatusBadge className={getStatusClass(patient.status)}>
                    {patient.status}
                  </StatusBadge>
                </PatientCard>
              ))}
            </DashboardCard>

            <DoctorDatabaseLink to="/doctor-database-login">
              <span className="icon">👨‍⚕️</span>
              Access Doctor Database
            </DoctorDatabaseLink>
          </div>

          <div>
            <DashboardCard>
              <h3>Quick Actions</h3>
              <QuickActions>
                <button className="btn primary">📋 Add New Patient</button>
                <button className="btn secondary" onClick={() => navigate('/doctor-register')}>👨‍⚕️ Register New Doctor</button>
                <button className="btn ghost">📊 Generate Report</button>
                <button className="btn ghost">🔔 Send Notifications</button>
                <button className="btn ghost">⚙️ System Settings</button>
              </QuickActions>
            </DashboardCard>

            <DashboardCard>
              <h3>System Status</h3>
              <SystemStatus>
                <p>✅ All systems operational</p>
                <p>✅ Database connected</p>
                <p>✅ AI services active</p>
                <p>⚠️ Backup pending</p>
              </SystemStatus>
            </DashboardCard>
          </div>
        </DashboardGrid>
      </div>

      {/* Medication Management Modal */}
      <Modal show={showMedicationModal} onClick={handleCloseModal}>
        <ModalPanel onClick={(e) => e.stopPropagation()}>
          <h3>
            <span>💊</span>
            Manage Medications - {selectedPatient?.name}
          </h3>
          
          {/* Wellness Report */}
          {selectedPatient && (
            <WellnessReport patientId={selectedPatient.id} />
          )}
          
          {/* Current Medications */}
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '16px' }}>
              Current Medications ({patientMedications.length})
            </h4>
            {patientMedications.length > 0 ? (
              <MedicationList>
                {patientMedications.map(med => (
                  <MedicationItem key={med.id}>
                    <div className="med-info">
                      <h4>{med.name}</h4>
                      <p>
                        {med.dosage} • {med.slot} • {med.frequency}
                        {med.notes && ` • ${med.notes}`}
                      </p>
                      <p style={{ fontSize: '12px', color: '#3b93d0', marginTop: '4px' }}>
                        👨‍⚕️ Prescribed by: {med.prescribedBy}
                      </p>
                    </div>
                    <div className="actions">
                      <SmallBtn onClick={() => handleDeleteMedication(med.id)}>
                        🗑️ Remove
                      </SmallBtn>
                    </div>
                  </MedicationItem>
                ))}
              </MedicationList>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic', padding: '16px', textAlign: 'center' }}>
                No medications prescribed yet
              </p>
            )}
          </div>

          {/* Add New Medication Form */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
            <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Add New Medication</h4>
            <Form onSubmit={handleAddMedication}>
              <FormGroup>
                <Label>
                  Medication Name <span className="required">*</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Aspirin, Metformin"
                    required
                  />
                </Label>
              </FormGroup>
              
              <FormGroup>
                <Label>
                  Dosage <span className="required">*</span>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 81mg, 500mg"
                    required
                  />
                </Label>
              </FormGroup>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormGroup>
                  <Label>
                    Time Slot <span className="required">*</span>
                    <select
                      value={formData.slot}
                      onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                    >
                      {slots.map(slot => (
                        <option key={slot.value} value={slot.value}>
                          {slot.icon} {slot.label}
                        </option>
                      ))}
                    </select>
                  </Label>
                </FormGroup>
                
                <FormGroup>
                  <Label>
                    Frequency <span className="required">*</span>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    >
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="As needed">As needed</option>
                    </select>
                  </Label>
                </FormGroup>
              </div>
              
              <FormGroup>
                <Label>
                  Instructions & Notes
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g., Take with food, After meals, Before bedtime"
                    rows={2}
                  />
                </Label>
              </FormGroup>
              
              <ModalActions>
                <button type="button" className="btn outline" onClick={handleCloseModal}>
                  Close
                </button>
                <button type="submit" className="btn primary">
                  ➕ Add Medication
                </button>
              </ModalActions>
            </Form>
          </div>
        </ModalPanel>
      </Modal>
    </DashboardSection>
  );
};

export default AdminDashboard;
