import { getSoundEnabled } from './storage';

// High-quality, lightweight SFX from reliable CDN
const SFX_URLS = {
  tap: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
  success: 'https://www.soundjay.com/buttons/sounds/button-09.mp3',
  error: 'https://www.soundjay.com/buttons/sounds/button-10.mp3',
  toggle: 'https://www.soundjay.com/buttons/sounds/button-21.mp3',
  nav: 'https://www.soundjay.com/buttons/sounds/button-28.mp3',
  magic: 'https://www.soundjay.com/misc/sounds/magic-chime-02.mp3'
};

class AudioService {
  private sounds: Record<string, HTMLAudioElement> = {};
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.initialized) return;

    Object.entries(SFX_URLS).forEach(([key, url]) => {
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds[key] = audio;
      } catch (e) {
        console.error(`Error initializing sound: ${key}`, e);
      }
    });
    this.initialized = true;
  }

  play(type: keyof typeof SFX_URLS) {
    if (!getSoundEnabled()) return;

    const sound = this.sounds[type];
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.volume = type === 'tap' ? 0.3 : 0.5;
        const promise = sound.play();
        if (promise !== undefined) {
          promise.catch(error => {
            // This is expected if user hasn't interacted with the page yet
            console.debug(`Autoplay prevented for ${type}:`, error);
          });
        }
      } catch (e) {
        console.error(`Error playing sound ${type}:`, e);
      }
    }
  }
}

export const audioService = new AudioService();
