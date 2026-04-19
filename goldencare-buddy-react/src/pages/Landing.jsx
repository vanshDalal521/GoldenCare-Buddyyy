import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import TranslationButton from '../components/TranslationButton';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}08 30%, 
    ${props => props.theme.colors.accentLight}08 70%,
    ${props => props.theme.colors.bg} 100%
  );
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23000" stroke-width="0.5" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>') repeat;
    pointer-events: none;
  }
`;

const LandingHeader = styled.header`
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  z-index: ${props => props.theme.zIndex.sticky};
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg} 0;
  height: 80px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  .logo-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    border-radius: ${props => props.theme.borderRadius.xl};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    font-weight: bold;
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  .logo-text {
    .brand {
      font-size: ${props => props.theme.fontSizes['2xl']};
      font-weight: ${props => props.theme.fontWeights.extrabold};
      color: ${props => props.theme.colors.text};
      line-height: 1;
      
      .accent {
        color: ${props => props.theme.colors.primary};
      }
    }
    
    .tagline {
      font-size: ${props => props.theme.fontSizes.sm};
      color: ${props => props.theme.colors.muted};
      font-weight: ${props => props.theme.fontWeights.medium};
      margin-top: 2px;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const HeroSection = styled.section`
  padding: ${props => props.theme.spacing['6xl']} 0;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  
  .hero-badge {
    animation: fadeInUp 0.8s ease-out forwards;
    animation-delay: 0.1s;
    opacity: 0;
    display: inline-flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
    background: ${props => props.theme.colors.primaryLight}20;
    color: ${props => props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius.full};
    font-size: ${props => props.theme.fontSizes.md};
    font-weight: ${props => props.theme.fontWeights.semibold};
    margin-bottom: ${props => props.theme.spacing['2xl']};
    border: 1px solid ${props => props.theme.colors.primaryLight}40;
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  h1 {
    font-size: ${props => props.theme.fontSizes['6xl']};
    font-weight: ${props => props.theme.fontWeights.black};
    line-height: ${props => props.theme.lineHeights.tight};
    margin-bottom: ${props => props.theme.spacing.xl};
    color: ${props => props.theme.colors.text};
    animation: fadeInUp 1s ease-out forwards;
    animation-delay: 0.3s;
    opacity: 0;
    
    .highlight {
      background: linear-gradient(120deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.fontSizes['5xl']};
    }
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: ${props => props.theme.fontSizes['4xl']};
    }
  }
  
  .lead {
    font-size: ${props => props.theme.fontSizes['2xl']};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing['3xl']};
    line-height: ${props => props.theme.lineHeights.relaxed};
    font-weight: ${props => props.theme.fontWeights.normal};
    animation: fadeInUp 0.8s ease-out forwards;
    animation-delay: 0.5s;
    opacity: 0;
    
    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: ${props => props.theme.fontSizes.xl};
    }
  }
`;

const CTAButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.lg};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing['4xl']};
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.7s;
  opacity: 0;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const TrustIndicators = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing['2xl']};
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.theme.spacing['3xl']};
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.9s;
  opacity: 0;
  
  .indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    
    .number {
      font-size: ${props => props.theme.fontSizes['3xl']};
      font-weight: ${props => props.theme.fontWeights.bold};
      color: ${props => props.theme.colors.primary};
    }
    
    .label {
      font-size: ${props => props.theme.fontSizes.sm};
      color: ${props => props.theme.colors.muted};
      font-weight: ${props => props.theme.fontWeights.medium};
    }
  }
`;

const FeaturesPreview = styled.section`
  padding: ${props => props.theme.spacing['6xl']} 0;
  background: ${props => props.theme.colors.card};
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${props => props.theme.spacing['2xl']};
  
  @media (min-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const PreviewCard = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  
  &:nth-child(1) { animation-delay: 1.1s; }
  &:nth-child(2) { animation-delay: 1.2s; }
  &:nth-child(3) { animation-delay: 1.3s; }
  &:nth-child(4) { animation-delay: 1.4s; }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text};
  }
  
  p {
    color: ${props => props.theme.colors.muted};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const CallToActionSection = styled.section`
  padding: ${props => props.theme.spacing['6xl']} 0;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}, 
    ${props => props.theme.colors.primaryDark}
  );
  color: white;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hexagons" width="30" height="26" patternUnits="userSpaceOnUse"><polygon points="15,2 25,8 25,18 15,24 5,18 5,8" fill="none" stroke="%23fff" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23hexagons)"/></svg>') repeat;
    pointer-events: none;
  }
  
  .content {
    position: relative;
    z-index: 1;
    max-width: 600px;
    margin: 0 auto;
    
    h2 {
      font-size: ${props => props.theme.fontSizes['4xl']};
      font-weight: ${props => props.theme.fontWeights.bold};
      margin-bottom: ${props => props.theme.spacing.xl};
      
      @media (max-width: ${props => props.theme.breakpoints.mobile}) {
        font-size: ${props => props.theme.fontSizes['3xl']};
      }
    }
    
    p {
      font-size: ${props => props.theme.fontSizes.xl};
      margin-bottom: ${props => props.theme.spacing['2xl']};
      opacity: 0.95;
      line-height: ${props => props.theme.lineHeights.relaxed};
      
      @media (max-width: ${props => props.theme.breakpoints.mobile}) {
        font-size: ${props => props.theme.fontSizes.lg};
      }
    }
  }
`;

const FooterSimple = styled.footer`
  background: ${props => props.theme.colors.text};
  color: white;
  padding: ${props => props.theme.spacing['2xl']} 0;
  text-align: center;
  
  .copyright {
    color: rgba(255, 255, 255, 0.7);
    font-size: ${props => props.theme.fontSizes.sm};
  }
`;

const KeyframesStyles = styled.div`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Landing = () => {
  const { t, language } = useLanguage();

  // Re-render when language changes
  useEffect(() => {
    // This effect will run whenever the language changes
    // It ensures that all translated content is updated
  }, [language]);

  const features = [
    {
      icon: '💊',
      title: t('smart_medication'),
      description: t('easy_pill_tracking')
    },
    {
      icon: '👨‍👩‍👦',
      title: t('family_connection'),
      description: t('keep_loved_ones_informed')
    },
    {
      icon: '🧘',
      title: t('wellness_support'),
      description: t('gentle_guidance')
    },
    {
      icon: '🤖',
      title: t('ai_health_insights'),
      description: t('smart_predictions')
    }
  ];

  return (
    <>
    <KeyframesStyles />
    <LandingContainer>
      <LandingHeader>
        <div className="wrap">
          <HeaderInner>
            <Logo>
              <div className="logo-icon">GC</div>
              <div className="logo-text">
                <div className="brand">
                  GoldenCare <span className="accent">Buddy</span>
                </div>
                <div className="tagline">{t('healthcare_made_simple')}</div>
              </div>
            </Logo>
            
            <HeaderActions>
              <TranslationButton />
              <Link className="btn outline" to="/explore">
                {t('see_how_it_works')}
              </Link>
              <Link className="btn primary" to="/login">
                {t('start_free_today')}
              </Link>
            </HeaderActions>
          </HeaderInner>
        </div>
      </LandingHeader>

      <HeroSection>
        <div className="wrap">
          <HeroContent>
            <div className="hero-badge">
              ✨ {t('trusted_by_families')}
            </div>
            
            <h1>
              {t('healthcare_made_simple').split(' ')[0]} <span className="highlight">{t('healthcare_made_simple').split(' ')[1]}</span><br/>
              {t('healthcare_made_simple').split(' ').slice(2).join(' ')}
            </h1>
            
            <p className="lead">
              {t('compassionate_digital_companion')}
            </p>
            
            <CTAButtons className="cta-buttons">
              <Link className="btn primary lg" to="/login">
                {t('start_free_today')}
              </Link>
              <Link className="btn outline lg" to="/explore">
                {t('see_how_it_works')}
              </Link>
            </CTAButtons>
            
            <TrustIndicators className="trust-indicators">
              <div className="indicator">
                <div className="number">10K+</div>
                <div className="label">{t('happy_families')}</div>
              </div>
              <div className="indicator">
                <div className="number">95%</div>
                <div className="label">{t('medication_adherence')}</div>
              </div>
              <div className="indicator">
                <div className="number">24/7</div>
                <div className="label">{t('care_support')}</div>
              </div>
              <div className="indicator">
                <div className="number">HIPAA</div>
                <div className="label">{t('hipaa_compliant')}</div>
              </div>
            </TrustIndicators>
          </HeroContent>
        </div>
      </HeroSection>

      <FeaturesPreview className="features-preview">
        <div className="wrap">
          <PreviewGrid>
            {features.map((feature, index) => (
              <PreviewCard key={index} className="preview-card">
                <div className="icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </PreviewCard>
            ))}
          </PreviewGrid>
        </div>
      </FeaturesPreview>

      <CallToActionSection>
        <div className="wrap">
          <div className="content">
            <h2>{t('ready_to_transform')}</h2>
            <p>
              {t('join_thousands')}
            </p>
            <CTAButtons>
              <Link className="btn lg" style={{ background: 'white', color: '#3182ce' }} to="/login">
                {t('start_your_journey')}
              </Link>
              <Link className="btn outline lg" style={{ borderColor: 'white', color: 'white' }} to="/about">
                {t('learn_more')}
              </Link>
            </CTAButtons>
          </div>
        </div>
      </CallToActionSection>

      <FooterSimple>
        <div className="wrap">
          <div className="copyright">
            {t('copyright')}
          </div>
        </div>
      </FooterSimple>
    </LandingContainer>
    </>
  );
};

export default Landing;