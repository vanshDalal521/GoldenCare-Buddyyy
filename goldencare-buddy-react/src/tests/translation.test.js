import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext.jsx';
import TranslationButton from '../components/TranslationButton.jsx';

// Test component that uses the translation hook
const TestComponent = () => {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="welcome-text">{t('welcome_back', { name: 'John' })}</span>
      <span data-testid="missing-key">{t('nonexistent_key')}</span>
    </div>
  );
};

// Test component with translation button
const TestWithButton = () => {
  return (
    <div>
      <TranslationButton />
      <TestComponent />
    </div>
  );
};

describe('Translation System', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('should provide default language as English', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welcome back, John!');
  });

  test('should switch language when button is clicked', () => {
    render(
      <LanguageProvider>
        <TestWithButton />
      </LanguageProvider>
    );
    
    // Initially English
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('Welcome back, John!');
    
    // Click translation button to switch to Hindi
    const button = screen.getByLabelText('Switch to Hindi');
    fireEvent.click(button);
    
    // Should now be Hindi
    expect(screen.getByTestId('language')).toHaveTextContent('hi');
    expect(screen.getByTestId('welcome-text')).toHaveTextContent('वापसी पर स्वागत है, John!');
  });

  test('should handle missing translation keys gracefully', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Should fall back to key name for missing translations
    expect(screen.getByTestId('missing-key')).toHaveTextContent('nonexistent_key');
  });

  test('should persist language preference in localStorage', () => {
    render(
      <LanguageProvider>
        <TestWithButton />
      </LanguageProvider>
    );
    
    // Switch to Hindi
    const button = screen.getByLabelText('Switch to Hindi');
    fireEvent.click(button);
    
    // Check localStorage
    expect(localStorage.getItem('gc_language')).toBe('hi');
    
    // Re-render to check if it loads from localStorage
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('language')).toHaveTextContent('hi');
  });
});