import { useState, useEffect } from 'react';
import PeriodicTable from './components/PeriodicTable';
import ElementDetail from './components/ElementDetail';
import DebugInfo from './components/DebugInfo';
import { Moon, Sun, Code } from 'lucide-react';
import { useThemeStore } from './store/useStore';
import { Element } from './types/element';

function App() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Initialize animations - with simpler animation to avoid potential issues
  useEffect(() => {
    try {
      // Mark as loaded with a simpler approach
      setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      // Debug log
      console.log('App initialized');
    } catch (error) {
      console.error('Error initializing app:', error);
      setHasError(true);
      setIsLoaded(true); // Force loaded state even if there's an error
    }

    // Add key handler for toggling debug
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleElementClick = (element: Element) => {
    try {
      // Simplified version without animations that could cause issues
      setSelectedElement(element);
    } catch (error) {
      console.error('Error handling element click:', error);
    }
  };

  const handleBack = () => {
    try {
      // Simplified version without animations that could cause issues
      setSelectedElement(null);
    } catch (error) {
      console.error('Error handling back click:', error);
    }
  };

  const toggleDebug = () => {
    setShowDebug(prev => !prev);
  };

  // Render a simple fallback if there's an error
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">There was an error loading the periodic table.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`app-container min-h-screen ${
        isDarkMode 
          ? 'text-white' 
          : 'text-gray-800'
      }`}
      style={{ 
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Funky animated background */}
      <div className="fixed inset-0 overflow-hidden z-0">
        {/* Main gradient background */}
        <div 
          className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900' 
              : 'bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200'
          }`}
        ></div>
        
        {/* Animated gradient blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Blob 1 */}
          <div 
            className={`absolute w-[600px] h-[600px] rounded-full filter blur-3xl animate-blob ${
              isDarkMode 
                ? 'bg-blue-500/40 mix-blend-lighten' 
                : 'bg-blue-400/40'
            }`}
            style={{
              top: '-200px',
              right: '-100px',
              animationDelay: '0s',
              animationDuration: '15s'
            }}
          ></div>
          
          {/* Blob 2 */}
          <div 
            className={`absolute w-[500px] h-[500px] rounded-full filter blur-3xl animate-blob ${
              isDarkMode 
                ? 'bg-purple-500/40 mix-blend-lighten' 
                : 'bg-purple-400/40'
            }`}
            style={{
              bottom: '-150px',
              left: '-100px',
              animationDelay: '2s',
              animationDuration: '20s'
            }}
          ></div>
          
          {/* Blob 3 */}
          <div 
            className={`absolute w-[400px] h-[400px] rounded-full filter blur-3xl animate-blob ${
              isDarkMode 
                ? 'bg-pink-500/40 mix-blend-lighten' 
                : 'bg-pink-400/40'
            }`}
            style={{
              top: '40%',
              left: '30%',
              animationDelay: '4s',
              animationDuration: '25s'
            }}
          ></div>
          
          {/* Blob 4 */}
          <div 
            className={`absolute w-[450px] h-[450px] rounded-full filter blur-3xl animate-blob ${
              isDarkMode 
                ? 'bg-yellow-500/30 mix-blend-lighten' 
                : 'bg-yellow-300/40'
            }`}
            style={{
              top: '20%',
              right: '15%',
              animationDelay: '6s',
              animationDuration: '18s'
            }}
          ></div>
        </div>
        
        {/* Particle dots overlay */}
        <div 
          className={`absolute inset-0 ${
            isDarkMode 
              ? 'opacity-30' 
              : 'opacity-20'
          }`}
          style={{
            backgroundImage: `radial-gradient(${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.07)'} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>
      
      {/* Debug panel */}
      <div className={`debug-panel fixed left-0 top-0 z-50 ${showDebug ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        {showDebug && <DebugInfo showDetails={true} />}
      </div>
      
      {/* Controls */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={toggleDebug}
          className="p-2 rounded-full backdrop-blur-md hover:bg-opacity-70 transition-all duration-300 bg-white/10 text-white border border-white/20 shadow-lg"
        >
          <Code className="w-5 h-5" />
        </button>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full backdrop-blur-md hover:bg-opacity-70 transition-all duration-300 bg-white/10 text-white border border-white/20 shadow-lg"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Loading screen */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-50">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-4 border-purple-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-4 rounded-full border-t-4 border-pink-500 animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
            <h2 className="text-2xl font-bold text-white">Initializing Elements</h2>
            <p className="text-gray-400 mt-2">Preparing interactive periodic table...</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="view-container w-full relative z-10" style={{ padding: '0.5rem' }}>
        {isLoaded && (
          selectedElement ? (
            <ElementDetail element={selectedElement} onBack={handleBack} />
          ) : (
            <PeriodicTable onElementClick={handleElementClick} />
          )
        )}
      </main>
    </div>
  );
}

export default App;