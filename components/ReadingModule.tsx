import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Level, Theme, ReadingContent, ModuleProps, AppView, VocabItem, ModuleContext, ReadingIndexItem, StaticReadingTranslateItem } from '../types';
import { LEVELS, THEMES, AVATAR_ICONS } from '../constants';
import { THEMATIC_BRIDGES } from '../data/thematicBridges';
import { generateReadingTitles, generateReadingContent, generateReadingContentStream, analyzePronunciationAudio, getWordIPA, translateText, generateSingleReadingTitle, safeParseJSON, generateTranslationText, evaluateTranslation, TranslationResult } from '../services/gemini';
import { saveProgress, getCachedTitles, setCachedTitles, getCachedContent, setCachedContent, logActivity, saveVocab, completeRoadmapUnit, saveCustomCategory, getCustomCategories, CustomCategory } from '../services/storage';
import { audioService } from '../services/audioService';
import { ttsService } from '../services/ttsService';
import { getStaticReadingIndex, getStaticReadingItem, getStaticReadingLibrarySummary } from '../services/readingContent';
import { savePendingRecording, getPendingRecording, deletePendingRecording } from '../services/pendingRecordings';

interface WordAnalysis {
  word: string;
  status: 'correct' | 'incorrect' | 'neutral' | 'unread';
  clean: string;
  errorDetails?: string;
}

const normalizeTaskTitle = (title?: string) => (title || '').replace(/^Reading:\s*/i, '').trim();
const getMissionKey = (context?: ModuleContext | null) => {
  if (context?.taskId) return `daily:${context.taskId}`;
  if (context?.stepId) return `roadmap:${context.stepId}`;
  return `manual:${normalizeTaskTitle(context?.title)}`;
};

const ReadingModule: React.FC<ModuleProps> = ({ onComplete, initialContext, onNavigate }) => {
  const handleComplete = () => {
    localStorage.removeItem('lovspeak_state_reading');
    onComplete?.();
  };

  const buildWordList = (contentObj: ReadingContent): WordAnalysis[] => {
    const words: WordAnalysis[] = [];
    if (contentObj.paragraphs && Array.isArray(contentObj.paragraphs)) {
      contentObj.paragraphs.forEach(para => {
        if (typeof para !== 'string') return;
        para.split(/\s+/).forEach(word => {
          words.push({ word: word, clean: word.toLowerCase().replace(/[^a-z0-9]/g, ''), status: 'neutral' });
        });
      });
    }
    return words;
  };

  // Navigation State
  const [step, setStep] = useState<'setup' | 'titles' | 'reading' | 'translate'>('setup');
  const [practiceType, setPracticeType] = useState<'read' | 'translate'>('read');

  // Selection State
  const [level, setLevel] = useState<Level>('A1');
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [themeCategory, setThemeCategory] = useState<'islamic' | 'general' | 'custom'>('islamic');
  const [customTopic, setCustomTopic] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  // Data State
  const [titles, setTitles] = useState<string[]>([]);
  const [titleIdMap, setTitleIdMap] = useState<Record<string, string>>({});
  const [content, setContent] = useState<ReadingContent | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Reading & Analysis State
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [wordList, setWordList] = useState<WordAnalysis[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Translation Practice State
  const [translateParagraphs, setTranslateParagraphs] = useState<string[]>([]);
  const [translateAnswerKey, setTranslateAnswerKey] = useState('');
  const [translateAudioBlob, setTranslateAudioBlob] = useState<Blob | null>(null);
  const [isTranslateRecording, setIsTranslateRecording] = useState(false);
  const [translateResult, setTranslateResult] = useState<TranslationResult | null>(null);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [showTranslateAnswer, setShowTranslateAnswer] = useState(false);
  const translateRecorderRef = useRef<MediaRecorder | null>(null);
  const translateChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // UI Helpers
  const [fontSize, setFontSize] = useState(18);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [selectedWordInfo, setSelectedWordInfo] = useState<{ word: string, ipa: string, rect?: DOMRect } | null>(null);
  const [ipaLoading, setIpaLoading] = useState(false);

  // Modal for Custom Title
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [randomTitleLoading, setRandomTitleLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Sequential Mission Mode
  const [missionBridgeIndex, setMissionBridgeIndex] = useState(0);
  const [completedBridges, setCompletedBridges] = useState<Set<string>>(new Set());
  const isMissionMode = !!(initialContext?.bridgeIds && initialContext.bridgeIds.length > 0);
  const missionBridgeIds = initialContext?.bridgeIds || [];

  // Sequential Mission Mode — static library items (e.g. Daily Plan asking for 2-3 distinct readings)
  const [missionReadingIndex, setMissionReadingIndex] = useState(0);
  const [completedReadingItems, setCompletedReadingItems] = useState<Set<number>>(new Set());
  const isStaticMissionMode = !!(initialContext?.readingItemIds && initialContext.readingItemIds.length > 1);
  const missionReadingIds = initialContext?.readingItemIds || [];

  // Recovery of a recording whose AI analysis failed (e.g. offline, API error).
  // Only tracked for Daily Plan / Roadmap tasks (initialContext.taskId present) so free-practice
  // reading isn't polluted with cached blobs.
  const [currentReadingItemId, setCurrentReadingItemId] = useState('');
  const [pendingRecording, setPendingRecording] = useState<Blob | null>(null);
  const [isResendingRecording, setIsResendingRecording] = useState(false);
  const recordingKey = initialContext?.taskId
    ? `${initialContext.taskId}::${currentReadingItemId || content?.title || ''}`
    : null;

  // Vocabulary Save Modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveWordInput, setSaveWordInput] = useState('');
  const [saveTransInput, setSaveTransInput] = useState('');

  // Category State
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [saveCategory, setSaveCategory] = useState('Reading');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-folder');
  const [newCatColor, setNewCatColor] = useState('#ec4899');

  // Add this effect to load categories
  useEffect(() => {
    setCustomCategories(getCustomCategories());
  }, []);

  const startTimeRef = useRef<number>(0);

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    // Load saved state (even for autoStart, to support resume)

    const savedState = localStorage.getItem('lovspeak_state_reading');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setStep(state.step || 'setup');
        setLevel(state.level || 'A1');
        setTheme(state.theme || THEMES[0]);
        setThemeCategory(state.themeCategory || 'islamic');
        setPracticeType(state.practiceType || 'read');
        setCustomTopic(state.customTopic || '');
        setCustomTitle(state.customTitle || '');
        setTitles(state.titles || []);
        setTitleIdMap(state.titleIdMap || {});
        setContent(state.content || null);
        setSelectedTitle(state.selectedTitle || '');
        const restoredWordList = state.wordList?.length ? state.wordList : (state.content ? buildWordList(state.content) : []);
        setWordList(restoredWordList);
        setAnalysisResult(state.analysisResult || null);
        setFontSize(state.fontSize || 18);
        setIsFocusMode(state.isFocusMode || false);
        setCurrentPage(state.currentPage || 1);
        setMissionBridgeIndex(state.missionBridgeIndex || 0);
        if (state.completedBridgesArr) {
          setCompletedBridges(new Set(state.completedBridgesArr));
        }
        setMissionReadingIndex(state.missionReadingIndex || 0);
        if (state.completedReadingItemsArr) {
          setCompletedReadingItems(new Set(state.completedReadingItemsArr));
        }
      } catch (e) {
        console.error("Failed to load reading state", e);
      }
    }
  }, []);

  const [completedTitlesData, setCompletedTitlesData] = useState<Record<string, { score: number }>>({});

  useEffect(() => {
    try {
      const existing = localStorage.getItem('lovelya_progress');
      if (existing) {
        const list = JSON.parse(existing);
        const map: Record<string, { score: number }> = {};
        list.forEach((p: any) => {
          if (p.title) {
            if (!map[p.title] || map[p.title].score < p.score) {
              map[p.title] = { score: p.score };
            }
          }
        });
        setCompletedTitlesData(map);
      }
    } catch (e) { }
  }, [step]);

  // --- LIBRARY (PERPUSTAKAAN) STATE ---
  const [themeCounts, setThemeCounts] = useState<Record<string, { total: number; completed: number }>>({});
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [continueEntry, setContinueEntry] = useState<{ title: string; themeId: string; score: number } | null>(null);

  useEffect(() => {
    if (step !== 'setup' || themeCategory === 'custom') return;
    let cancelled = false;
    setLibraryLoading(true);
    (async () => {
      const summary = await getStaticReadingLibrarySummary(practiceType, level);
      const entries = summary
        ? THEMES.map((t) => {
            const themeSummary = summary.themes[t.id];
            const titles = themeSummary?.titles || [];
            return [t.id, { total: themeSummary?.total || 0, completed: titles.filter(title => !!completedTitlesData[title]).length }] as const;
          })
        : await Promise.all(
            THEMES.map(async (t) => {
              const items = await getStaticReadingIndex(practiceType, level, t);
              if (!items) return [t.id, { total: 0, completed: 0 }] as const;
              const completed = items.filter(it => !!completedTitlesData[it.title]).length;
              return [t.id, { total: items.length, completed }] as const;
            })
          );
      if (cancelled) return;
      setThemeCounts(Object.fromEntries(entries));
      setLibraryLoading(false);
    })();
    return () => { cancelled = true; };
  }, [step, level, practiceType, themeCategory, completedTitlesData]);

  useEffect(() => {
    if (step !== 'setup') return;
    try {
      const existing = localStorage.getItem('lovelya_progress');
      if (!existing) { setContinueEntry(null); return; }
      const list = JSON.parse(existing).filter((p: any) => p.level === level && p.title && p.themeId && p.themeId !== 'custom');
      if (!list.length) { setContinueEntry(null); return; }
      list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const last = list[0];
      setContinueEntry({ title: last.title, themeId: last.themeId, score: last.score });
    } catch (e) {
      setContinueEntry(null);
    }
  }, [step, level]);

  const handleContinueReading = async () => {
    if (!continueEntry) return;
    const matchedTheme = THEMES.find(t => t.id === continueEntry.themeId);
    if (!matchedTheme) return;
    const category = matchedTheme.isIslamic ? 'islamic' : 'general';
    setTheme(matchedTheme);
    setThemeCategory(category);

    const staticItems = await getStaticReadingIndex(practiceType, level, matchedTheme);
    const match = staticItems?.find(it => it.title === continueEntry.title);
    if (match) {
      setTitleIdMap({ [match.title]: match.id });
      setSelectedTitle(match.title);
      if (practiceType === 'translate') {
        setStep('translate');
        await loadStaticTranslateItem(match.id);
      } else {
        setLoading(true);
        setStatusMsg('Loading content...');
        setContent(null);
        setStep('reading');
        await loadStaticReadItem(match.title, match.id);
      }
      return;
    }
    handleSelectTitle(continueEntry.title);
  };

  const handleOpenTheme = (t: Theme) => {
    const category = t.isIslamic ? 'islamic' : 'general';
    setTheme(t);
    setThemeCategory(category);
    handleStartSetup(false, t, category);
  };

  useEffect(() => {
    const stateToSave = {
      initialTitle: initialContext?.title,
      taskId: initialContext?.taskId,
      missionKey: getMissionKey(initialContext),
      step, level, theme, themeCategory, practiceType, customTopic, customTitle,
      titles, titleIdMap, content, selectedTitle, wordList, analysisResult,
      fontSize, isFocusMode, currentPage, missionBridgeIndex,
      completedBridgesArr: Array.from(completedBridges),
      missionReadingIndex,
      completedReadingItemsArr: Array.from(completedReadingItems)
    };
    localStorage.setItem('lovspeak_state_reading', JSON.stringify(stateToSave));
  }, [step, level, theme, themeCategory, practiceType, customTopic, customTitle, titles, titleIdMap, content, selectedTitle, wordList, analysisResult, fontSize, isFocusMode, currentPage, missionBridgeIndex, completedBridges, missionReadingIndex, completedReadingItems]);

  // --- AUTO START LOGIC ---
  const autoLaunchedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (initialContext?.autoStart) {
      const key = `${initialContext.taskId || ''}|${initialContext.stepId || ''}|${initialContext.targetLessonId || ''}|${initialContext.title}`;
      if (autoLaunchedKeyRef.current === key) return;
      autoLaunchedKeyRef.current = key;
      autoLaunch(initialContext);
    }
  }, [initialContext]);

  const autoLaunch = async (ctx: ModuleContext) => {
    setLoading(true);
    setStatusMsg('Preparing guided content...');

    const userLevel = ctx.level || 'A1';
    setLevel(userLevel);

    // Determine title and topic
    let finalTitle = ctx.title;
    let finalTopic = ctx.vocabTheme || ctx.promptContext || 'General';

    if (ctx.type === 'daily') {
      finalTitle = ctx.title.replace(/^Reading:\s*/i, '');
      finalTopic = finalTitle;
    }

    // Check if we have a saved state for this exact task
    const savedStateStr = localStorage.getItem('lovspeak_state_reading');
    if (savedStateStr) {
      try {
        const state = JSON.parse(savedStateStr);
        const contextKey = getMissionKey(ctx);
        const isMissionContext = Boolean(ctx.taskId || ctx.stepId);
        const isSameSavedTask = state.missionKey
          ? state.missionKey === contextKey
          : !isMissionContext && normalizeTaskTitle(state.initialTitle) === normalizeTaskTitle(ctx.title);

        if (isSameSavedTask && state.step !== 'setup' && state.content) {
          // Same task with content cached — just restore from localStorage (already loaded by first useEffect)
          // NOTE: Never resume to a state with analysisResult, force user to re-record
          if (!state.wordList?.length) {
            prepareWordList(state.content);
          }
          setAnalysisResult(null);
          setAudioBlob(null);
          setLoading(false);
          setStatusMsg('');
          return;
        } else if (!isSameSavedTask) {
          // Different task — clear old state to prevent cross-contamination
          localStorage.removeItem('lovspeak_state_reading');
          setStep('setup');
          setTitles([]);
          setTitleIdMap({});
          setContent(null);
          setSelectedTitle('');
          setWordList([]);
          setAnalysisResult(null);
          setCurrentPage(1);
          setMissionBridgeIndex(0);
          setCompletedBridges(new Set());
          setMissionReadingIndex(0);
          setCompletedReadingItems(new Set());
          setStreamingText('');
          setIsFocusMode(false);
          setAudioBlob(null);
          setTranslateParagraphs([]);
          setTranslateAnswerKey('');
          setTranslateAudioBlob(null);
          setTranslateResult(null);
          setShowTranslateAnswer(false);
        }
      } catch (e) { }
    }

    // 0a. If the daily plan asks for multiple distinct readings, open the first one in sequential mission mode
    if (ctx.readingItemIds && ctx.readingItemIds.length > 0) {
      const opened = await loadStaticReadItem(finalTitle, ctx.readingItemIds[0]);
      if (opened) return;
    }

    // 0b. If the roadmap/daily-plan step points at a specific static reading item, open it directly (no AI generation)
    if (ctx.targetLessonId) {
      const opened = await loadStaticReadItem(finalTitle, ctx.targetLessonId);
      if (opened) return;
    }

    let bridgeTopic = finalTopic;
    let bridgeTitle = finalTitle;

    // 1. Check for Sequential Mission (multiple bridges)
    if (ctx.bridgeIds && ctx.bridgeIds.length > 0) {
      const firstBridgeId = ctx.bridgeIds[0];
      if (THEMATIC_BRIDGES[firstBridgeId]) {
        bridgeTopic = THEMATIC_BRIDGES[firstBridgeId].unitTitle;
        bridgeTitle = bridgeTopic;
      }
    } else if (ctx.bridgeId && THEMATIC_BRIDGES[ctx.bridgeId]) { // 2. Check for single Bridge ID
      bridgeTopic = THEMATIC_BRIDGES[ctx.bridgeId].unitTitle;
      bridgeTitle = bridgeTopic;
    }

    setCustomTopic(bridgeTopic);
    setThemeCategory('custom');
    await handleSelectTitle(bridgeTitle);
  };



  // Mission Navigation
  const currentBridgePassed = !!analysisResult && analysisResult.score >= (initialContext?.minScore || 85);

  const handleMissionBridgeComplete = () => {
    if (!currentBridgePassed) return;
    const currentBridgeId = missionBridgeIds[missionBridgeIndex];
    setCompletedBridges(prev => new Set(prev).add(currentBridgeId));
  };

  const goToNextBridge = () => {
    if (!currentBridgePassed) return;
    handleMissionBridgeComplete();
    if (missionBridgeIndex < missionBridgeIds.length - 1) {
      const nextIndex = missionBridgeIndex + 1;
      setMissionBridgeIndex(nextIndex);
      const nextBridgeId = missionBridgeIds[nextIndex];
      const bridge = THEMATIC_BRIDGES[nextBridgeId];
      if (bridge) {
        setCustomTopic(bridge.unitTitle);
        setThemeCategory('custom');
        handleSelectTitle(bridge.unitTitle);
      }
      setAnalysisResult(null);
      setWordList([]);
    }
  };

  const allBridgesComplete = completedBridges.size >= missionBridgeIds.length && missionBridgeIds.length > 0;

  // Mission Navigation — static library items (Daily Plan multi-reading tasks)
  const handleMissionReadingComplete = () => {
    if (!currentBridgePassed) return;
    setCompletedReadingItems(prev => new Set(prev).add(missionReadingIndex));
  };

  const goToNextReadingItem = async () => {
    if (!currentBridgePassed) return;
    handleMissionReadingComplete();
    if (missionReadingIndex < missionReadingIds.length - 1) {
      const nextIndex = missionReadingIndex + 1;
      setMissionReadingIndex(nextIndex);
      setLoading(true);
      setStatusMsg('Loading next article...');
      await loadStaticReadItem('', missionReadingIds[nextIndex]);
    }
  };

  const allReadingItemsComplete = completedReadingItems.size >= missionReadingIds.length && missionReadingIds.length > 0;

  // --- INTERACTION HANDLERS ---

  const handleWordClick = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    audioService.play('tap');
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    ttsService.speak(text, 'en-US', 0.9);

    const cleanWord = text.replace(/[^a-zA-Z]/g, '');
    if (!cleanWord) return;
    setIpaLoading(true);
    setSelectedWordInfo({ word: cleanWord, ipa: '...', rect });
    try {
      const ipa = await getWordIPA(cleanWord);
      setSelectedWordInfo(prev => prev ? { ...prev, ipa } : null);
    } catch (e) {
      setSelectedWordInfo(prev => prev ? { ...prev, ipa: '' } : null);
    } finally {
      setIpaLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setSelectedWordInfo(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Restore a previously-failed recording for this exact task/item, if one is cached.
  useEffect(() => {
    if (!recordingKey) {
      setPendingRecording(null);
      return;
    }
    let cancelled = false;
    getPendingRecording(recordingKey).then(rec => {
      if (!cancelled) setPendingRecording(rec ? rec.blob : null);
    });
    return () => { cancelled = true; };
  }, [recordingKey]);

  const handleResendPendingRecording = () => {
    if (!pendingRecording) return;
    setIsResendingRecording(true);
    processAnalysis(pendingRecording).finally(() => setIsResendingRecording(false));
  };

  const handleDiscardPendingRecording = async () => {
    if (recordingKey) await deletePendingRecording(recordingKey);
    setPendingRecording(null);
  };

  const handleSaveToVocab = async (word: string) => {
    setSaveWordInput(word);
    setSaveTransInput('');
    setLoading(true);
    setStatusMsg('Translating...');
    try {
      const trans = await translateText(word, 'en-id');
      setSaveTransInput(trans.translation);
      setShowSaveModal(true);
    } catch (e) {
      setShowSaveModal(true);
    } finally {
      setLoading(false);
      setStatusMsg('');
      setSelectedWordInfo(null);
    }
  };

  const prepareWordList = (contentObj: ReadingContent) => {
    setWordList(buildWordList(contentObj));
  };

  const applyStaticTitleIndex = (items: ReadingIndexItem[]) => {
    setTitles(items.map(item => item.title));
    setTitleIdMap(
      items.reduce<Record<string, string>>((acc, item) => {
        acc[item.title] = item.id;
        return acc;
      }, {}),
    );
    setCurrentPage(1);
    setStep('titles');
  };

  const loadStaticReadItem = async (title: string, itemId: string) => {
    const item = await getStaticReadingItem('read', itemId);
    if (!item || !('paragraphs' in item)) return false;

    const nextContent: ReadingContent = { title: item.title, paragraphs: item.paragraphs };
    setContent(nextContent);
    prepareWordList(nextContent);
    setAudioBlob(null);
    setAnalysisResult(null);
    setCurrentReadingItemId(itemId);
    setStep('reading');
    setLoading(false);
    setStatusMsg('');
    return true;
  };

  const loadStaticTranslateItem = async (itemId: string) => {
    const item = await getStaticReadingItem('translate', itemId);
    if (!item || !('answerKey' in item)) return false;

    const translateItem = item as StaticReadingTranslateItem;
    setTranslateParagraphs(translateItem.paragraphs);
    setTranslateAnswerKey(translateItem.answerKey);
    setStep('translate');
    return true;
  };

  const handleRandomTitle = async () => {
    setRandomTitleLoading(true);
    try {
      const currentThemeName = themeCategory === 'custom' ? customTopic : theme.name;
      const isIslamicLocal = themeCategory === 'islamic';
      const random = await generateSingleReadingTitle(level, currentThemeName, isIslamicLocal);
      setNewCustomTitle(random);
    } catch (e) {
      console.error(e);
    } finally {
      setRandomTitleLoading(false);
    }
  };

  // --- NAVIGATION & FETCHING ---

  const handleStartSetup = async (forceRefresh = false, overrideTheme?: Theme, overrideCategory?: 'islamic' | 'general' | 'custom') => {
    setError('');
    setTitleIdMap({});

    const effectiveTheme = overrideTheme || theme;
    const effectiveCategory = overrideCategory || themeCategory;

    if (effectiveCategory === 'custom' && customTitle) {
      handleSelectTitle(customTitle);
      return;
    }

    const currentThemeName = effectiveCategory === 'custom' ? customTopic : effectiveTheme.name;
    const isIslamicLocal = effectiveCategory === 'islamic';

    if (effectiveCategory !== 'custom') {
      const staticItems = await getStaticReadingIndex(practiceType, level, effectiveTheme);
      if (staticItems && staticItems.length > 0) {
        applyStaticTitleIndex(staticItems);
        return;
      }
    }

    if (effectiveCategory !== 'custom' && !forceRefresh) {
      const cached = getCachedTitles(level, effectiveTheme.id);
      if (cached && cached.length > 0) {
        setTitles(cached);
        setStep('titles');
        return;
      }
    }

    setLoading(true);
    setStatusMsg(forceRefresh ? 'Refreshing topics...' : 'Generating topics...');
    audioService.play('tap');
    try {
      const generatedTitles = await generateReadingTitles(level, currentThemeName, isIslamicLocal);
      if (!generatedTitles || generatedTitles.length === 0) {
        throw new Error("No titles were generated. Please try again.");
      }
      setTitles(generatedTitles);
      setCurrentPage(1);
      if (effectiveCategory !== 'custom') {
        setCachedTitles(level, effectiveTheme.id, generatedTitles);
      }
      setStep('titles');
    } catch (e: any) {
      setError(e.message || 'Failed to load titles. Please try a different topic.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const handleSelectTitle = async (title: string) => {
    audioService.play('nav');
    setError('');
    setSelectedTitle(title);
    setStreamingText('');
    startTimeRef.current = Date.now();
    const currentThemeName = themeCategory === 'custom' ? customTopic : theme.name;
    const isIslamicLocal = themeCategory === 'islamic';

    if (practiceType === 'translate') {
      setLoading(true);
      setStatusMsg('Generating translation exercise...');
      setTranslateResult(null);
      setTranslateAudioBlob(null);
      setShowTranslateAnswer(false);
      setRecordingTime(0);
      try {
        const staticItemId = titleIdMap[title];
        if (staticItemId) {
          const usedStatic = await loadStaticTranslateItem(staticItemId);
          if (usedStatic) {
            return;
          }
        }

        const result = await generateTranslationText(level, currentThemeName, isIslamicLocal, title);
        if (!result || !result.paragraphs || result.paragraphs.length === 0) {
          throw new Error('Failed to generate translation text.');
        }
        setTranslateParagraphs(result.paragraphs);
        setTranslateAnswerKey(result.answerKey);
        setStep('translate');
      } catch (e: any) {
        setError(e.message || 'Failed to generate text.');
      } finally {
        setLoading(false);
        setStatusMsg('');
      }
      return;
    }

    if (themeCategory !== 'custom') {
      const staticItemId = titleIdMap[title];
      if (staticItemId) {
        setLoading(true);
        setStatusMsg('Loading content...');
        setContent(null);
        setStep('reading');
        const usedStatic = await loadStaticReadItem(title, staticItemId);
        if (usedStatic) {
          return;
        }
      }

      const cached = getCachedContent(level, theme.id, title);
      if (cached) {
        setContent(cached);
        prepareWordList(cached);
        setAudioBlob(null);
        setAnalysisResult(null);
        setStep('reading');
        setLoading(false);
        setStatusMsg('');
        return;
      }
    }

    setLoading(true);
    setStatusMsg('Generating content...');
    try {
      setContent(null); // Clear previous content
      setStep('reading'); // Show reading view immediately with skeleton loader
      const stream = await generateReadingContentStream(title, level, currentThemeName, isIslamicLocal);
      let fullText = '';

      for await (const chunk of (stream as any)) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          // Try to extract paragraphs from the growing JSON string
          const parsed = safeParseJSON(fullText, null);
          if (parsed && parsed.paragraphs) {
            setContent(parsed);
          } else {
            // Fallback: just show the raw text if JSON isn't valid yet
            setStreamingText(fullText.replace(/\{.*"paragraphs":\s*\[|\]\}/g, '').replace(/"/g, ''));
          }
        }
      }

      let finalParsed = safeParseJSON(fullText, { title, paragraphs: [] });

      // If streaming produced empty paragraphs, fallback to non-streaming generation
      if (!finalParsed.paragraphs || finalParsed.paragraphs.length === 0) {
        console.warn('[Reading] Stream produced empty content, falling back to non-stream generation...');
        setStreamingText('Retrying content generation...');
        try {
          const fallbackContent = await generateReadingContent(title, level, currentThemeName, isIslamicLocal);
          if (fallbackContent && fallbackContent.paragraphs && fallbackContent.paragraphs.length > 0) {
            finalParsed = fallbackContent;
          } else {
            throw new Error('Fallback also produced empty content.');
          }
        } catch (fallbackErr) {
          console.error('[Reading] Fallback generation also failed:', fallbackErr);
          setError('Failed to generate reading content. Please try again.');
          return;
        }
      }

      setContent(finalParsed);
      if (themeCategory !== 'custom') {
        setCachedContent(level, theme.id, title, finalParsed);
      }
      prepareWordList(finalParsed);
      setAudioBlob(null);
      setAnalysisResult(null);
    } catch (e) {
      setError('Failed to generate reading content. Please try again.');
    } finally {
      setLoading(false);
      setStatusMsg('');
      setStreamingText('');
    }
  };

  // Generate a brand new reading text for this title via AI, for this session only.
  // This never overwrites the authored static content bank — it only replaces what's shown right now.
  const handleRegenerateReadingText = async () => {
    if (!window.confirm("Generate a brand new reading text for this title? The original will still be there next time.")) return;
    const currentThemeName = themeCategory === 'custom' ? customTopic : theme.name;
    const isIslamicLocal = themeCategory === 'islamic';
    setLoading(true);
    setError('');
    setStatusMsg('Generating new text...');
    setStreamingText('');
    try {
      setContent(null);
      const stream = await generateReadingContentStream(selectedTitle, level, currentThemeName, isIslamicLocal);
      let fullText = '';
      for await (const chunk of (stream as any)) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          const parsed = safeParseJSON(fullText, null);
          if (parsed && parsed.paragraphs) {
            setContent(parsed);
          } else {
            setStreamingText(fullText.replace(/\{.*"paragraphs":\s*\[|\]\}/g, '').replace(/"/g, ''));
          }
        }
      }
      let finalParsed = safeParseJSON(fullText, { title: selectedTitle, paragraphs: [] });
      if (!finalParsed.paragraphs || finalParsed.paragraphs.length === 0) {
        const fallbackContent = await generateReadingContent(selectedTitle, level, currentThemeName, isIslamicLocal);
        if (fallbackContent && fallbackContent.paragraphs && fallbackContent.paragraphs.length > 0) {
          finalParsed = fallbackContent;
        } else {
          throw new Error('Failed to generate new text.');
        }
      }
      setContent(finalParsed);
      prepareWordList(finalParsed);
      setAudioBlob(null);
      setAnalysisResult(null);
    } catch (e) {
      console.error(e);
      setError('Failed to generate new text. Please try again.');
    } finally {
      setLoading(false);
      setStatusMsg('');
      setStreamingText('');
    }
  };

  // --- RECORDING & ANALYSIS ---

  const processAnalysis = async (blob: Blob) => {
    if (!content) return;
    setLoading(true);
    setStatusMsg('Analyzing pronunciation...');
    setError('');

    const keyForThisAttempt = recordingKey;

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          // Use the actual words from the wordList to ensure consistency
          const effectiveWordList = wordList.length > 0
            ? wordList
            : (content ? buildWordList(content) : []);
          const targetText = effectiveWordList.map(w => w.word).join(' ');

          if (!targetText.trim()) {
            setError("Reference text is empty. Please reopen the task to reload the reading text.");
            setLoading(false);
            setStatusMsg('');
            return;
          }

          const result: any = await analyzePronunciationAudio(targetText, base64, blob.type || 'audio/webm');

          if (result && result.wordAnalysis) {
            const newWordList = [...effectiveWordList];
            const aiWords = result.wordAnalysis || [];

            let aiIdx = 0;
            let origIdx = 0;
            let correctCount = 0;
            let incorrectCount = 0;
            let missedCount = 0;

            // Reset all to unread for this new recording
            newWordList.forEach((w) => {
              w.status = 'unread';
              w.errorDetails = '';
            });

            while (aiIdx < aiWords.length && origIdx < newWordList.length) {
              const aiData = aiWords[aiIdx];
              const aiClean = aiData.word.toLowerCase().replace(/[^a-z0-9]/g, '');

              let foundMatch = -1;
              for (let i = 0; i < 5 && origIdx + i < newWordList.length; i++) {
                if (newWordList[origIdx + i].clean === aiClean) {
                  foundMatch = origIdx + i;
                  break;
                }
              }

              if (foundMatch !== -1) {
                newWordList[foundMatch].status = aiData.status;
                newWordList[foundMatch].errorDetails = aiData.errorDetails || '';

                if (aiData.status === 'correct') {
                  correctCount++;
                } else if (aiData.status === 'missed') {
                  missedCount++;
                } else {
                  incorrectCount++;
                }

                origIdx = foundMatch + 1;
                aiIdx++;
              } else {
                aiIdx++;
              }
            }

            setWordList(newWordList);

            const totalOriginalWords = newWordList.length;
            const totalReadWords = correctCount + incorrectCount; // ONLY words actually attempted

            const calculatedScore = totalOriginalWords > 0 ? (correctCount / totalOriginalWords) * 100 : 0;
            const calculatedAccuracy = totalReadWords > 0 ? (correctCount / totalReadWords) * 100 : 0;

            result.score = calculatedScore;
            result.accuracy = calculatedAccuracy;
            result.correctCount = correctCount;
            result.incorrectCount = incorrectCount;
            result.missedCount = missedCount;

            setAnalysisResult(result);

            // Analysis succeeded: this recording no longer needs to be kept around for retry.
            if (keyForThisAttempt) {
              deletePendingRecording(keyForThisAttempt);
              setPendingRecording(null);
            }

            // Save progress
            const score = Math.round(calculatedScore);
            const accuracy = Math.round(calculatedAccuracy);

            saveProgress({
              level,
              themeId: themeCategory === 'custom' ? 'custom' : theme.id,
              title: content.title,
              score,
              accuracy,
              date: new Date().toISOString()
            });

            const targetMinScore = initialContext?.minScore || 85;
            logActivity({
              type: AppView.READING,
              date: new Date().toISOString(),
              durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
              score,
              accuracy,
              details: content.title,
              metadata: {
                completed: score >= targetMinScore,
                planTaskId: initialContext?.taskId,
                stepId: initialContext?.stepId,
                materialId: initialContext?.targetLessonId,
                materialTitle: content.title,
                source: initialContext?.type || 'manual'
              }
            });

            if (initialContext?.stepId && score >= targetMinScore) {
              completeRoadmapUnit(initialContext.stepId);
            }

            // NOTE: Do NOT call onComplete() here. The task should only be marked
            // complete from a button on the result UI, not automatically on analysis.
            if (initialContext?.autoStart && score < targetMinScore) {
              setError(`Goal not met: You need at least ${targetMinScore}% score to complete this mission. Please try practicing again!`);
            }

            // Scroll to results with a slight delay to ensure rendering
            setTimeout(() => {
              const element = document.getElementById('analysis-results-anchor');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 800);
          } else {
            setError("AI could not provide an analysis. Please try recording again.");
            if (keyForThisAttempt) {
              savePendingRecording(keyForThisAttempt, blob, blob.type || 'audio/webm');
              setPendingRecording(blob);
            }
          }
        } catch (innerError) {
          console.error("Inner Analysis Error:", innerError);
          setError("An error occurred during analysis. Your recording has been saved — you can leave and resend it later.");
          if (keyForThisAttempt) {
            savePendingRecording(keyForThisAttempt, blob, blob.type || 'audio/webm');
            setPendingRecording(blob);
          }
        } finally {
          setLoading(false);
          setStatusMsg('');
        }
      };
      reader.onerror = () => {
        setError("Failed to read audio data.");
        setLoading(false);
        if (keyForThisAttempt) {
          savePendingRecording(keyForThisAttempt, blob, blob.type || 'audio/webm');
          setPendingRecording(blob);
        }
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Outer Analysis Error:", e);
      setError("Failed to start analysis. Your recording has been saved — you can leave and resend it later.");
      setLoading(false);
      setStatusMsg('');
      if (keyForThisAttempt) {
        savePendingRecording(keyForThisAttempt, blob, blob.type || 'audio/webm');
        setPendingRecording(blob);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        processAnalysis(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      setError("Microphone access denied. Please enable microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- RENDERERS ---

  const renderTitles = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTitles = titles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(titles.length / itemsPerPage);

    return (
      <div className="space-y-6 md:space-y-10 lg:space-y-12 animate-fade-in max-w-6xl mx-auto pb-20 px-2 md:px-0">
        <div className="flex items-center justify-between px-2 md:px-4">
          <button onClick={() => setStep('setup')} className="text-gray-500 hover:text-gray-800 font-black flex items-center gap-2 transition text-[10px] md:text-sm lg:text-base uppercase tracking-wider">
            <i className="fas fa-arrow-left"></i> Perpustakaan
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => handleStartSetup(true)}
              disabled={loading}
              className="p-2.5 md:p-3.5 lg:p-4 rounded-xl lg:rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-lovelya-600 transition shadow-sm"
              title="Refresh Topics"
            >
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} md:text-lg`}></i>
            </button>
            <div className="bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 px-3 md:px-6 py-1.5 md:py-3 rounded-full font-black text-[9px] md:text-base lg:text-lg border border-lovelya-100 dark:border-lovelya-800 shadow-sm uppercase tracking-tight">
              {themeCategory === 'custom' ? customTopic : theme.name}
            </div>
          </div>
        </div>

        {themeCategory !== 'custom' && titles.length > 0 && (() => {
          const completedCount = titles.filter(t => !!completedTitlesData[t]).length;
          const pct = Math.round((completedCount / titles.length) * 100);
          return (
            <div className="px-2 md:px-4 -mt-2 md:-mt-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">{level} · Progres Tema</span>
                    <span className="text-[10px] md:text-xs font-black text-lovelya-600">{completedCount}/{titles.length} selesai</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${pct >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-fuchsia-400 to-rose-500'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {titles.length === 0 ? (
          <div className="text-center py-16 md:py-32 bg-white dark:bg-gray-800 rounded-3xl md:rounded-[3rem] border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-400 font-black text-xs md:text-xl lg:text-2xl mb-6">No titles found. Please try generating again.</p>
            <button onClick={() => handleStartSetup(false)} className="px-8 py-3 lg:px-12 lg:py-5 bg-lovelya-500 text-white rounded-2xl font-black text-xs md:text-lg lg:text-xl shadow-lg hover:shadow-xl transition active:scale-95">Retry</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {currentTitles.map((title, idx) => {
                const isCompleted = !!completedTitlesData[title];
                const score = completedTitlesData[title]?.score;
                return (
                  <button key={idx} onClick={() => handleSelectTitle(title)} className={`p-5 md:p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] border hover:shadow-2xl transition-all text-left h-full flex flex-col justify-between group transform hover:-translate-y-2 duration-300 shadow-sm relative overflow-hidden ${isCompleted ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:border-green-400' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-lovelya-400'}`}>
                    {isCompleted && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl z-10 shadow-sm flex items-center gap-1">
                        <i className="fas fa-check-circle"></i> Completed
                      </div>
                    )}
                    <h3 className={`font-black text-sm md:text-xl lg:text-2xl leading-tight mb-6 line-clamp-3 ${isCompleted ? 'text-green-900 dark:text-green-100 group-hover:text-green-700' : 'text-gray-800 dark:text-gray-100 group-hover:text-lovelya-600'}`}>{title}</h3>
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-9 h-9 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-inner transition-all group-hover:scale-110 ${isCompleted ? 'bg-green-200 dark:bg-green-800/50 text-green-700 dark:text-green-300 group-hover:bg-green-500 group-hover:text-white' : 'bg-lovelya-50 dark:bg-gray-700 text-lovelya-400 group-hover:bg-lovelya-500 group-hover:text-white'}`}>
                        <i className={`fas ${isCompleted ? 'fa-check' : 'fa-book-open'} text-sm md:text-2xl`}></i>
                      </div>
                      {isCompleted && score !== undefined && (
                        <div className="text-right">
                          <div className="text-[10px] md:text-xs font-black text-green-600/70 dark:text-green-400/70 uppercase tracking-widest">Score</div>
                          <div className="text-lg md:text-2xl font-black text-green-700 dark:text-green-400">{Math.round(score)}</div>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
              {/* Custom Title Card */}
              <button
                onClick={() => setShowTitleModal(true)}
                className="bg-gray-50 dark:bg-gray-800/50 p-5 md:p-8 rounded-[2rem] lg:rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-lovelya-400 hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 lg:gap-5 group min-h-[140px] md:min-h-[200px]"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-lovelya-500 text-xl md:text-3xl">
                  <i className="fas fa-plus"></i>
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-[9px] md:text-xs lg:text-sm text-gray-400 group-hover:text-lovelya-600">Custom Title</span>
              </button>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 md:gap-8 mt-10 md:mt-16 bg-white dark:bg-gray-800 p-3 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit mx-auto">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-50 dark:bg-gray-700 border border-transparent text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition-all text-sm md:text-xl active:scale-90"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="text-xs md:text-lg lg:text-xl font-black text-gray-800 dark:text-gray-200 tracking-tight">
                  Page <span className="text-lovelya-600">{currentPage}</span> <span className="text-gray-400 font-medium">/ {totalPages}</span>
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-50 dark:bg-gray-700 border border-transparent text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition-all text-sm md:text-xl active:scale-90"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // --- TRANSLATION PRACTICE LOGIC ---

  const startTranslateRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      translateChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) translateChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(translateChunksRef.current, { type: 'audio/webm' });
        setTranslateAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
        clearInterval(recordingTimerRef.current);
      };
      translateRecorderRef.current = recorder;
      recorder.start();
      setIsTranslateRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      audioService.play('tap');
    } catch (e) {
      setError('Microphone access denied. Please allow microphone permission.');
    }
  };

  const stopTranslateRecording = () => {
    if (translateRecorderRef.current && translateRecorderRef.current.state === 'recording') {
      translateRecorderRef.current.stop();
      setIsTranslateRecording(false);
      audioService.play('tap');
    }
  };

  const handleSubmitTranslation = async () => {
    if (!translateAudioBlob) return;
    setTranslateLoading(true);
    setStatusMsg('AI is evaluating your translation...');
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(translateAudioBlob);
      });
      const base64 = await base64Promise;
      const fullText = translateParagraphs.join('\n\n');
      const result = await evaluateTranslation(fullText, base64, 'audio/webm', level, translateAnswerKey);
      setTranslateResult(result);
      audioService.play('success');

      // Save overall score to progress
      if (result.overall > 0) {
        saveProgress({
          level,
          themeId: themeCategory === 'custom' ? 'custom' : theme.id,
          title: selectedTitle,
          score: result.overall,
          accuracy: result.overall,
          date: new Date().toISOString()
        });
        logActivity({
          type: AppView.READING,
          date: new Date().toISOString(),
          durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
          score: result.overall,
          accuracy: result.overall,
          details: `Translation Practice: ${selectedTitle}`,
          metadata: {
            completed: result.overall >= (initialContext?.minScore || 85),
            planTaskId: initialContext?.taskId,
            stepId: initialContext?.stepId,
            materialId: initialContext?.targetLessonId,
            materialTitle: selectedTitle,
            source: initialContext?.type || 'manual'
          }
        });
      }
    } catch (e: any) {
      setError(e.message || 'Evaluation failed.');
    } finally {
      setTranslateLoading(false);
      setStatusMsg('');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-amber-400 to-orange-500';
    return 'from-rose-500 to-red-600';
  };

  // --- TRANSLATION PRACTICE RENDER ---

  const renderTranslate = () => {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto px-3 md:px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { setStep('setup'); setTranslateResult(null); setTranslateAudioBlob(null); setShowTranslateAnswer(false); }} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all active:scale-95 shadow-inner">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex-1">
            <h2 className="text-sm md:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-language text-fuchsia-500"></i> Translation Practice
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{level} • {theme.name}</p>
          </div>
        </div>

        {/* Loading State */}
        {translateLoading && (
          <div className="flex flex-col items-center py-16 animate-fade-in">
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center animate-bounce shadow-xl">
                <i className="fas fa-brain text-white text-2xl"></i>
              </div>
            </div>
            <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">{statusMsg || 'Analyzing...'}</p>
          </div>
        )}

        {/* Indonesian Text Card */}
        {!translateLoading && !translateResult && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-3 flex items-center gap-2">
                <i className="fas fa-file-alt text-white/80 text-sm"></i>
                <span className="text-white font-black text-xs uppercase tracking-widest">Terjemahkan ke Bahasa Inggris</span>
              </div>
              <div className="p-4 md:p-5 space-y-3">
                <div className="bg-fuchsia-50 dark:bg-fuchsia-900/10 rounded-xl p-3 border border-fuchsia-100 dark:border-fuchsia-800/20 mb-1">
                  <p className="text-[11px] md:text-xs text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                    <i className="fas fa-info-circle text-fuchsia-500 mr-1.5"></i>
                    Baca teks di bawah ini, lalu <strong className="text-fuchsia-600 dark:text-fuchsia-400">terjemahkan ke Bahasa Inggris</strong> dengan menekan tombol rekam dan ucapkan terjemahanmu. Terjemahkan sebisa kamu — AI akan menilai dan memberikan koreksi!
                  </p>
                </div>
                {Array.isArray(translateParagraphs) && translateParagraphs.map((para, i) => (
                  <p key={i} className="text-gray-800 dark:text-gray-200 text-sm md:text-base font-medium leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Recording Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 md:p-5">
              <div className="text-center">
                {!translateAudioBlob ? (
                  <>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                      {isTranslateRecording ? 'Recording your translation...' : 'Tap to start recording'}
                    </p>

                    {/* Timer */}
                    {isTranslateRecording && (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 rounded-full">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                          <span className="text-rose-600 dark:text-rose-400 font-black text-sm tabular-nums">
                            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </span>
                        </span>
                      </motion.div>
                    )}

                    {/* Record Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={isTranslateRecording ? stopTranslateRecording : startTranslateRecording}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto flex items-center justify-center transition-all shadow-2xl ${isTranslateRecording
                        ? 'bg-rose-500 text-white shadow-rose-500/40 animate-pulse'
                        : 'bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50'
                        }`}
                    >
                      <i className={`fas ${isTranslateRecording ? 'fa-stop' : 'fa-microphone'} text-2xl md:text-3xl`}></i>
                    </motion.button>

                    <p className="text-[9px] font-bold text-gray-300 dark:text-gray-600 mt-3">
                      {isTranslateRecording ? 'Tap to stop' : 'Speak your English translation'}
                    </p>
                  </>
                ) : (
                  <>
                    {/* Audio Recorded - Submit */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center">
                          <i className="fas fa-check-circle text-xl"></i>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-gray-900 dark:text-white">Recording Complete</p>
                          <p className="text-[10px] text-gray-400 font-bold">
                            Duration: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => { setTranslateAudioBlob(null); setRecordingTime(0); }}
                          className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-200 active:scale-95"
                        >
                          <i className="fas fa-redo mr-1.5"></i> Re-record
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSubmitTranslation}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-fuchsia-500/20 transition-all"
                        >
                          <i className="fas fa-paper-plane mr-1.5"></i> Submit
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {translateResult && !translateLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Overall Score Hero */}
            <div className={`bg-gradient-to-br ${getScoreGradient(translateResult.overall)} rounded-2xl p-5 md:p-6 text-center text-white shadow-xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]"></div>
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 mb-2">Overall Score</p>
                <div className="text-5xl md:text-6xl font-black mb-1">{translateResult.overall}%</div>
                <p className="text-white/80 text-xs font-bold">Level {level} • Translation Practice</p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Completion', value: translateResult.completion, icon: 'fa-tasks', desc: 'Coverage' },
                { label: 'Accuracy', value: translateResult.accuracy, icon: 'fa-bullseye', desc: 'Meaning' },
                { label: 'Pronunciation', value: translateResult.pronunciation, icon: 'fa-volume-up', desc: 'Clarity' },
              ].map((item) => (
                <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-2">
                    <i className={`fas ${item.icon} text-xs md:text-sm ${getScoreColor(item.value)}`}></i>
                  </div>
                  <div className={`text-xl md:text-2xl font-black ${getScoreColor(item.value)}`}>{item.value}%</div>
                  <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center shrink-0">
                  <i className="fas fa-comment-dots text-blue-500 text-sm"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">AI Feedback</p>
                  <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium leading-relaxed">{translateResult.feedback}</p>
                </div>
              </div>
            </div>

            {/* Corrections */}
            {translateResult.corrections && translateResult.corrections.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="px-4 py-3 bg-rose-50 dark:bg-rose-900/10 border-b border-rose-100 dark:border-rose-800/30 flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle text-rose-500 text-xs"></i>
                  <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Corrections ({translateResult.corrections.length})</span>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {translateResult.corrections.map((c, i) => (
                    <div key={i} className="p-3 md:p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="w-5 h-5 rounded-md bg-rose-100 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1 space-y-1.5">
                          <p className="text-[10px] text-gray-400 font-bold">
                            <span className="text-gray-500 dark:text-gray-400">Indonesian:</span>{' '}
                            <span className="text-gray-700 dark:text-gray-200 font-black">{c.original}</span>
                          </p>
                          <div className="flex items-start gap-3">
                            <div className="flex-1 bg-rose-50 dark:bg-rose-900/10 rounded-lg p-2 border border-rose-100 dark:border-rose-800/30">
                              <p className="text-[9px] font-black text-rose-400 uppercase tracking-wider mb-0.5">You said</p>
                              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 line-through">{c.userSaid}</p>
                            </div>
                            <div className="flex items-center pt-3"><i className="fas fa-arrow-right text-[8px] text-gray-300"></i></div>
                            <div className="flex-1 bg-green-50 dark:bg-green-900/10 rounded-lg p-2 border border-green-100 dark:border-green-800/30">
                              <p className="text-[9px] font-black text-green-400 uppercase tracking-wider mb-0.5">Correct</p>
                              <p className="text-xs font-bold text-green-600 dark:text-green-400">{c.correct}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
                            <i className="fas fa-info-circle mr-1 text-gray-300"></i>{c.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Key */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <button
                onClick={() => setShowTranslateAnswer(!showTranslateAnswer)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-key text-amber-500 text-xs"></i>
                  <span className="text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">Answer Key</span>
                </div>
                <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${showTranslateAnswer ? 'rotate-180' : ''}`}></i>
              </button>
              <AnimatePresence>
                {showTranslateAnswer && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-gray-50 dark:border-gray-700 pt-3">
                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed whitespace-pre-line">{translateResult.answerKey || translateAnswerKey}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setTranslateResult(null); setTranslateAudioBlob(null); setShowTranslateAnswer(false); setRecordingTime(0); }}
                className="flex-1 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-black text-xs uppercase tracking-widest transition-all hover:bg-gray-200 active:scale-95"
              >
                <i className="fas fa-redo mr-1.5"></i> Retry
              </button>
              <button
                onClick={() => setStep('titles')}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95"
              >
                <i className="fas fa-forward mr-1.5"></i> New Topic
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderReading = () => {
    if (!content && !streamingText) {
      const returnToReadingHome = () => {
        localStorage.removeItem('lovspeak_state_reading');
        setError('');
        setSelectedTitle('');
        setContent(null);
        setWordList([]);
        setStreamingText('');
        setAnalysisResult(null);
        setAudioBlob(null);
        setStep('setup');
      };

      return (
        <div className="max-w-md mx-auto py-12 md:py-20 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 md:p-8">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl ${loading ? 'bg-lovelya-50 text-lovelya-500' : 'bg-rose-50 dark:bg-rose-900/20 text-rose-500'}`}>
              <i className={`fas ${loading ? 'fa-book-open animate-pulse' : 'fa-exclamation-triangle'}`}></i>
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">
              {loading ? 'Menyiapkan bacaan...' : 'Bacaan belum dapat dimuat'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
              {loading ? 'Mohon tunggu sebentar.' : 'Konten tidak berhasil dibuat atau dimuat. Kembali ke halaman utama Reading untuk memilih bacaan lain.'}
            </p>
            {!loading && (
              <button
                onClick={returnToReadingHome}
                className="w-full py-3.5 rounded-2xl bg-lovelya-600 text-white font-black text-sm shadow-lg shadow-lovelya-200/40 hover:bg-lovelya-700 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-redo"></i> Kembali ke Halaman Reading
              </button>
            )}
          </div>
        </div>
      );
    }
    let globalIndex = 0;
    return (
      <div className={`transition-all duration-500 ${isFocusMode ? 'fixed inset-0 z-[60] bg-gray-50 dark:bg-gray-900 overflow-y-auto' : 'max-w-6xl mx-auto px-2 md:px-0'}`}>
        <div className={`mb-4 md:mb-8 flex items-center justify-between bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-3 md:p-5 lg:p-6 rounded-2xl lg:rounded-3xl shadow-xl border border-lovelya-100 dark:border-lovelya-800 sticky top-4 z-[70] ${isFocusMode ? 'mx-4 md:mx-8 mt-4 md:mt-8' : ''}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setStep(initialContext?.autoStart ? 'setup' : 'titles')} className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all text-sm md:text-2xl shadow-inner active:scale-95"><i className="fas fa-arrow-left"></i></button>
            {initialContext?.autoStart && (
              <div className="hidden md:block">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-lovelya-500 block mb-0.5">Target Mastery</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-black text-gray-800 dark:text-white">Min. Score: {initialContext.minScore || 85}%</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2.5 md:gap-4">
            <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all text-sm md:text-2xl font-black shadow-inner active:scale-95" title="Decrease font size">A-</button>
            <button onClick={() => setFontSize(prev => Math.min(48, prev + 2))} className="w-10 h-10 md:w-14 md:h-14 rounded-xl lg:rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all text-sm md:text-2xl font-black shadow-inner active:scale-95" title="Increase font size">A+</button>
            <button onClick={() => setIsFocusMode(!isFocusMode)} className={`px-4 py-2 md:px-8 md:py-4 rounded-xl lg:rounded-2xl text-[10px] md:text-sm lg:text-base font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-2.5 md:gap-4 active:scale-95 ${isFocusMode ? 'bg-lovelya-600 text-white shadow-lovelya-500/30' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'}`}><i className={`fas ${isFocusMode ? 'fa-compress' : 'fa-expand'} md:text-xl`}></i> {isFocusMode ? 'Normal' : 'Focus View'}</button>
          </div>
        </div>

        {/* Mission Progress Bar */}
        {isMissionMode && missionBridgeIds.length > 1 && (
          <div className={`mb-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${isFocusMode ? 'mx-4 md:mx-8' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Article {missionBridgeIndex + 1} of {missionBridgeIds.length}
              </span>
              <span className="text-[10px] font-black text-lovelya-600">
                {completedBridges.size}/{missionBridgeIds.length} read (+{initialContext?.xpReward || 20} XP)
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(completedBridges.size / missionBridgeIds.length) * 100}%` }}
                transition={{ duration: 0.4 }}
                className={`h-full rounded-full ${allBridgesComplete ? 'bg-green-500' : 'bg-gradient-to-r from-lovelya-400 to-indigo-500'}`}
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              {missionBridgeIds.map((bid, i) => (
                <div
                  key={bid}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === missionBridgeIndex ? 'bg-lovelya-500 scale-125 shadow-md shadow-lovelya-300' :
                    completedBridges.has(bid) ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                />
              ))}
            </div>
            {/* Next / Complete Buttons */}
            <div className="mt-3 flex gap-2">
              {!allBridgesComplete ? (
                <button
                  onClick={goToNextBridge}
                  disabled={!currentBridgePassed || missionBridgeIndex >= missionBridgeIds.length - 1}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${currentBridgePassed && missionBridgeIndex < missionBridgeIds.length - 1
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {missionBridgeIndex < missionBridgeIds.length - 1
                    ? <>Mark Read & Next <i className="fas fa-chevron-right ml-1"></i></>
                    : <>Mark as Read <i className="fas fa-check ml-1"></i></>
                  }
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
                >
                  <i className="fas fa-gift mr-2"></i> Complete Mission +{initialContext?.xpReward || 20} XP
                </button>
              )}
              {missionBridgeIndex === missionBridgeIds.length - 1 && !allBridgesComplete && (
                <button
                  onClick={() => {
                    handleMissionBridgeComplete();
                  }}
                  disabled={!currentBridgePassed}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest ${currentBridgePassed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Mark Last as Read <i className="fas fa-check ml-1"></i>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mission Progress Bar — static library items (Daily Plan multi-reading tasks) */}
        {isStaticMissionMode && (
          <div className={`mb-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${isFocusMode ? 'mx-4 md:mx-8' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Article {missionReadingIndex + 1} of {missionReadingIds.length}
              </span>
              <span className="text-[10px] font-black text-lovelya-600">
                {completedReadingItems.size}/{missionReadingIds.length} read (+{initialContext?.xpReward || 20} XP)
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${(completedReadingItems.size / missionReadingIds.length) * 100}%` }}
                transition={{ duration: 0.4 }}
                className={`h-full rounded-full ${allReadingItemsComplete ? 'bg-green-500' : 'bg-gradient-to-r from-lovelya-400 to-indigo-500'}`}
              />
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              {missionReadingIds.map((rid, i) => (
                <div
                  key={rid}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === missionReadingIndex ? 'bg-lovelya-500 scale-125 shadow-md shadow-lovelya-300' :
                    completedReadingItems.has(i) ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                />
              ))}
            </div>
            {/* Next / Complete Buttons */}
            <div className="mt-3 flex gap-2">
              {!allReadingItemsComplete ? (
                <button
                  onClick={goToNextReadingItem}
                  disabled={!currentBridgePassed || missionReadingIndex >= missionReadingIds.length - 1}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${currentBridgePassed && missionReadingIndex < missionReadingIds.length - 1
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {missionReadingIndex < missionReadingIds.length - 1
                    ? <>Mark Read & Next <i className="fas fa-chevron-right ml-1"></i></>
                    : <>Mark as Read <i className="fas fa-check ml-1"></i></>
                  }
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
                >
                  <i className="fas fa-gift mr-2"></i> Complete Mission +{initialContext?.xpReward || 20} XP
                </button>
              )}
              {missionReadingIndex === missionReadingIds.length - 1 && !allReadingItemsComplete && (
                <button
                  onClick={handleMissionReadingComplete}
                  disabled={!currentBridgePassed}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest ${currentBridgePassed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Mark Last as Read <i className="fas fa-check ml-1"></i>
                </button>
              )}
            </div>
          </div>
        )}

        <div className={`bg-white dark:bg-gray-800 transition-all duration-500 ${isFocusMode ? 'min-h-screen py-16 px-6 md:py-24 md:px-12 lg:px-24' : 'p-6 md:p-16 lg:p-24 rounded-3xl md:rounded-[3rem] lg:rounded-[4rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.15)] border border-lovelya-50 dark:border-lovelya-900/10 mb-28 md:mb-40'}`}>
          <div id="reading-article-start" className="max-w-[80ch] mx-auto">
            <div className="flex items-start justify-between gap-3 mb-6 md:mb-12 pb-6 md:pb-12 border-b border-gray-100 dark:border-gray-700">
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">{content?.title || selectedTitle}</h1>
              {content && !loading && (
                <button onClick={handleRegenerateReadingText} title="Generate a brand new text for this title" className="shrink-0 mt-2 text-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 px-2.5 py-1.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition">
                  <i className="fas fa-magic"></i> New Text
                </button>
              )}
            </div>

            {pendingRecording && !analysisResult && (
              <div className="mb-6 md:mb-10 p-4 md:p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl md:rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center shrink-0">
                  <i className="fas fa-microphone-lines text-lg"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs md:text-sm text-gray-800 dark:text-white">Unsent recording found</p>
                  <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Your last recording for this text wasn't analyzed yet. Send it now instead of recording again.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleResendPendingRecording}
                    disabled={isResendingRecording || loading}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    {isResendingRecording ? 'Sending...' : 'Send to AI'}
                  </button>
                  <button
                    onClick={handleDiscardPendingRecording}
                    disabled={isResendingRecording || loading}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none leading-[1.6] md:leading-[1.8] lg:leading-[2.0] font-medium text-gray-700 dark:text-gray-200 space-y-7 md:space-y-12" style={{ fontSize: `${window.innerWidth < 768 ? fontSize - 1 : fontSize + 4}px` }}>
              {content ? (
                content.paragraphs && Array.isArray(content.paragraphs) && content.paragraphs.length > 0 ? (
                  content.paragraphs.map((para, pIdx) => {
                    if (typeof para !== 'string') return null;
                    return (
                      <p key={pIdx} className={`${pIdx === 0 ? 'first-letter:text-6xl md:first-letter:text-8xl lg:first-letter:text-9xl first-letter:font-black first-letter:text-lovelya-600 first-letter:mr-3 md:first-letter:mr-5 first-letter:float-left first-letter:leading-none' : ''}`}>
                        {para.split(/\s+/).map((word, wIdx) => {
                          const currentData = wordList[globalIndex++];
                          if (!currentData) return <span key={wIdx}>{word} </span>;
                          let style = "hover:bg-lovelya-50 dark:hover:bg-lovelya-900/40 rounded px-1 lg:px-2 transition-all cursor-pointer ";
                          if (currentData.status === 'correct') style += "text-green-600 dark:text-green-400 font-black ";
                          if (currentData.status === 'incorrect') style += "text-red-500 font-bold underline decoration-wavy decoration-red-300 underline-offset-4 ";
                          return (
                            <span key={wIdx} className="relative inline-block mr-1 md:mr-1.5 group">
                              <span onClick={(e) => handleWordClick(e, currentData.clean)} className={style}>{word}</span>
                              {currentData.status === 'incorrect' && (
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 md:px-5 py-1.5 md:py-2 text-[9px] md:text-xs font-black uppercase tracking-widest text-white bg-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-red-700">{currentData.errorDetails}</span>
                              )}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })
                ) : (
                  <div className="text-center py-16 md:py-24">
                    <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 md:mb-8 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center">
                      <i className="fas fa-book-open text-3xl md:text-5xl text-gray-200 dark:text-gray-600"></i>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-base md:text-lg font-bold mb-2">Content failed to load</p>
                    <p className="text-gray-300 dark:text-gray-600 text-sm mb-8">The reading text could not be generated. Please try again.</p>
                    <button
                      onClick={() => { setContent(null); setError(''); handleSelectTitle(selectedTitle); }}
                      className="px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-lovelya-500 to-indigo-500 text-white rounded-2xl font-black text-sm md:text-base uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all active:scale-95"
                    >
                      <i className="fas fa-redo mr-2"></i> Retry
                    </button>
                  </div>
                )
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg w-full"></div>
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg w-5/6"></div>
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg w-4/6"></div>
                  <p className="text-gray-400 italic text-xl mt-8">{streamingText}...</p>
                </div>
              )}
            </div>

            <div id="analysis-results-anchor" className="pt-2"></div>
            {analysisResult && (
              <div id="analysis-results" className="mt-8 md:mt-12 pt-8 md:pt-10 border-t-4 border-gray-50 dark:border-gray-800 animate-slide-up space-y-6 md:space-y-10">
                <div className="flex items-center gap-4 md:gap-6"><div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-lovelya-600 text-white flex items-center justify-center shadow-xl"><i className="fas fa-chart-line text-lg md:text-3xl"></i></div><h2 className="text-xl md:text-3xl lg:text-4xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Performance Analysis</h2></div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="p-8 md:p-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl md:rounded-[3rem] text-center shadow-inner border border-white dark:border-gray-700"><div className="text-4xl md:text-7xl font-black text-lovelya-600">{Math.round(analysisResult.score)}</div><div className="text-[10px] md:text-sm lg:text-base font-black text-gray-400 uppercase tracking-[0.3em] mt-3 md:mt-5">Performance Score</div></div>
                  <div className="p-8 md:p-12 bg-green-50 dark:bg-green-900/10 rounded-3xl md:rounded-[3rem] text-center shadow-inner border border-white dark:border-gray-700"><div className="text-4xl md:text-7xl font-black text-green-600">{Math.round(analysisResult.accuracy)}%</div><div className="text-[10px] md:text-sm lg:text-base font-black text-green-500 uppercase tracking-[0.3em] mt-3 md:mt-5">Pronunciation Accuracy</div></div>
                </div>

                {/* Word breakdown — so the color-coded words above don't need to be re-scanned manually */}
                {(typeof analysisResult.correctCount === 'number') && (
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                    <span className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl font-black text-xs md:text-sm">
                      <i className="fas fa-circle-check"></i> {analysisResult.correctCount} correct
                    </span>
                    <span className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl font-black text-xs md:text-sm">
                      <i className="fas fa-circle-xmark"></i> {analysisResult.incorrectCount} incorrect
                    </span>
                    {analysisResult.missedCount > 0 && (
                      <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl font-black text-xs md:text-sm">
                        <i className="fas fa-circle-minus"></i> {analysisResult.missedCount} missed
                      </span>
                    )}
                    <button
                      onClick={() => {
                        const el = document.getElementById('reading-article-start');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="text-lovelya-600 dark:text-lovelya-400 text-xs md:text-sm font-black underline underline-offset-2"
                    >
                      <i className="fas fa-arrow-up mr-1"></i> Review marked words
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1">
                  <div className="bg-white dark:bg-gray-800 p-8 md:p-16 lg:p-20 rounded-3xl md:rounded-[4rem] border border-gray-100 dark:border-gray-700 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-lovelya-50 dark:bg-lovelya-900/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <span className="text-[10px] md:text-sm lg:text-base font-black text-lovelya-600 dark:text-lovelya-400 uppercase tracking-[0.4em] block mb-6 md:mb-10 relative z-10">Mastery Feedback</span>
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed md:leading-snug lg:leading-normal relative z-10 font-medium italic">{analysisResult.feedback}</p>
                  </div>
                </div>

                {/* Complete Task button for plain (single-reading) daily tasks */}
                {initialContext?.autoStart && (!isMissionMode || missionBridgeIds.length === 1) && !isStaticMissionMode && analysisResult.score >= (initialContext?.minScore || 85) && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleComplete}
                      className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-base shadow-xl uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95"
                    >
                      <i className="fas fa-check-circle mr-2"></i> {initialContext?.type === 'unit' ? 'Complete & Back to Roadmap' : `Complete Daily Task +${initialContext?.xpReward || 15} XP`}
                    </button>
                  </div>
                )}

                {/* Next Article / Complete Mission buttons — colocated here so mission-mode users
                    don't have to scroll back up to the sticky mission bar to advance. */}
                {isMissionMode && missionBridgeIds.length > 1 && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {!allBridgesComplete ? (
                      <button
                        onClick={goToNextBridge}
                        disabled={!currentBridgePassed || missionBridgeIndex >= missionBridgeIds.length - 1}
                        className={`flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${currentBridgePassed && missionBridgeIndex < missionBridgeIds.length - 1
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {missionBridgeIndex < missionBridgeIds.length - 1
                          ? <>Next Article <i className="fas fa-chevron-right ml-1"></i></>
                          : <>Mark as Read <i className="fas fa-check ml-1"></i></>
                        }
                      </button>
                    ) : (
                      <button
                        onClick={handleComplete}
                        className="flex-1 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg"
                      >
                        <i className="fas fa-gift mr-2"></i> Complete Mission +{initialContext?.xpReward || 20} XP
                      </button>
                    )}
                    {missionBridgeIndex === missionBridgeIds.length - 1 && !allBridgesComplete && (
                      <button
                        onClick={handleMissionBridgeComplete}
                        disabled={!currentBridgePassed}
                        className={`flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest ${currentBridgePassed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      >
                        Mark Last as Read <i className="fas fa-check ml-1"></i>
                      </button>
                    )}
                  </div>
                )}
                {isStaticMissionMode && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {!allReadingItemsComplete ? (
                      <button
                        onClick={goToNextReadingItem}
                        disabled={!currentBridgePassed || missionReadingIndex >= missionReadingIds.length - 1}
                        className={`flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${currentBridgePassed && missionReadingIndex < missionReadingIds.length - 1
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        {missionReadingIndex < missionReadingIds.length - 1
                          ? <>Next Article ({missionReadingIndex + 2} of {missionReadingIds.length}) <i className="fas fa-chevron-right ml-1"></i></>
                          : <>Mark as Read <i className="fas fa-check ml-1"></i></>
                        }
                      </button>
                    ) : (
                      <button
                        onClick={handleComplete}
                        className="flex-1 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg"
                      >
                        <i className="fas fa-gift mr-2"></i> Complete Mission +{initialContext?.xpReward || 20} XP
                      </button>
                    )}
                    {missionReadingIndex === missionReadingIds.length - 1 && !allReadingItemsComplete && (
                      <button
                        onClick={handleMissionReadingComplete}
                        disabled={!currentBridgePassed}
                        className={`flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest ${currentBridgePassed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      >
                        Mark Last as Read <i className="fas fa-check ml-1"></i>
                      </button>
                    )}
                  </div>
                )}

                {initialContext?.autoStart && analysisResult.score < (initialContext?.minScore || 85) && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => { setAnalysisResult(null); }}
                      className="px-10 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-black text-base shadow-xl uppercase tracking-widest"
                    >
                      <i className="fas fa-redo mr-2"></i> Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedWordInfo && (
          <div
            className="fixed z-[150] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-2 md:p-3 animate-fade-in flex items-center gap-2"
            style={{
              top: Math.max(10, (selectedWordInfo.rect?.top || 0) - 70) + 'px',
              left: Math.max(10, Math.min(window.innerWidth - 200, (selectedWordInfo.rect?.left || 0) + (selectedWordInfo.rect?.width || 0) / 2 - 80)) + 'px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 border-b border-r border-gray-100 dark:border-gray-700"></div>
            <div className="flex flex-col text-center px-2 mr-2 border-r border-gray-100 dark:border-gray-700">
              <span className="font-black text-gray-800 dark:text-white text-xs md:text-sm">{selectedWordInfo.word}</span>
              <span className="text-[9px] md:text-[10px] font-bold text-gray-400">{ipaLoading ? '...' : selectedWordInfo.ipa}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); ttsService.speak(selectedWordInfo.word); }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-lovelya-50 text-lovelya-600 hover:bg-lovelya-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
              title="Play Audio"
            ><i className="fas fa-volume-up text-xs md:text-sm"></i></button>
            <button
              onClick={(e) => { e.stopPropagation(); handleSaveToVocab(selectedWordInfo.word); }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-green-50 text-green-600 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
              title="Save to Vocab"
            ><i className="fas fa-save text-xs md:text-sm"></i></button>
          </div>
        )}

        <div className="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6 animate-slide-up">
          <div className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-2xl p-3 md:p-4 rounded-3xl md:rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/10 flex items-center justify-between gap-4 md:gap-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              className={`flex-1 flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2.5 md:py-3.5 rounded-2xl md:rounded-3xl transition-all duration-300 group shadow-2xl active:scale-90 ${isRecording ? 'bg-red-600 text-white animate-pulse' : loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 hover:bg-lovelya-50 hover:scale-105'}`}
            >
              <div className={`w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center text-base md:text-xl ${isRecording ? 'bg-white/20' : loading ? 'bg-gray-300' : 'bg-gray-900 text-white shadow-xl group-hover:bg-lovelya-600 transition-colors'}`}>
                <i className={`fas ${isRecording ? 'fa-stop' : loading ? 'fa-spinner fa-spin' : 'fa-microphone'}`}></i>
              </div>
              <div className="text-left flex-1">
                <div className="text-[9px] md:text-sm font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1">
                  {isRecording ? 'Capturing...' : loading ? 'Processing...' : 'Start Practicing'}
                </div>
                <div className={`text-[8px] md:text-[11px] font-bold opacity-70 ${isRecording ? 'text-white' : 'text-gray-500'}`}>
                  {isRecording ? 'Tap to evaluate' : loading ? 'AI analyzing' : 'Evaluate with AI Tutor'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {step === 'setup' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => onNavigate?.(AppView.HOME)} className="text-gray-400 hover:text-gray-600 font-black transition-all flex items-center gap-2 uppercase text-[10px] tracking-widest">
              <i className="fas fa-arrow-left"></i> Home
            </button>
            <div className="flex gap-1.5 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              {([{ id: 'read' as const, icon: 'fa-book-open', label: 'Read' }, { id: 'translate' as const, icon: 'fa-language', label: 'Translate' }]).map(pt => (
                <button
                  key={pt.id}
                  onClick={() => setPracticeType(pt.id)}
                  className={`px-3.5 py-2 rounded-lg font-black text-[10px] md:text-xs transition-all duration-200 flex items-center gap-1.5 ${practiceType === pt.id ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <i className={`fas ${pt.icon} text-[10px]`}></i> {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero header */}
          <div className="bg-gradient-to-br from-fuchsia-500 via-rose-500 to-pink-500 rounded-[2rem] p-6 md:p-8 mb-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.25),transparent_50%)]"></div>
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <i className="fas fa-book-reader text-white/80"></i>
                  <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.25em]">Perpustakaan</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Pilih tema untuk mulai membaca</h2>
              </div>
            </div>
            <div className="relative mt-5 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {LEVELS.map(l => (
                <motion.button
                  key={l}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setLevel(l)}
                  className={`shrink-0 px-4 py-2 rounded-xl font-black text-xs transition-all ${level === l ? 'bg-white text-rose-600 shadow-md' : 'bg-white/15 text-white hover:bg-white/25'}`}
                >
                  {l}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Continue reading card */}
          {continueEntry && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleContinueReading}
              className="w-full mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 text-left hover:border-lovelya-300 transition-all"
            >
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-500 flex items-center justify-center shrink-0 text-lg md:text-xl">
                <i className="fas fa-bookmark"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] md:text-[10px] font-black text-lovelya-500 uppercase tracking-widest mb-0.5">Lanjutkan Membaca</p>
                <p className="font-black text-gray-800 dark:text-white text-sm md:text-base truncate">{continueEntry.title}</p>
              </div>
              <div className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                <i className="fas fa-arrow-right"></i>
              </div>
            </motion.button>
          )}

          {error && error !== 'API_LIMIT_TOTAL' && (
            <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold text-center border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          {/* Theme tiles */}
          {loading ? (
            <div className="flex flex-col items-center py-16 animate-fade-in">
              <i className="fas fa-book-open text-4xl text-lovelya-500 animate-bounce block mb-4"></i>
              <p className="font-black text-gray-400 uppercase tracking-widest text-[10px] text-center">{statusMsg || 'Membuka tema...'}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {([{ key: 'islamic' as const, label: 'Tema Islami' }, { key: 'general' as const, label: 'Tema Umum' }]).map(group => {
                const groupThemes = THEMES.filter(t => group.key === 'islamic' ? t.isIslamic : !t.isIslamic);
                return (
                  <div key={group.key}>
                    <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-1">{group.label}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                      {groupThemes.map(t => {
                        const counts = themeCounts[t.id];
                        const total = counts?.total ?? 0;
                        const completed = counts?.completed ?? 0;
                        const isDone = total > 0 && completed >= total;
                        return (
                          <motion.button
                            key={t.id}
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleOpenTheme(t)}
                            className={`relative p-4 md:p-5 rounded-2xl text-left border transition-all shadow-sm hover:shadow-lg ${isDone ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-lovelya-300'}`}
                          >
                            <p className={`font-black text-xs md:text-sm leading-snug mb-3 ${isDone ? 'text-green-800 dark:text-green-200' : 'text-gray-800 dark:text-gray-100'}`}>{t.name}</p>
                            <div className="flex items-center justify-between">
                              <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center ${isDone ? 'bg-green-500 text-white' : 'bg-lovelya-50 dark:bg-gray-700 text-lovelya-400'}`}>
                                <i className={`fas ${isDone ? 'fa-check' : 'fa-book-open'} text-xs`}></i>
                              </div>
                              {!libraryLoading && total > 0 && (
                                <span className={`text-[10px] font-black uppercase tracking-wider ${isDone ? 'text-green-600' : 'text-gray-400'}`}>{completed}/{total}</span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Custom AI topic (secondary, read mode only) */}
              {practiceType === 'read' && (
                <div className="pt-2">
                  <button
                    onClick={() => setThemeCategory(prev => prev === 'custom' ? 'islamic' : 'custom')}
                    className="text-[10px] font-black text-gray-400 hover:text-lovelya-500 uppercase tracking-widest flex items-center gap-2 transition-colors"
                  >
                    <i className={`fas fa-chevron-${themeCategory === 'custom' ? 'down' : 'right'} text-[8px]`}></i>
                    Topik Kustom (AI)
                  </button>
                  <AnimatePresence>
                    {themeCategory === 'custom' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-3 space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl shadow-inner border border-white dark:border-gray-700">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Topik Eksplorasi</label>
                            <input value={customTopic} onChange={e => setCustomTopic(e.target.value)} placeholder="What do you want to learn about?" className="w-full p-3 rounded-xl border-2 border-white dark:border-gray-600 bg-white dark:bg-gray-900 outline-none focus:border-lovelya-500 shadow-sm transition-all text-sm font-medium" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Judul Spesifik (Opsional)</label>
                            <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Specific article title..." className="w-full p-3 rounded-xl border-2 border-white dark:border-gray-600 bg-white dark:bg-gray-900 outline-none focus:border-lovelya-500 shadow-sm transition-all text-sm font-medium" />
                          </div>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleStartSetup(false)} disabled={loading || !customTopic} className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-600 text-white font-black text-xs shadow-lg transition-all disabled:opacity-30 uppercase tracking-widest flex items-center justify-center gap-2">
                            Mulai <i className="fas fa-chevron-right"></i>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {step === 'titles' && renderTitles()}
      {step === 'reading' && renderReading()}
      {step === 'translate' && renderTranslate()}

      {showSaveModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-700 animate-slide-up">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-6">Save to Vocabulary</h3>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">English Word</label>
                <input type="text" value={saveWordInput} onChange={e => setSaveWordInput(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:border-lovelya-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Indonesian Translation</label>
                <input type="text" value={saveTransInput} onChange={e => setSaveTransInput(e.target.value)} placeholder="Tulis arti..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:border-lovelya-500" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Save To Folder</label>
                {!isCreatingCat ? (
                  <div className="flex gap-2">
                    <select value={saveCategory} onChange={e => setSaveCategory(e.target.value)} className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-800 dark:text-white focus:outline-none focus:border-lovelya-500">
                      <optgroup label="Default">
                        <option value="Reading">Reading</option>
                        <option value="User Added">User Added</option>
                      </optgroup>
                      {customCategories.length > 0 && (
                        <optgroup label="Custom Folders">
                          {customCategories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </optgroup>
                      )}
                    </select>
                    <button onClick={() => setIsCreatingCat(true)} className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-bold transition-colors">
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <input type="text" placeholder="Folder Name..." value={newCatName} onChange={e => setNewCatName(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 dark:text-white outline-none" />
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-500">Icon & Color</label>
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {['fa-folder', 'fa-star', 'fa-heart', 'fa-book', 'fa-bookmark', 'fa-gem', 'fa-briefcase', 'fa-plane'].map(icon => (
                            <button key={icon} onClick={() => setNewCatIcon(icon)} className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${newCatIcon === icon ? 'bg-lovelya-100 text-lovelya-600 border border-lovelya-300' : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                              <i className={`fas ${icon} text-xs`}></i>
                            </button>
                          ))}
                        </div>
                        <div className="flex-shrink-0">
                          <input type="color" value={newCatColor} onChange={e => setNewCatColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 shadow-sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => setIsCreatingCat(false)} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                      <button onClick={() => {
                        if (newCatName.trim()) {
                          const newCat = { name: newCatName.trim(), icon: newCatIcon, color: newCatColor };
                          saveCustomCategory(newCat);
                          setCustomCategories(getCustomCategories());
                          setSaveCategory(newCat.name);
                          setIsCreatingCat(false);
                          setNewCatName('');
                        }
                      }} className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-lovelya-500 text-white hover:bg-lovelya-600 transition-colors">Create</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">Cancel</button>
              <button onClick={() => {
                if (saveWordInput.trim() && saveTransInput.trim()) {
                  saveVocab({
                    id: Date.now().toString(),
                    english: saveWordInput.trim(),
                    indonesian: saveTransInput.trim(),
                    category: saveCategory,
                    isUserGenerated: true
                  });
                  setShowSaveModal(false);
                }
              }} className="flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-lovelya-500 text-white hover:bg-lovelya-600 shadow-md transition-all">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Custom Title Input */}
      <AnimatePresence>
        {showTitleModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-fuchsia-600 to-rose-600 p-4 flex justify-between items-center text-white">
                <h3 className="text-sm md:text-base font-black flex items-center gap-2"><i className="fas fa-edit"></i> Custom Title</h3>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowTitleModal(false)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center"><i className="fas fa-times text-xs"></i></motion.button>
              </div>
              <div className="p-5 space-y-3.5">
                <input placeholder="e.g. My Favorite Sunnah..." value={newCustomTitle} onChange={(e) => setNewCustomTitle(e.target.value)}
                  className="w-full p-3 border-2 border-gray-100 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none transition text-sm font-medium" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRandomTitle} disabled={randomTitleLoading}
                  className="w-full py-2.5 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300 rounded-xl font-bold text-xs hover:bg-purple-100 transition flex items-center justify-center gap-2">
                  {randomTitleLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>} Surprise Me
                </motion.button>
                <div className="flex gap-2 pt-1">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowTitleModal(false)} className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-xl font-bold text-xs">Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { if (newCustomTitle.trim()) { handleSelectTitle(newCustomTitle); setShowTitleModal(false); } }}
                    className="flex-1 py-2.5 bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white rounded-xl font-black text-xs shadow-lg">Start</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for content generation / analysis loading */}
      <AnimatePresence>
        {loading && statusMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-lovelya-100 border-t-lovelya-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className={`fas ${statusMsg.includes('Analyzing') ? 'fa-microphone-alt' : 'fa-book-open'} text-lovelya-500 animate-pulse text-lg`}></i>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                  {statusMsg.includes('Analyzing') ? 'Analyzing Audio' : 'Generating Lesson'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider animate-pulse">{statusMsg}</p>
              </div>
              <div className="text-[11px] text-gray-400 font-medium max-w-[220px] leading-relaxed">
                {statusMsg.includes('Analyzing')
                  ? 'AI is carefully evaluating your pronunciation. This may take a few seconds...'
                  : 'AI is crafting a personalized lesson for your proficiency level. Please wait...'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ReadingModule;
