
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GrammarLesson, ModuleProps, GrammarResult, AppView, ModuleContext, QuizQuestion } from '../types';
import { GRAMMAR_LESSONS } from '../data/grammarLessons';
import { audioService } from '../services/audioService';
import { analyzeGrammar, generateGrammarTask, generateGrammarQuiz } from '../services/gemini';
import { logActivity, completeRoadmapUnit } from '../services/storage';
import MindMapRenderer from './MindMapRenderer';

const GrammarModule: React.FC<ModuleProps> = ({ onComplete, initialContext, onNavigate }) => {
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'explanation' | 'practice' | 'mindmap' | 'quiz'>('explanation');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);
  const [grammarTask, setGrammarTask] = useState('');
  const [filterLevel, setFilterLevel] = useState<string | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Pagination for Lessons
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Quiz State
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);

  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (initialContext?.autoStart) {
      const lesson = GRAMMAR_LESSONS.find(l => 
        (initialContext.targetLessonId && l.id === initialContext.targetLessonId) ||
        (initialContext.title && (
          l.title.toLowerCase().includes(initialContext.title.toLowerCase().replace('grammar: ', '')) ||
          initialContext.title.toLowerCase().includes(l.title.toLowerCase())
        ))
      );
      
      if (lesson) {
        handleSelectLesson(lesson);
      } else if (initialContext.type === 'daily') {
        const topic = initialContext.title.replace(/^Grammar:\s*/i, '');
        const userLevel = initialContext.level || 'A1';
        setLoadingTask(true);
        setStep('custom_task');
        generateGrammarTask(topic, userLevel).then(task => {
          setGrammarTask(task);
          setLoadingTask(false);
        }).catch(() => {
          setGrammarTask(`[TASK] Berikan 3-5 kalimat tentang **${topic}**. [HINT] Fokus pada struktur kalimat yang benar.`);
          setLoadingTask(false);
        });
      }
    }
  }, [initialContext]);

  const [step, setStep] = useState<'list' | 'lesson' | 'custom_task'>('list');

  const handleSelectLesson = (lesson: GrammarLesson) => {
    audioService.play('nav');
    setSelectedLesson(lesson);
    setStep('lesson');
    setActiveTab('explanation');
    setResult(null);
    setUserInput('');
    setErrorMessage('');
    setQuizSubmitted(false);
    setQuizAnswers([]);
    setCurrentQuiz([]);
    startTimeRef.current = Date.now();

    // Auto-generate task on lesson select
    refreshTask(lesson.title, lesson.level);

    // Check if quiz already exists in data
    if (lesson.quiz && lesson.quiz.length > 0) {
      setCurrentQuiz(lesson.quiz);
    }
  };

  const refreshTask = async (title: string, level: string = 'A1') => {
    setLoadingTask(true);
    try {
      const task = await generateGrammarTask(title, level);
      setGrammarTask(task);
    } catch (e) {
      setGrammarTask(`[TASK] Buatlah 3-5 kalimat untuk berlatih ${title}. [HINT] Perhatikan polanya.`);
    } finally {
      setLoadingTask(false);
    }
  };

  const handleGenerateLessonQuiz = async () => {
    if (!selectedLesson) return;
    setQuizLoading(true);
    try {
      const contentString = selectedLesson.sections.map(s => `${s.heading}: ${s.content}`).join('\n');
      const generated = await generateGrammarQuiz(selectedLesson.title, contentString, selectedLesson.level);
      setCurrentQuiz(generated);
      setQuizAnswers(new Array(generated.length).fill(-1));
      setQuizSubmitted(false);
    } catch (e: any) {
      setErrorMessage("Failed to generate quiz. Please try again.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswers.includes(-1)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    let correct = 0;
    currentQuiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct++;
    });
    const finalScore = Math.round((correct / currentQuiz.length) * 100);
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    logActivity({
      type: AppView.GRAMMAR,
      date: new Date().toISOString(),
      durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
      score: finalScore,
      accuracy: finalScore,
      details: `Quiz: ${selectedLesson?.title}`
    });

    const targetMinScore = initialContext?.minScore || 80;
    if (initialContext?.stepId && finalScore >= targetMinScore) {
      completeRoadmapUnit(initialContext.stepId);
    }

    // NOTE: Do NOT call onComplete() here. The task should only be marked
    // complete when the user explicitly acts from the result screen.
    if (initialContext?.autoStart && finalScore < targetMinScore) {
      setErrorMessage(`Goal not met: You need at least ${targetMinScore}% score to complete this mission. Please review and try again!`);
    }
  };

  const handleCheckGrammar = async () => {
    if (!userInput.trim()) return;
    audioService.play('tap');
    setLoading(true);
    setErrorMessage('');
    try {
      const evaluation = await analyzeGrammar(userInput, grammarTask);
      setResult(evaluation);

      logActivity({
        type: AppView.GRAMMAR,
        date: new Date().toISOString(),
        durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
        score: evaluation.score,
        accuracy: evaluation.score,
        details: `Practice: ${selectedLesson?.title || 'Custom Writing'}`
      });

      const targetMinScore = initialContext?.minScore || 80;
      if (initialContext?.stepId && evaluation.score >= targetMinScore) {
        completeRoadmapUnit(initialContext.stepId);
      }

      // NOTE: Do NOT call onComplete() here. The result section already
      // has a 'Complete Daily Task' button that the user can click.
      if (initialContext?.autoStart && evaluation.score < targetMinScore) {
        setErrorMessage(`Goal not met: You need at least ${targetMinScore}% score for this mission. Check the feedback and try to improve your writing!`);
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = GRAMMAR_LESSONS.filter(l => {
    const matchesLevel = filterLevel === 'All' || l.level === filterLevel;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
    return matchesLevel && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const paginatedLessons = filteredLessons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const parseTaskContent = (text: string) => {
    let taskPart = text;
    let hintPart = "";
    if (text.includes('[TASK]') && text.includes('[HINT]')) {
      const taskMatch = text.match(/\[TASK\]([\s\S]*?)\[HINT\]/);
      const hintMatch = text.match(/\[HINT\]([\s\S]*)/);
      if (taskMatch) taskPart = taskMatch[1].trim();
      if (hintMatch) hintPart = hintMatch[1].trim();
    } else if (text.includes('[TASK]')) {
      taskPart = text.replace('[TASK]', '').trim();
    } else if (text.includes('[HINT]')) {
      const parts = text.split('[HINT]');
      taskPart = parts[0].trim();
      hintPart = parts[1].trim();
    }
    return { task: taskPart, hint: hintPart };
  };

  if (step === 'custom_task') {
    const taskData = parseTaskContent(grammarTask);
    const userLevel = initialContext?.level || 'A1';
    const topic = initialContext?.title?.replace(/^Grammar:\s*/i, '') || 'Practice';

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6 pb-20 px-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setStep('list')} className="text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] tracking-widest">
            <i className="fas fa-arrow-left"></i> Back to Lessons
          </button>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-lovelya-100 text-lovelya-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              Mission: {userLevel} Mastery
            </div>
            <div className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <i className="fas fa-bullseye"></i> Goal: {initialContext?.minScore || 80}%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
              <i className="fas fa-magic"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 dark:text-white leading-tight">{topic}</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Custom Practice Challenge</p>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border-l-4 border-purple-400 transition-all duration-500 mb-8 ${loadingTask ? 'bg-gray-100 dark:bg-gray-700 animate-pulse' : 'bg-gray-50 dark:bg-gray-900'}`}>
            <div className={`text-gray-700 dark:text-gray-300 font-bold leading-relaxed text-sm md:text-base prose-p:leading-relaxed prose-strong:text-lovelya-600 ${loadingTask ? 'opacity-30' : 'opacity-100'}`}>
              {loadingTask ? 'AI is crafting a unique prompt for you...' : <Markdown>{taskData.task || "Please describe your daily activities using simple sentences."}</Markdown>}
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type your sentences here..."
              disabled={loadingTask}
              className="w-full h-56 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-lovelya-500 outline-none transition-all text-sm md:text-base leading-relaxed disabled:opacity-50 shadow-inner"
            />
            {errorMessage && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                {errorMessage}
              </div>
            )}
            <motion.button 
              whileHover={{ scale: 1.01 }} 
              whileTap={{ scale: 0.99 }} 
              onClick={handleCheckGrammar} 
              disabled={loading || loadingTask || !userInput.trim()} 
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-base shadow-xl transition disabled:opacity-30 uppercase tracking-widest"
            >
              {loading ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing Your Work...</> : 'Submit for Review'}
            </motion.button>
          </div>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl border border-lovelya-100 space-y-8">
            <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black text-lovelya-600">{result.score}</div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Mission Score</div>
                  <div className="text-sm font-bold text-gray-600 dark:text-gray-400">{result.score >= 80 ? 'Perfect execution!' : 'Keep refining!'}</div>
                </div>
              </div>
              <i className="fas fa-award text-4xl text-yellow-400"></i>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Improved Version</h4>
              <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl text-green-800 dark:text-green-200 leading-relaxed font-medium text-sm">
                {result.correctedText}
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Key Improvements</h4>
                <div className="space-y-3">
                  {result.errors.map((err, i) => (
                    <div key={i} className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <p className="line-through text-gray-400 mb-2 text-xs">{err.mistake}</p>
                      <p className="font-bold text-gray-800 dark:text-white mb-2 text-sm">{err.correction}</p>
                      <p className="text-xs text-gray-500 italic">{err.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-lovelya-50 dark:bg-lovelya-900/20 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-lovelya-600 tracking-widest block mb-2">Tutor's Note</span>
              <p className="text-gray-700 dark:text-gray-200 font-medium text-sm leading-relaxed">{result.generalFeedback}</p>
            </div>

            {/* Complete button: only show if score meets requirement */}
            {result.score >= (initialContext?.minScore || 80) ? (
              <button 
                onClick={() => onComplete?.()}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-base shadow-xl uppercase tracking-widest"
              >
                <i className="fas fa-check-circle mr-2"></i> Complete Daily Task +{initialContext?.xpReward || 15} XP
              </button>
            ) : (
              <button 
                onClick={() => { setResult(null); setUserInput(''); }}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-black text-base shadow-xl uppercase tracking-widest"
              >
                <i className="fas fa-redo mr-2"></i> Try Again
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }

  if (step === 'lesson' && selectedLesson) {
    const taskData = parseTaskContent(grammarTask);

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-4 pb-20">
        {/* Hint Modal */}
        {showHint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowHint(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-sm overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 flex flex-col min-h-0">
                <div className="flex items-center gap-3 mb-4 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <h3 className="text-lg font-black text-gray-800 dark:text-white">Petunjuk (Hint)</h3>
                </div>
                <div className="prose dark:prose-invert text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed overflow-y-auto px-1 custom-scrollbar">
                  <Markdown>{taskData.hint || "Coba perhatikan baik-baik penjelasan materi di tahap sebelumnya, dan aplikasikan polanya!"}</Markdown>
                </div>
                <button
                  onClick={() => setShowHint(false)}
                  className="w-full mt-6 shrink-0 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-sm uppercase tracking-widest transition active:scale-95"
                >
                  Paham!
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-0 z-30">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setStep('list')} className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"><i className="fas fa-arrow-left text-xs"></i></motion.button>
          <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-xl overflow-x-auto no-scrollbar w-full sm:w-auto">
            <button onClick={() => setActiveTab('explanation')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition whitespace-nowrap ${activeTab === 'explanation' ? 'bg-white dark:bg-gray-600 text-rose-600 shadow-sm' : 'text-gray-500'}`}>Study</button>
            {selectedLesson.mindmap && <button onClick={() => setActiveTab('mindmap')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition whitespace-nowrap ${activeTab === 'mindmap' ? 'bg-white dark:bg-gray-600 text-rose-600 shadow-sm' : 'text-gray-500'}`}>Map</button>}
            <button onClick={() => setActiveTab('practice')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition whitespace-nowrap ${activeTab === 'practice' ? 'bg-white dark:bg-gray-600 text-rose-600 shadow-sm' : 'text-gray-500'}`}>Practice</button>
            <button onClick={() => setActiveTab('quiz')} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase transition whitespace-nowrap ${activeTab === 'quiz' ? 'bg-white dark:bg-gray-600 text-rose-600 shadow-sm' : 'text-gray-500'}`}>Quiz</button>
          </div>
          <div className="hidden md:block w-9"></div>
        </div>

        {activeTab === 'explanation' && (
          <div className="space-y-4 md:space-y-6 animate-slide-up">
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 p-3.5 md:p-5 rounded-2xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><i className={`fas ${selectedLesson.icon} text-3xl md:text-5xl`}></i></div>
              <span className="bg-white/20 backdrop-blur-md px-2 md:px-2.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest mb-1.5 inline-block">{selectedLesson.level} Grammar</span>
              <h1 className="text-sm md:text-lg font-black mb-0.5 leading-tight">{selectedLesson.title}</h1>
              <p className="text-lovelya-100 text-[9px] md:text-xs font-medium max-w-xl leading-relaxed">{selectedLesson.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {selectedLesson.sections.map((section, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-3.5 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                  <h2 className="text-sm md:text-lg font-black text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-rose-50 dark:bg-gray-700 text-rose-500 flex items-center justify-center text-[9px] md:text-[10px]">{idx + 1}</span>
                    {section.heading}
                  </h2>
                  
                  <div className="prose dark:prose-invert max-w-none text-[10px] md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>

                  {/* Formula & Exceptions Row */}
                  {(section.formula || section.exceptions) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.formula && (
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-3 rounded-xl">
                          <div className="flex items-center gap-2 mb-1.5">
                            <i className="fas fa-magic text-blue-500 text-[10px]"></i>
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Formula</span>
                          </div>
                          <p className="text-[10px] md:text-xs font-black text-blue-800 dark:text-blue-200 font-mono bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-blue-100/50 dark:border-blue-700/30">
                            {section.formula}
                          </p>
                        </div>
                      )}
                      {section.exceptions && (
                        <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-3 rounded-xl">
                          <div className="flex items-center gap-2 mb-1.5">
                            <i className="fas fa-exclamation-triangle text-amber-500 text-[10px]"></i>
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Exceptions</span>
                          </div>
                          <p className="text-[9px] md:text-xs font-medium text-amber-800 dark:text-amber-200 leading-relaxed italic">
                            {section.exceptions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {section.examples.map((ex, i) => (
                      <div key={i} className={`p-2.5 md:p-3 rounded-xl border flex gap-3 ${ex.isCorrect ? 'bg-green-50/50 border-green-100 dark:bg-green-900/5 dark:border-green-900/20' : 'bg-red-50/50 border-red-100 dark:bg-red-900/5 dark:border-red-900/20'}`}>
                        <div className={`w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center shrink-0 ${ex.isCorrect ? 'bg-green-500 text-white shadow-sm shadow-green-200' : 'bg-red-500 text-white shadow-sm shadow-red-200'}`}>
                          <i className={`fas ${ex.isCorrect ? 'fa-check' : 'fa-times'} text-[9px] md:text-xs`}></i>
                        </div>
                        <div className="space-y-1">
                          <p className={`text-[10px] md:text-sm font-bold leading-tight ${ex.isCorrect ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                            {ex.text}
                          </p>
                          {ex.translation && (
                            <p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 font-medium italic border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                              {ex.translation}
                            </p>
                          )}
                          {ex.note && (
                            <p className="text-[8px] md:text-[10px] opacity-60 font-medium text-gray-500 dark:text-gray-400">
                              <i className="fas fa-info-circle mr-1"></i> {ex.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 px-2 md:px-0">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab('practice')} className="flex-1 py-3 md:py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black text-[10px] md:text-sm shadow-lg transition uppercase tracking-widest">Practice</motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab('quiz')} className="flex-1 py-3 md:py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-black text-[10px] md:text-sm shadow-lg transition uppercase tracking-widest">Final Quiz</motion.button>
            </div>
          </div>
        )}

        {activeTab === 'mindmap' && selectedLesson.mindmap && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 min-h-[600px] animate-fade-in overflow-hidden relative"><MindMapRenderer data={selectedLesson.mindmap} /></div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6 animate-slide-up max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-5 md:p-7 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <i className="fas fa-pen-nib"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white">Writing Challenge</h3>
                    {taskData.hint && (
                      <button
                        onClick={() => setShowHint(true)}
                        className="text-[10px] font-black text-rose-600 flex items-center gap-1 uppercase tracking-widest hover:underline mt-0.5"
                      >
                        <i className="fas fa-lightbulb"></i> Need a Hint?
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => refreshTask(selectedLesson.title, selectedLesson.level)}
                  disabled={loadingTask}
                  className="p-2.5 rounded-xl bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 hover:bg-lovelya-100 transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                >
                  <i className={`fas fa-magic ${loadingTask ? 'fa-spin' : ''}`}></i>
                  {loadingTask ? 'Regenerating...' : 'Regenerate Task'}
                </button>
              </div>

              <div className={`p-6 rounded-2xl border-l-4 border-purple-400 transition-all duration-500 ${loadingTask ? 'bg-gray-100 dark:bg-gray-700 animate-pulse' : 'bg-gray-50 dark:bg-gray-900'}`}>
                <div className={`text-gray-700 dark:text-gray-300 font-bold leading-relaxed text-[10px] md:text-sm prose-p:leading-relaxed prose-strong:text-lovelya-600 ${loadingTask ? 'opacity-30' : 'opacity-100'}`}>
                  {loadingTask ? 'AI is crafting a unique prompt for this lesson...' : <Markdown>{taskData.task || "Failed to generate task. Please click regenerate."}</Markdown>}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <textarea
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder="Start writing here..."
                  disabled={loadingTask}
                  className="w-full h-48 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-lovelya-500 outline-none transition-all text-sm md:text-base leading-relaxed disabled:opacity-50"
                />
                {errorMessage && errorMessage !== 'API_LIMIT_TOTAL' && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                    {errorMessage}
                  </div>
                )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheckGrammar} disabled={loading || loadingTask || !userInput.trim()} className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-black text-sm shadow-xl transition disabled:opacity-30">{loading ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing...</> : 'Check Grammar'}</motion.button>
              </div>
            </div>
            {result && (
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl border border-lovelya-100 animate-bounce-in space-y-8">
                <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-gray-700"><div className="flex items-center gap-4"><div className="text-5xl font-black text-lovelya-600">{result.score}</div><div><div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Quality Score</div><div className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-400">{result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good Progress' : 'Keep Practicing'}</div></div></div><i className="fas fa-award text-4xl text-yellow-400"></i></div>
                <div className="space-y-4"><h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Corrected Text</h4><div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-2xl text-green-800 dark:text-green-200 leading-relaxed font-medium text-[10px] md:text-sm">{result.correctedText}</div></div>
                {result.errors.length > 0 && (<div className="space-y-4"><h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Error Analysis</h4><div className="space-y-3">{result.errors.map((err, i) => (<div key={i} className="p-5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700"><div className="flex items-center gap-2 text-red-500 mb-1"><i className="fas fa-times-circle text-xs"></i><span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">Mistake</span></div><p className="line-through text-gray-400 mb-3 text-[10px] md:text-sm">{err.mistake}</p><div className="flex items-center gap-2 text-green-500 mb-1"><i className="fas fa-check-circle text-xs"></i><span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider">Correction</span></div><p className="font-bold text-gray-800 dark:text-white mb-3 text-[10px] md:text-sm">{err.correction}</p><p className="text-[10px] md:text-sm text-gray-500 italic">{err.explanation}</p></div>))}</div></div>)}
                <div className="p-6 bg-lovelya-50 dark:bg-lovelya-900/20 rounded-2xl"><span className="text-[10px] font-black uppercase text-lovelya-600 tracking-widest block mb-2">Teacher Feedback</span><p className="text-gray-700 dark:text-gray-200 font-medium text-[10px] md:text-sm">{result.generalFeedback}</p></div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-8 animate-slide-up max-w-3xl mx-auto pb-20">
            {currentQuiz.length === 0 && !quizLoading ? (
              <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center space-y-5">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl text-white mx-auto shadow-lg">
                  <i className="fas fa-clipboard-question"></i>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-gray-800 dark:text-white">Ready for a Quiz?</h3>
                  <p className="text-gray-400 dark:text-gray-400 mt-1 text-xs">10 AI-generated questions based on this lesson.</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleGenerateLessonQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-black text-sm shadow-xl transition">
                  <i className="fas fa-magic mr-2"></i> Generate Quiz
                </motion.button>
              </div>
            ) : quizLoading ? (
              <div className="py-16 text-center flex flex-col items-center gap-3">
                <div className="flex gap-1.5">{[0,1,2].map(i => <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />)}</div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">AI is crafting your quiz...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Quiz Results Summary */}
                {quizSubmitted && (
                  <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl border border-lovelya-100 dark:border-gray-700 animate-bounce-in text-center space-y-4">
                    <div className="flex justify-center gap-2">
                      {[...Array(3)].map((_, i) => (
                        <i key={i} className={`fas fa-star text-3xl ${i < Math.round(quizScore / 33) ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                      ))}
                    </div>
                    <h2 className="text-5xl font-black text-lovelya-600">{quizScore}%</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest">Quiz Completed!</p>
                    <button
                      onClick={handleGenerateLessonQuiz}
                      className="text-xs font-bold text-lovelya-500 hover:underline"
                    >
                      <i className="fas fa-rotate mr-1"></i> Try different questions
                    </button>
                    {/* Complete Task button for daily missions */}
                    {initialContext?.autoStart && quizScore >= (initialContext?.minScore || 80) && (
                      <button
                        onClick={() => onComplete?.()}
                        className="w-full mt-3 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-black text-sm shadow-lg uppercase tracking-widest"
                      >
                        <i className="fas fa-check-circle mr-2"></i> Complete Daily Task +{initialContext?.xpReward || 15} XP
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-6">
                  {currentQuiz.map((q, qIdx) => (
                    <div key={qIdx} className={`bg-white dark:bg-gray-800 p-5 md:p-7 rounded-3xl shadow-sm border ${quizSubmitted && quizAnswers[qIdx] !== q.correctIndex ? 'border-red-200' : 'border-gray-100 dark:border-gray-700'}`}>
                      <div className="flex items-start gap-4 mb-6">
                        <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-black text-sm shrink-0">{qIdx + 1}</span>
                        <p className="text-sm md:text-base font-bold text-gray-800 dark:text-white leading-tight text-[12px] md:text-[16px]">{q.question}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 ml-0 md:ml-12">
                        {q.options.map((opt, oIdx) => {
                          let btnClass = "p-4 rounded-xl text-left transition-all border-2 flex items-center justify-between group ";
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          const isCorrect = oIdx === q.correctIndex;

                          if (!quizSubmitted) {
                            btnClass += isSelected
                              ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 font-bold"
                              : "border-gray-100 dark:border-gray-700 hover:border-rose-200 dark:hover:border-gray-600";
                          } else {
                            if (isCorrect) btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 font-bold";
                            else if (isSelected) btnClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 font-bold";
                            else btnClass += "border-gray-100 dark:border-gray-700 opacity-50";
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => {
                                const newAns = [...quizAnswers];
                                newAns[qIdx] = oIdx;
                                setQuizAnswers(newAns);
                              }}
                              className={btnClass}
                            >
                              <span className="text-[10px] md:text-sm">{opt}</span>
                              {quizSubmitted && isCorrect && <i className="fas fa-check-circle text-green-500"></i>}
                              {quizSubmitted && isSelected && !isCorrect && <i className="fas fa-times-circle text-red-500"></i>}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="mt-6 ml-12 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-l-4 border-lovelya-400">
                          <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                            <i className="fas fa-info-circle mr-2 text-lovelya-500"></i>
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!quizSubmitted && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleQuizSubmit}
                    disabled={quizAnswers.includes(-1)}
                    className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-black text-base shadow-xl transition disabled:opacity-20"
                  >
                    Submit Quiz
                  </motion.button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-4 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[9px] md:text-[10px] tracking-widest">
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <div className="text-center">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-2 text-white text-lg md:text-xl shadow-lg">
            <i className="fas fa-book-open"></i>
          </div>
          <h2 className="text-sm md:text-lg font-black text-gray-800 dark:text-white mb-0.5 tracking-tight">Grammar Academy</h2>
          <p className="text-[8px] md:text-[10px] text-gray-400 font-bold mb-3 uppercase tracking-widest">Master English structures with ease</p>

          {/* Search Bar */}
          <div className="relative mb-3 mx-auto max-w-sm">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
            <input
              id="grammar-search"
              type="text"
              placeholder="Cari materi grammar..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-9 py-2 md:py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 transition-all text-xs md:text-sm shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            )}
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md p-0.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-0.5 overflow-x-auto no-scrollbar justify-center">
            {['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => (
              <motion.button key={lvl} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFilterLevel(lvl); setCurrentPage(1); }} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black transition-all whitespace-nowrap ${filterLevel === lvl ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{lvl}</motion.button>
            ))}
          </div>

          {searchQuery && (
            <p className="text-[9px] text-gray-400 mt-2 font-medium">
              {filteredLessons.length > 0
                ? `${filteredLessons.length} pelajaran ditemukan untuk "${searchQuery}"`
                : `Tidak ada hasil untuk "${searchQuery}"`
              }
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3 px-4">
        {paginatedLessons.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <i className="fas fa-search-minus text-3xl mb-3 block opacity-40"></i>
            <p className="text-sm font-bold">Tidak ada pelajaran ditemukan</p>
            <p className="text-xs mt-1">Coba kata kunci atau filter level lain</p>
          </div>
        )}
        {paginatedLessons.map((lesson, idx) => (
          <motion.button key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => handleSelectLesson(lesson)} className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-rose-300 hover:shadow-lg transition-all text-left flex flex-col h-full group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-500 flex items-center justify-center text-sm md:text-base mb-3 group-hover:scale-110 transition-transform"><i className={`fas ${lesson.icon}`}></i></div>
            <span className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">{lesson.level}</span>
            <h3 className="text-[11px] md:text-sm font-black text-gray-800 dark:text-white mb-1.5 leading-tight group-hover:text-rose-600 transition-colors line-clamp-2">{lesson.title}</h3>
            <p className="text-[9px] md:text-xs text-gray-400 leading-relaxed mb-3 flex-1 line-clamp-2">{lesson.description}</p>
            <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-rose-500 group-hover:text-rose-600">Study Now <i className="fas fa-arrow-right"></i></div>
          </motion.button>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-rose-500 transition"><i className="fas fa-chevron-left text-xs"></i></motion.button>
          <span className="text-[10px] font-black text-gray-400">{currentPage} / {totalPages}</span>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-rose-500 transition"><i className="fas fa-chevron-right text-xs"></i></motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default GrammarModule;
