import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Moon from './Moon';

function Planet({ 
  position, 
  scale: initialScale = 1,
  texture, 
  bumpMap, 
  cloudTexture, 
  rings, 
  ringTexture, 
  atmosphere, 
  rotationSpeed = 0.005, 
  color,
  name
}) {
  const planetRef = useRef();
  const cloudsRef = useRef();
  const ringsRef = useRef();

  console.log('Planet rendering:', name, { texture, rings, ringTexture });

  // Chargement des textures avec gestion d'erreur
  const textures = useTexture(
    [texture, bumpMap, cloudTexture, ringTexture].filter(Boolean),
    (loadedTextures) => {
      console.log(`Textures loaded for ${name}:`, loadedTextures);
    },
    (error) => {
      console.error(`Error loading textures for ${name}:`, error);
    }
  );

  const [planetTexture, planetBumpMap, cloudMap, ringMap] = textures;

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.1;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += rotationSpeed * 0.5;
    }
  });

  // Debug pour la Terre et la Lune
  useEffect(() => {
    if (name === "Terre") {
      console.log("Terre détectée, échelle:", initialScale);
    }
  }, [name, initialScale]);

  return (
    <group position={position} scale={initialScale}>
      {/* Planète principale */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={planetTexture}
          bumpMap={planetBumpMap}
          bumpScale={0.05}
          color={planetTexture ? 'white' : color || '#888888'}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Nuages */}
      {cloudTexture && cloudMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.01, 64, 64]} />
          <meshPhongMaterial 
            map={cloudMap}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* Anneaux */}
      {rings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 2.5, 64]} />
          <meshPhongMaterial 
            map={ringMap}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            color={ringMap ? 'white' : '#AAAAAA'}
          />
        </mesh>
      )}
      
      {/* Atmosphère */}
      {atmosphere && (
        <mesh>
          <sphereGeometry args={[1.1, 64, 64]} />
          <meshPhongMaterial 
            color={0x88ccff}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Lune pour la Terre */}
      {name === "Terre" && (
        <group position={[0, 0, 0]}>
          <Moon parentScale={initialScale} />
        </group>
      )}
    </group>
  );
}

export default Planet;