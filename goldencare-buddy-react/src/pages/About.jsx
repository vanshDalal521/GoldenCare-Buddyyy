import React from 'react';
import styled from 'styled-components';

const AboutSection = styled.section`
  padding: ${props => props.theme.spacing['6xl']} 0;
  background: ${props => props.theme.colors.bg};
  min-height: calc(100vh - 200px);
`;

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing['4xl']};
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const AboutContent = styled.div`
  h2 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.xl};
    color: ${props => props.theme.colors.text};
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: ${props => props.theme.fontSizes['3xl']};
      text-align: center;
    }
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.lg};
    line-height: ${props => props.theme.lineHeights.relaxed};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing.xl};
  }
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing.xl};
  margin: ${props => props.theme.spacing['2xl']} 0;
  
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  .icon {
    font-size: ${props => props.theme.fontSizes['2xl']};
    flex-shrink: 0;
  }
  
  div {
    h3 {
      margin: 0 0 ${props => props.theme.spacing.sm} 0;
      color: ${props => props.theme.colors.text};
      font-size: ${props => props.theme.fontSizes.lg};
      font-weight: ${props => props.theme.fontWeights.bold};
    }
    
    p {
      margin: 0;
      color: ${props => props.theme.colors.muted};
      line-height: ${props => props.theme.lineHeights.normal};
      font-size: ${props => props.theme.fontSizes.md};
    }
  }
`;

const TeamCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing['2xl']};
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.xl};
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
  }
`;

const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .avatar {
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
  }
  
  div {
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
  }
`;

const ContactCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing['2xl']};
  margin-top: ${props => props.theme.spacing['2xl']};
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.lg};
    color: white;
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    line-height: ${props => props.theme.lineHeights.relaxed};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  a {
    color: white;
    text-decoration: none;
    font-weight: ${props => props.theme.fontWeights.semibold};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const About = () => {
  return (
    <AboutSection>
      <div className="wrap">
        <AboutGrid>
          <AboutContent>
            <h2>About GoldenCare Buddy</h2>
            <p>
              GoldenCare Buddy is a compassionate healthcare management platform designed specifically 
              for elders and their families. We believe that healthcare technology should be simple, 
              accessible, and caring.
            </p>
            <p>
              Our mission is to make medication management and wellness tracking effortless for seniors 
              while providing peace of mind for their families. Every feature is designed with accessibility 
              and ease of use in mind.
            </p>

            <FeatureList>
              <FeatureItem>
                <div className="icon">💊</div>
                <div>
                  <h3>Smart Medication Management</h3>
                  <p>Large buttons, clear labels, and intuitive interfaces make taking medications simple.</p>
                </div>
              </FeatureItem>
              <FeatureItem>
                <div className="icon">👨‍👩‍👦</div>
                <div>
                  <h3>Family Connectivity</h3>
                  <p>Keep family members informed about medication adherence and wellness progress.</p>
                </div>
              </FeatureItem>
              <FeatureItem>
                <div className="icon">🧘</div>
                <div>
                  <h3>Wellness Support</h3>
                  <p>Gentle reminders for hydration, breathing exercises, and light physical activity.</p>
                </div>
              </FeatureItem>
              <FeatureItem>
                <div className="icon">🤖</div>
                <div>
                  <h3>AI-Powered Insights</h3>
                  <p>Predictive analytics help identify potential issues before they become problems.</p>
                </div>
              </FeatureItem>
            </FeatureList>

            <h3>Our Values</h3>
            <p>
              <strong>Accessibility First:</strong> Every feature is designed to be usable by people of all ages and abilities.
            </p>
            <p>
              <strong>Privacy & Security:</strong> Your health data is protected with enterprise-grade security measures.
            </p>
            <p>
              <strong>Compassionate Design:</strong> Technology should feel like a caring companion, not a complex tool.
            </p>
          </AboutContent>

          <div>
            <TeamCard>
              <h3>Our Team</h3>
              <TeamMember>
                <div className="avatar">H</div>
                <div>
                  <h4>Harsh Sangwan</h4>
                  <p>Frontend Development</p>
                </div>
              </TeamMember>
              <TeamMember>
                <div className="avatar">V</div>
                <div>
                  <h4>Vansh Dalal</h4>
                  <p>Backend & AI Integration</p>
                </div>
              </TeamMember>
            </TeamCard>

            <ContactCard>
              <h3>Get in Touch</h3>
              <p>
                Have questions or feedback? We'd love to hear from you.
              </p>
              <p>
                Email us at <a href="mailto:support@goldencare.gmail.com">support@goldencare.gmail.com</a>
              </p>
            </ContactCard>
          </div>
        </AboutGrid>
      </div>
    </AboutSection>
  );
};

export default About;
