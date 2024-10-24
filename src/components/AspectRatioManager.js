import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

function AspectRatioManager() {
  const { camera, size } = useThree();

  useEffect(() => {
    const handleResize = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const aspect = window.innerWidth / window.innerHeight;

      // Ajuster le champ de vision plutôt que l'aspect ratio
      if (isPortrait) {
        camera.fov = 75 * (1 / aspect);
      } else {
        camera.fov = 75;
      }

      // Ajuster la position de la caméra pour maintenir la vue d'ensemble
      const distance = isPortrait ? 400 / aspect : 400;
      camera.position.z = distance;
      
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  return null;
}

export default AspectRatioManager;