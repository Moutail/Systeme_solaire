import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Spaceship({ position, rotation }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    // Animation simple : faire "flotter" le vaisseau
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh>
        <coneGeometry args={[1, 2, 32]} />
        <meshStandardMaterial 
          color="silver" 
          metalness={0.8} 
          roughness={0.2}
          // Assurez-vous que le matériau du vaisseau n'interfère pas avec les autres
          side={THREE.FrontSide}
          transparent={false}
        />
      </mesh>
      
      {/* Ailes */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.5, 1, 3]} />
        <meshStandardMaterial color="darkgray" />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 0.5, 0.5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="blue" transparent opacity={0.7} />
      </mesh>
      
      {/* Réacteurs */}
      <pointLight position={[0, -1, 0]} color="orange" intensity={1} distance={2} />
    </group>
  );
}

export default Spaceship;