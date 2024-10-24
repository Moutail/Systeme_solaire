import { Howl, Howler } from 'howler';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.initialized = false;
    this.globalVolume = 0.5;
  }

  init() {
    if (this.initialized) return;
    
    const createSound = (name, src, options = {}) => {
      return new Howl({
        src: [src],
        ...options,
        format: ['mp3', 'wav'],
        onloaderror: (id, error) => {
          console.error(`Error loading ${name} sound:`, error);
          // Tentative de chargement du format alternatif
          const altFormat = src.endsWith('.mp3') ? src.replace('.mp3', '.wav') : src.replace('.wav', '.mp3');
          console.log(`Attempting to load alternative format: ${altFormat}`);
          this.sounds[name] = createSound(name, altFormat, options);
        },
        onload: () => console.log(`${name} sound loaded successfully`),
      });
    };

    this.sounds = {
      ambient: createSound('ambient', '/sounds/ambient.mp3', { loop: true, volume: 0.3 }),
      click: createSound('click', '/sounds/click.mp3', { volume: 0.5 }),
      //transition: createSound('transition', '/sounds/transition.mp3', { volume: 0.4 }),
      planetHover: createSound('planetHover', '/sounds/hover.mp3', { volume: 0.2 }),
    };

    this.initialized = true;
    Howler.volume(this.globalVolume);
  }

  play(soundName) {
    if (!this.initialized) {
      console.warn('SoundManager not initialized. Call init() first.');
      return;
    }
    const sound = this.sounds[soundName];
    if (sound) {
      sound.play();
    } else {
      console.warn(`Sound "${soundName}" not found.`);
    }
  }

  stop(soundName) {
    if (!this.initialized) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.stop();
    }
  }

  startAmbient() {
    if (!this.initialized) {
      console.warn('SoundManager not initialized. Call init() first.');
      return;
    }
    this.sounds.ambient.play();
  }

  stopAmbient() {
    if (this.initialized && this.sounds.ambient) {
      this.sounds.ambient.stop();
    }
  }

  setGlobalVolume(volume) {
    this.globalVolume = volume;
    Howler.volume(volume);
  }

  setSoundVolume(soundName, volume) {
    if (!this.initialized) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.volume(volume);
    }
  }

  mute() {
    Howler.mute(true);
  }

  unmute() {
    Howler.mute(false);
  }
}

export default new SoundManager();