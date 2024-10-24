import React from 'react';
import { motion } from "framer-motion-3d";
import { Html } from '@react-three/drei';
import { geometries } from '../geometries';

function PlanetDetailView({ planet, onClose, onInteract }) {
  const geometry = geometries[planet.model] || geometries.earth;

  return (
    <motion.group
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.5 }}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial color={planet.color} />
      </mesh>
      <Html position={[0, 0, 2]}>
        <div className="planet-detail">
          <h2>{planet.title}</h2>
          <p>{planet.content}</p>
          <button onClick={onClose}>Fermer</button>
          <button onClick={() => onInteract(planet.title)}>Interagir</button>
        </div>
      </Html>
    </motion.group>
  );
}

export default PlanetDetailView;