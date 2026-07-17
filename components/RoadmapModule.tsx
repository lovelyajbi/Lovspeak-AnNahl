// Fix: Added missing React and hooks imports
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Level, CurriculumUnit, CurriculumStep, AppView, ModuleProps, ModuleContext, ThematicBridgeContent } from '../types';
import { MASTER_CURRICULUM } from '../data/curriculum';
import { THEMATIC_BRIDGES } from '../data/thematicBridges';
import { getRoadmapProgress, completeRoadmapUnit } from '../services/storage';
import { LEVELS } from '../constants';
import { audioService } from '../services/audioService';

interface RoadmapModuleProps extends ModuleProps {
  onNavigateToModule: (view: AppView, context: ModuleContext) => void;
}

const RoadmapModule: React.FC<RoadmapModuleProps> = ({ onNavigateToModule, initialContext }) => {
  const [progress, setProgress] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<CurriculumUnit | null>(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState<Level | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'ROADMAP' | 'LIBRARY'>('ROADMAP');
  const [activeBridge, setActiveBridge] = useState<ThematicBridgeContent | null>(null);
  const [librarySearch, setLibrarySearch] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(getRoadmapProgress());
  }, []);

  useEffect(() => {
    if (!initialContext?.unitId) return;
    const unit = MASTER_CURRICULUM.flatMap(level => level.units).find(item => item.id === initialContext.unitId);
    if (unit) setSelectedUnit(unit);
  }, [initialContext?.unitId]);

  const isUnitCompleted = (unitId: string) => progress.includes(unitId);
  const isStepCompleted = (stepId: string) => progress.includes(stepId);

  const handleUnitClick = (unit: CurriculumUnit) => {
    audioService.play('tap');
    setSelectedUnit(unit);
  };

  const startStep = (step: CurriculumStep) => {
    audioService.play('nav');
    if (step.type === 'context_bridge') {
      const bridgeId = `${step.id}`;
      if (THEMATIC_BRIDGES[bridgeId]) {
        setActiveBridge(THEMATIC_BRIDGES[bridgeId]);
        if (!isStepCompleted(step.id)) {
          completeRoadmapUnit(step.id);
          setProgress(getRoadmapProgress());
        }
      }
      return;
    }

    if (!selectedUnit) return;

    const context: ModuleContext = {
      unitId: selectedUnit.id,
      stepId: step.id,
      type: 'unit',
      autoStart: true,
      level: selectedUnit.level,
      title: step.title,
      desc: step.description,
      grammarFocus: selectedUnit.grammarFocus,
      vocabTheme: selectedUnit.vocabTheme,
      targetLessonId: step.targetId,
      promptContext: step.promptContext
    };

    onNavigateToModule(step.moduleView, context);
  };

  const filteredCurriculum = useMemo(() => {
    if (activeLevelFilter === 'ALL') return MASTER_CURRICULUM;
    return MASTER_CURRICULUM.filter(lc => lc.level === activeLevelFilter);
  }, [activeLevelFilter]);

  // --- LIBRARY VIEW RENDERER ---
  const renderLibrary = () => {
    const q = librarySearch.toLowerCase();
    const bridgeEntries = Object.values(THEMATIC_BRIDGES).filter(b => {
      const matchesLevel = activeLevelFilter === 'ALL' ? true : b.level === activeLevelFilter;
      const matchesSearch = !q || b.unitTitle.toLowerCase().includes(q) || b.introduction?.toLowerCase().includes(q);
      return matchesLevel && matchesSearch;
    });

    return (
      <div className="space-y-5">
        {/* Search Bar */}
        <div className="relative max-w-sm">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
          <input
            id="library-search"
            type="text"
            placeholder="Cari topik thematic..."
            value={librarySearch}
            onChange={e => setLibrarySearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 transition-all text-xs md:text-sm shadow-sm"
          />
          {librarySearch && (
            <button
              onClick={() => setLibrarySearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          )}
        </div>
        {librarySearch && (
          <p className="text-[10px] text-gray-400 font-medium">
            {bridgeEntries.length > 0
              ? `${bridgeEntries.length} topik ditemukan untuk "${librarySearch}"`
              : `Tidak ada hasil untuk "${librarySearch}"`
            }
          </p>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {bridgeEntries.map(bridge => {
              const completed = isUnitCompleted(bridge.id);
              return (
                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  key={bridge.id}
                  onClick={() => {
                    audioService.play('tap');
                    setActiveBridge(bridge);
                  }}
                  className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 md:p-5 rounded-2xl border text-left hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full relative overflow-hidden ${completed ? 'border-green-300 dark:border-green-800 bg-green-50/20' : 'border-gray-100 dark:border-gray-700'}`}
                >
                  {completed && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0 ${completed ? 'bg-green-100 text-green-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
                    <i className={`fas ${completed ? 'fa-check-double' : 'fa-bookmark'} text-sm`}></i>
                  </div>
                  <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1.5">{bridge.level} · Insight</span>
                  <h4 className="text-xs md:text-sm font-black text-gray-900 dark:text-white leading-snug mb-1.5 line-clamp-2 group-hover:text-lovelya-600 transition-colors uppercase tracking-tight">{bridge.unitTitle}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1 italic font-medium opacity-70 leading-relaxed">"{bridge.introduction}"</p>
                  <div className={`mt-auto pt-3 border-t flex justify-between items-center text-[8px] font-black uppercase tracking-widest ${completed ? 'text-green-600 border-green-100' : 'text-purple-600 border-gray-100 dark:border-gray-700'}`}>
                    <span>{completed ? 'Mastered' : 'Unlock Insight'}</span>
                    <div className="w-5 h-5 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-current group-hover:text-white transition-all">
                      <i className="fas fa-arrow-right scale-75"></i>
                    </div>
                  </div>
                </motion.button>
              );
            })}
            {bridgeEntries.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-400">
                {librarySearch ? (
                  <>
                    <i className="fas fa-search-minus text-4xl mb-4 block opacity-40"></i>
                    <p className="font-black text-base uppercase tracking-widest">Topik tidak ditemukan</p>
                    <p className="text-xs mt-2 opacity-70">Coba kata kunci lain atau ubah filter level</p>
                  </>
                ) : (
                  <>
                    <i className="fas fa-folder-open text-5xl mb-4 animate-pulse block"></i>
                    <p className="font-black text-lg uppercase tracking-widest">No records unlocked yet.</p>
                  </>
                )}
              </div>
            )}
          </motion.div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto pb-10" ref={scrollContainerRef}>
      {/* Header */}
      <div className="text-center mb-6 md:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-400 text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm">
          <i className="fas fa-route"></i> Master Learning Path
        </div>
        <h2 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Curriculum Roadmap</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed opacity-80">
          Choose your level and start learning freely. Explore the Thematic Library for deeper context.
        </p>

        {/* View Switcher */}
        <div className="flex justify-center mt-5">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1 shadow-inner">
            <button
              onClick={() => setViewMode('ROADMAP')}
              className={`px-5 py-2 rounded-lg text-xs font-black transition-all duration-200 flex items-center gap-2 ${viewMode === 'ROADMAP' ? 'bg-white dark:bg-gray-700 text-lovelya-600 shadow-md transform scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <i className="fas fa-map-marked-alt"></i> Roadmap
            </button>
            <button
              onClick={() => setViewMode('LIBRARY')}
              className={`px-5 py-2 rounded-lg text-xs font-black transition-all duration-200 flex items-center gap-2 ${viewMode === 'LIBRARY' ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-md transform scale-105' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <i className="fas fa-archive"></i> Thematic Library
            </button>
          </div>
        </div>
      </div>

      {/* Level Selector */}
      <div className="sticky top-4 z-30 mb-6">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-1.5 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex gap-1.5 overflow-x-auto no-scrollbar items-center">
          <div className="px-4 py-2 border-r border-gray-100 dark:border-gray-700 hidden md:flex flex-col items-center justify-center shrink-0">
            <div className="text-[9px] font-black text-lovelya-600 uppercase tracking-widest leading-none mb-1">Mastery</div>
            <div className="text-lg font-black text-gray-800 dark:text-white leading-none">{Math.min(100, Math.round((progress.length / 50) * 100))}%</div>
          </div>
          <button
            onClick={() => setActiveLevelFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all whitespace-nowrap ${activeLevelFilter === 'ALL' ? 'bg-lovelya-600 text-white shadow-md' : 'text-gray-400 hover:text-lovelya-500'}`}
          >
            ALL
          </button>
          {LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => setActiveLevelFilter(lvl)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all whitespace-nowrap flex items-center gap-1.5 ${activeLevelFilter === lvl ? 'bg-lovelya-600 text-white shadow-md' : 'text-gray-400 hover:text-lovelya-500'}`}
            >
              {lvl}
              {MASTER_CURRICULUM.find(c => c.level === lvl)?.units.every(u => isUnitCompleted(u.id)) && (
                <i className="fas fa-check-circle text-[9px] text-white"></i>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'ROADMAP' ? (
        <AnimatePresence mode="wait">
        <motion.div key="roadmap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8 md:space-y-12">
          {filteredCurriculum.map((levelData, lvlIdx) => (
            <motion.section 
              key={levelData.level} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: lvlIdx * 0.1 }}
            >
              {/* Level Label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lovelya-600 to-indigo-700 flex items-center justify-center text-sm font-black text-white shadow-lg rotate-2 shrink-0">
                  {levelData.level}
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black text-gray-900 dark:text-white uppercase tracking-wide">Tier {levelData.level}</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{levelData.units.length} Modules</p>
                </div>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800 ml-2"></div>
              </div>

              {/* Units Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {levelData.units.map((unit) => {
                  const completed = isUnitCompleted(unit.id);
                  const stepsCompleted = unit.steps.filter(s => isStepCompleted(s.id)).length;
                  const totalSteps = unit.steps.length;
                  const progPct = totalSteps > 0 ? (stepsCompleted / totalSteps) * 100 : 0;

                  return (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={unit.id}
                      onClick={() => handleUnitClick(unit)}
                      className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-4 md:p-5 rounded-3xl border border-gray-100 dark:border-gray-700 text-left hover:border-lovelya-300 hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden shadow-sm"
                    >
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-lovelya-500/5 dark:bg-lovelya-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 h-1 bg-lovelya-500 transition-all duration-700 ease-out" style={{ width: `${progPct}%` }}></div>

                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm shadow-inner shrink-0 transition-all group-hover:rotate-6 duration-300 ${completed ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-900 border border-lovelya-100 dark:border-gray-700 text-lovelya-600'}`}>
                          {completed ? <i className="fas fa-check font-black text-[10px]"></i> : <span className="font-black text-xs">{unit.unitNumber}</span>}
                        </div>
                        {completed ? (
                          <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide">Mastered</span>
                        ) : stepsCompleted > 0 ? (
                          <span className="bg-lovelya-50 text-lovelya-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide">In Progress</span>
                        ) : (
                          <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide">{stepsCompleted}/{totalSteps}</span>
                        )}
                      </div>

                      <h4 className="text-xs md:text-sm font-black text-gray-900 dark:text-white mb-2 leading-snug group-hover:text-lovelya-600 transition-colors">
                        {unit.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-2 font-medium opacity-80">
                        {unit.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                        <div className="flex gap-1">
                          {unit.steps.slice(0, 5).map((step, i) => (
                            <div key={i} className={`w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] shadow-sm shrink-0 ${isStepCompleted(step.id) ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                              <i className={`fas ${step.type === 'context_bridge' ? 'fa-bookmark' :
                                step.moduleView === AppView.GRAMMAR ? 'fa-spell-check' :
                                  step.moduleView === AppView.READING ? 'fa-book-open' :
                                    step.moduleView === AppView.LISTENING ? 'fa-headphones' :
                                      'fa-microphone-alt'
                                }`}></i>
                            </div>
                          ))}
                        </div>
                        <div className="text-[9px] font-black text-lovelya-600 uppercase tracking-wide group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Open <i className="fas fa-chevron-right text-[8px]"></i>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key="library" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {renderLibrary()}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Context Bridge Reader Modal */}
      <AnimatePresence>
      {activeBridge && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-3 md:p-8">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[92vh] rounded-2xl md:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col border border-white/10">
            {/* Close Button */}
            <button
              onClick={() => setActiveBridge(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-xl flex items-center justify-center text-gray-500 hover:text-red-500 z-[120] shadow-lg transition hover:scale-110 active:scale-95"
            >
              <i className="fas fa-times text-sm"></i>
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8">
              <div className="max-w-full mx-auto space-y-5">
                {/* Header */}
                <div className="text-center pt-2">
                  <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">Thematic Insight</span>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white leading-tight">{activeBridge.unitTitle}</h2>
                  <div className="w-10 h-1 bg-lovelya-500 mx-auto mt-3 rounded-full"></div>
                </div>

                {/* Introduction */}
                <section className="bg-gray-50 dark:bg-gray-900/50 p-4 md:p-6 rounded-xl border-l-4 border-purple-500">
                  <p className="text-sm md:text-base font-serif italic text-gray-700 dark:text-gray-200 leading-relaxed">
                    "{activeBridge.introduction}"
                  </p>
                </section>

                {/* Context Insight */}
                <section className="space-y-3">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-lovelya-600 text-white flex items-center justify-center text-xs shadow-md"><i className="fas fa-lightbulb"></i></span>
                    Context Insight
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium opacity-90">
                    {activeBridge.thematicInsight}
                  </p>
                </section>

                {/* Grammar Connection */}
                <section className="bg-lovelya-50 dark:bg-lovelya-900/10 p-4 md:p-5 rounded-xl border-t-4 border-lovelya-400">
                  <h3 className="text-[10px] font-black text-lovelya-700 dark:text-lovelya-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-link"></i> Structural Logic
                  </h3>
                  <p className="text-sm text-lovelya-800 dark:text-lovelya-200 leading-relaxed font-bold">
                    {activeBridge.grammarConnection}
                  </p>
                </section>

                {/* CEFR & Pro Tips */}
                {(activeBridge.cefrFocus || activeBridge.proTips) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeBridge.cefrFocus && (
                      <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-[9px] font-black text-gray-700 dark:text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                          <i className="fas fa-certificate"></i> CEFR Competency
                        </h3>
                        <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                          {activeBridge.cefrFocus}
                        </p>
                      </section>
                    )}
                    {activeBridge.proTips && activeBridge.proTips.length > 0 && (
                      <section className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <h3 className="text-[9px] font-black text-indigo-700 dark:text-indigo-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                          <i className="fas fa-star"></i> Pro Tips
                        </h3>
                        <ul className="space-y-1.5">
                          {activeBridge.proTips.map((tip, i) => (
                            <li key={i} className="text-xs text-indigo-800 dark:text-indigo-200 flex gap-2">
                              <span className="text-indigo-400 shrink-0">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                )}

                {/* Detailed Explanation */}
                {activeBridge.detailedExplanation && (
                  <section className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xs font-black text-gray-700 dark:text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-book-open"></i> Mastery Insights
                    </h3>
                    <div className="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed">
                      {activeBridge.detailedExplanation}
                    </div>
                  </section>
                )}

                {/* Scenario */}
                <section className="space-y-3">
                  <h3 className="text-xs font-black text-gray-800 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-lovelya-500 text-white flex items-center justify-center text-[10px]"><i className="fas fa-comments"></i></span>
                    Contextual Scenario
                  </h3>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{activeBridge.scenarioTitle}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      {activeBridge.scenarioDialogue.map((line, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                          <span className="font-black text-lovelya-600 dark:text-lovelya-400 min-w-[70px] text-[9px] uppercase">{line.speaker}:</span>
                          <span className="text-gray-700 dark:text-gray-300 text-xs">{line.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Takeaway */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 text-center pb-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Key Takeaway</p>
                  <p className="text-sm font-bold text-lovelya-600 dark:text-lovelya-400">{activeBridge.keyTakeaway}</p>
                  <button
                    onClick={() => setActiveBridge(null)}
                    className="mt-5 w-full sm:w-auto px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-black shadow-lg hover:scale-105 transition active:scale-95 text-sm"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Unit Detail Modal */}
      <AnimatePresence>
      {selectedUnit && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-3 md:p-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white dark:bg-gray-800 w-full max-w-lg max-h-[92vh] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/10 dark:border-gray-700 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-br from-lovelya-700 via-lovelya-600 to-indigo-700 p-5 md:p-6 text-white relative shrink-0">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                    Level {selectedUnit.level} · Stage {selectedUnit.unitNumber}
                  </span>
                  <button onClick={() => setSelectedUnit(null)} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all hover:rotate-90 text-sm">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <h2 className="text-sm md:text-lg font-black mb-1.5 leading-tight">{selectedUnit.title}</h2>
                <p className="text-lovelya-100 text-[11px] font-medium leading-relaxed opacity-90 line-clamp-2">{selectedUnit.description}</p>
              </div>
            </div>

            {/* Steps List */}
            <div className="p-4 md:p-5 flex-1 overflow-hidden flex flex-col">
              <div className="mb-3 shrink-0">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Training Sequence</h4>
              </div>

              <div className="space-y-2.5 overflow-y-auto custom-scrollbar pr-1 flex-1 pb-4">
                {selectedUnit.steps.map((step, sIdx) => {
                  const stepCompleted = isStepCompleted(step.id);

                  return (
                    <div key={step.id} className="relative">
                      {/* Connector line */}
                      {sIdx < selectedUnit.steps.length - 1 && (
                        <div className={`absolute left-[1.1rem] top-10 bottom-0 w-0.5 -mb-1 z-0 ${stepCompleted ? 'bg-green-200 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}></div>
                      )}

                      <button
                        onClick={() => startStep(step)}
                        className={`
                                    relative z-10 w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 group/btn text-left
                                    ${stepCompleted
                            ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30'
                            : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-lovelya-400 hover:shadow-md active:scale-98'}
                                `}
                      >
                        <div className={`
                                    w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 shadow-sm transition-all duration-300
                                    ${stepCompleted ? 'bg-green-500 text-white' : 'bg-lovelya-100 dark:bg-lovelya-900/30 text-lovelya-600 group-hover/btn:scale-110'}
                                `}>
                          {stepCompleted ? <i className="fas fa-check text-xs font-black"></i> :
                            step.type === 'context_bridge' ? <i className="fas fa-bookmark"></i> :
                              step.moduleView === AppView.GRAMMAR ? <i className="fas fa-spell-check"></i> :
                                step.moduleView === AppView.READING ? <i className="fas fa-book-open"></i> :
                                  step.moduleView === AppView.LISTENING ? <i className="fas fa-headphones"></i> :
                                    <i className="fas fa-microphone-alt"></i>}
                        </div>

                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Step {sIdx + 1}</span>
                            {!stepCompleted && <span className="w-1.5 h-1.5 rounded-full bg-lovelya-500 animate-pulse"></span>}
                          </div>
                          <h5 className={`font-black text-sm leading-tight truncate ${stepCompleted ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                            {step.title}
                          </h5>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 line-clamp-1 opacity-70 italic">{step.goal}</p>
                        </div>

                        {!stepCompleted && (
                          <div className="w-7 h-7 rounded-lg bg-lovelya-600 text-white flex items-center justify-center shadow-md group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-all duration-200 shrink-0">
                            <i className="fas fa-play text-[9px] pl-0.5"></i>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 md:p-5 pt-0 flex gap-3 shrink-0 border-t border-gray-50 dark:border-gray-700">
              <button
                onClick={() => setSelectedUnit(null)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-black rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition text-xs uppercase tracking-widest"
              >
                Close
              </button>
              {!isUnitCompleted(selectedUnit.id) && (
                <button
                  onClick={() => {
                    completeRoadmapUnit(selectedUnit.id);
                    setProgress(getRoadmapProgress());
                    setSelectedUnit(null);
                  }}
                  className="flex-[2] py-2.5 bg-green-600 text-white font-black rounded-xl shadow-lg hover:bg-green-700 transition active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <i className="fas fa-medal"></i> Claim Mastery
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RoadmapModule;
