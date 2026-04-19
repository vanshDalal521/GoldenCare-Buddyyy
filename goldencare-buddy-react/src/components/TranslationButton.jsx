import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';

const TranslationButtonWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.sm};
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .flag {
    font-size: ${props => props.theme.fontSizes.md};
  }
  
  .language-text {
    display: none;
    
    @media (min-width: ${props => props.theme.breakpoints.tablet}) {
      display: inline;
    }
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.md};
`;

const PopupContainer = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing['3xl']};
  max-width: 500px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1002;
  
  h2 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.text};
    text-align: center;
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.md};
    line-height: ${props => props.theme.lineHeights.relaxed};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing.xl};
    text-align: center;
  }
  
  .warning {
    background: ${props => props.theme.colors.warningLight}15;
    color: ${props => props.theme.colors.text};
    padding: ${props => props.theme.spacing.lg};
    border-radius: ${props => props.theme.borderRadius.lg};
    margin: ${props => props.theme.spacing.lg} 0;
    font-size: ${props => props.theme.fontSizes.sm};
    border-left: 4px solid ${props => props.theme.colors.warning};
  }
  
  .button-group {
    display: flex;
    gap: ${props => props.theme.spacing.md};
    justify-content: center;
    margin-top: ${props => props.theme.spacing.xl};
  }
`;

const ConfirmButton = styled.button`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  flex: 1;
  max-width: 150px;
  
  &.confirm {
    background: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.colors.primaryDark};
      transform: translateY(-2px);
    }
  }
  
  &.cancel {
    background: transparent;
    color: ${props => props.theme.colors.muted};
    border: 1px solid ${props => props.theme.colors.border};
    
    &:hover {
      background: ${props => props.theme.colors.border};
      transform: translateY(-2px);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${props => props.theme.spacing.lg};
  right: ${props => props.theme.spacing.lg};
  background: transparent;
  border: none;
  font-size: ${props => props.theme.fontSizes.xl};
  cursor: pointer;
  color: ${props => props.theme.colors.muted};
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const TranslationButton = () => {
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('');

  // Check if current route is admin dashboard
  const isAdminRoute = location.pathname === '/admin-dashboard' || location.pathname === '/admin-login';

  // Effect to handle visibility based on route
  useEffect(() => {
    setIsVisible(!isAdminRoute);
  }, [location.pathname, isAdminRoute]);

  // Don't show the button on admin routes
  if (!isVisible) {
    return null;
  }

  const handleLanguageClick = () => {
    const newLanguage = language === 'en' ? 'hi' : 'en';
    setTargetLanguage(newLanguage);
    setShowPopup(true);
    
    // Add blur effect to background
    document.body.style.overflow = 'hidden';
    const appElement = document.querySelector('.App');
    if (appElement) {
      appElement.style.filter = 'blur(8px)';
    }
  };

  const confirmLanguageChange = () => {
    changeLanguage(targetLanguage);
    
    // Dispatch a global event to notify other parts of the app
    const event = new CustomEvent('globalLanguageChange', { detail: targetLanguage });
    window.dispatchEvent(event);
    
    setShowPopup(false);
    // Remove blur effect
    document.body.style.overflow = 'auto';
    const appElement = document.querySelector('.App');
    if (appElement) {
      appElement.style.filter = 'none';
    }
  };

  const cancelLanguageChange = () => {
    setShowPopup(false);
    // Remove blur effect
    document.body.style.overflow = 'auto';
    const appElement = document.querySelector('.App');
    if (appElement) {
      appElement.style.filter = 'none';
    }
  };

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27 && showPopup) {
        cancelLanguageChange();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showPopup]);

  // Popup component to render in portal
  const Popup = () => (
    <PopupOverlay onClick={cancelLanguageChange}>
      <PopupContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={cancelLanguageChange}>×</CloseButton>
        <h2>{t('confirm_language_change')}</h2>
        <p>
          {language === 'en' 
            ? `Are you sure you want to switch the language from English to Hindi?` 
            : `क्या आप वाकई भाषा को हिंदी से अंग्रेजी में बदलना चाहते हैं?`}
        </p>
        
        <div className="warning">
          <strong>{t('important')}:</strong> {t('language_change_warning')}
        </div>
        
        <div className="button-group">
          <ConfirmButton className="confirm" onClick={confirmLanguageChange}>
            {t('confirm')}
          </ConfirmButton>
          <ConfirmButton className="cancel" onClick={cancelLanguageChange}>
            {t('cancel')}
          </ConfirmButton>
        </div>
      </PopupContainer>
    </PopupOverlay>
  );

  return (
    <>
      <TranslationButtonWrapper 
        onClick={handleLanguageClick} 
        aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      >
        <span className="flag">{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
        <span className="language-text">{language === 'en' ? 'हिंदी' : 'English'}</span>
      </TranslationButtonWrapper>

      {showPopup && createPortal(<Popup />, document.body)}
    </>
  );
};

export default TranslationButton;