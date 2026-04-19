import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import medicalRecordService from '../services/medicalRecordService';

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

const FilterBar = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
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

const UploadCard = styled(Card)`
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primaryLight}10 0%,
    ${props => props.theme.colors.accentLight}10 100%
  );
  border: 2px dashed ${props => props.theme.colors.primary};
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  background: ${props => props.theme.colors.bg}05;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight}10;
  }
`;

const UploadButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: ${props => `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})`};;
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.md};
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
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const PatientRecords = () => {
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    search: ''
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [patientName, setPatientName] = useState('Mr. Vansh');
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    recordType: 'Lab Report',
    file: null
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Load patient records
  useEffect(() => {
    const loadRecordsWrapper = async () => {
      await loadRecords();
    };
    loadRecordsWrapper();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = records;
    
    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(record => record.recordType === filters.type);
    }
    
    // Filter by search term
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(record => 
        record.title.toLowerCase().includes(term) ||
        record.description.toLowerCase().includes(term) ||
        record.fileName.toLowerCase().includes(term)
      );
    }
    
    setFilteredRecords(result);
  }, [filters, records]);

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleDownload = async (recordId) => {
    try {
      // Call the download service method
      const response = await medicalRecordService.downloadRecord(recordId);
      
      // Get the filename from the response headers
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'medical-record.pdf'; // default filename
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Convert the response to a blob
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert(`Download failed: ${error.message}`);
    }
  };

  const handleDelete = async (recordId) => {
    // Confirm with the user before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this medical record? This action cannot be undone.');
    
    if (!confirmDelete) {
      return;
    }
    
    try {
      // Call the delete service method
      await medicalRecordService.deleteRecord(recordId);
      
      // Show success message
      alert('Record deleted successfully');
      
      // Refresh the records list
      loadRecords();
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Delete failed: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gc_patient_session');
    navigate('/login');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Debug: Check session
    const patientSession = localStorage.getItem('gc_patient_session');
    console.log('Patient session in handleUpload:', patientSession);
    
    if (!uploadData.file || !uploadData.title) {
      alert('Please select a file and enter a title');
      return;
    }
    
    setUploading(true);
    setUploadSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('recordType', uploadData.recordType);
      
      await medicalRecordService.uploadRecord(formData);
      
      setUploadSuccess(true);
      // Reset form
      setUploadData({
        title: '',
        description: '',
        recordType: 'Lab Report',
        file: null
      });
      // Refresh records list
      loadRecords();
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Automatically hide the success message after 2 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Load patient records
  const loadRecords = async () => {
    const patientSession = localStorage.getItem('gc_patient_session');
    const patientUser = patientSession ? JSON.parse(patientSession) : null;
    
    if (patientUser?.name) {
      setPatientName(patientUser.name);
    }

    try {
      // Fetch records from the API instead of using mock data
      const recordsData = await medicalRecordService.getRecords();
      // The API returns an array directly, not wrapped in an object
      setRecords(Array.isArray(recordsData) ? recordsData : []);
      setFilteredRecords(Array.isArray(recordsData) ? recordsData : []);
    } catch (error) {
      console.error('Error loading records:', error);
      // Show error to user
      alert('Failed to load records: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecordsContainer>
      <Header>
        <Title>My Medical Records</Title>
        <Button $secondary onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      
      <UploadCard>
        <h2>📤 Upload Medical Report</h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          Upload your medical reports for your doctors to review
        </p>
        
        {uploadSuccess && (
          <div style={{ 
            backgroundColor: '#d1fae5', 
            color: '#065f46', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '1px solid #10b981'
          }}>
            ✅ Report uploaded successfully!
          </div>
        )}
        
        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <Label>Title *</Label>
              <Input
                type="text"
                name="title"
                value={uploadData.title}
                onChange={handleInputChange}
                placeholder="e.g., Blood Test Report"
                required
              />
            </div>
            
            <div>
              <Label>Record Type</Label>
              <Select
                name="recordType"
                value={uploadData.recordType}
                onChange={handleInputChange}
              >
                <option value="Lab Report">Lab Report</option>
                <option value="Imaging">Imaging</option>
                <option value="Prescription">Prescription</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Discharge Summary">Discharge Summary</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Label>Description</Label>
            <Input
              type="text"
              name="description"
              value={uploadData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the report"
            />
          </div>
          
          <UploadArea onClick={handleUploadClick}>
            <FileInput
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>
              {uploadData.file ? '📁' : '📤'}
            </div>
            <h3>
              {uploadData.file ? uploadData.file.name : 'Click to select file'}
            </h3>
            <p style={{ color: '#666', marginTop: '8px' }}>
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </p>
          </UploadArea>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <UploadButton type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : '📤 Upload Report'}
            </UploadButton>
          </div>
        </form>
      </UploadCard>
      
      <Card>
        <h2>Filter Records</h2>
        <FilterBar>
          <FilterGroup>
            <Label>Record Type</Label>
            <Select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Lab Report">Lab Report</option>
              <option value="Imaging">Imaging</option>
              <option value="Prescription">Prescription</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Discharge Summary">Discharge Summary</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search records..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>
        </FilterBar>
      </Card>
      
      <Card>
        <h2>My Records ({filteredRecords.length})</h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
            Loading records...
          </p>
        ) : filteredRecords.length > 0 ? (
          <RecordsList>
            {filteredRecords.map(record => (
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
                  <DownloadButton 
                    onClick={() => handleDelete(record._id)}
                    style={{ 
                      backgroundColor: '#ef4444', 
                      marginLeft: '8px' 
                    }}
                  >
                    🗑️ Delete
                  </DownloadButton>
                </div>
              </RecordCard>
            ))}
          </RecordsList>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
            No records found matching your filters
          </p>
        )}
      </Card>
    </RecordsContainer>
  );
};

export default PatientRecords;