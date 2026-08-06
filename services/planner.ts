
import { AppView, DailyTask, Level } from '../types';
import { VOCAB_CATEGORIES, INTENSITY_GOALS, THEMES } from '../constants';
import { GRAMMAR_LESSONS } from '../data/grammarLessons';
import { SHADOWING_DATA } from '../src/constants/shadowingData';
import { STATIC_VOCAB } from '../data/vocabWords';
import { READING_MANIFEST } from '../data/readingManifest';
import { LISTENING_MANIFEST } from '../data/listeningManifest';

// --- LOGICAL PROGRESSION CURRICULUM (30 Days per Level) ---
// This ensures basic topics come first and increase in complexity.
const PROGRESSIVE_CURRICULUM: Record<string, string[]> = {
  'A1': [
    'Greetings & Basics', 'Introducing Yourself', 'Numbers & Time', 'Colors & Objects',
    'Family Members', 'Describing People', 'My Home', 'Daily Routines',
    'Food & Drinks', 'Ordering at a Cafe', 'Fruit & Vegetables', 'Daily Activities',
    'Hobbies & Fun', 'Sports & Health', 'Days & Months', 'Weather Basics',
    'Transport & Travel', 'In the City', 'Shopping for Clothes', 'Body Parts',
    'Feelings & Emotions', 'Animal Friends', 'School & Education', 'Simple Jobs',
    'Islamic Greetings', 'Mosque Manners', 'Giving Thanks', 'Kindness to Parents',
    'Weekly Review 1', 'Final Level Practice'
  ],
  'A2': [
    'Past Experiences', 'Childhood Memories', 'Weekend Activities', 'Future Intentions',
    'Health Problems', 'Healthy Lifestyle', 'Dream Jobs', 'Work Environment',
    'Planning a Trip', 'At the Airport', 'Hotel & Accommodation', 'Sightseeing',
    'Modern Technology', 'Social Media Use', 'Traditional Markets', 'Cooking & Recipes',
    'Education Systems', 'Learning Languages', 'Environmental Issues', 'Recycling',
    'Media & News', 'Pop Culture', 'Festivals & Celebrations', 'Community Service',
    'Islamic History Basics', 'Halal Lifestyle', 'Prophetic Character', 'Gratitude in Hardship',
    'Monthly Review', 'Progress Assessment'
  ],
  'B1': [
    'Environment & Nature', 'Modern Technology', 'Culture & Customs', 'Social Media Impact',
    'Career Planning', 'Workplace Ethics', 'Money Management', 'Travel Adventures',
    'Relationships', 'Health & Wellness', 'Public Services', 'Shopping Habits',
    'Entertainment Industry', 'Art & Creativity', 'Science in Daily Life', 'Current Affairs',
    'Historical Figures', 'Future Cities', 'Education Trends', 'Community Issues',
    'Islamic Arts', 'Halal Travel', 'Charity in Islam', 'Balance in Life',
    'Critical Thinking', 'Problem Solving', 'Public Speaking', 'Collaborative Work',
    'B1 Level Review', 'Mid-Term Assessment'
  ],
  'B2': [
    'Global Economy', 'Artificial Intelligence', 'Media Literacy', 'Psychology Basics',
    'Political Systems', 'Environmental Policies', 'Sociological Trends', 'Innovation',
    'Business Strategy', 'Entrepreneurship', 'Corporate Culture', 'Marketing & Ads',
    'Literature Analysis', 'Scientific Logic', 'Ethics & Morality', 'Human Rights',
    'Sustainable Living', 'Urban Development', 'Scientific Breakthroughs', 'Space Exploration',
    'Geopolitics', 'International Law', 'Cultural Diplomacy', 'Religious Tolerance',
    'Interfaith Dialogue', 'Islamic Economy', 'Digital Dawah', 'Mental Health in Islam',
    'Advanced Review', 'Proficiency Test'
  ],
  'C1': [
    'Epistemology', 'Linguistic Theory', 'Socio-Political Analysis', 'Advanced Macroeconomics',
    'Cognitive Science', 'Quantum Mechanics Intro', 'Existential Literature', 'Post-Modernism',
    'Corporate Governance', 'Strategic Diplomacy', 'Global Security', 'Cybernetics',
    'Bioethics', 'Environmental Law', 'Historical Revisionism', 'Cultural Anthropology',
    'Semiotics', 'Rhetoric & Persuasion', 'Aesthetics', 'Neuroscience Basics',
    'Tawheed & Aqeedah', 'Ijtihad & Innovation', 'Contemporary Fiqh Issues', 'Islamic Psychology',
    'Complex Systems', 'Game Theory', 'Crisis Management', 'Academic Writing',
    'C1 Mastery Review', 'Expert Level Evaluation'
  ],
  'C2': [
    'Ontological Debates', 'String Theory Concepts', 'Global Hegemony', 'Post-Structuralism',
    'Neuroplasticity', 'Astrobiology Ethics', 'Comparative Theology', 'Metaphysics',
    'Algorithmic Governance', 'Geopolitical Strategy', 'Transhumanism', 'Deep Ecology',
    'Linguistic Relativity', 'Behavioral Economics', 'Diplomatic Protocol', 'Principles of Jurisprudence',
    'Advanced Aesthetics', 'Technological Singularity', 'Universal Ethics', 'Space Law',
    'Islamic Metaphysics', 'Revivalist Movements', 'The Future of Ummah', 'Spiritual Intelligence',
    'Abstract Synthesis', 'Dialectical Reasoning', 'Master Thesis Prep', 'Professional Debating',
    'Total Mastery Review', 'Grand Final Certification'
  ]
};

/**
 * HELPER: Pick up to `count` distinct items from a pool, rotating by day so the
 * selection varies but stays deterministic for a given day/offset.
 */
function pickDistinctItems<T>(pool: T[], count: number, startIndex: number): T[] {
  if (pool.length === 0 || count <= 0) return [];
  const n = Math.min(count, pool.length);
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    result.push(pool[(startIndex + i) % pool.length]);
  }
  return result;
}

/**
 * HELPER: Find the most relevant item from a list based on keywords in the theme
 */
function findBestMatch<T>(theme: string, items: T[], getTitle: (item: T) => string): T | null {
  if (!items.length) return null;
  const themeWords = theme.toLowerCase().split(/\s+/);
  
  // 1. Direct Keyword Match
  for (const word of themeWords) {
    if (word.length < 4) continue;
    const match = items.find(item => getTitle(item).toLowerCase().includes(word));
    if (match) return match;
  }
  
  // 2. Fallback: Sequential pick based on hash (consistent for the day)
  const hash = theme.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return items[hash % items.length];
}

export const generateDailyTasks = (
  targetIds: string[], 
  intensityId: string, 
  level: Level,
  dateOverride?: Date,
  planStartDate?: string
): DailyTask[] => {
  const tasks: DailyTask[] = [];
  
  // 1. Determine Daily Theme based on Progression (1-30 days cycle)
  const today = dateOverride || new Date();
  const curriculum = PROGRESSIVE_CURRICULUM[level] || PROGRESSIVE_CURRICULUM['A1'];
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const normalizedPlanStart = planStartDate ? new Date(`${planStartDate}T00:00:00`) : null;
  const relativePlanDay =
    normalizedPlanStart && !Number.isNaN(normalizedPlanStart.getTime())
      ? Math.max(0, Math.floor((normalizedToday.getTime() - normalizedPlanStart.getTime()) / 86400000))
      : Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyTheme = curriculum[relativePlanDay % curriculum.length];
  const taskDateKey = today.toISOString().split('T')[0];

  const hasIslamic = targetIds.includes('islamic');

  // --- INTENSITY-SCALED GOALS ---
  const goals = INTENSITY_GOALS[intensityId] || INTENSITY_GOALS['regular'];

  // --- SMART DATABASE MATCHING ---
  
  // Match Grammar
  const levelGrammar = GRAMMAR_LESSONS.filter(l => l.level === level);
  const todaysGrammar = findBestMatch(dailyTheme, levelGrammar, l => l.title);

  // Match today's theme to one of the 14 static content themes (same keyword-match helper as everything else above)
  const matchedTheme = findBestMatch(dailyTheme, THEMES, t => t.name) || THEMES.find(t => t.id === 'daily') || THEMES[0];

  // Match Reading — pick `goals.readingCount` DISTINCT static items (588-item library) for today's
  // level+theme, rotating through the pool by day so multi-count tasks (regular=2, intensive=3)
  // each get their own real title instead of repeating the same one.
  const readingPoolForTheme = READING_MANIFEST.filter(r => r.level === level && r.themeId === matchedTheme.id);
  const readingItems = pickDistinctItems(readingPoolForTheme, goals.readingCount, relativePlanDay);
  const primaryReadingItem = readingItems[0] || null;

  // Match Listening — same idea, offset by 3 so it doesn't always line up with the Reading pick from the same theme
  const listeningPoolForTheme = LISTENING_MANIFEST.filter(l => l.level === level && l.themeId === matchedTheme.id);
  const listeningItems = pickDistinctItems(listeningPoolForTheme, goals.listeningCount, relativePlanDay + 3);
  const primaryListeningItem = listeningItems[0] || null;

  // Rotate through all four real Shadowing entry points. The selection is
  // deterministic for a plan day, so reopening a task never changes it.
  const shadowingModes = ['daily', 'idioms', 'slang', 'roleplay'] as const;
  const shadowingMode = shadowingModes[relativePlanDay % shadowingModes.length];
  const preferredShadowSubcategory = hasIslamic ? 'Islamic' : 'General';
  const shadowDifficulty = level === 'A1' || level === 'A2'
    ? new Set(['Easy'])
    : level === 'B1'
      ? new Set(['Easy', 'Medium'])
      : new Set(['Medium', 'Hard']);
  const getShadowingMainCategory = (theme: typeof SHADOWING_DATA[number]) => {
    if (theme.mainCategory) return theme.mainCategory;
    if (theme.category === 'Idioms & Slang') return 'Idioms';
    if (theme.category === 'Slang') return 'Slang';
    return 'Daily Conversations';
  };
  const getShadowingSubcategory = (theme: typeof SHADOWING_DATA[number]) =>
    theme.subCategory || (theme.category === 'Islamic' ? 'Islamic' : 'General');
  const modeCategory: Record<Exclude<typeof shadowingMode, 'roleplay'>, string> = {
    daily: 'Daily Conversations',
    idioms: 'Idioms',
    slang: 'Slang'
  };
  const shadowThemes = shadowingMode === 'roleplay'
    ? []
    : SHADOWING_DATA.filter(theme =>
      getShadowingMainCategory(theme) === modeCategory[shadowingMode]
      && getShadowingSubcategory(theme) === preferredShadowSubcategory
    );
  const allShadowTasks = shadowThemes.flatMap(theme => theme.tasks
    .filter(task => shadowDifficulty.has(task.difficulty))
    .map(task => ({ ...task, themeTitle: theme.title })));
  const usableShadowTasks = allShadowTasks.length > 0
    ? allShadowTasks
    : SHADOWING_DATA.flatMap(theme => theme.tasks.map(task => ({ ...task, themeTitle: theme.title })));
  const pickedShadowSentences = shadowingMode === 'roleplay'
    ? []
    : pickDistinctItems(usableShadowTasks, goals.shadowingSentences, relativePlanDay);
  const shadowSentenceIds = pickedShadowSentences.map(s => s.id);
  const primaryShadow = pickedShadowSentences[0];

  // Match Vocab Category & Pick words based on intensity
  const todaysVocabCat = findBestMatch(dailyTheme, VOCAB_CATEGORIES, c => c);
  const vocabInCategory = STATIC_VOCAB.filter(v => v.category === todaysVocabCat);
  const shuffledVocab = [...vocabInCategory].sort(() => 0.5 - Math.random());
  const pickedWords = shuffledVocab.slice(0, goals.vocabCount);
  const pickedWordIds = pickedWords.map(w => w.id);
  const wordNames = pickedWords.slice(0, 4).map(w => w.english).join(', ') + (pickedWords.length > 4 ? ` +${pickedWords.length - 4} more` : '');

  // Generate listening topic titles based on intensity — varied perspectives
  const subtopicAngles = ['in Daily Life', 'Tips & Advice', 'Common Mistakes', 'Real Experiences', 'Expert Insights', 'Practical Guide'];
  const listeningTopics = Array.from({ length: goals.listeningCount }, (_, i) => {
    return i === 0 ? dailyTheme : `${dailyTheme}: ${subtopicAngles[i % subtopicAngles.length]}`;
  });

  // 2. Number of tasks based on intensity
  let minTasks = 4;
  let maxTasks = 5;
  if (intensityId === 'intensive') { minTasks = 5; maxTasks = 7; }
  if (intensityId === 'casual') { minTasks = 3; maxTasks = 4; }
  const taskCount = Math.floor(Math.random() * (maxTasks - minTasks + 1)) + minTasks;

  // 3. Pool of Potential Tasks (Intensity-Scaled)
  const themeTasksPool = [
    { 
      moduleView: AppView.VOCAB, icon: 'fa-shapes', 
      title: `Vocab: ${dailyTheme}`, 
      description: `Learn ${goals.vocabCount} words: ${wordNames}`, 
      vocabCategory: todaysVocabCat, vocabWordIds: pickedWordIds, 
      minScore: 100, xpReward: goals.xpPerTask, intensityId
    },
    
    readingItems.length > 0
      ? {
          moduleView: AppView.READING, icon: 'fa-book-reader',
          title: readingItems.length > 1 ? `Reading: ${readingItems.length} Articles on ${matchedTheme.name}` : `Reading: ${primaryReadingItem!.title}`,
          description: readingItems.length > 1
            ? `Complete ${readingItems.length} readings on ${matchedTheme.name}: ${readingItems.map(it => it.title).join(', ')}`
            : `A ${level} reading on ${matchedTheme.name}`,
          targetLessonId: primaryReadingItem!.id,
          readingItemIds: readingItems.length > 1 ? readingItems.map(it => it.id) : undefined,
          minScore: 85, xpReward: goals.xpPerTask, intensityId
        }
      : {
          moduleView: AppView.READING, icon: 'fa-book-reader',
          title: `Reading: ${dailyTheme}`,
          description: `Level ${level} reading: ${goals.readingCount} article${goals.readingCount > 1 ? 's' : ''}`,
          minScore: 85, xpReward: goals.xpPerTask, intensityId
        },

    listeningItems.length > 0
      ? {
          moduleView: AppView.LISTENING, icon: 'fa-headphones',
          title: listeningItems.length > 1 ? `Listening: ${listeningItems.length} Topics on ${matchedTheme.name}` : `Listening: ${primaryListeningItem!.title}`,
          description: listeningItems.length > 1
            ? `Complete ${listeningItems.length} listening exercises on ${matchedTheme.name}: ${listeningItems.map(it => it.title).join(', ')}`
            : `A ${level} listening ${primaryListeningItem!.type} on ${matchedTheme.name}`,
          targetLessonId: primaryListeningItem!.id,
          listeningItemIds: listeningItems.length > 1 ? listeningItems.map(it => it.id) : undefined,
          minScore: 80, xpReward: goals.xpPerTask, intensityId
        }
      : {
          moduleView: AppView.LISTENING, icon: 'fa-headphones',
          title: `Listening: ${dailyTheme}`,
          description: `${goals.listeningCount} listening exercise${goals.listeningCount > 1 ? 's' : ''} for ${level} level`,
          listeningTopics,
          minScore: 80, xpReward: goals.xpPerTask, intensityId
        },
    
    todaysGrammar
      ? { 
          moduleView: AppView.GRAMMAR, icon: 'fa-spell-check', 
          title: `Grammar: ${todaysGrammar.title.split('.')[1]?.trim() || todaysGrammar.title}`, 
          description: `Structure training: ${todaysGrammar.title}`, 
          targetLessonId: todaysGrammar.id, 
          minScore: 80, xpReward: goals.xpPerTask, intensityId
        }
      : { 
          moduleView: AppView.GRAMMAR, icon: 'fa-spell-check', 
          title: `Grammar: ${dailyTheme}`, 
          description: `AI grammar training for ${level} level`,
          minScore: 80, xpReward: goals.xpPerTask, intensityId
        },
      
    { 
      moduleView: AppView.LIVE, icon: 'fa-microphone-alt', 
      title: `Speaking: ${dailyTheme}`, 
      description: `${goals.speakingMinutes} min guided conversation on ${dailyTheme}`,
      goalMinutes: goals.speakingMinutes,
      minScore: 80, xpReward: goals.xpPerTask, intensityId
    },
    
    shadowingMode === 'roleplay'
      ? {
          moduleView: AppView.SHADOWING, icon: 'fa-masks-theater',
          title: 'Shadow: Dialogue Roleplay',
          description: `Complete a guided roleplay. Goal: ${goals.minShadowingScore}% average score.`,
          shadowingMode: 'roleplay' as const,
          shadowingTheme: dailyTheme,
          minScore: goals.minShadowingScore, xpReward: goals.xpPerTask, intensityId
        }
      : primaryShadow
      ? {
          moduleView: AppView.SHADOWING, icon: 'fa-wave-square', 
          title: `Shadow: ${primaryShadow.themeTitle || dailyTheme}`, 
          description: `${goals.shadowingSentences} sentences, min score ${goals.minShadowingScore}%`,
          shadowingTaskId: primaryShadow.id, shadowingSentenceIds: shadowSentenceIds, shadowingMode,
          shadowingTheme: dailyTheme,
          minScore: goals.minShadowingScore, xpReward: goals.xpPerTask, intensityId
        }
      : { 
          moduleView: AppView.SHADOWING, icon: 'fa-wave-square', 
          title: `Shadow: ${dailyTheme}`, 
          description: `${goals.shadowingSentences} sentences about ${dailyTheme}`,
          shadowingMode,
          shadowingTheme: dailyTheme,
          minScore: goals.minShadowingScore, xpReward: goals.xpPerTask, intensityId
        }
  ];

  // 4. Selection Logic
  const selectedTasks: any[] = [];
  const usedModules = new Set<AppView>();

  const targetModuleMap: Record<string, AppView[]> = {
    'speaking': [AppView.LIVE, AppView.SHADOWING],
    'grammar': [AppView.GRAMMAR],
    'vocab': [AppView.VOCAB],
    'listening': [AppView.LISTENING],
    'writing': [AppView.GRAMMAR],
    'pronunciation': [AppView.SHADOWING]
  };

  targetIds.forEach(tid => {
    const matchingViews = targetModuleMap[tid];
    if (matchingViews) {
      const task = themeTasksPool.find(t => matchingViews.includes(t.moduleView) && !usedModules.has(t.moduleView));
      if (task) {
        selectedTasks.push(task);
        usedModules.add(task.moduleView);
      }
    }
  });

  const remainingPool = themeTasksPool.filter(t => !usedModules.has(t.moduleView)).sort(() => 0.5 - Math.random());
  for (const task of remainingPool) {
    if (selectedTasks.length >= taskCount) break;
    selectedTasks.push(task);
    usedModules.add(task.moduleView);
  }

  // Final Order: Prep -> Input -> Analysis -> Production
  const moduleOrder = [AppView.VOCAB, AppView.READING, AppView.LISTENING, AppView.GRAMMAR, AppView.SHADOWING, AppView.LIVE];
  selectedTasks.sort((a, b) => moduleOrder.indexOf(a.moduleView) - moduleOrder.indexOf(b.moduleView));

  selectedTasks.forEach((t, i) => {
    tasks.push({
      id: `task-${taskDateKey}-${level}-${relativePlanDay + 1}-${t.moduleView}-${i}`,
      title: t.title,
      description: t.description,
      moduleView: t.moduleView,
      icon: t.icon,
      isCompleted: false,
      targetLessonId: t.targetLessonId,
      shadowingTaskId: t.shadowingTaskId,
      shadowingSentenceIds: t.shadowingSentenceIds,
      shadowingMode: t.shadowingMode,
      shadowingTheme: t.shadowingTheme,
      shadowingScenarioId: t.shadowingScenarioId,
      shadowingRole: t.shadowingRole,
      bridgeId: t.bridgeId,
      bridgeIds: t.bridgeIds,
      vocabWordIds: t.vocabWordIds,
      listeningTopics: t.listeningTopics,
      readingItemIds: t.readingItemIds,
      listeningItemIds: t.listeningItemIds,
      goalMinutes: t.goalMinutes,
      minScore: t.minScore,
      xpReward: t.xpReward,
      intensityId: t.intensityId,
      level: level
    });
  });

  return tasks;
};

// --- (generate30DayPlanCSV and generateGoogleCalendarUrl remain similar but updated with progressive logic) ---
export const generate30DayPlanCSV = (targetIds: string[], intensityId: string, level: Level): string => {
  let csvContent = "Task Name,Date,Skill,Difficulty,Estimated Time,Status\n";
  let difficulty = ['A1', 'A2'].includes(level) ? 'Easy' : (['C1', 'C2'].includes(level) ? 'Hard' : 'Medium');
  let estimatedTime = intensityId === 'casual' ? '10' : (intensityId === 'intensive' ? '45' : '20');
  const today = new Date();
  const startDateKey = today.toISOString().split('T')[0];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    const dailyTasks = generateDailyTasks(targetIds, intensityId, level, date, startDateKey);

    dailyTasks.forEach(task => {
        let skill = task.moduleView.toString();
        csvContent += `"${task.title}",${dateString},${skill},${difficulty},${estimatedTime},Not Started\n`;
    });
  }
  return csvContent;
};

export const generateGoogleCalendarUrl = (intensityId: string): string => {
    const title = encodeURIComponent("LovSpeak English Practice");
    const details = encodeURIComponent("Daily English learning session with LovSpeak AI.");
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(20, 0, 0, 0); 
    const end = new Date(start);
    const durationMin = intensityId === 'casual' ? 15 : intensityId === 'intensive' ? 60 : 30;
    end.setMinutes(end.getMinutes() + durationMin);
    const formatGCalTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const recur = encodeURIComponent("RRULE:FREQ=DAILY;COUNT=30");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${formatGCalTime(start)}/${formatGCalTime(end)}&recur=${recur}`;
};
