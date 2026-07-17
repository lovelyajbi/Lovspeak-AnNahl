// Shared Text-to-Speech wrapper.
// Keeps browser speech state in one place and avoids cancel/speak races on mobile.

class TTSService {
  private static readonly CANCEL_SETTLE_DELAY_MS = 50;

  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private pendingSpeakTimer: ReturnType<typeof setTimeout> | null = null;
  private requestId = 0;
  private lastCancelAt = 0;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.refreshVoices();
      window.speechSynthesis.addEventListener('voiceschanged', this.refreshVoices);
    }
  }

  private refreshVoices = (): SpeechSynthesisVoice[] => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.voices = [];
      return this.voices;
    }

    // Always replace the list, including with an empty list. Reusing voice
    // objects from before an Android TTS engine restart can leave stale voices.
    this.voices = window.speechSynthesis.getVoices();
    return this.voices;
  };

  private clearPendingTimer() {
    if (this.pendingSpeakTimer) {
      clearTimeout(this.pendingSpeakTimer);
      this.pendingSpeakTimer = null;
    }
  }

  private findVoice(voices: SpeechSynthesisVoice[], lang: string) {
    const normalizedLang = lang.toLowerCase();
    const baseLang = normalizedLang.split('-')[0];
    const matchingVoices = voices.filter(voice => {
      const voiceLang = voice.lang.toLowerCase();
      return voiceLang === normalizedLang || voiceLang.startsWith(`${baseLang}-`) || voiceLang === baseLang;
    });

    if (baseLang === 'en') {
      return (
        matchingVoices.find(voice => /neural/i.test(voice.name) && voice.lang.toLowerCase().startsWith('en-us')) ||
        matchingVoices.find(voice => /google us english/i.test(voice.name)) ||
        matchingVoices.find(voice => /enhanced/i.test(voice.name) && voice.lang.toLowerCase().startsWith('en-us')) ||
        matchingVoices.find(voice => voice.lang.toLowerCase() === normalizedLang) ||
        matchingVoices[0]
      );
    }

    return (
      matchingVoices.find(voice => voice.lang.toLowerCase() === normalizedLang) ||
      matchingVoices[0]
    );
  }

  speak(
    text: string,
    lang: string = 'en-US',
    rate: number = 0.9,
    pitch: number = 1.0,
    onEndCallback?: () => void,
    onErrorCallback?: () => void
  ) {
    if (
      typeof window === 'undefined' ||
      !window.speechSynthesis ||
      typeof SpeechSynthesisUtterance === 'undefined'
    ) {
      console.warn('Speech synthesis is not supported on this device/browser.');
      onErrorCallback?.();
      return;
    }

    const cleanText = text.replace(/\s*\(.*\)\s*/g, '').trim();
    if (!cleanText) {
      onErrorCallback?.();
      return;
    }

    const synth = window.speechSynthesis;
    const currentRequestId = ++this.requestId;
    this.clearPendingTimer();

    try {
      const shouldCancel =
        synth.speaking ||
        synth.pending ||
        this.activeUtterance !== null;

      if (shouldCancel) {
        // Invalidate the previous utterance before cancel() can dispatch a late
        // "canceled" or "interrupted" event.
        this.activeUtterance = null;
        synth.cancel();
        this.lastCancelAt = Date.now();
      }

      const startSpeaking = (useDefaultVoice = false) => {
        if (currentRequestId !== this.requestId) return;

        try {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = lang;
          utterance.rate = rate;
          utterance.pitch = pitch;

          // Read the live list for every request. If Android has not exposed
          // voices yet, leaving utterance.voice unset lets the engine choose.
          const availableVoices = this.refreshVoices();
          const matchedVoice = useDefaultVoice ? undefined : this.findVoice(availableVoices, lang);
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }

          // Keep a strong reference until the active request finishes.
          this.activeUtterance = utterance;

          utterance.onend = () => {
            if (
              currentRequestId !== this.requestId ||
              this.activeUtterance !== utterance
            ) return;

            this.activeUtterance = null;
            onEndCallback?.();
          };

          utterance.onerror = event => {
            if (
              currentRequestId !== this.requestId ||
              this.activeUtterance !== utterance
            ) return;

            this.activeUtterance = null;

            // If an explicitly selected system voice disappeared, retry once
            // and let Android choose its current default voice.
            if (
              !useDefaultVoice &&
              matchedVoice &&
              event.error === 'voice-unavailable'
            ) {
              this.pendingSpeakTimer = setTimeout(
                () => {
                  this.pendingSpeakTimer = null;
                  startSpeaking(true);
                },
                TTSService.CANCEL_SETTLE_DELAY_MS
              );
              return;
            }

            console.error('SpeechSynthesisUtterance execution error:', event.error, event);
            onErrorCallback?.();
          };

          if (synth.paused) {
            synth.resume();
          }
          synth.speak(utterance);
        } catch (error) {
          if (currentRequestId !== this.requestId) return;
          this.activeUtterance = null;
          console.error('Failed to play Text-to-Speech:', error);
          onErrorCallback?.();
        }
      };

      const remainingSettleDelay = Math.max(
        0,
        TTSService.CANCEL_SETTLE_DELAY_MS - (Date.now() - this.lastCancelAt)
      );

      if (remainingSettleDelay > 0) {
        // Restore the settle window used before the shared-service refactor.
        // A newer request inside that window keeps the remaining delay instead
        // of bypassing it.
        this.pendingSpeakTimer = setTimeout(
          () => {
            this.pendingSpeakTimer = null;
            startSpeaking();
          },
          remainingSettleDelay
        );
      } else {
        startSpeaking();
      }
    } catch (e) {
      console.error('Failed to play Text-to-Speech:', e);
      onErrorCallback?.();
    }
  }

  cancel() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      ++this.requestId;
      this.clearPendingTimer();
      this.activeUtterance = null;
      window.speechSynthesis.cancel();
      this.lastCancelAt = Date.now();
    }
  }
}

export const ttsService = new TTSService();
