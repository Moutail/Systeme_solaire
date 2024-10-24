import React, { useState, useCallback, useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useDrag } from 'react-use-gesture';
import { DoubleSide, Vector3 } from 'three';
import { motion } from "framer-motion-3d";
import SoundManager from '../utils/SoundManager';

function Page3D({ position, color, title, content, onClick }) {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const groupRef = useRef();
  const initialPosition = useRef(new Vector3(...position));

  const { scale, rotation, positionSpring } = useSpring({
    scale: hovered && !dragging ? 1.1 : 1,
    rotation: hovered && !dragging ? [0, Math.PI / 8, 0] : [0, 0, 0],
    positionSpring: dragging ? [position[0], position[1] + 0.5, position[2]] : position,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  const bind = useDrag(({ active, movement: [x, y], first, last }) => {
    if (first) setDragging(true);
    if (last) setDragging(false);
    
    const moveX = x / aspect;
    const moveY = -y / aspect;
    
    groupRef.current.position.x = initialPosition.current.x + moveX * 0.01;
    groupRef.current.position.y = initialPosition.current.y + moveY * 0.01;

    if (active) {
      SoundManager.play('drag');
    }
  });

  useFrame(() => {
    if (!dragging) {
      groupRef.current.position.lerp(initialPosition.current, 0.1);
    }
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    SoundManager.play('hover');
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
  }, []);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    if (!dragging) {
      SoundManager.play('click');
      onClick();
    }
  }, [onClick, dragging]);

  return (
    <animated.group
      ref={groupRef}
      position-y={positionSpring.y}
      rotation={rotation}
      scale={scale}
      {...bind()}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh>
        <planeGeometry args={[2, 3]} />
        <meshPhongMaterial color={color} side={DoubleSide} />
      </mesh>
      <Html position={[0, 0, 0.06]} transform occlude>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.8)', 
          padding: '20px', 
          borderRadius: '10px',
          width: '200px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: color }}>{title}</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.4' }}>{content.substring(0, 100)}...</p>
        </div>
      </Html>
    </animated.group>
  );
}

export default React.memo(Page3D);