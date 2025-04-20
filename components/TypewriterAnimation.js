import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TypewriterAnimation = ({ text, speed = 100, pauseDuration = 1000, cursorBlinkSpeed = 500 }) => {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, cursorBlinkSpeed);
    
    return () => clearInterval(cursorInterval);
  }, [cursorBlinkSpeed]);
  
  // Typing animation effect
  useEffect(() => {
    let currentCharIndex = 0;
    let isTypingComplete = false;
    let timeoutId;
    
    const typeWriter = () => {
      if (!isTypingComplete) {
        // Typing forward
        currentCharIndex++;
        setDisplayText(text.substring(0, currentCharIndex));
        
        // If we've completed typing the entire text
        if (currentCharIndex === text.length) {
          isTypingComplete = true;
          // Pause at the end before restarting
          timeoutId = setTimeout(() => {
            currentCharIndex = 0;
            setDisplayText('');
            isTypingComplete = false;
            timeoutId = setTimeout(typeWriter, speed);
          }, pauseDuration * 2);
          return;
        }
      }
      
      // Schedule next update
      timeoutId = setTimeout(typeWriter, speed);
    };
    
    // Start the animation
    timeoutId = setTimeout(typeWriter, speed);
    
    // Cleanup on unmount
    return () => clearTimeout(timeoutId);
  }, [text, speed, pauseDuration]);
  
  return (
    <Container>
      <AnimatedText>
        {displayText}
        <Cursor visible={cursorVisible}>|</Cursor>
      </AnimatedText>
    </Container>
  );
};

const Container = styled.div`
  display: inline-block;
`;

const AnimatedText = styled.span`
  font-weight: inherit;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
  position: relative;
`;

const Cursor = styled.span`
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 0.1s;
  color: inherit;
  font-weight: 700;
`;

export default TypewriterAnimation;
