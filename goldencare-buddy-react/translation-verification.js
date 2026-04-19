// Simple verification script for the translation system
console.log('=== Translation System Verification ===');

// Test the translation function
const testTranslations = () => {
  // Mock the useLanguage hook functionality
  const translations = {
    en: {
      'welcome_back': 'Welcome back, {name}!',
      'start_free_today': 'Start Free Today',
      'healthcare_made_simple': 'Healthcare Made Simple for Golden Years'
    },
    hi: {
      'welcome_back': 'वापसी पर स्वागत है, {name}!',
      'start_free_today': 'आज मुफ्त शुरू करें',
      'healthcare_made_simple': 'गोल्डन इयर्स के लिए स्वास्थ्य सेवा को सरल बनाया गया'
    }
  };

  // Simple translation function
  const t = (language, key, params = {}) => {
    let translation = translations[language]?.[key] || translations['en']?.[key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  console.log('Testing English translations:');
  console.log('welcome_back:', t('en', 'welcome_back', { name: 'John' }));
  console.log('start_free_today:', t('en', 'start_free_today'));
  console.log('healthcare_made_simple:', t('en', 'healthcare_made_simple'));
  
  console.log('\nTesting Hindi translations:');
  console.log('welcome_back:', t('hi', 'welcome_back', { name: 'राम' }));
  console.log('start_free_today:', t('hi', 'start_free_today'));
  console.log('healthcare_made_simple:', t('hi', 'healthcare_made_simple'));
  
  console.log('\nTesting fallback to English for missing translations:');
  console.log('missing_key:', t('hi', 'missing_key'));
  
  console.log('\n=== Verification Complete ===');
};

// Run the test
testTranslations();