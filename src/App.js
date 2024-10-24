import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import * as THREE from 'three';

import { AppProvider } from './contexts/AppContext';
import theme from './theme';
import Planet from './components/Planet';
import PageContent from './components/PageContent';
import Loading from './components/Loading';
import ErrorFallback from './components/ErrorFallback';
import SoundManager from './utils/SoundManager';
import NavigationMenu from './components/NavigationMenu';
import BackgroundParticles from './components/BackgroundParticles';
import PlanetTransition from './components/PlanetTransition';
import SpaceshipController from './components/SpaceshipController';
import Instructions from './components/Instructions';
import AspectRatioManager from './components/AspectRatioManager';
import Sun from './components/Sun';
import { planets } from './planetData';
import './App.css';

function OrbitLine({ radius }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.1, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function OrbitingPlanet({ planet, time, handlePlanetClick, isActive }) {
  const angle = time * planet.orbitSpeed;
  const x = Math.cos(angle) * planet.orbitRadius;
  const z = Math.sin(angle) * planet.orbitRadius;
  
  return (
    <group>
      <OrbitLine radius={planet.orbitRadius} />
      <Planet
        position={[x, 0, z]}
        scale={planet.scale}
        texture={planet.texture}
        bumpMap={planet.bumpMap}
        cloudTexture={planet.cloudTexture}
        rings={planet.rings}
        ringTexture={planet.ringTexture}
        atmosphere={planet.atmosphere}
        rotationSpeed={planet.rotationSpeed}
        onClick={() => handlePlanetClick(planet.title)}
        isActive={isActive}
        tilt={planet.tilt}
      />
    </group>
  );
}

function SolarSystem({ handlePlanetClick, currentPlanet, isTransitioning, handleTransitionComplete }) {
  const [time, setTime] = useState(0);
  const { viewport } = useThree();

  // Calculer l'échelle du système en fonction de l'orientation
  const systemScale = useMemo(() => {
    const aspect = viewport.width / viewport.height;
    const isLandscape = aspect > 1;
    const baseScale = 0.5;
    return isLandscape ? baseScale : baseScale * Math.min(1, aspect);
  }, [viewport.width, viewport.height]);

  useFrame((state, delta) => {
    setTime(state.clock.getElapsedTime());
  });

  return (
    <group scale={[systemScale, systemScale, systemScale]}>
      <Sun position={[0, 0, 0]} size={30} />
      {planets.map((planet) => (
        <OrbitingPlanet 
          key={planet.title} 
          planet={planet} 
          time={time}
          handlePlanetClick={handlePlanetClick}
          isActive={currentPlanet?.title === planet.title}
        />
      ))}
      {currentPlanet && (
        <PlanetTransition
          targetPosition={new THREE.Vector3(
            Math.cos(time * currentPlanet.orbitSpeed) * currentPlanet.orbitRadius * 0.5,
            0,
            Math.sin(time * currentPlanet.orbitSpeed) * currentPlanet.orbitRadius * 0.5
          )}
          isTransitioning={isTransitioning}
          onTransitionComplete={handleTransitionComplete}
        />
      )}
    </group>
  );
}

function App() {
  const [isSpaceshipMode, setIsSpaceshipMode] = useState(false);
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Ajout de la référence pour OrbitControls
  const orbitControlsRef = useRef();
  const pointLightRef = useRef();
  const directionalLightRef = useRef();

  

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const initializeAudio = () => {
    SoundManager.init();
    SoundManager.startAmbient();
    setAudioInitialized(true);
  };

 // Dans la fonction App, modifiez la gestion des transitions comme suit :
const handlePlanetClick = (title) => {
  const planet = planets.find(p => p.title === title);
  if (planet && planet !== currentPlanet) {
    setIsTransitioning(true);
    setCurrentPlanet(planet);
    setShowInfo(false);
    SoundManager.play('click');
    
    // Ajouter un délai plus court pour l'affichage des informations
    setTimeout(() => {
      setIsTransitioning(false);
      setShowInfo(true);
    }, 2000); // Délai correspondant à la durée de la transition
  }
};

const handleCloseDetailView = () => {
  setShowInfo(false);
  setCurrentPlanet(null);
  SoundManager.play('click');
  
  // Réinitialiser la caméra à sa position initiale
  if (orbitControlsRef.current) {
    orbitControlsRef.current.reset();
  }
};

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  const toggleSpaceshipMode = () => {
    setIsSpaceshipMode(!isSpaceshipMode);
  };

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <div className="App">
            {!audioInitialized && (
              <button 
                onClick={initializeAudio} 
                className="start-button"
              >
                Start Experience
              </button>
            )}
            
            <button 
              onClick={toggleSpaceshipMode}
              className="mode-toggle-button"
            >
              {isSpaceshipMode ? "Désactiver le mode vaisseau" : "Activer le mode vaisseau"}
            </button>
  
            <NavigationMenu 
              planets={planets} 
              onPlanetClick={handlePlanetClick} 
            />
  
            <div className="canvas-container preserve-3d">
              <Canvas>
                <AspectRatioManager />
                
                <PerspectiveCamera 
                  makeDefault 
                  position={[0, 100, 400]} 
                  far={10000}
                  aspect={window.innerWidth / window.innerHeight}
                />
                
                <OrbitControls
                  ref={orbitControlsRef}
                  enabled={!isTransitioning && !isSpaceshipMode}
                  enableRotate={!isTransitioning}
                  enableZoom={!isTransitioning}
                  enablePan={!isTransitioning}
                 
                />
  
                <Stars 
                  radius={300} 
                  depth={60} 
                  count={20000} 
                  factor={7} 
                  saturation={0} 
                  fade 
                />
                
                <BackgroundParticles 
                  count={5000} 
                  boxSize={1000} 
                />
                
                <ambientLight intensity={0.1} />
                <pointLight 
                  position={[0, 0, 0]} 
                  intensity={2} 
                  distance={1000} 
                />
                <directionalLight 
                  position={[500, 500, 500]} 
                  intensity={0.5} 
                />
                
                <Suspense fallback={
                  <Html center>
                    <div className="loading-spinner" />
                  </Html>
                }>
                  <SolarSystem 
                    handlePlanetClick={handlePlanetClick}
                    currentPlanet={currentPlanet}
                    isTransitioning={isTransitioning}
                    handleTransitionComplete={handleTransitionComplete}
                  />
                  <SpaceshipController 
                    isSpaceshipMode={isSpaceshipMode}
                    setIsSpaceshipMode={setIsSpaceshipMode}
                  />
                </Suspense>
              </Canvas>
            </div>
  
            <Instructions isSpaceshipMode={isSpaceshipMode} />
            
            <AnimatePresence mode="wait">
              {isLoading && <Loading />}
              {showInfo && currentPlanet && !isTransitioning && (
                <PageContent
                  page={currentPlanet}
                  onClose={handleCloseDetailView}
                />
              )}
            </AnimatePresence>
          </div>
        </ThemeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;