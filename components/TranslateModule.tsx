
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { translateText, SimpleTranslationResult } from '../services/gemini';
import { audioService } from '../services/audioService';
import { ttsService } from '../services/ttsService';
import { saveVocab, saveCustomCategory, getCustomCategories, CustomCategory } from '../services/storage';
import { VOCAB_CATEGORIES } from '../constants';
import { ModuleProps } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const ICON_OPTIONS = [
  'fa-star', 'fa-heart', 'fa-lightbulb', 'fa-book', 'fa-comment', 
  'fa-gem', 'fa-crown', 'fa-puzzle-piece', 'fa-gamepad', 'fa-car',
  'fa-bicycle', 'fa-coffee', 'fa-pizza-slice', 'fa-tree', 'fa-moon',
  'fa-sun', 'fa-cloud', 'fa-umbrella', 'fa-bolt', 'fa-snowflake'
];

const TranslateModule: React.FC<ModuleProps> = ({ onComplete }) => {
  // Translation State
  const [source, setSource] = useState('');
  const [result, setResult] = useState<SimpleTranslationResult | null>(null);
  const [direction, setDirection] = useState<'en-id' | 'id-en'>('en-id');
  const [loading, setLoading] = useState(false);

  // Selection & Modal State
  const [selection, setSelection] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [englishWord, setEnglishWord] = useState('');
  const [indonesianWord, setIndonesianWord] = useState('');
  
  // Category State
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [isCreatingCat, setIsCreatingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-star');

  // Ref to skip auto-translate when swapping direction
  const isSwapping = useRef(false);

  useEffect(() => {
    // Load custom categories on mount to populate dropdown
    setCustomCategories(getCustomCategories());
  }, []);

  // Stable translation function using useCallback
  const performTranslation = useCallback(async () => {
    if (!source.trim()) {
        setResult(null);
        return;
    }
    setLoading(true);
    try {
      const res = await translateText(source, direction);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [source, direction]);

  // Auto-translate debounce
  useEffect(() => {
    // Skip auto-translate if we're in the middle of a swap
    if (isSwapping.current) {
      isSwapping.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (source.trim().length > 1) {
        performTranslation();
      } else if (source.trim().length === 0) {
        setResult(null);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [source, direction, performTranslation]);

  const handleTranslate = () => {
    audioService.play('tap');
    performTranslation();
  };

  const swap = () => {
    // Set flag to prevent auto-translate from firing during the swap
    isSwapping.current = true;
    const newDirection = direction === 'en-id' ? 'id-en' : 'en-id';
    setDirection(newDirection);
    if (result) {
        setSource(result.translation);
        // After swapping, we need to trigger a translate with new values
        // Use a small timeout so both state updates settle first
        setTimeout(() => {
          performTranslation();
        }, 100);
    }
    setSelection('');
  };

  const playAudio = (text: string, isSource: boolean) => {
    if (!text) return;
    const lang = direction === 'en-id'
      ? (isSource ? 'en-US' : 'id-ID')
      : (isSource ? 'id-ID' : 'en-US');
    ttsService.speak(text, lang, 0.9);
  };

  // Handle Text Selection in Target Box
  const handleTextSelect = () => {
    const text = window.getSelection()?.toString().trim();
    if (text && text.length > 0) {
      setSelection(text);
    }
  };

  const openSaveModal = () => {
    // Refresh categories
    const cats = getCustomCategories();
    setCustomCategories(cats);
    
    // Default category
    setSelectedCat(VOCAB_CATEGORIES[0]);
    setIsCreatingCat(false);
    
    // Pre-fill based on direction and selection
    if (direction === 'en-id') {
      // Source is English, Target is Indonesian
      // If user selected text in target, that's Indonesian
      setIndonesianWord(selection);
      // We try to guess the English word if the source was short, otherwise leave blank for user
      setEnglishWord(source.length < 50 ? source : ''); 
    } else {
      // Source is Indonesian, Target is English
      // If user selected text in target, that's English
      setEnglishWord(selection);
      setIndonesianWord(source.length < 50 ? source : '');
    }

    setShowModal(true);
  };

  const handleSave = () => {
    let finalCategory = selectedCat;

    // 1. Handle New Category
    if (isCreatingCat) {
      if (!newCatName.trim()) {
        alert("Please enter a folder name");
        return;
      }
      const newCustomCat: CustomCategory = { name: newCatName, icon: newCatIcon };
      saveCustomCategory(newCustomCat);
      setCustomCategories(prev => [...prev, newCustomCat]); // Update local state
      finalCategory = newCatName;
    }

    // 2. Validation
    if (!englishWord || !indonesianWord) {
      alert("Please ensure both English and Indonesian words are filled.");
      return;
    }

    // 3. Save Word
    saveVocab({
      id: `saved-${Date.now()}`,
      english: englishWord,
      indonesian: indonesianWord,
      category: finalCategory,
      isUserGenerated: true
    });

    // 4. Cleanup
    alert(`Saved "${englishWord}" to ${finalCategory}!`);
    setShowModal(false);
    setSelection('');
    window.getSelection()?.removeAllRanges();
  };

  const allCategoryNames = [
    ...VOCAB_CATEGORIES, 
    ...customCategories.map(c => c.name)
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 px-2 md:px-0">
      {/* Main Translation Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-gray-700/50">
        {/* Decorative gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-lovelya-500/10 to-blue-500/10 pointer-events-none" />

        {/* Language Switcher Header */}
        <div className="relative bg-gradient-to-r from-violet-600 via-lovelya-600 to-blue-600 p-3.5 md:p-5">
          <div className="flex items-center justify-between">
            <motion.div layout className="flex-1 text-center">
              <div className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-0.5">From</div>
              <div className="text-white font-black text-sm md:text-lg flex items-center justify-center gap-1.5">
                <span>{direction === 'en-id' ? '🇬🇧' : '🇮🇩'}</span>
                {direction === 'en-id' ? 'English' : 'Indonesian'}
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.85 }}
              onClick={swap}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg border border-white/20 mx-3 md:mx-4 shrink-0"
            >
              <i className="fas fa-exchange-alt text-sm md:text-base"></i>
            </motion.button>

            <motion.div layout className="flex-1 text-center">
              <div className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-0.5">To</div>
              <div className="text-white font-black text-sm md:text-lg flex items-center justify-center gap-1.5">
                <span>{direction === 'en-id' ? '🇮🇩' : '🇬🇧'}</span>
                {direction === 'en-id' ? 'Indonesian' : 'English'}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Translation Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-800">
          {/* Source Input */}
          <div className="relative border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700/50">
            <textarea
              value={source}
              onChange={e => setSource(e.target.value)}
              placeholder="Type or paste text here..."
              className="w-full h-36 md:h-56 p-4 md:p-6 pr-12 resize-none outline-none bg-transparent text-gray-900 dark:text-white text-base md:text-lg placeholder-gray-300 dark:placeholder-gray-600 font-medium"
            ></textarea>
            <div className="absolute bottom-2 left-4 text-[9px] md:text-[10px] text-gray-300 dark:text-gray-600 font-bold">{source.length > 0 ? `${source.length} chars` : ''}</div>
            {source && (
              <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 flex items-center gap-1.5">
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  onClick={() => playAudio(source, true)}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-500 flex items-center justify-center hover:bg-violet-100 transition"
                  title="Listen"
                >
                  <i className="fas fa-volume-up text-xs md:text-sm"></i>
                </motion.button>
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                  onClick={() => { setSource(''); setResult(null); }}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <i className="fas fa-times text-xs"></i>
                </motion.button>
              </div>
            )}
          </div>

          {/* Translation Output */}
          <div className="relative flex flex-col">
            <div className="flex-1 p-4 md:p-6 pr-12 bg-gradient-to-br from-gray-50/80 to-violet-50/30 dark:from-gray-800/50 dark:to-gray-800 text-gray-900 dark:text-gray-200 text-base md:text-lg min-h-[9rem] md:min-h-[14rem]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-violet-400 to-lovelya-500" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Translating...</span>
                </div>
              ) : result?.translation ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseUp={handleTextSelect} className="whitespace-pre-wrap font-medium leading-relaxed">
                  {result.translation}
                </motion.div>
              ) : (
                <span className="text-gray-300 dark:text-gray-600 italic text-sm">Translation will appear here...</span>
              )}
            </div>

            {result?.translation && !loading && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                onClick={() => playAudio(result.translation, false)}
                className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition z-10"
                title="Listen"
              >
                <i className="fas fa-volume-up text-xs md:text-sm"></i>
              </motion.button>
            )}

            {/* Synonyms and Examples */}
            <AnimatePresence>
              {result && !loading && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-100 dark:border-gray-700/50 overflow-hidden"
                >
                  <div className="p-4 md:p-5 space-y-4">
                    {result.synonyms && result.synonyms.length > 0 && (
                      <div>
                        <h4 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <i className="fas fa-layer-group text-violet-400"></i> Synonyms
                        </h4>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {result.synonyms.map((s, i) => (
                            <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                              className="px-2.5 py-1 bg-gradient-to-r from-violet-50 to-lovelya-50 dark:from-violet-900/20 dark:to-lovelya-900/20 text-violet-700 dark:text-violet-300 rounded-full text-[10px] md:text-xs font-bold border border-violet-100 dark:border-violet-800/30">
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.examples && result.examples.length > 0 && (
                      <div>
                        <h4 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <i className="fas fa-comment-dots text-blue-400"></i> Examples
                        </h4>
                        <div className="space-y-1.5">
                          {result.examples.map((ex, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                              className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 italic flex gap-2 p-2 rounded-lg bg-white/60 dark:bg-gray-700/30">
                              <i className="fas fa-quote-left text-lovelya-300 text-[8px] mt-0.5 shrink-0"></i>
                              <span>{ex}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Save Button */}
            <AnimatePresence>
              {selection && !loading && (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                  className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-20">
                  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={openSaveModal}
                    className="bg-gradient-to-r from-violet-600 to-lovelya-600 text-white px-3.5 py-2 md:px-4 md:py-2.5 rounded-full shadow-xl text-[10px] md:text-xs font-black flex items-center gap-1.5 ring-4 ring-violet-100 dark:ring-violet-900/30"
                  >
                    <i className="fas fa-plus-circle"></i> Save <span className="hidden md:inline">Selection</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Bar */}
        <div className="relative p-3 md:p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex justify-between items-center border-t border-gray-100 dark:border-gray-700/50">
          <span className="text-[9px] md:text-xs text-gray-400 dark:text-gray-500 max-w-[55%] leading-tight font-medium">
            <i className="fas fa-info-circle mr-1 text-violet-300"></i>
            {selection ? 'Click "Save" to add to vocabulary.' : 'Highlight text in translation to save.'}
          </span>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleTranslate}
            disabled={loading || !source}
            className="px-4 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-violet-600 to-lovelya-600 text-white rounded-xl text-[10px] md:text-sm font-black shadow-lg disabled:opacity-30 transition-all flex items-center gap-1.5"
          >
            <i className={`fas ${loading ? 'fa-circle-notch fa-spin' : 'fa-language'} text-xs`}></i>
            {loading ? 'Wait...' : 'Translate'}
          </motion.button>
        </div>
      </motion.div>

      {/* Save to Vocab Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-700">

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-violet-600 via-lovelya-600 to-blue-600 p-4 md:p-5 flex justify-between items-center text-white sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <i className="fas fa-bookmark text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-sm md:text-base">Save to Vocabulary</h3>
                    <p className="text-white/60 text-[8px] md:text-[9px] font-bold">Add new word to your collection</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                  <i className="fas fa-times text-sm"></i>
                </motion.button>
              </div>

              <div className="p-5 md:p-6 space-y-5">
                {/* Word Inputs */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">🇬🇧 English</label>
                    <input
                      value={englishWord}
                      onChange={e => setEnglishWord(e.target.value)}
                      className="w-full p-3 md:p-3.5 rounded-xl border-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/20 outline-none transition-all font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">🇮🇩 Indonesian</label>
                    <input
                      value={indonesianWord}
                      onChange={e => setIndonesianWord(e.target.value)}
                      className="w-full p-3 md:p-3.5 rounded-xl border-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                {/* Folder Selection */}
                <div className="bg-gradient-to-br from-gray-50 to-violet-50/30 dark:from-gray-700/50 dark:to-gray-700/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-600">
                  <label className="block text-[10px] md:text-xs font-black text-gray-500 dark:text-gray-400 mb-2.5 flex items-center gap-1.5">
                    <i className="fas fa-folder text-violet-400"></i> Save to Folder
                  </label>

                  {!isCreatingCat ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={selectedCat}
                          onChange={e => setSelectedCat(e.target.value)}
                          className="w-full p-2.5 md:p-3 rounded-xl border-2 border-gray-100 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none appearance-none transition font-medium text-sm"
                        >
                          {allCategoryNames.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none text-xs"></i>
                      </div>
                      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreatingCat(true)}
                        className="px-3 bg-white dark:bg-gray-700 border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 text-violet-500 transition"
                        title="Create New Folder"
                      >
                        <i className="fas fa-folder-plus"></i>
                      </motion.button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-violet-600 font-black uppercase tracking-wider flex items-center gap-1"><i className="fas fa-sparkles"></i> New Folder</span>
                        <button onClick={() => setIsCreatingCat(false)} className="text-[10px] text-gray-400 hover:text-gray-600 font-bold">Cancel</button>
                      </div>
                      <input
                        placeholder="Folder Name (e.g. Travel Phrases)"
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-violet-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition font-medium text-sm"
                      />
                      <div>
                        <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Select Icon</label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {ICON_OPTIONS.map(icon => (
                            <motion.button key={icon} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={() => setNewCatIcon(icon)}
                              className={`p-2 rounded-lg text-center transition text-sm ${newCatIcon === icon ? 'bg-gradient-to-r from-violet-500 to-lovelya-500 text-white shadow-md' : 'bg-white dark:bg-gray-600 text-gray-400 hover:bg-gray-100'}`}
                            >
                              <i className={`fas ${icon}`}></i>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 flex justify-end gap-2.5 border-t border-gray-100 dark:border-gray-700">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold transition text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-lovelya-600 text-white font-black shadow-lg transition text-sm flex items-center gap-1.5"
                  >
                    <i className="fas fa-check text-xs"></i> Save Word
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TranslateModule;
