// PageContent.js - Mise à jour du composant d'affichage
import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const PageWrapper = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  width: 80%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

function PageContent({ page, onClose }) {
  if (!page) return null;

  return (
    <AnimatePresence>
      <PageWrapper
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <div>
          <h2 style={{ color: page.color, marginBottom: '1rem' }}>{page.title}</h2>
          <div>{page.content}</div>
        </div>
      </PageWrapper>
    </AnimatePresence>
  );
}

export default PageContent;