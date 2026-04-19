import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { doctorAPI } from '../services/apiService';
import medicationEventService from '../services/medicationEventService.js';
import medicalRecordService from '../services/medicalRecordService.js';
import styled from 'styled-components';
import WellnessReport from '../components/WellnessReport';

const DashboardContainer = styled.div`
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
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.$secondary ? 'transparent' : `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})`};;
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
`;

const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  h2 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.lg};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
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
  transition: all ${props => props.theme.transitions.normal};
  
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
  transition: all ${props => props.theme.transitions.normal};
  
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
  transition: all ${props => props.theme.transitions.normal};
  
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
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &.selected {
    border: 2px solid ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight}08;
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
  border-left: 3px solid ${props => props.theme.colors.primary};
  
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
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
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
  animation: slideIn 0.3s ease-out, slideOut 0.3s ease-in 1.5s forwards;
  
  @keyframes slideIn {
    from { 
      opacity: 0; 
      transform: translateX(20px);
    }
    to { 
      opacity: 1; 
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
    from { 
      opacity: 1;
      transform: translateX(0);
    }
    to { 
      opacity: 0;
      transform: translateX(20px);
    }
  }
`;

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.successLight};
  color: ${props => props.theme.colors.success};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  animation: slideIn 0.3s ease-out, slideOut 0.3s ease-in 1.5s forwards;
  
  @keyframes slideIn {
    from { 
      opacity: 0; 
      transform: translateX(20px);
    }
    to { 
      opacity: 1; 
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
    from { 
      opacity: 1;
      transform: translateX(0);
    }
    to { 
      opacity: 0;
      transform: translateX(20px);
    }
  }
`;

const SearchBar = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  
  input {
    width: 100%;
    padding: ${props => props.theme.spacing.md};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: ${props => props.theme.fontSizes.md};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: ${props => props.theme.shadows.outline};
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows['2xl']};
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: ${props => props.theme.spacing.md};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    margin: 0;
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.text};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSizes['2xl']};
  cursor: pointer;
  color: ${props => props.theme.colors.muted};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const PatientDetailSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
  
  h3 {
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
    padding-bottom: ${props => props.theme.spacing.sm};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const ReportCard = styled.div`
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  .title {
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
  }
  
  .date {
    color: ${props => props.theme.colors.muted};
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

const ReportContent = styled.div`
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const AddPatientForm = styled.div`
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  h3 {
    margin-top: 0;
    color: ${props => props.theme.colors.text};
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  opacity: 0.7;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
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
  const [addPatientData, setAddPatientData] = useState({
    patientId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [patientReports, setPatientReports] = useState([]);
  const [uploadingReport, setUploadingReport] = useState(false);
  const [reportFile, setReportFile] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const navigate = useNavigate();

  // Helper function to check if medication was taken today
  const isMedicationTakenToday = (medication) => {
    if (!medication.takenHistory || medication.takenHistory.length === 0) {
      return false;
    }
    
    const today = new Date().toDateString();
    return medication.takenHistory.some(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
  };

  // Helper function to get the last taken time
  const getLastTakenTime = (medication) => {
    if (!medication.takenHistory || medication.takenHistory.length === 0) {
      return null;
    }
    
    // Sort by timestamp descending to get the most recent
    const sortedHistory = [...medication.takenHistory].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return sortedHistory[0].timestamp;
  };

  useEffect(() => {
    const doctorSession = localStorage.getItem('gc_doctor_session');
    if (!doctorSession) {
      navigate('/login');
      return;
    }
    
    try {
      const doctor = JSON.parse(doctorSession);
      
      // If the session is from an older version and missing the token, force a fresh logic
      if (!doctor.token) {
        localStorage.removeItem('gc_doctor_session');
        navigate('/login');
        return;
      }
      
      setDoctorInfo(doctor);
      setFormData(prev => ({
        ...prev,
        prescribedBy: doctor.name
      }));
      fetchPatients(doctor.doctorId);
    } catch (e) {
      localStorage.removeItem('gc_doctor_session');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Filter patients based on search term
    if (searchTerm) {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  // Auto-clear success messages after 1.5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-clear error messages after 1.5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch medications when selected patient changes
  useEffect(() => {
    if (selectedPatient && showPatientModal) {
      fetchPatientMedications(selectedPatient.patientId);
    }
  }, [selectedPatient, showPatientModal]);

  const fetchPatients = async (doctorId) => {
    try {
      const response = await doctorAPI.getPatients(doctorId);
      if (response.success) {
        setPatients(response.patients);
        setFilteredPatients(response.patients);
      } else {
        setError(response.message || 'Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Provide more specific error messages
      if (error.message && error.message.includes('HTTP 404')) {
        setError('Doctor patients endpoint not found. Please check if the server is running correctly.');
      } else if (error.message && error.message.includes('HTTP 500')) {
        setError('Server error occurred while fetching patients. Please try again later.');
      } else if (error.message && error.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to fetch patients: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const fetchPatientMedications = async (patientId) => {
    try {
      setLoading(true);
      const response = await doctorAPI.getPatientMedications(doctorInfo.doctorId, patientId);
      console.log(`[DoctorDashboard] Fetching medications for patient ${patientId}:`, response);
      if (response.success) {
        setMedications(response.medications || []);
        console.log(`[DoctorDashboard] Set medications for patient ${patientId}:`, response.medications || []);
      } else {
        setMedications([]);
        setError(response.message || 'Failed to fetch medications');
        
        // Auto-clear error message after 1.5 seconds
        setTimeout(() => {
          setError('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      setMedications([]);
      setError('Failed to fetch medications');
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientReports = async (patientId) => {
    try {
      // In a real environment, we'd have an endpoint to get reports for a specific patient as a doctor
      // For now, we'll use the doctor's view which fetches all records for their patients
      const allRecords = await medicalRecordService.getDoctorViewRecords();
      const patientSpecific = allRecords.filter(r => r.patientId === patientId);
      setPatientReports(patientSpecific);
    } catch (error) {
      console.error('Error fetching patient reports:', error);
      setPatientReports([]);
    }
  };

  const handleReportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReportFile(file);
      if (!reportTitle) {
        setReportTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleReportUpload = async (e) => {
    e.preventDefault();
    if (!reportFile || !selectedPatient) return;

    setUploadingReport(true);
    const formData = new FormData();
    formData.append('file', reportFile);
    formData.append('title', reportTitle || 'Medical Report');
    formData.append('patientId', selectedPatient.patientId);
    formData.append('recordType', 'report');

    try {
      await medicalRecordService.doctorUploadRecord(formData);
      setSuccess('Medical report uploaded successfully');
      setReportFile(null);
      setReportTitle('');
      fetchPatientReports(selectedPatient.patientId);
    } catch (error) {
      console.error('Report upload failed:', error);
      setError(error.message || 'Failed to upload report');
    } finally {
      setUploadingReport(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      ...formData,
      patientId: patient.patientId,
      prescribedBy: doctorInfo?.name || ''
    });
    fetchPatientMedications(patient.patientId);
    fetchPatientReports(patient.patientId);
  };

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    // Set the patientId in formData so medication can be added
    setFormData({
      ...formData,
      patientId: patient.patientId,
      prescribedBy: doctorInfo?.name || ''
    });
    fetchPatientMedications(patient.patientId);
    fetchPatientReports(patient.patientId);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleAddPatientChange = (e) => {
    setAddPatientData({
      ...addPatientData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Clear previous notifications
    setError('');
    setSuccess('');

    // Validate required fields
    if (!formData.patientId) {
      setError('Please select a patient first');
      setLoading(false);
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    if (!formData.name || !formData.name.trim()) {
      setError('Medication name is required');
      setLoading(false);
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    if (!formData.dosage || !formData.dosage.trim()) {
      setError('Dosage is required');
      setLoading(false);
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    if (!formData.customTime || !formData.customTime.trim()) {
      setError('Time is required');
      setLoading(false);
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    // Validate time format
    if (formData.customTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.customTime) && 
        !/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(formData.customTime)) {
      setError('Invalid time format. Please use HH:MM (24-hour) or HH:MM AM/PM (12-hour) format.');
      setLoading(false);
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    if (!formData.slot) {
      setError('Time slot is required');
      setLoading(false);
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    if (!formData.prescribedBy || !formData.prescribedBy.trim()) {
      setError('Prescribed by is required');
      setLoading(false);
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
      return;
    }

    // Format time if needed
    let formattedTime = formData.customTime;
    if (formattedTime && /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formattedTime)) {
      // Convert 24-hour to 12-hour format
      const [hours, minutes] = formattedTime.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    console.log(`[DoctorDashboard] Adding medication for patient ${formData.patientId}:`, {
      patientId: formData.patientId,
      name: formData.name,
      dosage: formData.dosage,
      pillCount: parseInt(formData.pillCount) || 1,
      customTime: formattedTime,
      slot: formData.slot,
      frequency: formData.frequency,
      notes: formData.notes,
      prescribedBy: formData.prescribedBy
    });

    try {
      const response = await doctorAPI.addMedication(doctorInfo.doctorId, {
        patientId: formData.patientId,
        name: formData.name.trim(),
        dosage: formData.dosage.trim(),
        pillCount: parseInt(formData.pillCount) || 1,
        customTime: formattedTime,
        slot: formData.slot,
        frequency: formData.frequency,
        notes: formData.notes,
        prescribedBy: formData.prescribedBy.trim()
      });

      console.log(`[DoctorDashboard] Medication API response for patient ${formData.patientId}:`, response);

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
        
        // Notify patient dashboard about the medication update
        console.log(`[DoctorDashboard] Notifying about medication update for patient ${formData.patientId}`);
        console.log(`[DoctorDashboard] Patient ID type: ${typeof formData.patientId}, value: "${formData.patientId}"`);
        // Normalize patientId to string for consistent comparison
        const normalizedPatientId = String(formData.patientId);
        console.log(`[DoctorDashboard] Normalized patient ID: ${normalizedPatientId}`);
        console.log(`[DoctorDashboard] MedicationEventService state before notification:`, {
          registeredPatientIds: medicationEventService.getRegisteredPatientIds(),
          listenerCount: medicationEventService.getListenerCount(normalizedPatientId)
        });
        console.log(`[DoctorDashboard] All current listeners:`, medicationEventService.listeners);
        medicationEventService.notify(normalizedPatientId);
        
        // Also trigger a global refresh to ensure all connected clients update
        window.dispatchEvent(new CustomEvent('medicationUpdate', { detail: { patientId: normalizedPatientId } }));
        
        // Log the current state of listeners
        console.log(`[DoctorDashboard] Current listeners for patient ${normalizedPatientId}:`, medicationEventService.getListenerCount(normalizedPatientId));
        console.log(`[DoctorDashboard] All registered patient IDs:`, medicationEventService.getRegisteredPatientIds());
        
        // Wait a bit and notify again to ensure delivery
        setTimeout(() => {
          console.log(`[DoctorDashboard] Sending second notification for patient ${normalizedPatientId}`);
          medicationEventService.notify(normalizedPatientId);
          window.dispatchEvent(new CustomEvent('medicationUpdate', { detail: { patientId: normalizedPatientId } }));
        }, 1000);

        // Auto-clear success message after 1.5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 1500);
      } else {
        setError(response.message || 'Failed to add medication');
        
        // Auto-clear error message after 1.5 seconds
        setTimeout(() => {
          setError('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding medication:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Provide more specific error messages to the user
      if (error.message && error.message.includes('time format')) {
        setError('Invalid time format. Please use HH:MM AM/PM or HH:MM (24-hour format)');
      } else if (error.message && error.message.includes('Validation error')) {
        setError(`Validation error: ${error.message.split('Validation error: ')[1]}`);
      } else if (error.message && error.message.includes('Patient not found')) {
        setError('Selected patient not found. Please select a valid patient.');
      } else if (error.message && error.message.includes('Doctor not found')) {
        setError('Doctor session expired. Please log in again.');
      } else if (error.message && error.message.includes('Patient is not assigned')) {
        setError('Selected patient is not assigned to you. Please select a patient assigned to you.');
      } else if (error.message && error.message.includes('Medication name is required')) {
        setError('Medication name is required. Please enter a valid medication name.');
      } else if (error.message && error.message.includes('Medication dosage is required')) {
        setError('Medication dosage is required. Please enter a valid dosage.');
      } else if (error.message && error.message.includes('Medication time is required')) {
        setError('Medication time is required. Please enter a valid time.');
      } else if (error.message && error.message.includes('Medication slot is required')) {
        setError('Medication slot is required. Please select a time slot.');
      } else if (error.message && error.message.includes('Prescribed by is required')) {
        setError('Prescribed by field is required. Please enter the prescribing doctor\'s name.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.message || 'Failed to add medication. Please check all fields and try again.');
      }
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Clear previous notifications
    setError('');
    setSuccess('');

    try {
      const response = await doctorAPI.assignPatient(doctorInfo.doctorId, addPatientData.patientId);
      if (response.success) {
        setSuccess('Patient added successfully!');
        setAddPatientData({ patientId: '' });
        setShowAddPatientForm(false);
        // Refresh patients list
        fetchPatients(doctorInfo.doctorId);
        
        // Auto-clear success message after 1.5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 1500);
      } else {
        setError(response.message || 'Failed to add patient');
        
        // Auto-clear error message after 1.5 seconds
        setTimeout(() => {
          setError('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      setError(error.message || 'Failed to add patient');
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePatient = async (patientId, patientName) => {
    // Confirm before removing
    if (!window.confirm(`Are you sure you want to remove ${patientName} from your patient list?`)) {
      return;
    }

    // Clear previous notifications
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      const response = await doctorAPI.removePatient(doctorInfo.doctorId, patientId);
      
      if (response.success) {
        setSuccess(`${patientName} removed successfully!`);
        // Refresh patients list
        fetchPatients(doctorInfo.doctorId);

        // Auto-clear success message after 1.5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 1500);
        
        // If the removed patient is the currently selected patient, close the modal
        if (selectedPatient && selectedPatient.patientId === patientId) {
          setShowPatientModal(false);
          setSelectedPatient(null);
        }
      } else {
        setError(response.message || 'Failed to remove patient');
        
        // Auto-clear error message after 1.5 seconds
        setTimeout(() => {
          setError('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error removing patient:', error);
      setError(error.message || 'Failed to remove patient');
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMedication = async (medicationId, medicationName) => {
    // Confirm before removing
    if (!window.confirm(`Are you sure you want to remove ${medicationName} from this patient's medication list?`)) {
      return;
    }

    // Clear previous notifications
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      const response = await doctorAPI.removeMedication(doctorInfo.doctorId, formData.patientId, medicationId);
      
      console.log(`[DoctorDashboard] Remove medication API response for patient ${formData.patientId}:`, response);
      
      if (response.success) {
        setSuccess(`${medicationName} removed successfully!`);
        // Refresh medications list
        fetchPatientMedications(formData.patientId);
        
        // Notify patient dashboard about the medication update
        console.log(`[DoctorDashboard] Notifying about medication removal for patient ${formData.patientId}`);
        console.log(`[DoctorDashboard] Patient ID type: ${typeof formData.patientId}, value: "${formData.patientId}"`);
        // Normalize patientId to string for consistent comparison
        const normalizedPatientId = String(formData.patientId);
        console.log(`[DoctorDashboard] Normalized patient ID: ${normalizedPatientId}`);
        console.log(`[DoctorDashboard] MedicationEventService state before notification:`, {
          registeredPatientIds: medicationEventService.getRegisteredPatientIds(),
          listenerCount: medicationEventService.getListenerCount(normalizedPatientId)
        });
        medicationEventService.notify(normalizedPatientId);
        
        // Also trigger a global refresh to ensure all connected clients update
        window.dispatchEvent(new CustomEvent('medicationUpdate', { detail: { patientId: normalizedPatientId } }));
        
        // Log the current state of listeners
        console.log(`[DoctorDashboard] Current listeners for patient ${normalizedPatientId}:`, medicationEventService.getListenerCount(normalizedPatientId));
        console.log(`[DoctorDashboard] All registered patient IDs:`, medicationEventService.getRegisteredPatientIds());
        
        // Wait a bit and notify again to ensure delivery
        setTimeout(() => {
          console.log(`[DoctorDashboard] Sending second notification for patient ${normalizedPatientId}`);
          medicationEventService.notify(normalizedPatientId);
          window.dispatchEvent(new CustomEvent('medicationUpdate', { detail: { patientId: normalizedPatientId } }));
        }, 1000);
        
        // Auto-clear success message after 1.5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 1500);
      } else {
        setError(response.message || 'Failed to remove medication');
        
        // Auto-clear error message after 1.5 seconds
        setTimeout(() => {
          setError('');
        }, 1500);
      }
    } catch (error) {
      console.error('Error removing medication:', error);
      setError(error.message || 'Failed to remove medication');
      
      // Auto-clear error message after 1.5 seconds
      setTimeout(() => {
        setError('');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gc_doctor_session');
    navigate('/login');
  };

  return (
    <DashboardContainer>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Title>Doctor Dashboard</Title>
          {doctorInfo && (
            <div style={{ 
              background: '#e6f7ff', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              fontWeight: '500',
              color: '#1890ff',
              fontSize: '14px'
            }}>
              {doctorInfo.name && doctorInfo.name.toLowerCase().includes('dr.') ? doctorInfo.name : `Dr. ${doctorInfo.name}`}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button $secondary onClick={() => navigate('/doctor-profile')}>
            Profile
          </Button>
          <Button $secondary onClick={() => setShowAddPatientForm(!showAddPatientForm)}>
            {showAddPatientForm ? 'Cancel' : 'Add Patient'}
          </Button>
          <Button $secondary onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Header>
      
      {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
      {success && <SuccessMessage>✅ {success}</SuccessMessage>}
      
      {showAddPatientForm && (
        <AddPatientForm>
          <h3>Add Patient by ID</h3>
          <Form onSubmit={handleAddPatient} style={{ gridTemplateColumns: '1fr auto' }}>
            <FormGroup>
              <Label>Patient ID *</Label>
              <Input
                type="text"
                name="patientId"
                value={addPatientData.patientId}
                onChange={handleAddPatientChange}
                placeholder="Enter patient ID"
                required
              />
            </FormGroup>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Patient'}
              </Button>
            </div>
          </Form>
        </AddPatientForm>
      )}
      
      <Card>
        <h2>👥 My Patients</h2>
        <SearchBar>
          <Input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <PatientList>
          {filteredPatients.map(patient => (
            <PatientCard 
              key={patient._id} 
              onClick={() => handleViewPatientDetails(patient)}
            >
              <RemoveButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePatient(patient.patientId, patient.name);
                }}
                disabled={loading}
              >
                ×
              </RemoveButton>
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
            </PatientCard>
          ))}
        </PatientList>
      </Card>
      
      {showPatientModal && selectedPatient && (
        <Modal onClick={() => setShowPatientModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Patient Details: {selectedPatient.name}</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  $secondary 
                  onClick={() => handleRemovePatient(selectedPatient.patientId, selectedPatient.name)}
                  disabled={loading}
                >
                  Remove Patient
                </Button>
                <CloseButton onClick={() => setShowPatientModal(false)}>×</CloseButton>
              </div>
            </ModalHeader>
            <ModalBody>
              <PatientDetailSection>
                <h3>📋 Patient Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <strong>Patient ID:</strong> {selectedPatient.patientId}
                  </div>
                  <div>
                    <strong>Name:</strong> {selectedPatient.name}
                  </div>
                  <div>
                    <strong>Mobile:</strong> {selectedPatient.mobile}
                  </div>
                  <div>
                    <strong>Registered:</strong> {new Date(selectedPatient.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </PatientDetailSection>
              
              <WellnessReport patientId={selectedPatient.patientId} />
              
              <PatientDetailSection>
                <h3>📊 Medical Reports</h3>
                <div style={{ marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#475569' }}>Upload New Report for Patient</h4>
                  <form onSubmit={handleReportUpload} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <Label style={{ fontSize: '12px', marginBottom: '4px' }}>Report Title</Label>
                      <Input 
                        type="text" 
                        value={reportTitle} 
                        onChange={(e) => setReportTitle(e.target.value)}
                        placeholder="e.g., Blood Test results"
                        style={{ padding: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Label style={{ fontSize: '12px', marginBottom: '4px' }}>File</Label>
                      <Input 
                        type="file" 
                        onChange={handleReportFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ padding: '5px', fontSize: '12px' }}
                      />
                    </div>
                    <Button type="submit" disabled={uploadingReport || !reportFile} style={{ height: '38px', padding: '0 20px' }}>
                      {uploadingReport ? 'Uploading...' : 'Upload'}
                    </Button>
                  </form>
                </div>

                {patientReports.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {patientReports.map(report => (
                      <ReportCard key={report._id} style={{ marginBottom: 0 }}>
                        <ReportHeader>
                          <div className="title" style={{ fontSize: '13px' }}>{report.title}</div>
                          <div className="date">{new Date(report.uploadedAt).toLocaleDateString()}</div>
                        </ReportHeader>
                        <ReportContent>
                          <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>By: {report.uploadedBy === 'doctor' ? `You (Dr. Dashboard)` : 'Patient'}</span>
                            <span style={{ 
                              background: report.isAnalyzed ? '#ecfdf5' : '#fef2f2', 
                              color: report.isAnalyzed ? '#059669' : '#dc2626',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px'
                            }}>
                              {report.isAnalyzed ? 'Analyzed' : 'Not Analyzed'}
                            </span>
                          </div>
                        </ReportContent>
                      </ReportCard>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No medical reports uploaded yet.</p>
                )}
              </PatientDetailSection>
              
              <PatientDetailSection>
                <h3>💊 Add Medication</h3>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Medication Name *</Label>
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
                    <Label>Dosage *</Label>
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
                    <Label>Time *</Label>
                    <Input
                      type="text"
                      name="customTime"
                      value={formData.customTime}
                      onChange={handleChange}
                      placeholder="e.g., 08:00 AM or 08:00 (24-hour)"
                      required
                    />
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      Format: HH:MM AM/PM or HH:MM (24-hour)
                    </div>
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
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Medication'}
                    </Button>
                  </div>
                </Form>
              </PatientDetailSection>
              
              <PatientDetailSection>
                <h3>💊 Current Medications</h3>
                {medications.length > 0 ? (
                  <MedicationList>
                    {medications.map(med => {
                      const takenToday = isMedicationTakenToday(med);
                      const lastTakenTime = getLastTakenTime(med);
                      
                      return (
                        <MedicationItem key={med._id} style={{ 
                          borderLeft: takenToday ? '4px solid #52c41a' : 'none',
                          position: 'relative'
                        }}>
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
                            {takenToday && (
                              <div className="detail" style={{ color: '#52c41a', fontWeight: 'bold' }}>
                                <span className="label">Status</span>
                                <span className="value">Taken Today</span>
                              </div>
                            )}
                          </MedicationDetails>
                          {med.notes && (
                            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                              {med.notes}
                            </div>
                          )}
                          {takenToday && lastTakenTime && (
                            <div style={{ 
                              marginTop: '8px', 
                              fontSize: '12px', 
                              color: '#52c41a',
                              fontStyle: 'italic'
                            }}>
                              Taken at {new Date(lastTakenTime).toLocaleTimeString()}
                            </div>
                          )}
                          <div style={{ marginTop: '12px', textAlign: 'right' }}>
                            <Button 
                              $secondary 
                              onClick={() => handleRemoveMedication(med._id, med.name)}
                              disabled={loading}
                              style={{ padding: '6px 12px', fontSize: '14px' }}
                            >
                              {loading ? 'Removing...' : 'Delete'}
                            </Button>
                          </div>
                        </MedicationItem>
                      );
                    })}
                  </MedicationList>
                ) : (
                  <p>No medications assigned yet.</p>
                )}
              </PatientDetailSection>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
};

export default DoctorDashboard;