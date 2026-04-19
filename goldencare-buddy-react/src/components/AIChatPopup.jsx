import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const ChatPopupContainer = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: calc(100% - 40px);
    height: 70vh;
    bottom: 20px;
    right: 20px;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 15px;
  background: ${props => props.theme.colors.primary};
  color: white;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-content {
      background: ${props => props.theme.colors.primary};
      color: white;
      border-radius: 16px 4px 16px 16px;
    }
  }
  
  &.ai {
    .message-content {
      background: ${props => props.theme.colors.bg};
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 4px 16px 16px 16px;
    }
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.9rem;
  
  &.user {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
  
  &.ai {
    background: ${props => props.theme.colors.accent};
    color: white;
  }
`;

const MessageContent = styled.div`
  padding: 10px 12px;
  max-width: 80%;
  line-height: 1.4;
  font-size: 0.9rem;
  
  p {
    margin: 0;
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 15px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.card};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 0.9rem;
  font-family: inherit;
  background: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 10px 15px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #2d7bb8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px 16px 16px 16px;
  width: fit-content;
  
  .dot {
    width: 6px;
    height: 6px;
    background: ${props => props.theme.colors.muted};
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
  
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-3px); }
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 20px 10px;
  color: ${props => props.theme.colors.muted};
  font-size: 0.9rem;
  
  h4 {
    margin-bottom: 10px;
    color: ${props => props.theme.colors.text};
    font-size: 1rem;
  }
  
  ul {
    text-align: left;
    padding-left: 20px;
    margin: 10px 0;
  }
  
  li {
    margin-bottom: 5px;
  }
`;

const AIChatPopup = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message when popup opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'ai',
          text: t('ai_welcome_message'),
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, t, messages.length]);

  // Knowledge base for the AI assistant
  const knowledgeBase = {
    // Website information
    website: [
      {
        keywords: ['website', 'what is this', 'purpose', 'main goal', 'created', 'why'],
        responses: [
          t('ai_website_info_1'),
          t('ai_website_info_2'),
          t('ai_website_info_3')
        ]
      }
    ],
    
    // How it works
    howItWorks: [
      {
        keywords: ['how', 'work', 'function', 'use', 'steps', 'process'],
        responses: [
          t('ai_how_it_works_1'),
          t('ai_how_it_works_2'),
          t('ai_how_it_works_3')
        ]
      }
    ],
    
    // Who it helps
    whoItHelps: [
      {
        keywords: ['who', 'help', 'benefit', 'target', 'audience', 'people'],
        responses: [
          t('ai_who_it_helps_1'),
          t('ai_who_it_helps_2'),
          t('ai_who_it_helps_3')
        ]
      }
    ],
    
    // Features
    features: [
      {
        keywords: ['feature', 'tools', 'what can', 'capabilities', 'functions'],
        responses: [
          t('ai_features_1'),
          t('ai_features_2'),
          t('ai_features_3')
        ]
      }
    ],
    
    // Benefits
    benefits: [
      {
        keywords: ['benefit', 'advantage', 'improve', 'help with', 'value'],
        responses: [
          t('ai_benefits_1'),
          t('ai_benefits_2'),
          t('ai_benefits_3')
        ]
      }
    ],
    
    // Medication related questions
    medication: [
      {
        keywords: ['medication', 'medicine', 'pill', 'drug', 'take', 'reminder'],
        responses: [
          t('ai_medication_response_1'),
          t('ai_medication_response_2'),
          t('ai_medication_response_3')
        ]
      }
    ],
    
    // Wellness related questions
    wellness: [
      {
        keywords: ['wellness', 'exercise', 'water', 'hydration', 'breathing', 'stretch'],
        responses: [
          t('ai_wellness_response_1'),
          t('ai_wellness_response_2'),
          t('ai_wellness_response_3')
        ]
      }
    ],
    
    // General health questions
    health: [
      {
        keywords: ['health', 'healthy', 'diet', 'nutrition', 'sleep', 'food'],
        responses: [
          t('ai_health_response_1'),
          t('ai_health_response_2'),
          t('ai_health_response_3')
        ]
      }
    ],
    
    // Emergency questions
    emergency: [
      {
        keywords: ['emergency', 'urgent', 'help', 'immediate', '911', 'hospital'],
        responses: [
          t('ai_emergency_response_1'),
          t('ai_emergency_response_2')
        ]
      }
    ],
    
    // Default responses
    default: [
      t('ai_default_response_1'),
      t('ai_default_response_2'),
      t('ai_default_response_3'),
      t('ai_default_response_4')
    ]
  };

  // Function to find relevant response based on user input
  const findResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for specific keywords in knowledge base
    for (const category in knowledgeBase) {
      if (category === 'default') continue;
      
      for (const item of knowledgeBase[category]) {
        if (item.keywords.some(keyword => lowerInput.includes(keyword))) {
          const randomResponse = item.responses[Math.floor(Math.random() * item.responses.length)];
          return randomResponse;
        }
      }
    }
    
    // Return default response if no specific match found
    const randomDefault = knowledgeBase.default[Math.floor(Math.random() * knowledgeBase.default.length)];
    return randomDefault;
  };

  // Simulate AI thinking time
  const simulateAIResponse = async (userMessage) => {
    setIsLoading(true);
    
    // Simulate thinking time (1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const aiResponse = findResponse(userMessage);
    
    setIsLoading(false);
    return aiResponse;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = inputValue;
    setInputValue('');

    // Get AI response
    const aiResponse = await simulateAIResponse(userQuery);

    // Add AI message
    const aiMessage = {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <ChatPopupContainer>
      <ChatHeader>
        <h3>🤖 {t('ai_chat_assistant')}</h3>
        <button onClick={onClose} title={t('close')}>
          ×
        </button>
      </ChatHeader>
      
      <ChatMessages>
        {messages.length === 1 ? (
          <WelcomeMessage>
            <h4>👋 {t('ai_welcome_title')}</h4>
            <p>{t('ai_welcome_description')}</p>
            <div style={{ marginTop: '10px' }}>
              <p><strong>{t('try_asking')}:</strong></p>
              <ul>
                <li>{t('ai_sample_question_1')}</li>
                <li>{t('ai_sample_question_2')}</li>
                <li>{t('ai_sample_question_3')}</li>
              </ul>
            </div>
          </WelcomeMessage>
        ) : (
          messages.map((message) => (
            <Message key={message.id} className={message.sender}>
              <Avatar className={message.sender}>
                {message.sender === 'user' ? '👤' : '🤖'}
              </Avatar>
              <MessageContent className="message-content">
                <p>{message.text}</p>
              </MessageContent>
            </Message>
          ))
        )}
        
        {isLoading && (
          <Message className="ai">
            <Avatar className="ai">🤖</Avatar>
            <TypingIndicator>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </TypingIndicator>
          </Message>
        )}
        
        <div ref={messagesEndRef} />
      </ChatMessages>
      
      <ChatInputContainer>
        <ChatInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('ai_chat_placeholder')}
          disabled={isLoading}
        />
        <SendButton 
          onClick={handleSendMessage} 
          disabled={!inputValue.trim() || isLoading}
        >
          {t('send')}
        </SendButton>
      </ChatInputContainer>
    </ChatPopupContainer>
  );
};

export default AIChatPopup;