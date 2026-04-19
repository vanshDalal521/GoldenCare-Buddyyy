import React, { useState, useEffect, createContext, useContext } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: ${props => props.theme.spacing.xl};
  right: ${props => props.theme.spacing.xl};
  z-index: ${props => props.theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  max-width: 400px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    top: ${props => props.theme.spacing.lg};
    right: ${props => props.theme.spacing.lg};
    left: ${props => props.theme.spacing.lg};
    max-width: none;
  }
`;

const ToastItem = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.successLight;
      case 'error': return props.theme.colors.errorLight;
      case 'warning': return props.theme.colors.warningLight;
      case 'info': return props.theme.colors.infoLight;
      default: return props.theme.colors.card;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success;
      case 'error': return props.theme.colors.error;
      case 'warning': return props.theme.colors.warning;
      case 'info': return props.theme.colors.info;
      default: return props.theme.colors.text;
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.success + '40';
      case 'error': return props.theme.colors.error + '40';
      case 'warning': return props.theme.colors.warning + '40';
      case 'info': return props.theme.colors.info + '40';
      default: return props.theme.colors.border;
    }
  }};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-out forwards;
  backdrop-filter: blur(8px);
`;

const ToastIcon = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  flex-shrink: 0;
  margin-top: 2px;
`;

const ToastContent = styled.div`
  flex: 1;
  
  .toast-title {
    font-weight: ${props => props.theme.fontWeights.semibold};
    font-size: ${props => props.theme.fontSizes.md};
    margin-bottom: ${props => props.theme.spacing.xs};
  }
  
  .toast-message {
    font-size: ${props => props.theme.fontSizes.sm};
    line-height: ${props => props.theme.lineHeights.normal};
    opacity: 0.9;
  }
`;

const ToastCloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.lg};
  opacity: 0.7;
  transition: all ${props => props.theme.transitions.normal};
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
  }
`;

const ToastProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  border-radius: 0 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg};
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

// Toast Context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      showProgress: true,
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
    
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, isExiting: true } : toast
    ));
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  };

  const toast = {
    success: (message, options = {}) => addToast({ 
      ...options, 
      type: 'success', 
      title: options.title || 'Success', 
      message 
    }),
    error: (message, options = {}) => addToast({ 
      ...options, 
      type: 'error', 
      title: options.title || 'Error', 
      message,
      duration: options.duration || 8000 
    }),
    warning: (message, options = {}) => addToast({ 
      ...options, 
      type: 'warning', 
      title: options.title || 'Warning', 
      message 
    }),
    info: (message, options = {}) => addToast({ 
      ...options, 
      type: 'info', 
      title: options.title || 'Info', 
      message 
    }),
    custom: (toast) => addToast(toast),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer>
        {toasts.map(toastItem => (
          <ToastItemComponent 
            key={toastItem.id} 
            toast={toastItem} 
            onClose={() => removeToast(toastItem.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

const ToastItemComponent = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration > 0 && toast.showProgress) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (toast.duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [toast.duration, toast.showProgress]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <ToastItem type={toast.type} isExiting={toast.isExiting}>
      <ToastIcon>{toast.icon || getIcon()}</ToastIcon>
      <ToastContent>
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </ToastContent>
      <ToastCloseButton onClick={onClose}>×</ToastCloseButton>
      {toast.showProgress && toast.duration > 0 && (
        <ToastProgressBar progress={progress} />
      )}
    </ToastItem>
  );
};

export default ToastProvider;