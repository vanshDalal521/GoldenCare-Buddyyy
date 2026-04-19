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
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${props => props.theme.spacing.xl} 0;
    
    th, td {
      text-align: left;
      padding: ${props => props.theme.spacing.md};
      border-bottom: 1px solid ${props => props.theme.colors.border};
    }
    
    th {
      background-color: ${props => props.theme.colors.primary}10;
      font-weight: ${props => props.theme.fontWeights.semibold};
    }
    
    tr:hover {
      background-color: ${props => props.theme.colors.primary}05;
    }
  }
`;

const LastUpdated = styled.p`
  font-size: ${props => props.theme.fontSizes.md};
  color: ${props => props.theme.colors.muted};
  text-align: right;
  margin-top: ${props => props.theme.spacing['2xl']};
  font-style: italic;
`;

const Cookies = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <h1>Cookie Policy</h1>
          <p className="subtitle">
            Learn how we use cookies and similar technologies to enhance your experience on our platform.
          </p>
        </Header>
        
        <Section>
          <LastUpdated>Last Updated: November 27, 2025</LastUpdated>
          
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
          </p>
          <p>
            Cookies help us recognize your device and provide you with a better experience when using our healthcare management platform. They also help us understand how our platform is being used so we can improve it.
          </p>
          
          <h2>How We Use Cookies</h2>
          <p>We use cookies for various purposes, including:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. These cookies do not store any personally identifiable information.</li>
            <li><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous.</li>
            <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages. These cookies may be used to recognize you when you return to our website and to remember your preferences.</li>
            <li><strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device.</li>
          </ul>
          
          <h2>Types of Cookies We Use</h2>
          <table>
            <thead>
              <tr>
                <th>Cookie Type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Strictly Necessary Cookies</td>
                <td>Enable core functionality such as security, network management, and accessibility</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>Performance Cookies</td>
                <td>Collect information about how visitors use our website</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>Functionality Cookies</td>
                <td>Allow the website to remember choices you make and provide enhanced features</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>Targeting Cookies</td>
                <td>Used to deliver adverts more relevant to you and your interests</td>
                <td>6 months</td>
              </tr>
              <tr>
                <td>Authentication Cookies</td>
                <td>Identify you when you are logged into our website</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>Preference Cookies</td>
                <td>Remember your preferences and various settings</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>Security Cookies</td>
                <td>Help identify and prevent security risks</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Third-Party Cookies</h2>
          <p>
            We may also use third-party cookies for analytics and advertising purposes. These cookies are set by third-party services that we use, such as:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns. Google Analytics cookies collect information anonymously and report site trends without identifying individual visitors.</li>
            <li><strong>Google Ads:</strong> To deliver personalized advertisements based on your interests and browsing history.</li>
            <li><strong>Social Media Platforms:</strong> To enable social sharing features. These cookies may be set by Facebook, Twitter, LinkedIn, and other social networks when you share content.</li>
            <li><strong>Cloudflare:</strong> To improve website security and performance.</li>
            <li><strong>Hotjar:</strong> To understand how users interact with our website through heat maps and session recordings.</li>
          </ul>
          <p>
            These third parties may use cookies to collect information about your online activities across different websites or services. Please review their privacy policies for more information about their cookie practices.
          </p>
          
          <h2>Managing Cookies</h2>
          <p>You can control and manage cookies in various ways:</p>
          <ul>
            <li><strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings preferences. You can block or delete cookies by changing your browser settings. However, please note that disabling cookies may affect the functionality of our website and your ability to access certain features.</li>
            <li><strong>Cookie Consent Banner:</strong> When you first visit our website, you will see a cookie consent banner where you can choose which cookies to accept. You can change your preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.</li>
            <li><strong>Opt-Out Links:</strong> Some third-party services provide opt-out mechanisms for their cookies:
              <ul>
                <li>Google Analytics Opt-out: <a href="https://tools.google.com/dlpage/gaoptout">https://tools.google.com/dlpage/gaoptout</a></li>
                <li>Google Ads Settings: <a href="https://adssettings.google.com/">https://adssettings.google.com/</a></li>
                <li>Network Advertising Initiative Opt-out: <a href="http://optout.networkadvertising.org/">http://optout.networkadvertising.org/</a></li>
              </ul>
            </li>
          </ul>
          <p>
            Please note that disabling cookies may affect the functionality of our website and your ability to access certain features.
          </p>
          
          <h2>Do Not Track Signals</h2>
          <p>
            Some web browsers may transmit "do-not-track" signals to websites. Because there is no common understanding of how to interpret these signals, we currently do not alter our practices when we receive these signals. We continue to respect your privacy preferences as expressed through our cookie consent mechanism.
          </p>
          
          <h2>Children's Privacy</h2>
          <p>
            Our Services are not directed to children under the age of 18, and we do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information. If you are a parent or guardian and believe your child has provided us with personal information, please contact us using the information provided below.
          </p>
          
          <h2>Changes to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
          </p>
          <p>
            You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when they are posted on this page. If we make material changes to this policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website.
          </p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about this Cookie Policy, please contact us:</p>
          <ul>
            <li>Email: support@goldencare@gmail.com</li>
            <li>Phone: +91 9253395564</li>
            <li>Address: GoldenCare Buddy, Healthcare Innovation Center, San Francisco, CA 94105</li>
          </ul>
          <p>You can also manage your cookie preferences by clicking on the "Cookie Settings" link in the footer of our website.</p>
        </Section>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Cookies;