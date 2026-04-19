import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}05 100%
  );
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: ${props => props.theme.spacing['4xl']};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing['2xl']};
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['4xl']};
  
  h1 {
    font-size: ${props => props.theme.fontSizes['5xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.lg};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.fontSizes['3xl']};
    }
  }
  
  .subtitle {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.muted};
    max-width: 800px;
    margin: 0 auto;
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing['4xl']};
  
  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.xl};
    padding-bottom: ${props => props.theme.spacing.md};
    border-bottom: 2px solid ${props => props.theme.colors.border};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.fontSizes['2xl']};
    }
  }
  
  h3 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    margin: ${props => props.theme.spacing.xl} 0 ${props => props.theme.spacing.md};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.fontSizes.xl};
    }
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.muted};
    line-height: ${props => props.theme.lineHeights.relaxed};
    margin-bottom: ${props => props.theme.spacing.md};
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.fontSizes.md};
    }
  }
  
  ul, ol {
    margin: ${props => props.theme.spacing.lg} 0 ${props => props.theme.spacing.xl} ${props => props.theme.spacing['2xl']};
    
    li {
      font-size: ${props => props.theme.fontSizes.lg};
      color: ${props => props.theme.colors.muted};
      line-height: ${props => props.theme.lineHeights.relaxed};
      margin-bottom: ${props => props.theme.spacing.md};
      
      @media (max-width: ${props => props.theme.breakpoints.tablet}) {
        font-size: ${props => props.theme.fontSizes.md};
      }
    }
  }
  
  strong {
    color: ${props => props.theme.colors.text};
    font-weight: ${props => props.theme.fontWeights.semibold};
  }
`;

const LastUpdated = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.muted};
  text-align: right;
  margin-top: ${props => props.theme.spacing['2xl']};
  font-style: italic;
`;

const PrivacyPolicy = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <h1>Privacy Policy</h1>
          <p className="subtitle">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </Header>
        
        <Section>
          <LastUpdated>Last Updated: November 27, 2025</LastUpdated>
          
          <h2>Introduction</h2>
          <p>
            GoldenCare Buddy ("we," "our," or "us") is committed to protecting your privacy and safeguarding your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare management platform and related services. Please read this policy carefully to understand our practices regarding your information.
          </p>
          <p>
            By accessing or using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.
          </p>
          
          <h2>Information We Collect</h2>
          <h3>Personal Information You Provide</h3>
          <p>We collect personal information that you voluntarily provide to us when:</p>
          <ul>
            <li>Registering for an account</li>
            <li>Creating or updating your profile</li>
            <li>Communicating with us via email, phone, or other channels</li>
            <li>Participating in surveys, promotions, or research</li>
            <li>Using our healthcare management features</li>
            <li>Scheduling appointments or managing medications</li>
            <li>Interacting with our AI assistant or voice call services</li>
          </ul>
          <p>This information may include:</p>
          <ul>
            <li>Name, date of birth, gender, and preferred pronouns</li>
            <li>Contact information (email address, phone number, mailing address)</li>
            <li>Health information (medications, dosages, allergies, medical conditions, family health history)</li>
            <li>Insurance information and policy details</li>
            <li>Emergency contact information</li>
            <li>Payment information and billing details</li>
            <li>Preferences and settings for personalized experiences</li>
            <li>Wellness data (activity levels, sleep patterns, mood tracking)</li>
            <li>Communication preferences and notification settings</li>
          </ul>
          
          <h3>Information Automatically Collected</h3>
          <p>When you access our services, we automatically collect certain information:</p>
          <ul>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers, screen resolution, and mobile device information</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, features used, clicks, navigation paths, and interaction patterns</li>
            <li><strong>Cookies and Tracking Technologies:</strong> Information stored through cookies, web beacons, pixels, and similar technologies</li>
            <li><strong>Location Information:</strong> Approximate location based on IP address or precise location when you grant permission</li>
            <li><strong>Technical Logs:</strong> Error reports, performance data, and diagnostic information</li>
            <li><strong>Communication Data:</strong> Metadata about interactions with our services, including timestamps and duration</li>
          </ul>
          
          <h3>Information from Third Parties</h3>
          <p>We may receive information about you from third parties, including:</p>
          <ul>
            <li>Healthcare providers who use our platform to manage patient care</li>
            <li>Family members or caregivers who assist with your account</li>
            <li>Social media platforms if you choose to connect your accounts</li>
            <li>Analytics providers who help us understand platform usage</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>We use your information for various purposes:</p>
          <ul>
            <li>To provide, maintain, and improve our healthcare management services</li>
            <li>To personalize your experience and customize content based on your preferences</li>
            <li>To communicate with you about your account, services, and important updates</li>
            <li>To process transactions and send related information and receipts</li>
            <li>To send administrative information, including security alerts and service announcements</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To detect, prevent, and address technical issues and security threats</li>
            <li>To protect the security and integrity of our services and user data</li>
            <li>To comply with legal obligations and enforce our terms of service</li>
            <li>To conduct research and analysis to improve our offerings and user experience</li>
            <li>To facilitate communication between patients, caregivers, and healthcare providers</li>
            <li>To send reminders for medication, appointments, and wellness activities</li>
            <li>To provide AI-powered health insights and recommendations</li>
          </ul>
          
          <h2>Sharing Your Information</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>With Healthcare Providers:</strong> With your explicit consent, we may share health information with doctors, nurses, pharmacists, and other healthcare professionals involved in your care to facilitate coordinated care.</li>
            <li><strong>With Family Members and Caregivers:</strong> With your permission, we may share relevant health information with family members or caregivers who assist with your healthcare management.</li>
            <li><strong>With Service Providers:</strong> We may share information with trusted third-party vendors who assist us in operating our services, conducting business, or serving our users, under strict confidentiality agreements.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose information if required by law, regulation, legal process, or governmental request, or to protect our rights, property, or safety and that of our users.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity with appropriate protections.</li>
            <li><strong>With Your Consent:</strong> We may share information for any other purpose with your explicit consent.</li>
            <li><strong>For Research Purposes:</strong> We may share anonymized or aggregated data for research purposes that advance healthcare understanding, with appropriate safeguards.</li>
          </ul>
          
          <h2>Data Security and HIPAA Compliance</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure server infrastructure, access controls, regular security assessments, and compliance with healthcare regulations.
          </p>
          <p>
            As a business associate under HIPAA, we maintain strict compliance with the Health Insurance Portability and Accountability Act and its implementing regulations. We have implemented comprehensive administrative, physical, and technical safeguards to protect electronic protected health information (ePHI).
          </p>
          <p>
            While we strive to protect your personal information, please understand that no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
          
          <h2>Your Rights and Choices</h2>
          <p>You have certain rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to the personal information we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information, subject to certain legal and medical exceptions.</li>
            <li><strong>Objection:</strong> Object to processing of your personal information in certain circumstances.</li>
            <li><strong>Data Portability:</strong> Obtain and reuse your personal information for your own purposes across different services.</li>
            <li><strong>Withdraw Consent:</strong> Withdraw your consent to processing where we rely on consent.</li>
            <li><strong>Restrict Processing:</strong> Request restriction of processing your personal information under certain conditions.</li>
            <li><strong>Opt-Out:</strong> Opt out of marketing communications and certain data processing activities.</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided below. We will respond to your request within 30 days.</p>
          
          <h2>Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law. This typically includes:
          </p>
          <ul>
            <li>Active account information: While your account is active</li>
            <li>Medical records: As required by healthcare regulations (typically 7-10 years)</li>
            <li>Transaction records: As required by financial regulations (typically 7 years)</li>
            <li>Inactive accounts: 2 years after last activity, then securely deleted</li>
          </ul>
          
          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information. Parents or guardians who believe we may have collected information from a child should contact us immediately.
          </p>
          
          <h2>International Data Transfers</h2>
          <p>
            Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. We take appropriate safeguards to ensure your information remains protected in accordance with this Privacy Policy and applicable laws.
          </p>
          
          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience and understand how our services are used. You can control cookies through your browser settings. For more detailed information about our cookie practices, please see our Cookie Policy.
          </p>
          
          <h2>Third-Party Links and Services</h2>
          <p>
            Our services may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>
          
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We will also notify you via email or in-app notification for material changes. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our privacy practices, please contact our Privacy Officer:</p>
          <ul>
            <li>Email: privacy@goldencare.com</li>
            <li>Phone: +1 (800) 555-0199</li>
            <li>Mail: GoldenCare Buddy Privacy Officer, 123 Health Street, San Francisco, CA 94107</li>
          </ul>
          <p>You may also contact us regarding any complaints or concerns about our privacy practices.</p>
        </Section>
      </ContentWrapper>
    </PageContainer>
  );
};

export default PrivacyPolicy;