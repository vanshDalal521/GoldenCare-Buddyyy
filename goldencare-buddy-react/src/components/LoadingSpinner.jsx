import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.fullscreen ? '100vh' : '200px'};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.colors.border};
  border-top: 4px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.md};
  margin: 0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const InlineSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-right: ${props => props.theme.spacing.sm};
`;

// Full screen loading spinner
export const FullScreenLoader = ({ message = 'Loading...' }) => (
  <LoadingContainer fullscreen>
    <Spinner />
    <LoadingText>{message}</LoadingText>
  </LoadingContainer>
);

// Inline loading indicator
export const InlineLoader = ({ message = 'Loading...' }) => (
  <>
    <InlineSpinner />
    <span>{message}</span>
  </>
);

// Overlay loading spinner
export const OverlayLoader = ({ message = 'Loading...' }) => (
  <Overlay>
    <LoadingContainer>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  </Overlay>
);

// Button with loading state
export const LoadingButton = styled.button`
  position: relative;
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  background: ${props => props.loading 
    ? props.theme.colors.muted 
    : `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark})`
  };
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.bold};
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.loading ? 0.7 : 1};
  
  &:disabled {
    cursor: not-allowed;
  }
  
  .loading-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-right: ${props => props.theme.spacing.sm};
  }
`;

// Form with loading state
export const LoadingForm = styled.form`
  position: relative;
  opacity: ${props => props.loading ? 0.6 : 1};
  pointer-events: ${props => props.loading ? 'none' : 'auto'};
  
  ${props => props.loading && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.5);
      border-radius: inherit;
      z-index: 10;
    }
  `}
`;

// Card with loading overlay
export const LoadingCard = styled.div`
  position: relative;
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.border};
  
  ${props => props.loading && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      border-radius: inherit;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30px;
      height: 30px;
      margin: -15px 0 0 -15px;
      border: 3px solid ${props.theme.colors.border};
      border-top: 3px solid ${props.theme.colors.primary};
      border-radius: 50%;
      animation: ${spin} 1s linear infinite;
      z-index: 11;
    }
  `}
`;

export default FullScreenLoader;