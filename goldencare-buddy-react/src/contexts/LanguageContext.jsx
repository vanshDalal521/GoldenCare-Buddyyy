import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const LanguageContext = createContext();

// Enhanced translation dictionary with more comprehensive translations
const translations = {
  en: {
    // Landing Page
    'trusted_by_families': 'Trusted by 10,000+ families worldwide',
    'healthcare_made_simple': 'Healthcare Made Simple for Golden Years',
    'compassionate_digital_companion': 'A compassionate digital companion designed specifically for seniors, making medication management and health tracking effortless and accessible.',
    'start_free_today': 'Start Free Today',
    'see_how_it_works': 'See How It Works',
    'happy_families': 'Happy Families',
    'medication_adherence': 'Medication Adherence',
    'care_support': 'Care Support',
    'hipaa_compliant': 'HIPAA Compliant',
    'smart_medication': 'Smart Medication',
    'easy_pill_tracking': 'Easy pill tracking with large buttons and clear reminders',
    'family_connection': 'Family Connection',
    'keep_loved_ones_informed': 'Keep loved ones informed with real-time health updates',
    'wellness_support': 'Wellness Support',
    'gentle_guidance': 'Gentle guidance for hydration, exercise, and mindfulness',
    'ai_health_insights': 'AI Health Insights',
    'smart_predictions': 'Smart predictions to prevent health complications',
    'ready_to_transform': 'Ready to Transform Senior Care?',
    'join_thousands': 'Join thousands of families who trust GoldenCare Buddy to keep their loved ones healthy, connected, and independent.',
    'start_your_journey': 'Start Your Journey',
    'learn_more': 'Learn More',
    'copyright': '© 2024 GoldenCare Buddy. All rights reserved.',
    
    // Navigation
    'home': 'Home',
    'explore': 'Explore',
    'about': 'About',
    'help_center': 'Help Center',
    'login': 'Login',
    'logout': 'Logout',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'settings': 'Settings',
    
    // Patient Dashboard
    'welcome_back': 'Welcome back, {name}!',
    'here_is_your_health': 'Here\'s your health overview for today',
    'todays_medications': 'Today\'s Medications ({count})',
    'no_medications_yet': 'No medications yet',
    'no_medications_prescribed': 'Your doctor will prescribe medications here.',
    'health_summary': 'Health Summary',
    'medications_taken_count_summary': '{count} medication(s) taken today',
    'medications_pending_summary': '{count} medication(s) pending',
    'no_medications_prescribed_summary': 'No medications prescribed',
    'hydration_status': 'Hydration: 6/8 glasses',
    'breathing_exercise_completed': 'Breathing exercise completed',
    'quick_actions': 'Quick Actions',
    'mark_medication_taken': 'Mark Medication Taken',
    'log_water_intake': 'Log Water Intake',
    'start_breathing_exercise': 'Start Breathing Exercise',
    'view_family_messages': 'View Family Messages',
    'todays_tips': 'Today\'s Tips',
    'take_afternoon_medication': 'Take your afternoon medication with food',
    'drink_water': 'Drink water every 2 hours',
    'practice_deep_breathing': 'Practice deep breathing when stressed',
    'get_gentle_movement': 'Get some gentle movement today',
    'family_messages': 'Family Messages',
    'how_are_you_feeling': '"How are you feeling today, Dad?" - Priya',
    'dont_forget_vitamins': '"Don\'t forget your afternoon vitamins!" - Rohan',
    'prescribed_by': 'Prescribed by',
    'status_taken': 'Taken ✓',
    'status_pending': 'Pending',
    'status_missed': 'Missed',
    
    // Login Page
    'username': 'Username',
    'password': 'Password',
    'sign_in': 'Sign In',
    'forgot_password': 'Forgot Password?',
    'patient_login': 'Patient Login',
    'admin_login': 'Healthcare Provider',
    'register_now': 'Create New Account',
    'new_user': '👤 New User?',
    'create_free_account': 'Create your free account to start managing your health and medications',
    'choose_your_login_type': 'Choose your login type to access personalized healthcare management tools',
    'access_medications_and_features': 'Access your medications, health tracking, and wellness features',
    'manage_patients_and_analytics': 'Manage patients, view analytics, and monitor compliance',
    'sign_up_for_new_account': 'Sign up for a new patient account to get started',
    'what_youll_get_access_to': 'What you\'ll get access to:',
    'medication_tracking_feature': 'Medication tracking',
    'family_dashboard_feature': 'Family dashboard',
    'health_insights_feature': 'Health insights',
    'ai_recommendations': 'AI recommendations',
    'back_to_home': 'Back to Home',
    
    // NonScrollableLogin Page
    'patient_id': 'Patient ID',
    'mobile_number': 'Mobile Number',
    'full_name': 'Full Name',
    'confirm_password': 'Confirm Password',
    'enter_your_patient_id': 'Enter your patient ID',
    'enter_your_password': 'Enter your password',
    'enter_your_username': 'Enter your username',
    'enter_your_full_name': 'Enter your full name',
    'enter_10_digit_mobile': 'Enter 10-digit mobile number',
    'generate_unique_id': 'Generate unique ID',
    'create_strong_password': 'Create a strong password',
    're_enter_password': 'Re-enter your password',
    'please_enter_patient_id': 'Please enter your patient ID',
    'please_enter_password': 'Please enter your password',
    'please_enter_username': 'Please enter your username',
    'please_enter_full_name': 'Please enter your full name',
    'please_generate_patient_id': 'Please generate a patient ID',
    'please_enter_valid_mobile': 'Please enter a valid 10-digit mobile number',
    'password_min_length': 'Password must be at least 6 characters long',
    'passwords_do_not_match': 'Passwords do not match',
    'invalid_patient_credentials': 'Invalid patient ID or password. Please check your credentials.',
    'invalid_username_or_password': 'Invalid username or password. Please check your credentials.',
    'account_created_successfully': 'Account created successfully! You can now log in.',
    'patient_id_already_exists': 'This patient ID is already taken. Please generate a new one.',
    'registration_failed': 'Registration failed. Please try again.',
    'required_for_notifications': 'Required for AI voice call reminders & notifications',
    'signing_in': 'Signing in...',
    'access_my_dashboard': 'Access My Dashboard',
    'or': 'OR',
    'create_new_account': 'Create New Account',
    'creating_account': 'Creating Account...',
    'create_account': 'Create Account',
    'back_to_login': 'Back to Login',
    'back_to_patient_login': 'Back to Patient Login',
    'your_unique_patient_id': 'Your Unique Patient ID',
    'save_this_id_for_future': 'This ID will be used for your login. Save it for future reference:',
    'patient_portal': 'Patient Portal',
    'doctor_portal': 'Doctor Portal',
    'patient': 'Patient',
    'doctor': 'Doctor',
    'access_patient_management': 'Access Patient Management',
    'redirecting_to_login': 'Redirecting to login page...',
    'back_to_login': 'Back to Login',
    // Admin Login Page
    'healthcare_provider_portal': 'Healthcare Provider Portal',
    'access_admin_dashboard': 'Access the administrative dashboard to manage patients and monitor health data',
    'sign_in_to_dashboard': 'Sign In to Dashboard',
    
    // Patient Login Page
    'access_personal_health_dashboard': 'Access your personal health dashboard to track medications, view progress, and connect with your care team',
    'new_to_goldencare': 'New to GoldenCare Buddy?',
    'create_free_account_description': 'Create your free account to start managing your health and medications',
    'what_you_can_do': 'What you can do in your portal:',
    'track_medications': 'Track medications',
    'view_health_progress': 'View health progress',
    'get_reminders': 'Get reminders',
    'connect_with_family': 'Connect with family',
    
    // Patient Register Page
    'create_your_account': 'Create Your Account',
    'join_goldencare_buddy': 'Join GoldenCare Buddy to manage your health and medications',
    'registration_successful': 'Registration Successful!',
    'account_created_redirecting': 'Your account has been created. Redirecting to login...',
    'please_create_patient_id': 'Please create a patient ID',
    'patient_id_min_length': 'Patient ID must be at least 4 characters long',
    'mobile_should_contain_digits': 'Mobile number should contain only digits',
    'create_patient_id': 'Create Patient ID',
    'create_unique_patient_id': 'Create a unique patient ID',
    'patient_id_tip': 'This will be your username for login. Choose something memorable!',
    
    // Common
    'loading': 'Loading...',
    'error_occurred': 'An error occurred',
    'try_again': 'Try Again',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'add': 'Add',
    'close': 'Close',
    'confirm_language_change': 'Confirm Language Change',
    'language_change_warning': 'After logging in to your dashboard, you cannot change the language. You will need to log out and come back to this page to change it.',
    'confirm': 'Confirm',
    'important': 'Important',
    
    // Home Page
    'welcome_healthcare_dashboard': '✨ Welcome to your healthcare dashboard',
    'welcome_back_name': 'Welcome back, {name}!',
    'your_health': 'Your Health,',
    'simplified': 'Simplified',
    'healthcare_tools_description': 'Access all your healthcare tools in one place. Manage medications, track wellness, and stay connected with your care team.',
    'manage_medications': '💊 Manage Medications',
    'track_wellness': '🧘 Track Wellness',
    'large_text_buttons': 'Large Text & Buttons',
    'easy_to_read_use': 'Easy to read and use',
    'voice_reminders': 'Voice Reminders',
    'audio_notifications': 'Audio notifications',
    'progress_tracking': 'Progress Tracking',
    'visual_health_insights': 'Visual health insights',
    'hipaa_compliant_home': 'HIPAA Compliant',
    'secure_private': 'Secure & private',
    'next_reminder': 'Next Reminder',
    'blood_pressure_medication': 'Blood pressure medication',
    'time_today': '{time} Today',
    'todays_progress_home': 'Today\'s Progress',
    'medications_taken_count': '{taken} of {total} medications taken',
    'continue_your_health_journey_name': 'Continue your health journey, {name}!',
    'keep_track_of_your_health_progress': 'Keep track of your health progress and stay on top of your wellness goals.',
    'view_my_medications': 'View My Medications',
    'track_my_wellness': 'Track My Wellness',
    'join_families_description': 'Join thousands of families who trust GoldenCare Buddy to keep their seniors healthy, connected, and independent. Start your journey today.',
    'get_started_free': 'Get Started Free',
    'percentage_adherence': '{percentage}% adherence',
    'family_alert': 'Family Alert',
    'mom_completed_routine': 'Mom completed her',
    'morning_routine_completed': 'morning routine ✓',
    'core_features': 'Core Features',
    'everything_for_health_management': 'Everything you need for better health management',
    'comprehensive_suite_description': 'Our comprehensive suite of tools is designed with seniors in mind, ensuring accessibility, simplicity, and effectiveness in every interaction.',
    'digital_pillbox_feature': 'Digital Pillbox',
    'digital_pillbox_description': 'Large buttons, clear images, and intuitive interface designed specifically for seniors.',
    'family_dashboard': 'Family Dashboard',
    'family_dashboard_description': 'Real-time monitoring of medication adherence and health progress for peace of mind.',
    'wellness_tracking': 'Wellness Tracking',
    'wellness_tracking_description': 'Gentle reminders for hydration, exercise, and mindfulness activities.',
    'ai_health_insights_feature': 'AI Health Insights',
    'ai_health_insights_description': 'Predictive analytics to identify patterns and prevent health complications.',
    'explore_feature': 'Explore {feature}',
    'interactive_demo': 'Interactive Demo',
    'experience_simplicity': 'Experience the simplicity',
    'intuitive_medication_system': 'Try our intuitive medication management system. Click any pill to see how easy it is to track daily medications.',
    'morning_medication': 'Morning Medication',
    'aspirin_dosage': 'Aspirin 81mg • With breakfast',
    'afternoon_vitamins': 'Afternoon Vitamins',
    'vitamin_d': 'Vitamin D • With lunch',
    'evening_medication': 'Evening Medication',
    'sleep_aid': 'Sleep aid • Before bed',
    'mark_as_taken': 'Mark as taken',
    'taken_home': 'Taken',
    'taken_today': 'Taken Today',
    'remaining': 'Remaining',
    'todays_medication_progress': 'Today\'s Medication Progress',
    'ready_to_transform_healthcare': 'Ready to transform healthcare for your loved ones?',
    'join_families_description': 'Join thousands of families who trust GoldenCare Buddy to keep their seniors healthy, connected, and independent. Start your journey today.',
    'get_started_free': 'Get Started Free',
    'learn_more_home': 'Learn More',
    'ai_assistant': 'AI Assistant',
    
    // AI
    'ai_health_assistant': 'AI Health Assistant',
    'ai_assistant_description': 'I\'m here to help you manage your health with personalized insights, medication reminders, and wellness recommendations. Using advanced AI algorithms, I can analyze your health data to provide actionable advice and support.',
    'ai_assistant_description2': 'Whether you need help tracking medications, understanding symptoms, or optimizing your wellness routine, I\'m available 24/7 to provide evidence-based guidance.',
    'key_features': 'Key Features',
    'medication_tracking_ai': 'Medication Tracking',
    'medication_tracking_description': 'Monitor your medication schedule with smart reminders and adherence tracking.',
    'health_insights': 'Health Insights',
    'health_insights_description': 'Get personalized health recommendations based on your medical history and patterns.',
    'wellness_coaching': 'Wellness Coaching',
    'wellness_coaching_description': 'Receive guidance on exercise, nutrition, and lifestyle improvements.',
    'emergency_support': 'Emergency Support',
    'emergency_support_description': 'Quick access to emergency contacts and medical information when you need it.',
    'how_it_works': 'How It Works',
    'connect_health_data': 'Connect Your Health Data',
    'connect_health_data_desc': 'Link your medical records, medications, and wearable devices',
    'ai_analysis': 'AI Analysis',
    'ai_analysis_desc': 'Our algorithms analyze your data to identify patterns and insights',
    'personalized_recommendations': 'Personalized Recommendations',
    'personalized_recommendations_desc': 'Get personalized advice for better health outcomes',
    'continuous_monitoring': 'Continuous Monitoring',
    'continuous_monitoring_desc': 'Track progress and adjust recommendations over time',
    'start_ai_consultation': 'Start AI Consultation',
    // AI Chatbot
    'ai_chat_assistant_description': 'I\'m here to answer your health questions and help with your healthcare needs.',
    'ai_chat_assistant': 'AI Chat Assistant',
    'ai_welcome_title': 'Welcome!',
    'ai_welcome_description': 'I\'m your personal health assistant. I can answer questions about your medications, wellness, and health concerns.',
    'try_asking': 'Try asking',
    'ai_sample_question_1': 'How should I remember to take my morning medication?',
    'ai_sample_question_2': 'How can I track my hydration levels?',
    'ai_sample_question_3': 'What should I do in an emergency situation?',
    'ai_chat_placeholder': 'Type your health question here...',
    'send': 'Send',
    'ai_welcome_message': 'Hello! I\'m your personal health assistant. I can answer questions about your medications, wellness, and health concerns. How can I help you today?',
    'ai_medication_response_1': 'To set up medication reminders, please go to the pillbox section and click the "Add Medication" button. You can set the medication name, dosage, and time.',
    'ai_medication_response_2': 'To track your medication schedule, go to the pillbox page daily. You can see which medications have been taken and which are pending.',
    'ai_medication_response_3': 'If you forget to take your medication, please contact your doctor. For most medications, if you miss a dose, take the next dose at the normal time.',
    'ai_wellness_response_1': 'To track hydration, use the "Add Glass" button on the wellness page. Our goal is 8 glasses of water per day.',
    'ai_wellness_response_2': 'Breathing exercises help reduce stress. Click the "Start Breathing" button on the wellness page and follow the circle animation.',
    'ai_wellness_response_3': 'Daily exercise is important for your health. We recommend gentle stretching, walking, and balance exercises.',
    'ai_health_response_1': 'A balanced diet should include fruits, vegetables, whole grains, lean proteins, and healthy fats.',
    'ai_health_response_2': 'Regular exercise reduces the risk of heart disease, diabetes, and other health problems.',
    'ai_health_response_3': '7-9 hours of sleep is ideal for adults. Consistent sleep times and a comfortable environment lead to quality rest.',
    'ai_emergency_response_1': 'In an emergency situation, please call 911 immediately or go to your local hospital.',
    'ai_emergency_response_2': 'If you have serious injuries or symptoms, please seek medical attention immediately. Also notify your family members.',
    'ai_default_response_1': 'That\'s an important question. I\'m here to help you. Could you elaborate a bit more on your question?',
    'ai_default_response_2': 'I understand your question. I\'m here to help with your healthcare needs. Would you like to ask about a specific area of your health?',
    'ai_default_response_3': 'That\'s a great question. I\'m here to provide you with health information. Would you like to know more about a specific aspect of your health?',
    'ai_default_response_4': 'I\'m happy to answer your health questions. Would you like to know more about a specific area of your health?',
    // Website-specific responses
    'ai_website_info_1': 'GoldenCare Buddy is a comprehensive healthcare platform designed specifically for seniors and their families. The main goal is to simplify healthcare management for elderly individuals by providing easy-to-use tools for medication tracking, wellness monitoring, and health insights.',
    'ai_website_info_2': 'This website was created to address the challenges seniors face in managing their healthcare independently. It helps bridge the gap between patients, families, and healthcare providers through technology.',
    'ai_website_info_3': 'GoldenCare Buddy helps seniors maintain their independence while ensuring their health needs are met. It provides a user-friendly interface with large buttons, clear text, and voice reminders.',
    'ai_how_it_works_1': 'GoldenCare Buddy works in simple steps: 1) Seniors or their families create an account, 2) Doctors prescribe medications through the platform, 3) The system sends reminders for medications and wellness activities, 4) Family members can monitor progress, 5) AI provides health insights and recommendations.',
    'ai_how_it_works_2': 'The platform integrates medication management, wellness tracking, and family communication. Users receive visual and audio reminders, track their health progress, and stay connected with their care team.',
    'ai_how_it_works_3': 'After registration, users set up their medication schedule, wellness goals, and family connections. The system then provides daily guidance and tracks progress over time.',
    'ai_who_it_helps_1': 'GoldenCare Buddy primarily helps seniors aged 65+ who want to manage their health independently. It also benefits their family members who want to stay connected and informed about their loved one\'s health status.',
    'ai_who_it_helps_2': 'Healthcare providers benefit by having better medication adherence data and patient engagement. Families gain peace of mind knowing their elderly relatives are supported with technology.',
    'ai_who_it_helps_3': 'The platform is especially helpful for seniors with chronic conditions who need regular medication management and wellness monitoring.',
    'ai_features_1': 'Key features include: 1) Digital pillbox with medication tracking and reminders, 2) Wellness tracking for hydration, exercise, and breathing, 3) Family dashboard for remote monitoring, 4) AI health insights and recommendations, 5) Voice reminders for those with vision difficulties.',
    'ai_features_2': 'The platform offers medication management with large text buttons, wellness activities like hydration tracking and breathing exercises, family communication tools, and emergency alert systems.',
    'ai_features_3': 'Special features include HIPAA-compliant data security, multilingual support, accessibility options for visually impaired users, and integration with healthcare providers.',
    'ai_benefits_1': 'Benefits include improved medication adherence (up to 98% in our users), better family communication, early detection of health issues, and increased independence for seniors.',
    'ai_benefits_2': 'Families report 40% fewer hospital visits and greater peace of mind. Seniors appreciate the simplicity and independence the platform provides.',
    'ai_benefits_3': 'Healthcare providers gain better patient data and engagement, leading to improved treatment outcomes and reduced readmission rates.',
// Wellness translations
    'wellness': 'Wellness',
    'wellness_description': 'Track your hydration, exercise, and mindfulness activities.',
    'hydration_tracker': 'Hydration Tracker',
    'glasses': 'glasses',
    'add_glass': 'Add Glass',
    'reset': 'Reset',
    'remaining': 'Remaining',
    'goal': 'Goal',
    'breathing_exercise': 'Breathing Exercise',
    'breathing_ready': 'Ready',
    'breathing_inhale': 'Breathe In',
    'breathing_hold': 'Hold',
    'breathing_exhale': 'Breathe Out',
    'breathing_description': 'Take deep breaths to reduce stress and relax. Follow the circle animation.',
    'start_breathing': 'Start Breathing',
    'stop_breathing': 'Stop Breathing',
    'daily_exercises': 'Daily Exercises',
    'gentle_stretching': 'Gentle Stretching',
    'walking': 'Walking',
    'balance_exercise': 'Balance Exercise',
    'start': 'Start',
    'done': 'Done',
    'mood_tracker': 'Mood Tracker',
    'how_are_you_feeling': 'How are you feeling today?',
    'mood_selected': 'Mood selected',
    'not_recorded': 'Not recorded',
    'todays_progress': 'Today\'s Progress',
    'hydration': 'Hydration',
    'breathing_exercise': 'Breathing',
    'exercises': 'Exercises',
    'mood': 'Mood',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'not_started': 'Not Started',
    'wellness_tips': 'Wellness Tips',
    'tip_drink_water': 'Drink water every 2 hours throughout the day',
    'tip_deep_breaths': 'Take 5 deep breaths when you feel stressed',
    'tip_move_gently': 'Move gently throughout the day with light exercises',
    'tip_listen_body': 'Listen to your body and rest when needed',
    'tip_consistent_sleep': 'Maintain consistent sleep schedule for better health',
    
    // Pillbox
    'digital_pillbox': 'Digital Pillbox',
    'manage_medications_description': 'Manage your medications with ease. Large buttons, clear labels, and simple interaction designed specifically for seniors.',
    'morning': 'Morning',
    'afternoon': 'Afternoon',
    'evening': 'Evening',
    'night': 'Night',
    'no_medications_for_slot': 'No medications for {slot}',
    'doctor_will_prescribe': 'Your doctor will prescribe medications here.',
    'add_first_medication': 'Add your first medication to start tracking.',
    'contact_doctor': 'Contact Doctor',
    'enable_notifications': 'Enable Notifications & AI Calls',
    'test_notification': 'Test Notification',
    'todays_progress_pillbox': 'Today\'s Progress',
    'taken_pillbox': 'Taken',
    'total_pillbox': 'Total',
    'tips_for_success': 'Tips for Success',
    'medication_info': 'Medication Info',
    'tip_consistent_times': 'Take medications at consistent times',
    'tip_doctor_manages': 'Your doctor manages your medication list',
    'tip_mark_daily': 'Mark medications as taken daily',
    'tip_contact_doctor': 'Contact your doctor for any concerns',
    'tip_never_skip': 'Never skip doses without consulting your doctor',
    'tip_set_times': 'Set times for each medication',
    'tip_keep_bottles': 'Keep medications in original bottles',
    'tip_use_app_daily': 'Use this app daily to build a routine',
    'tip_ask_family': 'Ask family members to help monitor progress',
    
    // Help Center
    'help_center_page': 'Help Center',
    'find_answers_support': 'Find answers to your questions and get the support you need',
    'search_help_articles': 'Search for help articles, FAQs, or topics...',
    'user_guide_link': 'User Guide',
    'step_by_step_tutorials': 'Step-by-step tutorials and how-to guides',
    'accessibility_link': 'Accessibility',
    'customize_experience': 'Customize your experience for better accessibility',
    'system_status_link': 'System Status',
    'check_system_health': 'Check system health and service status',
    'contact_support_link': 'Contact Support',
    'get_in_touch': 'Get in touch with our support team',
    'frequently_asked_questions': 'Frequently Asked Questions',
    'no_results_found': 'No results found for "{query}". Try different keywords or browse our quick links above.',
    'still_need_help': 'Still Need Help?',
    'support_team_assist': 'Our support team is here to assist you 24/7',
    'email_support': 'Email Support',
    'call_us': 'Call Us',
    'how_to_setup_medication_reminders': 'How do I set up medication reminders?',
    'setup_medication_reminders_answer': `To set up medication reminders:
      
1. Log in to your patient dashboard
2. Navigate to the "Pillbox" section
3. Click "Add Medication" button
4. Fill in the medication details (name, dosage, time)
5. Enable notifications when prompted
6. Save your medication

You'll receive reminders at the scheduled time via browser notifications and optional AI voice calls.`,
    'what_are_ai_voice_call_reminders': 'What are AI voice call reminders?',
    'ai_voice_call_reminders_answer': `AI voice call reminders are automated phone calls that remind you to take your medication. When enabled:

• You'll receive a phone call at the scheduled time
• An AI assistant will inform you about your medication
• You can confirm you've taken it by pressing 1
• All calls are logged for your records

This feature requires a valid mobile number and backend service configuration.`,
    'how_to_track_wellness_progress': 'How do I track my wellness progress?',
    'track_wellness_progress_answer': `The Wellness section provides comprehensive health tracking:

• View your daily medication adherence rate
• Track mood and symptoms over time
• Monitor vital signs and health metrics
• Generate reports for healthcare providers
• Set health goals and track progress

All data is stored securely and only accessible by you and authorized healthcare providers.`,
    'can_family_access_health_info': 'Can family members access my health information?',
    'family_access_health_info_answer': `Yes, with your permission:

1. Go to the "Family" section in your dashboard
2. Invite family members via email
3. Set their access permissions (view only, receive alerts, etc.)
4. They'll receive an invitation to create their account
5. You can revoke access at any time

Family members can view your medication schedule and receive alerts if you miss doses.`,
    'is_my_health_data_secure': 'Is my health data secure?',
    'health_data_security_answer': `Absolutely. We take security seriously:

• All data is encrypted in transit and at rest
• HIPAA-compliant data storage
• Regular security audits
• Two-factor authentication available
• You control who can access your data
• Automatic session timeout for security

Your privacy is our top priority.`,
    'how_to_change_notification_settings': 'How do I change my notification settings?',
    'change_notification_settings_answer': `To customize notifications:

1. Go to Settings (top right menu)
2. Select "Notification Preferences"
3. Choose notification methods (browser, SMS, voice call)
4. Set quiet hours if needed
5. Customize reminder frequency
6. Save your preferences

You can adjust these settings anytime.`,
    'what_if_i_forget_password': 'What if I forget my password?',
    'forgot_password_answer': `To reset your password:

1. Click "Forgot Password" on the login page
2. Enter your registered email or patient ID
3. Check your email for a reset link
4. Follow the link and create a new password
5. Log in with your new credentials

For security, reset links expire after 24 hours.`,
    'how_to_contact_healthcare_provider': 'How do I contact my healthcare provider?',
    'contact_healthcare_provider_answer': `You can reach your healthcare provider through:

• The "Messages" section in your dashboard
• Emergency contact button (for urgent matters)
• Scheduled video consultations
• Phone number listed in your account

For medical emergencies, always call your local emergency number.`,
    
    // User Guide
    'user_guide': 'User Guide',
    'complete_step_by_step_tutorials': 'Complete step-by-step tutorials to help you make the most of GoldenCare Buddy',
    'getting_started': 'Getting Started',
    'managing_medications': 'Managing Medications',
    'setting_up_reminders': 'Setting Up Reminders',
    'ai_voice_calls': 'AI Voice Calls',
    'wellness_tracking_guide': 'Wellness Tracking',
    'family_features': 'Family Features',
    'create_your_account_guide': 'Create Your Account',
    'to_begin_using_goldencare': 'To begin using GoldenCare Buddy, you\'ll need to create an account:',
    'visit_homepage_and_click': 'Visit the homepage and click "Get Started" or "Login"',
    'choose_patient_login_guide': 'Choose "Patient Login" to access the patient portal',
    'for_demo_purposes_use': 'For demo purposes, use the provided credentials:',
    'patient_id_code_patient': 'Patient ID: patient',
    'password_code_patient123': 'Password: patient123',
    'mobile_code_9876543210': 'Mobile: 9876543210',
    'click_access_my_dashboard_guide': 'Click "Access My Dashboard" to log in',
    'tip_guide': 'Tip:',
    'make_sure_to_enable_browser': 'Make sure to enable browser notifications when prompted. This allows you to receive medication reminders even when you\'re not actively using the app.',
    'explore_your_dashboard': 'Explore Your Dashboard',
    'after_logging_in_youll_see': 'After logging in, you\'ll see your personalized dashboard with:',
    'quick_stats': 'Quick Stats:',
    'overview_of_your_medications': 'Overview of your medications and wellness',
    'todays_medications_guide': 'Today\'s Medications:',
    'list_of_meds_to_take_today': 'List of meds to take today',
    'upcoming_reminders': 'Upcoming Reminders:',
    'schedule_of_medication_times': 'Schedule of medication times',
    'recent_activity': 'Recent Activity:',
    'your_medication_history': 'Your medication history',
    'dashboard_screenshot': 'Dashboard Screenshot - Shows medication overview, today\'s schedule, and health stats',
    'navigate_the_menu': 'Navigate the Menu',
    'use_the_navigation_menu': 'Use the navigation menu to access different features:',
    'home_guide': 'Home:',
    'your_main_dashboard': 'Your main dashboard',
    'pillbox_guide': 'Pillbox:',
    'manage_your_medications_guide': 'Manage your medications',
    'family_guide': 'Family:',
    'connect_with_family_members_guide': 'Connect with family members',
    'wellness_guide': 'Wellness:',
    'track_your_health_progress_guide': 'Track your health progress',
    'ai_guide': 'AI:',
    'ai_voice_call_settings': 'AI voice call settings',
    'add_a_new_medication': 'Add a New Medication',
    'adding_medications_is_simple': 'Adding medications is simple and quick:',
    'navigate_to_the_pillbox_page': 'Navigate to the Pillbox page',
    'click_the_add_medication_button': 'Click the "Add Medication" button',
    'fill_in_the_medication_details': 'Fill in the medication details:',
    'medication_name': 'Medication name (e.g., "Aspirin")',
    'dosage': 'Dosage (e.g., "100mg")',
    'time_slot': 'Time slot (Morning, Afternoon, Evening, Night)',
    'frequency': 'Frequency (Once daily, Twice daily, etc.)',
    'special_notes_or_instructions': 'Special notes or instructions',
    'click_add_medication_to_save': 'Click "Add Medication" to save',
    'pro_tip': 'Pro Tip:',
    'add_all_your_medications': 'Add all your medications at once for a complete daily schedule. You can always edit or remove them later.',
    'mark_medications_as_taken': 'Mark Medications as Taken',
    'track_your_medication_adherence': 'Track your medication adherence easily:',
    'find_your_medication_in_the_list': 'Find your medication in the list',
    'click_the_mark_as_taken_button': 'Click the "Mark as Taken" button',
    'the_medication_status_updates': 'The medication status updates to "Taken"',
    'your_adherence_statistics': 'Your adherence statistics are automatically updated',
    'important_guide': 'Important:',
    'you_can_only_mark_a_medication': 'You can only mark a medication as taken once per day. This ensures accurate tracking of your medication schedule.',
    'edit_or_remove_medications': 'Edit or Remove Medications',
    'keep_your_medication_list': 'Keep your medication list up to date:',
    'to_edit': 'To Edit:',
    'click_the_edit_icon': 'Click the edit icon next to any medication, make changes, and save',
    'to_remove': 'To Remove:',
    'click_the_delete_icon': 'Click the delete icon and confirm removal',
    'to_reorder': 'To Reorder:',
    'medications_are_automatically_sorted': 'Medications are automatically sorted by time',
    'enable_browser_notifications': 'Enable Browser Notifications',
    'browser_notifications_allow_you': 'Browser notifications allow you to receive medication reminders even when you\'re not actively using the app:',
    'when_prompted_click_allow': 'When prompted, click "Allow" to enable notifications',
    'you_can_change_this_later': 'You can change this later in your browser settings',
    'check_your_notification_settings': 'Check your notification settings in the app to ensure they\'re properly configured',
    'notifications_work_best': 'Notifications work best when combined with AI voice calls for maximum reliability.',
    'customize_reminder_settings': 'Customize Reminder Settings',
    'personalize_your_reminder_preferences': 'Personalize your reminder preferences:',
    'go_to_settings': 'Go to Settings (top right menu)',
    'select_notification_preferences': 'Select "Notification Preferences"',
    'choose_notification_methods': 'Choose notification methods (browser, SMS, voice call)',
    'set_quiet_hours': 'Set quiet hours if needed',
    'save_your_preferences': 'Save your preferences',
    'set_up_your_mobile_number': 'Set Up Your Mobile Number',
    'ai_voice_calls_require_a_valid': 'AI voice calls require a valid mobile number:',
    'navigate_to_the_ai_page': 'Navigate to the AI page',
    'click_manage_phone_numbers': 'Click "Manage Phone Numbers"',
    'enter_your_mobile_number': 'Enter your mobile number',
    'click_verify_to_receive': 'Click "Verify" to receive a verification code via SMS',
    'enter_the_verification_code': 'Enter the verification code you received',
    'click_save_phone_number': 'Click "Save Phone Number"',
    'configure_call_preferences': 'Configure Call Preferences',
    'customize_when_and_how': 'Customize when and how you receive AI calls:',
    'set_call_times': 'Set call times for different medication slots',
    'choose_call_language': 'Choose call language (English or Hindi)',
    'select_call_reminders': 'Select which reminders trigger calls',
    'enable_missed_dose_alerts': 'Enable missed dose alerts for family members',
    'test_your_ai_voice_call': 'Test Your AI Voice Call',
    'test_the_feature_before_relying': 'Test the feature before relying on it:',
    'go_to_the_ai_page_guide': 'Go to the AI page',
    'click_test_call_now_button': 'Click "Test Call Now" button',
    'you_should_receive_a_test_call': 'You should receive a test call immediately',
    'follow_the_voice_instructions': 'Follow the voice instructions to confirm',
    'monitor_how_well_youre_following': 'Monitor how well you\'re following your medication schedule:',
    'view_daily_adherence_percentage': 'View daily adherence percentage',
    'see_weekly_and_monthly_trends': 'See weekly and monthly trends',
    'identify_patterns_and_missed_doses': 'Identify patterns and missed doses',
    'generate_reports_for_your_doctor': 'Generate reports for your doctor',
    'wellness_dashboard': 'Wellness Dashboard - Shows adherence charts, health metrics, and progress tracking',
    'log_health_metrics': 'Log Health Metrics',
    'keep_track_of_important_health': 'Keep track of important health indicators:',
    'blood_pressure_readings': 'Blood pressure readings',
    'blood_sugar_levels': 'Blood sugar levels',
    'weight_and_bmi': 'Weight and BMI',
    'mood_and_symptoms': 'Mood and symptoms',
    'family_connection_guide': 'Family Connection',
    'keep_your_loved_ones_informed_guide': 'Keep your loved ones informed and involved:',
    'go_to_the_family_page': 'Go to the Family page',
    'click_invite_family_member': 'Click "Invite Family Member"',
    'enter_their_email_address': 'Enter their email address',
    'set_their_access_permissions': 'Set their access permissions',
    'theyll_receive_an_invitation_email': 'They\'ll receive an invitation email',
    'family_members_can_receive_alerts': 'Family members can receive alerts when you miss medications, providing an extra safety net.',
    'manage_privacy_settings': 'Manage Privacy Settings',
    'youre_always_in_control': 'You\'re always in control of your data:',
    'choose_what_information_family': 'Choose what information family can see',
    'set_who_receives_alerts': 'Set who receives alerts and notifications',
    'revoke_access_at_any_time': 'Revoke access at any time',
    'view_audit_logs': 'View audit logs of who accessed your data',
    
    // Accessibility
    'accessibility_settings': 'Accessibility Settings',
    'customize_your_experience': 'Customize your experience to meet your accessibility needs',
    'dark_mode': 'Dark Mode',
    'high_contrast': 'High Contrast',
    'large_text': 'Large Text',
    'reduce_motion': 'Reduce Motion',
    'visual_adjustments': 'Visual Adjustments',
    'font_size': 'Font Size',
    'adjust_text_size': 'Adjust the size of text throughout the application',
    'color_theme': 'Color Theme',
    'choose_color_scheme': 'Choose a color scheme that works best for you',
    'default_theme': 'Default Theme',
    'dark_theme': 'Dark Theme',
    'sepia_theme': 'Sepia Theme',
    'blue_theme': 'Blue Theme',
    'navigation_preferences': 'Navigation Preferences',
    'keyboard_navigation': 'Keyboard Navigation',
    'enable_keyboard_shortcuts': 'Enable keyboard shortcuts and focus indicators',
    'screen_reader': 'Screen Reader',
    'optimize_for_screen_readers': 'Optimize interface for screen readers',
    'audio_voice': 'Audio & Voice',
    'voice_guidance': 'Voice Guidance',
    'enable_voice_instructions': 'Enable voice instructions and audio feedback',
    'preview': 'Preview',
    'sample_text': 'Sample Text',
    'this_is_sample_text': 'This is sample text to preview your settings',
    'primary_button': 'Primary Button',
    'active_button': 'Active Button',
    'save_settings': 'Save Settings',
    'settings_saved_successfully': 'Settings saved successfully!',
    
    // System Status
    'system_status': 'System Status',
    'real_time_system_monitoring': 'Real-time monitoring of all system services and performance metrics',
    'all_systems_operational': 'All Systems Operational',
    'degraded_performance': 'Degraded Performance',
    'system_outage': 'System Outage',
    'all_services_running_normally': 'All services are running normally',
    'some_services_experiencing_issues': 'Some services are experiencing issues',
    'services_currently_unavailable': 'Services are currently unavailable',
    'last_updated': 'Last updated',
    'operational': 'Operational',
    'degraded_status': 'Degraded',
    'down': 'Down',
    'uptime': 'Uptime',
    'response_time': 'Response Time',
    'scheduled_jobs': 'Scheduled Jobs',
    'notifications_delivered': 'Notifications Delivered',
    'performance_metrics': 'Performance Metrics',
    'requests': 'Requests',
    'avg_response_time': 'Avg Response Time',
    'active_users': 'Active Users',
    'incident_history': 'Incident History',
    'no_recent_incidents': 'No recent incidents reported',
    'refreshing': 'Refreshing...',
    'refresh_status': 'Refresh Status'
  },
  
  hi: {
    // Landing Page
    'trusted_by_families': 'दुनिया भर में 10,000+ परिवारों द्वारा विश्वसनीय',
    'healthcare_made_simple': 'गोल्डन इयर्स के लिए स्वास्थ्य सेवा को सरल बनाया गया',
    'compassionate_digital_companion': 'वरिष्ठ नागरिकों के लिए विशेष रूप से डिज़ाइन किया गया एक सहानुभूतिपूर्ण डिजिटल साथी, जो दवा प्रबंधन और स्वास्थ्य ट्रैकिंग को आसान और सुलभ बनाता है।',
    'start_free_today': 'आज मुफ्त शुरू करें',
    'see_how_it_works': 'देखें कि यह कैसे काम करता है',
    'happy_families': 'खुश परिवार',
    'medication_adherence': 'दवा अनुपालन',
    'care_support': 'देखभाल समर्थन',
    'hipaa_compliant': 'HIPAA अनुपालन',
    'smart_medication': 'स्मार्ट दवा',
    'easy_pill_tracking': 'बड़े बटन और स्पष्ट अनुस्मारक के साथ आसान गोली ट्रैकिंग',
    'family_connection': 'पारिवारिक संबंध',
    'keep_loved_ones_informed': 'वास्तविक समय के स्वास्थ्य अपडेट के साथ प्रियजनों को सूचित रखें',
    'wellness_support': 'कल्याण समर्थन',
    'gentle_guidance': 'जलयोजन, व्यायाम और मनोदशा के लिए कोमल मार्गदर्शन',
    'ai_health_insights': 'AI स्वास्थ्य अंतर्दृष्टि',
    'smart_predictions': 'स्वास्थ्य जटिलताओं को रोकने के लिए स्मार्ट भविष्यवाणी',
    'ready_to_transform': 'क्या आप वरिष्ठ देखभाल को बदलने के लिए तैयार हैं?',
    'join_thousands': 'हजारों परिवारों के साथ जुड़ें जो गोल्डनकेयर बडी पर भरोसा करते हैं ताकि वे अपने प्रियजनों को स्वस्थ, जुड़ा हुआ और स्वतंत्र रख सकें।',
    'start_your_journey': 'अपनी यात्रा शुरू करें',
    'learn_more': 'और जानें',
    'copyright': '© 2024 गोल्डनकेयर बडी। सर्वाधिकार सुरक्षित।',
    
    // Navigation
    'home': 'होम',
    'explore': 'अन्वेषण करें',
    'about': 'हमारे बारे में',
    'help_center': 'सहायता केंद्र',
    'login': 'लॉग इन करें',
    'logout': 'लॉग आउट',
    'dashboard': 'डैशबोर्ड',
    'profile': 'प्रोफ़ाइल',
    'settings': 'सेटिंग्स',
    
    // Patient Dashboard
    'welcome_back': 'वापसी पर स्वागत है, {name}!',
    'here_is_your_health': 'आज के लिए आपका स्वास्थ्य अवलोकन यहां है',
    'todays_medications': 'आज की दवाएं ({count})',
    'no_medications_yet': 'अभी तक कोई दवा नहीं',
    'no_medications_prescribed': 'आपके डॉक्टर यहां दवाएं निर्धारित करेंगे।',
    'health_summary': 'स्वास्थ्य सारांश',
    'medications_taken_count_summary': 'आज {count} दवा(एं) ली गईं',
    'medications_pending_summary': '{count} दवा(एं) लंबित',
    'no_medications_prescribed_summary': 'कोई दवा निर्धारित नहीं',
    'hydration_status': 'जलयोजन: 6/8 गिलास',
    'breathing_exercise_completed': 'श्वसन व्यायाम पूर्ण',
    'quick_actions': 'त्वरित कार्य',
    'mark_medication_taken': 'दवा ली गई चिह्नित करें',
    'log_water_intake': 'जल की खपत दर्ज करें',
    'start_breathing_exercise': 'श्वसन व्यायाम शुरू करें',
    'view_family_messages': 'पारिवारिक संदेश देखें',
    'todays_tips': 'आज के टिप्स',
    'take_afternoon_medication': 'अपनी दोपहर की दवा भोजन के साथ लें',
    'drink_water': 'हर 2 घंटे में पानी पिएं',
    'practice_deep_breathing': 'तनाव के समय गहरी सांस लें',
    'get_gentle_movement': 'आज कुछ कोमल गतिविधि करें',
    'family_messages': 'पारिवारिक संदेश',
    'how_are_you_feeling': '"आज आप कैसे महसूस कर रहे हैं, पापा?" - प्रिया',
    'dont_forget_vitamins': '"अपने दोपहर के विटामिन मत भूलना!" - रोहन',
    'prescribed_by': 'द्वारा निर्धारित',
    'status_taken': 'लिया गया ✓',
    'status_pending': 'लंबित',
    'status_missed': 'छूट गया',
    
    // Login Page
    'username': 'उपयोगकर्ता नाम',
    'password': 'पासवर्ड',
    'sign_in': 'साइन इन करें',
    'forgot_password': 'पासवर्ड भूल गए?',
    'patient_login': 'रोगी लॉगिन',
    'admin_login': 'स्वास्थ्य सेवा प्रदाता',
    'register_now': 'नया खाता बनाएं',
    'new_user': '👤 नया उपयोगकर्ता?',
    'create_free_account': 'अपना मुफ्त खाता बनाएं ताकि आप अपने स्वास्थ्य और दवाओं का प्रबंधन शुरू कर सकें',
    'choose_your_login_type': 'व्यक्तिगत स्वास्थ्य सेवा प्रबंधन उपकरणों तक पहुंचने के लिए अपना लॉगिन प्रकार चुनें',
    'access_medications_and_features': 'अपनी दवाओं, स्वास्थ्य ट्रैकिंग और कल्याण सुविधाओं तक पहुंच प्राप्त करें',
    'manage_patients_and_analytics': 'रोगियों का प्रबंधन करें, विश्लेषिकी देखें और अनुपालन की निगरानी करें',
    'sign_up_for_new_account': 'शुरू करने के लिए एक नया रोगी खाता बनाएं',
    'what_youll_get_access_to': 'आपको क्या पहुंच प्राप्त होगी:',
    'medication_tracking_feature': 'दवा ट्रैकिंग',
    'family_dashboard_feature': 'पारिवारिक डैशबोर्ड',
    'health_insights_feature': 'स्वास्थ्य अंतर्दृष्टि',
    'ai_recommendations': 'AI अनुशंसाएं',
    'back_to_home': 'होम पर वापस जाएं',
    
    // NonScrollableLogin Page
    'patient_id': 'रोगी आईडी',
    'mobile_number': 'मोबाइल नंबर',
    'full_name': 'पूरा नाम',
    'confirm_password': 'पासवर्ड की पुष्टि करें',
    'enter_your_patient_id': 'अपनी रोगी आईडी दर्ज करें',
    'enter_your_password': 'अपना पासवर्ड दर्ज करें',
    'enter_your_username': 'अपना उपयोगकर्ता नाम दर्ज करें',
    'enter_your_full_name': 'अपना पूरा नाम दर्ज करें',
    'enter_10_digit_mobile': '10 अंकों का मोबाइल नंबर दर्ज करें',
    'generate_unique_id': 'अद्वितीय आईडी उत्पन्न करें',
    'create_strong_password': 'एक मजबूत पासवर्ड बनाएं',
    're_enter_password': 'अपना पासवर्ड पुनः दर्ज करें',
    'please_enter_patient_id': 'कृपया अपनी रोगी आईडी दर्ज करें',
    'please_enter_password': 'कृपया अपना पासवर्ड दर्ज करें',
    'please_enter_username': 'कृपया अपना उपयोगकर्ता नाम दर्ज करें',
    'please_enter_full_name': 'कृपया अपना पूरा नाम दर्ज करें',
    'please_generate_patient_id': 'कृपया एक रोगी आईडी उत्पन्न करें',
    'please_enter_valid_mobile': 'कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें',
    'password_min_length': 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए',
    'passwords_do_not_match': 'पासवर्ड मेल नहीं खाते',
    'invalid_patient_credentials': 'अमान्य रोगी आईडी या पासवर्ड। कृपया अपने क्रेडेंशियल्स की जाँच करें।',
    'invalid_username_or_password': 'अमान्य उपयोगकर्ता नाम या पासवर्ड। कृपया अपने क्रेडेंशियल्स की जाँच करें।',
    'account_created_successfully': 'खाता सफलतापूर्वक बनाया गया! अब आप लॉग इन कर सकते हैं।',
    'patient_id_already_exists': 'यह रोगी आईडी पहले से ही ली गई है। कृपया एक नई उत्पन्न करें।',
    'registration_failed': 'पंजीकरण विफल। कृपया पुनः प्रयास करें।',
    'required_for_notifications': 'AI वॉयस कॉल अनुस्मारक और अधिसूचनाओं के लिए आवश्यक',
    'signing_in': 'साइन इन कर रहे हैं...',
    'access_my_dashboard': 'मेरे डैशबोर्ड तक पहुंच प्राप्त करें',
    'or': 'या',
    'create_new_account': 'नया खाता बनाएं',
    'creating_account': 'खाता बना रहे हैं...',
    'create_account': 'खाता बनाएं',
    'back_to_login': 'लॉगिन पर वापस जाएं',
    'your_unique_patient_id': 'आपकी अद्वितीय रोगी आईडी',
    'save_this_id_for_future': 'यह आईडी आपके लॉगिन के लिए उपयोग की जाएगी। भविष्य के संदर्भ के लिए इसे सहेज लें:',
    'patient_portal': 'रोगी पोर्टल',
    'doctor_portal': 'डॉक्टर पोर्टल',
    'patient': 'रोगी',
    'doctor': 'डॉक्टर',
    'access_patient_management': 'रोगी प्रबंधन तक पहुंच प्राप्त करें',
    
    // Admin Login Page
    'healthcare_provider_portal': 'स्वास्थ्य सेवा प्रदाता पोर्टल',
    'access_admin_dashboard': 'रोगियों का प्रबंधन करने और स्वास्थ्य डेटा की निगरानी करने के लिए प्रशासनिक डैशबोर्ड तक पहुंच प्राप्त करें',
    'sign_in_to_dashboard': 'डैशबोर्ड में साइन इन करें',
    
    // Patient Login Page
    'access_personal_health_dashboard': 'अपने व्यक्तिगत स्वास्थ्य डैशबोर्ड तक पहुंच प्राप्त करें ताकि दवाओं को ट्रैक किया जा सके, प्रगति देखी जा सके और आपकी देखभाल टीम से जुड़ा जा सके',
    'new_to_goldencare': 'गोल्डनकेयर बडी के लिए नए हैं?',
    'create_free_account_description': 'अपना मुफ्त खाता बनाएं ताकि आप अपने स्वास्थ्य और दवाओं का प्रबंधन शुरू कर सकें',
    'what_you_can_do': 'आप अपने पोर्टल में क्या कर सकते हैं:',
    'track_medications': 'दवाओं को ट्रैक करें',
    'view_health_progress': 'स्वास्थ्य प्रगति देखें',
    'get_reminders': 'अनुस्मारक प्राप्त करें',
    'connect_with_family': 'परिवार से जुड़ें',
    
    // Patient Register Page
    'create_your_account': 'अपना खाता बनाएं',
    'join_goldencare_buddy': 'गोल्डनकेयर बडी में शामिल हों ताकि आप अपने स्वास्थ्य और दवाओं का प्रबंधन कर सकें',
    'registration_successful': 'पंजीकरण सफल!',
    'account_created_redirecting': 'आपका खाता बन चुका है। लॉगिन पर पुनः निर्देशित किया जा रहा है...',
    'please_create_patient_id': 'कृपया एक रोगी आईडी बनाएं',
    'patient_id_min_length': 'रोगी आईडी कम से कम 4 अक्षरों की होनी चाहिए',
    'mobile_should_contain_digits': 'मोबाइल नंबर में केवल अंक होने चाहिए',
    'create_patient_id': 'रोगी आईडी बनाएं',
    'create_unique_patient_id': 'एक अद्वितीय रोगी आईडी बनाएं',
    'patient_id_tip': 'यह आपका लॉगिन के लिए उपयोगकर्ता नाम होगा। कुछ याद रखने योग्य चुनें!',
    
    // Common
    'loading': 'लोड हो रहा है...',
    'error_occurred': 'एक त्रुटि हुई',
    'try_again': 'पुनः प्रयास करें',
    'cancel': 'रद्द करें',
    'save': 'सहेजें',
    'delete': 'हटाएं',
    'edit': 'संपादित करें',
    'add': 'जोड़ें',
    'close': 'बंद करें',
    'confirm_language_change': 'भाषा परिवर्तन की पुष्टि करें',
    'language_change_warning': 'अपने डैशबोर्ड में लॉग इन करने के बाद, आप भाषा नहीं बदल सकते। इसे बदलने के लिए आपको लॉग आउट करना होगा और वापस इस पृष्ठ पर आना होगा।',
    'confirm': 'पुष्टि करें',
    'important': 'महत्वपूर्ण',
    
    // Home Page
    'welcome_healthcare_dashboard': '✨ आपके स्वास्थ्य सेवा डैशबोर्ड में आपका स्वागत है',
    'welcome_back_name': 'वापसी पर स्वागत है, {name}!',
    'your_health': 'आपका स्वास्थ्य,',
    'simplified': 'सरलीकृत',
    'healthcare_tools_description': 'एक ही स्थान पर अपने सभी स्वास्थ्य सेवा उपकरणों तक पहुंच प्राप्त करें। दवाओं का प्रबंधन करें, कल्याण को ट्रैक करें और अपनी देखभाल टीम से जुड़े रहें।',
    'manage_medications': '💊 दवाओं का प्रबंधन करें',
    'track_wellness': '🧘 कल्याण को ट्रैक करें',
    'large_text_buttons': 'बड़ा पाठ और बटन',
    'easy_to_read_use': 'पढ़ने और उपयोग करने में आसान',
    'voice_reminders': 'ध्वनि अनुस्मारक',
    'audio_notifications': 'ऑडियो सूचनाएं',
    'progress_tracking': 'प्रगति ट्रैकिंग',
    'visual_health_insights': 'दृश्य स्वास्थ्य अंतर्दृष्टि',
    'hipaa_compliant_home': 'HIPAA अनुपालन',
    'secure_private': 'सुरक्षित और निजी',
    'next_reminder': 'अगला अनुस्मारक',
    'blood_pressure_medication': 'रक्तचाप की दवा',
    'time_today': 'आज {time}',
    'todays_progress_home': 'आज की प्रगति',
    'medications_taken_count': '{taken} में से {total} दवाएं ली गईं',
    'percentage_adherence': '{percentage}% अनुपालन',
    'family_alert': 'पारिवारिक चेतावनी',
    'mom_completed_routine': 'मॉम ने अपना पूरा कर लिया',
    'morning_routine_completed': 'सुबह की दिनचर्या ✓',
    'core_features': 'मुख्य विशेषताएं',
    'everything_for_health_management': 'बेहतर स्वास्थ्य प्रबंधन के लिए आपको जो कुछ भी चाहिए',
    'comprehensive_suite_description': 'हमारा व्यापक उपकरण सूट वरिष्ठ नागरिकों के लिए डिज़ाइन किया गया है, जो प्रत्येक इंटरैक्शन में पहुंच, सरलता और प्रभावशीलता सुनिश्चित करता है।',
    'digital_pillbox_feature': 'डिजिटल पिलबॉक्स',
    'digital_pillbox_description': 'बड़े बटन, स्पष्ट चित्र और सहज इंटरफ़ेस जो वृद्धों के लिए विशेष रूप से डिज़ाइन किए गए हैं।',
    'family_dashboard': 'पारिवारिक डैशबोर्ड',
    'family_dashboard_description': 'दवा अनुपालन और स्वास्थ्य प्रगति की वास्तविक समय में निगरानी जिससे मन की शांति मिलती है।',
    'wellness_tracking': 'कल्याण ट्रैकिंग',
    'wellness_tracking_description': 'जलयोजन, व्यायाम और मनोदशा गतिविधियों के लिए कोमल अनुस्मारक।',
    'ai_health_insights_feature': 'AI स्वास्थ्य अंतर्दृष्टि',
    'ai_health_insights_description': 'स्वास्थ्य जटिलताओं को रोकने के लिए पैटर्न की पहचान करने के लिए पूर्वानुमान विश्लेषण।',
    'explore_feature': '{feature} का अन्वेषण करें',
    'interactive_demo': 'इंटरैक्टिव डेमो',
    'experience_simplicity': 'सरलता का अनुभव करें',
    'intuitive_medication_system': 'हमारे सहज दवा प्रबंधन प्रणाली का प्रयास करें। दैनिक दवाओं को ट्रैक करना कितना आसान है, यह देखने के लिए किसी भी गोली पर क्लिक करें।',
    'morning_medication': 'सुबह की दवा',
    'aspirin_dosage': 'एस्पिरिन 81mg • नाश्ते के साथ',
    'afternoon_vitamins': 'दोपहर के विटामिन',
    'vitamin_d': 'विटामिन D • दोपहर के भोजन के साथ',
    'evening_medication': 'शाम की दवा',
    'sleep_aid': 'नींद की सहायता • सोने से पहले',
    'mark_as_taken': 'लिया हुआ चिह्नित करें',
    'taken_home': 'लिया गया',
    'taken_today': 'आज लिया गया',
    'remaining': 'शेष',
    'todays_medication_progress': 'आज की दवा की प्रगति',
    'continue_your_health_journey_name': '{name}, अपनी स्वास्थ्य यात्रा जारी रखें!',
    'keep_track_of_your_health_progress': 'अपनी स्वास्थ्य प्रगति पर नज़र रखें और अपने कल्याण लक्ष्यों पर कब्जा करें।',
    'view_my_medications': 'मेरी दवाएं देखें',
    'track_my_wellness': 'मेरे कल्याण को ट्रैक करें',
    'ready_to_transform_healthcare': 'क्या आप अपने प्रियजनों के लिए स्वास्थ्य सेवा को बदलने के लिए तैयार हैं?',
    'join_families_description': 'हजारों परिवारों के साथ जुड़ें जो गोल्डनकेयर बडी पर भरोसा करते हैं ताकि वे अपने वरिष्ठ नागरिकों को स्वस्थ, जुड़ा हुआ और स्वतंत्र रख सकें। आज ही अपनी यात्रा शुरू करें।',
    'get_started_free': 'मुफ्त में शुरू करें',
    'learn_more_home': 'और जानें',
    'ai_assistant': 'AI सहायक',
    
    // AI
    'ai_health_assistant': 'AI स्वास्थ्य सहायक',
    'ai_assistant_description': 'मैं यहां आपके स्वास्थ्य के प्रबंधन में मदद करने के लिए हूं व्यक्तिगत अंतर्दृष्टि, दवा अनुस्मारक और कल्याण अनुशंसाओं के साथ। उन्नत AI एल्गोरिदम का उपयोग करके, मैं आपके स्वास्थ्य डेटा का विश्लेषण कर सकता हूं ताकि कार्रवाई योग्य सलाह और समर्थन प्रदान किया जा सके।',
    'ai_assistant_description2': 'चाहे आपको दवाओं के ट्रैकिंग, लक्षणों को समझने या अपनी कल्याण दिनचर्या को अनुकूलित करने में मदद की आवश्यकता हो, मैं 24/7 उपलब्ध हूं साक्ष्य-आधारित मार्गदर्शन प्रदान करने के लिए।',
    'key_features': 'मुख्य विशेषताएं',
    'medication_tracking_ai': 'दवा ट्रैकिंग',
    'medication_tracking_description': 'स्मार्ट अनुस्मारक और अनुपालन ट्रैकिंग के साथ अपनी दवा अनुसूची की निगरानी करें।',
    'health_insights': 'स्वास्थ्य अंतर्दृष्टि',
    'health_insights_description': 'अपने चिकित्सा इतिहास और पैटर्न के आधार पर व्यक्तिगत स्वास्थ्य अनुशंसाएं प्राप्त करें।',
    'wellness_coaching': 'कल्याण कोचिंग',
    'wellness_coaching_description': 'व्यायाम, पोषण और जीवनशैली सुधार पर मार्गदर्शन प्राप्त करें।',
    'emergency_support': 'आपातकालीन समर्थन',
    'emergency_support_description': 'आपातकालीन संपर्कों और चिकित्सा जानकारी तक त्वरित पहुंच जब आपको इसकी आवश्यकता हो।',
    'how_it_works': 'यह कैसे काम करता है',
    'connect_health_data': 'अपने स्वास्थ्य डेटा को कनेक्ट करें',
    'connect_health_data_desc': 'अपने चिकित्सा रिकॉर्ड, दवाओं और पहने जाने वाले उपकरणों को लिंक करें',
    'ai_analysis': 'AI विश्लेषण',
    'ai_analysis_desc': 'हमारे एल्गोरिदम आपके डेटा का विश्लेषण करके पैटर्न और अंतर्दृष्टि की पहचान करते हैं',
    'personalized_recommendations': 'व्यक्तिगत अनुशंसाएं',
    'personalized_recommendations_desc': 'बेहतर स्वास्थ्य परिणामों के लिए व्यक्तिगत सलाह प्राप्त करें',
    'continuous_monitoring': 'निरंतर निगरानी',
    'continuous_monitoring_desc': 'प्रगति को ट्रैक करें और समय के साथ अनुशंसाओं को समायोजित करें',
    'start_ai_consultation': 'AI परामर्श शुरू करें',
    // AI Chatbot
    'ai_chat_assistant_description': 'मैं यहां आपके स्वास्थ्य संबंधी प्रश्नों के उत्तर देने और आपकी स्वास्थ्य देखभाल में मदद करने के लिए हूं।',
    'ai_chat_assistant': 'AI चैट सहायक',
    'ai_welcome_title': 'आपका स्वागत है!',
    'ai_welcome_description': 'मैं आपका वैयक्तिक स्वास्थ्य सहायक हूं। मैं आपकी दवाओं, कल्याण, और स्वास्थ्य संबंधी प्रश्नों के उत्तर दे सकता हूं।',
    'try_asking': 'पूछने का प्रयास करें',
    'ai_sample_question_1': 'मुझे अपनी सुबह की दवा लेने का समय कैसे याद रखना चाहिए?',
    'ai_sample_question_2': 'मैं अपने जलयोजन स्तर को कैसे ट्रैक कर सकता हूं?',
    'ai_sample_question_3': 'आपातकालीन स्थिति में मुझे क्या करना चाहिए?',
    'ai_chat_placeholder': 'अपना स्वास्थ्य संबंधी प्रश्न यहां टाइप करें...',
    'send': 'भेजें',
    'ai_welcome_message': 'नमस्ते! मैं आपका वैयक्तिक स्वास्थ्य सहायक हूं। मैं आपकी दवाओं, कल्याण, और स्वास्थ्य संबंधी प्रश्नों के उत्तर दे सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूँ?',
    'ai_medication_response_1': 'दवा अनुस्मारक सेट करने के लिए, कृपया पिलबॉक्स अनुभाग में जाएं और "दवा जोड़ें" बटन पर क्लिक करें। आप दवा का नाम, खुराक, और समय निर्धारित कर सकते हैं।',
    'ai_medication_response_2': 'अपनी दवा अनुसूची को ट्रैक करने के लिए, प्रतिदिन पिलबॉक्स पृष्ठ पर जाएं। आप यहां देख सकते हैं कि कौन सी दवाएं ली गई हैं और कौन सी बाकी हैं।',
    'ai_medication_response_3': 'यदि आप अपनी दवा लेना भूल जाते हैं, तो कृपया अपने डॉक्टर से संपर्क करें। अधिकांश दवाओं के लिए, यदि आप एक खुराक छूट जाते हैं, तो अगली खुराक के सामान्य समय पर ले लें।',
    'ai_wellness_response_1': 'जलयोजन ट्रैक करने के लिए, कल्याण पृष्ठ पर "गिलास जोड़ें" बटन का उपयोग करें। हमारा लक्ष्य प्रतिदिन 8 गिलास पानी है।',
    'ai_wellness_response_2': 'श्वसन व्यायाम तनाव को कम करने में मदद करता है। कल्याण पृष्ठ पर "श्वसन शुरू करें" बटन पर क्लिक करें और सर्कल एनीमेशन का पालन करें।',
    'ai_wellness_response_3': 'दैनिक व्यायाम आपके स्वास्थ्य के लिए महत्वपूर्ण है। हम कोमल तान, चलना, और संतुलन व्यायाम की अनुशंसा करते हैं।',
    'ai_health_response_1': 'एक संतुलित आहार में फल, सब्जियां, पूर्ण अनाज, लीन प्रोटीन, और स्वस्थ वसा शामिल होनी चाहिए।',
    'ai_health_response_2': 'नियमित व्यायाम से हृदय रोग, मधुमेह, और अन्य स्वास्थ्य समस्याओं का जोखिम कम होता है।',
    'ai_health_response_3': '7-9 घंटे की नींद वयस्कों के लिए आदर्श है। नियमित नींद के समय और एक आरामदायक वातावरण से गुणवत्तापूर्ण नींद मिलती है।',
    'ai_emergency_response_1': 'आपातकालीन स्थिति में, कृपया तुरंत 108 पर कॉल करें या अपने स्थानीय अस्पताल जाएं।',
    'ai_emergency_response_2': 'यदि आपको गंभीर चोट या लक्षण हों, तो कृपया तुरंत चिकित्सा सहायता लें। अपने परिवार के सदस्यों को भी सूचित करें।',
    'ai_default_response_1': 'यह एक महत्वपूर्ण प्रश्न है। मैं आपकी मदद करने के लिए यहां हूं। क्या आप अपने प्रश्न को थोड़ा और विस्तार से बता सकते हैं?',
    'ai_default_response_2': 'मैं आपके प्रश्न को समझ गया हूं। मैं आपकी स्वास्थ्य देखभाल में मदद करने के लिए यहां हूं। क्या आप अपने स्वास्थ्य संबंधी किसी विशेष क्षेत्र के बारे में पूछना चाहेंगे?',
    'ai_default_response_3': 'आपका प्रश्न बहुत अच्छा है। मैं आपकी स्वास्थ्य जानकारी प्रदान करने के लिए यहां हूं। क्या आप अपने स्वास्थ्य के किसी विशेष पहलू के बारे में अधिक जानना चाहेंगे?',
    'ai_default_response_4': 'मैं आपके स्वास्थ्य संबंधी प्रश्नों के उत्तर देने में खुशी महसूस करता हूं। क्या आप अपने स्वास्थ्य के किसी विशेष क्षेत्र के बारे में और जानना चाहेंगे?',
    // Website-specific responses
    'ai_website_info_1': 'गोल्डनकेयर बडी एक व्यापक स्वास्थ्य सेवा मंच है जिसे विशेष रूप से वरिष्ठ नागरिकों और उनके परिवारों के लिए डिज़ाइन किया गया है। मुख्य लक्ष्य वृद्ध व्यक्तियों के लिए स्वास्थ्य देखभाल प्रबंधन को सरल बनाना है जो दवा ट्रैकिंग, कल्याण निगरानी और स्वास्थ्य अंतर्दृष्टि के लिए उपयोग में आसान उपकरण प्रदान करता है।',
    'ai_website_info_2': 'यह वेबसाइट वरिष्ठ नागरिकों को स्वतंत्र रूप से अपनी स्वास्थ्य देखभाल का प्रबंधन करने में मुख्य चुनौतियों को दूर करने के लिए बनाई गई थी। यह प्रौद्योगिकी के माध्यम से रोगियों, परिवारों और स्वास्थ्य सेवा प्रदाताओं के बीच अंतर को पूरा करने में मदद करती है।',
    'ai_website_info_3': 'गोल्डनकेयर बडी वरिष्ठ नागरिकों को उनकी स्वतंत्रता बनाए रखने में मदद करता है जबकि उनकी स्वास्थ्य संबंधी आवश्यकताओं को पूरा करता है। यह बड़े बटन, स्पष्ट पाठ और ध्वनि अनुस्मारक के साथ उपयोगकर्ता के अनुकूल इंटरफ़ेस प्रदान करता है।',
    'ai_how_it_works_1': 'गोल्डनकेयर बडी सरल चरणों में काम करता है: 1) वरिष्ठ नागरिक या उनके परिवार एक खाता बनाते हैं, 2) डॉक्टर मंच के माध्यम से दवाएं निर्धारित करते हैं, 3) प्रणाली दवाओं और कल्याण गतिविधियों के लिए अनुस्मारक भेजती है, 4) परिवार के सदस्य प्रगति की निगरानी कर सकते हैं, 5) AI स्वास्थ्य अंतर्दृष्टि और अनुशंसाएं प्रदान करता है।',
    'ai_how_it_works_2': 'मंच दवा प्रबंधन, कल्याण निगरानी और परिवार संचार को एकीकृत करता है। उपयोगकर्ताओं को दृश्य और ऑडियो अनुस्मारक प्राप्त होते हैं, अपनी स्वास्थ्य प्रगति को ट्रैक करते हैं और अपनी देखभाल टीम से जुड़े रहते हैं।',
    'ai_how_it_works_3': 'पंजीकरण के बाद, उपयोगकर्ता अपनी दवा अनुसूची, कल्याण लक्ष्यों और परिवार संबंधों को स्थापित करते हैं। प्रणाली फिर दैनिक मार्गदर्शन प्रदान करती है और समय के साथ प्रगति को ट्रैक करती है।',
    // Wellness
    'wellness_page': 'कल्याण',
    'wellness_description': 'कोमल अनुस्मारकों और व्यायामों के साथ स्वस्थ रहें।',
    'hydration_tracker': 'जलयोजन ट्रैकर',
    'glasses': 'गिलास',
    'add_glass': 'गिलास जोड़ें',
    'reset': 'रीसेट करें',
    'remaining': 'शेष',
    'goal': 'लक्ष्य',
    'breathing_exercise': 'श्वसन व्यायाम',
    'breathing_ready': 'तैयार',
    'breathing_inhale': 'सांस लें',
    'breathing_hold': 'रोकें',
    'breathing_exhale': 'सांस छोड़ें',
    'breathing_description': 'तनाव को कम करने और आराम करने के लिए गहरी सांस लें। सर्कल एनीमेशन का पालन करें।',
    'start_breathing': 'श्वसन शुरू करें',
    'stop_breathing': 'श्वसन रोकें',
    'daily_exercises': 'दैनिक व्यायाम',
    'gentle_stretching': 'कोमल तान',
    'walking': 'चलना',
    'balance_exercise': 'संतुलन व्यायाम',
    'start': 'शुरू करें',
    'done': 'पूर्ण',
    'mood_tracker': 'मूड ट्रैकर',
    'how_are_you_feeling': 'आज आप कैसे महसूस कर रहे हैं?',
    'mood_selected': 'मूड चयनित',
    'not_recorded': 'दर्ज नहीं किया गया',
    'todays_progress': 'आज की प्रगति',
    'hydration': 'जलयोजन',
    'breathing_exercise': 'श्वसन',
    'exercises': 'व्यायाम',
    'mood': 'मूड',
    'in_progress': 'प्रगति पर है',
    'completed': 'पूर्ण',
    'not_started': 'शुरू नहीं हुआ',
    'wellness_tips': 'कल्याण टिप्स',
    'tip_drink_water': 'दिन भर हर 2 घंटे में पानी पिएं',
    'tip_deep_breaths': 'जब आप तनाव महसूस करें तो 5 गहरी सांस लें',
    'tip_move_gently': 'दिन भर कोमल व्यायामों के साथ कोमल रूप से चलें',
    'tip_listen_body': 'जब आवश्यकता हो तो आराम करने के लिए अपने शरीर को सुनें',
    'tip_consistent_sleep': 'बेहतर स्वास्थ्य के लिए नियमित नींद का अनुसरण करें',
    
    // Pillbox
    'digital_pillbox': 'डिजिटल पिलबॉक्स',
    'manage_medications_description': 'अपनी दवाओं का आसानी से प्रबंधन करें। बड़े बटन, स्पष्ट लेबल और सरल इंटरैक्शन जो वृद्धों के लिए विशेष रूप से डिज़ाइन किए गए हैं।',
    'morning': 'सुबह',
    'afternoon': 'दोपहर',
    'evening': 'शाम',
    'night': 'रात',
    'no_medications_for_slot': '{slot} के लिए कोई दवा नहीं',
    'doctor_will_prescribe': 'आपके डॉक्टर यहां दवाएं निर्धारित करेंगे।',
    'add_first_medication': 'ट्रैकिंग शुरू करने के लिए अपनी पहली दवा जोड़ें।',
    'contact_doctor': 'डॉक्टर से संपर्क करें',
    'enable_notifications': 'सूचनाएं और AI कॉल सक्षम करें',
    'test_notification': 'परीक्षण सूचना',
    'todays_progress_pillbox': 'आज की प्रगति',
    'taken_pillbox': 'लिया गया',
    'total_pillbox': 'कुल',
    'tips_for_success': 'सफलता के लिए टिप्स',
    'medication_info': 'दवा की जानकारी',
    'tip_consistent_times': 'दवाएं समय पर लें',
    'tip_doctor_manages': 'आपके डॉक्टर आपकी दवा सूची का प्रबंधन करते हैं',
    'tip_mark_daily': 'दवाएं दैनिक ली गई के रूप में चिह्नित करें',
    'tip_contact_doctor': 'किसी भी चिंता के लिए अपने डॉक्टर से संपर्क करें',
    'tip_never_skip': 'डॉक्टर से परामर्श किए बिना खुराक न छोड़ें',
    'tip_set_times': 'प्रत्येक दवा के लिए समय निर्धारित करें',
    'tip_keep_bottles': 'दवाओं को मूल बोतलों में रखें',
    'tip_use_app_daily': 'दिनचर्या बनाने के लिए इस ऐप का दैनिक उपयोग करें',
    'tip_ask_family': 'प्रगति की निगरानी में सहायता के लिए परिवार के सदस्यों से पूछें',
    
    // Help Center
    'help_center_page': 'सहायता केंद्र',
    'find_answers_support': 'अपने प्रश्नों के उत्तर खोजें और आवश्यक समर्थन प्राप्त करें',
    'search_help_articles': 'सहायता लेख, पूछे जाने वाले प्रश्न या विषयों की खोज करें...',
    'user_guide_link': 'उपयोगकर्ता मार्गदर्शिका',
    'step_by_step_tutorials': 'चरण-दर-चरण ट्यूटोरियल और कैसे करें मार्गदर्शिका',
    'accessibility_link': 'अभिगम्यता',
    'customize_experience': 'बेहतर पहुंच के लिए अपना अनुभव अनुकूलित करें',
    'system_status_link': 'सिस्टम स्थिति',
    'check_system_health': 'सिस्टम स्वास्थ्य और सेवा स्थिति की जाँच करें',
    'contact_support_link': 'समर्थन से संपर्क करें',
    'get_in_touch': 'हमारी समर्थन टीम से संपर्क करें',
    'frequently_asked_questions': 'अक्सर पूछे जाने वाले प्रश्न',
    'no_results_found': '"{query}" के लिए कोई परिणाम नहीं मिला। अलग-अलग कीवर्ड आज़माएँ या हमारे त्वरित लिंक ब्राउज़ करें।',
    'still_need_help': 'क्या अभी भी सहायता की आवश्यकता है?',
    'support_team_assist': 'हमारी समर्थन टीम 24/7 आपकी सहायता के लिए यहाँ है',
    'email_support': 'ईमेल समर्थन',
    'call_us': 'हमें कॉल करें',
    'how_to_setup_medication_reminders': 'मैं दवा अनुस्मारक कैसे सेट करूँ?',
    'setup_medication_reminders_answer': `दवा अनुस्मारक सेट करने के लिए:
      
1. अपने रोगी डैशबोर्ड में लॉग इन करें
2. \"पिलबॉक्स\" अनुभाग पर नेविगेट करें
3. \"दवा जोड़ें\" बटन पर क्लिक करें
4. दवा विवरण भरें (नाम, खुराक, समय)
5. पूछे जाने पर अधिसूचनाएं सक्षम करें
6. अपनी दवा सहेजें

आपको ब्राउज़र अधिस्मारकों और वैकल्पिक AI वॉयस कॉल के माध्यम से निर्धारित समय पर अनुस्मारक प्राप्त होंगे।`,
    'what_are_ai_voice_call_reminders': 'AI वॉयस कॉल अनुस्मारक क्या हैं?',
    'ai_voice_call_reminders_answer': `AI वॉयस कॉल अनुस्मारक स्वचालित फोन कॉल हैं जो आपको अपनी दवा लेने की याद दिलाते हैं। जब सक्षम हो:

• आपको निर्धारित समय पर एक फोन कॉल प्राप्त होगी
• एक AI सहायक आपको आपकी दवा के बारे में सूचित करेगा
• आप 1 दबाकर पुष्टि कर सकते हैं कि आपने इसे ले लिया है
• सभी कॉल आपके रिकॉर्ड के लिए लॉग की जाती हैं

इस सुविधा के लिए एक मान्य मोबाइल नंबर और बैकएंड सेवा कॉन्फ़िगरेशन की आवश्यकता होती है।`,
    'how_to_track_wellness_progress': 'मैं अपनी कल्याण प्रगति कैसे ट्रैक करूँ?',
    'track_wellness_progress_answer': `कल्याण अनुभाग व्यापक स्वास्थ्य ट्रैकिंग प्रदान करता है:

• अपनी दैनिक दवा अनुपालन दर देखें
• समय के साथ मूड और लक्षणों को ट्रैक करें
• महत्वपूर्ण संकेतों और स्वास्थ्य मेट्रिक्स की निगरानी करें
• स्वास्थ्य सेवा प्रदाताओं के लिए रिपोर्ट उत्पन्न करें
• स्वास्थ्य लक्ष्य निर्धारित करें और प्रगति को ट्रैक करें

सभी डेटा सुरक्षित रूप से संग्रहीत किया जाता है और केवल आप और अधिकृत स्वास्थ्य सेवा प्रदाताओं द्वारा पहुंच योग्य है।`,
    'can_family_access_health_info': 'क्या परिवार के सदस्य मेरी स्वास्थ्य जानकारी तक पहुंच सकते हैं?',
    'family_access_health_info_answer': `हाँ, आपकी अनुमति के साथ:

1. अपने डैशबोर्ड में \"परिवार\" अनुभाग पर जाएँ
2. ईमेल के माध्यम से परिवार के सदस्यों को आमंत्रित करें
3. उनकी पहुंच अनुमतियाँ निर्धारित करें (केवल देखें, अलर्ट प्राप्त करें, आदि)
4. उन्हें अपना खाता बनाने के लिए आमंत्रण प्राप्त होगा
5. आप किसी भी समय पहुंच रद्द कर सकते हैं

परिवार के सदस्य आपकी दवा अनुसूची देख सकते हैं और यदि आप खुराक छूट जाते हैं तो अलर्ट प्राप्त कर सकते हैं।`,
    'is_my_health_data_secure': 'क्या मेरा स्वास्थ्य डेटा सुरक्षित है?',
    'health_data_security_answer': `निश्चित रूप से। हम सुरक्षा को गंभीरता से लेते हैं:

• सभी डेटा परिवहन और आराम के समय एन्क्रिप्ट किया जाता है
• HIPAA-अनुपालन डेटा संग्रहण
• नियमित सुरक्षा ऑडिट
• दो-कारक प्रमाणीकरण उपलब्ध
• आप नियंत्रित करते हैं कि कौन आपके डेटा तक पहुंच सकता है
• सुरक्षा के लिए स्वचालित सत्र समय समाप्ति

आपकी गोपनीयता हमारी सर्वोच्च प्राथमिकता है।`,
    'how_to_change_notification_settings': 'मैं अपनी अधिसूचना सेटिंग्स कैसे बदलूँ?',
    'change_notification_settings_answer': `अधिस्मारकों को अनुकूलित करने के लिए:

1. सेटिंग्स पर जाएँ (शीर्ष दाएँ मेनू)
2. \"अधिस्मारक वरीयताएँ\" चुनें
3. अधिस्मारक विधियाँ चुनें (ब्राउज़र, SMS, वॉयस कॉल)
4. यदि आवश्यक हो तो शांत घंटे निर्धारित करें
5. अनुस्मारक आवृत्ति अनुकूलित करें
6. अपनी वरीयताएँ सहेजें

आप किसी भी समय इन सेटिंग्स को समायोजित कर सकते हैं।`,
    'what_if_i_forget_password': 'अगर मैं अपना पासवर्ड भूल जाऊँ तो क्या?',
    'forgot_password_answer': `अपना पासवर्ड रीसेट करने के लिए:

1. लॉगिन पृष्ठ पर \"पासवर्ड भूल गए\" पर क्लिक करें
2. अपना पंजीकृत ईमेल या रोगी आईडी दर्ज करें
3. रीसेट लिंक के लिए अपना ईमेल जाँचें
4. लिंक का पालन करें और एक नया पासवर्ड बनाएँ
5. अपने नए क्रेडेंशियल्स के साथ लॉग इन करें

सुरक्षा के लिए, रीसेट लिंक 24 घंटे के बाद समाप्त हो जाते हैं।`,
    'how_to_contact_healthcare_provider': 'मैं अपने स्वास्थ्य सेवा प्रदाता से कैसे संपर्क करूँ?',
    'contact_healthcare_provider_answer': `आप अपने स्वास्थ्य सेवा प्रदाता तक निम्नलिखित माध्यम से पहुंच सकते हैं:

• अपने डैशबोर्ड में \"संदेश\" अनुभाग
• आपातकालीन संपर्क बटन (तत्काल मामलों के लिए)
• अनुसूचित वीडियो परामर्श
• खाते में सूचीबद्ध फोन नंबर

चिकित्सा आपातकाल के लिए, हमेशा अपने स्थानीय आपातकालीन नंबर पर कॉल करें।`,
    
    // User Guide
    'user_guide': 'उपयोगकर्ता मार्गदर्शिका',
    'complete_step_by_step_tutorials': 'गोल्डनकेयर बडी का अधिकतम लाभ उठाने में आपकी सहायता के लिए पूर्ण चरण-दर-चरण ट्यूटोरियल',
    'getting_started': 'आरंभ करना',
    'managing_medications': 'दवाओं का प्रबंधन',
    'setting_up_reminders': 'अनुस्मारक सेट करना',
    'ai_voice_calls': 'AI वॉयस कॉल',
    'wellness_tracking_guide': 'कल्याण ट्रैकिंग',
    'family_features': 'पारिवारिक सुविधाएं',
    'create_your_account_guide': 'अपना खाता बनाएं',
    'to_begin_using_goldencare': 'गोल्डनकेयर बडी का उपयोग शुरू करने के लिए, आपको एक खाता बनाना होगा:',
    'visit_homepage_and_click': 'होमपेज पर जाएं और \"शुरू करें\" या \"लॉगिन\" पर क्लिक करें',
    'choose_patient_login_guide': 'रोगी पोर्टल तक पहुंचने के लिए \"रोगी लॉगिन\" चुनें',
    'for_demo_purposes_use': 'डेमो उद्देश्यों के लिए, प्रदान किए गए क्रेडेंशियल का उपयोग करें:',
    'patient_id_code_patient': 'रोगी आईडी: रोगी',
    'password_code_patient123': 'पासवर्ड: रोगी123',
    'mobile_code_9876543210': 'मोबाइल: 9876543210',
    'click_access_my_dashboard_guide': 'लॉग इन करने के लिए \"मेरे डैशबोर्ड तक पहुंचें\" पर क्लिक करें',
    'tip_guide': 'टिप:',
    'make_sure_to_enable_browser': 'पूछे जाने पर ब्राउज़र अधिस्मारकों सक्षम करना सुनिश्चित करें। यह आपको दवा अनुस्मारक प्राप्त करने की अनुमति देता है, भले ही आप सक्रिय रूप से ऐप का उपयोग न कर रहे हों।',
    'explore_your_dashboard': 'अपने डैशबोर्ड का अन्वेषण करें',
    'after_logging_in_youll_see': 'लॉग इन करने के बाद, आप अपने व्यक्तिगत डैशबोर्ड को देखेंगे:',
    'quick_stats': 'त्वरित आँकड़े:',
    'overview_of_your_medications': 'आपकी दवाओं और कल्याण का अवलोकन',
    'todays_medications_guide': 'आज की दवाएं:',
    'list_of_meds_to_take_today': 'आज लेने के लिए दवाओं की सूची',
    'upcoming_reminders': 'आगामी अनुस्मारक:',
    'schedule_of_medication_times': 'दवा समय की अनुसूची',
    'recent_activity': 'हाल की गतिविधि:',
    'your_medication_history': 'आपका दवा इतिहास',
    'dashboard_screenshot': 'डैशबोर्ड स्क्रीनशॉट - दवा अवलोकन, आज की अनुसूची और स्वास्थ्य आँकड़े दिखाता है',
    'navigate_the_menu': 'मेनू का नेविगेट करें',
    'use_the_navigation_menu': 'विभिन्न सुविधाओं तक पहुंचने के लिए नेविगेशन मेनू का उपयोग करें:',
    'home_guide': 'होम:',
    'your_main_dashboard': 'आपका मुख्य डैशबोर्ड',
    'pillbox_guide': 'पिलबॉक्स:',
    'manage_your_medications_guide': 'अपनी दवाओं का प्रबंधन करें',
    'family_guide': 'परिवार:',
    'connect_with_family_members_guide': 'परिवार के सदस्यों से जुड़ें',
    'wellness_guide': 'कल्याण:',
    'track_your_health_progress_guide': 'अपनी स्वास्थ्य प्रगति को ट्रैक करें',
    'ai_guide': 'AI:',
    'ai_voice_call_settings': 'AI वॉयस कॉल सेटिंग्स',
    'add_a_new_medication': 'एक नई दवा जोड़ें',
    'adding_medications_is_simple': 'दवाएं जोड़ना सरल और त्वरित है:',
    'navigate_to_the_pillbox_page': 'पिलबॉक्स पृष्ठ पर नेविगेट करें',
    'click_the_add_medication_button': '\"दवा जोड़ें\" बटन पर क्लिक करें',
    'fill_in_the_medication_details': 'दवा विवरण भरें:',
    'medication_name': 'दवा का नाम (उदाहरण के लिए, \"एस्पिरिन\")',
    'dosage': 'खुराक (उदाहरण के लिए, \"100mg\")',
    'time_slot': 'समय स्लॉट (सुबह, दोपहर, शाम, रात)',
    'frequency': 'आवृत्ति (एक बार दैनिक, दो बार दैनिक, आदि)',
    'special_notes_or_instructions': 'विशेष नोट या निर्देश',
    'click_add_medication_to_save': 'सहेजने के लिए \"दवा जोड़ें\" पर क्लिक करें',
    'pro_tip': 'प्रो टिप:',
    'add_all_your_medications': 'एक पूर्ण दैनिक अनुसूची के लिए एक बार में अपनी सभी दवाएं जोड़ें। आप हमेशा उन्हें संपादित या हटा सकते हैं।',
    'mark_medications_as_taken': 'दवाओं को लिया हुआ चिह्नित करें',
    'track_your_medication_adherence': 'अपनी दवा अनुपालन को आसानी से ट्रैक करें:',
    'find_your_medication_in_the_list': 'सूची में अपनी दवा ढूंढें',
    'click_the_mark_as_taken_button': '\"लिया हुआ चिह्नित करें\" बटन पर क्लिक करें',
    'the_medication_status_updates': 'दवा की स्थिति \"लिया गया\" में अपडेट हो जाती है',
    'your_adherence_statistics': 'आपके अनुपालन आँकड़े स्वचालित रूप से अपडेट हो जाते हैं',
    'important_guide': 'महत्वपूर्ण:',
    'you_can_only_mark_a_medication': 'आप एक दिन में केवल एक बार दवा को लिया हुआ चिह्नित कर सकते हैं। यह आपकी दवा अनुसूची के सटीक ट्रैकिंग को सुनिश्चित करता है।',
    'edit_or_remove_medications': 'दवाओं को संपादित या हटाएं',
    'keep_your_medication_list': 'अपनी दवा सूची को अप-टू-डेट रखें:',
    'to_edit': 'संपादित करने के लिए:',
    'click_the_edit_icon': 'किसी भी दवा के बगल में संपादन आइकन पर क्लिक करें, परिवर्तन करें और सहेजें',
    'to_remove': 'हटाने के लिए:',
    'click_the_delete_icon': 'हटाएं आइकन पर क्लिक करें और हटाने की पुष्टि करें',
    'to_reorder': 'पुनः क्रमित करने के लिए:',
    'medications_are_automatically_sorted': 'दवाएं स्वचालित रूप से समय के अनुसार क्रमित हो जाती हैं',
    'enable_browser_notifications': 'ब्राउज़र अधिस्मारकों सक्षम करें',
    'browser_notifications_allow_you': 'ब्राउज़र अधिस्मारकों आपको दवा अनुस्मारक प्राप्त करने की अनुमति देती हैं, भले ही आप सक्रिय रूप से ऐप का उपयोग न कर रहे हों:',
    'when_prompted_click_allow': 'पूछे जाने पर, अधिस्मारकों सक्षम करने के लिए \"अनुमति दें\" पर क्लिक करें',
    'you_can_change_this_later': 'आप इसे बाद में अपनी ब्राउज़र सेटिंग्स में बदल सकते हैं',
    'check_your_notification_settings': 'यह सुनिश्चित करने के लिए कि वे ठीक से कॉन्फ़िगर हैं, ऐप में अपनी अधिस्मारक सेटिंग्स की जाँच करें',
    'notifications_work_best': 'अधिस्मारकों अधिकतम विश्वसनीयता के लिए AI वॉयस कॉल के साथ संयोजन में सबसे अच्छी काम करती हैं।',
    'customize_reminder_settings': 'अनुस्मारक सेटिंग्स अनुकूलित करें',
    'personalize_your_reminder_preferences': 'अपनी अनुस्मारक वरीयताओं को व्यक्तिगत रूप से अनुकूलित करें:',
    'go_to_settings': 'सेटिंग्स पर जाएँ (शीर्ष दाएँ मेनू)',
    'select_notification_preferences': '\"अधिस्मारक वरीयताएँ\" चुनें',
    'choose_notification_methods': 'अधिस्मारक विधियाँ चुनें (ब्राउज़र, SMS, वॉयस कॉल)',
    'set_quiet_hours': 'यदि आवश्यक हो तो शांत घंटे निर्धारित करें',
    'save_your_preferences': 'अपनी वरीयताएँ सहेजें',
    'set_up_your_mobile_number': 'अपना मोबाइल नंबर सेट करें',
    'ai_voice_calls_require_a_valid': 'AI वॉयस कॉल के लिए एक मान्य मोबाइल नंबर की आवश्यकता होती है:',
    'navigate_to_the_ai_page': 'AI पृष्ठ पर नेविगेट करें',
    'click_manage_phone_numbers': '\"फोन नंबर प्रबंधित करें\" पर क्लिक करें',
    'enter_your_mobile_number': 'अपना मोबाइल नंबर दर्ज करें',
    'click_verify_to_receive': 'SMS के माध्यम से एक सत्यापन कोड प्राप्त करने के लिए \"सत्यापित करें\" पर क्लिक करें',
    'enter_the_verification_code': 'आपको प्राप्त हुआ सत्यापन कोड दर्ज करें',
    'click_save_phone_number': '\"फोन नंबर सहेजें\" पर क्लिक करें',
    'configure_call_preferences': 'कॉल वरीयताएँ कॉन्फ़िगर करें',
    'customize_when_and_how': 'अनुकूलित करें कि आप AI कॉल कब और कैसे प्राप्त करते हैं:',
    'set_call_times': 'विभिन्न दवा स्लॉट के लिए कॉल समय निर्धारित करें',
    'choose_call_language': 'कॉल भाषा चुनें (अंग्रेजी या हिंदी)',
    'select_call_reminders': 'चयन करें कि कौन से अनुस्मारक कॉल को ट्रिगर करते हैं',
    'enable_missed_dose_alerts': 'परिवार के सदस्यों के लिए छूटी हुई खुराक अलर्ट सक्षम करें',
    'test_your_ai_voice_call': 'अपने AI वॉयस कॉल का परीक्षण करें',
    'test_the_feature_before_relying': 'इस पर निर्भर करने से पहले सुविधा का परीक्षण करें:',
    'go_to_the_ai_page_guide': 'AI पृष्ठ पर जाएँ',
    'click_test_call_now_button': '\"अभी परीक्षण कॉल करें\" बटन पर क्लिक करें',
    'you_should_receive_a_test_call': 'आपको तुरंत एक परीक्षण कॉल प्राप्त होना चाहिए',
    'follow_the_voice_instructions': 'पुष्टि करने के लिए वॉयस निर्देशों का पालन करें',
    'monitor_how_well_youre_following': 'निगरानी करें कि आप अपनी दवा अनुसूची का पालन कैसे कर रहे हैं:',
    'view_daily_adherence_percentage': 'दैनिक अनुपालन प्रतिशत देखें',
    'see_weekly_and_monthly_trends': 'साप्ताहिक और मासिक प्रवृत्तियाँ देखें',
    'identify_patterns_and_missed_doses': 'पैटर्न और छूटी हुई खुराक की पहचान करें',
    'generate_reports_for_your_doctor': 'अपने डॉक्टर के लिए रिपोर्ट उत्पन्न करें',
    'wellness_dashboard': 'कल्याण डैशबोर्ड - अनुपालन चार्ट, स्वास्थ्य मेट्रिक्स और प्रगति ट्रैकिंग दिखाता है',
    'log_health_metrics': 'स्वास्थ्य मेट्रिक्स लॉग करें',
    'keep_track_of_important_health': 'महत्वपूर्ण स्वास्थ्य संकेतों पर नज़र रखें:',
    'blood_pressure_readings': 'रक्तचाप पठन',
    'blood_sugar_levels': 'रक्त शर्करा स्तर',
    'weight_and_bmi': 'वजन और BMI',
    'mood_and_symptoms': 'मूड और लक्षण',
    'family_connection_guide': 'पारिवारिक संबंध',
    'keep_your_loved_ones_informed_guide': 'अपने प्रियजनों को सूचित और शामिल रखें:',
    'go_to_the_family_page': 'परिवार पृष्ठ पर जाएँ',
    'click_invite_family_member': '\"परिवार के सदस्य को आमंत्रित करें\" पर क्लिक करें',
    'enter_their_email_address': 'उनका ईमेल पता दर्ज करें',
    'set_their_access_permissions': 'उनकी पहुंच अनुमतियाँ निर्धारित करें',
    'theyll_receive_an_invitation_email': 'उन्हें एक आमंत्रण ईमेल प्राप्त होगा',
    'family_members_can_receive_alerts': 'परिवार के सदस्य आपके द्वारा दवाएं छूट जाने पर अलर्ट प्राप्त कर सकते हैं, जो एक अतिरिक्त सुरक्षा जाल प्रदान करता है।',
    'manage_privacy_settings': 'गोपनीयता सेटिंग्स प्रबंधित करें',
    'youre_always_in_control': 'आप हमेशा अपने डेटा पर नियंत्रण रखते हैं:',
    'choose_what_information_family': 'चयन करें कि परिवार कौन सी जानकारी देख सकता है',
    'set_who_receives_alerts': 'निर्धारित करें कि अलर्ट और अधिस्मारकों कौन प्राप्त करता है',
    'revoke_access_at_any_time': 'किसी भी समय पहुंच रद्द करें',
    'view_audit_logs': 'ऑडिट लॉग देखें कि किसने आपके डेटा तक पहुंचा',
    
    // Accessibility
    'accessibility_settings': 'पहुंच सेटिंग्स',
    'customize_your_experience': 'अपनी पहुंच आवश्यकताओं को पूरा करने के लिए अपना अनुभव अनुकूलित करें',
    'dark_mode': 'डार्क मोड',
    'high_contrast': 'उच्च कंट्रास्ट',
    'large_text': 'बड़ा पाठ',
    'reduce_motion': 'गति कम करें',
    'visual_adjustments': 'दृश्य समायोजन',
    'font_size': 'फ़ॉन्ट आकार',
    'adjust_text_size': 'अनुप्रयोग भर में पाठ के आकार को समायोजित करें',
    'color_theme': 'रंग थीम',
    'choose_color_scheme': 'एक रंग योजना चुनें जो आपके लिए सबसे अच्छी काम करती है',
    'default_theme': 'डिफ़ॉल्ट थीम',
    'dark_theme': 'डार्क थीम',
    'sepia_theme': 'सेपिया थीम',
    'blue_theme': 'नीली थीम',
    'navigation_preferences': 'नेविगेशन वरीयताएँ',
    'keyboard_navigation': 'कीबोर्ड नेविगेशन',
    'enable_keyboard_shortcuts': 'कीबोर्ड शॉर्टकट और फोकस संकेतक सक्षम करें',
    'screen_reader': 'स्क्रीन रीडर',
    'optimize_for_screen_readers': 'स्क्रीन रीडर्स के लिए इंटरफ़ेस को अनुकूलित करें',
    'audio_voice': 'ऑडियो और वॉयस',
    'voice_guidance': 'वॉयस मार्गदर्शन',
    'enable_voice_instructions': 'वॉयस निर्देश और ऑडियो प्रतिक्रिया सक्षम करें',
    'preview': 'पूर्वावलोकन',
    'sample_text': 'नमूना पाठ',
    'this_is_sample_text': 'अपनी सेटिंग्स का पूर्वावलोकन करने के लिए यह एक नमूना पाठ है',
    'primary_button': 'प्राथमिक बटन',
    'active_button': 'सक्रिय बटन',
    'save_settings': 'सेटिंग्स सहेजें',
    'settings_saved_successfully': 'सेटिंग्स सफलतापूर्वक सहेजी गईं!',
    
    // System Status
    'system_status': 'सिस्टम स्थिति',
    'real_time_system_monitoring': 'सभी सिस्टम सेवाओं और प्रदर्शन मेट्रिक्स की वास्तविक समय निगरानी',
    'all_systems_operational': 'सभी प्रणालियाँ कार्यरत',
    'degraded_performance': 'कमजोर प्रदर्शन',
    'system_outage': 'सिस्टम बाहर',
    'all_services_running_normally': 'सभी सेवाएं सामान्य रूप से चल रही हैं',
    'some_services_experiencing_issues': 'कुछ सेवाएं समस्याओं का अनुभव कर रही हैं',
    'services_currently_unavailable': 'सेवाएं वर्तमान में अनुपलब्ध हैं',
    'last_updated': 'अंतिम अपडेट',
    'operational': 'कार्यरत',
    'degraded_status': 'कमजोर',
    'down': 'बंद',
    'uptime': 'अपटाइम',
    'response_time': 'प्रतिक्रिया समय',
    'scheduled_jobs': 'अनुसूचित नौकरियां',
    'notifications_delivered': 'अधिस्मारकों प्रदान की गईं',
    'performance_metrics': 'प्रदर्शन मेट्रिक्स',
    'requests': 'अनुरोध',
    'avg_response_time': 'औसत प्रतिक्रिया समय',
    'active_users': 'सक्रिय उपयोगकर्ता',
    'incident_history': 'घटना इतिहास',
    'no_recent_incidents': 'कोई हाल की घटनाओं की रिपोर्ट नहीं',
    'refreshing': 'ताज़ा कर रहा है...',
    'refresh_status': 'स्थिति ताज़ा करें'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('gc_language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // Save language preference to localStorage
  const changeLanguage = (newLanguage) => {
    if (newLanguage !== 'en' && newLanguage !== 'hi') {
      console.warn('Unsupported language:', newLanguage);
      return;
    }
    
    setLanguage(newLanguage);
    localStorage.setItem('gc_language', newLanguage);
    
    // Dispatch custom event to notify other components
    const event = new CustomEvent('languageChanged', { detail: newLanguage });
    window.dispatchEvent(event);
    
    // Dispatch storage event to notify other tabs/components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'gc_language',
      oldValue: language,
      newValue: newLanguage
    }));
  };
  
  // Listen for storage changes from other tabs/components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gc_language') {
        const newLanguage = e.newValue || 'en';
        if (newLanguage === 'en' || newLanguage === 'hi') {
          setLanguage(newLanguage);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Listen for custom language change events (both languageChanged and globalLanguageChange)
  useEffect(() => {
    const handleLanguageChange = (e) => {
      if (e.detail && (e.detail === 'en' || e.detail === 'hi')) {
        setLanguage(e.detail);
      }
    };
    
    // Listen for both event types
    window.addEventListener('languageChanged', handleLanguageChange);
    window.addEventListener('globalLanguageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      window.removeEventListener('globalLanguageChange', handleLanguageChange);
    };
  }, []);
  
  // Enhanced translate function with fallback and error handling
  const t = useMemo(() => {
    return (key, params = {}) => {
      // Validate inputs
      if (!key) return '';
      
      // Get translation
      let translation = translations[language]?.[key];
      
      // Fallback to English if translation not found
      if (!translation) {
        translation = translations['en']?.[key] || key;
        if (language !== 'en') {
          console.warn(`Missing translation for key '${key}' in language '${language}'`);
        }
      }
      
      // Replace parameters in the translation
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
      
      return translation;
    };
  }, [language]);
  
  // Get direction based on language
  const getDirection = useMemo(() => {
    return () => {
      return language === 'hi' ? 'rtl' : 'ltr';
    };
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, getDirection }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export translations for debugging purposes
export { translations };

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};