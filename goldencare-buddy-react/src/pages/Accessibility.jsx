import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const AccessibilityContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.bg};
  padding: ${props => props.theme.spacing['4xl']} ${props => props.theme.spacing.xl};
`;

const PageHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto ${props => props.theme.spacing['4xl']};
  
  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.lg};
    
    .icon {
      margin-right: ${props => props.theme.spacing.md};
    }
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.muted};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SettingSection = styled.div`
  background: ${props => props.theme.colors.card};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  
  .icon {
    font-size: 32px;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  gap: ${props => props.theme.spacing.xl};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: ${props => props.theme.fontSizes.lg};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.md};
    color: ${props => props.theme.colors.muted};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.colors.border};
    transition: 0.4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const Slider = styled.div`
  width: 100%;
  max-width: 300px;
  
  input[type="range"] {
    width: 100%;
    height: 8px;
    border-radius: 5px;
    background: ${props => props.theme.colors.border};
    outline: none;
    -webkit-appearance: none;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${props => props.theme.colors.primary};
      cursor: pointer;
    }
    
    &::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${props => props.theme.colors.primary};
      cursor: pointer;
      border: none;
    }
  }
  
  .slider-value {
    text-align: center;
    margin-top: ${props => props.theme.spacing.sm};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.primary};
  }
`;

const ColorButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 3px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.color};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ColorOptions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const PreviewSection = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryLight}10, ${props => props.theme.colors.accentLight}10);
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['2xl']};
  margin-top: ${props => props.theme.spacing.xl};
  text-align: center;
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    margin-bottom: ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.text};
  }
  
  .preview-text {
    font-size: ${props => props.fontSize}px;
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  
  button {
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
    border: 2px solid ${props => props.theme.colors.border};
    background: ${props => props.theme.colors.card};
    border-radius: ${props => props.theme.borderRadius.lg};
    cursor: pointer;
    font-size: ${props => props.theme.fontSizes.md};
    font-weight: ${props => props.theme.fontWeights.semibold};
    transition: all ${props => props.theme.transitions.normal};
    
    &:hover {
      border-color: ${props => props.theme.colors.primary};
      background: ${props => props.theme.colors.primary};
      color: white;
    }
    
    &.active {
      border-color: ${props => props.theme.colors.primary};
      background: ${props => props.theme.colors.primary};
      color: white;
    }
  }
`;

const QuickToggles = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing['4xl']};
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.md};
  
  button {
    padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
    border: 2px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
    background: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.card};
    color: ${props => props.isActive ? 'white' : props.theme.colors.text};
    border-radius: ${props => props.theme.borderRadius.lg};
    font-size: ${props => props.theme.fontSizes.md};
    font-weight: ${props => props.theme.fontWeights.semibold};
    cursor: pointer;
    transition: all ${props => props.theme.transitions.normal};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.sm};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.md};
    }
    
    .icon {
      font-size: 1.2em;
    }
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.xl};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  margin-top: ${props => props.theme.spacing.xl};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.xl};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const StatusMessage = styled.div`
  background: ${props => props.theme.colors.successLight};
  color: ${props => props.theme.colors.success};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  text-align: center;
  margin-top: ${props => props.theme.spacing.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  display: ${props => props.show ? 'block' : 'none'};
  animation: slideIn 0.3s ease-in;
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Accessibility = () => {
  const { t, language } = useLanguage();
  
  // Re-render when language changes
  useEffect(() => {
    // This effect will run whenever the language changes
    // It ensures that all translated content is updated
  }, [language]);

  // Load saved settings or use defaults
  const loadSettings = () => {
    const saved = localStorage.getItem('gc_accessibility_settings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      highContrast: false,
      largeText: false,
      fontSize: 16,
      reducedMotion: false,
      screenReader: false,
      keyboardNav: true,
      colorTheme: 'default',
      voiceGuidance: false,
    };
  };

  const [settings, setSettings] = useState(loadSettings());
  const [showSaved, setShowSaved] = useState(false);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applySettings = (settingsToApply) => {
    const body = document.body;
    
    // Dark Mode
    if (settingsToApply.darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
    
    // High Contrast
    if (settingsToApply.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }
    
    // Large Text
    if (settingsToApply.largeText) {
      body.classList.add('large-text');
    } else {
      body.classList.remove('large-text');
    }
    
    // Reduced Motion
    if (settingsToApply.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }
    
    // Keyboard Navigation
    if (settingsToApply.keyboardNav) {
      body.classList.add('show-focus');
    } else {
      body.classList.remove('show-focus');
    }
    
    // Font Size
    document.documentElement.style.setProperty('--base-font-size', `${settingsToApply.fontSize}px`);
    
    // Color Theme
    if (settingsToApply.colorTheme !== 'default') {
      body.setAttribute('data-theme', settingsToApply.colorTheme);
    } else {
      body.removeAttribute('data-theme');
    }
  };

  const saveSettings = () => {
    localStorage.setItem('gc_accessibility_settings', JSON.stringify(settings));
    applySettings(settings);
    
    // Show success message
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
    
    // Voice feedback if enabled
    if (settings.voiceGuidance && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Settings saved successfully');
      window.speechSynthesis.speak(utterance);
    }
  };

  const resetSettings = () => {
    const defaults = {
      darkMode: false,
      highContrast: false,
      largeText: false,
      fontSize: 16,
      reducedMotion: false,
      screenReader: false,
      keyboardNav: true,
      colorTheme: 'default',
      voiceGuidance: false,
    };
    setSettings(defaults);
    localStorage.removeItem('gc_accessibility_settings');
    applySettings(defaults);
    
    // Voice feedback
    if (settings.voiceGuidance && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Settings reset to defaults');
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Apply saved settings on mount
    const savedSettings = loadSettings();
    applySettings(savedSettings);
    
    // Cleanup on unmount
    return () => {
      // Optional: could remove classes on unmount if needed
    };
  }, []);

  const colorThemes = [
    { id: 'default', name: 'Default Blue', color: '#3182ce' },
    { id: 'warm', name: 'Warm Orange', color: '#d97706' },
    { id: 'cool', name: 'Cool Teal', color: '#0891b2' },
    { id: 'green', name: 'Green', color: '#48bb78' },
    { id: 'purple', name: 'Purple', color: '#9333ea' },
  ];

  return (
    <AccessibilityContainer>
      <PageHeader>
        <h1><span className="icon">♿</span>{t('accessibility_settings')}</h1>
        <p>{t('customize_your_experience')}</p>
      </PageHeader>

      <ContentWrapper>
        <QuickToggles>
          <button 
            className={settings.darkMode ? 'active' : ''} 
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
          >
            <span className="icon">🌙</span>
            {t('dark_mode')}
          </button>
          <button 
            className={settings.highContrast ? 'active' : ''} 
            onClick={() => updateSetting('highContrast', !settings.highContrast)}
          >
            <span className="icon">🎨</span>
            {t('high_contrast')}
          </button>
          <button 
            className={settings.largeText ? 'active' : ''} 
            onClick={() => updateSetting('largeText', !settings.largeText)}
          >
            <span className="icon">➕</span>
            {t('large_text')}
          </button>
          <button 
            className={settings.reducedMotion ? 'active' : ''} 
            onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
          >
            <span className="icon">⏸️</span>
            {t('reduce_motion')}
          </button>
        </QuickToggles>

        {/* Visual Adjustments */}
        <SettingSection>
          <SectionTitle>
            <span className="icon">👀</span>
            {t('visual_adjustments')}
          </SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t('font_size')}</h3>
              <p>{t('adjust_text_size')}</p>
            </SettingInfo>
            <Slider>
              <input 
                type="range" 
                min="12" 
                max="24" 
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              />
              <div className="slider-value">{settings.fontSize}px</div>
            </Slider>
          </SettingItem>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t('color_theme')}</h3>
              <p>{t('choose_color_scheme')}</p>
            </SettingInfo>
            <ColorOptions>
              {colorThemes.map(theme => (
                <ColorButton 
                  key={theme.id}
                  color={theme.color}
                  isActive={settings.colorTheme === theme.id}
                  onClick={() => updateSetting('colorTheme', theme.id)}
                  aria-label={t(`${theme.id}_theme`)}
                />
              ))}
            </ColorOptions>
          </SettingItem>
        </SettingSection>

        {/* Navigation Preferences */}
        <SettingSection>
          <SectionTitle>
            <span className="icon">🧭</span>
            {t('navigation_preferences')}
          </SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t('keyboard_navigation')}</h3>
              <p>{t('enable_keyboard_shortcuts')}</p>
            </SettingInfo>
            <ToggleSwitch>
              <input 
                type="checkbox" 
                checked={settings.keyboardNav}
                onChange={(e) => updateSetting('keyboardNav', e.target.checked)}
              />
              <span />
            </ToggleSwitch>
          </SettingItem>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t('screen_reader')}</h3>
              <p>{t('optimize_for_screen_readers')}</p>
            </SettingInfo>
            <ToggleSwitch>
              <input 
                type="checkbox" 
                checked={settings.screenReader}
                onChange={(e) => updateSetting('screenReader', e.target.checked)}
              />
              <span />
            </ToggleSwitch>
          </SettingItem>
        </SettingSection>

        {/* Audio & Voice */}
        <SettingSection>
          <SectionTitle>
            <span className="icon">🔊</span>
            {t('audio_voice')}
          </SectionTitle>
          
          <SettingItem>
            <SettingInfo>
              <h3>{t('voice_guidance')}</h3>
              <p>{t('enable_voice_instructions')}</p>
            </SettingInfo>
            <ToggleSwitch>
              <input 
                type="checkbox" 
                checked={settings.voiceGuidance}
                onChange={(e) => updateSetting('voiceGuidance', e.target.checked)}
              />
              <span />
            </ToggleSwitch>
          </SettingItem>
        </SettingSection>

        {/* Preview */}
        <SettingSection>
          <SectionTitle>
            <span className="icon">👁️</span>
            {t('preview')}
          </SectionTitle>
          
          <PreviewSection>
            <h3>{t('sample_text')}</h3>
            <div className="preview-text">
              {t('this_is_sample_text')}
            </div>
            <ButtonGroup>
              <button>{t('primary_button')}</button>
              <button className="active">{t('active_button')}</button>
            </ButtonGroup>
          </PreviewSection>
        </SettingSection>

        <SaveButton onClick={saveSettings}>
          {t('save_settings')}
        </SaveButton>
        
        <StatusMessage show={showSaved}>
          {t('settings_saved_successfully')}
        </StatusMessage>
      </ContentWrapper>
    </AccessibilityContainer>
  );
};

export default Accessibility;
