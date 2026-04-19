import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext.jsx';

const AISection = styled.section`
  padding: 40px 0;
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}10 50%, 
    ${props => props.theme.colors.accentLight}10 100%
  );
`;

const ChatContainer = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  height: 70vh;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    color: ${props => props.theme.colors.text};
    margin: 0;
    font-size: 1.5rem;
  }
  
  .ai-icon {
    font-size: 2rem;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div`
  display: flex;
  gap: 15px;
  align-items: flex-start;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-content {
      background: ${props => props.theme.colors.primary};
      color: white;
      border-radius: 18px 4px 18px 18px;
    }
  }
  
  &.ai {
    .message-content {
      background: ${props => props.theme.colors.bg};
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 4px 18px 18px 18px;
    }
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
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
  padding: 12px 16px;
  max-width: 80%;
  line-height: 1.5;
  
  p {
    margin: 0;
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 1rem;
  font-family: inherit;
  background: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 12px 20px;
  font-size: 1rem;
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
  gap: 5px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px 18px 18px 18px;
  width: fit-content;
  
  .dot {
    width: 8px;
    height: 8px;
    background: ${props => props.theme.colors.muted};
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
  
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.colors.muted};
  
  h3 {
    margin-bottom: 15px;
    color: ${props => props.theme.colors.text};
  }
`;

const AI = () => {
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

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: t('ai_welcome_message'),
        timestamp: new Date()
      }
    ]);
  }, [t]);

  // Knowledge base for the AI assistant
  const knowledgeBase = {
    // Medication related questions
    medication: [
      {
        keywords: ['medication', 'medicine', 'pill', 'drug'],
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
        keywords: ['wellness', 'exercise', 'water', 'hydration', 'breathing'],
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
        keywords: ['health', 'healthy', 'diet', 'nutrition'],
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
        keywords: ['emergency', 'urgent', 'help', 'immediate'],
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
          return randomResponse.replace('{user_input}', userInput);
        }
      }
    }
    
    // Return default response if no specific match found
    const randomDefault = knowledgeBase.default[Math.floor(Math.random() * knowledgeBase.default.length)];
    return randomDefault.replace('{user_input}', userInput);
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

  return (
    <AISection>
      <div className="wrap">
        <h1>{t('ai_health_assistant')}</h1>
        <p className="muted" style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
          {t('ai_chat_assistant_description')}
        </p>
        
        <ChatContainer>
          <ChatHeader>
            <div className="ai-icon">🤖</div>
            <h2>{t('ai_chat_assistant')}</h2>
          </ChatHeader>
          
          <ChatMessages>
            {messages.length === 1 ? (
              <WelcomeMessage>
                <h3>👋 {t('ai_welcome_title')}</h3>
                <p>{t('ai_welcome_description')}</p>
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                  <p><strong>{t('try_asking')}:</strong></p>
                  <ul style={{ textAlign: 'left', marginTop: '10px' }}>
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
        </ChatContainer>
      </div>
    </AISection>
  );
};

export default AI;