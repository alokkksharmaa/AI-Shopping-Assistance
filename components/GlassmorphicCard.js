import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GlassmorphicCard = ({ 
  children, 
  className, 
  blur = '10px', 
  opacity = 0.7, 
  borderRadius = '16px',
  hoverScale = 1.02,
  ...props 
}) => {
  return (
    <StyledCard 
      className={className}
      blur={blur}
      opacity={opacity}
      borderRadius={borderRadius}
      whileHover={{ scale: hoverScale, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

const StyledCard = styled(motion.div)`
  background: ${props => `rgba(${props.theme.isDarkTheme ? '30, 30, 30' : '255, 255, 255'}, ${props.opacity})`};
  backdrop-filter: blur(${props => props.blur});
  -webkit-backdrop-filter: blur(${props => props.blur});
  border-radius: ${props => props.borderRadius};
  border: 1px solid ${props => `rgba(${props.theme.isDarkTheme ? '60, 60, 60' : '255, 255, 255'}, 0.18)`};
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
    pointer-events: none;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

export default GlassmorphicCard;
