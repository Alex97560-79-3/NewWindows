import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to mount React application:", error);
    rootElement.innerHTML = '<div style="color: red; padding: 20px; font-family: sans-serif;"><h1>Application Error</h1><p>Failed to mount the application. Please check the console for details.</p></div>';
  }
} else {
  console.error("Root element 'root' not found in the document.");
}