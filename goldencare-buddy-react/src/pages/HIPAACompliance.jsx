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
  
  .compliance-badge {
    display: inline-block;
    background: linear-gradient(135deg, ${props => props.theme.colors.success}, ${props => props.theme.colors.accent});
    color: white;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    border-radius: ${props => props.theme.borderRadius.full};
    font-weight: ${props => props.theme.fontWeights.semibold};
    margin: ${props => props.theme.spacing.lg} 0;
  }
`;

const LastUpdated = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.muted};
  text-align: right;
  margin-top: ${props => props.theme.spacing['2xl']};
  font-style: italic;
`;

const HIPAACompliance = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <h1>HIPAA Compliance</h1>
          <p className="subtitle">
            Our commitment to protecting your health information in accordance with the Health Insurance Portability and Accountability Act.
          </p>
        </Header>
        
        <Section>
          <LastUpdated>Last Updated: November 27, 2025</LastUpdated>
          
          <div className="compliance-badge">HIPAA Compliant</div>
          
          <h2>Our Commitment to HIPAA Compliance</h2>
          <p>
            GoldenCare Buddy is committed to maintaining the privacy and security of all protected health information (PHI) in accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and its implementing regulations.
          </p>
          <p>
            We understand that your health information is deeply personal and sensitive. As such, we have implemented comprehensive policies, procedures, and technical safeguards to ensure the confidentiality, integrity, and availability of all electronic protected health information (ePHI) that we create, receive, maintain, or transmit.
          </p>
          <p>
            Our commitment to HIPAA compliance is ongoing and involves continuous monitoring, regular staff training, periodic risk assessments, and staying current with evolving healthcare privacy and security standards.
          </p>
          
          <h2>What is HIPAA?</h2>
          <p>
            The Health Insurance Portability and Accountability Act (HIPAA) is a federal law that establishes requirements for healthcare providers, health plans, and healthcare clearinghouses to protect individuals' medical records and other personal health information.
          </p>
          <p>
            HIPAA consists of several key rules, including:
          </p>
          <ul>
            <li><strong>Privacy Rule:</strong> Establishes national standards for the protection of individuals' medical records and other personal health information. This rule gives patients rights over their health information and sets boundaries on the use and release of health records.</li>
            <li><strong>Security Rule:</strong> Sets national standards for protecting electronic personal health information that is created, received, used, or maintained by covered entities. The Security Rule requires appropriate administrative, physical, and technical safeguards to ensure the confidentiality, integrity, and security of electronic protected health information.</li>
            <li><strong>Breach Notification Rule:</strong> Requires covered entities and business associates to provide notification following a breach of unsecured protected health information. Notifications must be provided to affected individuals, the Secretary of Health and Human Services, and in some cases, the media.</li>
            <li><strong>Enforcement Rule:</strong> Establishes procedures for investigating violations and imposing penalties for failures to comply with the HIPAA Rules.</li>
            <li><strong>Omnibus Rule:</strong> Updated the HIPAA Rules to strengthen the privacy and security protections for health information and incorporate provisions of the Health Information Technology for Economic and Clinical Health (HITECH) Act.</li>
          </ul>
          
          <h2>Our Role Under HIPAA</h2>
          <p>
            GoldenCare Buddy functions as a business associate under HIPAA. As a business associate, we are required to:
          </p>
          <ul>
            <li>Ensure the confidentiality, integrity, and availability of all electronic protected health information we create, receive, maintain, or transmit</li>
            <li>Identify and protect against reasonably anticipated threats to the security or integrity of the information</li>
            <li>Protect against reasonably anticipated, impermissible uses or disclosures</li>
            <li>Ensure our workforce members comply with this policy</li>
            <li>Implement administrative, physical, and technical safeguards to protect electronic protected health information</li>
            <li>Maintain written policies and procedures regarding the use and disclosure of protected health information</li>
            <li>Report any security incidents or breaches to covered entities promptly</li>
            <li>Enter into business associate agreements with any subcontractors who may have access to protected health information</li>
          </ul>
          
          <h2>Administrative Safeguards</h2>
          <p>We have implemented the following administrative safeguards:</p>
          <ul>
            <li>Comprehensive security management process to identify and mitigate risks</li>
            <li>Designation of a Privacy Officer and Security Officer</li>
            <li>Workforce security training and awareness programs</li>
            <li>Written policies and procedures for protecting health information</li>
            <li>Business associate agreements with all subcontractors who may access PHI</li>
            <li>Regular risk assessments and security evaluations</li>
            <li>Incident response procedures</li>
            <li>Sanction policy for workforce members who fail to comply with security policies</li>
            <li>Information system activity review procedures</li>
            <li>Contingency planning for data backup and disaster recovery</li>
            <li>Evaluation procedures to periodically assess the effectiveness of security policies</li>
          </ul>
          
          <h2>Physical Safeguards</h2>
          <p>Our physical safeguards include:</p>
          <ul>
            <li>Facility access controls to limit physical access to our systems</li>
            <li>Workstation and device security policies</li>
            <li>Secure disposal of electronic media containing PHI</li>
            <li>Protection from natural and environmental hazards</li>
            <li>Hardware and equipment maintenance procedures</li>
            <li>Media re-use protocols to ensure PHI is removed before media is reused</li>
            <li>Physical safeguards for workstations that access ePHI</li>
            <li>Procedures for the transfer, removal, disposal, and re-use of electronic media</li>
          </ul>
          
          <h2>Technical Safeguards</h2>
          <p>We implement the following technical safeguards:</p>
          <ul>
            <li><strong>Access Controls:</strong> Unique user identification, emergency access procedures, automatic logoff, and encryption/decryption mechanisms</li>
            <li><strong>Audit Controls:</strong> Hardware and software mechanisms that record and examine activity in information systems that contain or use ePHI</li>
            <li><strong>Integrity:</strong> Mechanisms to ensure that ePHI is not improperly modified or destroyed</li>
            <li><strong>Person or Entity Authentication:</strong> Procedures to verify that a person or entity seeking access to ePHI is the one claimed</li>
            <li><strong>Transmission Security:</strong> Encryption of ePHI during transmission when appropriate</li>
            <li><strong>Encryption:</strong> Implementation of encryption for data at rest and in transit using industry-standard protocols</li>
            <li><strong>Multi-factor Authentication:</strong> Enhanced authentication measures for accessing systems containing ePHI</li>
            <li><strong>Firewall Protection:</strong> Network security measures to protect against unauthorized access</li>
            <li><strong>Intrusion Detection Systems:</strong> Monitoring systems to detect and respond to security threats</li>
          </ul>
          
          <h2>Data Encryption and Security</h2>
          <p>
            We employ industry-standard encryption technologies to protect your health information both in transit and at rest:
          </p>
          <ul>
            <li>All data transmission is secured using TLS 1.3 encryption</li>
            <li>Data at rest is encrypted using AES-256 encryption</li>
            <li>Database encryption for all stored health information</li>
            <li>End-to-end encryption for communication features</li>
            <li>Encrypted backups with secure key management</li>
            <li>Regular encryption key rotation and management</li>
            <li>Implementation of secure cryptographic standards compliant with NIST guidelines</li>
          </ul>
          
          <h2>Access Controls and Authentication</h2>
          <p>
            We implement strict access controls to ensure that only authorized individuals can access your health information:
          </p>
          <ul>
            <li>Multi-factor authentication for all user accounts</li>
            <li>Role-based access controls limiting access to only necessary information</li>
            <li>Regular access reviews and audits</li>
            <li>Automatic session timeouts for inactive users</li>
            <li>Secure password policies and requirements</li>
            <li>Unique user identification for system access</li>
            <li>Emergency access procedures for critical situations</li>
            <li>Authorization procedures for granting access to ePHI</li>
            <li>Periodic review and modification of access permissions</li>
          </ul>
          
          <h2>Breach Notification</h2>
          <p>
            In the event of a breach of unsecured protected health information, we will:
          </p>
          <ul>
            <li>Notify affected individuals without unreasonable delay and in no case later than 60 calendar days after discovery of the breach</li>
            <li>Notify the Secretary of Health and Human Services</li>
            <li>Notify prominent media outlets if the breach affects more than 500 residents of a state or jurisdiction</li>
            <li>Provide a description of the breach and its potential impact</li>
            <li>Outline the steps individuals should take to protect themselves</li>
            <li>Describe what we are doing to investigate the breach and prevent future incidents</li>
            <li>Provide contact information for individuals to ask questions or learn more</li>
          </ul>
          
          <h2>Training and Awareness</h2>
          <p>
            All of our employees and contractors receive regular training on HIPAA compliance and our privacy and security policies. This includes:
          </p>
          <ul>
            <li>Initial HIPAA training for all new employees</li>
            <li>Annual refresher training</li>
            <li>Role-specific training based on job functions</li>
            <li>Specialized training for handling security incidents</li>
            <li>Updates on new regulations and policy changes</li>
            <li>Security awareness training covering phishing, malware, and social engineering</li>
            <li>Documentation and tracking of all training activities</li>
            <li>Assessment and evaluation of training effectiveness</li>
          </ul>
          
          <h2>Your Rights Under HIPAA</h2>
          <p>You have the following rights regarding your health information:</p>
          <ul>
            <li><strong>Right of Access:</strong> The right to inspect and obtain a copy of your health information</li>
            <li><strong>Right to Amend:</strong> The right to request amendment of your health information</li>
            <li><strong>Right to an Accounting of Disclosures:</strong> The right to receive a list of certain disclosures of your health information</li>
            <li><strong>Right to Request Restrictions:</strong> The right to request restrictions on the use and disclosure of your health information</li>
            <li><strong>Right to Request Confidential Communications:</strong> The right to request confidential communication of your health information</li>
            <li><strong>Right to Revoke Authorization:</strong> The right to revoke authorization for use or disclosure of your health information</li>
            <li><strong>Right to File a Complaint:</strong> The right to file a complaint with our Privacy Officer or the Department of Health and Human Services</li>
            <li><strong>Right to Receive a Copy of This Notice:</strong> The right to obtain a paper copy of this notice upon request</li>
          </ul>
          
          <h2>Exercising Your Rights</h2>
          <p>To exercise any of your rights under HIPAA, please contact us using the information provided below. We will process your request in accordance with applicable law and will respond within the timeframes required by HIPAA.</p>
          <p>Requests for access to health information must be made in writing and may be subject to reasonable cost-based fees for copying and mailing. We may deny certain requests as permitted by law but will provide you with a written explanation of the denial and information about appeal rights.</p>
          
          <h2>Complaints</h2>
          <p>
            If you believe your privacy rights have been violated or that we have not complied with our obligations under HIPAA, you may file a complaint with:
          </p>
          <ul>
            <li>GoldenCare Buddy Privacy Officer at the contact information below</li>
            <li>The Office for Civil Rights at the U.S. Department of Health and Human Services</li>
          </ul>
          <p>
            We will not retaliate against you for filing a complaint about our privacy practices.
          </p>
          <p>
            Written complaints must be received by us within 180 days of when you knew the act or omission complained of occurred, unless the time is extended for good cause. All complaints will be investigated and responded to in writing.
          </p>
          
          <h2>Business Associate Agreements</h2>
          <p>
            We enter into Business Associate Agreements (BAAs) with all vendors and service providers who may have access to protected health information. These agreements ensure that our partners maintain the same level of privacy and security protection that we do.
          </p>
          <p>
            BAAs require our business associates to:
          </p>
          <ul>
            <li>Use protected health information only for the purposes for which they were engaged</li>
            <li>Maintain the confidentiality of protected health information</li>
            <li>Implement appropriate safeguards to protect protected health information</li>
            <li>Report any security incidents or breaches to GoldenCare Buddy promptly</li>
            <li>Ensure their subcontractors comply with HIPAA requirements</li>
            <li>Make available protected health information for compliance audits</li>
          </ul>
          
          <h2>Regular Audits and Monitoring</h2>
          <p>
            We conduct regular audits and monitoring of our systems and processes to ensure ongoing compliance with HIPAA requirements. This includes:
          </p>
          <ul>
            <li>Technical security audits</li>
            <li>Administrative policy reviews</li>
            <li>Physical security assessments</li>
            <li>Third-party security assessments</li>
            <li>Internal compliance monitoring and reporting</li>
            <li>Annual risk assessments and updates</li>
            <li>Penetration testing and vulnerability assessments</li>
            <li>Log monitoring and anomaly detection</li>
          </ul>
          
          <h2>Contact Our Privacy Officer</h2>
          <p>If you have questions about our HIPAA compliance or wish to exercise your rights, please contact our Privacy Officer:</p>
          <ul>
            <li>Email: support@goldencare@gmail.com</li>
            <li>Phone: +91 9253395564</li>
            <li>Address: GoldenCare Buddy, Healthcare Innovation Center, San Francisco, CA 94105</li>
          </ul>
          <p>You may also contact our Privacy Officer to file a complaint, request access to your health information, or report a privacy concern.</p>
          
          <h2>Policy Review and Updates</h2>
          <p>
            We regularly review and update our HIPAA compliance policies and procedures to ensure continued compliance with all applicable laws and regulations. This policy was last updated on the date shown above.
          </p>
          <p>
            Our policies are reviewed at least annually or whenever there are significant changes in our operations, technology, or regulatory requirements. Updates are communicated to all staff members and incorporated into our training programs.
          </p>
          <p>
            We maintain documentation of all policy reviews, updates, and training activities to demonstrate our ongoing commitment to HIPAA compliance.
          </p>
        </Section>
      </ContentWrapper>
    </PageContainer>
  );
};

export default HIPAACompliance;