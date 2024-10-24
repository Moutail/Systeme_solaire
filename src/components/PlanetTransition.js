// PlanetTransition.js - Correction du composant de transition
import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

function PlanetTransition({ targetPosition, isTransitioning, onTransitionComplete }) {
  const { camera } = useThree();
  const transitionRef = useRef(null);

  useEffect(() => {
    if (isTransitioning && targetPosition) {
      // Arrêter toute animation précédente
      if (transitionRef.current) {
        transitionRef.current.kill();
      }

      const startPosition = camera.position.clone();
      const endPosition = new THREE.Vector3(
        targetPosition.x + 20, // Légère distance pour voir la planète
        targetPosition.y + 10,
        targetPosition.z + 20
      );

      // Créer une nouvelle animation
      transitionRef.current = gsap.timeline({
        onComplete: () => {
          onTransitionComplete();
        }
      });

      transitionRef.current.to(camera.position, {
        duration: 2,
        x: endPosition.x,
        y: endPosition.y,
        z: endPosition.z,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(targetPosition);
        }
      });
    }

    return () => {
      if (transitionRef.current) {
        transitionRef.current.kill();
      }
    };
  }, [isTransitioning, targetPosition, camera, onTransitionComplete]);

  return null;
}

export default PlanetTransition;