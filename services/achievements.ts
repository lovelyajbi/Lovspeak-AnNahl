import { UserProfile, ActivityLog } from '../types';
import { getUserProfile, saveUserProfile, getActivityLogs } from './storage';

// --- GAMIFICATION CONSTANTS ---
export const RANKS = [
    { minLevel: 1, maxLevel: 9, title: 'Novice Learner', color: 'from-emerald-400 to-green-600', icon: 'fa-seedling' },
    { minLevel: 10, maxLevel: 19, title: 'Bronze Scholar', color: 'from-amber-600 to-yellow-800', icon: 'fa-medal' },
    { minLevel: 20, maxLevel: 29, title: 'Silver Speaker', color: 'from-slate-300 to-gray-500', icon: 'fa-shield-halved' },
    { minLevel: 30, maxLevel: 39, title: 'Gold Orator', color: 'from-yellow-400 to-amber-600', icon: 'fa-trophy' },
    { minLevel: 40, maxLevel: 49, title: 'Diamond Linguist', color: 'from-cyan-300 to-blue-500', icon: 'fa-gem' },
    { minLevel: 50, maxLevel: 999, title: 'LovSpeak Legend', color: 'from-fuchsia-500 to-rose-600', icon: 'fa-crown' },
];

export interface BadgeTier {
    level: number;
    reqValue: number;
    name: string;
    description: string;
    color: string;
    icon?: string;
    animationClass?: string;
}

export interface BadgeSeriesDef {
    id: string;
    title: string;
    icon: string;
    reqType: 'activity_count' | 'streak' | 'reading_count' | 'ai_chat_count' | 'grammar_perfect' | 'level' | 'listening_count' | 'vocab_count';
    tiers: BadgeTier[];
}

export const BADGE_SERIES: BadgeSeriesDef[] = [
    {
        id: 'streak',
        title: 'Consistency Streak',
        icon: 'fa-fire',
        reqType: 'streak',
        tiers: [
            { level: 1, reqValue: 3, name: 'On Fire', description: 'Maintained a 3-day streak.', color: 'from-orange-100 to-orange-300 text-orange-700', icon: 'fa-fire' },
            { level: 2, reqValue: 7, name: 'Unstoppable', description: 'Maintained a 7-day streak.', color: 'from-orange-400 to-red-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]', icon: 'fa-fire-flame-curved' },
            { level: 3, reqValue: 30, name: 'Legendary Dedication', description: 'Maintained a 30-day streak.', color: 'from-red-500 via-orange-500 to-yellow-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)] border-2 border-yellow-300', icon: 'fa-meteor', animationClass: 'animate-badge-flame' }
        ]
    },
    {
        id: 'level',
        title: 'Gamification Rank',
        icon: 'fa-arrow-up-right-dots',
        reqType: 'level',
        tiers: [
            { level: 1, reqValue: 10, name: 'Bronze Ascent', description: 'Reached Gamification Level 10.', color: 'from-amber-600 to-amber-800 text-amber-100', icon: 'fa-medal' },
            { level: 2, reqValue: 20, name: 'Silver Climber', description: 'Reached Gamification Level 20.', color: 'from-slate-300 to-slate-500 text-white shadow-lg', icon: 'fa-shield-halved' },
            { level: 3, reqValue: 30, name: 'Gold Peak', description: 'Reached Gamification Level 30.', color: 'from-yellow-300 to-yellow-600 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.6)]', icon: 'fa-trophy', animationClass: 'animate-badge-glow' },
            { level: 4, reqValue: 50, name: 'Legend Status', description: 'Reached Gamification Level 50.', color: 'from-fuchsia-500 via-purple-600 to-rose-600 text-white shadow-[0_0_25px_rgba(217,70,239,0.8)] border-2 border-pink-300', icon: 'fa-crown', animationClass: 'animate-badge-float' }
        ]
    },
    {
        id: 'reading',
        title: 'The Bookworm',
        icon: 'fa-book-open-reader',
        reqType: 'reading_count',
        tiers: [
            { level: 1, reqValue: 10, name: 'Casual Reader', description: 'Completed 10 Reading tasks.', color: 'from-blue-100 to-blue-300 text-blue-800', icon: 'fa-book' },
            { level: 2, reqValue: 50, name: 'Avid Reader', description: 'Completed 50 Reading tasks.', color: 'from-indigo-300 to-indigo-500 text-white shadow-lg', icon: 'fa-book-open' },
            { level: 3, reqValue: 100, name: 'Literature Master', description: 'Completed 100 Reading tasks.', color: 'from-blue-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.7)]', icon: 'fa-book-journal-whills', animationClass: 'animate-badge-glow' }
        ]
    },
    {
        id: 'speaking',
        title: 'Confident Speaker',
        icon: 'fa-comments',
        reqType: 'ai_chat_count',
        tiers: [
            { level: 1, reqValue: 5, name: 'Ice Breaker', description: 'Spoke with AI Tutor 5 times.', color: 'from-rose-100 to-rose-300 text-rose-800', icon: 'fa-comment-dots' },
            { level: 2, reqValue: 20, name: 'Smooth Talker', description: 'Spoke with AI Tutor 20 times.', color: 'from-pink-400 to-rose-500 text-white shadow-lg', icon: 'fa-comments' },
            { level: 3, reqValue: 50, name: 'Native Orator', description: 'Spoke with AI Tutor 50 times.', color: 'from-rose-500 via-red-500 to-orange-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.7)]', icon: 'fa-bullhorn', animationClass: 'animate-badge-float' }
        ]
    },
    {
        id: 'grammar',
        title: 'Grammar Police',
        icon: 'fa-spell-check',
        reqType: 'grammar_perfect',
        tiers: [
            { level: 1, reqValue: 3, name: 'Syntax Novice', description: 'Got 100% accuracy in Grammar Strike 3 times.', color: 'from-emerald-100 to-emerald-300 text-emerald-800', icon: 'fa-spell-check' },
            { level: 2, reqValue: 10, name: 'Grammar Checker', description: 'Got 100% accuracy in Grammar Strike 10 times.', color: 'from-teal-400 to-emerald-500 text-white shadow-lg', icon: 'fa-check-double' },
            { level: 3, reqValue: 30, name: 'Linguistic Judge', description: 'Got 100% accuracy in Grammar Strike 30 times.', color: 'from-emerald-400 via-green-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)]', icon: 'fa-scale-balanced', animationClass: 'animate-badge-glow' }
        ]
    },
    {
        id: 'listening',
        title: 'Keen Listener',
        icon: 'fa-headphones',
        reqType: 'listening_count',
        tiers: [
            { level: 1, reqValue: 5, name: 'Attentive Ear', description: 'Completed 5 Listening tasks.', color: 'from-violet-100 to-violet-300 text-violet-800', icon: 'fa-ear-listen' },
            { level: 2, reqValue: 20, name: 'Sound Catcher', description: 'Completed 20 Listening tasks.', color: 'from-purple-400 to-fuchsia-500 text-white shadow-lg', icon: 'fa-headphones-simple' },
            { level: 3, reqValue: 50, name: 'Acoustic Master', description: 'Completed 50 Listening tasks.', color: 'from-violet-500 via-purple-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.7)]', icon: 'fa-volume-high', animationClass: 'animate-badge-float' }
        ]
    },
    {
        id: 'activity',
        title: 'Busy Bee',
        icon: 'fa-bolt',
        reqType: 'activity_count',
        tiers: [
            { level: 1, reqValue: 10, name: 'Warming Up', description: 'Completed 10 total activities.', color: 'from-orange-200 to-orange-400 text-orange-900', icon: 'fa-battery-quarter' },
            { level: 2, reqValue: 50, name: 'Active Learner', description: 'Completed 50 total activities.', color: 'from-orange-500 to-red-500 text-white shadow-lg', icon: 'fa-battery-half' },
            { level: 3, reqValue: 200, name: 'Relentless Worker', description: 'Completed 200 total activities.', color: 'from-orange-500 via-red-600 to-rose-700 text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] border-2 border-red-300', icon: 'fa-battery-full', animationClass: 'animate-badge-flame' }
        ]
    },
    {
        id: 'vocab',
        title: 'Vocabulary Master',
        icon: 'fa-book',
        reqType: 'vocab_count',
        tiers: [
            { level: 1, reqValue: 10, name: 'Word Collector', description: 'Saved 10 words to Vocabulary.', color: 'from-cyan-100 to-cyan-300 text-cyan-800', icon: 'fa-tag' },
            { level: 2, reqValue: 50, name: 'Walking Dictionary', description: 'Saved 50 words to Vocabulary.', color: 'from-sky-400 to-blue-500 text-white shadow-lg', icon: 'fa-tags' },
            { level: 3, reqValue: 200, name: 'Human Lexicon', description: 'Saved 200 words to Vocabulary.', color: 'from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(56,189,248,0.7)]', icon: 'fa-layer-group', animationClass: 'animate-badge-glow' }
        ]
    }
];

// --- CORE XP LOGIC ---
export const calculateXPForLevel = (level: number): number => {
    // Formula: (Level * Level) * 50
    return Math.floor(level * level * 50);
};

export const calculateLevelFromXP = (xp: number): number => {
    // Inverse formula: sqrt(XP / 50)
    let level = Math.floor(Math.sqrt(xp / 50));
    return level < 1 ? 1 : level;
};

export const getGamificationStats = (xp: number) => {
    const currentLevel = calculateLevelFromXP(xp);
    const xpForCurrentLevel = calculateXPForLevel(currentLevel);
    const xpForNextLevel = calculateXPForLevel(currentLevel + 1);
    
    // Progress calculation
    const xpIntoLevel = xp - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = Math.min(100, Math.max(0, (xpIntoLevel / xpNeededForLevel) * 100));

    const rank = RANKS.find(r => currentLevel >= r.minLevel && currentLevel <= r.maxLevel) || RANKS[0];

    return {
        level: currentLevel,
        rankTitle: rank.title,
        rankColor: rank.color,
        rankIcon: rank.icon,
        xpIntoLevel,
        xpNeededForLevel,
        progressPercent,
        nextLevelXP: xpForNextLevel
    };
};

// --- BADGE EVALUATION LOGIC ---
export const checkAndUnlockBadges = (profile: UserProfile, logs: ActivityLog[], vocabCount: number = 0) => {
    const currentLevel = calculateLevelFromXP(profile.xp);
    
    let readingCount = 0;
    let aiChatCount = 0;
    let grammarPerfect = 0;
    let listeningCount = 0;
    
    const uniqueDays = new Set(logs.map(l => new Date(l.date).toDateString()));
    const streakDays = uniqueDays.size;

    logs.forEach(log => {
        if (log.type === 'READING') readingCount++;
        if (log.type === 'LISTENING') listeningCount++;
        if (log.type === 'CHAT') aiChatCount++;
        if (log.type === 'GAMES' && log.details?.includes('Grammar Strike') && log.accuracy === 100) grammarPerfect++;
    });

    // Returns an object mapping seriesId -> highest achieved tier level (0 if none)
    const unlockedSeries: Record<string, number> = {};

    BADGE_SERIES.forEach(series => {
        let highestTier = 0;
        let currentValue = 0;

        switch (series.reqType) {
            case 'activity_count': currentValue = logs.length; break;
            case 'streak': currentValue = streakDays; break;
            case 'reading_count': currentValue = readingCount; break;
            case 'listening_count': currentValue = listeningCount; break;
            case 'ai_chat_count': currentValue = aiChatCount; break;
            case 'grammar_perfect': currentValue = grammarPerfect; break;
            case 'level': currentValue = currentLevel; break;
            case 'vocab_count': currentValue = vocabCount; break;
        }

        series.tiers.forEach(tier => {
            if (currentValue >= tier.reqValue) {
                highestTier = tier.level;
            }
        });

        unlockedSeries[series.id] = highestTier;
    });

    return { unlockedSeries, stats: { readingCount, aiChatCount, grammarPerfect, streakDays, totalActivities: logs.length } };
};

// --- XP DISPATCHER ---
// Helper function to add XP and return if user leveled up
export const awardXP = (amount: number, reason: string): { leveledUp: boolean, newLevel: number } => {
    const profile = getUserProfile();
    const oldLevel = calculateLevelFromXP(profile.xp);
    
    profile.xp += amount;
    saveUserProfile(profile);

    const newLevel = calculateLevelFromXP(profile.xp);
    const leveledUp = newLevel > oldLevel;

    // You could trigger a global event here if you want toast notifications

    return { leveledUp, newLevel };
};
