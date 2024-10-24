import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BackgroundParticles({ count = 5000, boxSize = 100 }) {
  const mesh = useRef();
  const [positions, colors, initialPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * boxSize;
      const y = (Math.random() - 0.5) * boxSize;
      const z = (Math.random() - 0.5) * boxSize;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    return [positions, colors, initialPositions];
  }, [count, boxSize]);

  useEffect(() => {
    if (mesh.current) {
      mesh.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      mesh.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
  }, [positions, colors]);

  useFrame((state) => {
    if (mesh.current) {
      const time = state.clock.getElapsedTime();
      const positionAttribute = mesh.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const offset = 0.5; // Amplitude du mouvement
        positionAttribute.array[i3] = initialPositions[i3] + Math.sin(time * 0.5 + initialPositions[i3]) * offset;
        positionAttribute.array[i3 + 1] = initialPositions[i3 + 1] + Math.cos(time * 0.5 + initialPositions[i3 + 1]) * offset;
        positionAttribute.array[i3 + 2] = initialPositions[i3 + 2] + Math.sin(time * 0.5 + initialPositions[i3 + 2]) * offset;
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry />
      <pointsMaterial size={0.1} vertexColors />
    </points>
  );
}

export default BackgroundParticles;