import React from 'react';

const BASE_TEXTURE_PATH = process.env.PUBLIC_URL + '/textures/';
console.log('BASE_TEXTURE_PATH:', BASE_TEXTURE_PATH);

export const planets = [
  {
    title: "Mercure",
    name: "Mercure",
    content: (
      <div>
        <h1>Mercure</h1>
        <p>La planète la plus proche du Soleil, caractérisée par ses températures extrêmes.</p>
      </div>
    ),
    color: "#888888",
    orbitRadius: 50,
    scale: 3,
    texture: BASE_TEXTURE_PATH + 'mercury.jpg',
    bumpMap: BASE_TEXTURE_PATH + 'mercury_bumpmap.jpg',
    rotationSpeed: 0.01,
    orbitSpeed: 0.01,
    atmosphere: false
  },
  {
    title: "Vénus",
    name: "Venus",
    content: (
      <div>
        <h1>Vénus</h1>
        <p>Souvent appelée la jumelle de la Terre, Vénus a une atmosphère dense et toxique.</p>
      </div>
    ),
    color: "#e6e6e6",
    orbitRadius: 75,
    scale: 5,
    texture: BASE_TEXTURE_PATH + 'venus_texture.jpg',
    bumpMap: BASE_TEXTURE_PATH + 'venus_bumpmap.jpg',
    rotationSpeed: 0.005,
    orbitSpeed: 0.007,
    atmosphere: true
  },
  {
    title: "Terre",
    name: "Terre",
    content: (
      <div>
        <h1>Bienvenue sur la Terre</h1>
        <p>Notre planète bleue, la seule connue pour abriter la vie.</p>
      </div>
    ),
    color: "#4287f5",
    orbitRadius: 100,
    scale: 6,
    texture: BASE_TEXTURE_PATH + 'earth_daymap.jpg',
    bumpMap: BASE_TEXTURE_PATH + 'earth_bumpmap.jpg',
    cloudTexture: BASE_TEXTURE_PATH + 'earth_clouds.jpg',
    rotationSpeed: 0.003,
    orbitSpeed: 0.005,
    atmosphere: true,
    hasMoon: true,
    moon: {
      texture: BASE_TEXTURE_PATH + 'moon.jpg',
      bumpMap: BASE_TEXTURE_PATH + 'moon_bumpmap.jpg',
      scale: 0.27,
      orbitRadius: 2.5,
      orbitSpeed: 0.015,
      rotationSpeed: 0.002,
      color: "#CCCCCC"
    }
  },
  {
    title: "Mars",
    name: "Mars",
    content: (
      <div>
        <h1>Mars</h1>
        <p>La planète rouge, cible de nombreuses missions d'exploration spatiale.</p>
      </div>
    ),
    color: "#f54242",
    orbitRadius: 150,
    scale: 4,
    texture: BASE_TEXTURE_PATH + 'mars_texture.jpg',
    bumpMap: BASE_TEXTURE_PATH + 'mars_bumpmap.jpg',
    rotationSpeed: 0.004,
    orbitSpeed: 0.003,
    atmosphere: false
  },
  {
    title: "Jupiter",
    name: "Jupiter",
    content: (
      <div>
        <h1>Jupiter</h1>
        <p>La plus grande planète du système solaire, connue pour sa Grande Tache Rouge.</p>
      </div>
    ),
    color: "#42f554",
    orbitRadius: 200,
    scale: 15,
    texture: BASE_TEXTURE_PATH + 'jupiter_texture.jpg',
    cloudTexture: BASE_TEXTURE_PATH + 'jupiter_clouds.png',
    rotationSpeed: 0.002,
    orbitSpeed: 0.001,
    atmosphere: true
  },
  {
    title: "Saturne",
    name: "Saturne",
    content: (
      <div>
        <h1>Saturne</h1>
        <p>Célèbre pour ses anneaux spectaculaires, Saturne est une géante gazeuse fascinante.</p>
      </div>
    ),
    color: "#f5d142",
    orbitRadius: 250,
    scale: 12,
    texture: BASE_TEXTURE_PATH + 'saturn_texture.jpg',
    rings: true,
    ringTexture: BASE_TEXTURE_PATH + 'saturn_rings.jpg',
    ringInnerRadius: 1.5,
    ringOuterRadius: 2.5,
    rotationSpeed: 0.0015,
    orbitSpeed: 0.0008,
    atmosphere: true
  },
  {
    title: "Uranus",
    name: "Uranus",
    content: (
      <div>
        <h1>Uranus</h1>
        <p>Une géante de glace avec une inclinaison axiale unique qui la fait rouler sur son orbite.</p>
      </div>
    ),
    color: "#42f5f5",
    orbitRadius: 300,
    scale: 8,
    texture: BASE_TEXTURE_PATH + 'uranus.jpg',
    rotationSpeed: 0.005,
    orbitSpeed: 0.0005,
    rings: true,
    ringTexture: BASE_TEXTURE_PATH + 'uranus_rings.jpg',
    ringInnerRadius: 1.2,
    ringOuterRadius: 1.8,
    tilt: 97.77,
    atmosphere: true
  },
  {
    title: "Neptune",
    name: "Neptune",
    content: (
      <div>
        <h1>Neptune</h1>
        <p>La planète la plus éloignée, connue pour ses vents violents et sa couleur bleue profonde.</p>
      </div>
    ),
    color: "#4287f5",
    orbitRadius: 350,
    scale: 7,
    texture: BASE_TEXTURE_PATH + 'neptune.jpg',
    rotationSpeed: 0.006,
    orbitSpeed: 0.0004,
    atmosphere: true
  }
];

// Ajout d'une vérification des textures plus détaillée
planets.forEach(planet => {
  console.log(`Vérification de ${planet.name || planet.title}:`);
  const checkTexture = (path, type) => {
    if (path) {
      const img = new Image();
      img.onerror = () => console.error(`❌ ${type} introuvable:`, path);
      img.onload = () => console.log(`✅ ${type} chargée:`, path);
      img.src = path;
    }
  };

  checkTexture(planet.texture, 'Texture principale');
  checkTexture(planet.bumpMap, 'Bump map');
  checkTexture(planet.cloudTexture, 'Texture des nuages');
  checkTexture(planet.ringTexture, 'Texture des anneaux');
  
  if (planet.hasMoon) {
    checkTexture(planet.moon.texture, 'Texture de la lune');
    checkTexture(planet.moon.bumpMap, 'Bump map de la lune');
  }
  
  console.log('---');
});

export const getTextureUrl = (path) => {
  return path ? new URL(path, window.location.href).href : null;
};