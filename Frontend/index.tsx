import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { setAuthToken } from './services/Api';

const savedToken = localStorage.getItem('token');
if (savedToken) setAuthToken(savedToken);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
