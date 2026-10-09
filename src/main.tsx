import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Clear all legacy mock data stores from localStorage on startup
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('tracer_study_admin_sasmita2');
    localStorage.removeItem('tracer_study_content_store');
    localStorage.removeItem('tracer_study_content_sasmita2');
    localStorage.removeItem('tracer_study_mail_store');
  } catch {
    // ignore
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
