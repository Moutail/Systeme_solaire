import { useState, useCallback } from 'react';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

function UniverseController({ planets, camera }) {
  const [activeTarget, setActiveTarget] = useState(null);

  const moveToTarget = useCallback((target) => {
    if (!camera) return;
    
    setActiveTarget(target);
    const targetPosition = new THREE.Vector3(target.position[0], target.position[1], target.position[2]);
    const distance = camera.position.distanceTo(targetPosition);
    const duration = Math.min(2, distance * 0.01);

    new TWEEN.Tween(camera.position)
      .to(targetPosition, duration * 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

    new TWEEN.Tween(camera.rotation)
      .to(new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, -1),
          targetPosition.clone().sub(camera.position).normalize()
        )
      ), duration * 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }, [camera]);

  const resetView = useCallback(() => {
    if (!camera) return;
    
    setActiveTarget(null);
    new TWEEN.Tween(camera.position)
      .to(new THREE.Vector3(0, 0, 50), 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

    new TWEEN.Tween(camera.rotation)
      .to(new THREE.Euler(0, 0, 0), 2000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }, [camera]);

  return { activeTarget, moveToTarget, resetView };
}

export default UniverseController;