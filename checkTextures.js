const fs = require('fs');
const path = require('path');

const texturesDir = path.join(__dirname, 'public', 'textures');

const texturesToCheck = [
  'earth_daymap.jpg',
  'earth_bumpmap.jpg',
  'earth_clouds.jpg',
  'mars_texture.jpg',
  'mars_bumpmap.jpg',
  'jupiter_texture.jpg',
  'jupiter_clouds.png',
  'saturn_texture.jpg',
  'venus_texture.jpg'
];

console.log('Checking for texture files...');

texturesToCheck.forEach(texture => {
  const texturePath = path.join(texturesDir, texture);
  if (fs.existsSync(texturePath)) {
    console.log(`✅ ${texture} exists`);
  } else {
    console.log(`❌ ${texture} does not exist`);
  }
});