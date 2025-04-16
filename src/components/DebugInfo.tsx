import React from 'react';
import { useThemeStore } from '../store/useStore';

interface DebugInfoProps {
  showDetails?: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ showDetails = false }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '10px', 
        left: '10px', 
        padding: '10px', 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}
    >
      <div>Debug Info:</div>
      <div>Dark Mode: {isDarkMode ? 'On' : 'Off'}</div>
      <div>Screen Width: {window.innerWidth}px</div>
      <div>Tailwind Loaded: {document.querySelector('[data-tailwind]') ? 'Yes' : 'Unknown'}</div>
      
      {showDetails && (
        <>
          <div>React Rendered: Yes</div>
          <div>Browser: {navigator.userAgent}</div>
        </>
      )}
    </div>
  );
};

export default DebugInfo; 