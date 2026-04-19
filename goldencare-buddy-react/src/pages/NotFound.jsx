import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}10 50%, 
    ${props => props.theme.colors.accentLight}10 100%
  );
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const NotFoundCard = styled.div`
  background: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius['2xl']};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: ${props => props.theme.spacing['4xl']};
  max-width: 500px;
  width: 100%;
  border: 1px solid ${props => props.theme.colors.border};
  
  .error-icon {
    font-size: 4rem;
    margin-bottom: ${props => props.theme.spacing.xl};
  }
  
  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.spacing.lg};
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.muted};
    margin-bottom: ${props => props.theme.spacing['2xl']};
    line-height: ${props => props.theme.lineHeights.relaxed};
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
    align-items: center;
    
    @media (min-width: ${props => props.theme.breakpoints.mobile}) {
      flex-direction: row;
      justify-content: center;
    }
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundCard>
        <div className="error-icon">🏥</div>
        <h1>Page Not Found</h1>
        <p>
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to where you need to be.
        </p>
        <div className="actions">
          <Link className="btn primary" to="/">
            Go to Homepage
          </Link>
          <Link className="btn outline" to="/login">
            Sign In
          </Link>
        </div>
      </NotFoundCard>
    </NotFoundContainer>
  );
};

export default NotFound;