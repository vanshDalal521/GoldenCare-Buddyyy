import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import LiquidBackground from '../components/LiquidBackground.jsx';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
`;

const HomeSection = styled.section`
  padding: ${props => props.theme.spacing['5xl']} 0;
  min-height: calc(100vh - 80px);
  position: relative;
  overflow: hidden;
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: ${props => props.theme.borderRadius['3xl']};
  padding: ${props => props.theme.spacing['5xl']};
  margin-bottom: ${props => props.theme.spacing['4xl']};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  animation: ${slideUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: inherit;
    pointer-events: none;
  }

  h1 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 800;
    margin-bottom: ${props => props.theme.spacing.md};
    background: linear-gradient(135deg, ${props => props.theme.colors.primaryDark}, ${props => props.theme.colors.accentDark});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }

  p {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.mutedDark};
    max-width: 650px;
    margin: 0 auto;
    line-height: 1.6;
    opacity: 0.9;
  }
`;

const HomeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing['4xl']};
`;

const ActionCard = styled(Link)`
  position: relative;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: ${props => props.theme.spacing['3xl']};
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  opacity: 0;
  animation: ${slideUp} 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: ${props => props.$delay || '0s'};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    background: rgba(255, 255, 255, 0.45);
    border-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);

    &::before {
      opacity: 1;
    }

    .icon-box {
      transform: scale(1.15) rotate(-5deg);
      background: ${props => props.theme.colors.primary};
      color: white;
      box-shadow: 0 10px 20px -5px ${props => props.theme.colors.primary}50;
    }

    .arrow {
      transform: translateX(5px);
      opacity: 1;
    }
  }

  .icon-box {
    width: 70px;
    height: 70px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: ${props => props.theme.borderRadius.xl};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.8rem;
    margin-bottom: ${props => props.theme.spacing.xl};
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.02);
  }

  h2 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    margin: 0 0 ${props => props.theme.spacing.sm} 0;
    color: ${props => props.theme.colors.primaryDark};
    font-weight: 800;
  }

  p {
    color: ${props => props.theme.colors.mutedDark};
    margin: 0;
    font-size: ${props => props.theme.fontSizes.md};
    line-height: 1.6;
    opacity: 0.8;
  }

  .footer {
    margin-top: auto;
    padding-top: ${props => props.theme.spacing.xl};
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: ${props => props.theme.fontSizes.sm};
    color: ${props => props.theme.colors.primary};

    .arrow {
      transition: all 0.3s ease;
      opacity: 0.5;
    }
  }
`;

const Home = () => {
  const { t } = useLanguage();
  const patientSession = localStorage.getItem('gc_patient_session');
  const patientUser = patientSession ? JSON.parse(patientSession) : null;
  const patientName = patientUser?.name || 'Friend';

  return (
    <HomeSection>
      <LiquidBackground />
      <div className="wrap">
        <WelcomeCard>
          <h1>{t('welcome_back', { name: patientName }) || `Welcome back, ${patientName}!`}</h1>
          <p>{t('here_is_your_health') || 'Your dedicated space for health and wellness. Let\'s manage your medical journey with care and precision.'}</p>
        </WelcomeCard>

        <HomeGrid>
          <ActionCard to="/patient-dashboard" $delay="0.1s">
            <div className="icon-box">📊</div>
            <h2>{t('dashboard') || 'Health Trends'}</h2>
            <p>{t('view_health_overview') || 'Visual insights into your vitals, activity levels, and medical history.'}</p>
            <div className="footer">Explore Insights <span className="arrow">→</span></div>
          </ActionCard>

          <ActionCard to="/pillbox" $delay="0.2s">
            <div className="icon-box">💊</div>
            <h2>{t('pillbox') || 'Smart Pillbox'}</h2>
            <p>{t('manage_medications') || 'Never miss a dose with our intelligent scheduling and reminder system.'}</p>
            <div className="footer">Manage Medication <span className="arrow">→</span></div>
          </ActionCard>

          <ActionCard to="/wellness" $delay="0.3s">
            <div className="icon-box">🧘</div>
            <h2>{t('wellness') || 'Wellness Hub'}</h2>
            <p>{t('track_wellness') || 'Activities, meditation, and mental health tracking for a balanced life.'}</p>
            <div className="footer">Daily Habits <span className="arrow">→</span></div>
          </ActionCard>

          <ActionCard to="/family" $delay="0.4s">
            <div className="icon-box">👨‍👩‍👧</div>
            <h2>{t('family') || 'Care Network'}</h2>
            <p>{t('connect_family') || 'Coordinate with family members and caregivers for unified support.'}</p>
            <div className="footer">View Circle <span className="arrow">→</span></div>
          </ActionCard>

          <ActionCard to="/ai" $delay="0.5s">
            <div className="icon-box">🤖</div>
            <h2>{t('ai_assistant') || 'Caring AI Bot'}</h2>
            <p>{t('talk_to_ai') || 'Instant answers and compassionate conversation with your personal health assistant.'}</p>
            <div className="footer">Talk Now <span className="arrow">→</span></div>
          </ActionCard>

          <ActionCard to="/patient-records" $delay="0.6s">
            <div className="icon-box">📂</div>
            <h2>{t('medical_records') || 'Secure Vault'}</h2>
            <p>{t('view_records') || 'Digitized medical reports, prescriptions, and lab results at your fingertips.'}</p>
            <div className="footer">Access Records <span className="arrow">→</span></div>
          </ActionCard>
        </HomeGrid>
      </div>
    </HomeSection>
  );
};

export default Home;

