
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleProps, AppView } from '../types';
import { getUserProfile, logActivity, getGameProgress, unlockNextLevel, getVocab } from '../services/storage';
import { generateGameData, generateVocabReviewGame } from '../services/gemini';
import { audioService } from '../services/audioService';

type GameCategory = 'visual' | 'grammar_strike' | 'odd_one_out' | 'arcade' | 'scramble' | 'knowledge' | 'interpreter' | 'read_aloud' | 'vocab_master';
type GameContext = 'islamic' | 'general';
type GameState = 'menu' | 'levels' | 'context' | 'playing' | 'result' | 'game_over';

interface GameConfig {
    id: GameCategory;
    label: string;
    icon: string;
    desc: string;
    gradient: string;
    accent: string;
}

const GAME_CATEGORIES: GameConfig[] = [
    { id: 'visual', label: 'Emoji Quest', icon: 'fa-icons', desc: 'Guess words from emojis.', gradient: 'from-violet-500 to-purple-700', accent: 'violet' },
    { id: 'grammar_strike', label: 'Grammar Strike', icon: 'fa-spell-check', desc: 'Spot and fix errors.', gradient: 'from-rose-500 to-red-700', accent: 'rose' },
    { id: 'odd_one_out', label: 'Odd One Out', icon: 'fa-shapes', desc: 'Find the intruder word.', gradient: 'from-teal-400 to-emerald-700', accent: 'teal' },
    { id: 'read_aloud', label: 'Read Aloud', icon: 'fa-microphone-lines', desc: 'Pronounce challenges.', gradient: 'from-cyan-400 to-sky-700', accent: 'cyan' },
    { id: 'scramble', label: 'Sentence Builder', icon: 'fa-layer-group', desc: 'Arrange words.', gradient: 'from-lovelya-400 to-lovelya-700', accent: 'lovelya' },
    { id: 'arcade', label: 'Speed Definer', icon: 'fa-bolt', desc: 'Guess against the clock.', gradient: 'from-amber-400 to-orange-700', accent: 'orange' },
    { id: 'interpreter', label: 'The Interpreter', icon: 'fa-language', desc: 'Translate to English.', gradient: 'from-indigo-400 to-blue-700', accent: 'indigo' },
    { id: 'knowledge', label: 'Trivia Master', icon: 'fa-graduation-cap', desc: 'Test your knowledge.', gradient: 'from-pink-400 to-rose-700', accent: 'rose' },
    { id: 'vocab_master', label: 'Vocab Master', icon: 'fa-brain', desc: 'Review saved words.', gradient: 'from-fuchsia-400 to-pink-700', accent: 'fuchsia' },
];

const MAX_LIVES = 3;
const TIME_LIMIT = 35;
const TOTAL_LEVELS = 20;
const SIMILARITY_THRESHOLD = 0.75;
// Read Aloud 3-tier thresholds (applied to CONTENT words only — short function words are bonus)
const READ_ALOUD_EXCELLENT = 0.75;  // ≥75% content words = full score
const READ_ALOUD_GOOD = 0.50;       // ≥50% content words = partial score, no life lost
// Below 50% = lose a life

// Short function words that browser speech recognition often misses
const FUNCTION_WORDS = new Set(['a', 'an', 'the', 'is', 'am', 'are', 'was', 'were', 'be', 'to', 'of', 'in', 'on', 'at', 'it', 'i', 'my', 'me', 'we', 'he', 'or', 'so', 'do', 'if', 'up', 'no', 'by', 'as']);

// Word-by-word comparison for Read Aloud — gives per-word feedback like Shadowing
// Returns analysis + separate content word ratio for 3-tier scoring
const compareWordsDetailed = (spoken: string, target: string): { word: string, status: 'correct' | 'incorrect', isFunction: boolean }[] => {
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s']/g, '').replace(/\s+/g, ' ');
    const targetWords = normalize(target).split(' ').filter(w => w.length > 0);
    const spokenWords = normalize(spoken).split(' ').filter(w => w.length > 0);

    // Create a mutable copy of spoken words for consumption tracking
    const spokenSet = spokenWords.map(w => w);

    return targetWords.map(tw => {
        const isFunc = FUNCTION_WORDS.has(tw);
        // Try exact match first
        const exactIdx = spokenSet.indexOf(tw);
        if (exactIdx !== -1) {
            spokenSet[exactIdx] = ''; // mark as used
            return { word: tw, status: 'correct' as const, isFunction: isFunc };
        }
        // Fuzzy match using Levenshtein — adaptive threshold based on word length
        const fuzzyIdx = spokenSet.findIndex(sw => {
            if (!sw) return false;
            // Very short words (1-2 chars) must be exact
            if (sw.length <= 2 && tw.length <= 2) return sw === tw;
            // For longer words, allow more tolerance
            const maxLen = Math.max(sw.length, tw.length);
            let matches = 0;
            for (let i = 0; i < Math.min(sw.length, tw.length); i++) {
                if (sw[i] === tw[i]) matches++;
            }
            // Adaptive threshold: short words need 70%, medium need 60%, long need 55%
            const threshold = tw.length <= 4 ? 0.7 : tw.length <= 7 ? 0.6 : 0.55;
            return (matches / maxLen) >= threshold;
        });
        if (fuzzyIdx !== -1) {
            spokenSet[fuzzyIdx] = '';
            return { word: tw, status: 'correct' as const, isFunction: isFunc };
        }
        return { word: tw, status: 'incorrect' as const, isFunction: isFunc };
    });
};

// Calculate content-word accuracy (ignoring short function words like a/the/is)
const getContentWordAccuracy = (analysis: { word: string, status: 'correct' | 'incorrect', isFunction: boolean }[]): number => {
    const contentWords = analysis.filter(w => !w.isFunction);
    if (contentWords.length === 0) {
        // If sentence is ALL function words, fall back to total accuracy
        const correct = analysis.filter(w => w.status === 'correct').length;
        return analysis.length > 0 ? correct / analysis.length : 0;
    }
    const correct = contentWords.filter(w => w.status === 'correct').length;
    return correct / contentWords.length;
};

// Fisher-Yates shuffle for proper uniform randomization
const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Helper for Fuzzy Matching (Levenshtein Distance)
const calculateSimilarity = (s1: string, s2: string): number => {
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ");
    const str1 = normalize(s1);
    const str2 = normalize(s2);

    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;

    const costs = new Array();
    for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (str1.charAt(i - 1) !== str2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[str2.length] = lastValue;
    }
    const distance = costs[str2.length];
    return 1.0 - distance / Math.max(str1.length, str2.length);
};

const isAnswerCorrect = (input: string, target: string, useFuzzy: boolean = false): boolean => {
    if (!input || !target) return false;
    if (useFuzzy) {
        return calculateSimilarity(input, target) >= SIMILARITY_THRESHOLD;
    }
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    return normalize(input) === normalize(target);
};

const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.continuous = false; // Fixed: Set to false to prevent Android word duplication bug
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = (e: any) => {
                let currentTranscript = '';
                for (let i = 0; i < e.results.length; i++) {
                    currentTranscript += e.results[i][0].transcript + ' ';
                }
                setTranscript(currentTranscript.trim());
            };
            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = () => setIsListening(false);
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                setTranscript(''); // Clear previous attempt
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) { console.error("Mic start error", e); }
        }
    };
    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };
    return { isListening, transcript, startListening, stopListening, setTranscript };
};

const GameModule: React.FC<ModuleProps> = ({ onComplete, onNavigate }) => {
    const [gameState, setGameState] = useState<GameState>('menu');
    const [selectedCategory, setSelectedCategory] = useState<GameCategory | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
    const [selectedContext, setSelectedContext] = useState<GameContext | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('AI is generating...');
    const [items, setItems] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const [currentRound, setCurrentRound] = useState(0);
    const [lives, setLives] = useState(MAX_LIVES);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [isCorrect, setIsCorrect] = useState(false);
    const [scrambledWords, setScrambledWords] = useState<string[]>([]);
    const [scrambleAnswer, setScrambleAnswer] = useState<string[]>([]);
    const [wordAnalysis, setWordAnalysis] = useState<{ word: string, status: 'correct' | 'incorrect', isFunction: boolean }[]>([]);

    const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();

    // Pagination for Levels
    const [currentLevelPage, setCurrentLevelPage] = useState(1);
    const levelsPerPage = 10;
    const totalLevelPages = Math.ceil(TOTAL_LEVELS / levelsPerPage);

    // --- PERSISTENCE LOGIC ---
    useEffect(() => {
        const savedState = localStorage.getItem('lovspeak_state_games');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                // We only persist navigation states, not active gameplay for safety with timers
                if (state.gameState !== 'playing') {
                    setGameState(state.gameState || 'menu');
                } else {
                    setGameState('levels'); // Fallback to levels if they were playing
                }
                setSelectedCategory(state.selectedCategory || null);
                setSelectedLevel(state.selectedLevel || 1);
                setSelectedContext(state.selectedContext || null);
                setCurrentLevelPage(state.currentLevelPage || 1);
            } catch (e) {
                console.error("Failed to load games state", e);
            }
        }
    }, []);

    useEffect(() => {
        const stateToSave = {
            gameState: gameState === 'playing' ? 'levels' : gameState, // Don't save 'playing' state
            selectedCategory, selectedLevel, selectedContext, currentLevelPage
        };
        localStorage.setItem('lovspeak_state_games', JSON.stringify(stateToSave));
    }, [gameState, selectedCategory, selectedLevel, selectedContext, currentLevelPage]);

    // Keyboard shortcut for Spacebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && ['interpreter', 'read_aloud'].includes(selectedCategory || '') && gameState === 'playing' && !feedback) {
                e.preventDefault();
                if (isListening) stopListening();
                else startListening();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedCategory, gameState, isListening, feedback]);

    useEffect(() => {
        let timer: any;
        if (gameState === 'playing' && !feedback && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (gameState === 'playing' && !feedback && timeLeft === 0) {
            // Time's up — for read_aloud, evaluate what was said so far
            if (selectedCategory === 'read_aloud' && transcript) {
                stopListening();
                const currentItem = items[currentRound];
                if (currentItem) {
                    const analysis = compareWordsDetailed(transcript, currentItem.text);
                    const contentAccuracy = getContentWordAccuracy(analysis);
                    handleReadAloudResult(contentAccuracy, analysis);
                } else {
                    handleAnswer(false, "Time's up!");
                }
            } else {
                handleAnswer(false, "Time's up!");
            }
        }
        return () => clearInterval(timer);
    }, [timeLeft, feedback, gameState]);

    useEffect(() => {
        if (['interpreter', 'read_aloud'].includes(selectedCategory || '') && transcript) {
            setUserInput(transcript);
            const currentItem = items[currentRound];
            if (!currentItem) return;

            if (selectedCategory === 'read_aloud') {
                // Live preview of word analysis while speaking
                const analysis = compareWordsDetailed(transcript, currentItem.text);
                setWordAnalysis(analysis);
                
                // Auto-submit only if they perfectly match all content words (100%).
                // This gives immediate satisfaction without the "premature evaluation" bug.
                // If they don't reach 100%, they can click check or let the timer run out to get partial scores.
                const contentAccuracy = getContentWordAccuracy(analysis);
                if (contentAccuracy >= 1.0 && !feedback) {
                    stopListening();
                    handleReadAloudResult(contentAccuracy, analysis);
                }
            } else {
                // Use fuzzy matching for interpreter with 75% threshold
                const target = currentItem.english;
                if (isAnswerCorrect(transcript, target, true)) {
                    stopListening();
                    handleAnswer(true);
                }
            }
        }
    }, [transcript]);

    useEffect(() => {
        if (selectedCategory && selectedContext && gameState === 'levels') {
            setUnlockedLevel(getGameProgress(selectedCategory, selectedContext));
        }
    }, [selectedCategory, selectedContext, gameState]);

    const startGame = async (level: number) => {
        if (!selectedCategory || !selectedContext) return;

        const contextText = selectedContext === 'islamic' ? 'halal challenges' : 'general puzzles';
        setLoadingMessage(`Curating ${contextText} for Level ${level}...`);
        setLoading(true);
        setSelectedLevel(level);


        const messages = [
            `Connecting to Gemini...`,
            `Structuring vocabulary for Level ${level}...`,
            `AI is thinking deeply...`,
            `Synthesizing ${selectedContext === 'islamic' ? 'Islamic' : 'educational'} content...`,
            `Verifying linguistic accuracy...`,
            `Finalizing your custom challenge...`
        ];
        let msgIdx = 0;
        const msgInterval = setInterval(() => {
            msgIdx = (msgIdx + 1) % messages.length;
            setLoadingMessage(messages[msgIdx]);
        }, 2500);

        try {

            let data: any[] = [];
            if (selectedCategory === 'vocab_master') {
                // Now generating random vocab appropriate for level to avoid failures
                data = await generateVocabReviewGame([], 10, level, selectedContext);
            } else {
                data = await generateGameData(selectedCategory, selectedContext, level, 10);
            }

            clearInterval(msgInterval);

            if (!data || data.length === 0) {
                throw new Error("No game data received");
            }

            setItems(data);
            setGameState('playing');
            setCurrentRound(0);
            setScore(0);
            setLives(MAX_LIVES);
            prepareRound(data, 0);
        } catch (e: any) {
            clearInterval(msgInterval);
            console.error("Game load error:", e);
            // Don't show alert for API_LIMIT_TOTAL since the global ApiLimitModal handles it
            if (e?.message !== "API_LIMIT_TOTAL") {
                alert("Gagal memuat data game. Coba lagi dalam beberapa saat.");
            }
            setGameState('levels');
        } finally {
            setLoading(false);
        }
    };

    const prepareRound = (gameItems: any[], roundIdx: number) => {
        const item = gameItems[roundIdx];
        if (!item) return;

        setTimeLeft(TIME_LIMIT);
        setFeedback(null);
        setUserInput('');
        setIsCorrect(false);
        setTranscript('');

        if (selectedCategory === 'scramble' && item.sentence) {
            const words = item.sentence.split(/\s+/);
            setScrambledWords(shuffleArray(words));
            setScrambleAnswer([]);
        }

        if (selectedCategory === 'knowledge' && item.options) {
            const targetAnswer = item.options[item.correctIndex];
            const newOptions = shuffleArray(item.options);
            item.options = newOptions;
            item.correctIndex = newOptions.indexOf(targetAnswer);
        }

        if (selectedCategory === 'odd_one_out' && item.words) {
            const targetAnswer = item.words[item.intruder_index];
            const newWords = shuffleArray(item.words);
            item.words = newWords;
            item.intruder_index = newWords.indexOf(targetAnswer);
        }

        if (selectedCategory === 'vocab_master' && item.options) {
            const targetAnswer = item.options[item.correctIndex];
            const newOptions = shuffleArray(item.options);
            item.options = newOptions;
            item.correctIndex = newOptions.indexOf(targetAnswer);
        }
    };

    const handleAnswer = (correct: boolean, errorMsg: string = 'Incorrect!') => {
        if (feedback) return;
        if (correct) {
            setScore(s => s + 10 + timeLeft);
            setFeedback('Correct!');
            setIsCorrect(true);
        } else {
            const newLives = lives - 1;
            setLives(newLives);
            setFeedback(errorMsg);
            setIsCorrect(false);
            if (newLives <= 0) {
                setTimeout(() => setGameState('game_over'), 2000);
                return;
            }
        }
        setTimeout(() => nextRound(), 1500);
    };

    // Special handler for Read Aloud with 3-tier word-by-word feedback
    // contentAccuracy = ratio of correct CONTENT words (ignoring function words like a/the/is)
    const handleReadAloudResult = (contentAccuracy: number, analysis: { word: string, status: 'correct' | 'incorrect', isFunction: boolean }[]) => {
        if (feedback) return;
        setWordAnalysis(analysis);
        const pct = Math.round(contentAccuracy * 100);

        if (contentAccuracy >= READ_ALOUD_EXCELLENT) {
            // 🟢 Excellent — full score
            setScore(s => s + 10 + timeLeft);
            setFeedback(`🎯 ${pct}% Excellent!`);
            setIsCorrect(true);
        } else if (contentAccuracy >= READ_ALOUD_GOOD) {
            // 🟡 Good enough — partial score, NO life lost
            setScore(s => s + 5);
            setFeedback(`👍 ${pct}% Good Enough`);
            setIsCorrect(true); // show green UI
        } else {
            // 🔴 Try again — lose a life
            const newLives = lives - 1;
            setLives(newLives);
            setFeedback(`${pct}% — Need ≥${Math.round(READ_ALOUD_GOOD * 100)}%`);
            setIsCorrect(false);
            if (newLives <= 0) {
                setTimeout(() => setGameState('game_over'), 3000);
                return;
            }
        }
        // Give more time for user to see word-by-word feedback
        setTimeout(() => {
            setWordAnalysis([]);
            nextRound();
        }, 3000);
    };

    const nextRound = () => {
        if (currentRound < items.length - 1) {
            const nextIdx = currentRound + 1;
            setCurrentRound(nextIdx);
            prepareRound(items, nextIdx);
        } else {
            setGameState('result');
            if (lives >= 1 && selectedCategory && selectedContext) {
                unlockNextLevel(selectedCategory, selectedContext, selectedLevel);
            }
            logActivity({
                type: AppView.GAMES,
                date: new Date().toISOString(),
                durationSeconds: (10 - lives) * 30,
                score: score,
                accuracy: Math.round((score / (items.length * 40)) * 100),
                details: `Game: ${selectedCategory} | Level ${selectedLevel} (${selectedContext})`
            });
            // Note: Do NOT auto-call onComplete() here. Games are standalone
            // and not daily tasks. The user navigates back manually.
        }
    };

    const addScrambleWord = (word: string, idx: number) => {
        const newScramble = [...scrambledWords];
        newScramble.splice(idx, 1);
        setScrambledWords(newScramble);
        const newAns = [...scrambleAnswer, word];
        setScrambleAnswer(newAns);

        if (newScramble.length === 0) {
            const final = newAns.join(' ');
            handleAnswer(isAnswerCorrect(final, items[currentRound].sentence));
        }
    };

    const undoScramble = () => {
        if (scrambleAnswer.length === 0) return;
        const last = scrambleAnswer[scrambleAnswer.length - 1];
        setScrambleAnswer(scrambleAnswer.slice(0, -1));
        setScrambledWords([...scrambledWords, last]);
    };

    const toggleMic = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const currentGameConfig = GAME_CATEGORIES.find(c => c.id === selectedCategory);

    const GameHeader = () => {
        const timerPercent = (timeLeft / TIME_LIMIT) * 100;
        return (
        <div className="flex justify-between items-center mb-4 md:mb-6 glass-panel p-3 md:p-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 md:gap-3">
                <button onClick={() => setGameState('levels')} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center"><i className="fas fa-times"></i></button>
                <div className="text-left">
                    <div className="text-[8px] md:text-[9px] text-gray-400 uppercase font-black tracking-widest leading-none">Level {selectedLevel}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                        {[...Array(items.length)].map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${i < currentRound ? 'bg-green-500' : i === currentRound ? `bg-gradient-to-r ${currentGameConfig?.gradient || 'from-lovelya-500 to-lovelya-600'} scale-125` : 'bg-gray-200 dark:bg-gray-700'}`} />
                        ))}
                    </div>
                </div>
            </div>
            <motion.div key={score} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-center px-3 md:px-4 py-1 rounded-xl bg-gradient-to-r from-lovelya-50 to-lovelya-100 dark:from-lovelya-900/30 dark:to-lovelya-900/10 border border-lovelya-100 dark:border-lovelya-800/50">
                <div className="text-[8px] md:text-[9px] text-lovelya-400 uppercase font-black tracking-widest">Score</div>
                <div className="font-black text-lg md:text-xl text-lovelya-600">{score}</div>
            </motion.div>
            <div className="flex items-center gap-3 md:gap-4">
                <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-100 dark:text-gray-700" />
                        <circle cx="20" cy="20" r="17" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${timerPercent * 1.07} 999`} className={`transition-all duration-1000 ${timeLeft <= 5 ? 'text-red-500' : timeLeft <= 10 ? 'text-amber-500' : 'text-green-500'}`} stroke="currentColor" />
                    </svg>
                    <span className={`font-black text-xs md:text-sm ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-800 dark:text-white'}`}>{timeLeft}</span>
                </div>
                <div className="flex gap-0.5 md:gap-1">
                    {[...Array(MAX_LIVES)].map((_, i) => (
                        <motion.i key={i} initial={i >= lives ? { scale: 0.5 } : {}} animate={i >= lives ? { scale: 0.5 } : { scale: 1 }} className={`fas fa-heart text-sm md:text-lg transition-all ${i < lives ? 'text-red-500 drop-shadow-sm' : 'text-gray-200 dark:text-gray-700 opacity-40'}`} />
                    ))}
                </div>
            </div>
        </div>
    )};

    return (
        <div className="max-w-4xl mx-auto min-h-[70vh] relative">
            <AnimatePresence>
            {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-white via-lovelya-50/30 to-white dark:from-gray-900 dark:via-lovelya-900/10 dark:to-gray-900 backdrop-blur-xl px-6">
                    <div className="relative">
                        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-lovelya-100 to-lovelya-200 dark:from-lovelya-900/40 dark:to-lovelya-800/20 flex items-center justify-center shadow-xl shadow-lovelya-200/30">
                            <i className="fas fa-wand-magic-sparkles text-5xl md:text-6xl text-lovelya-600 drop-shadow-lg"></i>
                        </motion.div>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute -inset-5 rounded-full border-[3px] border-t-lovelya-500 border-r-transparent border-b-lovelya-300 border-l-transparent" />
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} className="absolute -inset-10 rounded-full border-2 border-t-transparent border-r-lovelya-200 border-b-transparent border-l-lovelya-200" />
                    </div>
                    <div className="mt-10 md:mt-12 text-center space-y-3 max-w-sm">
                        <motion.h3 key={loadingMessage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">{loadingMessage}</motion.h3>
                        <p className="text-gray-400 dark:text-gray-500 font-medium text-sm italic">AI Tutor is crafting your challenge...</p>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            {gameState === 'menu' && (
                <div className="animate-fade-in py-6 md:py-10">
                    <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 mx-auto uppercase text-[10px] md:text-xs tracking-widest">
                        <i className="fas fa-arrow-left"></i> Back to Home
                    </button>
                    <div className="text-center mb-6 md:mb-10">
                        <h2 className="text-xl md:text-4xl font-black text-gray-900 dark:text-white mb-1 md:mb-2">Game Center</h2>
                        <p className="text-[10px] md:text-base text-gray-400 font-medium px-4">Challenge yourself and unlock all levels!</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 md:gap-4 px-3 md:px-4">
                        {GAME_CATEGORIES.map((cat, idx) => (
                            <motion.button
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.4 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    audioService.play('tap');
                                    setSelectedCategory(cat.id);
                                    setGameState('context');
                                }}
                                className="relative overflow-hidden rounded-2xl md:rounded-3xl text-left flex flex-col h-full group"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500`} />
                                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3.5 md:p-5 rounded-2xl md:rounded-3xl border border-gray-100/80 dark:border-gray-700/80 h-full flex flex-col shadow-card group-hover:shadow-xl transition-shadow duration-500">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white text-base md:text-xl mb-2.5 md:mb-4 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                        <i className={`fas ${cat.icon}`}></i>
                                    </div>
                                    <h3 className="text-[11px] md:text-base font-black text-gray-800 dark:text-white mb-0.5 md:mb-1 line-clamp-1">{cat.label}</h3>
                                    <p className="text-[9px] md:text-xs text-gray-400 dark:text-gray-500 leading-tight md:leading-relaxed flex-1 line-clamp-2">{cat.desc}</p>
                                    <div className={`mt-2 md:mt-3 flex items-center gap-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent`}>
                                        Play <i className="fas fa-chevron-right text-[6px]"></i>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {gameState === 'context' && selectedCategory && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-up text-center px-4">
                    <button onClick={() => setGameState('menu')} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 mx-auto uppercase text-[10px] md:text-xs tracking-widest"><i className="fas fa-arrow-left"></i> Back to Games</button>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${currentGameConfig?.gradient || 'from-lovelya-400 to-lovelya-700'} flex items-center justify-center text-white text-2xl md:text-3xl mx-auto mb-4 shadow-xl`}>
                        <i className={`fas ${currentGameConfig?.icon}`}></i>
                    </motion.div>
                    <h2 className="text-xl md:text-3xl font-black mb-1 md:mb-2 text-gray-800 dark:text-white">{currentGameConfig?.label}</h2>
                    <p className="text-[10px] md:text-sm text-gray-400 mb-8 md:mb-10 font-medium">Choose your learning track</p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-5 w-full max-w-xl">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { audioService.play('tap'); setSelectedContext('islamic'); setGameState('levels'); }}
                            className="flex-1 relative p-5 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-lovelya-500/10 via-lovelya-400/5 to-amber-300/10 group-hover:from-lovelya-500/20 group-hover:to-amber-300/20 transition-all duration-500" />
                            <div className="absolute top-3 right-3 md:top-4 md:right-4 w-16 h-16 md:w-24 md:h-24 rounded-full bg-lovelya-100/30 dark:bg-lovelya-900/10 group-hover:scale-125 transition-transform duration-700" />
                            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-5 md:p-8 rounded-2xl border border-lovelya-100/50 dark:border-lovelya-800/30 shadow-lg group-hover:shadow-xl transition-all">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-lovelya-400 to-amber-500 text-white flex items-center justify-center text-xl md:text-2xl mx-auto mb-3 md:mb-4 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300"><i className="fas fa-mosque"></i></div>
                                <span className="font-black text-sm md:text-lg text-gray-800 dark:text-white block">Islamic Track</span>
                                <p className="text-[9px] md:text-xs text-gray-400 mt-1 md:mt-2 font-medium">20 Levels · Faith-based Learning</p>
                            </div>
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { audioService.play('tap'); setSelectedContext('general'); setGameState('levels'); }}
                            className="flex-1 relative p-5 md:p-8 rounded-2xl md:rounded-3xl overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-400/5 to-cyan-300/10 group-hover:from-blue-500/20 group-hover:to-cyan-300/20 transition-all duration-500" />
                            <div className="absolute top-3 right-3 md:top-4 md:right-4 w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-100/30 dark:bg-blue-900/10 group-hover:scale-125 transition-transform duration-700" />
                            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-5 md:p-8 rounded-2xl border border-blue-100/50 dark:border-blue-800/30 shadow-lg group-hover:shadow-xl transition-all">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center text-xl md:text-2xl mx-auto mb-3 md:mb-4 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300"><i className="fas fa-globe"></i></div>
                                <span className="font-black text-sm md:text-lg text-gray-800 dark:text-white block">General Track</span>
                                <p className="text-[9px] md:text-xs text-gray-400 mt-1 md:mt-2 font-medium">20 Levels · Everyday English</p>
                            </div>
                        </motion.button>
                    </div>
                </div>
            )}

            {gameState === 'levels' && selectedCategory && selectedContext && (
                <div className="animate-fade-in py-6 md:py-10 text-center">
                    <button onClick={() => setGameState('context')} className="mb-4 md:mb-6 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 mx-auto uppercase text-[10px] md:text-xs tracking-widest"><i className="fas fa-arrow-left"></i> Back to Theme Selection</button>
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-1 md:mb-2">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${currentGameConfig?.gradient || 'from-lovelya-400 to-lovelya-700'} flex items-center justify-center text-white text-sm md:text-lg shadow-lg`}>
                            <i className={`fas ${currentGameConfig?.icon}`}></i>
                        </div>
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white">
                            {currentGameConfig?.label}
                        </h2>
                    </div>
                    <p className="text-[9px] md:text-xs text-gray-400 mb-6 md:mb-8 font-black uppercase tracking-widest">{selectedContext === 'islamic' ? '🌙' : '🌍'} {selectedContext} Track</p>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3 max-w-lg mx-auto px-4">
                        {[...Array(TOTAL_LEVELS)].slice((currentLevelPage - 1) * levelsPerPage, currentLevelPage * levelsPerPage).map((_, i) => {
                            const levelNum = ((currentLevelPage - 1) * levelsPerPage) + i + 1;
                            const isLocked = levelNum > unlockedLevel;
                            const isCompleted = levelNum < unlockedLevel;
                            const isMilestone = [5, 10, 15, 20].includes(levelNum);

                            return (
                                <motion.button
                                    key={levelNum}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    whileHover={!isLocked ? { scale: 1.12, y: -4 } : {}}
                                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                                    disabled={isLocked}
                                    onClick={() => { audioService.play('tap'); startGame(levelNum); }}
                                    className={`aspect-square relative flex flex-col items-center justify-center rounded-2xl transition-all group overflow-hidden
                                        ${isLocked ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed' :
                                        isCompleted ? `bg-gradient-to-br ${currentGameConfig?.gradient || 'from-lovelya-400 to-lovelya-700'} text-white shadow-lg` :
                                        'bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-transparent hover:shadow-xl shadow-sm'}
                                        ${isMilestone && !isLocked ? 'ring-2 ring-amber-300/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''}
                                    `}
                                >
                                    {isLocked ? (
                                        <i className="fas fa-lock text-base md:text-lg opacity-30"></i>
                                    ) : isCompleted ? (
                                        <>
                                            <span className="text-base md:text-xl font-black">{levelNum}</span>
                                            <i className="fas fa-check text-[8px] md:text-[10px] opacity-70 mt-0.5"></i>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-lg md:text-2xl font-black text-gray-800 dark:text-white group-hover:scale-110 transition-transform">{levelNum}</span>
                                            {levelNum === unlockedLevel && (
                                                <div className={`absolute inset-0 rounded-2xl border-2 border-dashed animate-pulse ${selectedContext === 'islamic' ? 'border-lovelya-400' : 'border-blue-400'}`} />
                                            )}
                                        </>
                                    )}
                                    {isMilestone && (
                                        <div className={`absolute -top-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center ${isLocked ? 'bg-gray-200 dark:bg-gray-700' : 'bg-amber-400 shadow-sm'}`}>
                                            <i className={`fas fa-star text-[6px] md:text-[7px] ${isLocked ? 'text-gray-400' : 'text-white'}`}></i>
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {totalLevelPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6 md:mt-8">
                            <button disabled={currentLevelPage === 1} onClick={() => setCurrentLevelPage(prev => prev - 1)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"><i className="fas fa-chevron-left text-sm"></i></button>
                            <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Page {currentLevelPage} of {totalLevelPages}</span>
                            <button disabled={currentLevelPage === totalLevelPages} onClick={() => setCurrentLevelPage(prev => prev + 1)} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"><i className="fas fa-chevron-right text-sm"></i></button>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'playing' && items[currentRound] && (
                <div className="min-h-[70vh] flex flex-col py-6">
                    <GameHeader />
                    <div className="flex-1 flex flex-col items-center justify-center text-center w-full px-4">
                        {feedback ? (
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4 w-full max-w-md">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: isCorrect ? [0, 10, -10, 0] : [0, -5, 5, -5, 5, 0] }} transition={{ duration: 0.5 }}
                                    className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl mx-auto flex items-center justify-center text-4xl md:text-5xl text-white shadow-xl ${isCorrect ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-rose-600'}`}>
                                    <i className={`fas ${isCorrect ? 'fa-check' : 'fa-times'}`}></i>
                                </motion.div>
                                <div className={`text-2xl md:text-3xl font-black ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>
                                {isCorrect && <div className="text-sm font-bold text-green-500">+{10 * (selectedLevel || 1)} pts</div>}

                                {/* Word-by-word feedback for Read Aloud */}
                                {selectedCategory === 'read_aloud' && wordAnalysis.length > 0 && (
                                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="p-4 md:p-5 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10">
                                        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2.5">Word Analysis</p>
                                        <div className="flex flex-wrap gap-1.5 justify-center">
                                            {wordAnalysis.map((w, i) => (
                                                <span key={i} className={`px-2.5 py-1 rounded-lg text-sm md:text-base font-black ${
                                                    w.status === 'correct'
                                                        ? w.isFunction 
                                                            ? 'bg-green-50 text-green-500 dark:bg-green-900/15 dark:text-green-500 opacity-70'
                                                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : w.isFunction
                                                            ? 'bg-gray-100 text-gray-400 dark:bg-gray-800/30 dark:text-gray-500 opacity-60'
                                                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 line-through'
                                                }`}>{w.word}{w.isFunction && <span className="text-[8px] ml-0.5 opacity-40">•</span>}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {!isCorrect && selectedCategory !== 'read_aloud' && (
                                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`p-4 md:p-5 rounded-2xl border-2 border-dashed ${isCorrect ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'border-red-200 bg-red-50/50 dark:bg-red-900/10'}`}>
                                        <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5">Correct Answer</p>
                                        <p className="text-base md:text-xl font-black text-gray-800 dark:text-white">
                                            {selectedCategory === 'visual' ? items[currentRound].answer :
                                                selectedCategory === 'knowledge' ? items[currentRound].options[items[currentRound].correctIndex] :
                                                    selectedCategory === 'grammar_strike' ? items[currentRound].correction :
                                                        selectedCategory === 'odd_one_out' ? items[currentRound].words[items[currentRound].intruder_index] :
                                                            selectedCategory === 'arcade' ? items[currentRound].word :
                                                                selectedCategory === 'scramble' ? items[currentRound].sentence :
                                                                    selectedCategory === 'interpreter' ? items[currentRound].english :
                                                                        items[currentRound].text}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="w-full max-w-2xl animate-fade-in space-y-6 md:space-y-8">
                                {selectedCategory === 'visual' && (
                                    <>
                                        <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }} 
                                            animate={{ scale: 1, opacity: 1 }} 
                                            className="flex items-center justify-center py-12 md:py-20 bg-gradient-to-br from-violet-500/10 via-purple-500/20 to-fuchsia-500/10 dark:from-violet-900/30 dark:via-purple-900/20 dark:to-fuchsia-900/30 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_8px_32px_rgba(139,92,246,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/60 dark:border-white/10 w-full relative overflow-hidden backdrop-blur-xl"
                                        >
                                            {/* Glowing Orbs */}
                                            <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-fuchsia-400/40 dark:bg-fuchsia-500/30 rounded-full blur-[60px] pointer-events-none"></div>
                                            <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-violet-500/40 dark:bg-violet-600/30 rounded-full blur-[60px] pointer-events-none"></div>
                                            
                                            {/* 3D Floating Emoji Container */}
                                            <motion.div 
                                                animate={{ y: [0, -12, 0], rotateZ: [-2, 2, -2] }} 
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                className="relative z-10 text-7xl md:text-[8rem] filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]"
                                            >
                                                {/* Text shadow creates a subtle 3D bevel effect on the emoji */}
                                                <span className="block tracking-widest">{items[currentRound].emojis}</span>
                                            </motion.div>
                                        </motion.div>
                                        <div className="inline-block px-5 py-2.5 rounded-full bg-violet-100/50 dark:bg-violet-900/30 border border-violet-200/50 dark:border-violet-800/50 backdrop-blur-md mx-auto shadow-sm">
                                            <p className="text-violet-700 dark:text-violet-300 font-bold italic text-xs md:text-sm"><i className="fas fa-lightbulb mr-2 text-amber-500 animate-pulse"></i>{items[currentRound].clue}</p>
                                        </div>
                                        <input autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnswer(isAnswerCorrect(userInput, items[currentRound].answer))} className="w-full p-4 md:p-5 text-center text-xl md:text-3xl font-black rounded-2xl border-2 border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all dark:bg-gray-900 dark:border-violet-800" placeholder="Type answer..." />
                                    </>
                                )}

                                {selectedCategory === 'knowledge' && (
                                    <>
                                        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} className="p-5 md:p-7 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 rounded-2xl md:rounded-3xl text-base md:text-xl font-bold text-gray-800 dark:text-white border border-rose-100 dark:border-rose-800/30 shadow-sm">{items[currentRound].question}</motion.div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 w-full">
                                            {items[currentRound].options.map((opt: string, idx: number) => (
                                                <motion.button key={idx} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleAnswer(idx === items[currentRound].correctIndex)} className="p-3.5 md:p-4 rounded-2xl font-bold border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-rose-400 hover:shadow-md transition-all text-xs md:text-base text-left">{opt}</motion.button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {selectedCategory === 'grammar_strike' && (
                                    <>
                                        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} className="p-5 md:p-7 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 rounded-2xl md:rounded-3xl border border-red-100 dark:border-red-800/30 shadow-sm">
                                            <p className="text-[8px] md:text-[10px] font-black uppercase text-red-400 mb-2 tracking-widest"><i className="fas fa-exclamation-triangle mr-1"></i>Find and fix the error</p>
                                            <p className="text-base md:text-xl font-bold text-gray-800 dark:text-white italic">"{items[currentRound].sentence_with_error}"</p>
                                        </motion.div>
                                        <input autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnswer(isAnswerCorrect(userInput, items[currentRound].correction))} className="w-full p-4 md:p-5 text-center text-base md:text-xl font-bold rounded-2xl border-2 border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all dark:bg-gray-900 dark:border-red-800" placeholder="Type the correct sentence..." />
                                    </>
                                )}

                                {selectedCategory === 'odd_one_out' && (
                                    <>
                                        <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg md:text-2xl font-black text-gray-800 dark:text-white"><i className="fas fa-search mr-2 text-teal-500"></i>Which one doesn't fit?</motion.h3>
                                        <div className="grid grid-cols-2 gap-2.5 md:gap-3 w-full">
                                            {items[currentRound].words.map((word: string, idx: number) => (
                                                <motion.button key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.08 }} whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }} onClick={() => handleAnswer(idx === items[currentRound].intruder_index)} className="aspect-square flex items-center justify-center p-3 md:p-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-teal-400 hover:shadow-lg text-sm md:text-lg font-black shadow-sm transition-all">{word}</motion.button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {selectedCategory === 'arcade' && (
                                    <>
                                        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} className="p-5 md:p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl md:rounded-3xl border border-amber-100 dark:border-amber-800/30 shadow-sm">
                                            <p className="text-[8px] md:text-[10px] font-black uppercase text-amber-500 mb-2 tracking-widest"><i className="fas fa-bolt mr-1"></i>Define this word</p>
                                            <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white leading-relaxed">{items[currentRound].definition}</p>
                                        </motion.div>
                                        <input autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAnswer(isAnswerCorrect(userInput, items[currentRound].word))} className="w-full p-4 md:p-5 text-center text-xl md:text-3xl font-black rounded-2xl border-2 border-amber-200 focus:border-orange-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all dark:bg-gray-900 dark:border-amber-800" placeholder="The word is..." />
                                    </>
                                )}

                                {selectedCategory === 'scramble' && (
                                    <div className="space-y-8 w-full">
                                        <div className="min-h-[100px] md:min-h-[120px] flex flex-wrap justify-center gap-2 p-5 md:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl md:rounded-3xl border-2 border-dashed border-lovelya-200 dark:border-lovelya-800/50 relative">
                                            {scrambleAnswer.map((word, idx) => (
                                                <motion.div key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-lovelya-500 to-lovelya-600 text-white px-3.5 py-2 rounded-xl font-bold shadow-md text-sm">{word}</motion.div>
                                            ))}
                                            {scrambleAnswer.length === 0 && <p className="text-gray-300 dark:text-gray-600 font-bold text-sm self-center">Tap words below to build the sentence</p>}
                                            {scrambleAnswer.length > 0 && (
                                                <button onClick={undoScramble} className="absolute -bottom-3 right-4 w-7 h-7 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition border border-gray-100 dark:border-gray-600"><i className="fas fa-undo text-[10px]"></i></button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                                            {scrambledWords.map((word, idx) => (
                                                <motion.button key={idx} whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }} onClick={() => addScrambleWord(word, idx)} className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 hover:border-lovelya-400 font-bold shadow-sm transition-all text-sm">{word}</motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedCategory === 'vocab_master' && (
                                    <>
                                        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} className="p-5 md:p-7 bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/10 dark:to-pink-900/10 rounded-2xl md:rounded-3xl border border-fuchsia-100 dark:border-fuchsia-800/30 shadow-sm">
                                            <p className="text-[9px] md:text-[10px] font-black uppercase text-fuchsia-400 mb-2 tracking-widest">
                                                {items[currentRound].type === 'synonym' ? '🔗 Find Synonym' :
                                                    items[currentRound].type === 'meaning' ? '💡 Guess the Meaning' : '🔄 Reverse Translate'}
                                            </p>
                                            <p className="text-xl md:text-3xl font-black text-gray-800 dark:text-white leading-tight">{items[currentRound].question}</p>
                                        </motion.div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3 w-full">
                                            {items[currentRound].options.map((opt: string, idx: number) => (
                                                <motion.button key={idx} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleAnswer(idx === items[currentRound].correctIndex)} className="p-4 md:p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-fuchsia-400 hover:shadow-md font-bold text-sm md:text-base transition-all text-left">{opt}</motion.button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {['interpreter', 'read_aloud'].includes(selectedCategory!) && (
                                    <>
                                        <motion.div initial={{ y: -10 }} animate={{ y: 0 }} className="p-6 md:p-10 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-2xl md:rounded-3xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm w-full">
                                            <p className="text-[9px] md:text-[10px] font-black uppercase text-indigo-400 mb-3 tracking-widest"><i className={`fas ${selectedCategory === 'interpreter' ? 'fa-language' : 'fa-volume-up'} mr-1.5`}></i>{selectedCategory === 'interpreter' ? 'Translate to English' : 'Read Clearly'}</p>
                                            <p className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white leading-tight">
                                                {selectedCategory === 'interpreter' ? items[currentRound].indonesian : items[currentRound].text}
                                            </p>
                                        </motion.div>
                                        <div className="flex flex-col items-center gap-5">
                                            <div className="relative">
                                                {isListening && <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 rounded-full bg-indigo-500/20" />}
                                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleMic}
                                                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-xl transition-all relative z-10 ${isListening ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white ring-4 ring-indigo-300/30' : 'bg-white dark:bg-gray-800 text-indigo-500 border-2 border-indigo-100 dark:border-indigo-800'}`}>
                                                    <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
                                                </motion.button>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isListening ? 'Listening... Click to Stop' : 'Click or Press Space'}</p>
                                                <div className="min-h-[40px] px-5 py-2.5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 text-base font-bold text-indigo-600 shadow-sm">{userInput || '...'}</div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {selectedCategory !== 'scramble' && (
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }} 
                                        onClick={() => {
                                            if (selectedCategory === 'read_aloud') {
                                                stopListening();
                                                const currentItem = items[currentRound];
                                                if (currentItem) {
                                                    const analysis = compareWordsDetailed(transcript, currentItem.text);
                                                    const contentAccuracy = getContentWordAccuracy(analysis);
                                                    handleReadAloudResult(contentAccuracy, analysis);
                                                }
                                            } else if (selectedCategory === 'interpreter') {
                                                stopListening();
                                                handleAnswer(isAnswerCorrect(userInput, items[currentRound].english, true));
                                            } else {
                                                handleAnswer(isAnswerCorrect(userInput, selectedCategory === 'visual' ? items[currentRound].answer : items[currentRound].word || items[currentRound].correction));
                                            }
                                        }} 
                                        className={`px-10 py-3.5 md:px-12 md:py-4 rounded-2xl bg-gradient-to-r ${currentGameConfig?.gradient || 'from-gray-800 to-gray-900'} text-white font-black shadow-xl transition-all text-sm md:text-base ${!userInput.trim() ? 'opacity-20 pointer-events-none' : ''}`}
                                    >
                                        Submit Answer
                                    </motion.button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )
            }

            {gameState === 'result' && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-bounce-in space-y-6 px-4">
                    <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }} className="text-7xl md:text-8xl">🏆</motion.div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white">Victory!</h2>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className={`bg-gradient-to-br ${currentGameConfig?.gradient || 'from-lovelya-400 to-lovelya-700'} p-6 md:p-8 rounded-3xl shadow-xl`}>
                        <p className="text-5xl md:text-7xl font-black text-white">{score}</p>
                        <p className="text-white/70 text-xs font-black uppercase tracking-widest mt-1">Total Score</p>
                    </motion.div>
                    <div className="flex gap-1.5">
                        {[...Array(3)].map((_, i) => (
                            <motion.i key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }} className={`fas fa-star text-2xl md:text-3xl ${i < Math.ceil(score / (items.length * 10 * (selectedLevel || 1)) * 3) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`} />
                        ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGameState('levels')} className="px-6 py-3 md:px-8 md:py-4 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl font-black border border-gray-100 dark:border-gray-700 shadow-sm text-sm md:text-base">Next Level</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGameState('menu')} className="px-6 py-3 md:px-8 md:py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl font-bold text-sm md:text-base">All Games</motion.button>
                    </div>
                </div>
            )}

            {gameState === 'game_over' && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-bounce-in space-y-6 px-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center text-white text-4xl md:text-5xl shadow-xl">
                        <i className="fas fa-heart-crack"></i>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white">Game Over</h2>
                    <p className="text-gray-400 font-medium text-sm">You scored <span className="font-black text-gray-800 dark:text-white">{score}</span> points. Try again!</p>
                    <div className="flex gap-3">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startGame(selectedLevel)} className={`px-8 py-3.5 md:px-10 md:py-4 bg-gradient-to-r ${currentGameConfig?.gradient || 'from-red-500 to-rose-600'} text-white rounded-2xl font-black text-sm md:text-base shadow-xl`}>Try Again</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGameState('menu')} className="px-8 py-3.5 md:px-10 md:py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 rounded-2xl font-bold text-sm md:text-base">Menu</motion.button>
                    </div>
                </div>
            )}
        </div >
    );
};
export default GameModule;
