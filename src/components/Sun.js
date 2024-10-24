import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Sun({ position = [0, 0, 0], size = 5, textureUrl = '/textures/sun_texture.jpg' }) {
  const sunRef = useRef();
  const texture = useTexture(textureUrl);

  // Shader pour créer l'effet de surface solaire avec texture
  const sunMaterial = new THREE.ShaderMaterial({
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
        
        // Sample the texture
        vec4 texColor = texture2D(sunTexture, uv + 0.05 * vec2(cos(time + uv.x * 10.0), sin(time + uv.y * 10.0)));
        
        // Mix the texture color with our generated color
        vec3 color = mix(texColor.rgb, vec3(1.0, 0.7, 0.3), 0.5 + 0.5 * n);
        
        // Add some brightness variation
        color *= 0.8 + 0.2 * noise(uv * 20.0 + time * 0.1);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  useFrame((state) => {
    sunMaterial.uniforms.time.value = state.clock.elapsedTime;
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={position}>
      <Sphere args={[size, 64, 64]} ref={sunRef}>
        <primitive object={sunMaterial} attach="material" />
      </Sphere>
      <pointLight color="white" intensity={1.5} distance={1000} decay={2} />
    </group>
  );
}

export default Sun;