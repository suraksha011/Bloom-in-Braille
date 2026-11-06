import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import './styles.css';

// Get the application root element.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Please check that index.html contains <div id="root"></div>.'
  );
}

// Initialise the React application.
createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);