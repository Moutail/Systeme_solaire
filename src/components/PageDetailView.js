import React, { useRef, useState } from 'react';
import { motion } from "framer-motion-3d";
import { Html, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FixedSizeList as List } from 'react-window';

function PageDetailView({ page, onClose }) {
  const group = useRef();
  const scrollRef = useRef();
  const [hovered, setHovered] = useState(false);

    // Chargez un modèle 3D spécifique à chaque page (assurez-vous d'avoir ces modèles)
    const { nodes } = useGLTF(`/models/${page.title.toLowerCase()}.glb`);

    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      group.current.rotation.y = Math.sin(t / 2) / 10;
      group.current.position.y = Math.sin(t / 1.5) / 10;
    });

    const Row = ({ index, style }) => (
        <div style={style}>
          <p>{page.content.split('.')[index]}.</p>
        </div>
      );

  return (
    <motion.group
    ref={group}
    initial={{ scale: 0, rotateY: Math.PI }}
    animate={{ scale: 1, rotateY: 0 }}
    exit={{ scale: 0, rotateY: -Math.PI }}
    transition={{ duration: 0.5 }}
  >
    <mesh position={[0, 0, 0]} scale={hovered ? 1.1 : 1}>
      <planeGeometry args={[4, 6]} />
      <meshPhongMaterial color={page.color} />
    </mesh>
    {/* Ajout d'un élément 3D interactif spécifique à la page */}
    <mesh 
        geometry={nodes.Cube.geometry}
        position={[2, 2, 0.5]}
        scale={0.5}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
      <Html position={[0, 0, 0.1]} transform occlude>
        <div style={{
          width: '300px',
          height: '400px',
          padding: '20px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ color: page.color }}>{page.title}</h2>
          <List
            height={300}
            itemCount={page.content.split('.').length}
            itemSize={35}
            width={260}
          >
            {Row}
          </List>
          <button onClick={onClose} style={{
            background: page.color,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>Fermer</button>
        </div>
      </Html>
    </motion.group>
  );
}

export default PageDetailView;