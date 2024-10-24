import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Sun({ 
  position = [0, 0, 0], 
  size = 5, 
 textureUrl={`${process.env.PUBLIC_URL}/textures/sun_texture.jpg`}
}) {
  const sunRef = useRef();
  
  // Gérer le chargement de la texture avec gestion d'erreur
  const texture = useTexture(textureUrl, (texture) => {
    console.log('Texture solaire chargée avec succès');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }, (error) => {
    console.error('Erreur de chargement de la texture solaire:', error);
  });

  // Créer le shader material avec useMemo pour optimiser les performances
  const sunMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      sunTexture: { value: texture },
      intensity: { value: 1.2 },    // Contrôle de l'intensité
      noiseScale: { value: 10.0 },  // Échelle du bruit
      distortionScale: { value: 0.05 } // Échelle de distorsion
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform sampler2D sunTexture;
      uniform float intensity;
      uniform float noiseScale;
      uniform float distortionScale;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      
      // Amélioration de la fonction de bruit
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,
                           0.366025403784439,
                          -0.577350269189626,
                           0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
             + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                               dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main() {
        // Ajout de distorsion UV basée sur le temps
        vec2 uv = vUv + distortionScale * vec2(
          cos(time + vUv.x * 10.0),
          sin(time + vUv.y * 10.0)
        );
        
        // Génération de plusieurs couches de bruit
        float n1 = snoise(uv * noiseScale + time);
        float n2 = snoise(uv * noiseScale * 2.0 - time * 0.5);
        float noise = (n1 + n2) * 0.5;
        
        // Sample de la texture avec distorsion
        vec4 texColor = texture2D(sunTexture, uv);
        
        // Création de la couleur finale
        vec3 baseColor = vec3(1.0, 0.7, 0.3);
        vec3 color = mix(texColor.rgb, baseColor, 0.5 + 0.5 * noise);
        
        // Ajout de variation de luminosité
        float brightness = 0.8 + 0.2 * snoise(uv * 20.0 + time * 0.1);
        color *= brightness * intensity;
        
        // Ajout d'effet de bord basé sur la normale
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        color += vec3(1.0, 0.6, 0.3) * fresnel * 0.5;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    transparent: true,
    side: THREE.FrontSide
  }), [texture]);

  // Animation et mise à jour du shader
  useFrame((state) => {
    if (sunMaterial && sunMaterial.uniforms) {
      sunMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={position}>
      <Sphere args={[size, 64, 64]} ref={sunRef}>
        <primitive object={sunMaterial} attach="material" />
      </Sphere>
      <pointLight 
        color="#FFA726"
        intensity={2} 
        distance={1000} 
        decay={2}
      />
      {/* Ajout d'une lumière ambiante pour l'effet de lueur */}
      <ambientLight color="#FFE0B2" intensity={0.5} />
    </group>
  );
}

export default Sun;
