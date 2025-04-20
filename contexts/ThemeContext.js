import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Define theme colors
const lightTheme = {
  primary: '#6e8efb',
  secondary: '#a777e3',
  background: '#ffffff',
  cardBackground: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  border: '#e0e0e0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  navBackground: '#ffffff',
  navText: '#333333',
  buttonBackground: '#6e8efb',
  buttonText: '#ffffff',
  heroGradient: 'linear-gradient(135deg, #6e8efb 0%, #a777e3 100%)',
  chatbotBackground: '#ffffff',
  chatbotUserBubble: '#6e8efb',
  chatbotBotBubble: '#f0f0f0',
};

const darkTheme = {
  primary: '#8c9eff',
  secondary: '#b388ff',
  background: '#121212',
  cardBackground: '#1e1e1e',
  text: '#e0e0e0',
  textLight: '#b0b0b0',
  border: '#333333',
  shadow: 'rgba(0, 0, 0, 0.3)',
  navBackground: '#1a1a1a',
  navText: '#e0e0e0',
  buttonBackground: '#8c9eff',
  buttonText: '#121212',
  heroGradient: 'linear-gradient(135deg, #303f9f 0%, #7b1fa2 100%)',
  chatbotBackground: '#1a1a1a',
  chatbotUserBubble: '#8c9eff',
  chatbotBotBubble: '#2d2d2d',
};

// Create context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if localStorage is available (for SSR)
  const isBrowser = typeof window !== 'undefined';
  
  // Initialize theme from localStorage or default to light
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false;
  });

  // Update theme in localStorage when it changes
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
      
      // Also update body class for global styles
      if (isDarkTheme) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  }, [isDarkTheme, isBrowser]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Current theme object
  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkTheme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
