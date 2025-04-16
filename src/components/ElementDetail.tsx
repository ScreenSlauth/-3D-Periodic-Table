import React, { useState, useEffect, useRef } from 'react';
import { Element } from '../types/element';
import { ArrowLeft, Atom, Beaker, History, Info, Lightbulb, Zap, Download, Share2, FlaskConical } from 'lucide-react';
import { useThemeStore } from '../store/useStore';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ElementDetailProps {
  element: Element;
  onBack: () => void;
}

const ElementDetail: React.FC<ElementDetailProps> = ({ element, onBack }) => {
  useThemeStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Add animation loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Check if element is radioactive
  const isRadioactive = element.atomicNumber > 83 || [43, 61].includes(element.atomicNumber);

  // Get a gradient based on element category
  const getCategoryGradient = () => {
    if (isRadioactive) return 'from-yellow-400 to-orange-500';
    
    const categoryGradients: Record<string, string> = {
      'alkali metal': 'from-pink-500 to-purple-500',
      'alkaline earth metal': 'from-purple-500 to-indigo-500',
      'transition metal': 'from-blue-500 to-cyan-500',
      'post-transition metal': 'from-cyan-500 to-teal-500',
      'metalloid': 'from-teal-500 to-green-500',
      'nonmetal': 'from-green-500 to-lime-500',
      'noble gas': 'from-amber-500 to-orange-500',
      'lanthanide': 'from-orange-500 to-red-500',
      'actinide': 'from-red-500 to-rose-500',
      'halogen': 'from-violet-500 to-purple-500'
    };
    
    return categoryGradients[element.category.toLowerCase()] || 'from-gray-400 to-gray-600';
  };

  // Initialize 3D model with simplified logic
  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      // Basic Three.js setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
      });
      
      renderer.setSize(300, 300);
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(renderer.domElement);
      
      // Get element color based on category
      const elementColor = isRadioactive 
        ? 0xffcc00 
        : {
            'alkali metal': 0xff55cc,
            'alkaline earth metal': 0x9966ff,
            'transition metal': 0x3399ff,
            'post-transition metal': 0x33cccc,
            'metalloid': 0x33cc99,
            'nonmetal': 0x66dd44,
            'noble gas': 0xffaa33,
            'lanthanide': 0xff7733,
            'actinide': 0xff4433,
            'halogen': 0xbb33ff
          }[element.category.toLowerCase()] || 0x999999;
      
      // Create nucleus
      const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({ 
          color: elementColor,
          transparent: true,
          opacity: 0.8
        })
      );
      scene.add(nucleus);
      
      // Add light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      
      // Create electrons and orbits
      const electronCount = Math.min(element.atomicNumber, 8);
      const electrons = [];
      const orbits = [];
      
      for (let i = 0; i < electronCount; i++) {
        // Create orbit
        const orbitRadius = 2 + i * 0.5;
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        
        // Create orbit circle
        for (let j = 0; j <= 64; j++) {
          const angle = (j / 64) * Math.PI * 2;
          orbitPoints.push(
            new THREE.Vector3(
              Math.cos(angle) * orbitRadius,
              Math.sin(angle) * orbitRadius,
              0
            )
          );
        }
        
        orbitGeometry.setFromPoints(orbitPoints);
        const orbit = new THREE.Line(
          orbitGeometry,
          new THREE.LineBasicMaterial({ 
            color: 0x444444,
            transparent: true,
            opacity: 0.3
          })
        );
        
        // Random rotation for orbit
        orbit.rotation.x = Math.random() * Math.PI;
        orbit.rotation.y = Math.random() * Math.PI;
        scene.add(orbit);
        orbits.push(orbit);
        
        // Create electron
        const electron = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x00ffff })
        );
        scene.add(electron);
        electrons.push({
          mesh: electron,
          orbit: orbit,
          speed: 0.5 - i * 0.05,
          angle: Math.random() * Math.PI * 2
        });
      }
      
      camera.position.z = 8;
      
      // Animation loop
      let animationFrame: number;
      
      const animate = () => {
        animationFrame = requestAnimationFrame(animate);
        
        // Rotate nucleus
        nucleus.rotation.x += 0.01;
        nucleus.rotation.y += 0.015;
        
        // Update electrons
        electrons.forEach((electron) => {
          electron.angle += electron.speed / 56;
          
          // Calculate electron position on the orbit
          const orbitRadius = electron.orbit.geometry.attributes.position.array[0];
          
          // Get the orbit's rotation matrix
          const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(electron.orbit.rotation);
          
          // Create position vector and apply rotation
          const position = new THREE.Vector3(
            Math.cos(electron.angle) * orbitRadius,
            Math.sin(electron.angle) * orbitRadius,
            0
          );
          position.applyMatrix4(rotationMatrix);
          
          // Update electron position
          electron.mesh.position.copy(position);
        });
        
        renderer.render(scene, camera);
      };
      
      animate();
      
      return () => {
        cancelAnimationFrame(animationFrame);
        if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
        
        // Clean up Three.js resources
        scene.clear();
        electrons.forEach(e => e.mesh.geometry.dispose());
        orbits.forEach(o => o.geometry.dispose());
        nucleus.geometry.dispose();
        (nucleus.material as THREE.Material).dispose();
        renderer.dispose();
      };
    } catch (error) {
      console.error('Error rendering 3D model:', error);
      
      // If Three.js fails, render a fallback
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gradient-to-br ${getCategoryGradient()} rounded-full">
            <span class="text-9xl text-white font-bold">${element.symbol}</span>
          </div>
        `;
      }
    }
  }, [element.atomicNumber, element.category, element.symbol, isRadioactive]);

  const fadeInAnimation = {
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
  };

  // Sample reactions for common elements if not provided
  const sampleReactions = {
    1: [ // Hydrogen
      { equation: "2H₂ + O₂ → 2H₂O", description: "Combustion of hydrogen to form water" },
      { equation: "H₂ + Cl₂ → 2HCl", description: "Formation of hydrogen chloride" },
      { equation: "H₂ + F₂ → 2HF", description: "Formation of hydrogen fluoride" },
      { equation: "H₂ + N₂ ⇌ NH₃", description: "Haber process to produce ammonia" },
      { equation: "H₂ + CO ⇌ CH₃OH", description: "Synthesis of methanol" },
      { equation: "Zn + 2HCl → ZnCl₂ + H₂", description: "Single displacement with zinc" },
      { equation: "CH₄ + H₂O ⇌ CO + 3H₂", description: "Steam reforming of methane" }
    ],
    8: [ // Oxygen
      { equation: "2H₂ + O₂ → 2H₂O", description: "Formation of water" },
      { equation: "C + O₂ → CO₂", description: "Combustion of carbon" },
      { equation: "4Fe + 3O₂ → 2Fe₂O₃", description: "Oxidation of iron (rusting)" },
      { equation: "S + O₂ → SO₂", description: "Combustion of sulfur" },
      { equation: "CH₄ + 2O₂ → CO₂ + 2H₂O", description: "Combustion of methane" },
      { equation: "2Mg + O₂ → 2MgO", description: "Oxidation of magnesium" },
      { equation: "4Al + 3O₂ → 2Al₂O₃", description: "Oxidation of aluminum" }
    ],
    11: [ // Sodium
      { equation: "2Na + 2H₂O → 2NaOH + H₂", description: "Reaction with water" },
      { equation: "2Na + Cl₂ → 2NaCl", description: "Formation of sodium chloride" },
      { equation: "Na + O₂ → Na₂O₂", description: "Formation of sodium peroxide" },
      { equation: "Na + NH₃ → NaNH₂ + ½H₂", description: "Formation of sodium amide" },
      { equation: "2Na + 2CO₂ → Na₂CO₃ + CO", description: "Formation of sodium carbonate" },
      { equation: "2Na + S → Na₂S", description: "Formation of sodium sulfide" },
      { equation: "2Na + 2HCl → 2NaCl + H₂", description: "Reaction with acid" }
    ],
  };

  // Get element reactions (use sample or default)
  const getElementReactions = () => {
    if (element.reactions && element.reactions.length > 0) {
      return element.reactions;
    }
    
    return sampleReactions[element.atomicNumber as keyof typeof sampleReactions] || [
      { equation: `${element.symbol} + ? → Compound`, description: "Reaction with unknown element" },
      { equation: `${element.symbol} + O₂ → Oxide`, description: "Oxidation reaction" },
      { equation: `${element.symbol} + H₂O → Products`, description: "Reaction with water" },
      { equation: `${element.symbol} + Acid → Salt + H₂`, description: "Reaction with acid" },
      { equation: `${element.symbol} + X₂ → ${element.symbol}X₂`, description: "Reaction with halogen" },
      { equation: `${element.symbol} + Heat → Changes`, description: "Thermal decomposition" },
      { equation: `${element.symbol} compounds + e⁻ → Reduced products`, description: "Reduction reaction" }
    ];
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient animation */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient()} opacity-10 z-0 animate-glow`}
        style={{ filter: 'blur(100px)' }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={onBack}
          className="flex items-center gap-2 mb-8 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md 
          hover:bg-white/20 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Periodic Table
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div 
            className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl animate-fadeIn"
            style={{ 
              ...fadeInAnimation,
              animationDelay: '200ms'
            }}
          >
            {/* Three.js Element Visualization */}
            <div className="w-full aspect-square flex items-center justify-center mb-8 relative">
              <div 
                ref={containerRef} 
                className="w-[300px] h-[300px] rounded-full overflow-hidden"
              ></div>
              
              {/* Element info overlays */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
                #{element.atomicNumber}
              </div>
              
              {isRadioactive && (
                <div className="absolute top-0 right-1/4 animate-pulse">
                  <span className="text-yellow-300 text-2xl">☢</span>
                </div>
              )}
            </div>
            
            <div 
              className="flex justify-between items-end gap-4 mb-6"
              style={{ 
                ...fadeInAnimation,
                animationDelay: '200ms'
              }}
            >
              <div>
                <h1 className={`text-5xl font-bold mb-2 bg-gradient-to-r ${getCategoryGradient()} 
                  bg-clip-text text-transparent`}>{element.name}</h1>
                <div className="text-2xl opacity-75 mb-1 font-mono">
                  {element.symbol} ({element.atomicNumber})
                </div>
                <div className="text-sm text-white/60 capitalize">
                  {isRadioactive ? 'Radioactive • ' : ''}{element.category}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 animate-float" style={{ animationDelay: '100ms' }}>
                  <Download size={18} />
                </button>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 animate-float" style={{ animationDelay: '200ms' }}>
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div 
                className="space-y-1 bg-white/5 rounded-xl p-4 animate-fadeIn"
                style={{ 
                  ...fadeInAnimation,
                  animationDelay: '400ms'
                }}
              >
                <div className="font-semibold flex items-center gap-2 text-white/80">
                  <Atom className="w-4 h-4" /> Atomic Mass
                </div>
                <div className="font-mono text-lg">{element.atomicMass}</div>
              </div>
              <div 
                className="space-y-1 bg-white/5 rounded-xl p-4 animate-fadeIn"
                style={{ 
                  ...fadeInAnimation,
                  animationDelay: '400ms'
                }}
              >
                <div className="font-semibold flex items-center gap-2 text-white/80">
                  <Beaker className="w-4 h-4" /> Block
                </div>
                <div className="uppercase font-mono text-lg">{element.block}</div>
              </div>
              <div 
                className="space-y-1 bg-white/5 rounded-xl p-4 animate-fadeIn"
                style={{ 
                  ...fadeInAnimation,
                  animationDelay: '500ms'
                }}
              >
                <div className="font-semibold flex items-center gap-2 text-white/80">
                  <Zap className="w-4 h-4" /> State
                </div>
                <div className="capitalize text-lg">{element.state}</div>
              </div>
              <div 
                className="space-y-1 bg-white/5 rounded-xl p-4 animate-fadeIn"
                style={{ 
                  ...fadeInAnimation,
                  animationDelay: '600ms'
                }}
              >
                <div className="font-semibold flex items-center gap-2 text-white/80">
                  <Info className="w-4 h-4" /> Group/Period
                </div>
                <div className="text-lg">
                  {element.group > 100 ? 
                    (element.group === 101 ? 'Lanthanide' : 'Actinide') : 
                    `${element.group}/${element.period}`}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div 
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl animate-fadeIn"
              style={{ 
                ...fadeInAnimation,
                animationDelay: '900ms'
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Atom className="w-5 h-5 animate-pulse" /> 
                Electron Configuration
              </h2>
              <div className="text-xl font-mono bg-black/20 p-4 rounded-xl">
                {element.electronConfiguration}
              </div>
              
              <div className="mt-4 text-sm text-white/60">
                <span className="text-white/80 font-medium">Valency:</span> {element.valency.join(', ')}
              </div>
            </div>

            <div 
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl animate-fadeIn"
              style={{ 
                ...fadeInAnimation,
                animationDelay: '800ms'
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 animate-pulse" />
                Uses
              </h2>
              <ul className="space-y-2">
                {element.uses.map((use, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 bg-white/5 p-2 rounded-lg animate-fadeIn"
                    style={{ 
                      ...fadeInAnimation,
                      animationDelay: `${900 + index * 100}ms`
                    }}
                  >
                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-white/10 text-xs">{index + 1}</span>
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div 
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl animate-fadeIn"
              style={{ 
                ...fadeInAnimation,
                animationDelay: '1000ms'
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <History className="w-5 h-5 animate-pulse" />
                Discovery
              </h2>
              <div className="space-y-3">
                <div 
                  className="flex justify-between items-center bg-white/5 p-3 rounded-lg animate-fadeIn"
                  style={{ 
                    ...fadeInAnimation,
                    animationDelay: '1100ms'
                  }}
                >
                  <span className="font-medium">Discovered by</span>
                  <span>{element.discoveredBy || 'Unknown'}</span>
                </div>
                <div 
                  className="flex justify-between items-center bg-white/5 p-3 rounded-lg animate-fadeIn"
                  style={{ 
                    ...fadeInAnimation,
                    animationDelay: '1200ms'
                  }}
                >
                  <span className="font-medium">Year discovered</span>
                  <span>{element.yearDiscovered < 0 
                    ? `${Math.abs(element.yearDiscovered)} BCE` 
                    : element.yearDiscovered}
                  </span>
                </div>
              </div>
            </div>

            {/* Add new Reactions section */}
            <div 
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl animate-fadeIn"
              style={{ 
                ...fadeInAnimation,
                animationDelay: '1300ms'
              }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 animate-pulse" />
                Chemical Reactions
              </h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {getElementReactions().map((reaction: { equation: string; description: string }, index: number) => (
                  <div 
                    key={index}
                    className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 animate-fadeIn"
                    style={{ 
                      ...fadeInAnimation,
                      animationDelay: `${1400 + index * 100}ms`
                    }}
                  >
                    <div className="font-mono text-lg text-center mb-2 bg-black/30 p-2 rounded-lg">
                      {reaction.equation}
                    </div>
                    <div className="text-sm text-white/80">
                      {reaction.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementDetail;