import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function PlanetLOD({ position, color, scale = 1, minDistance = 10, maxDistance = 50, rings, ringColor, atmosphere }) {
  const meshRef = useRef();
  const ringsRef = useRef();
  const atmosphereRef = useRef();
  const { camera } = useThree();
  const [currentLOD, setCurrentLOD] = useState(0);

  const geometries = [
    new THREE.SphereGeometry(1, 8, 8),   // Low detail
    new THREE.SphereGeometry(1, 16, 16), // Medium detail
    new THREE.SphereGeometry(1, 32, 32)  // High detail
  ];

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry = geometries[currentLOD];
    }
  }, [currentLOD]);

  useFrame(() => {
    if (meshRef.current) {
      const distance = meshRef.current.position.distanceTo(camera.position);
      let newLOD;

      if (distance > maxDistance) {
        newLOD = 0; // Low detail
      } else if (distance > minDistance) {
        newLOD = 1; // Medium detail
      } else {
        newLOD = 2; // High detail
      }

      if (newLOD !== currentLOD) {
        setCurrentLOD(newLOD);
      }

      // Dynamic scaling
      const dynamicScale = scale * Math.max(0.1, 5 / distance);
      meshRef.current.scale.setScalar(dynamicScale);
      if (ringsRef.current) ringsRef.current.scale.setScalar(dynamicScale);
      if (atmosphereRef.current) atmosphereRef.current.scale.setScalar(dynamicScale);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <meshStandardMaterial color={color} />
      </mesh>
      {rings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.8, 64]} />
          <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      )}
      {atmosphere && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

export default PlanetLOD;