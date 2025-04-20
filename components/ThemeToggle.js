import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <ToggleButton 
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
      initial={{ rotate: 0 }}
      animate={{ 
        rotate: isDarkTheme ? [0, 360] : [0, -360],
        transition: { duration: 0.5 }
      }}
    >
      {isDarkTheme ? <FaSun /> : <FaMoon />}
    </ToggleButton>
  );
};

const ToggleButton = styled(motion.button)`
  background: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 10px ${props => props.theme.shadow};
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
    border-radius: 50%;
  }
`;

export default ThemeToggle;
