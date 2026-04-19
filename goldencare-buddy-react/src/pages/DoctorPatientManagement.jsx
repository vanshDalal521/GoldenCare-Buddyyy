import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { patientAPI } from '../services/apiService';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}08 30%, 
    ${props => props.theme.colors.accentLight}08 70%,
    ${props => props.theme.colors.bg} 100%
  );
  padding: ${props => props.theme.spacing.xl};
`;

const Header = styled.header`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props => props.$secondary ? 'transparent' : `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})`};;
  color: ${props => props.$secondary ? props.theme.colors.text : 'white'};
  border: ${props => props.$secondary ? `1px solid ${props.theme.colors.border}` : 'none'};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
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
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.md};
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.outline};
  }
`;

const Select = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.md};
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.outline};
  }
`;

const TextArea = styled.textarea`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.md};
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.outline};
  }
`;

const PatientList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const PatientCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: ${props => props.theme.spacing.lg};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const PatientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PatientName = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PatientId = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.muted};
  background: ${props => props.theme.colors.primaryLight}20;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
`;

const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSizes.sm};
  
  .info-row {
    display: flex;
    justify-content: space-between;
  }
  
  .label {
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
  }
  
  .value {
    color: ${props => props.theme.colors.muted};
  }
`;

const MedicationList = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
`;

const MedicationItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MedicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const MedicationName = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
`;

const MedicationTime = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.muted};
`;

const MedicationDetails = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSizes.sm};
  
  .detail {
    display: flex;
    flex-direction: column;
    
    .label {
      color: ${props => props.theme.colors.muted};
    }
    
    .value {
      font-weight: ${props => props.theme.fontWeights.semibold};
      color: ${props => props.theme.colors.text};
    }
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.errorLight};
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.successLight};
  color: ${props => props.theme.colors.success};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DoctorPatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medications, setMedications] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    dosage: '',
    pillCount: 1,
    customTime: '',
    slot: 'Morning',
    frequency: 'Once daily',
    notes: '',
    prescribedBy: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminSession = localStorage.getItem('gc_admin_session');
    if (!adminSession) {
      navigate('/admin-login');
      return;
    }
    
    fetchPatients();
  }, [navigate]);

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAllPatients();
      if (response.success) {
        setPatients(response.patients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients');
    }
  };

  const fetchPatientMedications = async (patientId) => {
    try {
      const response = await patientAPI.getMedications(patientId);
      if (response.success) {
        setMedications(response.medications);
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      setError('Failed to fetch medications');
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      ...formData,
      patientId: patient.patientId,
      prescribedBy: '' // Reset prescribed by when selecting a new patient
    });
    fetchPatientMedications(patient.patientId);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await medicationAPI.add({
        patientId: formData.patientId,
        name: formData.name,
        dosage: formData.dosage,
        pillCount: parseInt(formData.pillCount),
        customTime: formData.customTime,
        slot: formData.slot,
        frequency: formData.frequency,
        notes: formData.notes,
        prescribedBy: formData.prescribedBy
      });

      if (response.success) {
        setSuccess('Medication added successfully!');
        // Reset form except patientId and prescribedBy
        setFormData({
          ...formData,
          name: '',
          dosage: '',
          pillCount: 1,
          customTime: '',
          slot: 'Morning',
          frequency: 'Once daily',
          notes: ''
        });
        // Refresh medications
        fetchPatientMedications(formData.patientId);
      }
    } catch (error) {
      console.error('Error adding medication:', error);
      setError(error.message || 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gc_admin_session');
    navigate('/admin-login');
  };

  return (
    <Container>
      <Header>
        <Title>Doctor Patient Management</Title>
        <Button $secondary onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Card>
        <h2>Add Medication</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Patient</Label>
            <Select 
              value={selectedPatient ? selectedPatient.patientId : ''} 
              onChange={(e) => {
                const patient = patients.find(p => p.patientId === e.target.value);
                if (patient) handlePatientSelect(patient);
              }}
              required
            >
              <option value="">Select a patient</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient.patientId}>
                  {patient.name} ({patient.patientId})
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Prescribed By</Label>
            <Input
              type="text"
              name="prescribedBy"
              value={formData.prescribedBy}
              onChange={handleChange}
              placeholder="Doctor name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Medication Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Aspirin"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Dosage</Label>
            <Input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 500mg"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Pill Count</Label>
            <Input
              type="number"
              name="pillCount"
              value={formData.pillCount}
              onChange={handleChange}
              min="1"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Time</Label>
            <Input
              type="text"
              name="customTime"
              value={formData.customTime}
              onChange={handleChange}
              placeholder="e.g., 08:00 AM"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Slot</Label>
            <Select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              required
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Frequency</Label>
            <Input
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="e.g., Once daily"
            />
          </FormGroup>
          
          <FormGroup style={{ gridColumn: '1 / -1' }}>
            <Label>Notes</Label>
            <TextArea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional instructions or notes"
            />
          </FormGroup>
          
          <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
            <Button type="submit" disabled={loading || !selectedPatient}>
              {loading ? 'Adding...' : 'Add Medication'}
            </Button>
          </div>
        </Form>
      </Card>
      
      <Card>
        <h2>Patients</h2>
        <PatientList>
          {patients.map(patient => (
            <PatientCard 
              key={patient._id} 
              onClick={() => handlePatientSelect(patient)}
              style={{ 
                cursor: 'pointer',
                border: selectedPatient && selectedPatient._id === patient._id 
                  ? `2px solid ${theme.colors.primary}` 
                  : '1px solid #e2e8f0'
              }}
            >
              <PatientHeader>
                <PatientName>{patient.name}</PatientName>
                <PatientId>{patient.patientId}</PatientId>
              </PatientHeader>
              <PatientInfo>
                <div className="info-row">
                  <span className="label">Mobile:</span>
                  <span className="value">{patient.mobile}</span>
                </div>
                <div className="info-row">
                  <span className="label">Registered:</span>
                  <span className="value">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </PatientInfo>
              
              {selectedPatient && selectedPatient._id === patient._id && medications.length > 0 && (
                <MedicationList>
                  <h4>Medications ({medications.length})</h4>
                  {medications.map(med => (
                    <MedicationItem key={med._id}>
                      <MedicationHeader>
                        <MedicationName>{med.name}</MedicationName>
                        <MedicationTime>{med.customTime}</MedicationTime>
                      </MedicationHeader>
                      <MedicationDetails>
                        <div className="detail">
                          <span className="label">Dosage</span>
                          <span className="value">{med.dosage}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Pills</span>
                          <span className="value">{med.pillCount}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Slot</span>
                          <span className="value">{med.slot}</span>
                        </div>
                      </MedicationDetails>
                      {med.notes && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                          {med.notes}
                        </div>
                      )}
                    </MedicationItem>
                  ))}
                </MedicationList>
              )}
            </PatientCard>
          ))}
        </PatientList>
      </Card>
    </Container>
  );
};

export default DoctorPatientManagement;