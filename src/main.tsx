import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Environment validation
const validateEnvironment = () => {
  const warnings: string[] = [];

  // Check for API key (optional in dev, required for AI features)
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
    warnings.push('VITE_OPENROUTER_API_KEY is not set - AI features will not work');
  }

  // Log warnings in development only
  if (import.meta.env.DEV && warnings.length > 0) {
    console.group('⚠️ Environment Warnings');
    warnings.forEach(w => console.warn(w));
    console.groupEnd();
  }
};

validateEnvironment();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>
);
