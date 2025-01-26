// src/popup.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/popup.css';

try {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    const container = document.getElementById('root');
    if (!container) {
      throw new Error('Root element not found');
    }
    console.log('Root element found');
    const root = createRoot(container);
    console.log('Root created');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('App rendered');
  });
} catch (error) {
  console.error('Error in popup.tsx:', error);
}