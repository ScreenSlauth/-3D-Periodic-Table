import React, { useState, useEffect, useRef } from 'react';
import ElementCard from './ElementCard';
import { Search, Filter } from 'lucide-react';
import { useThemeStore } from '../store/useStore';
import { Element } from '../types/element';
import { allPeriodicTableData } from '../data/elements';

interface PeriodicTableProps {
  onElementClick: (element: Element) => void;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onElementClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const elementContainerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useThemeStore();

  // Set loaded state with a slight delay for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Get all categories including radioactive
  const baseCategories = Array.from(new Set(allPeriodicTableData.map(element => element.category)));
  const categories = [...baseCategories, 'radioactive'];

  // Filter elements based on search and category
  const filteredElements = allPeriodicTableData.filter((element) => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.atomicNumber.toString().includes(searchTerm);
    
    const isRadioactive = element.atomicNumber > 83 || [43, 61].includes(element.atomicNumber);
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      (selectedCategory === 'radioactive' && isRadioactive) ||
      (selectedCategory !== 'radioactive' && element.category.toLowerCase() === selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 relative animate-fadeIn">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Interactive Periodic Table
            </h1>
            <p className={`mt-2 max-w-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore all elements with interactive visualization
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 backdrop-blur-lg bg-white/10 p-4 rounded-2xl border border-white/20 shadow-xl animate-float">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
              <input
                type="text"
                placeholder="Search elements..."
                className="w-full md:w-64 pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-400/50 appearance-none transition-all duration-300"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239C9CAA'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="mb-6 text-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <div className={`inline-block px-4 py-2 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'} rounded-full text-blue-500 font-medium`}>
            Found {filteredElements.length} elements
          </div>
        </div>

        <div 
          ref={elementContainerRef}
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-6 md:gap-8 opacity-0 ${isLoaded ? 'opacity-100' : ''}`}
          style={{ transition: 'opacity 0.5s ease-out' }}
        >
          {filteredElements.map((element, index) => (
            <div 
              key={element.atomicNumber} 
              className="element-card-container animate-fadeIn element-card-hover-glow"
              style={{ 
                animationDelay: `${index * 30}ms`,
                animationFillMode: 'both' 
              }}
            >
              <ElementCard
                element={element}
                onClick={() => onElementClick(element)}
              />
            </div>
          ))}
        </div>
        
        {filteredElements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
            <div className="text-4xl mb-4 animate-pulse">🔍</div>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No elements found</p>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodicTable;