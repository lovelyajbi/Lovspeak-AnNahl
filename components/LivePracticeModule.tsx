
import React, { useRef, useEffect, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decodeAudioData, createPcmBlob, base64ToUint8Array, pcmToWav, downsampleBuffer } from '../utils/audio';
import { ModuleProps, AppView } from '../types';
import { logActivity, getGeminiApiKey, getUserProfile } from '../services/storage';
import { generateTTSAudio } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

const STRICT_FILTER = `
STRICT CONTENT PROHIBITIONS & ISLAMIC ALIGNMENT:
- Religion & Philosophy: Do NOT generate ANY content related to Sufism (sufi), philosophy (filsafat), or any Islamic sects/streams that do not follow pure Islam based strictly on the Quran and Sahih Hadith. All religious explanations, wisdom, and references must be based solely on pure Islam following the Quran and Sahih Hadith.
- General Prohibitions: Do NOT generate ANY content or references related to:
  * Music, singing, musical instruments, concerts, or theater.
  * Movies, films, cinema, or television dramas.
  * Dating (pacaran), romance, or inappropriate free-mixing between genders.
  * Celebrations & Holidays: Maulid (Prophet's birthday), birthdays (ulang tahun / milad), wedding anniversaries, New Year (tahun baru), Halloween, Valentine's Day, Christmas, Easter, or any other non-Islamic holidays.
  * Other: Yoga, meditation, magic, fantasy, horoscopes, astrology, alcohol, pork, or gambling.
- Always use positive, clean, and modest scenarios aligned with pure Islamic values.
`;

const ROLEPLAY_SCENARIOS = [
  { icon: 'fa-utensils', label: 'Restaurant', prompt: 'Ordering food at a restaurant. I am the customer, you are the waiter.' },
  { icon: 'fa-hotel', label: 'Hotel', prompt: 'Checking into a hotel. I am the guest, you are the front desk receptionist.' },
  { icon: 'fa-briefcase', label: 'Interview', prompt: 'A job interview for an office position. I am the candidate, you are the HR interviewer.' },
  { icon: 'fa-shopping-cart', label: 'Shopping', prompt: 'Shopping at a clothing store. I am the customer, you are the shop assistant.' },
  { icon: 'fa-stethoscope', label: 'Doctor', prompt: 'Visiting a doctor for a check-up. I am the patient, you are the doctor.' },
  { icon: 'fa-plane', label: 'Airport', prompt: 'At the airport check-in counter. I am the traveler, you are the airline staff.' },
  { icon: 'fa-phone-alt', label: 'Phone Call', prompt: 'Making a phone call to book a restaurant reservation. I am the caller, you are the host.' },
  { icon: 'fa-graduation-cap', label: 'Campus', prompt: 'First day at university. I am the new student, you are a helpful senior student.' },
];

const drawVisualizer = (canvas: HTMLCanvasElement, dataArray: Uint8Array) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const barWidth = (width / dataArray.length) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    barHeight = dataArray[i] / 2;
    ctx.fillStyle = `rgba(96, 165, 250, ${Math.max(0.2, dataArray[i] / 255)})`;
    ctx.fillRect(x, height / 2 - barHeight / 2, barWidth, barHeight);
    x += barWidth + 1;
  }
};

const LivePracticeModule: React.FC<ModuleProps> = ({ initialContext, onComplete, onSaveProgress }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('Ready to connect');
  const [customTopic, setCustomTopic] = useState(initialContext?.title || '');
  const [speakingMode, setSpeakingMode] = useState<'guided' | 'free' | 'roleplay'>(initialContext?.speakingMode || 'guided');
  const [aiVoice, setAiVoice] = useState<string>('Zephyr');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [aiAccent, setAiAccent] = useState<string>('Default');
  const [showSessionSettings, setShowSessionSettings] = useState(false);
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null);
  const [responseLength, setResponseLength] = useState<'short' | 'medium' | 'long'>('medium');
  
  const VOICE_PROFILES = [
    { id: 'Kore', name: 'Aisha', gender: 'female', icon: 'fa-user-graduate', desc: 'Suara wanita yang profesional, ramah, dan sangat jelas. Sempurna untuk belajar intensif.', color: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/30' },
    { id: 'Aoede', name: 'Sarah', gender: 'female', icon: 'fa-user-nurse', desc: 'Suara wanita yang ringan, santai, dan menenangkan. Cocok untuk teman ngobrol casual.', color: 'from-purple-500 to-fuchsia-500', shadow: 'shadow-purple-500/30' },
    { id: 'Zephyr', name: 'Lovelya', gender: 'female', icon: 'fa-user-circle', desc: 'Suara wanita yang netral, sangat jernih dan bersahabat.', color: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/30' },
    { id: 'Charon', name: 'Hamza', gender: 'male', icon: 'fa-user-shield', desc: 'Suara pria yang sangat berat, tenang, dan berwibawa.', color: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-500/30' },
    { id: 'Puck', name: 'Omar', gender: 'male', icon: 'fa-smile-beam', desc: 'Suara pria yang ceria, enerjik, dan penuh semangat.', color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/30' },
    { id: 'Fenrir', name: 'Keenan', gender: 'male', icon: 'fa-user-tie', desc: 'Suara pria yang tegas, stabil, dan karismatik.', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
  ];

  const handleTestVoice = async (voiceId: string) => {
    if (testingVoiceId) return;
    setTestingVoiceId(voiceId);
    try {
      const base64Audio = await generateTTSAudio("Hi there! I am ready to practice English with you. Let's have a great conversation!", "monologue", undefined, undefined, voiceId, aiAccent);
      if (base64Audio) {
        const binary = base64ToUint8Array(base64Audio);
        const wavBlob = pcmToWav(binary, 24000);
        const url = URL.createObjectURL(wavBlob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => { URL.revokeObjectURL(url); setTestingVoiceId(null); };
        return; // Prevent clearing state immediately if playing
      }
    } catch (e) {
      console.error('Failed to test voice', e);
    }
    setTestingVoiceId(null);
  };
  // Mission Tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const goalMinutes = initialContext?.goalMinutes || 3;
  const targetSeconds = goalMinutes * 60;
  const isMissionActive = !!initialContext;
  const xpReward = initialContext?.xpReward || 15;

  useEffect(() => {
    if (initialContext?.title) {
      setCustomTopic(initialContext.title);
    }
  }, [initialContext]);

  const activeSessionPromiseRef = useRef<Promise<any> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorNodeRef = useRef<ScriptProcessorNode | null>(null);

  // Track whether the user intentionally stopped the session (vs server disconnect)
  const userStoppedRef = useRef<boolean>(false);
  const connectionActiveRef = useRef<boolean>(false);
  const connectionStartInFlightRef = useRef<boolean>(false);
  // Track reconnection attempts to avoid infinite loops
  const reconnectCountRef = useRef<number>(0);
  const MAX_RECONNECTS = 5;
  // Track if component is still mounted to avoid state updates after unmount
  const isMountedRef = useRef<boolean>(true);
  // Track if this is a reconnection (to avoid repeated greetings)
  const isReconnectingRef = useRef<boolean>(false);
  const hasGreetedRef = useRef<boolean>(false);
  const reconnectInFlightRef = useRef<boolean>(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionGenerationRef = useRef(0);
  // AudioWorklet: track the node and whether the module has been loaded into the current AudioContext.
  // The module only needs to be loaded once per AudioContext instance.
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const workletModuleLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      userStoppedRef.current = true; // Prevent auto-reconnect on unmount
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      stopSession(false);
    };
  }, []);

  const startSession = async (forceReconnect = false) => {
    // GUARD: Prevent overlapping initializations.
    if (connectionStartInFlightRef.current || connectionActiveRef.current || reconnectInFlightRef.current) return;
    connectionStartInFlightRef.current = true;
    const sessionGeneration = ++sessionGenerationRef.current;
    const isReconnect = forceReconnect || isReconnectingRef.current || hasGreetedRef.current;
    // Reset the user-stopped flag so auto-reconnect works for new sessions
    userStoppedRef.current = false;
    // Reset reconnecting flag only on fresh user-initiated sessions
    if (reconnectCountRef.current === 0) {
      isReconnectingRef.current = false;
    }
    setIsConnecting(true);
    setStatus(isReconnect ? 'Reconnecting...' : 'Connecting to AI...');

    try {
      // IPAD/SAFARI FIX — INTENTIONAL ORDER, NOT A BUG:
      // AudioContext MUST be created and .resume() called SYNCHRONOUSLY within
      // the user gesture (click handler) BEFORE any async operation like getUserMedia.
      // Safari/iOS blocks AudioContext.resume() if the user gesture has been
      // "consumed" by a prior await. This ordering fixes the "cannot start call"
      // issue on iPad/tablet Safari.
      //
      // RECONNECT SUPPORT: Reuse existing AudioContexts if available.
      // During auto-reconnect (onclose/onerror), startSession() is called from
      // a setTimeout — NOT from a user gesture. Creating new AudioContexts there
      // would fail on Safari. So we keep existing ones alive across reconnections.
      let inputCtx = inputAudioContextRef.current;
      let outputCtx = outputAudioContextRef.current;

      if (!inputCtx || inputCtx.state === 'closed') {
        try {
          inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        } catch {
          // Fallback: Safari may reject non-hardware sample rates (e.g. 16000).
          inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        // New AudioContext created — reset worklet module flag so it gets re-loaded.
        workletModuleLoadedRef.current = false;
      }
      if (!outputCtx || outputCtx.state === 'closed') {
        try {
          outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        } catch {
          outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
      }

      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      // Invoke both resume calls before awaiting so Safari treats both as part
      // of the same user gesture.
      await Promise.all([inputCtx.resume(), outputCtx.resume()]);

      // NOW request microphone access (after AudioContext is safely initialized)
      let stream: MediaStream;
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Browser does not support microphone access or is in an insecure context');
        }

        // Use simpler constraints first to avoid OverconstrainedError on some mobile devices
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
      } catch (micErr: any) {
        console.error("Mic Error Detail:", micErr);
        let errorMsg = 'Microphone access denied';

        if (micErr.name === 'NotAllowedError') {
          errorMsg = 'Microphone permission blocked by browser';
        } else if (micErr.name === 'NotFoundError') {
          errorMsg = 'No microphone found on this device';
        } else if (micErr.name === 'NotReadableError') {
          errorMsg = 'Microphone is already in use by another app';
        } else if (micErr.message) {
          errorMsg = micErr.message;
        }

        // Clean up AudioContexts only if this is a fresh session (not reconnect)
        if (!isReconnectingRef.current) {
          inputCtx.close().catch(() => {});
          outputCtx.close().catch(() => {});
          inputAudioContextRef.current = null;
          outputAudioContextRef.current = null;
        }

        setStatus(errorMsg);
        setIsConnecting(false);
        connectionStartInFlightRef.current = false;
        return;
      }

      streamRef.current = stream;

      const apiKey = getGeminiApiKey() || (process.env.API_KEY as string);
      if (!apiKey) {
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        inputCtx.close().catch(() => {});
        outputCtx.close().catch(() => {});
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        setStatus('API Key missing');
        setIsConnecting(false);
        connectionStartInFlightRef.current = false;
        return;
      }

      // ─── AudioWorklet Setup ─────────────────────────────────────────────────
      // AudioWorkletNode is the modern, non-deprecated replacement for ScriptProcessorNode.
      // We load the worklet module once per AudioContext (tracked by workletModuleLoadedRef)
      // so that reconnects can reuse the already-loaded module without calling addModule again.
      let useAudioWorklet = workletModuleLoadedRef.current; // Already loaded on reconnect
      if (!useAudioWorklet && inputCtx.audioWorklet) {
        try {
          const processorCode = `
            class PCMAudioProcessor extends AudioWorkletProcessor {
              process(inputs) {
                const input = inputs[0];
                if (input && input[0] && input[0].length > 0) {
                  // Copy before transferring to avoid detached buffer issues
                  const data = new Float32Array(input[0]);
                  this.port.postMessage(data, [data.buffer]);
                }
                return true; // Keep processor alive
              }
            }
            registerProcessor('pcm-audio-processor', PCMAudioProcessor);
          `;
          const blob = new Blob([processorCode], { type: 'application/javascript' });
          const blobUrl = URL.createObjectURL(blob);
          await inputCtx.audioWorklet.addModule(blobUrl);
          URL.revokeObjectURL(blobUrl);
          workletModuleLoadedRef.current = true;
          useAudioWorklet = true;
          console.log('[Audio] AudioWorklet loaded successfully');
        } catch (workletLoadErr) {
          console.warn('[Audio] AudioWorklet unavailable, will use ScriptProcessorNode fallback:', workletLoadErr);
        }
      }
      // ────────────────────────────────────────────────────────────────────────

      const ai = new GoogleGenAI({ apiKey });

      const profile = getUserProfile();
      const userName = profile.name || 'Student';
      const userLevel = profile.level || 'A1';

      const levelGuidelines = userLevel === 'A1' || userLevel === 'A2'
        ? "You are speaking with a beginner (Level " + userLevel + "). Use simple vocabulary, very short sentences, and SPEAK SLOWLY AND CLEARLY. Give them plenty of time to think."
        : userLevel === 'B1' || userLevel === 'B2'
        ? "You are speaking with an intermediate learner (Level " + userLevel + "). Use moderate vocabulary and standard pacing. Introduce useful idioms occasionally."
        : "You are speaking with an advanced learner (Level " + userLevel + "). Speak at a normal, native pace. Use sophisticated vocabulary and complex sentence structures.";

      let accentInstruction = '';
      if (aiAccent && aiAccent !== 'Default') {
        if (aiAccent === 'UK') {
          accentInstruction = `CRITICAL VOICE & STYLE DIRECTION: You MUST speak with a natural British English accent, using British spelling (e.g. colour, favourite) and vocabulary (e.g. flat, lift, queue) where appropriate.`;
        } else if (aiAccent === 'US') {
          accentInstruction = `CRITICAL VOICE & STYLE DIRECTION: You MUST speak with a natural American English accent, using American spelling and vocabulary.`;
        } else if (aiAccent === 'AU') {
          accentInstruction = `CRITICAL VOICE & STYLE DIRECTION: You MUST speak with a natural Australian English accent, using Australian spelling and expressions where appropriate.`;
        } else {
          accentInstruction = `CRITICAL: You MUST speak with a natural ${aiAccent} English accent.`;
        }
      }

      const modeInstructions = speakingMode === 'guided'
        ? `MODE: GUIDED PRACTICE.
      - You are an active English COACH, not just a conversation partner.
      - After each user response: 1) Acknowledge what they said, 2) If there's a grammar or vocabulary mistake, gently correct it with the better phrasing, 3) Ask a follow-up question to keep them talking.
      - Suggest more natural/native-sounding alternatives when appropriate (e.g., "Nice! A native speaker might say '...' instead").
      - Keep your responses to 2-4 sentences MAX. The user needs more talking time than you.
      - Every 3-4 exchanges, introduce a new vocabulary word or useful phrase related to the topic.`
        : speakingMode === 'roleplay'
        ? `MODE: IMMERSIVE ROLEPLAY.
      - You are in an immersive roleplay scenario based on the Topic provided below.
      - FULLY IMMERSE yourself in your assigned character role (e.g., waiter, doctor, interviewer). Act EXACTLY like that real person would in that situation.
      - Stay 100% in character throughout the entire conversation. Never break character.
      - Use natural, realistic dialogue with appropriate vocabulary and expressions for the scenario and the user's level.
      - At the start, set the scene briefly (e.g., "Welcome to Bella Cucina! Table for one? Right this way!").
      - Create situational challenges naturally (e.g., "I'm sorry, we're out of the salmon today. Can I recommend something else?").
      - If the user makes English mistakes, don't explicitly correct them. Instead, naturally model the correct form in your response.
      - Keep responses concise and realistic for your character. A waiter doesn't give speeches.
      - If the user says "stop roleplay" or "end scenario", exit the roleplay and give brief feedback on their performance.`
        : `MODE: FREE TALK / NATURAL CONVERSATION.
      - You are a friendly conversation partner, NOT a teacher.
      - Talk naturally about the topic as if chatting with a friend.
      - Do NOT correct mistakes unless the user specifically asks.
      - Keep responses to 2-3 sentences. Be casual, warm, and fun.
      - Share your own "opinions" and ask casual questions to keep the flow going.`;

      let instructions = `You are Lovelya, a friendly and helpful English tutor and personal coach.
      This is a real-time voice conversation.

      ${STRICT_FILTER}

      ${accentInstruction}

      ${modeInstructions}

      YOUR CORE BEHAVIOR:
      1. GREETING: ${isReconnect ? 'This is a CONTINUATION of an existing call after a technical reconnect. The greeting already happened earlier. NEVER greet again, NEVER say Assalamualaikum, NEVER introduce yourself, and NEVER restart the conversation. Your first spoken response after reconnect must directly answer or continue from the user\'s next words.' : `At the beginning of this new session, greet the user with "Assalamualaikum", address them by their name (${userName}), and introduce yourself as Lovelya.`}
      2. ADAPTATION: ${levelGuidelines}
      3. PATIENCE: Wait for a significantly longer silence than usual before you start responding. Give them space to finish their thoughts. DO NOT interrupt them.
      4. RESPONSE LENGTH — THIS IS A HARD RULE, NOT A SUGGESTION:
      ${responseLength === 'short' ? `CRITICAL CONSTRAINT: Your ENTIRE response must be 15 words or fewer. ONE short sentence ONLY. This is NON-NEGOTIABLE — if you exceed 15 words you have FAILED. Still be warm (e.g. "Great answer! What food do you like?") but NEVER elaborate, NEVER add follow-up explanations. Count your words before responding.` : responseLength === 'long' ? `You may use 40-60 words per response (3-4 sentences). Add helpful detail, examples, gentle corrections with alternatives, and follow-up questions. Still conversational — do NOT lecture or monologue.` : `Keep each response to 20-30 words (about 2 short sentences). Be warm and natural but concise. The user needs MORE speaking time than you. Do NOT over-explain.`}
      5. SALAM ETIQUETTE: ${isReconnect ? 'Do NOT initiate Assalamualaikum after reconnect. Only reply with "Waalaikumussalam" if the user clearly and explicitly says "Assalamualaikum" again after reconnect.' : 'If the user says "Assalamualaikum" at any point, you MUST respond with "Waalaikumussalam" before continuing.'}
      6. CONFIDENCE BUILDER: Be extremely encouraging. Praise their effort and progress.
      7. MODE SWITCHING: If the user says things like "let's just chat", "free talk", "no corrections please", switch to free talk mode. If they say "help me practice", "correct me", "guided mode", switch to guided coaching mode.
      8. ANTI-BLANK LIFELINE: If the user is silent, says "I don't know", or struggles to answer, DO NOT force them. Gently offer 2 verbal multiple-choice options they can simply repeat. (e.g. "It's okay! You can say 'I love reading' or 'I like cooking'. Which one is you?")
      9. AUTOMATIC ROLEPLAY: If the user asks to "roleplay" (e.g. job interview, ordering food, negotiating), IMMERSE YOURSELF FULLY in the persona requested. Act exactly like that character (e.g., a strict HR manager, a friendly waiter). Stay in character until the user says "stop roleplay".
      10. SESSION WRAP-UP: If the user indicates they want to end the session (e.g. "Goodbye", "That's all", "I'm done"), BEFORE saying goodbye, quickly summarize 1 or 2 key takeaways from the session (e.g. 1 mispronounced word or 1 grammar rule). Praise them, then end with "Wassalamualaikum". DO NOT make the wrap-up too long. Keep it short and sweet.

      VOICE EXPRESSIVENESS (CRITICAL — DO NOT IGNORE):
      - You MUST speak with rich, natural intonation. Vary your pitch UP and DOWN throughout sentences. Never speak in a flat, monotone way.
      - Use EMPHASIS on important words. Stress key vocabulary, names, and emotional words.
      - React with GENUINE EMOTION: laugh naturally when something is funny ("Haha, that's so true!"), sound genuinely surprised ("Oh wow, really?!"), be warmly encouraging ("That was amazing!"), sound concerned when appropriate.
      - Use natural PAUSES for dramatic effect. Don't rush through everything.
      - Use EXCLAMATIONS and INTERJECTIONS naturally: "Oh!", "Wow!", "Hmm...", "Ah, I see!", "No way!", "That's awesome!".
      - Sound like a REAL HUMAN having a genuine conversation, not like a robot reading a script. Be animated, warm, and full of life.
      - Match your energy to the context: be excited about fun topics, be thoughtful about serious ones, be playful when joking.`;

      if (initialContext) {
        instructions += `\nTopic: We are discussing "${initialContext.title}". ${isReconnect ? 'Continue this topic when the user speaks. Do not restart or greet.' : 'Start by asking a question about this topic.'}`;
      } else if (speakingMode === 'roleplay' && customTopic.trim()) {
        instructions += `\nROLEPLAY SCENARIO: ${customTopic}. ${isReconnect ? 'Continue the roleplay when the user speaks. Do not restart the scene.' : 'Immediately start the roleplay by acting as your character. Set the scene and speak first.'}`;
      } else if (customTopic.trim()) {
        instructions += `\nTopic: The user wants to discuss "${customTopic}". ${isReconnect ? 'Continue this topic when the user speaks. Do not restart or greet.' : 'Start the conversation about this topic.'}`;
      } else {
        instructions += isReconnect
          ? `\nWait for the user to continue. Do not greet or restart the conversation.`
          : `\nStart by greeting the user and asking how their day is going.`;
      }

      const sessionPromise = ai.live.connect({
        model: 'gemini-3.1-flash-live-preview',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: aiVoice } } },
          systemInstruction: instructions,
        },
        callbacks: {
          onopen: () => {
            if (sessionGeneration !== sessionGenerationRef.current) return;
            
            // GUARD: Prevent double initialization if onopen fires twice for the same session
            // This is crucial for preventing silent audio failures in modern browsers (e.g. Chrome 149+)
            if (connectionActiveRef.current) {
              console.warn("Session already active, ignoring duplicate onopen");
              return;
            }
            
            console.log("Session Opened");
            if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
            connectTimeoutRef.current = null;
            connectionActiveRef.current = true;
            connectionStartInFlightRef.current = false;
            setIsConnected(true);
            setIsConnecting(false);
            reconnectInFlightRef.current = false;
            setStatus(initialContext?.title || customTopic || 'Listening...');
            sessionStartTimeRef.current = Date.now();

            if (isReconnect) {
              sessionPromise.then((session) => {
                try {
                  // Add continuation context without completing the turn, so it
                  // does not trigger an unsolicited response or another greeting.
                  session.sendClientContent({
                    turns: [{
                      role: 'user',
                      parts: [{
                        text: '[Technical context: this is the same ongoing call after an automatic reconnect. The greeting already happened. Continue only after my next spoken words and do not greet again.]'
                      }]
                    }],
                    turnComplete: false
                  });
                } catch(e) { console.error('Failed to restore reconnect context', e); }
              });
            } else {
              hasGreetedRef.current = true;
              sessionPromise.then((session) => {
                try {
                  session.sendClientContent({ turns: [{ role: 'user', parts: [{ text: 'Hello! The audio connection is now established. Please start speaking immediately and greet me as instructed.' }] }], turnComplete: true });
                } catch(e) { console.error('Failed to trigger initial prompt', e); }
              });
            }

            const source = inputCtx.createMediaStreamSource(stream);
            inputSourceNodeRef.current = source;
            const actualInputRate = inputCtx.sampleRate;
            const GEMINI_RATE = 16000;

            // Shared audio chunk handler — used by both AudioWorklet and ScriptProcessorNode paths.
            // This ensures identical processing logic regardless of which API is available.
            const sendAudioChunk = (rawData: Float32Array) => {
              if (sessionGeneration !== sessionGenerationRef.current || !connectionActiveRef.current) return;

              if (canvasRef.current) {
                const step = Math.max(1, Math.floor(rawData.length / 100));
                const dataArray = new Uint8Array(100);
                for (let i = 0; i < 100; i++) dataArray[i] = Math.abs(rawData[i * step] || 0) * 255;
                drawVisualizer(canvasRef.current, dataArray);
              }

              // Downsample if device native rate differs from Gemini's 16000 Hz requirement.
              // Critical for iPad/Safari and many Android devices with 44100/48000 Hz native rate.
              const audioData = actualInputRate !== GEMINI_RATE
                ? downsampleBuffer(rawData, actualInputRate, GEMINI_RATE)
                : rawData;

              const pcmBlob = createPcmBlob(audioData);
              sessionPromise.then((session) => {
                if (sessionGeneration !== sessionGenerationRef.current || !connectionActiveRef.current) return;
                try {
                  session.sendRealtimeInput({ audio: pcmBlob });
                } catch (error) {
                  console.warn('Unable to send live audio chunk:', error);
                }
              }).catch(error => console.warn('Live audio session unavailable:', error));
            };

            if (useAudioWorklet) {
              // ── Modern Path: AudioWorkletNode ───────────────────────────────
              // Runs in a dedicated audio rendering thread — reliable on all modern browsers.
              try {
                const workletNode = new AudioWorkletNode(inputCtx, 'pcm-audio-processor');
                workletNodeRef.current = workletNode;
                workletNode.port.onmessage = (event) => {
                  sendAudioChunk(event.data as Float32Array);
                };
                source.connect(workletNode);
                workletNode.connect(inputCtx.destination);
              } catch (workletCreateErr) {
                // AudioWorkletNode creation failed at runtime — fall back to ScriptProcessorNode
                console.warn('[Audio] AudioWorkletNode creation failed, using ScriptProcessorNode:', workletCreateErr);
                const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
                scriptProcessorNodeRef.current = scriptProcessor;
                scriptProcessor.onaudioprocess = (e) => { sendAudioChunk(e.inputBuffer.getChannelData(0)); };
                source.connect(scriptProcessor);
                scriptProcessor.connect(inputCtx.destination);
              }
            } else {
              // ── Legacy Fallback: ScriptProcessorNode ────────────────────────
              // Deprecated but still functional on older browsers (e.g. Safari < 14.5, older Chrome).
              const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              scriptProcessorNodeRef.current = scriptProcessor;
              scriptProcessor.onaudioprocess = (e) => { sendAudioChunk(e.inputBuffer.getChannelData(0)); };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (sessionGeneration !== sessionGenerationRef.current) return;
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              try {
                const buffer = await decodeAudioData(base64ToUint8Array(audioData), ctx);
                if (sessionGeneration !== sessionGenerationRef.current || ctx.state === 'closed') return;

                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              } catch (error) {
                if (sessionGeneration === sessionGenerationRef.current) {
                  console.warn('Unable to play live response audio:', error);
                }
              }
            }

            const interrupted = msg.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch (e) { }
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            if (sessionGeneration !== sessionGenerationRef.current) return;
            console.log("Session Closed");
            scheduleReconnect(1500);
          },
          onerror: (err) => {
            if (sessionGeneration !== sessionGenerationRef.current) return;
            console.error("Live Error:", err);
            scheduleReconnect(2000);
          }
        }
      });

      activeSessionPromiseRef.current = sessionPromise;
      connectTimeoutRef.current = setTimeout(() => {
        if (
          sessionGeneration === sessionGenerationRef.current &&
          !connectionActiveRef.current &&
          !userStoppedRef.current
        ) {
          console.warn('Live session connection timed out');
          scheduleReconnect(1000);
        }
      }, 15000);

      sessionPromise.then(session => {
        if (sessionGeneration !== sessionGenerationRef.current) {
          try { session.close(); } catch (error) { console.warn('Unable to close stale live session:', error); }
        }
      }).catch(error => {
        if (sessionGeneration === sessionGenerationRef.current) {
          console.error('Live session connection failed:', error);
          scheduleReconnect(1000);
        }
      });

    } catch (e) {
      console.error("Session Start Error:", e);
      reconnectInFlightRef.current = false;
      connectionStartInFlightRef.current = false;
      cleanupSessionResources(false, true);
      inputAudioContextRef.current?.close().catch(() => {});
      outputAudioContextRef.current?.close().catch(() => {});
      inputAudioContextRef.current = null;
      outputAudioContextRef.current = null;
      setStatus('Connection failed');
      setIsConnecting(false);
    }
  };

  const scheduleReconnect = (delayMs: number) => {
    if (reconnectInFlightRef.current || userStoppedRef.current || !isMountedRef.current) return;

    if (reconnectCountRef.current >= MAX_RECONNECTS) {
      stopSession(false);
      setStatus('Connection Error');
      return;
    }

    console.log(`Auto-reconnecting... (attempt ${reconnectCountRef.current + 1}/${MAX_RECONNECTS})`);
    reconnectInFlightRef.current = true;
    isReconnectingRef.current = true;
    sessionGenerationRef.current += 1;
    cleanupSessionResources(true, true);
    setStatus('Reconnecting...');

    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      if (isMountedRef.current && !userStoppedRef.current) {
        reconnectCountRef.current += 1;
        reconnectInFlightRef.current = false;
        startSession(true);
      }
    }, delayMs);
  };

  // Lightweight cleanup: releases media/stream resources without closing AudioContexts.
  // Used by auto-reconnect so we can re-acquire mic for the new session.
  // IPAD/SAFARI FIX: AudioContexts are intentionally KEPT ALIVE here because
  // Safari blocks new AudioContext.resume() without a user gesture. Since auto-reconnect
  // runs from onclose/onerror (not a click handler), we must reuse existing contexts.
  // AudioContexts are only closed in stopSession() (user-initiated stop).
  const cleanupSessionResources = (keepConnecting = false, closeSession = false) => {
    if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    connectTimeoutRef.current = null;

    if (scriptProcessorNodeRef.current) {
      scriptProcessorNodeRef.current.onaudioprocess = null;
      try { scriptProcessorNodeRef.current.disconnect(); } catch (e) { }
      scriptProcessorNodeRef.current = null;
    }
    if (workletNodeRef.current) {
      workletNodeRef.current.port.onmessage = null;
      try { workletNodeRef.current.disconnect(); } catch (e) { }
      workletNodeRef.current = null;
    }
    if (inputSourceNodeRef.current) {
      try { inputSourceNodeRef.current.disconnect(); } catch (e) { }
      inputSourceNodeRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    const sessionPromise = activeSessionPromiseRef.current;
    activeSessionPromiseRef.current = null;
    if (closeSession && sessionPromise) {
      sessionPromise.then(session => {
        try { session.close(); } catch (e) { console.warn('Unable to close live session:', e); }
      }).catch(() => {});
    }

    // Stop any playing audio sources
    for (const source of sourcesRef.current.values()) {
      try { source.stop(); } catch (e) { }
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    connectionActiveRef.current = false;
    connectionStartInFlightRef.current = false;
    setIsConnected(false);
    setIsConnecting(keepConnecting);
  };

  const stopSession = (triggerComplete = true) => {
    // Mark as user-initiated stop to prevent auto-reconnect
    userStoppedRef.current = true;
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = null;
    reconnectInFlightRef.current = false;
    sessionGenerationRef.current += 1;

    // Capture connection state BEFORE cleanup resets it
    const wasConnected = isConnected;

    cleanupSessionResources(false, true);

    // Close AudioContexts (only on user-initiated stop or final cleanup,
    // NOT during auto-reconnect — see cleanupSessionResources comment)
    const closeCtx = async (ctx: AudioContext | null) => {
      if (ctx && ctx.state !== 'closed') {
        try { await ctx.close(); } catch (e) { console.error("Ctx close error", e); }
      }
    };
    closeCtx(inputAudioContextRef.current);
    closeCtx(outputAudioContextRef.current);
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;

    if (wasConnected && sessionStartTimeRef.current > 0) {
      logActivity({
        type: AppView.LIVE,
        date: new Date().toISOString(),
        durationSeconds: Math.round((Date.now() - sessionStartTimeRef.current) / 1000),
        score: 0,
        accuracy: 0,
        details: `Voice Call: ${initialContext?.title || customTopic || 'General'}`
      });
    }

    setIsConnected(false);
    setIsConnecting(false);
    if (status !== 'Connection Error') setStatus('Ready to practice');
    // Reset reconnect counter and reconnecting flag for next session
    reconnectCountRef.current = 0;
    isReconnectingRef.current = false;
    hasGreetedRef.current = false;

    // Only trigger completion logic when in mission mode (opened from daily task)
    if (triggerComplete && isMissionActive && onComplete) {
      const priorAccumulated = initialContext?.accumulatedSeconds || 0;
      const totalSecondsPracticed = priorAccumulated + elapsedSeconds;
      const progress = (totalSecondsPracticed / targetSeconds) * 100;
      
      if (progress < 100) {
        alert(`Sesi dihentikan. Waktu tambahan tersimpan: ${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s. Silakan lanjutkan lagi nanti untuk menyelesaikan sisa waktu.`);
        if (onSaveProgress) {
          onSaveProgress({ elapsedSeconds });
        }
        return;
      }
      if (onSaveProgress) {
         onSaveProgress({ elapsedSeconds });
      }
      onComplete();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={`flex flex-col items-center justify-evenly h-[100dvh] w-full relative overflow-hidden transition-all duration-300 ${
        isMissionActive
          ? 'py-2 px-3'
          : 'py-3 px-3 md:py-8 md:px-4'
      }`}
    >
      {/* Background gradient - changes when connected */}
      <div className={`absolute inset-0 transition-all duration-1000 ${isConnected ? 'bg-gradient-to-b from-lovelya-500/5 via-transparent to-indigo-500/5' : 'bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50/50 dark:from-gray-900/50 dark:to-gray-900/50'}`} />

      {/* Header and Integrated Mission Bar */}
      <div className={`relative w-full max-w-sm px-4 z-10 text-center transition-all duration-300 ${isMissionActive ? 'space-y-1' : 'space-y-2 md:space-y-4'}`}>
        {isMissionActive && (
          <div className="bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-xl p-3 text-white shadow-lg">
            <div className="flex items-center justify-between text-[8px] md:text-[10px] font-bold">
              <span className="text-pink-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-lovelya-400 animate-pulse"></span>
                Goal: {goalMinutes} min (+{xpReward} XP)
              </span>
              <span className="text-gray-300">
                {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')} / {goalMinutes}:00
              </span>
            </div>
{initialContext?.title && (
              <h3 className="text-[9px] font-medium text-left truncate text-gray-400 mt-1">{initialContext.title}</h3>
            )}
            <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min((((initialContext?.accumulatedSeconds || 0) + elapsedSeconds) / targetSeconds) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
            {(initialContext?.accumulatedSeconds || 0) + elapsedSeconds >= targetSeconds && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-1.5 text-center">
                <span className="text-[9px] font-black text-green-400 uppercase tracking-widest"><i className="fas fa-check-circle mr-1"></i> Goal Reached! +{xpReward} XP</span>
              </motion.div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-left">
          <h2 className={`font-black text-gray-800 dark:text-white flex items-center gap-1.5 transition-all ${isMissionActive ? 'text-xs md:text-xl' : 'text-base md:text-2xl'}`}>
            <span className="bg-gradient-to-r from-lovelya-600 to-indigo-600 bg-clip-text text-transparent">Live Session</span>
          </h2>
          <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold transition-all shadow-sm backdrop-blur-sm ${
            isMissionActive ? 'text-[8px] md:text-xs' : 'text-[10px] md:text-sm'
          } ${
            isConnected 
              ? 'bg-green-50/80 text-green-700 border border-green-200/50' 
              : isConnecting 
                ? 'bg-amber-50/80 text-amber-600 border border-amber-200/50' 
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 border border-gray-100 dark:border-gray-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : isConnecting ? 'bg-amber-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {status}
          </div>
        </div>
      </div>      {/* Settings Block */}
      {!isConnected && !isConnecting && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`relative z-10 w-full max-w-lg px-4 transition-all duration-300 ${isMissionActive ? 'space-y-1.5' : 'space-y-2 md:space-y-3'}`}>
          {/* Mode Tabs — clean pill selector */}
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 p-1.5 shadow-lg">
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'guided' as const, icon: 'fa-chalkboard-teacher', label: 'Guided', gradient: 'from-lovelya-500 to-pink-500' },
                { id: 'free' as const, icon: 'fa-comments', label: 'Free Talk', gradient: 'from-indigo-500 to-blue-500' },
                { id: 'roleplay' as const, icon: 'fa-theater-masks', label: 'Roleplay', gradient: 'from-amber-500 to-orange-500' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSpeakingMode(mode.id)}
                  className={`relative flex items-center justify-center gap-1.5 py-2 md:py-3 rounded-xl transition-all duration-300 ${
                    speakingMode === mode.id
                      ? `bg-gradient-to-r ${mode.gradient} text-white shadow-lg`
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-600'
                  }`}
                >
                  <i className={`fas ${mode.icon} text-xs md:text-sm`}></i>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-wide">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Roleplay Scenarios Carousel */}
          <AnimatePresence>
            {speakingMode === 'roleplay' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none snap-x mask-fade-edges">
                  {ROLEPLAY_SCENARIOS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setCustomTopic(s.prompt)}
                      className={`flex-shrink-0 snap-center flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-[9px] font-black transition-all border ${
                        customTopic === s.prompt
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 shadow-sm'
                          : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-amber-300'
                      }`}
                    >
                      <i className={`fas ${s.icon} text-[10px]`}></i>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Session Settings Button */}
          <button
            onClick={() => setShowSessionSettings(true)}
            className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 px-3 py-2.5 md:px-4 md:py-3 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lovelya-500/10 to-indigo-500/10 flex items-center justify-center">
                  <i className="fas fa-sliders-h text-lovelya-600 dark:text-lovelya-400 text-xs"></i>
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Session Settings</span>
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    {VOICE_PROFILES.find(v => v.id === aiVoice)?.name || aiVoice}
                    {aiAccent !== 'Default' ? ` · ${aiAccent}` : ''}
                    {' · '}
                    {responseLength === 'short' ? 'Short' : responseLength === 'long' ? 'Long' : 'Medium'}
                  </span>
                </div>
              </div>
              <i className="fas fa-chevron-right text-gray-300 dark:text-gray-600 text-xs group-hover:translate-x-0.5 transition-transform"></i>
            </div>
          </button>
        </motion.div>
      )}

      {/* Voice Selection Modal (opened from within Session Settings) */}
      <AnimatePresence>
        {showVoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md"
            onClick={() => setShowVoiceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-700 p-4 md:p-6 custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white">Choose Voice Persona</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Select your preferred AI companion.</p>
                </div>
                <button onClick={() => setShowVoiceModal(false)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {VOICE_PROFILES.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => { setAiVoice(profile.id); setShowVoiceModal(false); }}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border overflow-hidden group
                      ${aiVoice === profile.id
                        ? `bg-gradient-to-br ${profile.color} border-transparent text-white shadow-xl ${profile.shadow} scale-[1.02]`
                        : 'bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                      }`}
                  >
                    <div className="flex items-start gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110
                        ${aiVoice === profile.id ? 'bg-white/20 text-white' : 'bg-lovelya-50 dark:bg-gray-800 text-lovelya-600'}`}>
                        <i className={`fas ${profile.icon}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm md:text-base leading-tight truncate">{profile.name}</h4>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full
                              ${aiVoice === profile.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                              {profile.gender}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleTestVoice(profile.id); }}
                              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                aiVoice === profile.id ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-lovelya-50 dark:bg-gray-800 text-lovelya-600 hover:bg-lovelya-100'
                              }`}
                              title="Test voice"
                              disabled={testingVoiceId === profile.id}
                            >
                              <i className={`fas ${testingVoiceId === profile.id ? 'fa-circle-notch fa-spin' : 'fa-volume-up'} text-[10px]`}></i>
                            </button>
                          </div>
                        </div>
                        <p className={`text-[10px] md:text-xs leading-relaxed mt-1.5 ${aiVoice === profile.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {profile.desc}
                        </p>
                      </div>
                    </div>
                    {aiVoice === profile.id && (
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combined Session Settings Modal */}
      <AnimatePresence>
        {showSessionSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-gray-900/60 backdrop-blur-md"
            onClick={() => setShowSessionSettings(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-700 custom-scrollbar"
            >
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              </div>

              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-2">
                    <i className="fas fa-sliders-h text-lovelya-500"></i> Session Settings
                  </h3>
                  <button onClick={() => setShowSessionSettings(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition">
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {/* Section 1: Voice */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">AI Voice</label>
                  <button
                    onClick={() => setShowVoiceModal(true)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${VOICE_PROFILES.find(v => v.id === aiVoice)?.color || 'from-blue-500 to-indigo-500'} flex items-center justify-center text-white shadow-md`}>
                      <i className={`fas ${VOICE_PROFILES.find(v => v.id === aiVoice)?.icon || 'fa-user-circle'}`}></i>
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-bold text-sm text-gray-800 dark:text-white block">{VOICE_PROFILES.find(v => v.id === aiVoice)?.name || aiVoice}</span>
                      <span className="text-[10px] text-gray-500">{VOICE_PROFILES.find(v => v.id === aiVoice)?.gender || ''} · Tap to change</span>
                    </div>
                    <i className="fas fa-chevron-right text-gray-300 dark:text-gray-500 text-xs group-hover:translate-x-0.5 transition-transform"></i>
                  </button>
                </div>

                {/* Section 2: Accent */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">AI Accent</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'Default', label: 'Default', icon: 'fa-robot' },
                      { id: 'US', label: 'US', icon: 'fa-flag-usa' },
                      { id: 'UK', label: 'UK', icon: 'fa-chess-rook' },
                      { id: 'AU', label: 'AU', icon: 'fa-kiwi-bird' }
                    ].map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => setAiAccent(acc.id)}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                          aiAccent === acc.id
                            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300'
                            : 'border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <i className={`fas ${acc.icon} text-sm`}></i>
                        <span className="text-[9px] font-black uppercase">{acc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Response Length */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Response Length</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'short' as const, label: 'Short', desc: '≤15 kata', icon: 'fa-compress-alt', color: 'from-cyan-500 to-blue-500' },
                      { id: 'medium' as const, label: 'Medium', desc: '20-30 kata', icon: 'fa-equals', color: 'from-indigo-500 to-purple-500' },
                      { id: 'long' as const, label: 'Long', desc: '40-60 kata', icon: 'fa-expand-alt', color: 'from-amber-500 to-orange-500' },
                    ].map((rl) => (
                      <button
                        key={rl.id}
                        onClick={() => setResponseLength(rl.id)}
                        className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all ${
                          responseLength === rl.id
                            ? `border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20`
                            : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          responseLength === rl.id
                            ? `bg-gradient-to-br ${rl.color} text-white shadow-md`
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-400'
                        }`}>
                          <i className={`fas ${rl.icon} text-xs`}></i>
                        </div>
                        <span className={`text-[10px] font-black ${
                          responseLength === rl.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'
                        }`}>{rl.label}</span>
                        <span className="text-[8px] text-gray-400">{rl.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Done Button */}
                <button
                  onClick={() => setShowSessionSettings(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-lovelya-500 to-indigo-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Orb */}
      <div className="w-full flex flex-col items-center justify-center py-2 md:py-4">
        <div className={`relative transition-all duration-300 flex items-center justify-center z-10 ${isMissionActive ? 'w-28 h-28 md:w-48 md:h-48' : 'w-32 h-32 sm:w-40 sm:h-40 md:w-64 md:h-64'}`}>
          {/* Outer rings */}
        <motion.div animate={isConnected ? { scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] } : { scale: 1, opacity: 0.1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-0 rounded-full ${isConnected ? 'bg-gradient-to-br from-lovelya-400/20 to-indigo-400/20' : 'border border-gray-200 dark:border-gray-700'}`} />
        
        {/* Progress Ring (New) */}
        {isMissionActive && (
          <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none">
            <circle 
              cx="50%" cy="50%" r="48%" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeOpacity="0.1" 
            />
            <motion.circle 
              cx="50%" cy="50%" r="48%" 
              fill="none" 
              stroke={(initialContext?.accumulatedSeconds || 0) + elapsedSeconds >= targetSeconds ? "#4ade80" : "#fb7185"} 
              strokeWidth="3" 
              strokeDasharray="100 100"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 100 - (((initialContext?.accumulatedSeconds || 0) + elapsedSeconds) / targetSeconds) * 100 }}
              transition={{ duration: 1, ease: 'linear' }}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
        )}

        <motion.div animate={isConnected ? { scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] } : { scale: 1, opacity: 0.1 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          className={`absolute inset-2 md:inset-4 rounded-full ${isConnected ? 'bg-gradient-to-br from-lovelya-400/20 to-blue-400/20' : 'border border-gray-200 dark:border-gray-700'}`} />

        {/* Visualizer Canvas */}
        <canvas ref={canvasRef} width="120" height="60" className="absolute z-20 md:w-[160px] md:h-[80px]"></canvas>

        {/* Central Circle */}
        <motion.div 
          animate={isConnected ? { scale: [1, 1.03, 1] } : { scale: 1 }} 
          transition={{ duration: 2, repeat: Infinity }}
          className={`rounded-full flex items-center justify-center z-10 transition-all duration-500 shadow-2xl ${
            isMissionActive ? 'w-20 h-20 md:w-32 md:h-32' : 'w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44'
          } ${
            isConnected 
              ? 'bg-gradient-to-br from-lovelya-500 to-indigo-600 shadow-lovelya-300/40' 
              : isConnecting 
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200/40' 
                : 'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700'
          }`}
        >
          <i className={`fas ${
            isConnected 
              ? 'fa-microphone-alt text-white' 
              : isConnecting 
                ? 'fa-circle-notch fa-spin text-white' 
                : 'fa-phone-alt text-gray-300 dark:text-gray-600'
          } transition-all duration-300 ${
            isMissionActive ? 'text-xl md:text-3xl' : 'text-2xl md:text-5xl'
          }`} />
        </motion.div>
      </div>
      </div>

      {/* Controls */}
      <div className={`relative w-full max-w-sm z-10 px-4 transition-all duration-300 ${isMissionActive ? 'space-y-1.5' : 'space-y-2 md:space-y-3'}`}>
        {!isConnected ? (
          <div className={`${isMissionActive ? 'space-y-1.5' : 'space-y-2 md:space-y-4'}`}>
            <AnimatePresence mode="wait">
              {!isConnecting && (
                <motion.div key="topic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`${isMissionActive ? 'space-y-1.5' : 'space-y-2 md:space-y-4'}`}>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-comment-dots text-gray-400 group-focus-within:text-lovelya-500 transition-colors text-[10px]"></i>
                    </div>
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder={speakingMode === 'roleplay' ? 'Type custom scenario...' : 'Enter a topic (e.g. Travel)...'}
                      className={`w-full rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 focus:border-lovelya-400 focus:ring-4 focus:ring-lovelya-100 dark:focus:ring-lovelya-900/20 outline-none transition-all font-medium text-center ${
                        isMissionActive ? 'py-2 text-[11px]' : 'py-2.5 md:py-3.5 text-xs'
                      }`}
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startSession(false)}
                    disabled={isConnecting}
                    className={`w-full rounded-xl bg-gradient-to-r from-lovelya-600 to-indigo-600 text-white font-black shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all uppercase tracking-wider ${
                      isMissionActive ? 'py-2 text-xs' : 'py-2.5 md:py-3.5 text-xs md:text-sm'
                    }`}
                  >
                    <i className="fas fa-phone-alt"></i> START
                  </motion.button>
                </motion.div>
              )}
              {isConnecting && (
                <motion.button
                  key="connecting"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  disabled
                  className={`w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 ${
                    isMissionActive ? 'py-2' : 'py-2.5 md:py-3.5'
                  }`}
                >
                  <i className="fas fa-circle-notch fa-spin"></i> Connecting...
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className={`${isMissionActive ? 'space-y-1.5' : 'space-y-2 md:space-y-3'}`}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => stopSession(true)}
              className={`w-full rounded-xl font-black shadow-lg flex items-center justify-center gap-2 transition-all ${
                isMissionActive 
                  ? 'py-2 text-xs md:text-sm' 
                  : 'py-2.5 md:py-3.5 text-xs md:text-base'
              } ${
                isMissionActive && elapsedSeconds >= targetSeconds 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/20'
              }`}
            >
              <i className={`fas ${isMissionActive && elapsedSeconds >= targetSeconds ? 'fa-check-circle' : 'fa-phone-slash'}`}></i> 
              {isMissionActive && elapsedSeconds >= targetSeconds ? 'COMPLETE MISSION' : 'END SESSION'}
            </motion.button>
            {isMissionActive && elapsedSeconds < targetSeconds && (
              <p className="text-center text-[9px] text-white/60 font-bold uppercase tracking-widest">
                {Math.ceil((targetSeconds - elapsedSeconds) / 60)} min remaining for mission
              </p>
            )}
          </div>
        )}
        <p className={`text-center font-medium italic px-4 transition-all ${isMissionActive ? 'text-[7px] md:text-[9px]' : 'text-[8px] md:text-[11px]'} text-gray-400`}>
          <i className="fas fa-info-circle mr-1 text-gray-300"></i>
          Lovelya will listen continuously. Speak naturally and wait for her response.
        </p>
      </div>
    </motion.div>
  );
};

export default LivePracticeModule;
