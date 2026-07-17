import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VocabItem, ModuleProps, AppView } from '../types';
import {
  getVocab, saveVocab, updateVocab, deleteVocab,
  getFavorites, toggleFavorite,
  getCustomCategories, saveCustomCategory, CustomCategory,
  getVocabEnrichment, saveVocabEnrichment
} from '../services/storage';
import { audioService } from '../services/audioService';
import { VOCAB_CATEGORIES } from '../constants';
import { STATIC_VOCAB, STATIC_VOCAB_DETAILS } from '../data/vocabData';
import { generateVocabDetails } from '../services/gemini';
import { ttsService } from '../services/ttsService';

const DEFAULT_ICONS: Record<string, string> = {
  'Adab & Akhlak': 'fa-hand-holding-heart',
  'Islamic Terms': 'fa-star-and-crescent',
  'Family & Relationships': 'fa-users',
  'Home & Daily Routine': 'fa-home',
  'School & Education': 'fa-graduation-cap',
  'Work & Career': 'fa-briefcase',
  'Food & Dining': 'fa-utensils',
  'Travel & Transportation': 'fa-plane',
  'Health & Body': 'fa-heartbeat',
  'Emotions & Feelings': 'fa-smile',
  'Nature & Environment': 'fa-leaf',
  'Weather & Climate': 'fa-cloud-sun',
  'Clothing & Fashion': 'fa-tshirt',
  'Shopping & Money': 'fa-shopping-bag',
  'Hobbies & Leisure': 'fa-puzzle-piece',
  'Sports & Fitness': 'fa-running',
  'Technology & Media': 'fa-laptop',
  'Time & Numbers': 'fa-clock',
  'Places & Buildings': 'fa-building',
  'Animals & Pets': 'fa-paw',
  'Idioms & Slang': 'fa-comment-dots',
  'User Added': 'fa-pen-fancy'
};

const ICON_OPTIONS = [
  'fa-star', 'fa-heart', 'fa-lightbulb', 'fa-book', 'fa-comment',
  'fa-gem', 'fa-crown', 'fa-puzzle-piece', 'fa-gamepad', 'fa-car',
  'fa-bicycle', 'fa-coffee', 'fa-pizza-slice', 'fa-tree', 'fa-moon',
  'fa-sun', 'fa-cloud', 'fa-umbrella', 'fa-bolt', 'fa-snowflake'
];

const VocabularyModule: React.FC<ModuleProps> = ({ onComplete, onNavigate, initialContext }) => {
  const [userItems, setUserItems] = useState<VocabItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

  // Task Tracking State
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const missionGoal = 5;
  const isMissionActive = !!initialContext;

  // Flashcard Mission Mode (when vocabWordIds are provided)
  const isFlashcardMode = !!(initialContext?.vocabWordIds && initialContext.vocabWordIds.length > 0);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardCompleted, setFlashcardCompleted] = useState(false);

  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<VocabItem | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<VocabItem | null>(null);

  const [newWord, setNewWord] = useState('');
  const [newTrans, setNewTrans] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newSynonyms, setNewSynonyms] = useState<string[]>([]);
  const [newExamples, setNewExamples] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-star');

  // Pagination for Word List
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    const savedState = localStorage.getItem('lovspeak_state_vocab');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setFilter(state.filter || '');
        // Only restore category if we DON'T have an initialContext (mission)
        if (!initialContext) {
          setActiveCategory(state.activeCategory || null);
        }
        setSortOrder(state.sortOrder || 'asc');
        setCurrentPage(state.currentPage || 1);
      } catch (e) {
        console.error("Failed to load vocab state", e);
      }
    }
  }, [initialContext]);

  useEffect(() => {
    const stateToSave = { filter, activeCategory, sortOrder, currentPage };
    localStorage.setItem('lovspeak_state_vocab', JSON.stringify(stateToSave));
  }, [filter, activeCategory, sortOrder, currentPage]);

  useEffect(() => {
    loadData();
    
    // Auto-set category based on mission theme or explicit category
    if (initialContext?.vocabCategory) {
      setActiveCategory(initialContext.vocabCategory);
    } else if (initialContext?.title) {
      const titleLower = initialContext.title.toLowerCase();
      // Try to find matching category
      const categories = [...VOCAB_CATEGORIES];
      const match = categories.find(c => titleLower.includes(c.toLowerCase()));
      if (match) {
        setActiveCategory(match);
      }
    }
  }, [initialContext]);

  const loadData = () => {
    setUserItems(getVocab());
    setFavorites(getFavorites());
    setCustomCategories(getCustomCategories());
  };

  const allItems = useMemo(() => {
    const enrichment = getVocabEnrichment();
    return [...STATIC_VOCAB, ...userItems].map(item => {
      // 1. Check AI enrichment (persistent)
      // 2. Check Static details (hardcoded dictionary)
      const enriched = enrichment[item.id];
      const hardcoded = STATIC_VOCAB_DETAILS[item.english.toLowerCase()];

      return { ...item, ...hardcoded, ...enriched };
    });
  }, [userItems]);

  const categoryIcons = useMemo(() => {
    const icons = { ...DEFAULT_ICONS };
    customCategories.forEach(c => {
      icons[c.name] = c.icon;
    });
    return icons;
  }, [customCategories]);

  const categoryColors = useMemo(() => {
    const colors: Record<string, string> = {};
    customCategories.forEach(c => {
      if (c.color) colors[c.name] = c.color;
    });
    return colors;
  }, [customCategories]);

  const allCategoryNames = useMemo(() => {
    const customNames = customCategories.map(c => c.name);
    return [...VOCAB_CATEGORIES, ...customNames];
  }, [customCategories]);

  const groupedVocab = useMemo(() => {
    const groups: Record<string, VocabItem[]> = {};
    allCategoryNames.forEach(cat => groups[cat] = []);
    groups['Favorites'] = [];

    allItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
      if (favorites.includes(item.id)) {
        groups['Favorites'].push(item);
      }
    });
    return groups;
  }, [allItems, favorites, allCategoryNames]);

  const isSearching = filter.length > 0;

  const displayedItems = useMemo(() => {
    let items: VocabItem[] = [];
    if (activeCategory) {
      items = groupedVocab[activeCategory] || [];
      // Further filter by search query if set
      if (filter) {
        const q = filter.toLowerCase();
        items = items.filter(i =>
          i.english.toLowerCase().includes(q) ||
          i.indonesian.toLowerCase().includes(q)
        );
      }
    } else if (isSearching) {
      items = allItems.filter(i =>
        i.english.toLowerCase().includes(filter.toLowerCase()) ||
        i.indonesian.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return [...items].sort((a, b) => {
      const valA = a.english.toLowerCase();
      const valB = b.english.toLowerCase();
      if (sortOrder === 'asc') return valA.localeCompare(valB);
      return valB.localeCompare(valA);
    });
  }, [isSearching, filter, activeCategory, groupedVocab, allItems, sortOrder]);

  const totalPages = Math.ceil(displayedItems.length / itemsPerPage);
  const paginatedItems = displayedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.play('tap');
    const newFavs = toggleFavorite(id);
    setFavorites(newFavs);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setNewWord('');
    setNewTrans('');
    setNewIpa('');
    setNewSynonyms([]);
    setNewExamples([]);
    if (activeCategory && activeCategory !== 'Favorites' && allCategoryNames.includes(activeCategory)) {
      setSelectedCat(activeCategory);
    } else {
      setSelectedCat(allCategoryNames[0]);
    }
    setIsCreatingCat(false);
    setShowModal(true);
  };

  const openEditModal = (item: VocabItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setNewWord(item.english);
    setNewTrans(item.indonesian);
    setSelectedCat(item.category);
    setNewIpa(item.ipa || '');
    setNewSynonyms(item.synonyms || []);
    setNewExamples(item.examples || []);
    setIsCreatingCat(false);
    setShowModal(true);
  };

  const handleSave = () => {
    audioService.play('success');
    let finalCategory = selectedCat;
    if (isCreatingCat) {
      if (!newCatName.trim()) return;
      const newCustomCat: CustomCategory = { name: newCatName, icon: newCatIcon };
      saveCustomCategory(newCustomCat);
      finalCategory = newCatName;
    }

    if (editingItem) {
      const updated: VocabItem = {
        ...editingItem,
        english: newWord,
        indonesian: newTrans,
        category: finalCategory,
        ipa: newIpa,
        synonyms: newSynonyms,
        examples: newExamples
      };
      updateVocab(updated);
    } else {
      if (!newWord.trim() && !newTrans.trim()) {
        setShowModal(false);
        return;
      }
      const item: VocabItem = {
        id: `user-${Date.now()}`,
        english: newWord,
        indonesian: newTrans,
        category: finalCategory,
        isUserGenerated: true,
        ipa: newIpa,
        synonyms: newSynonyms,
        examples: newExamples
      };
      saveVocab(item);
    }

    loadData();
    setShowModal(false);
    
    // NOTE: Do NOT call onComplete() here. For vocabulary daily missions,
    // the user must explicitly click the 'Claim Mission Rewards' button 
    // on the mission banner once they've reached their word goal.
  };

  const handleAIMagic = async () => {
    if (!newWord.trim()) return;
    setIsAiLoading(true);
    try {
      const details = await generateVocabDetails(newWord);
      setNewIpa(details.ipa);
      setNewSynonyms(details.synonyms);
      setNewExamples(details.examples);
      audioService.play('magic');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const playPronunciation = (text: string) => {
    ttsService.speak(text, 'en-US');
  };

  // --- FLASHCARD MISSION MODE ---
  if (isFlashcardMode) {
    const wordIds = initialContext!.vocabWordIds!;
    const enrichment = getVocabEnrichment();
    const missionWords = wordIds.map(id => {
      const base = [...STATIC_VOCAB, ...userItems].find(v => v.id === id);
      if (!base) return null;
      const enriched = enrichment[base.id];
      const hardcoded = STATIC_VOCAB_DETAILS[base.english.toLowerCase()];
      return { ...base, ...hardcoded, ...enriched };
    }).filter(Boolean) as VocabItem[];

    const totalWords = missionWords.length;
    const currentWord = missionWords[flashcardIndex];
    const progress = ((flashcardIndex + (flashcardCompleted ? 1 : 0)) / totalWords) * 100;

    const handleNext = () => {
      audioService.play('nav');
      if (flashcardIndex < totalWords - 1) {
        setFlashcardIndex(prev => prev + 1);
      } else {
        setFlashcardCompleted(true);
        audioService.play('success');
      }
    };

    const handlePrev = () => {
      audioService.play('tap');
      if (flashcardIndex > 0) {
        setFlashcardIndex(prev => prev - 1);
      }
    };

    return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate?.(AppView.HOME)} className="text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] tracking-widest">
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-lovelya-100 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              Daily Mission
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{initialContext?.title}</span>
            <span className="text-[10px] font-black text-lovelya-600">{Math.min(flashcardIndex + 1, totalWords)} / {totalWords}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`h-full rounded-full ${flashcardCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-lovelya-400 to-pink-500'}`}
            />
          </div>
          {/* Word Dots */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {missionWords.map((w, i) => (
              <button
                key={w.id}
                onClick={() => { setFlashcardIndex(i); setFlashcardCompleted(false); audioService.play('tap'); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === flashcardIndex ? 'bg-lovelya-500 scale-125 shadow-md shadow-lovelya-300' :
                  i < flashcardIndex || flashcardCompleted ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Completion Card */}
        <AnimatePresence mode="wait">
          {flashcardCompleted ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl border border-green-200 dark:border-green-800 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center mx-auto">
                <i className="fas fa-check-circle text-4xl text-green-500"></i>
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-1">Mission Complete!</h2>
                <p className="text-sm text-gray-500">You've learned all {totalWords} words</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {missionWords.map(w => (
                  <span key={w.id} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-bold border border-green-100 dark:border-green-800">
                    {w.english}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onComplete?.()}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-200/50 hover:shadow-2xl transition-all"
              >
                <i className="fas fa-gift mr-2"></i> Claim Rewards +{initialContext?.xpReward || 15} XP
              </motion.button>
            </motion.div>
          ) : currentWord ? (
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Word Header */}
              <div className="bg-gradient-to-r from-lovelya-500 via-pink-500 to-rose-500 p-6 md:p-8 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <i className={`fas ${categoryIcons[currentWord.category] || 'fa-book'} text-[8rem]`}></i>
                </div>
                <div className="relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">{currentWord.category}</span>
                  <h2 className="text-3xl md:text-4xl font-black mb-2">{currentWord.english}</h2>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-white/80 text-base">{currentWord.ipa || '/.../'}</span>
                    <button
                      onClick={() => playPronunciation(currentWord.english)}
                      className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
                    >
                      <i className="fas fa-volume-up text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Word Content */}
              <div className="p-6 md:p-8 space-y-5">
                {/* Meaning */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Meaning</p>
                  <p className="text-xl font-bold text-gray-700 dark:text-gray-200">{currentWord.indonesian}</p>
                </div>

                {/* Synonyms */}
                {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Synonyms</p>
                    <div className="flex flex-wrap gap-2">
                      {currentWord.synonyms.map(s => (
                        <span key={s} className="px-3 py-1 bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 rounded-full text-xs font-medium border border-lovelya-100 dark:border-lovelya-800">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Antonyms */}
                {currentWord.antonyms && currentWord.antonyms.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Antonyms</p>
                    <div className="flex flex-wrap gap-2">
                      {currentWord.antonyms.map(a => (
                        <span key={a} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium border border-red-100 dark:border-red-800">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                {currentWord.examples && currentWord.examples.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Example Sentences</p>
                    <ul className="space-y-3">
                      {currentWord.examples.map((ex, i) => {
                        const [eng, indo] = ex.split('|').map(s => s.trim());
                        return (
                          <li key={i} className="border-l-4 border-lovelya-200 dark:border-lovelya-700 pl-3 py-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{eng}"</p>
                            {indo && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Artinya: {indo}</p>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* No details yet */}
                {(!currentWord.synonyms || currentWord.synonyms.length === 0) && (!currentWord.examples || currentWord.examples.length === 0) && (
                  <div className="py-6 text-center">
                    <button
                      onClick={async () => {
                        setIsAiLoading(true);
                        try {
                          const details = await generateVocabDetails(currentWord.english);
                          await saveVocabEnrichment(currentWord.id, details);
                          audioService.play('magic');
                          // Force re-render by incrementing index back and forth
                          setFlashcardIndex(prev => prev);
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setIsAiLoading(false);
                        }
                      }}
                      disabled={isAiLoading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg disabled:opacity-50"
                    >
                      {isAiLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-sparkles mr-2"></i>}
                      Generate AI Details
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={flashcardIndex === 0}
                  className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-gray-700 transition shadow-sm active:scale-95"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className={`flex-1 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg transition-all ${
                    flashcardIndex === totalWords - 1
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200/50'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  }`}
                >
                  {flashcardIndex === totalWords - 1 ? (
                    <><i className="fas fa-check-circle mr-2"></i> Complete</>
                  ) : (
                    <>Next Word <i className="fas fa-chevron-right ml-2"></i></>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6 h-full flex flex-col">
      <div className="mx-4 flex flex-col gap-2">
        <button onClick={() => onNavigate?.(AppView.HOME)} className="mb-2 text-gray-400 hover:text-gray-600 font-bold transition flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>

        {/* Mission Bar */}
        {isMissionActive && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-4 bg-gradient-to-r from-lovelya-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <i className="fas fa-bullseye text-5xl"></i>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Daily Mission</span>
                <span className="text-[10px] font-bold">{completedIds.size} / {missionGoal} words</span>
              </div>
              <h3 className="text-sm font-bold mb-1">{initialContext?.title}</h3>
              <p className="text-[10px] opacity-80 mb-3">{initialContext?.desc}</p>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (completedIds.size / missionGoal) * 100)}%` }}
                  className={`h-full ${completedIds.size >= missionGoal ? 'bg-green-400' : 'bg-white'}`}
                />
              </div>

              {completedIds.size >= missionGoal && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => onComplete?.()}
                  className="mt-4 w-full py-2 bg-white text-lovelya-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-green-50 transition-colors"
                >
                  Claim Mission Rewards +15 XP
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm border border-lovelya-100 dark:border-gray-700 relative mx-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div>
            <h2 className="text-sm md:text-lg font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs shadow-md"><i className="fas fa-book-reader"></i></div>
              Vocabulary
            </h2>
            <p className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 uppercase tracking-widest font-bold">
              {activeCategory && isSearching
                ? `${displayedItems.length} kata di "${activeCategory}"`
                : isSearching
                  ? `Ditemukan ${displayedItems.length} kata`
                  : activeCategory
                    ? `Folder: ${activeCategory}`
                    : 'Kelola koleksi kosa kata Anda'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-[8px] md:text-[10px]"></i>
              <input
                id="vocab-search"
                type="text"
                placeholder="Cari kata atau kategori..."
                value={filter}
                onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-8 py-1.5 md:py-2 w-full rounded-lg md:rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-lovelya-300 transition-all text-[10px] md:text-sm"
              />
              {filter && (
                <button
                  onClick={() => { setFilter(''); setCurrentPage(1); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <i className="fas fa-times text-[9px] md:text-xs"></i>
                </button>
              )}
            </div>

            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={openAddModal}
              className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg md:rounded-xl shadow-xl transition flex items-center justify-center shrink-0"
            >
              <i className="fas fa-plus text-xs md:text-sm"></i>
            </motion.button>

            {activeCategory && (
              <button
                onClick={() => { setActiveCategory(null); setFilter(''); setCurrentPage(1); }}
                className="w-9 h-9 md:w-10 md:h-10 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 rounded-lg md:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center shrink-0"
              >
                <i className="fas fa-arrow-left text-sm md:text-base"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[350px] md:min-h-[500px]">
        {!activeCategory && (
          <div className="animate-fade-in px-4">
            <div className="mb-4 md:mb-5">
              <button
                onClick={() => { setActiveCategory('Favorites'); setFilter(''); setCurrentPage(1); }}
                className="w-full md:w-auto flex items-center justify-center p-3 md:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-100 dark:border-red-900 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group"
              >
                <div className="w-8 h-8 md:w-11 md:h-11 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mr-3 md:mr-4 text-red-500 shadow-sm group-hover:scale-110 transition">
                  <i className="fas fa-heart text-sm md:text-xl"></i>
                </div>
                <div className="text-left mr-4 md:mr-8">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-[10px] md:text-sm leading-tight">Favorites</h3>
                  <p className="text-[7px] md:text-[11px] text-gray-500">{groupedVocab['Favorites']?.length || 0} words</p>
                </div>
                <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition ml-auto">
                  <i className="fas fa-chevron-right text-[8px]"></i>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-3 pb-6">
              {(() => {
                const q = filter.toLowerCase();
                const filtered = allCategoryNames.filter(cat => {
                  const count = groupedVocab[cat]?.length || 0;
                  if (count === 0 && !VOCAB_CATEGORIES.includes(cat)) return false;
                  if (q) return cat.toLowerCase().includes(q);
                  return true;
                });
                if (filtered.length === 0) return (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <i className="fas fa-search-minus text-3xl mb-3 block opacity-40"></i>
                    <p className="text-sm font-bold">Kategori tidak ditemukan</p>
                    <p className="text-xs mt-1">Coba kata kunci lain atau cari langsung kata vocabulary</p>
                  </div>
                );
                return filtered.map((cat, idx) => {
                const count = groupedVocab[cat]?.length || 0;

                return (
                  <motion.div key={cat} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="relative group h-full">
                    <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setActiveCategory(cat); setFilter(''); setCurrentPage(1); }}
                      className="w-full flex flex-col items-center justify-center p-2.5 md:p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-pink-300 transition-all text-center h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-1 opacity-5">
                        <i className={`fas ${categoryIcons[cat] || 'fa-folder'} text-3xl md:text-5xl`} style={{ color: categoryColors[cat] }}></i>
                      </div>
                      <div className="w-8 h-8 md:w-12 md:h-12 bg-pink-50 dark:bg-gray-700 rounded-xl md:rounded-2xl flex items-center justify-center mb-1.5 md:mb-3 text-base md:text-xl group-hover:scale-110 transition duration-300 z-10 shadow-inner" style={{ color: categoryColors[cat] || '#ec4899', backgroundColor: categoryColors[cat] ? `${categoryColors[cat]}20` : undefined }}>
                        <i className={`fas ${categoryIcons[cat] || 'fa-folder'}`}></i>
                      </div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-[10px] md:text-xs mb-0.5 md:mb-1 group-hover:text-pink-600 w-full z-10 line-clamp-1">
                        {cat}
                      </h3>
                      <span className="text-[7px] md:text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-700 px-1.5 py-0.5 rounded-full mt-auto z-10 font-medium">
                        {count} words
                      </span>
                    </motion.button>
                  </motion.div>
                );
              });
              })()}
            </div>
          </div>
        )}

        {activeCategory && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-[calc(100vh-240px)] md:h-[calc(100vh-220px)] animate-slide-up mx-4">
            <div className="p-2 md:p-3 border-b border-gray-100 dark:border-gray-700 bg-lovelya-50/50 dark:bg-gray-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[9px] md:text-xs">
                <span className="text-gray-400 hidden md:inline">Folder:</span>
                <span className="text-gray-400 font-bold text-lovelya-600 dark:text-lovelya-400 flex items-center gap-1 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
                  <i className={`fas ${activeCategory === 'Favorites' ? 'fa-heart text-red-500' : (categoryIcons[activeCategory || ''] || 'fa-folder-open')}`}></i>
                  {activeCategory || 'Hasil Pencarian'}
                </span>
              </div>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="text-gray-500 hover:text-lovelya-600 text-[9px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1"
              >
                <i className={`fas fa-sort-alpha-${sortOrder === 'asc' ? 'down' : 'up'}`}></i> <span className="hidden md:inline">Urutkan</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
                  <tr className="text-gray-400 dark:text-gray-500 text-[6px] md:text-[9px] uppercase tracking-wider font-extrabold">
                    <th className="p-2 md:p-2.5 border-b border-gray-100 dark:border-gray-700 w-7 md:w-10 text-center">#</th>
                    <th className="p-2 md:p-2.5 border-b border-gray-100 dark:border-gray-700">English</th>
                    <th className="p-2 md:p-2.5 border-b border-gray-100 dark:border-gray-700">Indonesian</th>
                    <th className="p-2 md:p-2.5 border-b border-gray-100 dark:border-gray-700 text-center w-12 md:w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {paginatedItems.map((item, idx) => {
                    const isFav = favorites.includes(item.id);
                    const displayIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedDetailItem(item);
                          if (isMissionActive && !completedIds.has(item.id)) {
                            const newCompleted = new Set(completedIds);
                            newCompleted.add(item.id);
                            setCompletedIds(newCompleted);
                            if (newCompleted.size === missionGoal) {
                              audioService.play('success');
                            }
                          }
                        }}
                        className="hover:bg-lovelya-50/50 dark:hover:bg-gray-700/30 transition-colors group cursor-pointer"
                      >
                        <td className="p-1.5 md:p-2 text-gray-400 text-[8px] font-mono text-center">{displayIdx}</td>
                        <td className="p-1.5 md:p-2">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 dark:text-gray-100 text-[10px] md:text-[13px]">{item.english}</span>
                            {item.ipa && <span className="text-[7px] md:text-[9px] text-lovelya-500 font-mono font-bold mt-0.5">{item.ipa}</span>}
                          </div>
                        </td>
                        <td className="p-1.5 md:p-2">
                          <span className="text-gray-600 dark:text-gray-300 italic text-[9px] md:text-[12px]">{item.indonesian}</span>
                        </td>
                        <td className="p-1.5 md:p-2 text-center">
                          <div className="flex items-center justify-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); playPronunciation(item.english); }}
                              className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-lovelya-500 hover:bg-lovelya-500 hover:text-white transition flex items-center justify-center shadow-sm"
                              title="Listen"
                            >
                              <i className="fas fa-volume-up text-[7px] md:text-[9px]"></i>
                            </button>

                            <button
                              onClick={(e) => handleFavoriteToggle(item.id, e)}
                              className={`w-5 h-5 md:w-6 md:h-6 rounded-full border transition flex items-center justify-center shadow-sm ${isFav
                                ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-300 hover:text-red-400'
                                }`}
                            >
                              <i className={`${isFav ? 'fas' : 'far'} fa-heart text-[7px] md:text-[9px]`}></i>
                            </button>

                            {item.isUserGenerated && (
                              <button
                                onClick={(e) => openEditModal(item, e)}
                                className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-blue-500 hover:bg-blue-500 hover:text-white transition flex items-center justify-center shadow-sm"
                                title="Edit"
                              >
                                <i className="fas fa-pen text-[8px] md:text-[9px]"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-2.5 md:p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"
                >
                  <i className="fas fa-chevron-left text-[10px]"></i>
                </button>
                <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Hal {currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-all active:scale-90"
                >
                  <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden animate-bounce-in max-h-[90vh] overflow-y-auto">
            <div className="bg-lovelya-500 p-4 md:p-5 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                <i className={`fas ${editingItem ? 'fa-edit' : 'fa-plus-circle'}`}></i>
                {editingItem ? 'Edit Kata' : 'Tambah Kosa Kata'}
              </h3>
              <button onClick={() => setShowModal(false)} className="hover:opacity-75 transition bg-white/20 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center"><i className="fas fa-times text-sm"></i></button>
            </div>

            <div className="p-5 md:p-6 space-y-5 md:space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-600">
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 md:mb-3">Folder / Kategori</label>

                {!isCreatingCat ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        value={selectedCat}
                        onChange={e => setSelectedCat(e.target.value)}
                        className="w-full p-3 md:p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none appearance-none transition text-xs md:text-sm font-medium"
                      >
                        {allCategoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
                    </div>
                    <button
                      onClick={() => setIsCreatingCat(true)}
                      className="px-3 md:px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-lovelya-50 dark:hover:bg-gray-600 text-lovelya-600 transition"
                      title="Buat Folder Baru"
                    >
                      <i className="fas fa-folder-plus text-lg md:text-xl"></i>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-lovelya-600 font-bold uppercase">Folder Baru</span>
                      <button onClick={() => setIsCreatingCat(false)} className="text-[10px] text-gray-400 underline">Batal</button>
                    </div>
                    <input
                      placeholder="Nama Folder"
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      className="w-full p-3 md:p-3.5 rounded-xl border-2 border-lovelya-100 dark:border-gray-600 bg-white dark:bg-gray-700 outline-none text-xs md:text-sm"
                    />
                    <div className="grid grid-cols-5 gap-2">
                      {ICON_OPTIONS.map(icon => (
                        <button key={icon} onClick={() => setNewCatIcon(icon)} className={`p-2 rounded-lg text-center transition ${newCatIcon === icon ? 'bg-lovelya-500 text-white shadow-md' : 'bg-white dark:bg-gray-600 text-gray-500 hover:bg-gray-100'}`}><i className={`fas ${icon} text-sm`}></i></button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Kata Inggris</label>
                    <input
                      placeholder="Contoh: Resilience"
                      value={newWord}
                      onChange={e => setNewWord(e.target.value)}
                      className="w-full p-3 md:p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none transition text-base md:text-lg font-bold text-gray-800 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={handleAIMagic}
                    disabled={!newWord.trim() || isAiLoading}
                    className="h-[46px] md:h-[56px] px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/20 transition disabled:opacity-50 flex items-center gap-2"
                    title="AI Magic"
                  >
                    <i className={`fas ${isAiLoading ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest hidden md:inline">Magic</span>
                  </button>
                </div>
                {newIpa && (
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-2 rounded-lg border border-purple-100 dark:border-purple-900 flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold font-mono text-[10px] md:text-xs">
                    <i className="fas fa-volume-up"></i>
                    IPA: {newIpa}
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Terjemahan Indonesia</label>
                  <input
                    placeholder="Contoh: Ketangguhan"
                    value={newTrans}
                    onChange={e => setNewTrans(e.target.value)}
                    className="w-full p-3 md:p-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-lovelya-500 outline-none transition text-base md:text-lg"
                  />
                </div>
                {newSynonyms.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Sinonim (AI Generated)</label>
                    <div className="flex flex-wrap gap-2">
                      {newSynonyms.map(s => <span key={s} className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-[10px] md:text-xs">{s}</span>)}
                    </div>
                  </div>
                )}
                {newExamples.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 md:mb-2">Kalimat Contoh (AI Generated)</label>
                    <ul className="space-y-2">
                      {newExamples.map((ex, i) => {
                        const [eng, indo] = ex.split('|').map(s => s.trim());
                        return (
                          <li key={i} className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600">
                            <p className="text-[10px] md:text-xs text-gray-800 dark:text-gray-200 font-medium italic">"{eng}"</p>
                            {indo && <p className="text-[9px] md:text-[10px] text-gray-500 mt-1"> artinya: {indo}</p>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="p-2.5 md:p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900 flex items-center gap-2 md:gap-3">
                  <i className="fas fa-info-circle text-blue-500 text-xs"></i>
                  <p className="text-[9px] md:text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase tracking-widest leading-tight">Tip: Gunakan "Magic" untuk otomatis mengisi IPA, sinonim, dan kalimat contoh menggunakan AI.</p>
                </div>
              </div>

              <div className="pt-5 md:pt-6 flex justify-end gap-2 md:gap-3 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => setShowModal(false)} className="px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-gray-600 dark:text-gray-300 font-bold text-xs md:text-sm">Batal</button>
                <button onClick={handleSave} className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl bg-lovelya-500 text-white font-bold hover:bg-lovelya-600 shadow-lg shadow-lovelya-200/50 transition text-xs md:text-sm">
                  {isCreatingCat ? 'Buat & Simpan' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in" onClick={() => setSelectedDetailItem(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-bounce-in flex flex-col max-h-[85vh]">
            <div className="p-6 md:p-8 flex flex-col items-center text-center overflow-y-auto custom-scrollbar flex-1 min-h-0 w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-lovelya-50 dark:bg-gray-700 rounded-3xl flex items-center justify-center mb-4 md:mb-6 shadow-inner text-lovelya-500">
                <i className={`fas ${categoryIcons[selectedDetailItem.category] || 'fa-book'} text-3xl md:text-4xl`}></i>
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-1">
                {selectedDetailItem.english}
              </h3>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <span className="text-lovelya-500 font-mono font-bold text-base md:text-xl">
                  {selectedDetailItem.ipa || '/.../'}
                </span>
                <button
                  onClick={() => playPronunciation(selectedDetailItem.english)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-lovelya-100 dark:bg-lovelya-900/30 text-lovelya-600 flex items-center justify-center hover:bg-lovelya-500 hover:text-white transition"
                >
                  <i className="fas fa-volume-up text-sm md:text-base"></i>
                </button>
              </div>

              <div className="w-full bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Meaning</p>
                <p className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-200">{selectedDetailItem.indonesian}</p>
              </div>

              {selectedDetailItem.synonyms && selectedDetailItem.synonyms.length > 0 ? (
                <div className="w-full text-left space-y-4 mb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Synonyms</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDetailItem.synonyms.map(s => <span key={s} className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">{s}</span>)}
                    </div>
                  </div>
                  {selectedDetailItem.antonyms && selectedDetailItem.antonyms.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest mt-4">Antonyms</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDetailItem.antonyms.map(a => <span key={a} className="px-3 py-1 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 rounded-full text-xs font-medium">{a}</span>)}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Example Sentences</p>
                    <ul className="space-y-4 text-left">
                      {selectedDetailItem.examples?.map((ex, i) => {
                        const [eng, indo] = ex.split('|').map(s => s.trim());
                        return (
                          <li key={i} className="border-l-4 border-lovelya-200 pl-3">
                            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 italic mb-1">"{eng}"</p>
                            {indo && <p className="text-xs text-gray-500 dark:text-gray-400">Artinya: {indo}</p>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="w-full py-8 md:py-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-600 mb-8">
                  <i className="fas fa-magic text-3xl text-gray-300 mb-4"></i>
                  <p className="text-gray-400 font-medium mb-6">AI Details not generated yet.</p>
                  <button
                    onClick={async () => {
                      setIsAiLoading(true);
                      try {
                        const details = await generateVocabDetails(selectedDetailItem.english);
                        await saveVocabEnrichment(selectedDetailItem.id, details);
                        setSelectedDetailItem({ ...selectedDetailItem, ...details });
                        audioService.play('magic');
                        loadData();
                      } catch (e) {
                        console.error(e);
                      } finally {
                        setIsAiLoading(false);
                      }
                    }}
                    disabled={isAiLoading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-purple-500/20 hover:scale-105 transition disabled:opacity-50"
                  >
                    {isAiLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-sparkles mr-2"></i>}
                    Unlock AI Magic
                  </button>
                </div>
              )}

            </div>
            <div className="w-full p-4 shrink-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest text-sm hover:opacity-90 transition"
              >
                Close Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VocabularyModule;
