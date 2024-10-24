import React, { useCallback, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Zoom({ isSpaceshipActive }) {
  const { camera, gl } = useThree();
  const targetZoom = useRef(camera.position.z);
  const zoomSpeed = useRef(0);
  const lastWheelTime = useRef(Date.now());
  
  const handleWheel = useCallback((event) => {
    if (isSpaceshipActive) return; // Désactive le zoom si le vaisseau est actif

    event.preventDefault();
    const now = Date.now();
    const timeDiff = now - lastWheelTime.current;
    lastWheelTime.current = now;

    const zoomFactor = 0.1;
    const acceleration = Math.min(1, timeDiff / 100);
    zoomSpeed.current += event.deltaY * zoomFactor * acceleration;

    targetZoom.current = THREE.MathUtils.clamp(
      targetZoom.current + zoomSpeed.current,
      10,
      100
    );
  }, [isSpaceshipActive]);

  useEffect(() => {
    const domElement = gl.domElement;
    domElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => domElement.removeEventListener('wheel', handleWheel);
  }, [gl, handleWheel]);

  useFrame(() => {
    if (!isSpaceshipActive) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZoom.current, 0.1);
      zoomSpeed.current *= 0.9;
    }
  });

  return null;
}

export default Zoom;