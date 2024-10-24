import React from 'react';
import { Html } from '@react-three/drei';

function PlanetTooltip({ title, visible }) {
  if (!visible) return null;

  return (
    <Html distanceFactor={10}>
      <div className="planet-tooltip">
        {title}
      </div>
    </Html>
  );
}

export default PlanetTooltip;