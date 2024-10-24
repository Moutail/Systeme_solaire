import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

function MouseController() {
  const { camera } = useThree();
  const movementRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(new THREE.Vector3(0, 0, 100));
  const velocityRef = useRef(new THREE.Vector3());
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDraggingRef.current) {
        movementRef.current.x += event.movementX;
        movementRef.current.y += event.movementY;
      }
    };

    const handleMouseDown = () => {
      isDraggingRef.current = true;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (event) => {
      const zoomSpeed = event.deltaY * 0.01;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      velocityRef.current.addScaledVector(forward, zoomSpeed);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera]);

  useFrame((state, delta) => {
    // Rotation
    rotationRef.current.y -= movementRef.current.x * 0.002;
    rotationRef.current.x -= movementRef.current.y * 0.002;
    rotationRef.current.x = THREE.MathUtils.clamp(rotationRef.current.x, -Math.PI / 2, Math.PI / 2);
    
    camera.rotation.order = 'YXZ';
    camera.rotation.x = rotationRef.current.x;
    camera.rotation.y = rotationRef.current.y;

    movementRef.current.x = 0;
    movementRef.current.y = 0;

    // Movement
    positionRef.current.add(velocityRef.current);
    camera.position.copy(positionRef.current);

    // Apply damping to slow down movement
    velocityRef.current.multiplyScalar(0.9);
  });

  return null;
}

export default MouseController;