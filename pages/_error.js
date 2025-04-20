import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

function Error({ statusCode }) {
  return (
    <ErrorContainer>
      <ErrorContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorIcon>⚠️</ErrorIcon>
        <ErrorTitle>
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : 'An error occurred on client'}
        </ErrorTitle>
        <ErrorMessage>
          We apologize for the inconvenience. Please try again later.
        </ErrorMessage>
        <HomeButton
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Return to Home
        </HomeButton>
      </ErrorContent>
    </ErrorContainer>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme?.background || '#f9f9f9'};
  padding: 2rem;
`;

const ErrorContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const ErrorTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme?.text || '#333'};
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: ${props => props.theme?.textLight || '#666'};
`;

const HomeButton = styled(motion.a)`
  display: inline-block;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export default Error;
