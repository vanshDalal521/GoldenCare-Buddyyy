import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const TestUploadCard = styled.div`
  background: linear-gradient(135deg, #e3f2fd10 0%, #f3e5f510 100%);
  border: 2px dashed #2196f3;
  border-radius: 16px;
  padding: 32px;
  margin: 24px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(33, 150, 243, 0.2);
    border-color: #2196f3;
    background: #e3f2fd20;
  }
`;

const TestUploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: #2196f3;
`;

const TestUploadTitle = styled.h3`
  color: #333;
  margin-bottom: 8px;
  font-weight: 700;
`;

const TestUploadDescription = styled.p`
  color: #666;
  margin: 0;
  font-size: 14px;
`;

const FileInput = styled.input`
  display: none;
`;

const TestUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate upload
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        setUploadSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      }, 2000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Upload Component</h1>
      <p>This is a test page to verify the upload component is working correctly.</p>
      
      <TestUploadCard onClick={handleUploadClick}>
        <FileInput
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <TestUploadIcon>
          {uploading ? '⏳' : uploadSuccess ? '✅' : '📤'}
        </TestUploadIcon>
        <TestUploadTitle>
          {uploading ? 'Uploading...' : uploadSuccess ? 'Upload Successful!' : 'Upload Medical Reports'}
        </TestUploadTitle>
        <TestUploadDescription>
          {uploadSuccess 
            ? 'Your report has been uploaded and is now visible to your doctors.'
            : 'Click here or drag and drop your medical reports for your doctors to review'}
        </TestUploadDescription>
        <TestUploadDescription style={{ marginTop: '8px', fontSize: '12px' }}>
          Supported formats: PDF, JPG, PNG, DOC, DOCX
        </TestUploadDescription>
      </TestUploadCard>
    </div>
  );
};

export default TestUpload;