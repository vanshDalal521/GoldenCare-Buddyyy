import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const HelpContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}05 100%
  );
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
`;

const HelpHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto ${props => props.theme.spacing['4xl']};
  
  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.lg};
    
    .icon {
      display: inline-block;
      margin-right: ${props => props.theme.spacing.md};
      background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.muted};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const SearchBox = styled.div`
  max-width: 700px;
  margin: 0 auto ${props => props.theme.spacing['4xl']};
  position: relative;
  
  input {
    width: 100%;
    padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing['2xl']};
    padding-left: 60px;
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius['2xl']};
    font-size: ${props => props.theme.fontSizes.lg};
    background: ${props => props.theme.colors.card};
    transition: all ${props => props.theme.transitions.normal};
    box-shadow: ${props => props.theme.shadows.sm};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: ${props => props.theme.shadows.lg};
    }
  }
  
  .search-icon {
    position: absolute;
    left: 24px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;
    color: ${props => props.theme.colors.muted};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['4xl']};
`;

const QuickLinkCard = styled(Link)`
  background: ${props => props.theme.colors.card};
  padding: ${props => props.theme.spacing['2xl']};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  border: 2px solid ${props => props.theme.colors.border};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.xl};
    border-color: ${props => props.theme.colors.primary};
  }
  
  .icon {
    font-size: 48px;
    margin-bottom: ${props => props.theme.spacing.md};
    display: block;
  }
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  p {
    color: ${props => props.theme.colors.muted};
    font-size: ${props => props.theme.fontSizes.md};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const FAQSection = styled.div`
  margin-bottom: ${props => props.theme.spacing['4xl']};
  
  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing['2xl']};
    text-align: center;
  }
`;

const FAQItem = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  border: 2px solid ${props => props.$isOpen ? props.theme.colors.primary : props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
  transition: all ${props => props.theme.transitions.normal};
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.xl} ${props => props.theme.spacing['2xl']};
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background: ${props => props.theme.colors.primaryLight}10;
  }
  
  .question-text {
    font-size: ${props => props.theme.fontSizes.lg};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    flex: 1;
  }
  
  .icon {
    font-size: 24px;
    color: ${props => props.theme.colors.primary};
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    transition: transform ${props => props.theme.transitions.normal};
  }
`;

const FAQAnswer = styled.div`
  padding: 0 ${props => props.theme.spacing['2xl']} ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.md};
  line-height: ${props => props.theme.lineHeights.relaxed};
  display: ${props => props.$isOpen ? 'block' : 'none'};
  
  p {
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  ul {
    margin-left: ${props => props.theme.spacing.xl};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  li {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const ContactSupport = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing['2xl']};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  text-align: center;
  color: white;
  
  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.lg};
    margin-bottom: ${props => props.theme.spacing['2xl']};
    opacity: 0.95;
  }
  
  .contact-methods {
    display: flex;
    justify-content: center;
    gap: ${props => props.theme.spacing['2xl']};
    flex-wrap: wrap;
  }
  
  .contact-btn {
    background: white;
    color: ${props => props.theme.colors.primary};
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing['2xl']};
    border-radius: ${props => props.theme.borderRadius.lg};
    font-size: ${props => props.theme.fontSizes.md};
    font-weight: ${props => props.theme.fontWeights.semibold};
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.lg};
    }
  }
`;

const HelpCenter = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  // Re-render when language changes
  useEffect(() => {
    // This effect will run whenever the language changes
    // It ensures that all translated content is updated
  }, [language]);

  const quickLinks = [
    {
      icon: '📖',
      title: t('user_guide'),
      description: t('step_by_step_tutorials'),
      link: '/user-guide'
    },
    {
      icon: '♿',
      title: t('accessibility'),
      description: t('customize_experience'),
      link: '/accessibility'
    },
    {
      icon: '💬',
      title: t('contact_support'),
      description: t('get_in_touch'),
      link: '#contact'
    }
  ];

  const faqs = [
    {
      question: t('how_to_setup_medication_reminders'),
      answer: t('setup_medication_reminders_answer')
    },
    {
      question: t('what_are_ai_voice_call_reminders'),
      answer: t('ai_voice_call_reminders_answer')
    },
    {
      question: t('how_to_track_wellness_progress'),
      answer: t('track_wellness_progress_answer')
    },
    {
      question: t('can_family_access_health_info'),
      answer: t('family_access_health_info_answer')
    },
    {
      question: t('is_my_health_data_secure'),
      answer: t('health_data_security_answer')
    },
    {
      question: t('how_to_change_notification_settings'),
      answer: t('change_notification_settings_answer')
    },
    {
      question: t('what_if_i_forget_password'),
      answer: t('forgot_password_answer')
    },
    {
      question: t('how_to_contact_healthcare_provider'),
      answer: t('contact_healthcare_provider_answer')
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const filteredFAQs = faqs.filter(faq =>
    searchQuery === '' ||
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <HelpContainer>
      <HelpHeader>
        <h1><span className="icon">💁</span>{t('help_center')}</h1>
        <p>{t('find_answers_support')}</p>
      </HelpHeader>

      <SearchBox>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('search_help_articles')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBox>

      <ContentWrapper>
        <QuickLinks>
          {quickLinks.map((link, index) => (
            <QuickLinkCard key={index} to={link.link}>
              <span className="icon">{link.icon}</span>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </QuickLinkCard>
          ))}
        </QuickLinks>

        <FAQSection>
          <h2>{t('frequently_asked_questions')}</h2>
          {filteredFAQs.map((faq, index) => (
            <FAQItem key={index} $isOpen={openFAQ === index}>
              <FAQQuestion
                onClick={() => toggleFAQ(index)}
                $isOpen={openFAQ === index}
              >
                <span className="question-text">{faq.question}</span>
                <span className="icon">▼</span>
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQ === index}>
                <p style={{ whiteSpace: 'pre-line' }}>{faq.answer}</p>
              </FAQAnswer>
            </FAQItem>
          ))}
          
          {filteredFAQs.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              {t('no_results_found', { query: searchQuery })}
            </p>
          )}
        </FAQSection>

        <ContactSupport id="contact">
          <h2>{t('still_need_help')}</h2>
          <p>{t('support_team_assist')}</p>
          <div className="contact-methods">
            <a href="mailto:support@goldencare.com" className="contact-btn">
              📧 {t('email_support')}
            </a>
            <a href="tel:+1234567890" className="contact-btn">
              📞 {t('call_us')}
            </a>
            <Link to="/user-guide" className="contact-btn">
              📖 {t('user_guide')}
            </Link>
          </div>
        </ContactSupport>
      </ContentWrapper>
    </HelpContainer>
  );
};

export default HelpCenter;
