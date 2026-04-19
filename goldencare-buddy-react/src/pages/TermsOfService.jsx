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

const TermsOfService = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <h1>Terms of Service</h1>
          <p className="subtitle">
            These terms govern your use of GoldenCare Buddy services. Please read them carefully.
          </p>
        </Header>
        
        <Section>
          <LastUpdated>Last Updated: November 27, 2025</LastUpdated>
          
          <h2>Acceptance of Terms</h2>
          <p>
            Welcome to GoldenCare Buddy! These Terms of Service ("Terms") govern your access to and use of our healthcare management platform and related services (collectively, the "Services").
          </p>
          <p>
            By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use our Services.
          </p>
          <p>
            These Terms apply to all visitors, users, and others who access or use our Services. By using our Services, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms.
          </p>
          
          <h2>Description of Services</h2>
          <p>
            GoldenCare Buddy provides a comprehensive healthcare management platform designed to help seniors and their families manage medications, appointments, wellness activities, and communication with healthcare providers. Our Services include:
          </p>
          <ul>
            <li>Medication tracking and intelligent reminders</li>
            <li>Appointment scheduling and management with automated notifications</li>
            <li>Wellness activity tracking and personalized recommendations</li>
            <li>AI-powered voice call reminders and virtual assistance</li>
            <li>Family member communication tools and care coordination</li>
            <li>Health information organization and secure storage</li>
            <li>Educational resources and health guides</li>
            <li>Emergency alert systems and safety monitoring</li>
            <li>Integration with healthcare providers and medical records</li>
            <li>Telehealth consultation facilitation</li>
          </ul>
          <p>
            Our Services are intended for informational and organizational purposes only and do not constitute medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.
          </p>
          
          <h2>User Accounts and Registration</h2>
          <h3>Account Creation</h3>
          <p>
            To access certain features of our Services, you must register for an account. When registering, you agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
          
          <h3>Account Security</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account and password and for restricting access to your devices. You agree to accept responsibility for all activities that occur under your account or password.
          </p>
          
          <h3>Account Verification</h3>
          <p>
            We may require additional verification steps to confirm your identity and ensure the security of your account. This may include email verification, phone number confirmation, or other authentication methods.
          </p>
          
          <h2>User Conduct and Responsibilities</h2>
          <p>You agree not to use our Services to:</p>
          <ul>
            <li>Violate any applicable laws, regulations, or governmental orders</li>
            <li>Infringe upon the rights of others, including privacy and intellectual property rights</li>
            <li>Transmit any harmful, offensive, threatening, abusive, or inappropriate content</li>
            <li>Interfere with or disrupt the Services, servers, or networks</li>
            <li>Attempt to gain unauthorized access to any portion of the Services</li>
            <li>Use the Services for any illegal or unauthorized purpose</li>
            <li>Use the Services for any commercial purpose without our express written consent</li>
            <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation</li>
            <li>Collect or harvest any personally identifiable information from the Services</li>
            <li>Engage in any automated use of the system, such as scripts or bots</li>
          </ul>
          
          <h2>Intellectual Property Rights</h2>
          <p>
            The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, audio, and the design, selection, and arrangement thereof) are owned by GoldenCare Buddy, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p>
            These Terms permit you to use the Services for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as expressly permitted in these Terms.
          </p>
          
          <h2>Healthcare Disclaimer and Medical Information</h2>
          <p>
            The Services are intended for informational and organizational purposes only and do not constitute medical advice, diagnosis, or treatment. The information provided through our Services is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on our Services.
          </p>
          <p>
            Reliance on any information provided through our Services is solely at your own risk. We do not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on our Services.
          </p>
          
          <h2>Third-Party Services and Links</h2>
          <p>
            Our Services may contain links to third-party websites or services that are not owned or controlled by GoldenCare Buddy. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p>
            You acknowledge and agree that GoldenCare Buddy shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods, or services available on or through any such websites or services.
          </p>
          
          <h2>Data Accuracy and User Content</h2>
          <p>
            You are solely responsible for the accuracy, quality, integrity, legality, reliability, appropriateness, and intellectual property ownership or right to use of all information you submit to the Services.
          </p>
          
          <h2>Service Availability and Modifications</h2>
          <p>
            We may modify, suspend, or discontinue the Services (in whole or in part) at any time without notice to you. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Services.
          </p>
          
          <h2>Termination</h2>
          <p>
            We may terminate or suspend your account and access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using our Services.
          </p>
          
          <h2>Disclaimer of Warranties</h2>
          <p>
            Our Services are provided on an "as is" and "as available" basis. GoldenCare Buddy makes no warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
          <p>
            GoldenCare Buddy does not warrant that the Services will be uninterrupted, secure, or error-free, that defects will be corrected, or that the Services or servers are free of viruses or other harmful components.
          </p>
          
          <h2>Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, in no event shall GoldenCare Buddy, its affiliates, officers, directors, employees, agents, licensors, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul>
            <li>Your access to or use of or inability to access or use the Services</li>
            <li>Any conduct or content of any third party on the Services</li>
            <li>Any content obtained from the Services</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the Services</li>
          </ul>
          <p>
            In no event shall GoldenCare Buddy's total liability to you for all damages exceed the amount paid by you, if any, for accessing the Services during the twelve months immediately preceding the event giving rise to the claim.
          </p>
          
          <h2>Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless GoldenCare Buddy and its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
          </p>
          <ul>
            <li>Your violation of these Terms</li>
            <li>Your use of the Services, including, but not limited to, your User Contributions</li>
            <li>Your violation of any rights of another</li>
            <li>Your violation of any applicable laws, rules, or regulations</li>
            <li>Any other party's access and use of the Services with your unique username, password, or other appropriate security code</li>
          </ul>
          
          <h2>Governing Law and Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
          </p>
          <p>
            Any legal action or proceeding arising under or relating to these Terms shall be brought exclusively in the federal courts of the United States or the courts of the State of California, in each case located in San Francisco County, California. You irrevocably consent to the personal jurisdiction of such courts.
          </p>
          
          <h2>Dispute Resolution</h2>
          <p>
            Any dispute, claim, or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by arbitration in San Francisco, California.
          </p>
          
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          <p>
            What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.
          </p>
          
          <h2>Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul>
            <li>Email: support@goldencare@gmail.com</li>
            <li>Phone: +91 9253395564</li>
            <li>Address: GoldenCare Buddy, Healthcare Innovation Center, San Francisco, CA 94105</li>
          </ul>
        </Section>
      </ContentWrapper>
    </PageContainer>
  );
};

export default TermsOfService;