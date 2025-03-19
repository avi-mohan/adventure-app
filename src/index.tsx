import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initGA } from './services/analytics';

// Initialize Google Analytics
initGA();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Send web vitals to analytics if enabled
reportWebVitals(metric => {
  if (window.gtag) {
    window.gtag('event', 'web_vitals', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_id: metric.id
    });
  }
});