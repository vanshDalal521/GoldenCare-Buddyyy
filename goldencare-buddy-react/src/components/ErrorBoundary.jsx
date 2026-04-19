import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${props => props.theme.spacing['4xl']};
  text-align: center;
  
  &.fullscreen {
    min-height: 100vh;
  }
`;


const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${props => props.theme.spacing.xl};
  opacity: 0.7;
`;

const ErrorTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.muted};
  font-size: ${props => props.theme.fontSizes.lg};
  line-height: ${props => props.theme.lineHeights.relaxed};
  margin-bottom: ${props => props.theme.spacing.xl};
  max-width: 600px;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

const ErrorCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing['2xl']};
  border: 1px solid ${props => props.theme.colors.border};
  max-width: 500px;
  margin: 0 auto;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { title, message, showDetails = false, fullscreen = false } = this.props;
      
      return (
        <ErrorContainer className={fullscreen ? 'fullscreen' : ''}>
          <ErrorCard>
            <ErrorIcon>😔</ErrorIcon>
            <ErrorTitle>
              {title || 'Something went wrong'}
            </ErrorTitle>
            <ErrorMessage>
              {message || 
                'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'
              }
            </ErrorMessage>
            
            {showDetails && this.state.error && (
              <details style={{ 
                marginBottom: '2rem', 
                textAlign: 'left',
                fontSize: '0.875rem',
                color: '#666',
                background: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Technical Details
                </summary>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Error:</strong> {this.state.error.toString()}
                </div>
                {this.state.errorInfo && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Stack trace:</strong>
                    <pre style={{ 
                      whiteSpace: 'pre-wrap', 
                      fontSize: '0.75rem',
                      marginTop: '0.5rem',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </details>
            )}
            
            <ErrorActions>
              <button 
                className="btn primary"
                onClick={this.handleReload}
              >
                🔄 Refresh Page
              </button>
              <button 
                className="btn outline"
                onClick={this.handleGoHome}
              >
                🏠 Go to Home
              </button>
            </ErrorActions>
          </ErrorCard>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Simple error display component for known errors
export const ErrorDisplay = ({ 
  title = 'Error', 
  message, 
  onRetry, 
  onGoBack,
  icon = '⚠️'
}) => (
  <ErrorContainer>
    <ErrorCard>
      <ErrorIcon>{icon}</ErrorIcon>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      <ErrorActions>
        {onRetry && (
          <button className="btn primary" onClick={onRetry}>
            🔄 Try Again
          </button>
        )}
        {onGoBack && (
          <button className="btn outline" onClick={onGoBack}>
            ← Go Back
          </button>
        )}
      </ErrorActions>
    </ErrorCard>
  </ErrorContainer>
);

export default ErrorBoundary;