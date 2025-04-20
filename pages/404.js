import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

export default function Custom404() {
  const { theme, isDarkTheme } = useContext(ThemeContext);
  
  return (
    <NotFoundContainer>
      <GlassmorphicPanel
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorCode>404</ErrorCode>
        <NotFoundTitle>Page Not Found</NotFoundTitle>
        <NotFoundMessage>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </NotFoundMessage>
        <HomeButton
          href="/"
          whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(110, 142, 251, 0.4)' }}
          whileTap={{ scale: 0.95 }}
        >
          <ButtonText>Return to Home</ButtonText>
          <ButtonIcon>→</ButtonIcon>
        </HomeButton>
      </GlassmorphicPanel>
    </NotFoundContainer>
  );
}

const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme.heroGradient};
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -150px;
    right: -150px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    z-index: 1;
    opacity: 0.7;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    z-index: 1;
    opacity: 0.5;
  }
`;

const GlassmorphicPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 3rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  position: relative;
  z-index: 10;
  text-align: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    opacity: 0.5;
    z-index: -1;
    transform: rotate(30deg);
  }
`;

const ErrorCode = styled.div`
  font-size: 8rem;
  font-weight: 800;
  background: linear-gradient(to right, #ffffff, #e0e0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  line-height: 1;
  margin-bottom: 1rem;
`;

const NotFoundTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
  font-weight: 700;
`;

const NotFoundMessage = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const HomeButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: white;
  color: #6e8efb;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    transition: 0.5s;
  }
  
  &:hover::after {
    left: 100%;
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
  
  ${HomeButton}:hover & {
    transform: translateX(5px);
  }
`;
