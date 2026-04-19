import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const GuideContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.bg};
`;

const GuideHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: white;
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
  text-align: center;
  
  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.xl};
    opacity: 0.95;
    max-width: 700px;
    margin: 0 auto;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
`;

const Navigation = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing['4xl']};
  overflow-x: auto;
  padding-bottom: ${props => props.theme.spacing.md};
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }
`;

const NavButton = styled.button`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.card};
  color: ${props => props.isActive ? 'white' : props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  white-space: nowrap;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const GuideSection = styled.div`
  display: ${props => props.isActive ? 'block' : 'none'};
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  .icon {
    font-size: 48px;
  }
`;

const StepCard = styled.div`
  background: ${props => props.theme.colors.card};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StepHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  .step-number {
    min-width: 48px;
    height: 48px;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.bold};
  }
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.text};
    font-weight: ${props => props.theme.fontWeights.semibold};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
`;

const StepContent = styled.div`
  padding-left: 64px;
  color: ${props => props.theme.colors.muted};
  line-height: ${props => props.theme.lineHeights.relaxed};
  
  p {
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  ul, ol {
    margin-left: ${props => props.theme.spacing.xl};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  li {
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  .tip {
    background: ${props => props.theme.colors.infoLight};
    border-left: 4px solid ${props => props.theme.colors.info};
    padding: ${props => props.theme.spacing.lg};
    margin: ${props => props.theme.spacing.lg} 0;
    border-radius: ${props => props.theme.borderRadius.md};
    
    strong {
      color: ${props => props.theme.colors.info};
    }
  }
  
  .warning {
    background: ${props => props.theme.colors.warningLight};
    border-left: 4px solid ${props => props.theme.colors.warning};
    padding: ${props => props.theme.spacing.lg};
    margin: ${props => props.theme.spacing.lg} 0;
    border-radius: ${props => props.theme.borderRadius.md};
    
    strong {
      color: ${props => props.theme.colors.warning};
    }
  }
`;

const Screenshot = styled.div`
  background: ${props => props.theme.colors.mutedLight};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing['2xl']};
  margin: ${props => props.theme.spacing.lg} 0;
  text-align: center;
  color: ${props => props.theme.colors.muted};
  font-style: italic;
`;

const VideoPlaceholder = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
  text-align: center;
  color: white;
  margin: ${props => props.theme.spacing['2xl']} 0;
  
  .icon {
    font-size: 64px;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
  
  h4 {
    font-size: ${props => props.theme.fontSizes.xl};
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  p {
    opacity: 0.9;
  }
`;

const UserGuide = () => {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState('getting-started');

  // Re-render when language changes
  useEffect(() => {
    // This effect will run whenever the language changes
    // It ensures that all translated content is updated
  }, [language]);

  const sections = [
    { id: 'getting-started', label: t('getting_started'), icon: '🚀' },
    { id: 'medications', label: t('managing_medications'), icon: '💊' },
    { id: 'reminders', label: t('setting_up_reminders'), icon: '🔔' },
    { id: 'ai-calls', label: t('ai_voice_calls'), icon: '📞' },
    { id: 'wellness', label: t('wellness_tracking'), icon: '💚' },
    { id: 'family', label: t('family_features'), icon: '👨‍👩‍👧' },
  ];

  return (
    <GuideContainer>
      <GuideHeader>
        <h1>📖 {t('user_guide')}</h1>
        <p>{t('complete_step_by_step_tutorials')}</p>
      </GuideHeader>

      <ContentWrapper>
        <Navigation>
          {sections.map(section => (
            <NavButton
              key={section.id}
              isActive={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </NavButton>
          ))}
        </Navigation>

        {/* Getting Started */}
        <GuideSection isActive={activeSection === 'getting-started'}>
          <SectionTitle>
            <span className="icon">🚀</span>
            {t('getting_started')}
          </SectionTitle>

          <StepCard>
            <StepHeader>
              <span className="step-number">1</span>
              <div>
                <h3>{t('create_your_account')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('to_begin_using_goldencare')}</p>
              <ol>
                <li>{t('visit_homepage_and_click')}</li>
                <li>{t('choose_patient_login')}</li>
                <li>{t('click_access_my_dashboard')}</li>
              </ol>
              <div className="tip">
                <strong>💡 {t('tip')}</strong> {t('make_sure_to_enable_browser')}
              </div>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">2</span>
              <div>
                <h3>{t('explore_your_dashboard')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('after_logging_in_youll_see')}</p>
              <ul>
                <li><strong>{t('quick_stats')}</strong> {t('overview_of_your_medications')}</li>
                <li><strong>{t('todays_medications')}</strong> {t('list_of_meds_to_take_today')}</li>
                <li><strong>{t('upcoming_reminders')}</strong> {t('schedule_of_medication_times')}</li>
                <li><strong>{t('recent_activity')}</strong> {t('your_medication_history')}</li>
              </ul>
              <Screenshot>
                📊 {t('dashboard_screenshot')}
              </Screenshot>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">3</span>
              <div>
                <h3>{t('navigate_the_menu')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('use_the_navigation_menu')}</p>
              <ul>
                <li><strong>🏠 {t('home')}</strong> {t('your_main_dashboard')}</li>
                <li><strong>💊 {t('pillbox')}</strong> {t('manage_your_medications')}</li>
                <li><strong>👨‍👩‍👧 {t('family')}</strong> {t('connect_with_family_members')}</li>
                <li><strong>💚 {t('wellness')}</strong> {t('track_your_health_progress')}</li>
                <li><strong>🤖 {t('ai')}</strong> {t('ai_voice_call_settings')}</li>
              </ul>
            </StepContent>
          </StepCard>
        </GuideSection>

        {/* Managing Medications */}
        <GuideSection isActive={activeSection === 'medications'}>
          <SectionTitle>
            <span className="icon">💊</span>
            {t('managing_medications')}
          </SectionTitle>

          <StepCard>
            <StepHeader>
              <span className="step-number">1</span>
              <div>
                <h3>{t('add_a_new_medication')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('adding_medications_is_simple')}</p>
              <ol>
                <li>{t('navigate_to_the_pillbox_page')}</li>
                <li>{t('click_the_add_medication_button')}</li>
                <li>{t('fill_in_the_medication_details')}
                  <ul>
                    <li>{t('medication_name')}</li>
                    <li>{t('dosage')}</li>
                    <li>{t('time_slot')}</li>
                    <li>{t('frequency')}</li>
                    <li>{t('special_notes_or_instructions')}</li>
                  </ul>
                </li>
                <li>{t('click_add_medication_to_save')}</li>
              </ol>
              <div className="tip">
                <strong>💡 {t('pro_tip')}</strong> {t('add_all_your_medications')}
              </div>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">2</span>
              <div>
                <h3>{t('mark_medications_as_taken')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('track_your_medication_adherence')}</p>
              <ol>
                <li>{t('find_your_medication_in_the_list')}</li>
                <li>{t('click_the_mark_as_taken_button')}</li>
                <li>{t('the_medication_status_updates')}</li>
                <li>{t('your_adherence_statistics')}</li>
              </ol>
              <div className="warning">
                <strong>⚠️ {t('important')}</strong> {t('you_can_only_mark_a_medication')}
              </div>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">3</span>
              <div>
                <h3>{t('edit_or_remove_medications')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('keep_your_medication_list')}</p>
              <ul>
                <li><strong>{t('to_edit')}</strong> {t('click_the_edit_icon')}</li>
                <li><strong>{t('to_remove')}</strong> {t('click_the_delete_icon')}</li>
                <li><strong>{t('to_reorder')}</strong> {t('medications_are_automatically_sorted')}</li>
              </ul>
            </StepContent>
          </StepCard>
        </GuideSection>

        {/* Setting Up Reminders */}
        <GuideSection isActive={activeSection === 'reminders'}>
          <SectionTitle>
            <span className="icon">🔔</span>
            {t('setting_up_reminders')}
          </SectionTitle>

          <StepCard>
            <StepHeader>
              <span className="step-number">1</span>
              <div>
                <h3>{t('enable_browser_notifications')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('browser_notifications_allow_you')}</p>
              <ol>
                <li>{t('when_prompted_click_allow')}</li>
                <li>{t('you_can_change_this_later')}</li>
                <li>{t('check_your_notification_settings')}</li>
              </ol>
              <div className="tip">
                <strong>💡 {t('tip')}</strong> {t('notifications_work_best')}
              </div>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">2</span>
              <div>
                <h3>{t('customize_reminder_settings')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('personalize_your_reminder_preferences')}</p>
              <ol>
                <li>{t('go_to_settings')}</li>
                <li>{t('select_notification_preferences')}</li>
                <li>{t('choose_notification_methods')}</li>
                <li>{t('set_quiet_hours')}</li>
                <li>{t('save_your_preferences')}</li>
              </ol>
            </StepContent>
          </StepCard>
        </GuideSection>

        {/* AI Voice Calls */}
        <GuideSection isActive={activeSection === 'ai-calls'}>
          <SectionTitle>
            <span className="icon">📞</span>
            {t('ai_voice_calls')}
          </SectionTitle>

          <StepCard>
            <StepHeader>
              <span className="step-number">1</span>
              <div>
                <h3>{t('set_up_your_mobile_number')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('ai_voice_calls_require_a_valid')}</p>
              <ol>
                <li>{t('navigate_to_the_ai_page')}</li>
                <li>{t('click_manage_phone_numbers')}</li>
                <li>{t('enter_your_mobile_number')}</li>
                <li>{t('click_verify_to_receive')}</li>
                <li>{t('enter_the_verification_code')}</li>
                <li>{t('click_save_phone_number')}</li>
              </ol>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">2</span>
              <div>
                <h3>{t('configure_call_preferences')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('customize_when_and_how')}</p>
              <ul>
                <li>{t('set_call_times')}</li>
                <li>{t('choose_call_language')}</li>
                <li>{t('select_call_reminders')}</li>
                <li>{t('enable_missed_dose_alerts')}</li>
              </ul>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">3</span>
              <div>
                <h3>{t('test_your_ai_voice_call')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('test_the_feature_before_relying')}</p>
              <ol>
                <li>{t('go_to_the_ai_page')}</li>
                <li>{t('click_test_call_now_button')}</li>
                <li>{t('you_should_receive_a_test_call')}</li>
                <li>{t('follow_the_voice_instructions')}</li>
              </ol>
            </StepContent>
          </StepCard>
        </GuideSection>

        {/* Wellness Tracking */}
        <GuideSection isActive={activeSection === 'wellness'}>
          <SectionTitle>
            <span className="icon">💚</span>
            {t('wellness_tracking')}
          </SectionTitle>

          <StepCard>
            <StepHeader>
              <span className="step-number">1</span>
              <div>
                <h3>{t('track_your_medication_adherence')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('monitor_how_well_youre_following')}</p>
              <ul>
                <li>{t('view_daily_adherence_percentage')}</li>
                <li>{t('see_weekly_and_monthly_trends')}</li>
                <li>{t('identify_patterns_and_missed_doses')}</li>
                <li>{t('generate_reports_for_your_doctor')}</li>
              </ul>
              <Screenshot>
                📈 {t('wellness_dashboard')}
              </Screenshot>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">2</span>
              <div>
                <h3>{t('log_health_metrics')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('keep_track_of_important_health')}</p>
              <ul>
                <li>{t('blood_pressure_readings')}</li>
                <li>{t('blood_sugar_levels')}</li>
                <li>{t('weight_and_bmi')}</li>
                <li>{t('mood_and_symptoms')}</li>
              </ul>
            </StepContent>
          </StepCard>
        </GuideSection>

        {/* Family Features */}
        <GuideSection isActive={activeSection === 'family'}>
          <SectionTitle>
            <span className="icon">👨‍👩‍👧</span>
            {t('family_connection')}
          </SectionTitle>

          <StepCard>
            <StepHeader>
              <span className="step-number">1</span>
              <div>
                <h3>{t('connect_with_family_members')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('keep_your_loved_ones_informed')}</p>
              <ol>
                <li>{t('go_to_the_family_page')}</li>
                <li>{t('click_invite_family_member')}</li>
                <li>{t('enter_their_email_address')}</li>
                <li>{t('set_their_access_permissions')}</li>
                <li>{t('theyll_receive_an_invitation_email')}</li>
              </ol>
              <div className="tip">
                <strong>💡 {t('tip')}</strong> {t('family_members_can_receive_alerts')}
              </div>
            </StepContent>
          </StepCard>

          <StepCard>
            <StepHeader>
              <span className="step-number">2</span>
              <div>
                <h3>{t('manage_privacy_settings')}</h3>
              </div>
            </StepHeader>
            <StepContent>
              <p>{t('youre_always_in_control')}</p>
              <ul>
                <li>{t('choose_what_information_family')}</li>
                <li>{t('set_who_receives_alerts')}</li>
                <li>{t('revoke_access_at_any_time')}</li>
                <li>{t('view_audit_logs')}</li>
              </ul>
            </StepContent>
          </StepCard>
        </GuideSection>
      </ContentWrapper>
    </GuideContainer>
  );
};

export default UserGuide;