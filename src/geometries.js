import * as THREE from 'three';

export const geometries = {
  earth: new THREE.SphereGeometry(1, 32, 32),
  mars: new THREE.DodecahedronGeometry(1),
  jupiter: new THREE.IcosahedronGeometry(1),
  saturn: new THREE.TorusGeometry(1, 0.4, 16, 100),
  venus: new THREE.OctahedronGeometry(1),
  neptune: new THREE.TetrahedronGeometry(1),
  mercury: new THREE.BoxGeometry(1, 1, 1),
  uranus: new THREE.ConeGeometry(1, 2, 32),
  pluto: new THREE.CircleGeometry(1, 32),
  moon: new THREE.RingGeometry(0.5, 1, 32)
};