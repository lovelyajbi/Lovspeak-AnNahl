import React, { useState, useEffect, useRef } from 'react';
import { Level, ModuleProps, AppView, ModuleContext, QuizQuestion } from '../types';
import { LEVELS, THEMES, AVATAR_ICONS } from '../constants';
import { generateListeningTitles, generateListeningContent, generateListeningScript, generateListeningQuiz, generateTTSAudio, generateSingleListeningTitle, translateText, TranslationResult } from '../services/gemini';
import { saveProgress, getCachedTitles, setCachedTitles, getCachedContent, setCachedContent, logActivity, saveVocab, completeRoadmapUnit, saveCustomCategory, getCustomCategories, CustomCategory, getCachedListeningTitles, setCachedListeningTitles, getActivityLogs } from '../services/storage';
import { audioService } from '../services/audioService';
import { base64ToUint8Array, pcmToWav, cacheAudioBlob, getCachedAudioBlob } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

// Define Listening Specific Themes
const LISTENING_THEMES = [
  { id: 'adab', name: 'Adab (Manners)', isIslamic: true },
  { id: 'akhlak', name: 'Akhlak (Character)', isIslamic: true },
  { id: 'tauhid', name: 'Tauhid (Monotheism)', isIslamic: true },
  { id: 'prophets', name: 'Stories of Prophets', isIslamic: true },
  { id: 'righteous', name: 'Stories of Righteous People', isIslamic: true },
  { id: 'daily', name: 'Daily Conversations', isIslamic: false },
  { id: 'education', name: 'Education & Learning', isIslamic: false },
  { id: 'work', name: 'Workplace Scenarios', isIslamic: false },
  { id: 'travel', name: 'Travel Experiences', isIslamic: false },
  { id: 'health', name: 'Health & Lifestyle', isIslamic: false },
  { id: 'tech', name: 'Technology Trends', isIslamic: false },
  { id: 'environment', name: 'Environment & Nature', isIslamic: false },
  { id: 'science', name: 'Science & Discovery', isIslamic: false },
  { id: 'history', name: 'World History', isIslamic: false },
  { id: 'business', name: 'Business & Finance', isIslamic: false },
  { id: 'arts', name: 'Arts & Culture', isIslamic: false },
  { id: 'sports', name: 'Sports & Fitness', isIslamic: false },
];

const SPEED_OPTIONS = [0.5, 0.75, 0.9, 1.0, 1.25, 1.5, 2.0];

const getTextCacheKey = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
};

const ListeningModule: React.FC<ModuleProps> = ({ onComplete, initialContext, onNavigate }) => {
  const handleComplete = () => {
    localStorage.removeItem('lovspeak_state_listening');
    onComplete?.();
  };

  // Navigation State
  const [step, setStep] = useState<'setup' | 'titles' | 'player' | 'result'>('setup');

  // Selection State
  const [level, setLevel] = useState<string>('A1');
  const [type, setType] = useState<'monologue' | 'dialogue'>('monologue');
  const [accent, setAccent] = useState<string>('Default');
  const [themeId, setThemeId] = useState<string>('');
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [themeCategory, setThemeCategory] = useState<'islamic' | 'general'>('islamic');

  // Custom Input State
  const [customTopic, setCustomTopic] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  // Data State
  const [titles, setTitles] = useState<string[]>([]);
  const [script, setScript] = useState<string>('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [speakers, setSpeakers] = useState<{ name: string; gender: 'male' | 'female' }[]>([]);

  // Prefetch cache for next topic
  const nextTopicCacheRef = useRef<{ topicIndex: number; topic: string; script: string; quiz: QuizQuestion[]; speakers: { name: string; gender: 'male' | 'female' }[]; audioUrl: string; type: string } | null>(null);
  const prefetchingRef = useRef(false);
  const selectionRequestRef = useRef(0);

  // Player State
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [hasListenedToEnd, setHasListenedToEnd] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Quiz State
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  // UI State
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);

  // Translation Popup
  const [selectedWord, setSelectedWord] = useState('');
  const [translation, setTranslation] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);

  // Category State for saving Vocab
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [saveCategory, setSaveCategory] = useState('Listening');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-folder');
  const [newCatColor, setNewCatColor] = useState('#ec4899');

  useEffect(() => {
    setCustomCategories(getCustomCategories());
  }, []);

  // Modal State: Add Title
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [randomTitleLoading, setRandomTitleLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Sequential Mission Mode
  const [missionTopicIndex, setMissionTopicIndex] = useState(0);
  const [completedTopics, setCompletedTopics] = useState<Set<number>>(new Set());
  const isMissionMode = !!(initialContext?.listeningTopics && initialContext.listeningTopics.length > 0);
  const missionTopics = initialContext?.listeningTopics || [];
  const missionXpReward = initialContext?.xpReward || 20;

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    const savedState = localStorage.getItem('lovspeak_state_listening');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setStep(state.step || 'setup');
        setLevel(state.level || 'A1');
        setType(state.type || 'monologue');
        setAccent(state.accent || 'Default');
        setThemeId(state.themeId || '');
        setSelectedTitle(state.selectedTitle || '');
        setIsCustomMode(state.isCustomMode || false);
        setThemeCategory(state.themeCategory || 'islamic');
        setCustomTopic(state.customTopic || '');
        setCustomTitle(state.customTitle || '');
        setTitles(state.titles || []);
        setScript(state.script || '');
        setQuiz(state.quiz || []);
        setSpeakers(state.speakers || []);
        setCurrentPage(state.currentPage || 1);
        setMissionTopicIndex(state.missionTopicIndex || 0);
        if (state.completedTopicsArr) {
          setCompletedTopics(new Set(state.completedTopicsArr));
        }
        // Note: audioUrl is not persisted as it's a blob URL
      } catch (e) {
        console.error("Failed to load listening state", e);
      }
    }
  }, []);

  const [completedTitlesData, setCompletedTitlesData] = useState<Record<string, { score: number }>>({});

  useEffect(() => {
    try {
      const logs = getActivityLogs();
      if (logs) {
        const map: Record<string, { score: number }> = {};
        logs.forEach(log => {
          if (log.type === AppView.LISTENING && log.details) {
            const match = log.details.match(/^(.*?)\s+\(/);
            const title = match ? match[1] : log.details;
            if (!map[title] || map[title].score < log.score) {
              map[title] = { score: log.score };
            }
          }
        });
        setCompletedTitlesData(map);
      }
    } catch (e) { }
  }, [step]);

  useEffect(() => {
    const stateToSave = {
      initialTitle: initialContext?.title,
      step, level, type, accent, themeId, selectedTitle, isCustomMode,
      themeCategory, customTopic, customTitle, titles, script, quiz, speakers, currentPage,
      missionTopicIndex,
      completedTopicsArr: Array.from(completedTopics)
    };
    localStorage.setItem('lovspeak_state_listening', JSON.stringify(stateToSave));
  }, [step, level, type, accent, themeId, selectedTitle, isCustomMode, themeCategory, customTopic, customTitle, titles, script, quiz, speakers, currentPage, missionTopicIndex, completedTopics]);

  // --- AUTO START LOGIC ---
  useEffect(() => {
    if (initialContext?.autoStart) {
      autoLaunch(initialContext);
    }
  }, [initialContext]);

  const autoLaunch = async (ctx: ModuleContext) => {
    const userLevel = ctx.level || 'A1';

    // Determine title and topic
    let finalTitle = ctx.title;
    let finalTopic = ctx.vocabTheme || 'General';

    if (ctx.type === 'daily') {
      finalTitle = ctx.title.replace(/^Listening:\s*/i, '');
      finalTopic = finalTitle;
    }

    // Check if we have a saved state for this exact task (resume support)
    const savedStateStr = localStorage.getItem('lovspeak_state_listening');
    if (savedStateStr) {
      try {
        const state = JSON.parse(savedStateStr);
        if (state.initialTitle === ctx.title && state.step !== 'setup' && state.script) {
          // Same task with script cached — only regenerate audio
          // NOTE: Always resume to 'player', never to 'result', to prevent
          // stale completion state when the same title appears on different days
          if (state.step === 'player' || state.step === 'result') {
            regenerateAudioOnly(state.script, state.type || 'monologue', state.speakers || []);
          }
          return;
        } else if (state.initialTitle !== ctx.title) {
          // Different task — clear old state to prevent cross-contamination
          localStorage.removeItem('lovspeak_state_listening');
          setStep('setup');
          setSelectedTitle('');
          setTitles([]);
          setScript('');
          setQuiz([]);
          setSpeakers([]);
          setCurrentPage(1);
          setMissionTopicIndex(0);
          setCompletedTopics(new Set());
          setUserAnswers([]);
          setScore(0);
          setHasListenedToEnd(false);
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
          setPlaybackSpeed(1.0);
          setShowTranscript(false);
        }
      } catch (e) { }
    }

    // If sequential mission mode, load first topic
    if (ctx.listeningTopics && ctx.listeningTopics.length > 0) {
      const firstTopic = ctx.listeningTopics[0];
      const selectedType = Math.random() > 0.5 ? 'dialogue' : 'monologue';
      setSelectedTitle(firstTopic);
      setLevel(userLevel);
      setType(selectedType);
      setCustomTopic(firstTopic);
      setIsCustomMode(true);
      processSelection(firstTopic, firstTopic, false, userLevel, selectedType);
      return;
    }

    const selectedType = Math.random() > 0.5 ? 'dialogue' : 'monologue';
    setSelectedTitle(finalTitle);
    setLevel(userLevel);
    setType(selectedType);
    setCustomTopic(finalTopic);
    setIsCustomMode(true);

    processSelection(finalTitle, finalTopic, false, userLevel, selectedType);
  };

  // Resume helper: only regenerate audio from cached script (1 API call)
  const regenerateAudioOnly = async (cachedScript: string, audioType: string, cachedSpeakers: { name: string; gender: 'male' | 'female' }[]) => {
    setLoading(true);
    setStatusMsg('Resuming — regenerating audio...');
    setHasListenedToEnd(false);
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
    try {
      const base64Audio = await generateTTSAudio(
        cachedScript,
        audioType,
        cachedSpeakers.length >= 2 ? cachedSpeakers : undefined,
        level,
        undefined,
        accent
      );
      if (!base64Audio) throw new Error('Failed to generate audio');
      const binary = base64ToUint8Array(base64Audio);
      const wavBlob = pcmToWav(binary, 24000);
      setAudioUrl(URL.createObjectURL(wavBlob));
      setCurrentTime(0); setDuration(0); setIsPlaying(false); setPlaybackSpeed(1.0);
      setStep('player');
    } catch (e) {
      console.error(e);
      setError('Failed to resume audio. Please try again.');
    } finally {
      setLoading(false); setStatusMsg('');
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!audioRef.current || !audioUrl) return;
    audioRef.current.pause();
    audioRef.current.load();
    audioRef.current.playbackRate = playbackSpeed;
  }, [audioUrl]);

  // --- AUDIO HANDLERS ---

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setHasListenedToEnd(true);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    // Safety net: also trigger prefetch when audio ends (in case early prefetch didn't fire)
    if (isMissionMode && missionTopicIndex < missionTopics.length - 1 && !prefetchingRef.current && !nextTopicCacheRef.current) {
      prefetchNextTopic(missionTopicIndex + 1);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // --- LOGIC HANDLERS ---

  const handleFetchTitles = async (forceRefresh = false) => {
    if (!themeId) {
      setError('Please select a theme.');
      return;
    }

    if (!forceRefresh) {
      const cached = getCachedListeningTitles(level, type, themeId);
      if (cached && cached.length > 0) {
        setTitles(cached);
        setCurrentPage(1);
        setStep('titles');
        return;
      }
    }

    audioService.play('tap');
    setError('');
    setLoading(true);
    setStatusMsg(forceRefresh ? 'Refreshing topics...' : 'Generating topics...');
    try {
      const themeObj = LISTENING_THEMES.find(t => t.id === themeId);
      const generated = await generateListeningTitles(level, type, themeObj?.name || '', themeObj?.isIslamic || false);
      if (!generated || generated.length === 0) {
        throw new Error("No titles were generated. Please try again.");
      }
      setTitles(generated);
      setCachedListeningTitles(level, type, themeId, generated);
      setCurrentPage(1);
      setStep('titles');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to generate titles. Try again.');
      setTitles([]);
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const processSelection = async (title: string, themeName: string, isIslamic: boolean, overrideLevel?: string, overrideType?: string) => {
    const requestId = ++selectionRequestRef.current;
    const activeLevel = overrideLevel || level;
    const activeType = overrideType || type;
    setLoading(true);
    setError('');
    setQuiz([]);
    setSpeakers([]);
    setHasListenedToEnd(false);
    setQuizLoading(true); // Quiz will always auto-generate

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    let generatedScript = '';
    let generatedSpeakers: { name: string; gender: 'male' | 'female' }[] = [];

    try {
      // --- STEP 1: Generate script only (flash-lite, fast) ---
      setStatusMsg('Step 1/2: Crafting the script...');
      try {
        const result = await generateListeningContent(title, activeLevel, activeType, themeName, isIslamic, accent);
        generatedScript = result.script;
        generatedSpeakers = result.speakers || [];
      } catch (contentError) {
        // Fallback to simpler script-only generator
        console.warn('Script generation failed, falling back', contentError);
        setStatusMsg('Step 1/2: Retrying script generation...');
        generatedScript = await generateListeningScript(title, activeLevel, activeType, themeName, isIslamic, accent);
      }

      if (!generatedScript) throw new Error('Failed to generate script');
      if (requestId !== selectionRequestRef.current) return;
      setScript(generatedScript);
      setSpeakers(generatedSpeakers);

      // --- STEP 2: TTS + Quiz in PARALLEL ---
      setStatusMsg('Step 2/2: Bringing voices to life...');

      const cacheId = btoa(encodeURIComponent(`${title}_${activeLevel}_${activeType}_${accent}_${getTextCacheKey(generatedScript)}`)).replace(/[/+=]/g, '');
      let cachedWavBlob = await getCachedAudioBlob(cacheId);

      // Always generate quiz in parallel (auto-generate)
      const quizPromise = generateListeningQuiz(generatedScript, activeLevel).catch(e => {
        console.error('Quiz generation error', e);
        return [] as QuizQuestion[];
      });

      let finalWavBlob: Blob;

      if (cachedWavBlob) {
        // Audio is cached!
        setStatusMsg('Loading cached audio...');
        finalWavBlob = cachedWavBlob;
      } else {
        // Generate audio
        const base64Audio = await generateTTSAudio(
          generatedScript, activeType,
          activeType === 'dialogue' && generatedSpeakers.length >= 2 ? generatedSpeakers : undefined,
          activeLevel,
          undefined,
          accent
        );

        if (!base64Audio || base64Audio.length === 0) throw new Error('Failed to generate audio \u2014 empty response from TTS model');

        const binary = base64ToUint8Array(base64Audio);
        if (binary.length === 0) throw new Error('Failed to decode audio data');
        finalWavBlob = pcmToWav(binary, 24000);
        await cacheAudioBlob(cacheId, finalWavBlob);
      }

      if (requestId !== selectionRequestRef.current) return;

      // Show player immediately (quiz loads in background)
      setAudioUrl(URL.createObjectURL(finalWavBlob));
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setPlaybackSpeed(1.0);
      setShowTranscript(false);
      setStep('player');
      setLoading(false);
      setStatusMsg('');

      // Start prefetching next topic early (15s after player shows)
      // This gives the AI ample time to prepare while user listens
      if (isMissionMode && missionTopicIndex < missionTopics.length - 1) {
        setTimeout(() => {
          if (!prefetchingRef.current) {
            prefetchNextTopic(missionTopicIndex + 1);
          }
        }, 15000);
      }

      // Wait for quiz to finish (runs in background while player is already visible)
      const finalQuiz = await quizPromise;
      if (requestId !== selectionRequestRef.current) return;
      if (finalQuiz && finalQuiz.length > 0) {
        setQuiz(finalQuiz);
        setUserAnswers(new Array(finalQuiz.length).fill(-1));
      }
      setQuizLoading(false);

    } catch (e) {
      console.error(e);
      setError('Failed to generate content. Please try a different topic.');
      setLoading(false);
      setStatusMsg('');
      setQuizLoading(false);
    }
  };

  // --- PREFETCH next topic in background ---
  const prefetchNextTopic = async (nextIndex: number) => {
    if (prefetchingRef.current || nextIndex >= missionTopics.length) return;
    prefetchingRef.current = true;
    const nextTopic = missionTopics[nextIndex];
    const nextType = Math.random() > 0.5 ? 'dialogue' : 'monologue';

    try {
      // Step 1: Script only (fast)
      let nextScript = '', nextSpeakers: { name: string; gender: 'male' | 'female' }[] = [];
      try {
        const result = await generateListeningContent(nextTopic, level, nextType, nextTopic, false, accent);
        nextScript = result.script;
        nextSpeakers = result.speakers || [];
      } catch {
        nextScript = await generateListeningScript(nextTopic, level, nextType, nextTopic, false, accent);
      }

      if (!nextScript) { prefetchingRef.current = false; return; }

      // Step 2: TTS + Quiz in parallel
      const [nextQuiz, base64Audio] = await Promise.all([
        generateListeningQuiz(nextScript, level).catch(() => [] as QuizQuestion[]),
        generateTTSAudio(
          nextScript, nextType,
          nextType === 'dialogue' && nextSpeakers.length >= 2 ? nextSpeakers : undefined,
          level,
          undefined,
          accent
        )
      ]);

      if (base64Audio) {
        const binary = base64ToUint8Array(base64Audio);
        const wavBlob = pcmToWav(binary, 24000);
        const prefetchedAudioUrl = URL.createObjectURL(wavBlob);
        if (nextIndex !== missionTopicIndex + 1 || missionTopics[nextIndex] !== nextTopic) {
          URL.revokeObjectURL(prefetchedAudioUrl);
          return;
        }
        if (nextTopicCacheRef.current) {
          URL.revokeObjectURL(nextTopicCacheRef.current.audioUrl);
        }
        nextTopicCacheRef.current = {
          topicIndex: nextIndex,
          topic: nextTopic,
          script: nextScript,
          quiz: nextQuiz,
          speakers: nextSpeakers,
          audioUrl: prefetchedAudioUrl,
          type: nextType
        };
      }
    } catch (e) {
      console.error('Prefetch failed', e);
    } finally {
      prefetchingRef.current = false;
    }
  };

  // Fallback quiz generator (only used when combined call quiz failed)
  const handleGenerateQuiz = async () => {
    if (!script) return;
    setQuizLoading(true);
    setError('');
    try {
      const generatedQuiz = await generateListeningQuiz(script, level);
      if (!generatedQuiz || generatedQuiz.length === 0) {
        setError("AI generation returned empty. Please try again.");
        setQuiz([]);
      } else {
        setQuiz(generatedQuiz);
        setUserAnswers(new Array(generatedQuiz.length).fill(-1));
      }
    } catch (e) {
      console.error(e);
      setError("Failed to generate quiz due to network error.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectTitle = (title: string) => {
    audioService.play('nav');
    setSelectedTitle(title);
    if (isCustomMode) {
      processSelection(title, customTopic, false);
    } else {
      const themeObj = LISTENING_THEMES.find(t => t.id === themeId);
      processSelection(title, themeObj?.name || '', themeObj?.isIslamic || false);
    }
  };

  const handleRegenerate = () => {
    if (window.confirm("Generate a new conversation for this title?")) {
      handleSelectTitle(selectedTitle);
    }
  };

  const handleRandomTitle = async () => {
    setRandomTitleLoading(true);
    try {
      const themeObj = LISTENING_THEMES.find(t => t.id === themeId);
      const themeName = themeObj?.name || customTopic || 'General Conversation';
      const isIslamic = themeObj?.isIslamic || false;
      const random = await generateSingleListeningTitle(level, type, themeName, isIslamic);
      setNewCustomTitle(random);
    } catch (e) {
      console.error(e);
    } finally {
      setRandomTitleLoading(false);
    }
  };

  const handleCustomStart = async () => {
    if (!customTopic) {
      setError("Please fill in Topic Theme");
      return;
    }

    if (customTitle) {
      setSelectedTitle(customTitle);
      processSelection(customTitle, customTopic, false);
    } else {
      setError('');
      setLoading(true);
      setStatusMsg('Generating topics...');
      try {
        const generated = await generateListeningTitles(level, type, customTopic, false);
        if (!generated || generated.length === 0) {
          throw new Error("No titles were generated. Please try again.");
        }
        setTitles(generated);
        setCurrentPage(1);
        setStep('titles');
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Failed to generate titles. Try again.');
        setTitles([]);
      } finally {
        setLoading(false);
        setStatusMsg('');
      }
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correctCount++;
    });

    const finalScore = quiz.length > 0 ? Math.round((correctCount / quiz.length) * 100) : 0;
    setScore(finalScore);

    logActivity({
      type: AppView.LISTENING,
      date: new Date().toISOString(),
      durationSeconds: Math.round(duration),
      score: finalScore,
      accuracy: finalScore,
      details: `${selectedTitle} (${type})`
    });

    const targetMinScore = initialContext?.minScore || 80;

    if (initialContext?.stepId && finalScore >= targetMinScore) {
      completeRoadmapUnit(initialContext.stepId);
    }

    setStep('result');

    // Mission mode: track completion and advance
    if (isMissionMode) {
      if (finalScore >= targetMinScore) {
        setCompletedTopics(prev => new Set(prev).add(missionTopicIndex));
      }
      // Don't auto-complete the entire mission here; let the user advance via the mission bar
      return;
    }

    // NOTE: Do NOT call onComplete() here. The task should only be marked
    // complete when the user explicitly clicks the completion button on the result screen.
    // This prevents the bug where tasks are marked complete before the user sees their results.
    if (initialContext?.autoStart && finalScore < targetMinScore) {
      setError(`Goal not met: You need at least ${targetMinScore}% score to complete this mission. Please try the quiz again!`);
    }
  };

  // --- RENDERERS ---

  const handleWordClick = async (word: string) => {
    const cleanWord = word.replace(/[^\w\s-']/g, '').trim();
    if (!cleanWord) return;

    setSelectedWord(cleanWord);
    setShowTranslateModal(true);
    setIsTranslating(true);
    setTranslation(null);

    try {
      const trans = await translateText(cleanWord, 'en-id');
      setTranslation(trans);
    } catch (e) {
      console.error(e);
      setTranslation({ translation: 'Gagal menerjemahkan. Coba lagi.' });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveToVocab = async () => {
    if (selectedWord && translation?.translation) {
      await saveVocab({
        id: '',
        english: selectedWord.toLowerCase(),
        indonesian: translation.translation,
        category: saveCategory,
        isUserGenerated: true
      });
      setShowTranslateModal(false);
      audioService.play('magic');
    }
  };

  const renderSetup = () => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-2 md:px-0">
      <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
        <i className="fas fa-arrow-left"></i> Back to Home
      </button>
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-fuchsia-500/5 pointer-events-none" />

        {/* Header */}
        <div className="relative bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 p-4 md:p-6 text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 text-white text-lg md:text-xl">
            <i className="fas fa-headphones"></i>
          </div>
          <h2 className="text-base md:text-xl font-black text-white tracking-tight">Listening Practice</h2>
          <p className="text-white/50 text-[9px] md:text-[10px] font-bold mt-0.5">Train your ear with AI-generated audio</p>
        </div>

        <div className="relative bg-white dark:bg-gray-800 p-4 md:p-6 space-y-5 md:space-y-6">
          {/* Mode Toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-0.5 rounded-xl flex">
              <button onClick={() => setIsCustomMode(false)} className={`px-4 py-1.5 md:px-5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition ${!isCustomMode ? 'bg-white dark:bg-gray-600 shadow-sm text-pink-600 dark:text-white' : 'text-gray-400'}`}>Standard</button>
              <button onClick={() => setIsCustomMode(true)} className={`px-4 py-1.5 md:px-5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition ${isCustomMode ? 'bg-white dark:bg-gray-600 shadow-sm text-pink-600 dark:text-white' : 'text-gray-400'}`}>Custom</button>
            </div>
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-[9px] md:text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5"><i className="fas fa-layer-group text-pink-400"></i> Level</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
              {LEVELS.map(l => (
                <motion.button key={l} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setLevel(l)} className={`py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-black transition-all ${level === l ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100'}`}>{l}</motion.button>
              ))}
            </div>
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-[9px] md:text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5"><i className="fas fa-sliders-h text-rose-400"></i> Type</label>
            <div className="flex gap-2 md:gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setType('monologue')} className={`flex-1 p-2.5 md:p-3 rounded-xl border-2 transition flex items-center justify-center gap-2 text-[10px] md:text-xs ${type === 'monologue' ? 'border-pink-400 bg-pink-50/50 dark:bg-pink-900/10 text-pink-700 font-black' : 'border-gray-100 dark:border-gray-700 text-gray-400'}`}><i className="fas fa-user text-xs"></i> Monologue</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setType('dialogue')} className={`flex-1 p-2.5 md:p-3 rounded-xl border-2 transition flex items-center justify-center gap-2 text-[10px] md:text-xs ${type === 'dialogue' ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-900/10 text-rose-700 font-black' : 'border-gray-100 dark:border-gray-700 text-gray-400'}`}><i className="fas fa-user-friends text-xs"></i> Dialogue</motion.button>
            </div>
          </div>

          {/* Accent Selection */}
          <div>
            <label className="block text-[9px] md:text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5"><i className="fas fa-globe text-indigo-400"></i> Accent</label>
            <div className="grid grid-cols-4 gap-1.5 md:gap-2">
              {['Default', 'US', 'UK', 'AU'].map(a => (
                <motion.button key={a} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAccent(a)} className={`py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-black transition-all ${accent === a ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-gray-100'}`}>{a}</motion.button>
              ))}
            </div>
          </div>

          {/* Theme or Custom */}
          {!isCustomMode ? (
            <div>
              <label className="block text-[9px] md:text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5"><i className="fas fa-palette text-fuchsia-400"></i> Topic</label>
              <div className="flex gap-2 mb-2.5">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setThemeCategory('islamic')} className={`flex-1 py-1.5 md:py-2 rounded-xl border-2 text-[9px] md:text-[10px] font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${themeCategory === 'islamic' ? 'border-pink-400 text-pink-600 bg-pink-50/50 dark:bg-pink-900/10' : 'border-gray-100 text-gray-400 dark:border-gray-700'}`}><i className="fas fa-moon"></i> Islamic</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setThemeCategory('general')} className={`flex-1 py-1.5 md:py-2 rounded-xl border-2 text-[9px] md:text-[10px] font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${themeCategory === 'general' ? 'border-rose-400 text-rose-600 bg-rose-50/50 dark:bg-rose-900/10' : 'border-gray-100 text-gray-400 dark:border-gray-700'}`}><i className="fas fa-globe"></i> General</motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-40 md:max-h-56 overflow-y-auto custom-scrollbar p-0.5">
                {LISTENING_THEMES.filter(t => themeCategory === 'islamic' ? t.isIslamic : !t.isIslamic).map(t => (
                  <motion.button key={t.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setThemeId(t.id)} className={`p-2.5 md:p-3 rounded-xl text-left transition border-2 text-[10px] md:text-xs font-bold ${themeId === t.id ? 'border-pink-400 bg-gradient-to-r from-pink-50/50 to-rose-50/50 dark:from-pink-900/10 dark:to-rose-900/10 text-pink-700 dark:text-pink-300' : 'border-transparent bg-gray-50 dark:bg-gray-700 text-gray-500 hover:border-gray-200'}`}>{t.name}{t.isIslamic && <span className="ml-1">🌙</span>}</motion.button>
                ))}
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div><label className="block text-[9px] md:text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Topic Theme</label><input value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="e.g. Life in Medina..." className="w-full p-2.5 md:p-3.5 rounded-xl border-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-[11px] md:text-sm font-bold transition" /></div>
              <div><label className="block text-[9px] md:text-[10px] font-black text-gray-400 mb-1.5 uppercase tracking-widest">Specific Title <span className="text-[9px] font-medium text-gray-300 ml-1">(Optional)</span></label><input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Leave empty for AI suggestions..." className="w-full p-2.5 md:p-3.5 rounded-xl border-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-[11px] md:text-sm font-bold transition" /></div>
            </motion.div>
          )}

          {error && <p className="text-red-500 text-center text-[10px] md:text-sm font-bold border border-red-100 p-2.5 rounded-xl bg-red-50/50">{error}</p>}

          <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={() => !isCustomMode ? handleFetchTitles(false) : handleCustomStart()} disabled={loading || (!isCustomMode && !themeId) || (isCustomMode && !customTopic)} className="w-full py-3 md:py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black text-xs md:text-sm shadow-xl disabled:opacity-30 flex items-center justify-center gap-2 transition-all">
            {loading ? <span className="flex items-center gap-2"><i className="fas fa-circle-notch fa-spin"></i> {statusMsg || 'Loading...'}</span> : <span className="flex items-center gap-2"><i className={`fas ${!isCustomMode ? 'fa-search' : 'fa-magic'} text-xs`}></i>{!isCustomMode ? 'Get Lessons' : (customTitle ? 'Start Now' : 'Suggestions')}</span>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const renderTitles = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTitles = titles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(titles.length / itemsPerPage);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-5 max-w-4xl mx-auto pb-20 px-2 md:px-0">
        <div className="flex items-center justify-between bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <button onClick={() => setStep('setup')} className="text-gray-400 hover:text-gray-700 flex items-center gap-2 font-bold text-[10px] md:text-xs uppercase tracking-widest"><i className="fas fa-arrow-left"></i> Back</button>
          <div className="flex items-center gap-2.5">
            {!isCustomMode && (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleFetchTitles(true)} disabled={loading} className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-pink-500 transition flex items-center justify-center"><i className={`fas fa-sync-alt text-xs ${loading ? 'fa-spin' : ''}`}></i></motion.button>
            )}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase">{level}</span>
            <span className="font-bold text-gray-600 dark:text-gray-300 text-[10px] md:text-xs">{isCustomMode ? customTopic : LISTENING_THEMES.find(t => t.id === themeId)?.name}</span>
          </div>
        </div>
        <h2 className="text-lg md:text-xl font-black text-gray-800 dark:text-white px-1">Select a Conversation</h2>

        {error && (<div className="bg-red-50 border border-red-100 p-3 rounded-xl text-red-500 text-[10px] md:text-xs font-bold flex items-center gap-2"><i className="fas fa-exclamation-circle"></i> {error}</div>)}

        {loading ? (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="flex gap-1.5">{[0, 1, 2].map(i => <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-500" />)}</div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{statusMsg || 'Preparing content...'}</span>
          </div>
        ) : titles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 font-bold text-sm mb-3">No suggestions found.</p>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setStep('setup')} className="px-5 py-2 bg-pink-500 text-white rounded-xl font-bold text-xs">Go Back</motion.button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-3">
              {currentTitles.map((title, idx) => {
                const isCompleted = !!completedTitlesData[title];
                const score = completedTitlesData[title]?.score;
                return (
                  <motion.button key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => handleSelectTitle(title)} className={`p-3.5 md:p-4 rounded-2xl border hover:shadow-lg transition-all text-left h-full flex flex-col justify-between group relative overflow-hidden ${isCompleted ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:border-green-300' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-pink-300'}`}>
                    {isCompleted && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl-lg z-10 shadow-sm flex items-center gap-1">
                        <i className="fas fa-check-circle"></i> Done
                      </div>
                    )}
                    <h3 className={`font-bold text-[11px] md:text-sm leading-snug line-clamp-2 ${isCompleted ? 'text-green-800 dark:text-green-100 group-hover:text-green-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-pink-600'}`}>{title}</h3>
                    <div className="flex items-center justify-between mt-3 w-full">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isCompleted ? 'bg-green-200 dark:bg-green-800/50 text-green-700 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-500 group-hover:text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-300 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-rose-500 group-hover:text-white'}`}>
                        <i className={`fas ${isCompleted ? 'fa-check' : 'fa-play'} text-[8px]`}></i>
                      </div>
                      {isCompleted && score !== undefined && (
                        <div className="text-right">
                          <div className="text-[8px] md:text-[9px] font-black text-green-600/70 uppercase tracking-widest">Score</div>
                          <div className="text-xs md:text-sm font-black text-green-700">{Math.round(score)}</div>
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowTitleModal(true)} className="bg-gray-50/50 dark:bg-gray-800/50 p-3.5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-pink-400 hover:bg-pink-50/50 transition flex flex-col items-center justify-center gap-2 group min-h-[90px]">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition text-pink-500"><i className="fas fa-plus"></i></div>
                <span className="font-black uppercase tracking-widest text-[8px] md:text-[9px] text-gray-400 group-hover:text-pink-600">Custom Title</span>
              </motion.button>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-pink-500 transition"><i className="fas fa-chevron-left text-xs"></i></motion.button>
                <span className="text-[10px] font-black text-gray-400">{currentPage} / {totalPages}</span>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-pink-500 transition"><i className="fas fa-chevron-right text-xs"></i></motion.button>
              </div>
            )}
          </>
        )}
      </motion.div>
    );
  };

  const goToNextTopic = () => {
    if (missionTopicIndex < missionTopics.length - 1) {
      const nextIndex = missionTopicIndex + 1;
      setMissionTopicIndex(nextIndex);
      const nextTopic = missionTopics[nextIndex];
      setScore(0);
      setHasListenedToEnd(false);

      // Check if prefetch cache is ready
      if (nextTopicCacheRef.current?.topicIndex === nextIndex && nextTopicCacheRef.current.topic === nextTopic) {
        const cached = nextTopicCacheRef.current;
        nextTopicCacheRef.current = null;
        selectionRequestRef.current += 1;
        setSelectedTitle(nextTopic);
        setCustomTopic(nextTopic);
        setType(cached.type as 'monologue' | 'dialogue');
        setScript(cached.script);
        setSpeakers(cached.speakers);
        setQuiz(cached.quiz);
        setUserAnswers(cached.quiz.length > 0 ? new Array(cached.quiz.length).fill(-1) : []);
        setAudioUrl(cached.audioUrl);
        setCurrentTime(0); setDuration(0); setIsPlaying(false); setPlaybackSpeed(1.0);
        setStep('player');
      } else {
        if (nextTopicCacheRef.current) {
          URL.revokeObjectURL(nextTopicCacheRef.current.audioUrl);
          nextTopicCacheRef.current = null;
        }
        // No cache, generate normally
        const selectedType = Math.random() > 0.5 ? 'dialogue' : 'monologue';
        setSelectedTitle(nextTopic);
        setCustomTopic(nextTopic);
        setType(selectedType);
        setQuiz([]);
        setUserAnswers([]);
        processSelection(nextTopic, nextTopic, false, level, selectedType);
      }
    }
  };

  const allTopicsComplete = completedTopics.size >= missionTopics.length && missionTopics.length > 0;

  const renderPlayer = () => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0">
      {audioUrl && <audio key={audioUrl} ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleAudioEnded} />}
      <button onClick={() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; } setIsPlaying(false); setStep('titles'); }} className="text-gray-400 hover:text-gray-700 flex items-center gap-2 font-bold text-[10px] md:text-xs uppercase tracking-widest"><i className="fas fa-arrow-left"></i> Back to Topics</button>

      {/* Audio Generation Failed — Retry Card */}
      {!audioUrl && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-5 md:p-7 rounded-2xl md:rounded-3xl shadow-xl border-2 border-red-200 dark:border-red-800/50 text-center"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center text-2xl md:text-3xl mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-400"></i>
          </div>
          <h3 className="text-sm md:text-base font-black text-gray-800 dark:text-white mb-1">Audio Generation Failed</h3>
          <p className="text-[10px] md:text-xs text-gray-400 mb-5 font-medium">The audio could not be generated. Please check your connection and try again.</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => processSelection(selectedTitle, customTopic, false, level, type)}
            className="px-6 py-2.5 md:py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-black text-xs md:text-sm shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <i className="fas fa-redo"></i> Retry Generate Audio
          </motion.button>
        </motion.div>
      )}

      {/* Mission Progress Bar */}
      {isMissionMode && missionTopics.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Topic {missionTopicIndex + 1} of {missionTopics.length}
            </span>
            <span className="text-[10px] font-black text-pink-600">
              {completedTopics.size}/{missionTopics.length} completed (+{missionXpReward} XP)
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(completedTopics.size / missionTopics.length) * 100}%` }}
              transition={{ duration: 0.4 }}
              className={`h-full rounded-full ${allTopicsComplete ? 'bg-green-500' : 'bg-gradient-to-r from-pink-400 to-rose-500'}`}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            {missionTopics.map((topic, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === missionTopicIndex ? 'bg-pink-500 scale-125 shadow-md shadow-pink-300' :
                    completedTopics.has(i) ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                title={topic}
              />
            ))}
          </div>
          {/* Mission Navigation */}
          <div className="mt-3">
            {allTopicsComplete ? (
              <button
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
              >
                <i className="fas fa-gift mr-2"></i> Complete Mission +{missionXpReward} XP
              </button>
            ) : completedTopics.has(missionTopicIndex) && missionTopicIndex < missionTopics.length - 1 ? (
              <button
                onClick={goToNextTopic}
                className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest"
              >
                Next Topic <i className="fas fa-chevron-right ml-1"></i>
              </button>
            ) : null}
          </div>
        </div>
      )}

      {initialContext?.autoStart && !isMissionMode && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-5 md:p-6 text-white shadow-xl mb-2 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <i className="fas fa-headphones-alt text-6xl"></i>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Listening Mission</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i className="fas fa-bullseye text-[8px]"></i> Goal: {initialContext.minScore || 80}%
                </span>
              </div>
            </div>
            <h3 className="text-lg font-black mb-1">{initialContext.title}</h3>
            <p className="text-xs opacity-90 font-medium">{initialContext.desc}</p>
          </div>
        </motion.div>
      )}

      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-fuchsia-500/5 pointer-events-none" />
        <div className="relative bg-white dark:bg-gray-800 p-5 md:p-8 text-center">
          {/* Title */}
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div className="text-left flex-1">
              <h2 className="text-sm md:text-lg font-black text-gray-800 dark:text-white leading-tight line-clamp-2">{selectedTitle}</h2>
              <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">{type === 'dialogue' ? '💬 Conversation' : '🎤 Monologue'}</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRegenerate} className="text-pink-600 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 px-2.5 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition shrink-0 ml-3"><i className="fas fa-sync-alt"></i> New</motion.button>
          </div>

          {/* Headphone Orb */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center text-xl md:text-3xl mx-auto mb-5 md:mb-6 shadow-xl text-white">
            <i className={`fas fa-headphones-alt ${isPlaying ? 'animate-pulse' : ''}`}></i>
          </div>

          {/* Progress */}
          <div className="mb-5 md:mb-6 px-1">
            <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} className="w-full h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            <div className="flex justify-between text-[9px] md:text-[10px] font-bold text-gray-400 mt-1.5"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 md:gap-6 mb-5 md:mb-6">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 5; }} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center transition" title="Rewind 5s"><i className="fas fa-undo-alt text-[10px]"></i><span className="text-[8px] font-bold ml-0.5">5s</span></motion.button>
            <div className="relative">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 font-black text-[9px] md:text-[10px] flex items-center justify-center transition">{playbackSpeed}x</motion.button>
              {showSpeedMenu && <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-1 min-w-[55px] flex flex-col gap-0.5 z-20">{SPEED_OPTIONS.map(spd => (<button key={spd} onClick={() => handleSpeedChange(spd)} className={`px-2 py-1.5 text-[9px] md:text-[10px] font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${playbackSpeed === spd ? 'text-pink-600 bg-pink-50 dark:bg-pink-900/20' : 'text-gray-500'}`}>{spd}x</button>))}</div>}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={togglePlayback} className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-xl flex items-center justify-center text-xl md:text-2xl"><i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play pl-0.5'}`}></i></motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { if (audioRef.current) audioRef.current.currentTime += 5; }} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center transition" title="Forward 5s"><i className="fas fa-redo-alt text-[10px]"></i><span className="text-[8px] font-bold ml-0.5">5s</span></motion.button>
          </div>

          {/* Transcript Toggle */}
          <div className="mb-4">
            <button onClick={() => setShowTranscript(!showTranscript)} className="text-[10px] md:text-xs font-bold text-pink-500 bg-pink-50 dark:bg-pink-900/20 px-4 py-2 rounded-xl transition hover:bg-pink-100 uppercase tracking-widest">
              <i className={`fas ${showTranscript ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i> {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
            </button>
          </div>

          {/* Transcript View */}
          <AnimatePresence>
            {showTranscript && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="text-left bg-gray-50 dark:bg-gray-700/30 p-4 md:p-6 rounded-2xl max-h-60 overflow-y-auto custom-scrollbar border border-gray-100 dark:border-gray-700">
                  {script.split('\n').map((line, idx) => {
                    if (!line.trim()) return <br key={idx} />;
                    const isSpeakerLine = line.includes(':');
                    const [speaker, ...rest] = isSpeakerLine ? line.split(':') : ['', line];
                    const content = isSpeakerLine ? rest.join(':') : line;

                    return (
                      <p key={idx} className="mb-3 text-[11px] md:text-xs lg:text-sm leading-relaxed">
                        {isSpeakerLine && <span className="font-black text-pink-600 dark:text-pink-400 mr-2">{speaker}:</span>}
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {content.split(/\s+/).map((word, wIdx) => (
                            <span key={wIdx} onClick={() => handleWordClick(word)} className="inline-block hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 rounded px-0.5 cursor-pointer transition-colors mr-1">
                              {word}
                            </span>
                          ))}
                        </span>
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!quiz.length && !quizLoading && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleGenerateQuiz} className="px-5 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-xl font-black text-[10px] md:text-sm shadow-lg transition"><i className="fas fa-sync-alt mr-1.5"></i> Retry Quiz</motion.button>
          )}
          {quizLoading && <div className="py-3 text-purple-500 font-black animate-pulse text-[10px] md:text-xs flex items-center justify-center gap-2"><i className="fas fa-magic"></i> Preparing quiz automatically...</div>}
          {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl mt-4 border border-red-100 text-[10px] md:text-xs font-bold">{error}</div>}
        </div>
      </div>

      {quiz.length > 0 && audioUrl && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-5 md:p-7 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm md:text-base font-black text-gray-800 dark:text-white mb-4 md:mb-5 flex items-center gap-2"><i className="fas fa-clipboard-list text-purple-500"></i> Comprehension Quiz</h3>
          <div className="space-y-4 md:space-y-6">{quiz.map((q, idx) => (
            <div key={idx} className="space-y-2"><p className="font-bold text-xs md:text-sm text-gray-800 dark:text-gray-200">{idx + 1}. {q.question}</p>{q.options && q.options.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">{q.options.map((opt, optIdx) => (<motion.button key={optIdx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { const newAnswers = [...userAnswers]; newAnswers[idx] = optIdx; setUserAnswers(newAnswers); }} className={`p-2.5 md:p-3 rounded-xl text-left text-[11px] md:text-sm transition border-2 ${userAnswers[idx] === optIdx ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 text-gray-500'}`}>{opt}</motion.button>))}</div>
            ) : <p className="text-red-500 text-[9px] italic">Error loading options.</p>}</div>
          ))}</div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmitQuiz} disabled={userAnswers.includes(-1) || !audioUrl} className="w-full mt-5 md:mt-6 py-3 md:py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-black text-sm shadow-xl disabled:opacity-30 transition">Submit Answers</motion.button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderResult = () => (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto text-center bg-white dark:bg-gray-800 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 mx-2 md:mx-auto">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-3xl md:text-4xl mx-auto mb-4 md:mb-5 shadow-xl text-white ${score >= 70 ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`}>
        <i className={`fas ${score >= 70 ? 'fa-trophy' : 'fa-star-half-alt'}`}></i>
      </motion.div>
      <h2 className="text-3xl md:text-5xl font-black text-gray-800 dark:text-white mb-1">{score}%</h2>
      <p className="text-[10px] md:text-xs text-gray-400 mb-5 md:mb-6 font-black uppercase tracking-widest">Comprehension Score</p>

      <div className="flex justify-center gap-1.5 mb-5">
        {[...Array(3)].map((_, i) => (
          <motion.i key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }} className={`fas fa-star text-xl md:text-2xl ${i < Math.ceil(score / 100 * 3) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
        ))}
      </div>

      <div className="text-left bg-gray-50 dark:bg-gray-700/50 p-4 md:p-5 rounded-xl md:rounded-2xl mb-5 md:mb-6 max-h-48 md:max-h-60 overflow-y-auto custom-scrollbar space-y-3">
        {quiz.map((q, idx) => (
          <div key={idx}>
            <div className="font-bold text-[10px] md:text-xs text-gray-700 dark:text-gray-200 mb-1">Q{idx + 1}: {q.question}</div>
            {q.options && q.options.length > 0 && userAnswers[idx] !== undefined && userAnswers[idx] >= 0 && (
              <div className={`text-[10px] md:text-xs ${userAnswers[idx] === q.correctIndex ? 'text-green-600 font-bold' : 'text-red-500'}`}>
                You: {q.options[userAnswers[idx]] || '(No answer)'}
                {userAnswers[idx] !== q.correctIndex && <span className="block text-green-600 mt-0.5">✓ {q.options[q.correctIndex]}</span>}
              </div>
            )}
            <div className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 italic">{q.explanation}</div>
          </div>
        ))}
      </div>
      {/* Mission Navigation in Result */}
      {isMissionMode ? (
        <div className="space-y-2 mt-4">
          {allTopicsComplete ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleComplete}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-black text-sm shadow-lg uppercase tracking-widest">
              <i className="fas fa-gift mr-2"></i> Complete Mission +{missionXpReward} XP
            </motion.button>
          ) : completedTopics.has(missionTopicIndex) && missionTopicIndex < missionTopics.length - 1 ? (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={goToNextTopic}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm uppercase tracking-widest">
              Next Topic <i className="fas fa-chevron-right ml-1"></i>
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setStep('player'); setScore(0); setUserAnswers([]); }}
              className="w-full py-3 bg-pink-500 text-white rounded-xl font-black text-sm uppercase tracking-widest">
              Try Again
            </motion.button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Completion is routed to the source lane: Daily Plan or Roadmap. */}
          {initialContext?.autoStart && score >= (initialContext?.minScore || 80) && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleComplete}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-black text-sm shadow-lg uppercase tracking-widest">
              <i className="fas fa-check-circle mr-2"></i> {initialContext?.type === 'unit' ? 'Selesaikan Langkah Roadmap' : `Complete Daily Task +${initialContext?.xpReward || 15} XP`}
            </motion.button>
          )}
          {initialContext?.autoStart && score < (initialContext?.minScore || 80) && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setStep('player'); setScore(0); setUserAnswers([]); }}
              className="w-full py-3 bg-pink-500 text-white rounded-xl font-black text-sm uppercase tracking-widest">
              <i className="fas fa-redo mr-1"></i> Try Again
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { setStep('setup'); setScore(0); setQuiz([]); if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(null); setHasListenedToEnd(false); }} className="px-8 py-2.5 md:py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-xl font-black hover:bg-gray-200 transition text-sm">Back to Menu</motion.button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {step === 'setup' && renderSetup()}
      {step === 'titles' && renderTitles()}
      {step === 'player' && renderPlayer()}
      {step === 'result' && renderResult()}

      {/* Custom Title Modal */}
      <AnimatePresence>
        {showTitleModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4 flex justify-between items-center text-white">
                <h3 className="text-sm md:text-base font-black flex items-center gap-2"><i className="fas fa-edit"></i> Custom Title</h3>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowTitleModal(false)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center"><i className="fas fa-times text-xs"></i></motion.button>
              </div>
              <div className="p-5 space-y-3.5">
                <input placeholder="e.g. Discussing Charity..." value={newCustomTitle} onChange={(e) => setNewCustomTitle(e.target.value)}
                  className="w-full p-3 border-2 border-gray-100 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition text-sm font-medium" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRandomTitle} disabled={randomTitleLoading}
                  className="w-full py-2.5 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300 rounded-xl font-bold text-xs hover:bg-purple-100 transition flex items-center justify-center gap-2">
                  {randomTitleLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>} Surprise Me
                </motion.button>
                <div className="flex gap-2 pt-1">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowTitleModal(false)} className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-xl font-bold text-xs">Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { if (newCustomTitle.trim()) { handleSelectTitle(newCustomTitle); setShowTitleModal(false); } }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-black text-xs shadow-lg">Start</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Translation Popup Overlay */}
      <AnimatePresence>
        {showTranslateModal && selectedWord && (
          <>
            {/* Backdrop overlay for light dismiss (clicking outside closes) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTranslateModal(false)}
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-4 md:p-5 border-2 border-pink-100 dark:border-gray-700 custom-scrollbar"
            >
              <button onClick={() => setShowTranslateModal(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition"><i className="fas fa-times text-xs"></i></button>
              <div className="mb-3 pr-6">
                <h4 className="text-base md:text-lg font-black text-gray-800 dark:text-white capitalize">{selectedWord}</h4>
                <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Translation Lookup</p>
              </div>

              {isTranslating ? (
                <div className="py-6 flex flex-col items-center justify-center gap-3">
                  <i className="fas fa-circle-notch fa-spin text-pink-500 text-2xl"></i>
                  <span className="text-xs text-gray-500 font-bold animate-pulse">Translating...</span>
                </div>
              ) : translation ? (
                <div className="space-y-3">
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-2.5 rounded-2xl border border-pink-100 dark:border-pink-900/50">
                    <p className="font-black text-pink-600 dark:text-pink-400 text-xs md:text-sm">{translation.translation}</p>
                  </div>
                  {translation.examples && translation.examples.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Example</p>
                      <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300 italic">"{translation.examples[0]}"</p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Save To Folder</label>
                    {!isCreatingCat ? (
                      <div className="flex gap-2">
                        <select value={saveCategory} onChange={e => setSaveCategory(e.target.value)} className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs font-bold text-gray-800 dark:text-white outline-none">
                          <optgroup label="Default">
                            <option value="Listening">Listening</option>
                            <option value="User Added">User Added</option>
                          </optgroup>
                          {customCategories.length > 0 && (
                            <optgroup label="Custom Folders">
                              {customCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </optgroup>
                          )}
                        </select>
                        <button onClick={() => setIsCreatingCat(true)} className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 font-bold transition-colors">
                          <i className="fas fa-plus text-[10px]"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 p-2 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <input type="text" placeholder="Folder Name..." value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs font-bold text-gray-800 dark:text-white outline-none" />
                        <div className="flex flex-col gap-1 mt-0.5">
                          <label className="text-[8px] font-bold text-gray-500">Icon & Color</label>
                          <div className="flex gap-1.5 items-center">
                            <div className="flex flex-wrap gap-1 flex-1">
                              {['fa-folder', 'fa-star', 'fa-heart', 'fa-book', 'fa-bookmark', 'fa-gem'].map(icon => (
                                <button key={icon} onClick={() => setNewCatIcon(icon)} className={`w-5.5 h-5.5 flex items-center justify-center rounded transition-all ${newCatIcon === icon ? 'bg-pink-100 text-pink-600 border border-pink-300' : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                  <i className={`fas ${icon} text-[10px]`}></i>
                                </button>
                              ))}
                            </div>
                            <div className="flex-shrink-0">
                              <input type="color" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0 shadow-sm" />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1.5 mt-0.5">
                          <button onClick={() => setIsCreatingCat(false)} className="flex-1 py-1 rounded text-[9px] font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                          <button onClick={() => {
                            if (newCatName.trim()) {
                              const newCat = { name: newCatName.trim(), icon: newCatIcon, color: newCatColor };
                              saveCustomCategory(newCat);
                              setCustomCategories(getCustomCategories());
                              setSaveCategory(newCat.name);
                              setIsCreatingCat(false);
                              setNewCatName('');
                            }
                          }} className="flex-1 py-1 rounded text-[9px] font-bold bg-pink-500 text-white hover:bg-pink-600 transition-colors">Create</button>
                        </div>
                      </div>
                    )}
                    <button onClick={handleSaveToVocab} className="w-full mt-2.5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-black text-xs shadow-lg hover:shadow-xl transition flex items-center justify-center gap-1.5">
                      <i className="fas fa-bookmark text-[10px]"></i> Save Word
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListeningModule;
