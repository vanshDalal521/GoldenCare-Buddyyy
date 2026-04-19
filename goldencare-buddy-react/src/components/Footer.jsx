import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background: ${props => props.theme.colors.text};
  color: white;
  padding: ${props => props.theme.spacing['4xl']} 0 ${props => props.theme.spacing.xl};
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: ${props => props.theme.spacing['3xl']};
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.lg};
    color: white;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: ${props => props.theme.lineHeights.relaxed};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const FooterBrand = styled.div`
  .brand {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.extrabold};
    margin-bottom: ${props => props.theme.spacing.md};
    
    .accent {
      color: ${props => props.theme.colors.primaryLight};
    }
  }
  
  .tagline {
    font-size: ${props => props.theme.fontSizes.lg};
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: ${props => props.theme.spacing.lg};
    font-weight: ${props => props.theme.fontWeights.medium};
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all ${props => props.theme.transitions.normal};
    font-weight: ${props => props.theme.fontWeights.medium};
    
    &:hover {
      color: ${props => props.theme.colors.primaryLight};
      transform: translateX(4px);
    }
  }
`;

const ContactInfo = styled.div`
  .contact-item {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.md};
    margin-bottom: ${props => props.theme.spacing.md};
    color: rgba(255, 255, 255, 0.8);
    
    .icon {
      font-size: ${props => props.theme.fontSizes.lg};
    }
    
    a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: color ${props => props.theme.transitions.normal};
      
      &:hover {
        color: ${props => props.theme.colors.primaryLight};
      }
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: ${props => props.theme.borderRadius.full};
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      background: ${props => props.theme.colors.primary};
      color: white;
      transform: translateY(-2px);
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: ${props => props.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  text-align: center;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: ${props => props.theme.fontSizes.sm};
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  
  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: ${props => props.theme.fontSizes.sm};
    transition: color ${props => props.theme.transitions.normal};
    
    &:hover {
      color: ${props => props.theme.colors.primaryLight};
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <div className="wrap">
        <FooterContent>
          <FooterBrand>
            <div className="brand">
              GoldenCare <span className="accent">Buddy</span>
            </div>
            <div className="tagline">
              A caring companion for elders
            </div>
            <p>
              Making healthcare management simple, accessible, and caring for seniors
              and their families. Every feature designed with compassion and ease of use in mind.
            </p>
            <SocialLinks>
              <a href="#" aria-label="Facebook">
                🌐
              </a>
              <a href="#" aria-label="Twitter">
                🐦
              </a>
              <a href="mailto:support@goldencare.com" aria-label="Email">
                ✉️
              </a>
              <a href="tel:+1234567890" aria-label="Phone">
                📞
              </a>
            </SocialLinks>
          </FooterBrand>

          <FooterSection>
            <h3>Features</h3>
            <FooterLinks>
              <li><Link to="/explore">View All Features</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/login">Login to Access</Link></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Support</h3>
            <FooterLinks>
              <li><Link to="/help-center">Help Center</Link></li>
              <li><Link to="/user-guide">User Guide</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <h3>Legal</h3>
            <FooterLinks>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookies</Link></li>
              <li><Link to="/hipaa-compliance">HIPAA Compliance</Link></li>
            </FooterLinks>
          </FooterSection>
        </FooterContent>

        <FooterBottom>
          <Copyright>
            © {currentYear} GoldenCare Buddy. All rights reserved.
          </Copyright>
          <LegalLinks>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/hipaa-compliance">HIPAA Compliance</Link>
          </LegalLinks>
        </FooterBottom>
      </div>
    </FooterWrapper>
  );
};

export default Footer;