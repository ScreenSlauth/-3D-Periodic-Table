import React, { useState, useRef, useEffect } from 'react';
import { Element } from '../types/element';
import anime from 'animejs';

interface ElementCardProps {
  element: Element;
  onClick: () => void;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onClick }) => {
  // Add state for hover effect
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const massRef = useRef<HTMLDivElement>(null);
  const radioactiveRef = useRef<HTMLDivElement>(null);
  
  // Determine if element is radioactive
  const isRadioactive = element.atomicNumber > 83 || [43, 61].includes(element.atomicNumber);
  
  // Use radioactive category if applicable, otherwise use the element's category
  const displayCategory = isRadioactive ? 'radioactive' : element.category.toLowerCase();
  
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      'alkali metal': 'from-pink-500/80 to-purple-500/80',
      'alkaline earth metal': 'from-purple-500/80 to-indigo-500/80',
      'transition metal': 'from-blue-500/80 to-cyan-500/80',
      'post-transition metal': 'from-cyan-500/80 to-teal-500/80',
      'metalloid': 'from-teal-500/80 to-green-500/80',
      'nonmetal': 'from-green-500/80 to-lime-500/80',
      'noble gas': 'from-amber-500/80 to-orange-500/80',
      'lanthanide': 'from-orange-500/80 to-red-500/80',
      'actinide': 'from-red-500/80 to-rose-500/80',
      'halogen': 'from-violet-500/80 to-purple-500/80',
      'radioactive': 'from-yellow-400/80 to-orange-500/80'
    };

    return categoryColors[category.toLowerCase()] || 'from-gray-400/80 to-gray-600/80';
  };

  // Handle extremely large element names by truncating them
  const displayName = element.name.length > 10 ? `${element.name.substring(0, 8)}...` : element.name;

  // Handle special cases for groups (lanthanides, actinides)
  const displayGroup = element.group > 100 ? 
    (element.group === 101 ? 'La' : 'Ac') : 
    element.group.toString();

  // Animation style for the card entrance
  const animationDelay = `${element.atomicNumber * 30}ms`;

  // Format the year discovered (handle BC dates)
  const formatYear = (year: number) => {
    if (year === 0) return 'Unknown';
    if (year < 0) return `${Math.abs(year)} BC`;
    return year.toString();
  };
  
  // Anime.js animations
  useEffect(() => {
    if (isHovered) {
      if (cardRef.current) {
        // Card hover animation
        anime({
          targets: cardRef.current,
          boxShadow: '0 0 25px rgba(255, 255, 255, 0.4)',
          scale: 1.05,
          duration: 400,
          easing: 'easeOutQuad'
        });
      }
      
      if (symbolRef.current) {
        // Symbol animation - different for radioactive elements
        anime({
          targets: symbolRef.current,
          translateY: -5,
          scale: isRadioactive ? 1.2 : 1.15,
          textShadow: isRadioactive ? 
            '0 0 10px rgba(255, 255, 0, 0.8)' : 
            '0 0 8px rgba(255, 255, 255, 0.7)',
          duration: 400,
          easing: 'easeOutQuad'
        });
      }
      
      if (nameRef.current) {
        // Name animation
        anime({
          targets: nameRef.current,
          translateY: 3,
          opacity: 1,
          duration: 300,
          delay: 100,
          easing: 'easeOutQuad'
        });
      }
      
      if (massRef.current) {
        // Atomic mass animation
        anime({
          targets: massRef.current,
          translateY: 2,
          opacity: 1,
          scale: 1.1,
          duration: 300,
          delay: 150,
          easing: 'easeOutQuad'
        });
      }
      
      // Special effect for radioactive elements
      if (isRadioactive && radioactiveRef.current) {
        anime({
          targets: radioactiveRef.current,
          scale: [1, 1.3, 1],
          rotate: ['0deg', '5deg', '-5deg', '0deg'],
          opacity: [0.6, 1],
          duration: 700,
          loop: true,
          easing: 'easeInOutQuad'
        });
      }
    } else {
      // Reset animations when not hovered
      if (cardRef.current) {
        anime({
          targets: cardRef.current,
          boxShadow: '0 0 0 rgba(255, 255, 255, 0)',
          scale: 1,
          duration: 500,
          easing: 'easeOutQuad'
        });
      }
      
      if (symbolRef.current) {
        anime({
          targets: symbolRef.current,
          translateY: 0,
          scale: 1,
          textShadow: '0 0 0 rgba(255, 255, 255, 0)',
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
      
      if (nameRef.current) {
        anime({
          targets: nameRef.current,
          translateY: 0,
          opacity: 0.9,
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
      
      if (massRef.current) {
        anime({
          targets: massRef.current,
          translateY: 0,
          opacity: 0.7,
          scale: 1,
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
      
      // Stop animation for radioactive elements
      if (isRadioactive && radioactiveRef.current) {
        anime.remove(radioactiveRef.current);
      }
    }
  }, [isHovered, isRadioactive]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full aspect-square rounded-2xl bg-gradient-to-br ${getCategoryColor(displayCategory)} 
      backdrop-blur-md cursor-pointer
      border border-white/10 overflow-hidden group 
      animate-fadeIn
      transition-all duration-300 ease-out`}
      style={{ 
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(15, 15, 15, 0.4)',
        animationDelay,
      }}
    >
      {/* Glass effect overlay with special glow for radioactive elements */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl ${
          isRadioactive ? 'border border-yellow-500/30' : ''
        }`}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-2">
        {/* Atomic number */}
        <div className="absolute top-2 left-2 text-xs font-mono text-white/80">
          {element.atomicNumber}
        </div>
        
        {/* Block */}
        <div className="absolute top-2 right-2 text-[10px] text-white/70">
          {element.block.toUpperCase()}
        </div>
        
        {/* Element symbol */}
        <div 
          ref={symbolRef}
          className="symbol text-3xl font-bold text-white"
          style={{
            textShadow: isRadioactive ? '0 0 5px rgba(255, 255, 0, 0.3)' : 'none',
          }}
        >
          {element.symbol}
        </div>
        
        {/* Element name */}
        <div 
          ref={nameRef}
          className="text-[10px] font-medium mt-1 text-center text-white/90 truncate w-full px-1" 
          title={element.name}
        >
          {displayName}
        </div>
        
        {/* Atomic mass */}
        <div 
          ref={massRef}
          className="text-[8px] font-mono mt-1 text-white/70"
        >
          {typeof element.atomicMass === 'number' 
            ? Number(element.atomicMass).toFixed(2) 
            : element.atomicMass}
        </div>
        
        {/* Radioactive symbol */}
        {isRadioactive && (
          <div 
            ref={radioactiveRef}
            className="radioactive-symbol absolute top-1 right-1 w-5 h-5 flex items-center justify-center"
          >
            <span className="text-yellow-300 text-xs">☢</span>
          </div>
        )}
        
        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 flex justify-between items-center px-2 py-1 text-[7px] text-white/70 bg-black/30">
          <span>{element.state}</span>
          <span>{displayGroup}/{element.period}</span>
        </div>
        
        {/* Hover reveal info */}
        <div className={`absolute inset-0 bg-black/70 flex items-center justify-center flex-col p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-4'} transition-transform duration-300`}>
          <span className="text-xs font-medium text-white mb-1">{element.name}</span>
          <span className="text-[10px] text-white/80">{displayCategory}</span>
          {element.yearDiscovered !== 0 && (
            <span className="text-[8px] text-white/60 mt-1">
              Discovered: {formatYear(element.yearDiscovered)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementCard;