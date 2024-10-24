import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Sun({ position = [0, 0, 0], size = 5 }) {  // Retiré textureUrl des props
  const sunRef = useRef();
  
  // Définir le chemin de la texture à l'intérieur du composant
  const [texture] = useTexture([`${process.env.PUBLIC_URL}/textures/sun_texture.jpg`], (loadedTexture) => {
    console.log('Texture chargée avec succès');
  }, (error) => {
    console.error('Erreur de chargement de la texture:', error);
  });

  // Shader Material
  const sunMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      sunTexture: { value: texture }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform sampler2D sunTexture;
      varying vec2 vUv;
      
      float noise(vec2 uv) {
        return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      void main() {
        vec2 uv = vUv;
        float n = noise(uv * 10.0 + time);
        
        vec4 texColor = texture2D(sunTexture, uv + 0.05 * vec2(cos(time + uv.x * 10.0), sin(time + uv.y * 10.0)));
        vec3 color = mix(texColor.rgb, vec3(1.0, 0.7, 0.3), 0.5 + 0.5 * n);
        color *= 0.8 + 0.2 * noise(uv * 20.0 + time * 0.1);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), [texture]);

  useFrame((state) => {
    if (sunMaterial.uniforms) {
      sunMaterial.uniforms.time.value = state.clock.getElapsedTime();
    }
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={position}>
      <mesh ref={sunRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>
      <pointLight 
        color="#FFA726" 
        intensity={2} 
        distance={1000} 
        decay={2} 
      />
      <ambientLight 
        color="#FFE0B2" 
        intensity={0.5} 
      />
    </group>
  );
}

export default Sun;