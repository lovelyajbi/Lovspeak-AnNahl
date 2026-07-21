import { getSoundEnabled } from './storage';

// soundjay.com no longer serves these paths (confirmed 404 on every one) —
// disabled rather than pointed at another unverified external host, since a
// dead SFX feature is silent while a spammed 404 on every page load is not.
const SFX_URLS: Record<string, string> = {};

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
