import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { lerp } from 'three/src/math/MathUtils';

export default function CameraController({ target }) {
  const { camera, scene } = useThree();
  const targetPosition = useRef(new Vector3());
  const initialPosition = useRef(new Vector3(0, 0, 80));
  const lerpFactor = useRef(0.05);

  useEffect(() => {
    if (target) {
      const targetObject = scene.getObjectByName(target);
      if (targetObject) {
        targetObject.getWorldPosition(targetPosition.current);
        lerpFactor.current = 0.02; // Slower transition when moving to a planet
      }
    } else {
      targetPosition.current.copy(initialPosition.current);
      lerpFactor.current = 0.05; // Faster transition when returning to initial view
    }
  }, [target, scene]);

  useFrame(() => {
    if (target) {
      camera.position.lerp(targetPosition.current, lerpFactor.current);
      camera.lookAt(targetPosition.current);

      // Progressive zoom
      const distance = camera.position.distanceTo(targetPosition.current);
      const targetFOV = lerp(75, 30, 1 - Math.min(distance / 50, 1));
      camera.fov = lerp(camera.fov, targetFOV, 0.05);
      camera.updateProjectionMatrix();
    } else {
      camera.position.lerp(initialPosition.current, lerpFactor.current);
      camera.lookAt(new Vector3(0, 0, 0));
    }

    // Limit camera movement
    const maxDistance = 100;
    if (camera.position.length() > maxDistance) {
      camera.position.setLength(maxDistance);
    }
  });

  return null;
}