import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error handler for runtime errors
const errorHandler = (error: Error) => {
  console.error('Application Error:', error);
  
  // Display fallback UI for critical errors
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        color: white;
        background: linear-gradient(to bottom right, #1a202c, #2d3748);
        text-align: center;
        padding: 20px;
      ">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Something went wrong</h1>
        <p style="margin-bottom: 24px;">The application encountered an error. Please try reloading the page.</p>
        <button 
          onclick="window.location.reload()" 
          style="
            background: #4299e1;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          "
        >
          Reload Page
        </button>
      </div>
    `;
  }
};

// Register global error handlers
window.onerror = (message, _source, _lineno, _colno, error) => {
  errorHandler(error || new Error(String(message)));
  return true; // Prevents default error handling
};

window.addEventListener('unhandledrejection', (event) => {
  errorHandler(event.reason);
});

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Failed to find the root element');
  }

  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  errorHandler(error as Error);
}
