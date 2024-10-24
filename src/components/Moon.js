import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Moon({ parentScale = 1 }) {
  const moonRef = useRef();
  const orbitRef = useRef();

  // Debug logs
  console.log('Moon rendering, parentScale:', parentScale);

  // Paramètres de la Lune plus visibles pour le debug
  const moonScale = 1; // Augmenté temporairement pour le debug
  const orbitRadius = 5; // Augmenté pour être plus visible
  const orbitSpeed = 0.5; // Plus rapide pour le debug
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (moonRef.current && orbitRef.current) {
      // Rotation de la lune
      moonRef.current.rotation.y += 0.01;
      
      // Orbite
      const angle = time * orbitSpeed;
      orbitRef.current.position.x = Math.cos(angle) * orbitRadius;
      orbitRef.current.position.z = Math.sin(angle) * orbitRadius;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh 
        ref={moonRef}
        scale={[moonScale, moonScale, moonScale]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#CCCCCC" // Couleur claire pour être plus visible
          roughness={0.8}
          metalness={0.1}
        />
        {/* Ajouter une ligne pour visualiser l'orbite */}
        <line>
          <bufferGeometry>
            {(() => {
              const points = [];
              for (let i = 0; i <= 64; i++) {
                const angle = (i / 64) * Math.PI * 2;
                points.push(
                  Math.cos(angle) * orbitRadius,
                  0,
                  Math.sin(angle) * orbitRadius
                );
              }
              return new Float32Array(points);
            })()}
          </bufferGeometry>
          <lineBasicMaterial color="white" />
        </line>
      </mesh>
    </group>
  );
}

export default Moon;