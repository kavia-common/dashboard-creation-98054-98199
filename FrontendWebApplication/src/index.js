import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

// In development, log unhandled promise rejections and errors to aid debugging blank screens
if (process.env.NODE_ENV !== 'production') {
  window.addEventListener('unhandledrejection', (event) => {
    // eslint-disable-next-line no-console
    console.error('[global] Unhandled promise rejection:', event.reason);
  });
  window.addEventListener('error', (event) => {
    // eslint-disable-next-line no-console
    console.error('[global] Uncaught error:', event.error || event.message);
  });
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// PUBLIC_INTERFACE
function Root() {
  /** Entry component that wraps App with global ErrorBoundary to prevent blank UI on crashes. */
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

root.render(<Root />);
