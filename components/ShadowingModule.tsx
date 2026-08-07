import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleProps, ShadowingTask, AppView, ModuleContext, DialogueScenario } from '../types';
import { SHADOWING_DATA, ShadowingTheme } from '../src/constants/shadowingData';
import { logActivity, completeRoadmapUnit, getActivityLogs } from '../services/storage';
import { analyzePronunciationAudio } from '../services/gemini';
import { ttsService } from '../services/ttsService';
import { getDialogueScenarios } from '../services/dialogueContent';

const calculateTextSimilarity = (s1: string, s2: string): number => {
  const normalize = (s: string) => s.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '').replace(/\s{2,}/g, ' ');
  const str1 = normalize(s1);
  const str2 = normalize(s2);
  if (str1 === str2) return 1.0;
  if (str1.length === 0 || str2.length === 0) return 0.0;

  const costs: number[] = [];
  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (str1.charAt(i - 1) !== str2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[str2.length] = lastValue;
  }
  const distance = costs[str2.length];
  return 1.0 - distance / Math.max(str1.length, str2.length);
};

const useDialogueSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  // The browser SpeechRecognition engine ends a session on any short pause;
  // we auto-restart until the user explicitly taps stop, accumulating text across sessions.
  const manualStopRef = useRef(false);
  const accumulatedRef = useRef('');
  const sessionRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let session = '';
      for (let i = 0; i < e.results.length; i++) session += e.results[i][0].transcript + ' ';
      sessionRef.current = session.trim();
      setTranscript((accumulatedRef.current + ' ' + sessionRef.current).trim());
    };
    rec.onend = () => {
      accumulatedRef.current = (accumulatedRef.current + ' ' + sessionRef.current).trim();
      sessionRef.current = '';
      if (manualStopRef.current) {
        setIsListening(false);
        return;
      }
      try {
        rec.start();
      } catch {
        setTimeout(() => {
          if (manualStopRef.current) { setIsListening(false); return; }
          try { rec.start(); } catch { setIsListening(false); }
        }, 150);
      }
    };
    rec.onerror = (e: any) => {
      if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
        manualStopRef.current = true;
      }
      // Other errors (no-speech, aborted, network) fall through to onend, which restarts.
    };
    recognitionRef.current = rec;
    return () => { manualStopRef.current = true; try { rec.stop(); } catch { /* already stopped */ } };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        manualStopRef.current = false;
        accumulatedRef.current = '';
        sessionRef.current = '';
        setTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) { console.error('Mic start error', e); }
    }
  };
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      manualStopRef.current = true;
      try { recognitionRef.current.stop(); } catch { setIsListening(false); }
    }
  };
  return { isListening, transcript, startListening, stopListening, setTranscript };
};

interface FeedbackDetail {
  score: number;
  incorrectWords: string[];
  tips: string;
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Islamic':
      return {
        bg: 'bg-gradient-to-br from-amber-50/80 to-orange-100/80 dark:from-amber-900/40 dark:to-orange-900/20 backdrop-blur-3xl border-amber-200/50 dark:border-amber-700/30 shadow-[0_8px_30px_rgb(251,191,36,0.15)]',
        badge: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200 dark:from-amber-900/60 dark:to-orange-900/60 dark:text-amber-400 dark:border-amber-700/50 shadow-sm',
        text: 'text-amber-600 dark:text-amber-400',
        textMuted: 'text-amber-700/80 bg-amber-100/50 dark:text-amber-300 dark:bg-amber-900/30',
        btnScenario: 'text-amber-500 hover:text-amber-600 hover:bg-amber-100/80 dark:hover:bg-amber-900/50 transition-all',
        iconBg: 'bg-gradient-to-br from-amber-100 to-orange-200 text-amber-600 dark:from-amber-800 dark:to-orange-900 dark:text-amber-300 shadow-inner',
        bubbleBorder: 'bg-white/70 dark:bg-black/20 border-white/60 dark:border-white/5 shadow-2xl shadow-amber-900/5',
        borderGradient: 'from-amber-400 via-orange-500 to-amber-600 shadow-amber-500/30'
      };
    case 'Idioms & Slang':
      return {
        bg: 'bg-gradient-to-br from-emerald-50/80 to-teal-100/80 dark:from-emerald-900/40 dark:to-teal-900/20 backdrop-blur-3xl border-emerald-200/50 dark:border-emerald-700/30 shadow-[0_8px_30px_rgb(52,211,153,0.15)]',
        badge: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 dark:from-emerald-900/60 dark:to-teal-900/60 dark:text-emerald-400 dark:border-emerald-700/50 shadow-sm',
        text: 'text-emerald-600 dark:text-emerald-400',
        textMuted: 'text-emerald-700/80 bg-emerald-100/50 dark:text-emerald-300 dark:bg-emerald-900/30',
        btnScenario: 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 transition-all',
        iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-600 dark:from-emerald-800 dark:to-teal-900 dark:text-emerald-300 shadow-inner',
        bubbleBorder: 'bg-white/70 dark:bg-black/20 border-white/60 dark:border-white/5 shadow-2xl shadow-emerald-900/5',
        borderGradient: 'from-emerald-400 via-teal-500 to-emerald-600 shadow-emerald-500/30'
      };
    case 'General':
    default:
      return {
        bg: 'bg-gradient-to-br from-blue-50/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-indigo-900/20 backdrop-blur-3xl border-blue-200/50 dark:border-blue-700/30 shadow-[0_8px_30px_rgb(96,165,250,0.15)]',
        badge: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 border-blue-200 dark:from-blue-900/60 dark:to-indigo-900/60 dark:text-indigo-400 dark:border-blue-700/50 shadow-sm',
        text: 'text-blue-600 dark:text-blue-400',
        textMuted: 'text-blue-700/80 bg-blue-100/50 dark:text-blue-300 dark:bg-blue-900/30',
        btnScenario: 'text-blue-500 hover:text-blue-600 hover:bg-blue-100/80 dark:hover:bg-blue-900/50 transition-all',
        iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-600 dark:from-blue-800 dark:to-indigo-900 dark:text-blue-300 shadow-inner',
        bubbleBorder: 'bg-white/70 dark:bg-black/20 border-white/60 dark:border-white/5 shadow-2xl shadow-blue-900/5',
        borderGradient: 'from-blue-400 via-indigo-500 to-indigo-600 shadow-blue-500/30'
      };
  }
};

const ShadowingModule: React.FC<ModuleProps> = ({ onComplete, initialContext, onNavigate }) => {
  const completeButtonLabel = initialContext?.type === 'assignment'
    ? 'Target tercapai — selesaikan tugas admin'
    : initialContext?.type === 'unit'
      ? 'Complete & Back to Roadmap'
      : 'Complete Daily Task';
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedMainFolder, setSelectedMainFolder] = useState<'Daily Conversations' | 'Idioms' | 'Slang' | null>(null);
  const [selectedSubFolder, setSelectedSubFolder] = useState<'General' | 'Islamic' | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ShadowingTheme | null>(null);
  const [selectedTask, setSelectedTask] = useState<ShadowingTask | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [feedbackDetail, setFeedbackDetail] = useState<FeedbackDetail | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- DIALOGUE ROLEPLAY STATE ---
  const [dialogueStage, setDialogueStage] = useState<'categories' | 'scenarios' | 'role' | 'play' | 'complete' | null>(null);
  const [dialogueScenarios, setDialogueScenarios] = useState<DialogueScenario[]>([]);
  const [dialogueLoading, setDialogueLoading] = useState(false);
  const [selectedDialogueCategory, setSelectedDialogueCategory] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<DialogueScenario | null>(null);
  const [selectedRole, setSelectedRole] = useState<'A' | 'B' | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [dialogueMatch, setDialogueMatch] = useState<number | null>(null);
  const [isDialoguePlaying, setIsDialoguePlaying] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [dialogueLineResults, setDialogueLineResults] = useState<Record<number, { score: number; hintsUsed: number }>>({});
  const [dialogueSummary, setDialogueSummary] = useState<{ score: number; passed: boolean; hintsUsed: number; turns: number } | null>(null);
  const [hintLimitMessage, setHintLimitMessage] = useState('');
  const [completedTasksData, setCompletedTasksData] = useState<Record<string, number>>({});
  const [completedDialogueScores, setCompletedDialogueScores] = useState<Record<string, number>>({});
  const dialogueStartedAtRef = useRef<number>(0);
  const launchedDailyDialogueRef = useRef<string | null>(null);
  const { isListening: isDialogueListening, transcript: dialogueTranscript, startListening: startDialogueListening, stopListening: stopDialogueListening, setTranscript: setDialogueTranscript } = useDialogueSpeech();

  const isDailyRoleplay = initialContext?.type === 'daily' && initialContext.autoStart && initialContext.shadowingMode === 'roleplay';
  const isRoadmapRoleplay = (initialContext?.type === 'unit' || initialContext?.assignmentKind === 'roadmap_pack') && initialContext?.autoStart && initialContext.shadowingMode === 'roleplay';
  const dialoguePassFloor = isDailyRoleplay ? 70 : 80;
  const dialogueTargetScore = initialContext?.minScore || 80;

  useEffect(() => {
    const scores: Record<string, number> = {};
    const dialogueScores: Record<string, number> = {};
    getActivityLogs()
      .filter(log => log.type === AppView.SHADOWING && log.metadata?.completed)
      .forEach(log => {
        if (log.metadata?.taskId) {
          const taskId = String(log.metadata.taskId);
          scores[taskId] = Math.max(scores[taskId] || 0, log.score || 0);
        }
        if (Array.isArray(log.metadata?.taskScores)) {
          log.metadata.taskScores.forEach((item: { id?: string; score?: number }) => {
            if (item.id) scores[item.id] = Math.max(scores[item.id] || 0, item.score || 0);
          });
        }
        if (log.metadata?.shadowingMode === 'roleplay' && log.metadata?.scenarioId) {
          const scenarioId = String(log.metadata.scenarioId);
          dialogueScores[scenarioId] = Math.max(dialogueScores[scenarioId] || 0, log.score || 0);
        }
      });
    setCompletedTasksData(scores);
    setCompletedDialogueScores(dialogueScores);
  }, []);

  const openDialogueRoleplay = async () => {
    setDialogueLineResults({});
    setDialogueSummary(null);
    setHintLimitMessage('');
    setDialogueStage('categories');
    if (dialogueScenarios.length === 0) {
      setDialogueLoading(true);
      const data = await getDialogueScenarios();
      setDialogueScenarios(data);
      setDialogueLoading(false);
    }
  };

  const exitDialogueRoleplay = () => {
    setDialogueStage(null);
    setSelectedDialogueCategory(null);
    setSelectedScenario(null);
    setSelectedRole(null);
    setLineIndex(0);
    setDialogueMatch(null);
    setDialogueLineResults({});
    setDialogueSummary(null);
    setHintLimitMessage('');
    setDialogueTranscript('');
    ttsService.cancel();
  };

  const dialogueCategories = Array.from(new Set(dialogueScenarios.map(s => s.category)));

  const playDialogueLine = (text: string) => {
    setIsDialoguePlaying(true);
    ttsService.speak(text, 'en-US', 0.95, 1.0, () => setIsDialoguePlaying(false), () => setIsDialoguePlaying(false));
  };

  const currentDialogueLine = selectedScenario ? selectedScenario.lines[lineIndex] : null;
  const isMyTurn = !!currentDialogueLine && currentDialogueLine.speaker === selectedRole;

  const getHintAdjustedScore = (rawScore: number, hintsUsed: number) => {
    if (!isDailyRoleplay) return rawScore;
    const scoreCeiling = hintsUsed === 0 ? 100 : hintsUsed === 1 ? 95 : hintsUsed === 2 ? 90 : 85;
    return Math.min(rawScore, scoreCeiling);
  };

  const revealDialogueHint = (wordIndex: number) => {
    if (revealedHints.has(wordIndex)) return;
    if (isDailyRoleplay && revealedHints.size >= 3) {
      setHintLimitMessage('Hint untuk kalimat ini sudah habis. Maksimal 3 kata.');
      return;
    }
    setHintLimitMessage('');
    setRevealedHints(previous => new Set(previous).add(wordIndex));
  };

  const launchDailyDialogue = async (ctx: ModuleContext) => {
    const launchKey = ctx.taskId || ctx.title;
    if (launchedDailyDialogueRef.current === launchKey) return;
    launchedDailyDialogueRef.current = launchKey;
    setDialogueLoading(true);
    try {
      const scenarios = await getDialogueScenarios();
      setDialogueScenarios(scenarios);
      const hash = launchKey.split('').reduce((total, char) => total + char.charCodeAt(0), 0);
      const eligible = scenarios.filter(scenario => {
        const roleACount = scenario.lines.filter(line => line.speaker === 'A').length;
        const roleBCount = scenario.lines.filter(line => line.speaker === 'B').length;
        return roleACount >= 3 || roleBCount >= 3;
      });
      const categoryKeywords: Array<{ terms: string[]; categories: string[] }> = [
        { terms: ['food', 'cafe', 'drink', 'cooking'], categories: ['makan', 'restoran'] },
        { terms: ['travel', 'airport', 'transport', 'city'], categories: ['perjalanan', 'transportasi'] },
        { terms: ['work', 'career', 'job', 'business'], categories: ['pekerjaan'] },
        { terms: ['health', 'body'], categories: ['kesehatan'] },
        { terms: ['school', 'education', 'learning'], categories: ['pendidikan'] },
        { terms: ['home', 'family', 'parent'], categories: ['rumah', 'keluarga', 'parenting'] },
        { terms: ['technology', 'social media'], categories: ['teknologi', 'layanan'] },
        { terms: ['islamic', 'mosque', 'halal', 'ramadan', 'umrah', 'zakat'], categories: ['islami', 'komunitas'] },
        { terms: ['money', 'shopping'], categories: ['keuangan', 'belanja', 'retail'] },
        { terms: ['social', 'relationship', 'friend'], categories: ['sosial', 'pertemanan'] }
      ];
      const themeName = (ctx.shadowingTheme || '').toLowerCase();
      const relatedCategories = categoryKeywords.find(entry => entry.terms.some(term => themeName.includes(term)))?.categories || [];
      const related = eligible.filter(scenario => relatedCategories.some(term => scenario.category.toLowerCase().includes(term)));
      const pool = related.length > 0 ? related : eligible.length > 0 ? eligible : scenarios;
      const scenario = pool[hash % pool.length];
      if (!scenario) return;
      const roleACount = scenario.lines.filter(line => line.speaker === 'A').length;
      const roleBCount = scenario.lines.filter(line => line.speaker === 'B').length;
      let role: 'A' | 'B' = ctx.shadowingRole || (hash % 2 === 0 ? 'A' : 'B');
      if ((role === 'A' ? roleACount : roleBCount) < 3) role = role === 'A' ? 'B' : 'A';

      setSelectedScenario(scenario);
      setSelectedRole(role);
      setLineIndex(0);
      setDialogueMatch(null);
      setDialogueLineResults({});
      setDialogueSummary(null);
      setRevealedHints(new Set());
      setHintLimitMessage('');
      dialogueStartedAtRef.current = Date.now();
      setDialogueStage('play');
    } finally {
      setDialogueLoading(false);
    }
  };

  useEffect(() => {
    if (dialogueStage === 'play' && currentDialogueLine && !isMyTurn) {
      playDialogueLine(currentDialogueLine.english);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex, dialogueStage]);

  useEffect(() => {
    if (!isDialogueListening && dialogueTranscript && isMyTurn && currentDialogueLine) {
      const sim = calculateTextSimilarity(dialogueTranscript, currentDialogueLine.english);
      setDialogueMatch(Math.round(sim * 100));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialogueListening]);

  const advanceDialogueLine = () => {
    if (!selectedScenario) return;
    const hintsUsed = revealedHints.size;
    const currentResult = isMyTurn && dialogueMatch !== null
      ? { score: getHintAdjustedScore(dialogueMatch, hintsUsed), hintsUsed }
      : null;
    const results = currentResult ? { ...dialogueLineResults, [lineIndex]: currentResult } : dialogueLineResults;
    if (currentResult) setDialogueLineResults(results);
    setDialogueMatch(null);
    setDialogueTranscript('');
    setRevealedHints(new Set());
    setHintLimitMessage('');
    if (lineIndex >= selectedScenario.lines.length - 1) {
      const userTurnResults = selectedScenario.lines
        .map((line, index) => line.speaker === selectedRole ? results[index] : null)
        .filter(Boolean) as Array<{ score: number; hintsUsed: number }>;
      const score = userTurnResults.length
        ? Math.round(userTurnResults.reduce((total, result) => total + result.score, 0) / userTurnResults.length)
        : 0;
      const passed = userTurnResults.length > 0
        && userTurnResults.every(result => result.score >= dialoguePassFloor)
        && score >= dialogueTargetScore;
      const totalHints = userTurnResults.reduce((total, result) => total + result.hintsUsed, 0);
      setDialogueSummary({ score, passed, hintsUsed: totalHints, turns: userTurnResults.length });
      void logActivity({
        type: AppView.SHADOWING,
        date: new Date().toISOString(),
        durationSeconds: Math.max(1, Math.round((Date.now() - dialogueStartedAtRef.current) / 1000)),
        score,
        accuracy: score,
        details: `Dialogue Roleplay: ${selectedScenario.title}`,
        metadata: {
          completed: passed,
          taskId: initialContext?.taskId,
          taskTitle: selectedScenario.title,
          shadowingMode: 'roleplay',
          scenarioId: selectedScenario.id,
          role: selectedRole,
          turns: userTurnResults.length,
          hintsUsed: totalHints,
          source: initialContext?.type || 'manual'
        }
      });
      setDialogueStage('complete');
    } else {
      setLineIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    return () => ttsService.cancel();
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const getMainCategory = (theme: ShadowingTheme) => {
    if (theme.mainCategory) return theme.mainCategory;
    if (theme.category === 'Idioms & Slang') return 'Idioms';
    if (theme.category === 'Slang') return 'Slang';
    return 'Daily Conversations';
  };

  const getSubCategory = (theme: ShadowingTheme) => {
    if (theme.subCategory) return theme.subCategory;
    if (theme.category === 'Islamic') return 'Islamic';
    return 'General';
  };

  // --- AUTO START LOGIC ---
  useEffect(() => {
    if (initialContext?.autoStart) {
      autoLaunch(initialContext);
    }
  }, [initialContext]);

  const autoLaunch = (ctx: ModuleContext) => {
    if (ctx.shadowingMode === 'roleplay') {
      void launchDailyDialogue(ctx);
      return;
    }
    let titleToFind = ctx.title;
    if (ctx.type === 'daily') {
      titleToFind = ctx.title.replace(/^Shadowing:\s*/i, '');
    }

    const findTask = () => {
      if (ctx.shadowingTaskId) {
        for (const theme of SHADOWING_DATA) {
          const task = theme.tasks.find(t => t.id === ctx.shadowingTaskId);
          if (task) return { theme, task };
        }
      }
      for (const theme of SHADOWING_DATA) {
        const task = theme.tasks.find(t =>
          t.title.toLowerCase().includes(titleToFind.toLowerCase()) ||
          titleToFind.toLowerCase().includes(t.title.toLowerCase())
        );
        if (task) return { theme, task };
      }
      return null;
    };

    const found = findTask();
    if (found) {
      setSelectedMainFolder(getMainCategory(found.theme) as any);
      setSelectedSubFolder(getSubCategory(found.theme) as any);
      setSelectedTheme(found.theme);
      setSelectedTask(found.task);
      setActiveLevel(5);
    } else {
      setActiveLevel(1);
    }
  };

  const toggleRecording = useCallback(async () => {
    if (!selectedTask) return;

    if (isRecording) {
      if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
        mediaRecorder.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
        const recorder = new MediaRecorder(stream, { mimeType });
        audioChunks.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };

        recorder.onstop = async () => {
          setIsAnalyzing(true);
          const audioBlob = new Blob(audioChunks.current, { type: mimeType });
          stream.getTracks().forEach(track => track.stop());

          try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64data = reader.result?.toString().split(',')[1];
              if (!base64data) throw new Error("Failed to read audio");

              // Call real AI
              const result = await analyzePronunciationAudio(selectedTask.text, base64data, mimeType);

              // Calculate Score based on actual word analysis against target text
              // The AI now returns ALL target words (correct, incorrect, or missed)
              const targetWordCount = selectedTask.text.replace(/[.,!?;:'"()]/g, '').split(/\s+/).filter(w => w.length > 0).length;
              const analysisCount = result.wordAnalysis.length;
              // Use the larger of targetWordCount and analysisCount as denominator
              // to avoid inflated scores if AI returns fewer words
              const totalWords = Math.max(targetWordCount, analysisCount);
              const correctWords = result.wordAnalysis.filter((w: any) => w.status === 'correct').length;
              const incorrectWordsList = result.wordAnalysis
                .filter((w: any) => w.status === 'incorrect' || w.status === 'missed')
                .map((w: any) => w.word);

              // Pure ratio score: correct / total target words * 100
              // No free bonus points — 0 correct = 0 score
              const score = totalWords === 0 ? 0 : Math.round((correctWords / totalWords) * 100);

              setFeedbackDetail({
                score: score,
                incorrectWords: incorrectWordsList,
                tips: result.feedback
              });
              setIsAnalyzing(false);
            };
          } catch (e) {
            console.error("Audio processing failed", e);
            setFeedbackDetail({
              score: 0,
              incorrectWords: [],
              tips: "Maaf, terjadi kesalahan saat menganalisis suara. Coba ulangi lagi."
            });
            setIsAnalyzing(false);
          }
        };

        recorder.start();
        mediaRecorder.current = recorder;
        setIsRecording(true);
        setFeedbackDetail(null);
      } catch (err) {
        console.error("Microphone access denied or error", err);
        alert("Mohon izinkan akses mikrofon untuk menggunakan fitur ini.");
      }
    }
  }, [isRecording, selectedTask]);

  // Spacebar support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && selectedTask && !feedbackDetail && !isAnalyzing) {
        e.preventDefault();
        toggleRecording();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTask, feedbackDetail, isAnalyzing, toggleRecording]);

  const playAudio = () => {
    if (!selectedTask) return;
    setIsPlaying(true);
    ttsService.speak(
      selectedTask.text,
      'en-US',
      0.9,
      1.05,
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- SEQUENTIAL MISSION MODE ---
  const isMissionMode = !!(initialContext?.shadowingSentenceIds && initialContext.shadowingSentenceIds.length > 0);

  if (isMissionMode) {
    const sentenceIds = initialContext!.shadowingSentenceIds!;
    const minScore = initialContext?.minScore || 80;
    const xpReward = initialContext?.xpReward || 15;

    const allTasksFlat = SHADOWING_DATA.flatMap(theme => theme.tasks);
    const missionSentences = sentenceIds.map(id => allTasksFlat.find(t => t.id === id)).filter(Boolean) as ShadowingTask[];
    const totalSentences = missionSentences.length;

    const [passedSentences, setPassedSentences] = useState<Set<string>>(new Set());
    const [passedScores, setPassedScores] = useState<Record<string, number>>({});
    const [missionIndex, setMissionIndex] = useState(0);
    const [missionComplete, setMissionComplete] = useState(false);

    const currentSentence = missionSentences[missionIndex];
    const allPassed = passedSentences.size >= totalSentences;
    const progress = (passedSentences.size / totalSentences) * 100;

    const handleMissionFeedback = () => {
      if (feedbackDetail && currentSentence && feedbackDetail.score >= minScore) {
        setPassedSentences(prev => new Set(prev).add(currentSentence.id));
        setPassedScores(prev => ({ ...prev, [currentSentence.id]: Math.max(prev[currentSentence.id] || 0, feedbackDetail.score) }));
      }
    };

    useEffect(() => {
      handleMissionFeedback();
    }, [feedbackDetail]);

    useEffect(() => {
      if (passedSentences.size >= totalSentences && totalSentences > 0) {
        setMissionComplete(true);
      }
    }, [passedSentences, totalSentences]);

    const goToNextSentence = () => {
      if (missionIndex < totalSentences - 1) {
        setMissionIndex(prev => prev + 1);
        setFeedbackDetail(null);
        setRecordingTime(0);
      }
    };

    const goToPrevSentence = () => {
      if (missionIndex > 0) {
        setMissionIndex(prev => prev - 1);
        setFeedbackDetail(null);
        setRecordingTime(0);
      }
    };

    useEffect(() => {
      if (currentSentence) {
        setSelectedTask(currentSentence);
      }
    }, [missionIndex, currentSentence]);

    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate?.(AppView.HOME)} className="text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] tracking-widest">
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            Shadowing Mission
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{initialContext?.title}</span>
            <span className="text-[10px] font-black text-amber-600">{passedSentences.size} / {totalSentences} passed</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className={`h-full rounded-full ${missionComplete ? 'bg-green-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            {missionSentences.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setMissionIndex(i); setFeedbackDetail(null); setRecordingTime(0); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === missionIndex ? 'bg-amber-500 scale-125 shadow-md shadow-amber-300' :
                    passedSentences.has(s.id) ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {missionComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center mx-auto">
                <i className="fas fa-check-circle text-4xl text-green-500"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-1">Shadowing Complete!</h2>
                <p className="text-sm text-gray-500">All {totalSentences} sentences passed with ≥{minScore}% score</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const taskScores = missionSentences.map(sentence => ({ id: sentence.id, score: passedScores[sentence.id] || minScore }));
                  const finalScore = Math.round(taskScores.reduce((total, item) => total + item.score, 0) / taskScores.length);
                  void logActivity({
                    type: AppView.SHADOWING,
                    date: new Date().toISOString(),
                    durationSeconds: Math.max(15, recordingTime * Math.max(1, totalSentences)),
                    score: finalScore,
                    accuracy: finalScore,
                    details: initialContext?.title || 'Shadowing Mission',
                    metadata: {
                      completed: true,
                      taskScores,
                      planTaskId: initialContext?.taskId,
                      assignmentId: initialContext?.assignmentId,
                      stepId: initialContext?.stepId,
                      shadowingMode: initialContext?.shadowingMode || 'daily',
                      source: initialContext?.type || 'daily'
                    }
                  });
                  setCompletedTasksData(previous => taskScores.reduce((next, item) => ({ ...next, [item.id]: Math.max(next[item.id] || 0, item.score) }), previous));
                  if (initialContext?.stepId) completeRoadmapUnit(initialContext.stepId);
                  onComplete?.();
                }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl"
              >
                <i className="fas fa-gift mr-2"></i> Claim Rewards +{xpReward} XP
              </motion.button>
            </motion.div>
          ) : currentSentence ? (
            <motion.div
              key={currentSentence.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full">{currentSentence.difficulty}</span>
                    {passedSentences.has(currentSentence.id) && (
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-green-400/30 px-3 py-1 rounded-full">✓ Passed</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{currentSentence.title}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Min Score: {minScore}%</p>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Listen & Repeat</span>
                    <button onClick={playAudio} className="w-8 h-8 rounded-full bg-lovelya-100 text-lovelya-600 flex items-center justify-center hover:bg-lovelya-200 transition">
                      <i className={`fas ${isPlaying ? 'fa-volume-up animate-pulse' : 'fa-play'}`}></i>
                    </button>
                  </div>
                  <p className="text-lg md:text-xl font-black text-gray-800 dark:text-gray-100 leading-relaxed mb-4">
                    {currentSentence.text.split(' ').map((word, i) => {
                      const cleanWord = word.replace(/[.,!?;]/g, '');
                      const isIncorrect = feedbackDetail?.incorrectWords.includes(cleanWord);
                      return (
                        <span key={i} className={isIncorrect ? 'text-rose-500 underline decoration-rose-300 underline-offset-4 decoration-2' : ''}>
                          {word}{' '}
                        </span>
                      );
                    })}
                  </p>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentSentence.translation}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 mt-6">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-lovelya-200 border-t-lovelya-500 rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Analyzing...</span>
                    </div>
                  ) : !feedbackDetail ? (
                    <button
                      onClick={toggleRecording}
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl text-white shadow-xl transition-all ${isRecording ? 'bg-rose-500 animate-pulse scale-110 shadow-rose-500/50' : 'bg-gradient-to-br from-gray-800 to-gray-900 hover:scale-105'
                        }`}
                    >
                      <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone-alt'}`}></i>
                    </button>
                  ) : (
                    <div className="w-full text-center space-y-4">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="text-4xl font-black text-gray-800 dark:text-white">
                          <span className={feedbackDetail.score >= minScore ? 'text-green-500' : 'text-amber-500'}>{feedbackDetail.score}</span>
                          <span className="text-lg text-gray-400">/100</span>
                        </div>
                      </div>

                      {feedbackDetail.score >= minScore ? (
                        <button onClick={goToNextSentence} className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition shadow-lg">
                          Next Sentence <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                      ) : (
                        <button onClick={() => setFeedbackDetail(null)} className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition">
                          Try Again <i className="fas fa-redo ml-2"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mission Navigation (Optional manual control) */}
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <button onClick={goToPrevSentence} disabled={missionIndex === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-2"><i className="fas fa-chevron-left"></i></button>
                <span className="text-xs font-bold text-gray-500">{missionIndex + 1} of {totalSentences}</span>
                <button onClick={goToNextSentence} disabled={missionIndex === totalSentences - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-2"><i className="fas fa-chevron-right"></i></button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    );
  }

  // --- DRILL DOWN UI RENDERING ---

  const renderLevel1 = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 pt-2 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white">Choose a Category</h3>
        <p className="text-gray-500 text-xs md:text-sm">Select a main folder to explore shadowing tasks.</p>
      </div>
      <div className="flex flex-col gap-3 md:gap-4">
        {(['Daily Conversations', 'Idioms', 'Slang'] as const).map(folder => (
          <button key={folder} onClick={() => { setSelectedMainFolder(folder); setActiveLevel(2); }} className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl p-4 md:p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all hover:scale-[1.02] border border-white/60 dark:border-gray-700/50 flex items-center gap-4 md:gap-5 text-left group overflow-hidden">
            <div className={`absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-40 blur-[50px] opacity-20 rounded-full transition-opacity group-hover:opacity-40 ${folder === 'Daily Conversations' ? 'bg-blue-400' :
                folder === 'Idioms' ? 'bg-emerald-400' : 'bg-purple-400'
              }`}></div>

            <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg relative z-10 ${folder === 'Daily Conversations' ? 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-blue-500/30' :
                folder === 'Idioms' ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-emerald-500/30' :
                  'bg-gradient-to-br from-purple-400 to-fuchsia-600 text-white shadow-purple-500/30'
              }`}>
              <i className={`fas ${folder === 'Daily Conversations' ? 'fa-comments' : folder === 'Idioms' ? 'fa-quote-left' : 'fa-hashtag'}`}></i>
            </div>

            <div className="flex-1 relative z-10">
              <h4 className="font-black text-base md:text-lg text-gray-900 dark:text-white mb-0.5">{folder}</h4>
              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">
                {folder === 'Daily Conversations' ? 'Everyday Practice' : folder === 'Idioms' ? 'Native Expressions' : 'Casual Speak'}
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 group-hover:text-gray-900 dark:group-hover:text-white transition-all relative z-10">
              <i className="fas fa-chevron-right text-[10px]"></i>
            </div>
          </button>
        ))}

        <button onClick={openDialogueRoleplay} className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl p-4 md:p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all hover:scale-[1.02] border border-lovelya-200/50 dark:border-lovelya-700/30 flex items-center gap-4 md:gap-5 text-left group overflow-hidden">
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-40 blur-[50px] opacity-20 rounded-full transition-opacity group-hover:opacity-40 bg-lovelya-400"></div>

          <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg relative z-10 bg-gradient-to-br from-lovelya-400 to-rose-700 text-white shadow-lovelya-500/30">
            <i className="fas fa-masks-theater"></i>
          </div>

          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-black text-base md:text-lg text-gray-900 dark:text-white">Dialogue Roleplay</h4>
              <span className="px-2 py-0.5 rounded-full bg-lovelya-100 text-lovelya-700 dark:bg-lovelya-900/50 dark:text-lovelya-300 text-[8px] font-black uppercase tracking-widest">New</span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">Real situations, two roles</p>
          </div>

          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 group-hover:text-gray-900 dark:group-hover:text-white transition-all relative z-10">
            <i className="fas fa-chevron-right text-[10px]"></i>
          </div>
        </button>
      </div>
    </motion.div>
  );

  const renderLevel2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 pt-2 max-w-lg mx-auto">
      <div className="text-center mb-6 relative">
        <button onClick={() => { setSelectedMainFolder(null); setActiveLevel(1); }} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-lovelya-600 transition">
          <i className="fas fa-arrow-left text-xs md:text-sm"></i>
        </button>
        <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white">{selectedMainFolder}</h3>
        <p className="text-gray-500 text-xs md:text-sm">Choose a sub-category.</p>
      </div>
      <div className="flex flex-col gap-3 md:gap-4">
        {(['General', 'Islamic'] as const).map(folder => (
          <button key={folder} onClick={() => { setSelectedSubFolder(folder); setActiveLevel(3); }} className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl p-4 md:p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all hover:scale-[1.02] border border-white/60 dark:border-gray-700/50 flex items-center gap-4 md:gap-5 text-left group overflow-hidden">
            <div className={`absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-40 blur-[50px] opacity-20 rounded-full transition-opacity group-hover:opacity-40 ${folder === 'Islamic' ? 'bg-amber-400' : 'bg-blue-400'
              }`}></div>

            <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg relative z-10 ${folder === 'Islamic' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30' : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-blue-500/30'}`}>
              <i className={`fas ${folder === 'Islamic' ? 'fa-mosque' : 'fa-globe'}`}></i>
            </div>

            <div className="flex-1 relative z-10">
              <h4 className="font-black text-base md:text-lg text-gray-900 dark:text-white mb-0.5">{folder}</h4>
              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">
                {folder === 'Islamic' ? 'Faith & Deen' : 'Everyday English'}
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 group-hover:text-gray-900 dark:group-hover:text-white transition-all relative z-10">
              <i className="fas fa-chevron-right text-[10px]"></i>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderLevel3 = () => {
    const filteredThemes = SHADOWING_DATA.filter(theme => {
      const mainCat = getMainCategory(theme);
      const subCat = getSubCategory(theme);
      return mainCat === selectedMainFolder && subCat === selectedSubFolder;
    });

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 pt-2">
        <div className="text-center mb-6 relative">
          <button onClick={() => { setSelectedSubFolder(null); setActiveLevel(2); }} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-lovelya-600 transition">
            <i className="fas fa-arrow-left text-xs md:text-sm"></i>
          </button>
          <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white">{selectedSubFolder} Themes</h3>
          <p className="text-gray-500 text-xs md:text-sm">Select a theme to practice.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredThemes.map(theme => (
            <button key={theme.id} onClick={() => { setSelectedTheme(theme); setActiveLevel(4); }} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all hover:-translate-y-1 hover:scale-[1.01] border border-white/60 dark:border-gray-700/50 text-left flex flex-col items-start group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl transform translate-x-4 -translate-y-4 pointer-events-none group-hover:scale-110 transition-transform">
                <i className={`fas ${theme.icon}`}></i>
              </div>
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl mb-4 shadow-inner ${selectedSubFolder === 'Islamic' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                <i className={`fas ${theme.icon}`}></i>
              </div>
              <h4 className="font-black text-base md:text-lg text-gray-900 dark:text-white mb-1">{theme.title}</h4>
              <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 leading-relaxed">{theme.description}</p>
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderLevel4 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 pt-2">
      <div className="text-center mb-6 relative">
        <button onClick={() => { setSelectedTheme(null); setActiveLevel(3); }} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-lovelya-600 transition">
          <i className="fas fa-arrow-left text-xs md:text-sm"></i>
        </button>
        <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white truncate px-10">{selectedTheme?.title}</h3>
        <p className="text-gray-500 text-xs md:text-sm">Choose a title to begin shadowing.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-h-[60vh] overflow-y-auto p-2 pr-4 custom-scrollbar">
        {selectedTheme?.tasks.map((task, idx) => {
          const completedScore = completedTasksData[task.id];
          const isCompleted = completedScore !== undefined;
          return (
          <button key={task.id} onClick={() => { setSelectedTask(task); setFeedbackDetail(null); setActiveLevel(5); }} className={`backdrop-blur-xl p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] border text-left flex items-center gap-4 group ${isCompleted ? 'bg-green-50/90 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white/90 dark:bg-gray-800/90 border-white/60 dark:border-gray-700/50'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-inner ${isCompleted ? 'bg-green-200 text-green-700 dark:bg-green-800/50 dark:text-green-300' : selectedTheme.category === 'Islamic' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              {isCompleted ? <i className="fas fa-check" /> : idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold truncate text-sm ${isCompleted ? 'text-green-800 dark:text-green-200' : 'text-gray-900 dark:text-white'}`}>{task.title}</h4>
              <div className="flex gap-2 mt-1.5">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm ${task.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : task.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                  {task.difficulty}
                </span>
                {isCompleted && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-green-100 text-green-700">{Math.round(completedScore)}%</span>}
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 group-hover:bg-lovelya-100 group-hover:text-lovelya-600'}`}>
              <i className={`fas ${isCompleted ? 'fa-check' : 'fa-play'} text-xs ml-0.5`}></i>
            </div>
          </button>
          );
        })}
      </div>
    </motion.div>
  );

  const saveShadowingResult = (score: number, completed: boolean) => {
    if (!selectedTask) return;
    void logActivity({
      type: AppView.SHADOWING,
      date: new Date().toISOString(),
      score,
      accuracy: score,
      durationSeconds: recordingTime || 15,
      details: `Shadowing: ${selectedTask.title}`,
      metadata: {
        completed,
        taskId: selectedTask.id,
        planTaskId: initialContext?.taskId,
        assignmentId: initialContext?.assignmentId,
        stepId: initialContext?.stepId,
        taskTitle: selectedTask.title,
        shadowingMode: initialContext?.shadowingMode || 'manual',
        source: initialContext?.type || 'manual'
      }
    });
    if (completed) {
      setCompletedTasksData(previous => ({ ...previous, [selectedTask.id]: Math.max(previous[selectedTask.id] || 0, score) }));
    }
  };

  const renderLevel5 = () => {
    if (!selectedTheme || !selectedTask) return null;
    const detailStyles = getCategoryStyles(selectedTheme.category);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`relative rounded-3xl md:rounded-[3rem] shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden ${detailStyles.bg}`}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lovelya-400/5 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-lovelya-600/5 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="relative p-4 md:p-8 space-y-4 md:space-y-6">
          <div className="flex justify-between items-center bg-white/30 dark:bg-black/20 p-2 md:p-3 rounded-2xl md:rounded-3xl backdrop-blur-sm">
            <button
              onClick={() => { setSelectedTask(null); setFeedbackDetail(null); setActiveLevel(4); setIsPlaying(false); }}
              className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm text-gray-500 hover:text-lovelya-600 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all hover:bg-white flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i> Back to List
            </button>
            <div className="text-right flex flex-col items-end flex-1 min-w-0 px-2">
              <span className={`text-[7px] md:text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 md:mb-1 truncate w-full ${detailStyles.text}`}>
                {selectedTheme.title}
              </span>
              <div className="flex items-center justify-end gap-1 w-full">
                <h4 className="text-[10px] md:text-base font-black text-gray-900 dark:text-white capitalize leading-tight truncate">
                  {selectedTask.title.toLowerCase()}
                </h4>
                {selectedTask.scenario && (
                  <button
                    onClick={() => setShowScenarioModal(true)}
                    className={`shrink-0 w-6 h-6 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all bg-white dark:bg-gray-800 shadow-md ${detailStyles.btnScenario}`}
                    title="View Context"
                  >
                    <i className="fas fa-lightbulb text-[9px] md:text-sm"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-8 text-center px-1 md:px-0">
            {selectedTask.scenario && (
              <div className="md:hidden flex justify-center">
                <button
                  onClick={() => setShowScenarioModal(true)}
                  className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-bounce-slow shadow-sm ${selectedTheme.category === 'Islamic' ? 'bg-amber-100 text-amber-700' : selectedTheme.category === 'Idioms & Slang' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}
                >
                  <i className="fas fa-lightbulb"></i> Context
                </button>
              </div>
            )}
            <div className={`p-6 md:p-10 rounded-3xl md:rounded-[3rem] border backdrop-blur-xl relative group shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none transition-all ${detailStyles.bubbleBorder}`}>

              <div className="absolute inset-0 overflow-hidden rounded-[3rem] pointer-events-none opacity-20">
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-50">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <motion.div key={i} animate={{ height: ['20%', '80%', '20%'] }} transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut" }} className="w-2 md:w-4 bg-lovelya-500 rounded-full" />
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={playAudio}
                className={`absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 w-12 h-12 md:w-24 md:h-24 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-10 ${isPlaying
                  ? 'bg-gradient-to-br from-lovelya-500 to-rose-600 text-white scale-110 shadow-[0_0_40px_rgba(244,63,94,0.6)] animate-pulse'
                  : 'bg-white dark:bg-gray-800 text-lovelya-600 hover:scale-110 hover:shadow-lovelya-300/50 shadow-xl border border-gray-100 dark:border-gray-700'
                  }`}
              >
                <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-play'} text-base md:text-3xl`}></i>
              </button>

              <p className="text-sm md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white leading-relaxed mb-4 md:mb-8 selection:bg-lovelya-200 selection:text-lovelya-900">
                {selectedTask.text.split(' ').map((word, i) => {
                  const cleanWord = word.replace(/[.,!?;]/g, '');
                  const isIncorrect = feedbackDetail?.incorrectWords.includes(cleanWord);
                  return (
                    <span
                      key={i}
                      className={`transition-colors ${isIncorrect ? 'text-rose-500 underline decoration-rose-300 underline-offset-4 decoration-2 md:underline-offset-8 md:decoration-4' : ''}`}
                    >
                      {word}{' '}
                    </span>
                  );
                })}
              </p>

              <div className="space-y-2 md:space-y-6 border-t border-gray-100/50 dark:border-gray-700/30 pt-4 md:pt-8 mt-2 md:mt-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[7px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Meaning</span>
                  <p className="text-gray-800 dark:text-gray-200 font-bold text-xs md:text-lg lg:text-xl line-clamp-2 md:line-clamp-none">
                    {selectedTask.translation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls & Feedback */}
          <div className="flex flex-col items-center gap-6 md:gap-8 mt-4 md:mt-8 relative z-10 p-4">
            {isAnalyzing ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5 py-10 bg-white/50 dark:bg-black/30 w-full rounded-3xl backdrop-blur-md border border-white/40">
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-lovelya-200/30 dark:border-lovelya-900/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-lovelya-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-2 bg-gradient-to-tr from-lovelya-400 to-pink-500 rounded-full animate-pulse opacity-20 blur-md"></div>
                  <i className="fas fa-robot text-lovelya-500 text-2xl md:text-3xl animate-pulse drop-shadow-lg"></i>
                </div>
                <div className="text-center">
                  <p className="text-[12px] md:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-lovelya-600 to-pink-500 uppercase tracking-[0.2em] animate-pulse">
                    AI is Analyzing...
                  </p>
                  <p className="text-[9px] md:text-xs text-gray-500 font-bold mt-2 uppercase tracking-widest">Evaluating Pronunciation</p>
                </div>
              </motion.div>
            ) : !feedbackDetail ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  {isRecording && (
                    <div className="absolute -inset-4 bg-rose-500/20 rounded-full animate-ping blur-xl"></div>
                  )}
                  <button
                    onClick={toggleRecording}
                    className={`
                    relative z-10 w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center text-2xl md:text-4xl shadow-2xl transition-all duration-300
                    ${isRecording
                        ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white scale-110 shadow-[0_0_50px_rgba(244,63,94,0.6)]'
                        : 'bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 group-hover:scale-105 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'}
                  `}
                  >
                    <i className={`fas ${isRecording ? 'fa-stop animate-pulse' : 'fa-microphone-alt'}`}></i>
                  </button>
                </div>
                <div className="text-center">
                  <p className={`text-[10px] md:text-sm font-black uppercase tracking-[0.2em] transition-colors ${isRecording ? 'text-rose-500 animate-pulse' : 'text-gray-500 dark:text-gray-400'}`}>
                    {isRecording ? `Recording • ${formatTime(recordingTime)}` : 'Tap to Record'}
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] backdrop-blur-2xl border shadow-2xl relative overflow-hidden ${feedbackDetail.score >= (initialContext?.minScore || 80)
                    ? 'bg-gradient-to-br from-emerald-50/90 to-teal-100/90 dark:from-emerald-900/60 dark:to-teal-900/60 border-emerald-200/50 dark:border-emerald-700/50 shadow-emerald-500/20'
                    : 'bg-gradient-to-br from-amber-50/90 to-orange-100/90 dark:from-amber-900/60 dark:to-orange-900/60 border-amber-200/50 dark:border-amber-700/50 shadow-amber-500/20'
                  }`}>

                  <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-30 ${feedbackDetail.score >= (initialContext?.minScore || 80) ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}></div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 relative z-10">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-white/30 dark:text-black/30" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
                          className={`${feedbackDetail.score >= (initialContext?.minScore || 80) ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'} transition-all duration-1500 ease-out`}
                          strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * feedbackDetail.score) / 100} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl md:text-5xl font-black drop-shadow-sm ${feedbackDetail.score >= (initialContext?.minScore || 80) ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>{feedbackDetail.score}</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mt-1">Score</span>
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div className="bg-white/40 dark:bg-black/20 p-4 rounded-2xl border border-white/30 dark:border-white/5">
                        <h5 className="text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 opacity-70">AI Analysis</h5>
                        <p className="text-sm md:text-base text-gray-800 dark:text-gray-100 font-bold leading-relaxed">{feedbackDetail.tips}</p>
                      </div>

                      {feedbackDetail.incorrectWords.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center p-3 bg-rose-50/80 dark:bg-rose-900/40 rounded-xl border border-rose-100 dark:border-rose-800/50">
                          <i className="fas fa-exclamation-circle text-rose-500 text-xs"></i>
                          <span className="text-[9px] md:text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Needs Work:</span>
                          {feedbackDetail.incorrectWords.map((word, i) => (
                            <span key={i} className="px-2 py-1 bg-white/80 dark:bg-black/40 text-rose-600 dark:text-rose-400 rounded-md text-[10px] font-black shadow-sm">
                              {word}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6">
                  <button
                    onClick={() => setFeedbackDetail(null)}
                    className="flex-1 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl font-black hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all uppercase tracking-widest text-xs md:text-sm"
                  >
                    <i className="fas fa-redo-alt mr-2"></i> Try Again
                  </button>
                  {initialContext?.autoStart && feedbackDetail.score >= (initialContext?.minScore || 85) ? (
                    <button
                      onClick={() => {
                        saveShadowingResult(feedbackDetail.score, true);
                        if (initialContext?.stepId) completeRoadmapUnit(initialContext.stepId);
                        onComplete?.();
                      }}
                      className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all uppercase tracking-widest text-xs md:text-sm"
                    >
                      <i className="fas fa-check-circle mr-2"></i> {completeButtonLabel}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (feedbackDetail) {
                          const targetMinScore = initialContext?.minScore || 85;

                          saveShadowingResult(feedbackDetail.score, feedbackDetail.score >= targetMinScore);

                          if (initialContext?.stepId && feedbackDetail.score >= targetMinScore) {
                            completeRoadmapUnit(initialContext.stepId);
                          }

                          // NOTE: Do NOT call onComplete() here. The task should only be marked
                          // complete from a dedicated button, not automatically in the Continue handler.
                          if (initialContext?.autoStart && feedbackDetail.score < targetMinScore) {
                            alert(`Goal not met: You need at least ${targetMinScore}% score to complete this mission. Please try practicing the shadowing again!`);
                            setFeedbackDetail(null);
                            return;
                          }
                        }

                        // Move back to next task if possible, otherwise back to list
                        const idx = selectedTheme.tasks.findIndex(t => t.id === selectedTask.id);
                        if (idx < selectedTheme.tasks.length - 1) {
                          setSelectedTask(selectedTheme.tasks[idx + 1]);
                          setFeedbackDetail(null);
                        } else {
                          setSelectedTask(null);
                          setFeedbackDetail(null);
                          setActiveLevel(4);
                        }
                      }}
                      className="flex-1 py-4 bg-gradient-to-r from-lovelya-500 to-rose-500 text-white rounded-2xl font-black shadow-xl shadow-lovelya-300/50 hover:shadow-2xl hover:scale-[1.02] transition-all uppercase tracking-widest text-xs md:text-sm"
                    >
                      Continue <i className="fas fa-chevron-right ml-2"></i>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // --- DIALOGUE ROLEPLAY RENDERING ---

  const renderDialogueCategories = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 pt-2 max-w-lg mx-auto">
      <div className="text-center mb-6 relative">
        <button onClick={exitDialogueRoleplay} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-lovelya-600 transition">
          <i className="fas fa-arrow-left text-xs md:text-sm"></i>
        </button>
        <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white">Dialogue Roleplay</h3>
        <p className="text-gray-500 text-xs md:text-sm">Choose a category of real situations.</p>
      </div>
      {dialogueLoading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-lovelya-200 border-t-lovelya-500 rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dialogueCategories.map(cat => {
            const count = dialogueScenarios.filter(s => s.category === cat).length;
            return (
              <button key={cat} onClick={() => { setSelectedDialogueCategory(cat); setDialogueStage('scenarios'); }} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-4 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] border border-white/60 dark:border-gray-700/50 text-left flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{cat}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{count} situations</p>
                </div>
                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  const renderDialogueScenarios = () => {
    const filtered = dialogueScenarios.filter(s => s.category === selectedDialogueCategory);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 pt-2 max-w-lg mx-auto">
        <div className="text-center mb-6 relative">
          <button onClick={() => setDialogueStage('categories')} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-lovelya-600 transition">
            <i className="fas fa-arrow-left text-xs md:text-sm"></i>
          </button>
          <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white truncate px-10">{selectedDialogueCategory}</h3>
          <p className="text-gray-500 text-xs md:text-sm">Select a situation to begin.</p>
        </div>
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto p-1 custom-scrollbar">
          {filtered.map(scenario => {
            const completedScore = completedDialogueScores[scenario.id];
            const isCompleted = completedScore !== undefined;
            return (
            <button key={scenario.id} onClick={() => { setSelectedScenario(scenario); setDialogueStage('role'); }} className={`${isCompleted ? 'bg-green-50/90 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white/90 dark:bg-gray-800/90 border-white/60 dark:border-gray-700/50'} backdrop-blur-xl p-4 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] border text-left flex items-center gap-3 relative overflow-hidden`}>
              {isCompleted && <span className="absolute top-0 right-0 bg-green-500 text-white text-[8px] font-black px-2 py-1 rounded-bl-lg">{Math.round(completedScore)}%</span>}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300' : 'bg-lovelya-100 dark:bg-lovelya-900/40 text-lovelya-600 dark:text-lovelya-300'}`}>
                <i className={`fas ${isCompleted ? 'fa-check' : 'fa-comments'} text-sm`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{scenario.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{scenario.roleA} &amp; {scenario.roleB} · {scenario.lines.length} lines</p>
              </div>
              <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
            </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderDialogueRoleSelect = () => {
    if (!selectedScenario) return null;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 pt-2 max-w-lg mx-auto">
        <div className="text-center mb-6 relative">
          <button onClick={() => setDialogueStage('scenarios')} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-lovelya-600 transition">
            <i className="fas fa-arrow-left text-xs md:text-sm"></i>
          </button>
          <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white truncate px-10">{selectedScenario.title}</h3>
          <p className="text-gray-500 text-xs md:text-sm">Choose who you'll play.</p>
        </div>
        <div className="flex gap-3">
          {(['A', 'B'] as const).map(role => (
            <button key={role} onClick={() => { setSelectedRole(role); setLineIndex(0); setDialogueMatch(null); setDialogueLineResults({}); setDialogueSummary(null); setRevealedHints(new Set()); dialogueStartedAtRef.current = Date.now(); setDialogueStage('play'); }} className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 text-center border border-white/60 dark:border-gray-700/50 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-lg ${role === 'A' ? 'bg-gradient-to-br from-sky-400 to-blue-700' : 'bg-gradient-to-br from-lovelya-400 to-rose-700'}`}>
                <i className="fas fa-user"></i>
              </div>
              <h4 className="font-black text-sm text-gray-900 dark:text-white">{role === 'A' ? selectedScenario.roleA : selectedScenario.roleB}</h4>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Role {role}</p>
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderDialoguePlay = () => {
    if (!selectedScenario || !currentDialogueLine) return null;
    const progress = ((lineIndex) / selectedScenario.lines.length) * 100;
    const matchPassed = dialogueMatch !== null && dialogueMatch >= dialoguePassFloor;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between bg-white/90 dark:bg-gray-800/90 border border-white/60 dark:border-gray-700/50 rounded-2xl px-4 py-3">
          {isDailyRoleplay ? <span className="w-4" /> : <button onClick={() => setDialogueStage('role')} className="text-gray-400 hover:text-lovelya-600 transition"><i className="fas fa-arrow-left"></i></button>}
          <div className="text-[11px] font-black text-gray-800 dark:text-white flex items-center gap-2 truncate px-2">
            <i className="fas fa-masks-theater text-lovelya-600"></i> {selectedScenario.title}
          </div>
          <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shrink-0">
            <div className="h-full bg-lovelya-500 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto p-1 custom-scrollbar">
          {selectedScenario.lines.slice(Math.max(0, lineIndex - 3), lineIndex + 1).map((line, i, arr) => {
            const isMine = line.speaker === selectedRole;
            const isLast = i === arr.length - 1;
            return (
              <div key={i} className={`flex gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-white text-[11px] ${line.speaker === 'A' ? 'bg-gradient-to-br from-sky-400 to-blue-700' : 'bg-gradient-to-br from-lovelya-400 to-rose-700'}`}>
                  <i className="fas fa-user"></i>
                </div>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs font-bold leading-relaxed ${isLast && isMine && !matchPassed ? 'bg-lovelya-50 dark:bg-lovelya-900/20 text-gray-500 dark:text-gray-400 italic' : isMine ? 'bg-lovelya-100/70 dark:bg-lovelya-900/30 text-gray-900 dark:text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-700/60 text-gray-900 dark:text-white rounded-tl-sm'}`}>
                  {isLast && isMine && !matchPassed ? line.indonesian : line.english}
                </div>
              </div>
            );
          })}
        </div>

        {isMyTurn && !matchPassed ? (
          <div className="bg-white/90 dark:bg-gray-800/90 border-2 border-dashed border-lovelya-400 rounded-2xl p-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-lovelya-600">Terjemahkan &amp; ucapkan</span>
            <p className="text-sm font-black text-gray-900 dark:text-white my-2">"{currentDialogueLine.indonesian}"</p>
            <div className="mb-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/50">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1 mb-1.5">
                <i className="fas fa-lightbulb text-amber-400"></i> Hint{isDailyRoleplay ? ` · ${revealedHints.size}/3 kata` : ''} · ketuk kata untuk lihat Inggris-nya
              </span>
              <div className="flex flex-wrap gap-1">
                {currentDialogueLine.english.split(' ').map((word, i) => (
                  <button
                    key={i}
                    onClick={() => revealDialogueHint(i)}
                    className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold transition-all ${revealedHints.has(i)
                      ? 'bg-lovelya-100 dark:bg-lovelya-900/40 text-lovelya-700 dark:text-lovelya-300'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 blur-[4px] select-none hover:blur-[2px]'}`}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {hintLimitMessage && <p className="mt-2 text-[10px] font-bold text-amber-600">{hintLimitMessage}</p>}
            </div>
            {dialogueTranscript && (
              <p className="text-[11px] text-gray-400 font-bold mb-2">You said: "{dialogueTranscript}"</p>
            )}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => isDialogueListening ? stopDialogueListening() : startDialogueListening()}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${isDialogueListening ? 'bg-rose-500 animate-pulse scale-110' : 'bg-gradient-to-br from-lovelya-500 to-rose-600 hover:scale-105'}`}
              >
                <i className={`fas ${isDialogueListening ? 'fa-stop' : 'fa-microphone'}`}></i>
              </button>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isDialogueListening ? 'Mendengarkan... ketuk stop jika selesai' : 'Tap to record'}</span>
              {dialogueMatch !== null && !matchPassed && (
                <div className="flex flex-col items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                    <i className="fas fa-redo"></i> {dialogueMatch}% match — need {dialoguePassFloor}%
                  </span>
                  <button onClick={() => { setDialogueMatch(null); setDialogueTranscript(''); }} className="text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest">Clear &amp; retry</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {isMyTurn && matchPassed && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                <i className="fas fa-check"></i> {dialogueMatch}% match — nice!
              </span>
            )}
            <button onClick={advanceDialogueLine} className="w-full py-3 bg-gradient-to-r from-lovelya-500 to-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">
              {isMyTurn ? 'Continue' : (isDialoguePlaying ? 'Playing...' : 'Continue')} <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const renderDialogueComplete = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl border border-lovelya-200/50 dark:border-lovelya-700/30 p-8 text-center space-y-5">
      <div className="w-16 h-16 bg-lovelya-100 dark:bg-lovelya-900/30 rounded-3xl flex items-center justify-center mx-auto">
        <i className="fas fa-check-circle text-3xl text-lovelya-600"></i>
      </div>
      <div>
        <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1">Dialogue Complete!</h3>
        <p className="text-sm text-gray-500">{selectedScenario?.title}</p>
      </div>
      {dialogueSummary && (
        <div className={`rounded-2xl p-4 ${dialogueSummary.passed ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
          <div className="text-3xl font-black">{dialogueSummary.score}%</div>
          <p className="text-[10px] font-black uppercase tracking-widest mt-1">
            {dialogueSummary.passed ? 'Daily target achieved' : `Need ${dialogueTargetScore}% average`}
          </p>
          <p className="text-xs mt-2">{dialogueSummary.turns} turns · {dialogueSummary.hintsUsed} hints used</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {(isDailyRoleplay || isRoadmapRoleplay) && dialogueSummary?.passed && (
          <button onClick={() => onComplete?.()} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-xs">
            <i className="fas fa-check-circle mr-2"></i> {completeButtonLabel}
          </button>
        )}
        <button onClick={() => { setDialogueLineResults({}); setDialogueSummary(null); setLineIndex(0); setDialogueMatch(null); setRevealedHints(new Set()); dialogueStartedAtRef.current = Date.now(); setDialogueStage(isDailyRoleplay ? 'play' : 'scenarios'); }} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black uppercase tracking-widest text-xs">
          {isDailyRoleplay ? 'Try Again' : 'Try Another Situation'}
        </button>
        <button onClick={exitDialogueRoleplay} className="w-full py-3 bg-white border-2 border-gray-200 dark:border-gray-700 dark:bg-transparent text-gray-700 dark:text-gray-300 rounded-xl font-black uppercase tracking-widest text-xs">
          Back to Shadowing
        </button>
      </div>
    </motion.div>
  );

  if (dialogueStage) {
    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-3 md:px-0 mb-20 relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lovelya-100/30 rounded-full blur-[120px] dark:bg-lovelya-900/10"></div>
        </div>
        <div className="relative z-20">
          <AnimatePresence mode="wait">
            {dialogueStage === 'categories' && <motion.div key="dc">{renderDialogueCategories()}</motion.div>}
            {dialogueStage === 'scenarios' && <motion.div key="ds">{renderDialogueScenarios()}</motion.div>}
            {dialogueStage === 'role' && <motion.div key="dr">{renderDialogueRoleSelect()}</motion.div>}
            {dialogueStage === 'play' && <motion.div key="dp">{renderDialoguePlay()}</motion.div>}
            {dialogueStage === 'complete' && <motion.div key="dcp">{renderDialogueComplete()}</motion.div>}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl lg:max-w-6xl mx-auto space-y-4 md:space-y-8 lg:space-y-12 px-3 md:px-0 mb-20 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lovelya-100/30 rounded-full blur-[120px] dark:bg-lovelya-900/10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-[120px] dark:bg-amber-900/10"></div>
      </div>

      {activeLevel === 1 && (
        <button onClick={() => onNavigate?.(AppView.HOME)} className="text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 lg:gap-3 uppercase text-[10px] md:text-xs lg:text-sm tracking-widest px-2 md:px-0 mb-4">
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
      )}

      {initialContext?.autoStart && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-lovelya-600 to-amber-600 rounded-3xl p-5 md:p-6 text-white shadow-xl mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <i className="fas fa-microphone-alt text-6xl"></i>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Shadowing Mission</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i className="fas fa-bullseye text-[8px]"></i> Goal: {initialContext.minScore || 85}%
                </span>
              </div>
            </div>
            <h3 className="text-lg font-black mb-1">{initialContext.title}</h3>
            <p className="text-xs opacity-90 font-medium">{initialContext.desc}</p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 lg:gap-6 mb-4 relative z-20">
        <div>
          <h2 className="text-lg md:text-xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Shadowing Lab</h2>
          <p className="text-[9px] md:text-xs lg:text-sm text-gray-500 font-medium tracking-wide max-w-xs md:max-w-none">Listen, repeat, and master your English fluency.</p>
        </div>
      </div>

      <div className="relative z-20">
        <AnimatePresence mode="wait">
          {activeLevel === 1 && <motion.div key="l1">{renderLevel1()}</motion.div>}
          {activeLevel === 2 && <motion.div key="l2">{renderLevel2()}</motion.div>}
          {activeLevel === 3 && <motion.div key="l3">{renderLevel3()}</motion.div>}
          {activeLevel === 4 && <motion.div key="l4">{renderLevel4()}</motion.div>}
          {activeLevel === 5 && <motion.div key="l5">{renderLevel5()}</motion.div>}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showScenarioModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowScenarioModal(false)}
          >
            {(() => {
              const modalStyles = getCategoryStyles(selectedTheme!.category);
              return (
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className={`w-full max-w-md p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl border relative ${modalStyles.bg}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowScenarioModal(false)}
                    className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <i className="fas fa-times text-xs md:text-base"></i>
                  </button>

                  <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
                    <div className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-lg md:text-3xl shadow-lg ${modalStyles.iconBg}`}>
                      <i className="fas fa-lightbulb"></i>
                    </div>

                    <div className="space-y-2 md:space-y-4">
                      <h3 className="text-sm md:text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">Usage Context</h3>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-bold leading-relaxed italic px-2">
                        "{selectedTask.scenario}"
                      </p>
                    </div>

                    <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-widest ${modalStyles.textMuted}`}>
                      TIPS: Use this naturally.
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShadowingModule;
