
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, ActivityLog, Badge, AppView } from '../types';
import { BADGE_DEFINITIONS, ISLAMIC_QUOTES, XP_THRESHOLDS, AVATAR_ICONS } from '../constants';
import {
    getUserProfile, saveUserProfile, getActivityLogs,
    exportFullSystemBackup, importFullSystemBackup, getVocab,
    getGameProgress, getAppLanguage, setAppLanguage
} from '../services/storage';
import { generateWeeklyInsight } from '../services/gemini';
import { audioService } from '../services/audioService';
import { useAuth } from '../src/contexts/AuthContext';
import { getGamificationStats, checkAndUnlockBadges, BADGE_SERIES, RANKS } from '../services/achievements';

// Types for Analytics
type TimeFilter = 'today' | 'week' | 'month';
type MetricType = 'score' | 'accuracy' | 'duration' | 'attempts';
type ChartType = 'bar' | 'donut';

interface ModuleStat {
    module: string;
    totalScore: number;
    totalAccuracy: number;
    totalDuration: number;
    attempts: number;
    avgScore: number;
    avgAccuracy: number;
}

interface ChartDataPoint {
    label: string;
    value: number;
    colorClass: string;
}

/**
 * INTENTIONAL DESIGN DECISION — NOT A BUG:
 * The "Speaking" category in performance analytics aggregates data from
 * AppView.SHADOWING (Shadowing module), NOT from AppView.LIVE (Live Practice).
 * 
 * Reason: Live Practice is a free-form conversation module that does not produce
 * scored results (score/accuracy). Shadowing, on the other hand, evaluates
 * pronunciation accuracy and produces meaningful scores. Therefore, Shadowing
 * scores are used as the Speaking performance metric.
 *
 * The mapping is done in `getLogsByTime()` which remaps SHADOWING logs to LIVE
 * so they appear under "Speaking" in all charts and analytics.
 *
 * See also: `normalizeLogType()` helper below.
 */
const MODULE_LABELS: Record<string, string> = {
    [AppView.READING]: 'Reading',
    [AppView.LISTENING]: 'Listening',
    [AppView.GRAMMAR]: 'Grammar',
    [AppView.LIVE]: 'Speaking',
};

const MODULE_COLORS: Record<string, string> = {
    [AppView.READING]: 'bg-blue-500',
    [AppView.LISTENING]: 'bg-purple-500',
    [AppView.GRAMMAR]: 'bg-indigo-500',
    [AppView.LIVE]: 'bg-rose-500',
};

// Hex Colors for SVG Charts
const CHART_HEX_COLORS: Record<string, string> = {
    [AppView.READING]: '#3b82f6', // Blue
    [AppView.LISTENING]: '#a855f7', // Purple
    [AppView.GRAMMAR]: '#6366f1', // Indigo
    [AppView.LIVE]: '#f43f5e', // Rose
};

// Text color mapping for charts
const TEXT_COLORS: Record<string, string> = {
    [AppView.READING]: 'text-blue-500',
    [AppView.LISTENING]: 'text-purple-500',
    [AppView.GRAMMAR]: 'text-indigo-500',
    [AppView.LIVE]: 'text-rose-500',
};

// --- HELPERS (Moved Out) ---

const getBadgeSeriesKey = (id: string) => {
    return id.split('_')[0];
};

const getBadgeSeriesLabel = (key: string) => {
    const labels: Record<string, string> = {
        scholar: 'Learning Scholar',
        streak: 'Consistency Streak',
        vocab: 'Vocabulary Master',
        acc: 'Accuracy Sharpshooter',
        islamic: 'Islamic Studies',
        time: 'Time Management',
        dedication: 'XP Dedication',
        topic: 'Topic Explorer',
        game: 'Game Mastery'
    };
    return labels[key] || 'Achievement';
};

const getTierColor = (tier: string) => {
    switch (tier) {
        case 'bronze': return 'from-orange-100 to-orange-300 text-orange-800 border-orange-200';
        case 'silver': return 'from-slate-100 to-slate-300 text-slate-800 border-slate-200';
        case 'gold': return 'from-yellow-100 to-yellow-300 text-yellow-800 border-yellow-200';
        case 'platinum': return 'from-cyan-100 to-cyan-300 text-cyan-800 border-cyan-200';
        default: return 'from-gray-100 to-gray-200 text-gray-500 border-gray-200';
    }
};

const getMaxValue = (dataSet: { value: number }[], metric: MetricType) => {
    if (metric === 'score' || metric === 'accuracy') return 100;
    const max = Math.max(...dataSet.map(s => s.value));
    return max === 0 ? 10 : Math.ceil(max * 1.2);
};

const formatCardDuration = (seconds: number) => {
    if (!seconds) return '0m';
    const m = Math.round(seconds / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
};

const KEY_QUOTE_DATA = 'lovelya_quote_data';
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;

// --- EXTERNAL CHART COMPONENTS ---

const AreaChart = ({ data, metric, moduleId }: { data: ChartDataPoint[], metric: MetricType, moduleId: string }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
    }, [data]);

    const height = isMobile ? 160 : 260;
    const paddingX = isMobile ? 35 : 50;
    const paddingY = isMobile ? 25 : 35;

    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const minPointWidth = isMobile ? 48 : 80;
    const displayCount = Math.max(data.length, 12);
    const contentWidth = Math.max(containerWidth - (isMobile ? 40 : 100), displayCount * minPointWidth);
    const pointSpacing = (contentWidth - (paddingX * 2)) / (displayCount - 1 || 1);
    const maxVal = getMaxValue(data, metric);

    const getY = (val: number) => {
        const usableHeight = height - (paddingY * 2);
        return height - paddingY - (val / maxVal) * usableHeight;
    };
    const getX = (index: number) => paddingX + (index * pointSpacing);

    const getCurve = (i: number, pts: ChartDataPoint[]) => {
        const x = getX(i), y = getY(pts[i].value);
        if (i === 0) return `M ${x} ${y}`;
        const prevX = getX(i - 1), prevY = getY(pts[i - 1].value);
        const cp1x = prevX + (x - prevX) * 0.4, cp2x = prevX + (x - prevX) * 0.6;
        return `C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
    };

    if (data.length === 0) return <div className="h-full flex items-center justify-center text-gray-400 text-sm">No Data Available</div>;

    let pathD = getCurve(0, data);
    for (let i = 1; i < data.length; i++) pathD += ` ${getCurve(i, data)}`;
    const areaD = `${pathD} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;
    const hexColor = CHART_HEX_COLORS[moduleId] || '#3b82f6';
    const uid = `chart-${moduleId}-${data.length}`;

    const metricUnit = metric === 'score' || metric === 'accuracy' ? '%' : metric === 'duration' ? 'm' : '';

    return (
        <div className="w-full h-full overflow-x-auto custom-scrollbar relative">
            <svg width={contentWidth} height={height} className="overflow-visible">
                <defs>
                    <linearGradient id={`areaGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={hexColor} stopOpacity="0.35" />
                        <stop offset="60%" stopColor={hexColor} stopOpacity="0.08" />
                        <stop offset="100%" stopColor={hexColor} stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id={`lineGrad-${uid}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={hexColor} stopOpacity="0.6" />
                        <stop offset="50%" stopColor={hexColor} stopOpacity="1" />
                        <stop offset="100%" stopColor={hexColor} stopOpacity="0.6" />
                    </linearGradient>
                    <filter id={`glow-${uid}`}><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>

                {/* Y-axis labels + grid */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = height - paddingY - (ratio * (height - paddingY * 2));
                    const val = Math.round(maxVal * ratio);
                    return (
                        <g key={ratio}>
                            <line x1={paddingX - 5} y1={y} x2={contentWidth} y2={y} stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700/60" />
                            <text x={paddingX - 8} y={y + 3} textAnchor="end" fontSize={isMobile ? "7" : "9"} fill="currentColor" className="text-gray-400 dark:text-gray-500 font-medium">{val}</text>
                        </g>
                    );
                })}

                {/* Area fill */}
                <path d={areaD} fill={`url(#areaGrad-${uid})`} />

                {/* Glow line (behind main) */}
                <path d={pathD} fill="none" stroke={hexColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" filter={`url(#glow-${uid})`} />

                {/* Main line with gradient + draw animation */}
                <path ref={pathRef} d={pathD} fill="none" stroke={`url(#lineGrad-${uid})`} strokeWidth={isMobile ? 2.5 : 3} strokeLinecap="round" strokeLinejoin="round"
                    style={pathLength ? { strokeDasharray: pathLength, strokeDashoffset: 0, animation: 'none' } : {}}
                />

                {/* Hover vertical line */}
                {hoverIndex !== null && (
                    <line x1={getX(hoverIndex)} y1={paddingY} x2={getX(hoverIndex)} y2={height - paddingY} stroke={hexColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                )}

                {/* Data points */}
                {data.map((d, i) => {
                    const x = getX(i), y = getY(d.value);
                    const isHovered = hoverIndex === i;
                    return (
                        <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)} onTouchStart={() => setHoverIndex(i)} className="cursor-pointer">
                            <circle cx={x} cy={y} r="18" fill="transparent" />
                            {/* Glow ring on hover */}
                            {isHovered && <circle cx={x} cy={y} r="10" fill={hexColor} opacity="0.12" />}
                            <circle cx={x} cy={y} r={isHovered ? 5.5 : (d.value > 0 ? 3.5 : 2)} fill={d.value > 0 ? hexColor : '#d1d5db'} stroke="white" strokeWidth={isHovered ? 2.5 : 2} className="transition-all duration-200 dark:stroke-gray-800" />
                            {/* X-axis label */}
                            <text x={x} y={height - (isMobile ? 2 : 5)} textAnchor="middle" fontSize={isMobile ? "7" : "9"} fill="currentColor" className="text-gray-400 dark:text-gray-500 font-semibold">{d.label}</text>
                            {/* Tooltip */}
                            {isHovered && (
                                <g>
                                    <rect x={x - 28} y={y - 38} width="56" height="28" rx="8" fill="rgba(17,24,39,0.85)" />
                                    <text x={x} y={y - 20} textAnchor="middle" fill="white" fontSize={isMobile ? "10" : "11"} fontWeight="bold">{d.value}{metricUnit}</text>
                                    <polygon points={`${x - 5},${y - 10} ${x + 5},${y - 10} ${x},${y - 5}`} fill="rgba(17,24,39,0.85)" />
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const DonutChart = ({ stats, metric }: { stats: ModuleStat[], metric: MetricType }) => {
    const [hoveredStat, setHoveredStat] = useState<ModuleStat | null>(null);

    const getVal = (stat: ModuleStat) => {
        switch (metric) {
            case 'score': return stat.avgScore;
            case 'accuracy': return stat.avgAccuracy;
            case 'duration': return Math.round(stat.totalDuration / 60);
            case 'attempts': return stat.attempts;
            default: return 0;
        }
    };

    const total = stats.reduce((acc, curr) => acc + getVal(curr), 0);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;

    if (total === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-[6px] border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <span className="text-xs font-bold">No Data</span>
                </div>
            </div>
        );
    }

    const centerLabel = hoveredStat ? MODULE_LABELS[hoveredStat.module] : 'Total';
    const centerValue = hoveredStat
        ? (metric === 'duration' ? formatCardDuration(getVal(hoveredStat) * 60) : getVal(hoveredStat))
        : (metric === 'duration' ? formatCardDuration(total * 60) : total);
    const centerSub = hoveredStat ? `${Math.round((getVal(hoveredStat) / total) * 100)}%` : '';

    // Build segments with cumulative offset
    let cumulativePercent = 0;
    const segments = stats.map((stat) => {
        const val = getVal(stat);
        const percent = total > 0 ? val / total : 0;
        const strokeLength = percent * circumference;
        const offset = cumulativePercent * circumference;
        cumulativePercent += percent;

        let strokeColor = '#9CA3AF';
        if (stat.module === AppView.READING) strokeColor = '#3B82F6';
        if (stat.module === AppView.LISTENING) strokeColor = '#A855F7';
        if (stat.module === AppView.GRAMMAR) strokeColor = '#6366F1';
        if (stat.module === AppView.LIVE) strokeColor = '#F43F5E';

        return { stat, val, percent, strokeLength, offset, strokeColor };
    });

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 h-full w-full py-2 md:py-4">
            {/* Donut */}
            <div className="relative w-36 h-36 md:w-56 md:h-56 flex-shrink-0 select-none">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                    <defs>
                        {segments.map((seg, i) => (
                            <filter key={`glow-d-${i}`} id={`donutGlow-${i}`}><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                        ))}
                    </defs>
                    {/* Background track */}
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-gray-700/40" />
                    {/* Segments */}
                    {segments.map((seg, i) => {
                        const isHovered = hoveredStat?.module === seg.stat.module;
                        return (
                            <circle
                                key={seg.stat.module}
                                cx="50" cy="50" r={radius}
                                fill="transparent"
                                stroke={seg.strokeColor}
                                strokeWidth={isHovered ? 13 : 9}
                                strokeDasharray={`${seg.strokeLength} ${circumference}`}
                                strokeDashoffset={-seg.offset}
                                strokeLinecap="round"
                                className="cursor-pointer transition-all duration-300"
                                style={{ filter: isHovered ? `url(#donutGlow-${i})` : 'none', opacity: hoveredStat && !isHovered ? 0.35 : 1 }}
                                onMouseEnter={() => setHoveredStat(seg.stat)}
                                onMouseLeave={() => setHoveredStat(null)}
                                onTouchStart={() => setHoveredStat(seg.stat)}
                            />
                        );
                    })}
                </svg>

                {/* Center display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5 transition-colors ${hoveredStat ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}`}>
                        {centerLabel}
                    </span>
                    <span className={`text-2xl md:text-4xl font-black leading-none transition-all duration-300 ${hoveredStat ? 'scale-105 text-gray-900 dark:text-white' : 'text-gray-800 dark:text-white'}`}>
                        {centerValue}
                    </span>
                    {centerSub && (
                        <span className="mt-1 text-[9px] md:text-xs font-bold text-white bg-gray-800/80 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                            {centerSub}
                        </span>
                    )}
                </div>
            </div>

            {/* Legend with mini progress bars */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-2.5 w-full md:w-auto md:min-w-[180px]">
                {segments.map((seg) => {
                    const percent = Math.round(seg.percent * 100);
                    const isHovered = hoveredStat?.module === seg.stat.module;
                    return (
                        <div
                            key={seg.stat.module}
                            onMouseEnter={() => setHoveredStat(seg.stat)}
                            onMouseLeave={() => setHoveredStat(null)}
                            className={`flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-xl transition-all cursor-pointer border ${isHovered ? 'bg-gray-50 dark:bg-gray-700/60 border-gray-200 dark:border-gray-600 shadow-sm scale-[1.02]' : 'bg-transparent border-transparent hover:bg-gray-50/60 dark:hover:bg-gray-800/40'}`}
                        >
                            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shrink-0 ${MODULE_COLORS[seg.stat.module]}`}></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <span className={`text-[10px] md:text-xs font-bold truncate transition ${isHovered ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {MODULE_LABELS[seg.stat.module]}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 shrink-0">
                                        {metric === 'duration' ? formatCardDuration(seg.val * 60) : seg.val}
                                    </span>
                                </div>
                                {/* Mini progress bar */}
                                <div className="w-full h-1 md:h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-500 ${MODULE_COLORS[seg.stat.module]}`} style={{ width: `${percent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const MultiLineChart = ({ dataSets, metric }: { dataSets: Record<string, ChartDataPoint[]>, metric: MetricType }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [activeModules, setActiveModules] = useState<Record<string, boolean>>({
        [AppView.READING]: true,
        [AppView.LISTENING]: true,
        [AppView.GRAMMAR]: true,
        [AppView.LIVE]: true,
    });
    
    // Get array of first dataset to determine x-axis length and labels
    const referenceData = Object.values(dataSets)[0] || [];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleModule = (mod: string) => {
        setActiveModules(prev => {
            const next = { ...prev, [mod]: !prev[mod] };
            // Prevent turning off all modules
            if (!Object.values(next).some(Boolean)) return prev;
            return next;
        });
    };

    const height = isMobile ? 180 : 280;
    const paddingX = isMobile ? 35 : 50;
    const paddingY = isMobile ? 25 : 35;

    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    // Don't enforce minimum width for new aggregation, just stretch across available space
    const contentWidth = Math.max(containerWidth - (isMobile ? 40 : 100), 300);
    const pointSpacing = (contentWidth - (paddingX * 2)) / (Math.max(referenceData.length - 1, 1));

    // Calculate absolute maximum across ALL active datasets for unified Y-axis
    let maxVal = 10;
    if (metric === 'score' || metric === 'accuracy') maxVal = 100;
    else {
        let absoluteMax = 0;
        Object.entries(dataSets).forEach(([mod, data]) => {
            if (activeModules[mod]) {
                const localMax = Math.max(...data.map(d => d.value));
                if (localMax > absoluteMax) absoluteMax = localMax;
            }
        });
        if (absoluteMax > 0) maxVal = Math.ceil(absoluteMax * 1.2);
    }

    const getY = (val: number) => {
        const usableHeight = height - (paddingY * 2);
        return height - paddingY - (val / maxVal) * usableHeight;
    };
    const getX = (index: number) => paddingX + (index * pointSpacing);

    const getCurve = (i: number, pts: ChartDataPoint[]) => {
        const x = getX(i), y = getY(pts[i].value);
        if (i === 0) return `M ${x} ${y}`;
        const prevX = getX(i - 1), prevY = getY(pts[i - 1].value);
        const cp1x = prevX + (x - prevX) * 0.4, cp2x = prevX + (x - prevX) * 0.6;
        return `C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
    };

    const metricUnit = metric === 'score' || metric === 'accuracy' ? '%' : metric === 'duration' ? 'm' : '';

    return (
        <div className="w-full h-full flex flex-col">
            {/* Interactive Legend */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 pb-4 z-10 relative">
                {Object.keys(MODULE_LABELS).map((mod) => {
                    const isActive = activeModules[mod];
                    const color = CHART_HEX_COLORS[mod];
                    return (
                        <button
                            key={mod}
                            onClick={() => toggleModule(mod)}
                            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-xs font-bold transition-all border ${
                                isActive 
                                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-sm' 
                                    : 'bg-transparent border-transparent text-gray-400 opacity-60 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            <div 
                                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all" 
                                style={{ backgroundColor: isActive ? color : '#9CA3AF', boxShadow: isActive ? `0 0 8px ${color}80` : 'none' }}
                            ></div>
                            {MODULE_LABELS[mod]}
                        </button>
                    );
                })}
            </div>

            <div className="w-full flex-1 relative custom-scrollbar">
                <svg width="100%" height={height} viewBox={`0 0 ${contentWidth} ${height}`} preserveAspectRatio="none" className="overflow-visible" style={{ width: '100%' }}>
                    <defs>
                        {Object.keys(MODULE_LABELS).map(mod => (
                            <filter key={`glow-ml-${mod}`} id={`glow-ml-${mod}`}>
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        ))}
                    </defs>

                    {/* Y-axis labels + grid */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                        const y = height - paddingY - (ratio * (height - paddingY * 2));
                        const val = Math.round(maxVal * ratio);
                        return (
                            <g key={ratio}>
                                <line x1={paddingX - 5} y1={y} x2={contentWidth - paddingX + 5} y2={y} stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-700/60" />
                                <text x={paddingX - 8} y={y + 3} textAnchor="end" fontSize={isMobile ? "8" : "10"} fill="currentColor" className="text-gray-400 dark:text-gray-500 font-medium">{val}</text>
                            </g>
                        );
                    })}

                    {/* X-axis Base Line */}
                    <line x1={paddingX - 5} y1={height - paddingY} x2={contentWidth - paddingX + 5} y2={height - paddingY} stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-gray-600" />

                    {/* Draw Lines */}
                    {Object.entries(dataSets).map(([mod, data]) => {
                        if (!activeModules[mod] || data.length === 0) return null;
                        
                        let pathD = getCurve(0, data);
                        for (let i = 1; i < data.length; i++) pathD += ` ${getCurve(i, data)}`;
                        const color = CHART_HEX_COLORS[mod];

                        return (
                            <g key={mod} style={{ opacity: activeModules[mod] ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                                {/* Background Glow */}
                                <path d={pathD} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" filter={`url(#glow-ml-${mod})`} />
                                {/* Main Line */}
                                <path d={pathD} fill="none" stroke={color} strokeWidth={isMobile ? 2 : 2.5} strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        );
                    })}

                    {/* Hover Interaction Overlay */}
                    {referenceData.map((d, i) => {
                        const x = getX(i);
                        const isHovered = hoverIndex === i;
                        
                        // Collect values for tooltip
                        const tooltipData = Object.entries(dataSets)
                            .filter(([mod]) => activeModules[mod])
                            .map(([mod, data]) => ({ mod, val: data[i]?.value || 0, color: CHART_HEX_COLORS[mod] }))
                            .sort((a, b) => b.val - a.val); // Sort by highest value

                        return (
                            <g key={i} onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)} onTouchStart={() => setHoverIndex(i)} className="cursor-pointer">
                                {/* Invisible hit area */}
                                <rect x={x - (pointSpacing/2)} y={0} width={pointSpacing} height={height} fill="transparent" />
                                
                                {/* X-axis Tick & Label */}
                                {d.label && (
                                    <g>
                                        <line x1={x} y1={height - paddingY} x2={x} y2={height - paddingY + 4} stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-gray-600" />
                                        <text x={x} y={height - paddingY + (isMobile ? 14 : 18)} textAnchor="middle" fontSize={isMobile ? "9" : "11"} fill="currentColor" className={`font-bold transition-colors ${isHovered ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                            {d.label}
                                        </text>
                                    </g>
                                )}

                                {isHovered && (
                                    <g>
                                        {/* Vertical Guide Line */}
                                        <line x1={x} y1={paddingY} x2={x} y2={height - paddingY} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-gray-300 dark:text-gray-600" />
                                        
                                        {/* Data Dots */}
                                        {tooltipData.map(td => (
                                            <circle key={td.mod} cx={x} cy={getY(td.val)} r="4" fill={td.color} stroke="white" strokeWidth="1.5" className="dark:stroke-gray-800" />
                                        ))}

                                        {/* Tooltip Glass Card */}
                                        <g transform={`translate(${x < contentWidth/2 ? x + 15 : x - (isMobile ? 90 : 100)}, ${paddingY})`}>
                                            <rect width={isMobile ? 85 : 95} height={(tooltipData.length * 16) + 20} rx="8" fill="rgba(255,255,255,0.95)" stroke="rgba(229,231,235,0.8)" className="dark:fill-gray-800/95 dark:stroke-gray-700/80" style={{ backdropFilter: 'blur(8px)' }} />
                                            
                                            {/* Tooltip Date Label */}
                                            <text x={isMobile ? 42.5 : 47.5} y="14" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" className="text-gray-400 uppercase tracking-widest">{d.label || 'Time'}</text>
                                            
                                            {/* Tooltip Values */}
                                            {tooltipData.map((td, idx) => (
                                                <g key={td.mod} transform={`translate(8, ${26 + (idx * 16)})`}>
                                                    <circle cx="0" cy="-3" r="3" fill={td.color} />
                                                    <text x="8" y="0" fontSize="9" fontWeight="bold" fill="currentColor" className="text-gray-600 dark:text-gray-300">{MODULE_LABELS[td.mod]}</text>
                                                    <text x={isMobile ? 70 : 80} y="0" textAnchor="end" fontSize="9" fontWeight="900" fill="currentColor" className="text-gray-900 dark:text-white">{td.val}{metricUnit}</text>
                                                </g>
                                            ))}
                                        </g>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const ProfileModule: React.FC = () => {
    const { signout, user: authUser, isSyncing, isAdmin } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
    const [showBadges, setShowBadges] = useState(true);
    const [aiInsight, setAiInsight] = useState<string>("");
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);

    const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
    const [compareMetric, setCompareMetric] = useState<MetricType>('score');
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [showTrendWidget, setShowTrendWidget] = useState(false);
    const [trendMetric, setTrendMetric] = useState<MetricType>('score');

    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [modalTimeFilter, setModalTimeFilter] = useState<TimeFilter>('week');
    const [modalMetric, setModalMetric] = useState<MetricType>('score');

    const [selectedBadgeSeries, setSelectedBadgeSeries] = useState<string | null>(null);

    const [quoteIndex, setQuoteIndex] = useState(0);
    const [isRefreshingQuote, setIsRefreshingQuote] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [profileToast, setProfileToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [appLanguage, setAppLanguageState] = useState(getAppLanguage());

    const fileInputRef = useRef<HTMLInputElement>(null);

    const showProfileToast = (message: string, type: 'success' | 'error' = 'success') => {
        setProfileToast({ message, type });
        setTimeout(() => setProfileToast(null), 3000);
    };

    useEffect(() => {
        if (!isSyncing) {
            refreshData();
        }
        initializeQuote();
    }, [isSyncing]);

    const initializeQuote = () => {
        const stored = localStorage.getItem(KEY_QUOTE_DATA);
        const now = Date.now();
        let index = 0;

        if (stored) {
            try {
                const { idx, timestamp } = JSON.parse(stored);
                if (now - timestamp > EIGHT_HOURS_MS) {
                    index = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
                    localStorage.setItem(KEY_QUOTE_DATA, JSON.stringify({ idx: index, timestamp: now }));
                } else {
                    index = idx;
                }
            } catch (e) {
                index = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
                localStorage.setItem(KEY_QUOTE_DATA, JSON.stringify({ idx: index, timestamp: now }));
            }
        } else {
            index = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
            localStorage.setItem(KEY_QUOTE_DATA, JSON.stringify({ idx: index, timestamp: now }));
        }
        setQuoteIndex(index);
    };

    const handleRefreshQuote = () => {
        setIsRefreshingQuote(true);
        setTimeout(() => {
            let newIndex = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
            if (ISLAMIC_QUOTES.length > 1) {
                while (newIndex === quoteIndex) {
                    newIndex = Math.floor(Math.random() * ISLAMIC_QUOTES.length);
                }
            }
            setQuoteIndex(newIndex);
            localStorage.setItem(KEY_QUOTE_DATA, JSON.stringify({ idx: newIndex, timestamp: Date.now() }));
            setIsRefreshingQuote(false);
        }, 500);
    };

    const refreshData = useCallback(async () => {
        const user = getUserProfile();
        const activities = getActivityLogs();
        const vocab = getVocab();

        setProfile(user);
        setLogs(activities);

        let currentStreak = 0;
        if (activities.length > 0) {
            const sorted = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const today = new Date().setHours(0, 0, 0, 0);
            let lastDate = new Date(sorted[0].date).setHours(0, 0, 0, 0);

            if (lastDate === today || lastDate === today - 86400000) {
                currentStreak = 1;
                for (let i = 1; i < sorted.length; i++) {
                    const d = new Date(sorted[i].date).setHours(0, 0, 0, 0);
                    if (d === lastDate) continue;
                    if (d === lastDate - 86400000) {
                        currentStreak++;
                        lastDate = d;
                    } else {
                        break;
                    }
                }
            }
        }

        const unlocked: Badge[] = [];
        BADGE_DEFINITIONS.forEach(def => {
            let isUnlocked = false;
            if (def.id.includes('scholar') && activities.length >= (def.id === 'scholar_bronze' ? 1 : def.id === 'scholar_silver' ? 10 : 50)) isUnlocked = true;
            if (def.id.includes('streak') && currentStreak >= (def.id === 'streak_bronze' ? 3 : def.id === 'streak_silver' ? 7 : 30)) isUnlocked = true;
            if (def.id.includes('vocab') && vocab.length >= (def.id === 'vocab_bronze' ? 10 : def.id === 'vocab_silver' ? 50 : 100)) isUnlocked = true;

            if (def.id.includes('dedication')) {
                const xp = user.xp || 0;
                if (def.id === 'dedication_iron' && xp >= 1000) isUnlocked = true;
                if (def.id === 'dedication_diamond' && xp >= 5000) isUnlocked = true;
                if (def.id === 'dedication_legend' && xp >= 25000) isUnlocked = true;
            }

            const categories = ['visual', 'grammar_strike', 'odd_one_out', 'arcade', 'scramble', 'knowledge', 'interpreter', 'read_aloud'];
            if (def.id.includes('game_general')) {
                const maxLevel = Math.max(...categories.map(cat => getGameProgress(cat, 'general')));
                if (def.id === 'game_general_bronze' && maxLevel > 5) isUnlocked = true;
                if (def.id === 'game_general_silver' && maxLevel > 10) isUnlocked = true;
                if (def.id === 'game_general_gold' && maxLevel > 20) isUnlocked = true;
            }

            if (def.id.includes('game_islamic')) {
                const maxLevel = Math.max(...categories.map(cat => getGameProgress(cat, 'islamic')));
                if (def.id === 'game_islamic_bronze' && maxLevel > 5) isUnlocked = true;
                if (def.id === 'game_islamic_silver' && maxLevel > 10) isUnlocked = true;
                if (def.id === 'game_islamic_gold' && maxLevel > 20) isUnlocked = true;
            }

            if (isUnlocked) {
                unlocked.push({ ...def, unlockedDate: new Date().toISOString() });
            }
        });
        setEarnedBadges(unlocked);
    }, []);

    // Separate effect for AI Insight with caching logic
    useEffect(() => {
        if (profile && logs.length >= 0 && !aiInsight && !isLoadingInsight) {
            const loadInsight = async () => {
                // 1. Check if we have a valid cached insight
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);

                if (profile.weeklyInsight && new Date(profile.weeklyInsight.lastGenerated) > weekAgo) {
                    setAiInsight(profile.weeklyInsight.text);
                    return;
                }

                // 2. If not, generate new one
                setIsLoadingInsight(true);
                try {
                    const logsForInsight = logs.filter(l => new Date(l.date) >= weekAgo);
                    const insight = await generateWeeklyInsight(logsForInsight, profile.name);
                    setAiInsight(insight);

                    // Save to profile for persistence
                    const updatedProfile = {
                        ...profile,
                        weeklyInsight: {
                            text: insight,
                            lastGenerated: new Date().toISOString()
                        }
                    };
                    saveUserProfile(updatedProfile);
                    setProfile(updatedProfile);
                } catch (e) {
                    console.error("AI Insight Error:", e);
                    // Fallback to old insight if generation fails
                    if (profile.weeklyInsight) setAiInsight(profile.weeklyInsight.text);
                }
                finally { setIsLoadingInsight(false); }
            };
            loadInsight();
        }
    }, [profile, logs, aiInsight, isLoadingInsight]);

    const earnedBadgeIds = useMemo(() => new Set(earnedBadges.map(b => b.id)), [earnedBadges]);

    const badgeSeries = useMemo(() => {
        const groups: Record<string, typeof BADGE_DEFINITIONS> = {};
        BADGE_DEFINITIONS.forEach(def => {
            const key = getBadgeSeriesKey(def.id);
            if (!groups[key]) groups[key] = [];
            groups[key].push(def);
        });
        return groups;
    }, []);

    // --- ANALYTICS LOGIC ---

    /**
     * INTENTIONAL: Remaps AppView.SHADOWING → AppView.LIVE so Shadowing scores
     * appear under "Speaking" in all performance charts. This is by design —
     * see the comment block above MODULE_LABELS for the full rationale.
     */
    const normalizeLogType = (logType: AppView): AppView => {
        if (logType === AppView.SHADOWING) return AppView.LIVE;
        return logType;
    };

    const getLogsByTime = (filter: TimeFilter) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
        const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();

        return logs
            .filter(log => {
                if (log.type === AppView.VOCAB) return false;
                const logTime = new Date(log.date).getTime();
                if (filter === 'today') return logTime >= startOfDay;
                if (filter === 'week') return logTime >= startOfWeek;
                if (filter === 'month') return logTime >= startOfMonth;
                return true;
            })
            // INTENTIONAL: remap SHADOWING → LIVE (Speaking) for analytics aggregation
            .map(log => ({
                ...log,
                type: normalizeLogType(log.type),
            }));
    };

    const moduleStats = useMemo(() => {
        const filtered = getLogsByTime(timeFilter);
        const stats: Record<string, ModuleStat> = {};
        Object.keys(MODULE_LABELS).forEach(key => {
            stats[key] = {
                module: key, totalScore: 0, totalAccuracy: 0, totalDuration: 0, attempts: 0, avgScore: 0, avgAccuracy: 0
            };
        });
        filtered.forEach(log => {
            if (stats[log.type]) {
                stats[log.type].totalScore += log.score || 0;
                stats[log.type].totalAccuracy += log.accuracy || 0;
                stats[log.type].totalDuration += log.durationSeconds || 0;
                stats[log.type].attempts += 1;
            }
        });
        Object.values(stats).forEach(stat => {
            if (stat.attempts > 0) {
                stat.avgScore = Math.round(stat.totalScore / stat.attempts);
                stat.avgAccuracy = Math.round(stat.totalAccuracy / stat.attempts);
            }
        });
        return Object.values(stats).filter(s => MODULE_LABELS[s.module]);
    }, [logs, timeFilter]);

    const generateTrendData = (filter: TimeFilter, metric: MetricType, specificModule: string | null = null, forceNewAggregation = false): ChartDataPoint[] => {
        let filtered = getLogsByTime(filter);
        if (specificModule) {
            filtered = filtered.filter(l => l.type === specificModule);
        }
        const dataPoints: { label: string; value: number; count: number; _key: string, colorClass: string }[] = [];
        const now = new Date();

        const generatePoint = (key: string, label: string) => ({ label, value: 0, count: 0, _key: key, colorClass: TEXT_COLORS[specificModule || ''] || 'text-gray-500' });

        if (filter === 'today') {
            for (let i = 0; i <= 23; i++) {
                // If using the new aggregation for multi-line, hide intermediate labels to prevent crowding on mobile
                const showLabel = forceNewAggregation ? (i % 6 === 0) : true;
                dataPoints.push(generatePoint(i.toString(), showLabel ? `${i}:00` : ''));
            }
            filtered.forEach(log => {
                const h = new Date(log.date).getHours().toString();
                const point = dataPoints.find(p => p._key === h);
                if (point) updatePoint(point, log, metric);
            });
        } else if (filter === 'week') {
            // New weekly: exactly 7 days
            const daysCount = forceNewAggregation ? 6 : 11;
            for (let i = daysCount; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                dataPoints.push(generatePoint(d.toDateString(), d.toLocaleDateString('en-US', { weekday: 'short' })));
            }
            filtered.forEach(log => {
                const d = new Date(log.date).toDateString();
                const point = dataPoints.find(p => p._key === d);
                if (point) updatePoint(point, log, metric);
            });
        } else {
            // Monthly
            if (forceNewAggregation) {
                // Group by Week (Week 1, 2, 3, 4)
                for (let i = 4; i >= 1; i--) {
                    dataPoints.push(generatePoint(`W${i}`, `Week ${5 - i}`));
                }
                filtered.forEach(log => {
                    const logDate = new Date(log.date);
                    const diffDays = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 3600 * 24));
                    let weekKey = 'W1'; // Oldest (21-28 days ago)
                    if (diffDays <= 7) weekKey = 'W4'; // Most recent week
                    else if (diffDays <= 14) weekKey = 'W3';
                    else if (diffDays <= 21) weekKey = 'W2';

                    const point = dataPoints.find(p => p._key === weekKey);
                    if (point) updatePoint(point, log, metric);
                });
            } else {
                // Legacy 30-day dots
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    dataPoints.push(generatePoint(d.toDateString(), `${d.getDate()}/${d.getMonth() + 1}`));
                }
                filtered.forEach(log => {
                    const d = new Date(log.date).toDateString();
                    const point = dataPoints.find(p => p._key === d);
                    if (point) updatePoint(point, log, metric);
                });
            }
        }

        return dataPoints.map(p => ({
            label: p.label,
            value: p.count === 0 ? 0 : (metric === 'attempts' ? p.count : Math.round(p.value / p.count)),
            colorClass: p.colorClass
        }));
    };

    const updatePoint = (point: any, log: ActivityLog, metric: MetricType) => {
        let val = 0;
        if (metric === 'score') val = log.score;
        else if (metric === 'accuracy') val = log.accuracy;
        else if (metric === 'duration') val = log.durationSeconds / 60;
        else if (metric === 'attempts') val = 1;
        point.value += val;
        point.count += 1;
    };

    const modalStats = useMemo(() => {
        if (!selectedModule) return [];
        return generateTrendData(modalTimeFilter, modalMetric, selectedModule);
    }, [logs, selectedModule, modalTimeFilter, modalMetric]);

    const getMetricValue = (stat: ModuleStat) => {
        switch (compareMetric) {
            case 'score': return stat.avgScore;
            case 'accuracy': return stat.avgAccuracy;
            case 'duration': return Math.round(stat.totalDuration / 60);
            case 'attempts': return stat.attempts;
            default: return 0;
        }
    };

    // Replaced getLevelInfo with getGamificationStats from achievements.ts


    const handleNameChange = (name: string) => {
        if (profile) {
            const updated = { ...profile, name };
            setProfile(updated);
            saveUserProfile(updated);
        }
    };

    const handleAvatarChange = (icon: string) => {
        if (profile) {
            const updated = { ...profile, avatar: icon, photoData: null as any };
            setProfile(updated);
            saveUserProfile(updated);
            setShowAvatarModal(false);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            // Simple compression check (optional, but good for Firestore limits)
            if (base64.length > 200000) {
                showProfileToast('Image is too large (max 200KB). Please choose a smaller photo.', 'error');
                return;
            }
            const updated = { ...profile, photoData: base64 };
            setProfile(updated);
            saveUserProfile(updated);
            setShowAvatarModal(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSystemBackup = () => {
        const json = exportFullSystemBackup();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `LovSpeak_Full_Backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSystemRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const text = evt.target?.result as string;
            if (text) {
                const result = await importFullSystemBackup(text);
                if (result.success) {
                    showProfileToast(result.message);
                    refreshData();
                } else {
                    showProfileToast("Error: " + result.message, 'error');
                }
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const copyQuote = () => {
        navigator.clipboard.writeText(ISLAMIC_QUOTES[quoteIndex]);
        showProfileToast('Quote copied!');
    };

    const handleLanguageChange = (lang: 'id' | 'en') => {
        setAppLanguageState(lang);
        setAppLanguage(lang);
    };

    if (!profile) return <div>Loading...</div>;

    const gameStats = getGamificationStats(profile.xp || 0);
    const vocabCount = getVocab().length;
    const { unlockedSeries } = checkAndUnlockBadges(profile, logs, vocabCount);


    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-5 pb-10">

            {/* Header Profile Section - Redesigned for Proportionality */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl lg:rounded-[2.5rem] p-5 md:p-6 lg:p-8 shadow-xl border border-white/40 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-lovelya-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7 items-center relative z-10">
                    {/* Left: Avatar & Basic Info */}
                    <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="relative group cursor-pointer mb-3" onClick={() => setShowAvatarModal(true)}>
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-0.5 md:p-1 rounded-full shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-2xl md:text-3xl text-gray-800 dark:text-white overflow-hidden relative">
                                    {profile.photoData ? (
                                        <img
                                            src={profile.photoData}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <i className={`fas ${profile.avatar || 'fa-user'}`}></i>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <i className="fas fa-camera text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-7 h-7 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg text-gray-500 border-2 border-white dark:border-gray-800 group-hover:scale-110 transition">
                                <i className="fas fa-camera text-[10px]"></i>
                            </div>
                        </div>

                        <div className="space-y-0.5 w-full">
                            <input
                                value={profile.name}
                                onChange={e => handleNameChange(e.target.value)}
                                className="text-md md:text-lg font-black text-gray-900 dark:text-white bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-lovelya-500 outline-none transition w-full text-center md:text-left py-0.5 truncate"
                            />
                            <div className="inline-flex items-center gap-1.5 bg-lovelya-50 dark:bg-lovelya-500/10 px-2 py-0.5 rounded-full border border-lovelya-100 dark:border-lovelya-500/20">
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gameStats.rankColor} text-[8px] md:text-[10px] font-black uppercase tracking-widest`}><i className={`fas ${gameStats.rankIcon} mr-1`}></i> Lv {gameStats.level}</span>
                                <span className="w-0.5 h-0.5 rounded-full bg-lovelya-300 dark:bg-lovelya-700"></span>
                                <span className="text-gray-700 dark:text-gray-200 text-[8px] md:text-[9px] font-bold">{gameStats.rankTitle}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & Quick Settings */}
                    <div className="md:col-span-8 space-y-4">
                        {/* Progress Bar */}
                        <div className="bg-white dark:bg-gray-900/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gameStats.rankColor} opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 pointer-events-none`}></div>
                            <div className="flex justify-between items-center mb-1.5 text-[8px] md:text-[10px] font-black relative z-10">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <i className="fas fa-bolt text-amber-500"></i>
                                    {profile.xp} XP Total
                                </span>
                                <span className="text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                                    <span className="text-lovelya-500">{gameStats.xpNeededForLevel - gameStats.xpIntoLevel} XP</span> to Lv {gameStats.level + 1}
                                </span>
                            </div>
                            <div className="overflow-hidden h-1.5 md:h-2 text-xs flex rounded-full bg-gray-100 dark:bg-gray-800 relative z-10">
                                <div
                                    style={{ width: `${gameStats.progressPercent}%` }}
                                    className={`shadow-[0_0_10px_rgba(236,72,153,0.3)] flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${gameStats.rankColor} transition-all duration-1000 ease-out`}
                                ></div>
                            </div>
                        </div>

                        {/* Quick Settings Grid - Hidden on Mobile, shown on Desktop/Tablet */}
                        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* AI Language Quick Setting */}
                            <div className="bg-gray-50 dark:bg-gray-900/30 p-2 md:p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">AI Language</label>
                                <div className="flex p-0.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleLanguageChange('id')}
                                        className={`flex-1 py-1 rounded-md text-[9px] font-bold transition ${appLanguage === 'id' ? 'bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600' : 'text-gray-400'}`}
                                    >
                                        ID
                                    </button>
                                    <button
                                        onClick={() => handleLanguageChange('en')}
                                        className={`flex-1 py-1 rounded-md text-[9px] font-bold transition ${appLanguage === 'en' ? 'bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600' : 'text-gray-400'}`}
                                    >
                                        EN
                                    </button>
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="bg-gray-50 dark:bg-gray-900/30 p-2 md:p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Account Actions</label>
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-[9px] text-gray-500 truncate">Signed in as: <span className="text-gray-900 dark:text-gray-200 font-bold">{authUser?.email}</span></p>
                                    {isAdmin && <button
                                        onClick={() => window.location.assign('/admin')}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-violet-500 to-lovelya-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                                    >
                                        <i className="fas fa-shield-halved text-sm"></i>
                                        <span>Buka Dashboard Admin</span>
                                        <i className="fas fa-arrow-right text-[10px] ml-auto"></i>
                                    </button>}
                                    <button
                                        onClick={() => setShowLogoutConfirm(true)}
                                        className="w-full py-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-red-100 dark:hover:bg-red-900/20"
                                    >
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Backup/Restore Buttons - Hidden on Mobile */}
                        <div className="hidden md:flex gap-2 justify-center md:justify-start">
                            <button onClick={handleSystemBackup} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg shadow-sm text-[8px] font-black text-gray-600 dark:text-gray-300 hover:bg-lovelya-500 hover:text-white transition flex items-center gap-1.5 border border-transparent">
                                <i className="fas fa-cloud-download-alt"></i> Backup
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg shadow-sm text-[8px] font-black text-gray-600 dark:text-gray-300 hover:bg-lovelya-500 hover:text-white transition flex items-center gap-1.5 border border-transparent">
                                <i className="fas fa-cloud-upload-alt"></i> Restore
                            </button>
                            <input type="file" accept=".json" ref={fileInputRef} onChange={handleSystemRestore} className="hidden" />
                        </div>

                        {/* Mobile Only Quick Settings (Logout/Language) */}
                        <div className="md:hidden space-y-3 pt-3 border-t border-gray-50 dark:border-gray-700/30">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleLanguageChange('id')}
                                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition ${appLanguage === 'id' ? 'bg-lovelya-50 border-lovelya-200 text-lovelya-600' : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-700/50 text-gray-400'}`}
                                >
                                    Bahasa: ID
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition ${appLanguage === 'en' ? 'bg-lovelya-50 border-lovelya-200 text-lovelya-600' : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-700/50 text-gray-400'}`}
                                >
                                    Bahasa: EN
                                </button>
                            </div>
                            {isAdmin && <button
                                onClick={() => window.location.assign('/admin')}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-500 to-lovelya-500 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2.5 shadow-lg shadow-violet-500/25 active:scale-95 transition-all outline-none"
                            >
                                <i className="fas fa-shield-halved text-base"></i>
                                <span>Buka Dashboard Admin</span>
                                <i className="fas fa-arrow-right text-xs ml-auto"></i>
                            </button>}
                            <button
                                onClick={() => {
                                    audioService.play('tap');
                                    setShowLogoutConfirm(true);
                                }}
                                className="w-full py-2 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/20 active:scale-95 transition-all outline-none"
                            >
                                <i className="fas fa-sign-out-alt"></i> Keluar / Ganti Akun
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- WEEKLY AI INSIGHT --- */}
            <div className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 p-5 md:p-6 lg:p-8 group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i className="fas fa-brain text-6xl"></i>
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shadow-sm">
                            <i className="fas fa-sparkles text-sm"></i>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Weekly AI Insight</h3>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Personalized for {profile.name}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 min-h-[80px] flex items-center justify-center">
                        {isLoadingInsight ? (
                            <div className="flex items-center gap-2 text-indigo-400">
                                <i className="fas fa-circle-notch animate-spin text-xs"></i>
                                <span className="text-[9px] font-bold uppercase tracking-widest">Generating Insight...</span>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic">
                                {aiInsight || `"Teruslah belajar, ${profile.name}. Setiap progres kecil membawa Anda lebih dekat menuju target. Konsistensi adalah kunci, dan amalan yang konsisten sangat dicintai oleh Allah."`}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- ANALYTICS SECTION --- */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xl">
                            <i className="fas fa-chart-pie"></i>
                        </span>
                        Performance Analytics
                    </h3>
                    <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl flex self-start sm:self-auto">
                        {(['today', 'week', 'month'] as TimeFilter[]).map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeFilter(tf)}
                                className={`px-3 md:px-4 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider transition ${timeFilter === tf ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-sm' : 'text-gray-400'}`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Skill Comparison Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl lg:rounded-[2.5rem] p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-3">
                        <div>
                            <h4 className="font-black text-xs md:text-sm text-gray-800 dark:text-white uppercase tracking-tight">Skill Comparison</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Monitor strengths across modules.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                            <div className="bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg flex self-start">
                                <button onClick={() => setChartType('bar')} className={`px-2 py-1.5 rounded-md text-[10px] transition ${chartType === 'bar' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-400'}`} title="Bar Chart"><i className="fas fa-chart-bar"></i></button>
                                <button onClick={() => setChartType('donut')} className={`px-2 py-1.5 rounded-md text-[10px] transition ${chartType === 'donut' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-white' : 'text-gray-400'}`} title="Donut Chart"><i className="fas fa-chart-pie"></i></button>
                            </div>

                            <div className="flex gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 flex-1 custom-scrollbar scrollbar-hide">
                                {(['score', 'duration', 'attempts'] as MetricType[]).map(metric => (
                                    <button
                                        key={metric}
                                        onClick={() => setCompareMetric(metric)}
                                        className={`px-2.5 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black border transition whitespace-nowrap uppercase tracking-widest ${compareMetric === metric ? 'bg-lovelya-50 dark:bg-lovelya-900/20 border-lovelya-300 text-lovelya-700 dark:text-lovelya-300' : 'border-gray-100 dark:border-gray-700 text-gray-400'}`}
                                    >
                                        {metric}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-[220px] md:h-[300px] relative mt-4 md:mt-8">
                        {chartType === 'bar' ? (
                            <div className="h-full flex items-end justify-center gap-6 md:gap-16 px-1 lg:px-10">
                                {moduleStats.map((stat) => {
                                    const val = getMetricValue(stat);
                                    const max = getMaxValue(moduleStats.map(s => ({ value: getMetricValue(s) })), compareMetric);
                                    const percent = Math.min((val / max) * 100, 100);
                                    const label = MODULE_LABELS[stat.module];

                                    return (
                                        <div key={stat.module} className="flex-1 flex flex-col items-center group relative h-full justify-end max-w-[50px] md:max-w-[70px]">
                                            <div className="mb-3 text-[8px] md:text-[10px] font-black text-white bg-gray-800 dark:bg-gray-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 absolute bottom-full z-20 pointer-events-none whitespace-nowrap">
                                                {val}{compareMetric === 'duration' ? 'm' : compareMetric === 'accuracy' ? '%' : ''}
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-xl md:rounded-2xl relative overflow-hidden flex items-end h-[140px] md:h-[220px] border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-all">
                                                <div
                                                    className={`w-full rounded-t-lg md:rounded-t-xl transition-all duration-1000 ease-out ${MODULE_COLORS[stat.module]} shadow-inner`}
                                                    style={{ height: `${percent}%`, minHeight: percent > 0 ? '4px' : '0' }}
                                                >
                                                    <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent"></div>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest text-center flex items-center justify-center w-full break-words leading-none group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {label}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <DonutChart stats={moduleStats} metric={compareMetric} />
                        )}
                    </div>
                </div>

                {/* --- NEW PERFORMANCE TREND CARD (MULTI-LINE) --- */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl lg:rounded-[2.5rem] p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
                        <div>
                            <h4 className="font-black text-xs md:text-sm text-gray-800 dark:text-white uppercase tracking-tight">Performance Trend</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Track progress across all modules over time.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="flex gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 flex-1 custom-scrollbar scrollbar-hide">
                                {(['score', 'duration', 'attempts'] as MetricType[]).map(metric => (
                                    <button
                                        key={metric}
                                        onClick={() => {
                                            if (!showTrendWidget) setShowTrendWidget(true);
                                            setTrendMetric(metric);
                                        }}
                                        className={`px-2.5 md:px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black border transition whitespace-nowrap uppercase tracking-widest ${trendMetric === metric && showTrendWidget ? 'bg-lovelya-50 dark:bg-lovelya-900/20 border-lovelya-300 text-lovelya-700 dark:text-lovelya-300' : 'border-gray-100 dark:border-gray-700 text-gray-400'}`}
                                    >
                                        {metric}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setShowTrendWidget(!showTrendWidget)}
                                className="w-8 h-8 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-lovelya-600 transition flex items-center justify-center"
                            >
                                <i className={`fas fa-chevron-${showTrendWidget ? 'up' : 'down'} text-[10px]`}></i>
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showTrendWidget && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="h-[240px] md:h-[320px] w-full pt-2">
                                    <MultiLineChart 
                                        dataSets={{
                                            [AppView.READING]: generateTrendData(timeFilter, trendMetric, AppView.READING, true),
                                            [AppView.LISTENING]: generateTrendData(timeFilter, trendMetric, AppView.LISTENING, true),
                                            [AppView.GRAMMAR]: generateTrendData(timeFilter, trendMetric, AppView.GRAMMAR, true),
                                            [AppView.LIVE]: generateTrendData(timeFilter, trendMetric, AppView.LIVE, true),
                                        }} 
                                        metric={trendMetric} 
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- 4 MINIMAL WIDGETS --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {moduleStats.map((stat) => {
                        const label = MODULE_LABELS[stat.module];
                        const color = MODULE_COLORS[stat.module];
                        const isSpeaking = stat.module === AppView.LIVE;
                        const displayValue = isSpeaking ? formatCardDuration(stat.totalDuration) : stat.avgScore;
                        const displayUnit = isSpeaking ? '' : '%';
                        const displayLabel = isSpeaking ? 'Duration' : 'Avg Score';

                        return (
                            <div
                                key={stat.module}
                                onClick={() => {
                                    setSelectedModule(stat.module);
                                    setModalTimeFilter(timeFilter);
                                    setModalMetric(compareMetric);
                                }}
                                className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] hover:border-lovelya-200 cursor-pointer transition-all duration-300 group flex flex-col justify-between h-full"
                            >
                                <div className="flex items-start justify-between mb-3 md:mb-4">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white text-lg md:text-xl shadow-md ${color} group-hover:shadow-lg transition`}>
                                        <i className={`fas ${stat.module === AppView.READING ? 'fa-book-open' :
                                            stat.module === AppView.LISTENING ? 'fa-headphones' :
                                                stat.module === AppView.GRAMMAR ? 'fa-spell-check' :
                                                    stat.module === AppView.LIVE ? 'fa-microphone-alt' :
                                                        'fa-star'
                                            }`}></i>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-md md:text-lg font-black text-gray-800 dark:text-gray-100">
                                            {displayValue}<span className="text-[10px] md:text-xs text-gray-400">{displayUnit}</span>
                                        </div>
                                        <div className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase">{displayLabel}</div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-xs md:text-base mb-1 truncate">{label}</h4>
                                    <div className="flex justify-between items-center text-[10px] md:text-xs text-gray-500 mt-1">
                                        <span>{stat.attempts} Sess.</span>
                                        <i className="fas fa-chevron-right text-gray-300 group-hover:text-lovelya-500 transition"></i>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- BADGES SECTION --- */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-lovelya-100 dark:bg-lovelya-900/30 text-lovelya-600 flex items-center justify-center text-xl">
                            <i className="fas fa-award"></i>
                        </span>
                        Achievements & Badges
                    </h3>
                    <button
                        onClick={() => setShowBadges(!showBadges)}
                        className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-lovelya-600 transition flex items-center gap-2"
                    >
                        {showBadges ? 'Hide' : 'Show'} <i className={`fas fa-chevron-${showBadges ? 'up' : 'down'}`}></i>
                    </button>
                </div>

                <AnimatePresence>
                    {showBadges && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                                {BADGE_SERIES.map((series) => {
                                    const highestUnlockedTierLevel = unlockedSeries[series.id] || 0;
                                    const isUnlocked = highestUnlockedTierLevel > 0;
                                    
                                    // Get the display tier (highest unlocked, or the first one if none unlocked)
                                    const displayTier = highestUnlockedTierLevel > 0 
                                        ? series.tiers.find(t => t.level === highestUnlockedTierLevel)!
                                        : series.tiers[0];
                                        
                                    const progressPercent = (highestUnlockedTierLevel / series.tiers.length) * 100;

                                    return (
                                        <div
                                            key={series.id}
                                            onClick={() => setSelectedBadgeSeries(series.id)}
                                            className={`relative bg-gray-50 dark:bg-gray-700/30 p-3 md:p-5 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-md ${isUnlocked ? 'border-lovelya-200 dark:border-lovelya-600' : 'border-dashed border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'}`}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-3xl mb-2 md:mb-3 shadow-sm transform transition duration-500 bg-gradient-to-br ${isUnlocked ? displayTier.color : 'from-gray-100 to-gray-200 text-gray-300 dark:from-gray-600 dark:to-gray-700 dark:text-gray-500'} group-hover:scale-110 ${isUnlocked && displayTier.animationClass ? displayTier.animationClass : ''}`}>
                                                    <i className={`fas ${displayTier.icon || series.icon}`}></i>
                                                </div>
                                                <h4 className="font-bold text-xs md:text-sm text-gray-800 dark:text-gray-100 mb-0.5 md:mb-1 line-clamp-1 w-full truncate">{series.title}</h4>
                                                <p className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-2 md:mb-3 w-full truncate">
                                                    {isUnlocked ? displayTier.name : 'Locked'}
                                                </p>
                                                
                                                {/* Progress Bar */}
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 md:h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-green-500' : 'bg-gray-300'}`}
                                                        style={{ width: `${progressPercent}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between w-full text-[8px] md:text-[9px] text-gray-400 mt-1 font-bold">
                                                    <span>Lvl {highestUnlockedTierLevel}</span>
                                                    <span>Max {series.tiers.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Detailed Module Modal */}
            {selectedModule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl p-6 md:p-8 animate-slide-up flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg ${MODULE_COLORS[selectedModule]}`}>
                                    <i className={`fas ${selectedModule === AppView.READING ? 'fa-book-open' :
                                        selectedModule === AppView.LISTENING ? 'fa-headphones' :
                                            selectedModule === AppView.GRAMMAR ? 'fa-spell-check' :
                                                selectedModule === AppView.LIVE ? 'fa-microphone-alt' :
                                                    'fa-star'
                                        }`}></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">{MODULE_LABELS[selectedModule]} Performance</h3>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Detailed analytics and progress trends.</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedModule(null)} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition">
                                <i className="fas fa-times text-lg"></i>
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                            <div className="bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg flex">
                                {(['today', 'week', 'month'] as TimeFilter[]).map((tf) => (
                                    <button
                                        key={tf}
                                        onClick={() => setModalTimeFilter(tf)}
                                        className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition ${modalTimeFilter === tf ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm' : 'text-gray-400'}`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-1.5 overflow-x-auto pb-1 w-full md:w-auto custom-scrollbar">
                                {(['score', 'accuracy', 'duration', 'attempts'] as MetricType[]).map(metric => (
                                    <button
                                        key={metric}
                                        onClick={() => setModalMetric(metric)}
                                        className={`px-3 py-1.5 rounded-md text-[10px] font-black border transition whitespace-nowrap uppercase tracking-wider ${modalMetric === metric ? `${MODULE_COLORS[selectedModule]} text-white border-transparent shadow-sm` : 'border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        {metric}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 min-h-[300px] bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 relative flex flex-col">
                            <AreaChart data={modalStats} metric={modalMetric} moduleId={selectedModule} />
                        </div>

                        <div className="text-center text-xs text-gray-400 mt-4 font-medium italic">
                            Displaying {modalMetric} data for {modalTimeFilter}. Scroll to see more.
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar Modal */}
            {showAvatarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl p-6 animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Choose Avatar</h3>
                            <button onClick={() => setShowAvatarModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="grid grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto p-2">
                            <button
                                onClick={() => document.getElementById('photo-upload-input')?.click()}
                                className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xl transition bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 hover:bg-lovelya-100"
                                title="Upload Photo"
                            >
                                <i className="fas fa-upload text-sm"></i>
                                <span className="text-[8px] font-bold mt-1">Upload</span>
                            </button>
                            <input
                                id="photo-upload-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                            {AVATAR_ICONS.map(icon => (
                                <button
                                    key={icon}
                                    onClick={() => handleAvatarChange(icon)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition hover:bg-lovelya-100 dark:hover:bg-gray-700 ${profile.avatar === icon ? 'bg-lovelya-500 text-white' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300'}`}
                                >
                                    <i className={`fas ${icon}`}></i>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Detailed Badge Series Modal */}
            <AnimatePresence>
                {selectedBadgeSeries && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh] relative border border-gray-100 dark:border-gray-700"
                        >
                            <button onClick={() => setSelectedBadgeSeries(null)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition">
                                <i className="fas fa-times"></i>
                            </button>
                            
                            {(() => {
                                const series = BADGE_SERIES.find(s => s.id === selectedBadgeSeries);
                                if (!series) return null;
                                
                                const highestUnlockedTierLevel = unlockedSeries[series.id] || 0;
                                
                                return (
                                    <div className="flex flex-col h-full overflow-hidden">
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-3xl mb-3 text-gray-400">
                                                <i className={`fas ${series.icon}`}></i>
                                            </div>
                                            <h3 className="text-xl font-black text-gray-800 dark:text-white">{series.title}</h3>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">Evolusi Lencana</p>
                                        </div>
                                        
                                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                            {series.tiers.map((tier) => {
                                                const isTierUnlocked = highestUnlockedTierLevel >= tier.level;
                                                const isNextTier = highestUnlockedTierLevel === tier.level - 1;
                                                
                                                return (
                                                    <div key={tier.level} className={`flex gap-4 p-4 rounded-2xl border ${isTierUnlocked ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' : isNextTier ? 'bg-lovelya-50 dark:bg-lovelya-900/10 border-lovelya-200 dark:border-lovelya-800' : 'bg-transparent border-dashed border-gray-200 dark:border-gray-700 opacity-60'}`}>
                                                        <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-2xl shadow-sm bg-gradient-to-br ${isTierUnlocked || isNextTier ? tier.color : 'from-gray-100 to-gray-200 text-gray-400 dark:from-gray-800 dark:to-gray-700'} ${isTierUnlocked && tier.animationClass ? tier.animationClass : ''}`}>
                                                            <i className={`fas ${tier.icon || series.icon} ${!isTierUnlocked && !isNextTier ? 'opacity-50' : ''}`}></i>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className={`font-black text-sm ${isTierUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{tier.name}</h4>
                                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${isTierUnlocked ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700'}`}>
                                                                    Lv {tier.level}
                                                                </span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">{tier.description}</p>
                                                            {!isTierUnlocked && (
                                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                                    <i className="fas fa-lock text-gray-300"></i> Butuh {tier.reqValue} {series.reqType.replace('_count', '')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[2rem] shadow-2xl p-8 text-center border border-gray-100 dark:border-gray-700"
                        >
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-2">Logout Akun?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium">Anda dapat masuk kembali kapan saja dengan email Google Anda.</p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setShowLogoutConfirm(false);
                                        signout();
                                    }}
                                    className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition active:scale-95"
                                >
                                    Ya, Keluar
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-600 transition active:scale-95"
                                >
                                    Batalkan
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Toast for Profile Module */}
            <AnimatePresence>
                {profileToast && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-white font-bold text-xs backdrop-blur-md ${profileToast.type === 'error' ? 'bg-red-500/90' : 'bg-green-500/90'}`}
                    >
                        <i className={`fas ${profileToast.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                        {profileToast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProfileModule;
