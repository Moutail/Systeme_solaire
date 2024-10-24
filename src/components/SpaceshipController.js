import React, { useState, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Spaceship from './Spaceship';

function SpaceshipController({ isSpaceshipMode, setIsSpaceshipMode }) {
  const { camera } = useThree();
  const [position, setPosition] = useState(() => new THREE.Vector3(0, 0, 50));
  const [rotation, setRotation] = useState(() => new THREE.Euler(0, Math.PI, 0));
  const velocity = useRef(new THREE.Vector3());
  const speed = useRef(0.1);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isSpaceshipMode) return;
      switch (event.key.toLowerCase()) {
        case 'w': velocity.current.z = -speed.current; break;
        case 's': velocity.current.z = speed.current; break;
        case 'a': velocity.current.x = -speed.current; break;
        case 'd': velocity.current.x = speed.current; break;
        case 'q': velocity.current.y = speed.current; break;
        case 'e': velocity.current.y = -speed.current; break;
        case 'shift': speed.current = 0.2; break;
        default: break;
      }
    };

    const handleKeyUp = (event) => {
      if (!isSpaceshipMode) return;
      switch (event.key.toLowerCase()) {
        case 'w':
        case 's': velocity.current.z = 0; break;
        case 'a':
        case 'd': velocity.current.x = 0; break;
        case 'q':
        case 'e': velocity.current.y = 0; break;
        case 'shift': speed.current = 0.1; break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpaceshipMode]);

  useFrame((state, delta) => {
    if (isSpaceshipMode) {
      // Mise à jour de la position
      position.add(velocity.current);
      setPosition(new THREE.Vector3().copy(position));

      // Mise à jour de la rotation
      if (velocity.current.length() > 0) {
        const lookAt = new THREE.Vector3().copy(position).add(velocity.current);
        const newRotation = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(position, lookAt, new THREE.Vector3(0, 1, 0))
          )
        );
        setRotation(newRotation);
      }
    }
  });

  return <Spaceship position={position} rotation={rotation} />;
}

export default SpaceshipController;