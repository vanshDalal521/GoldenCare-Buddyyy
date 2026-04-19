import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RecordsContainer = styled.div`
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

const FileInput = styled.input`
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

const RecordsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const RecordCard = styled.div`
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

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const RecordTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const RecordType = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.muted};
  background: ${props => props.theme.colors.primaryLight}20;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
`;

const RecordInfo = styled.div`
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

const DownloadButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
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

const DoctorPatientRecords = () => {
  const [patients] = useState([
    {
      _id: '1',
      name: 'Mr. Rajesh Kumar',
      patientId: 'PAT001',
      mobile: '9876543210',
      createdAt: new Date('2023-01-15')
    },
    {
      _id: '2',
      name: 'Mrs. Priya Sharma',
      patientId: 'PAT002',
      mobile: '9876543211',
      createdAt: new Date('2023-02-20')
    }
  ]);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    recordType: 'Lab Report',
    title: '',
    description: '',
    file: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPatientRecords = async (patientId) => {
    try {
      // In a real implementation, this would fetch records from the backend
      // For now, we'll set records to empty array
      setRecords([]);
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to fetch records');
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      ...formData,
      patientId: patient.patientId
    });
    fetchPatientRecords(patient.patientId);
  };

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real implementation, this would upload the file to the backend
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Record uploaded successfully!');
      // Reset form except patientId
      setFormData({
        ...formData,
        recordType: 'Lab Report',
        title: '',
        description: '',
        file: null
      });
      // Refresh records
      fetchPatientRecords(formData.patientId);
    } catch (error) {
      console.error('Error uploading record:', error);
      setError(error.message || 'Failed to upload record');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (recordId) => {
    // In a real implementation, this would download the file from the backend
    // For now, we'll simulate the download
    alert(`Downloading record ${recordId}...`);
  };

  const handleLogout = () => {
    localStorage.removeItem('gc_doctor_session');
    navigate('/login');
  };

  return (
    <RecordsContainer>
      <Header>
        <Title>Patient Records Management</Title>
        <Button $secondary onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Card>
        <h2>Upload New Record</h2>
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
            <Label>Record Type</Label>
            <Select
              name="recordType"
              value={formData.recordType}
              onChange={handleChange}
              required
            >
              <option value="Lab Report">Lab Report</option>
              <option value="Imaging">Imaging</option>
              <option value="Prescription">Prescription</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Discharge Summary">Discharge Summary</option>
              <option value="Other">Other</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Blood Test Report"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the record"
            />
          </FormGroup>
          
          <FormGroup style={{ gridColumn: '1 / -1' }}>
            <Label>File Upload</Label>
            <FileInput
              type="file"
              name="file"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              required
            />
          </FormGroup>
          
          <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
            <Button type="submit" disabled={loading || !selectedPatient}>
              {loading ? 'Uploading...' : 'Upload Record'}
            </Button>
          </div>
        </Form>
      </Card>
      
      <Card>
        <h2>Patient Records</h2>
        {selectedPatient && records.length > 0 ? (
          <RecordsList>
            {records.map(record => (
              <RecordCard key={record._id}>
                <RecordHeader>
                  <RecordTitle>{record.title}</RecordTitle>
                  <RecordType>{record.recordType}</RecordType>
                </RecordHeader>
                <RecordInfo>
                  <div className="info-row">
                    <span className="label">Description:</span>
                    <span className="value">{record.description}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">File:</span>
                    <span className="value">{record.fileName} ({record.fileSize})</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Uploaded:</span>
                    <span className="value">
                      {new Date(record.uploadedAt).toLocaleDateString()} by {record.uploadedBy}
                    </span>
                  </div>
                </RecordInfo>
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <DownloadButton onClick={() => handleDownload(record._id)}>
                    📥 Download
                  </DownloadButton>
                </div>
              </RecordCard>
            ))}
          </RecordsList>
        ) : selectedPatient ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
            No records found for this patient
          </p>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
            Select a patient to view their records
          </p>
        )}
      </Card>
    </RecordsContainer>
  );
};

export default DoctorPatientRecords;