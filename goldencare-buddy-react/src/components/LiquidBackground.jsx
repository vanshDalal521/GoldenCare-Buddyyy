import React from 'react';
import styled, { keyframes } from 'styled-components';

const move = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -50px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0.5; }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: ${props => props.theme.colors.bg};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.bg} 0%, 
    ${props => props.theme.colors.primaryLight}20 50%, 
    ${props => props.theme.colors.accentLight}20 100%
  );
`;

const Blob = styled.div`
  position: absolute;
  width: ${props => props.size || '400px'};
  height: ${props => props.size || '400px'};
  background: ${props => props.color};
  filter: blur(${props => props.blur || '60px'});
  border-radius: 50%;
  opacity: 0.35;
  will-change: transform;
  backface-visibility: hidden;
  animation: ${move} ${props => props.duration || '25s'} infinite alternate ease-in-out,
             ${pulse} ${props => (parseFloat(props.duration) * 0.8) + 's'} infinite alternate ease-in-out;
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
`;

const LiquidBackground = () => {
  return (
    <BackgroundContainer>
      <Blob 
        color="#3182ce" 
        size="500px" 
        top="-100px" 
        left="-100px" 
        duration="25s" 
      />
      <Blob 
        color="#48bb78" 
        size="450px" 
        bottom="-100px" 
        right="-100px" 
        duration="30s" 
        blur="100px"
      />
      <Blob 
        color="#805ad5" 
        size="300px" 
        top="40%" 
        left="60%" 
        duration="22s" 
        blur="70px"
      />
      <Blob 
        color="#38b2ac" 
        size="350px" 
        bottom="10%" 
        left="5%" 
        duration="28s" 
        blur="90px"
      />
    </BackgroundContainer>
  );
};

export default LiquidBackground;
