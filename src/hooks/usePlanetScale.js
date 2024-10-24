import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';

export function usePlanetScale(initialScale = 1) {
  const { viewport } = useThree();
  const [planetScale, setPlanetScale] = useState(initialScale);

  useEffect(() => {
    const updateScale = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const isLandscape = aspect > 1;
      
      // Calculer l'échelle en préservant les proportions
      let scale = initialScale;
      if (!isLandscape) {
        scale = initialScale * Math.min(1, aspect);
      }
      
      setPlanetScale([scale, scale, scale]);
    };

    window.addEventListener('resize', updateScale);
    updateScale();

    return () => window.removeEventListener('resize', updateScale);
  }, [initialScale, viewport]);

  return planetScale;
}