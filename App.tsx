
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, LearningPlan, Level, DailyTask, UserProfile, AssessmentResult, ModuleContext, UserAssignment, UserNotification } from './types';
import { LEARNING_TARGETS, LEARNING_INTENSITIES, LEVEL_DEFINITIONS, LEVELS, ISLAMIC_QUOTES } from './constants';
import { getLearningPlan, saveLearningPlan, getUserProfile, saveUserProfile, completeRoadmapUnit } from './services/storage';
import { generateDailyTasks, generateGoogleCalendarUrl } from './services/planner';
import Layout from './components/Layout';
import { useAuth } from './src/contexts/AuthContext';
import AdminPortal from './src/components/AdminPortal';
import AdminLogin from './src/components/AdminLogin';
import LoginPage from './src/components/LoginPage';
import { ActivationPage, ApiKeySetupPage } from './src/components/Onboarding';
import TourGuide, { buildAppTourSteps, TOUR_KEY_APP } from './src/components/TourGuide';

// Lazy load modules for performance
const ReadingModule = lazy(() => import('./components/ReadingModule'));
const GrammarModule = lazy(() => import('./components/GrammarModule'));
const VocabularyModule = lazy(() => import('./components/VocabularyModule'));
const TranslateModule = lazy(() => import('./components/TranslateModule'));
const LivePracticeModule = lazy(() => import('./components/LivePracticeModule'));
const ListeningModule = lazy(() => import('./components/ListeningModule'));
const ProfileModule = lazy(() => import('./components/ProfileModule'));
const AssessmentModule = lazy(() => import('./components/AssessmentModule'));
const ChatModule = lazy(() => import('./components/ChatModule'));
const GameModule = lazy(() => import('./components/GameModule'));
const RoadmapModule = lazy(() => import('./components/RoadmapModule'));
const DiaryModule = lazy(() => import('./components/DiaryModule'));
const ShadowingModule = lazy(() => import('./components/ShadowingModule'));
const SettingsModule = lazy(() => import('./components/SettingsModule'));

import SplashScreen from './components/SplashScreen';
import InstallPrompt from './src/components/InstallPrompt';
import { ApiLimitModal } from './components/ApiLimitModal';
import { getUserAssignments, getUserNotifications, markNotificationRead, markUserAssignmentRead } from './services/admin';

// App version — must match APP_VERSION in sw.js. Bump on every deploy.
const APP_VERSION = '2.1.2';

// Force-update: check if the running Service Worker matches this version.
// If it doesn't (stale cache / old PWA install), force SW update + page reload.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    // Ask the active SW for its version
    if (registration.active) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        if (event.data?.type === 'SW_VERSION' && event.data.version !== APP_VERSION) {
          console.log(`[LovSpeak] Version mismatch: app=${APP_VERSION}, sw=${event.data.version}. Forcing update...`);
          registration.update().then(() => {
            // Tell the new waiting SW to skip waiting and activate
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            // Reload to get the latest version
            window.location.reload();
          }).catch(() => {
            // If update fails, just reload — network fetch will bypass SW for JS
            window.location.reload();
          });
        }
      };
      registration.active.postMessage({ type: 'GET_VERSION' }, [messageChannel.port2]);
    }

    // Also handle the case where a new SW is already waiting
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }

    // Listen for future updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            // New SW activated, check version
            const ch = new MessageChannel();
            ch.port1.onmessage = (evt) => {
              if (evt.data?.type === 'SW_VERSION' && evt.data.version !== APP_VERSION) {
                window.location.reload();
              }
            };
            newWorker.postMessage({ type: 'GET_VERSION' }, [ch.port2]);
          }
        });
      }
    });
  }).catch((err) => {
    console.warn('[LovSpeak] SW ready check failed:', err);
  });
}

const getWIBDateString = () => {
  // Uses en-CA locale to consistently return YYYY-MM-DD format in Asia/Jakarta timezone.
  // This prevents diffDays calculation bugs caused by local timezone shifts or device clock parsing.
  return new Intl.DateTimeFormat('en-CA', { 
    timeZone: 'Asia/Jakarta', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).format(new Date());
};

const getPlanDayNumber = (startDate?: string, currentDate?: string) => {
  if (!startDate) return null;
  const start = new Date(`${startDate}T00:00:00`);
  const current = new Date(`${(currentDate || getWIBDateString())}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(current.getTime())) return null;
  return Math.max(1, Math.floor((current.getTime() - start.getTime()) / 86400000) + 1);
};

const App: React.FC = () => {
  const { user, loading, isActive, hasApiKey, isSyncing = false, isAdmin, signout } = useAuth();
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [moduleContext, setModuleContext] = useState<ModuleContext | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);
  const [showWisdomModal, setShowWisdomModal] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [assignedTasks, setAssignedTasks] = useState<UserAssignment[]>([]);
  const [taskNotifications, setTaskNotifications] = useState<UserNotification[]>([]);
  const [taskPopup, setTaskPopup] = useState<UserNotification | null>(null);
  const [showTour, setShowTour] = useState(false);

  // Dashboard View State
  const [dashboardView, setDashboardView] = useState<'yesterday' | 'today' | 'week' | 'month'>('today');
  const [showModules, setShowModules] = useState(true);

  const [step, setStep] = useState(1);
  const [tempTargets, setTempTargets] = useState<string[]>([]);
  const [tempIntensity, setTempIntensity] = useState('');
  const [tempLevel, setTempLevel] = useState<Level>('A1');
  const [tempDays, setTempDays] = useState(3);

  useEffect(() => {
    if (!user || !isActive || isSyncing) return;
    let cancelled = false;
    const loadInbox = async () => {
      try {
        const [tasks, notifications] = await Promise.all([getUserAssignments(user.uid), getUserNotifications(user.uid)]);
        if (cancelled) return;
        setAssignedTasks(tasks);
        setTaskNotifications(notifications);
        const newest = notifications.find(item => !item.readAt);
        if (newest) {
          setTaskPopup(newest);
          window.setTimeout(() => setTaskPopup(current => current?.id === newest.id ? null : current), 3000);
        }
      } catch (error) {
        console.warn('[LovSpeak] assignment inbox unavailable', error);
      }
    };
    void loadInbox();
    return () => { cancelled = true; };
  }, [user?.uid, isActive, isSyncing]);

  useEffect(() => {
    const handlePopState = () => {
      if (view !== AppView.HOME) {
        setView(AppView.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // When navigating away from HOME, push a state so the back button has something to pop
    if (view !== AppView.HOME) {
      window.history.pushState({ view }, '');
    } else {
      // If we are at HOME, we might want to clear the history or just leave it
      // Standard behavior: if user is at HOME and presses back, they leave the site.
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [view]);

  useEffect(() => {
    // Wait for cloud sync to finish before reading localStorage,
    // otherwise we'd read stale/empty data on a new device.
    if (isSyncing) return;

    const profile = getUserProfile();
    setUserProfile(profile);

    const storedPlan = getLearningPlan();
    if (storedPlan) {
      const normalizedStoredPlan = storedPlan.startDate
        ? storedPlan
        : { ...storedPlan, startDate: storedPlan.lastGeneratedDate };
      const todayWIB = getWIBDateString();
      if (normalizedStoredPlan.lastGeneratedDate !== todayWIB) {
        // Check if exactly 1 day passed
        const lastDate = new Date(normalizedStoredPlan.lastGeneratedDate);
        const todayDate = new Date(todayWIB);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        let newYesterdayTasks = undefined;
        if (diffDays === 1 && normalizedStoredPlan.dailyTasks) {
          newYesterdayTasks = normalizedStoredPlan.dailyTasks;
        }

        const newTasks = generateDailyTasks(
          normalizedStoredPlan.targetIds,
          normalizedStoredPlan.intensityId,
          normalizedStoredPlan.currentLevel,
          undefined,
          normalizedStoredPlan.startDate
        );
        const refreshedPlan: LearningPlan = {
          ...normalizedStoredPlan,
          dailyTasks: newTasks,
          yesterdayTasks: newYesterdayTasks,
          lastGeneratedDate: todayWIB
        };
        saveLearningPlan(refreshedPlan);
        setPlan(refreshedPlan);
      } else {
        if (!storedPlan.startDate) {
          saveLearningPlan(normalizedStoredPlan);
        }
        setPlan(normalizedStoredPlan);
      }
    }
  }, [view, isSyncing]);

  useEffect(() => {
    if (user && isActive && hasApiKey && !showPlanModal) {
      const today = getWIBDateString();
      const storedDate = localStorage.getItem('lovelya_wisdom_date');
      const storedCount = parseInt(localStorage.getItem('lovelya_wisdom_count') || '0');

      if (storedDate !== today) {
        localStorage.setItem('lovelya_wisdom_date', today);
        localStorage.setItem('lovelya_wisdom_count', '1');
        const randomQuote = ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
        setCurrentQuote(randomQuote);
        setShowWisdomModal(true);
      } else if (storedCount < 3) {
        localStorage.setItem('lovelya_wisdom_count', (storedCount + 1).toString());
        const randomQuote = ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
        setCurrentQuote(randomQuote);
        setShowWisdomModal(true);
      }
    }
  }, [user, isActive, hasApiKey]);

  useEffect(() => {
    if (!user || !isActive || !hasApiKey || isSyncing) return;
    if (view !== AppView.HOME) return;
    if (showWisdomModal) return; // wait for "Enter LovSpeak" to dismiss the wisdom modal first
    try {
      const seen = localStorage.getItem(TOUR_KEY_APP);
      if (!seen) {
        const t = window.setTimeout(() => setShowTour(true), 500);
        return () => window.clearTimeout(t);
      }
    } catch { /* ignore */ }
  }, [user, isActive, hasApiKey, isSyncing, view, showWisdomModal]);

  useEffect(() => {
    (window as any).lovspeakStartTour = () => {
      try { localStorage.removeItem(TOUR_KEY_APP); } catch { /* ignore */ }
      setView(AppView.HOME);
      setShowTour(true);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSavePlan = () => {
    if (tempTargets.length > 0 && tempIntensity && tempLevel) {
      try {
        const planStartDate = getWIBDateString();
        const generatedTasks = generateDailyTasks(tempTargets, tempIntensity, tempLevel, undefined, planStartDate);
        const newPlan: LearningPlan = {
          targetIds: tempTargets,
          intensityId: tempIntensity,
          currentLevel: tempLevel,
          daysPerWeek: tempDays,
          dailyTasks: generatedTasks,
          startDate: planStartDate,
          lastGeneratedDate: planStartDate
        };

        saveLearningPlan(newPlan);
        setPlan(newPlan);

        if (userProfile) {
          const updatedProfile = { ...userProfile, level: tempLevel };
          saveUserProfile(updatedProfile);
          setUserProfile(updatedProfile);
        }

        setToast({ message: "Plan Updated Successfully", type: 'success' });
        setShowPlanModal(false);
        setStep(1);
      } catch (err) {
        console.error("Failed to save plan:", err);
        setToast({ message: "Failed to create plan. Please try again.", type: 'info' });
      }
    }
  };

  const handleAddToCalendar = () => {
    const intensity = tempIntensity || plan?.intensityId;
    if (intensity) {
      const url = generateGoogleCalendarUrl(intensity);
      window.open(url, '_blank');
    }
  };

  const openPlanModal = () => {
    setShowWisdomModal(false); // Close wisdom modal to prevent z-index conflicts
    if (plan && plan.targetIds) {
      setTempTargets(plan.targetIds);
      setTempIntensity(plan.intensityId);
      setTempLevel(plan.currentLevel);
      setTempDays(plan.daysPerWeek);
    } else {
      setTempTargets([]);
      setTempIntensity(LEARNING_INTENSITIES[1].id);
      setTempLevel(userProfile?.level || 'A1');
      setTempDays(3);
    }
    setStep(1);
    setShowPlanModal(true);
  };

  const handleAssessmentResult = (result: AssessmentResult) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, level: result.detectedLevel };
      saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    }
    setTempLevel(result.detectedLevel);
    const recommendedIds = result.recommendedFocus
      .map(f => f.toLowerCase())
      .filter(f => LEARNING_TARGETS.some(t => t.id === f))
      .slice(0, 3);

    setTempTargets(recommendedIds);
    setTempIntensity(LEARNING_INTENSITIES[1].id);
    setTempDays(4);
    setStep(2);
    setShowPlanModal(true);
    setView(AppView.HOME);
    setToast({ message: "Level Updated! Review your plan.", type: 'success' });
  };

  const toggleTarget = (id: string) => {
    if (tempTargets.includes(id)) {
      setTempTargets(tempTargets.filter(t => t !== id));
    } else {
      if (tempTargets.length < 3) setTempTargets([...tempTargets, id]);
    }
  };

  const handleStartTask = (task: DailyTask) => {
    setActiveTaskId(task.id);
    setModuleContext({ 
      title: task.title, 
      desc: task.description,
      targetLessonId: task.targetLessonId,
      shadowingTaskId: task.shadowingTaskId,
      shadowingSentenceIds: task.shadowingSentenceIds,
      bridgeId: task.bridgeId,
      bridgeIds: task.bridgeIds,
      vocabWordIds: task.vocabWordIds,
      listeningTopics: task.listeningTopics,
      goalMinutes: task.goalMinutes,
      accumulatedSeconds: task.accumulatedSeconds || 0,
      minScore: task.minScore,
      xpReward: task.xpReward,
      intensityId: task.intensityId,
      taskId: task.id,
      autoStart: true,
      type: 'daily',
      level: task.level || userProfile?.level || 'A1'
    });
    setView(task.moduleView);
  };

  const handleStartAssignment = async (assignment: UserAssignment) => {
    if (user) {
      await markUserAssignmentRead(user.uid, assignment.id).catch(() => undefined);
      setAssignedTasks(items => items.map(item => item.id === assignment.id ? { ...item, readAt: new Date().toISOString() } : item));
    }
    const target = assignment.target;
    const targetView = target.moduleView || (target.kind === 'roadmap_pack' ? AppView.ROADMAP : AppView.HOME);
    if (targetView === AppView.HOME) return;
    setActiveTaskId(null);
    setModuleContext({
      autoStart: true,
      type: target.kind === 'roadmap_pack' ? 'unit' : 'assignment',
      level: userProfile?.level || 'A1',
      title: target.title || target.topic || target.theme || assignment.title,
      desc: assignment.description || 'Tugas khusus dari admin.',
      unitId: target.packId,
      stepId: target.stepId,
      shadowingTaskId: target.shadowingTaskId,
      minScore: target.minScore,
      goalMinutes: target.targetDurationSeconds ? Math.ceil(target.targetDurationSeconds / 60) : undefined,
      promptContext: target.topic || target.theme,
      taskId: assignment.id
    });
    setView(targetView);
  };
  const handleNavigate = (targetView: AppView) => {
    setActiveTaskId(null);
    setModuleContext(null);
    setView(targetView);
  };

  const handleRoadmapNavigation = (targetView: AppView, context: any) => {
    // A roadmap step has its own completion lane; never inherit a daily-plan task.
    setActiveTaskId(null);
    setModuleContext(context);
    setView(targetView);
  };

  const saveActiveTaskProgress = (data: any) => {
    if (!plan || !activeTaskId) return;

    const todayTasks = Array.isArray(plan.dailyTasks) ? [...plan.dailyTasks] : [];
    const yesterdayTasks = Array.isArray(plan.yesterdayTasks) ? [...plan.yesterdayTasks] : [];
    let updated = false;

    const updateTask = (tasks: DailyTask[]) => {
      const idx = tasks.findIndex(t => t.id === activeTaskId);
      if (idx !== -1) {
        const currentAccumulated = tasks[idx].accumulatedSeconds || 0;
        tasks[idx] = { ...tasks[idx], accumulatedSeconds: currentAccumulated + (data.elapsedSeconds || 0) };
        updated = true;
      }
    };

    updateTask(todayTasks);
    if (!updated) updateTask(yesterdayTasks);

    if (updated) {
      const updatedPlan = { ...plan, dailyTasks: todayTasks, yesterdayTasks };
      saveLearningPlan(updatedPlan);
      setPlan(updatedPlan);
      
      if (moduleContext) {
        setModuleContext({
          ...moduleContext,
          accumulatedSeconds: (moduleContext.accumulatedSeconds || 0) + (data.elapsedSeconds || 0)
        });
      }
    }
  };

  const completeActiveTask = () => {
    const isRoadmapStep = moduleContext?.type === 'unit' && Boolean(moduleContext.stepId);
    // Roadmap and Daily Plan are independent progress lanes.
    if (!activeTaskId && !isRoadmapStep) return;
    if (!userProfile) return;
    let isGoalTask = false;
    let xpGained = 0;
    
    let todayTasks = plan && Array.isArray(plan.dailyTasks) ? [...plan.dailyTasks] : [];
    let yesterdayTasks = plan && Array.isArray(plan.yesterdayTasks) ? [...plan.yesterdayTasks] : [];

    // Mark only the roadmap step when the module originated from Roadmap.
    if (isRoadmapStep && moduleContext?.stepId) {
      completeRoadmapUnit(moduleContext.stepId);
    }

    if (activeTaskId) {
      const todayIdx = todayTasks.findIndex(t => t.id === activeTaskId);
      if (todayIdx !== -1 && !todayTasks[todayIdx].isCompleted) {
        todayTasks[todayIdx] = { ...todayTasks[todayIdx], isCompleted: true };
        xpGained = todayTasks[todayIdx].xpReward || 15;
        isGoalTask = true;
      } else {
        const yesterdayIdx = yesterdayTasks.findIndex(t => t.id === activeTaskId);
        if (yesterdayIdx !== -1 && !yesterdayTasks[yesterdayIdx].isCompleted) {
          yesterdayTasks[yesterdayIdx] = { ...yesterdayTasks[yesterdayIdx], isCompleted: true };
          xpGained = yesterdayTasks[yesterdayIdx].xpReward || 15;
          isGoalTask = true;
        }
      }
    }

    if (isGoalTask && plan) {
      const updatedPlan = {
        ...plan,
        dailyTasks: todayTasks,
        yesterdayTasks: yesterdayTasks
      };
      saveLearningPlan(updatedPlan);
      setPlan(updatedPlan);

      const updatedProfile = {
        ...userProfile,
        xp: (userProfile.xp || 0) + xpGained
      };
      saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    } else if (userProfile) {
      saveUserProfile(userProfile);
    }

    if (isGoalTask && plan) {
      const updatedPlan = { ...plan, dailyTasks: todayTasks, yesterdayTasks: yesterdayTasks };
      saveLearningPlan(updatedPlan);
      setPlan(updatedPlan);
    } else if (view === AppView.ASSESSMENT) {
      const newStoredPlan = getLearningPlan();
      if (newStoredPlan) setPlan(newStoredPlan);
      setView(AppView.HOME);
    }

    setToast({
      message: xpGained > 0 ? `Task Completed! +${xpGained} XP` : 'Task Updated!',
      type: 'success'
    });
    setActiveTaskId(null);
    if (isRoadmapStep) {
      // Keep the unit context so RoadmapModule can reopen the same mission.
      setView(AppView.ROADMAP);
    } else {
      setModuleContext(null);
      setView(AppView.HOME);
    }
  };

  const getProjectedSchedule = (days: number) => {
    if (!plan) return [];
    const schedule = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const tasks = generateDailyTasks(plan.targetIds, plan.intensityId, plan.currentLevel, date, plan.startDate);
      schedule.push({ date, tasks });
    }
    return schedule;
  };

  const renderContent = () => {
    const commonProps = {
      onComplete: completeActiveTask,
      onSaveProgress: saveActiveTaskProgress,
      onNavigate: setView,
      initialContext: moduleContext
    };

    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full transition-all duration-300">
        {(() => {
          switch (view) {
            case AppView.READING: return <ReadingModule {...commonProps} />;
            case AppView.LISTENING: return <ListeningModule {...commonProps} />;
            case AppView.GRAMMAR: return <GrammarModule {...commonProps} />;
            case AppView.VOCAB: return <VocabularyModule {...commonProps} />;
            case AppView.TRANSLATE: return <TranslateModule {...commonProps} />;
            case AppView.LIVE: return <LivePracticeModule {...commonProps} initialContext={moduleContext} />;
            case AppView.ASSESSMENT: return <AssessmentModule {...commonProps} onAssessmentResult={handleAssessmentResult} />;
            case AppView.CHAT: return <ChatModule {...commonProps} />;
            case AppView.GAMES: return <GameModule {...commonProps} />;
            case AppView.PROFILE: return <ProfileModule />;
            case AppView.ROADMAP: return <RoadmapModule {...commonProps} onNavigateToModule={handleRoadmapNavigation} />;
            case AppView.DIARY: return <DiaryModule {...commonProps} />;
            case AppView.SHADOWING: return <ShadowingModule {...commonProps} />;
            case AppView.SETTINGS: return <SettingsModule />;
            case AppView.HOME:
            default:
              const activeTargetData = plan ? LEARNING_TARGETS.filter(t => plan.targetIds.includes(t.id)) : [];
              const currentLevel = userProfile?.level || 'A1';
              const tasks = dashboardView === 'yesterday' ? (plan?.yesterdayTasks || []) : (plan?.dailyTasks || []);
              const completedTasks = tasks.filter(t => t.isCompleted).length;
              const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
              const planDayNumber = getPlanDayNumber(plan?.startDate, getWIBDateString());

              return (
                <div className="space-y-4 md:space-y-6 lg:space-y-8 animate-fade-in pb-10">
                  {/* 1. Hero / Greeting Widget - Optimized for all screens */}
                  <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-lovelya-600 to-lovelya-500 shadow-xl p-5 md:p-6 lg:p-10 text-white">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 md:w-48 md:h-48 lg:w-72 lg:h-72 bg-white opacity-10 rounded-full blur-2xl md:blur-3xl lg:blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 bg-purple-500 opacity-20 rounded-full blur-2xl md:blur-3xl lg:blur-[60px]"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-4">
                          <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] md:text-[10px] lg:text-xs font-black uppercase tracking-wider">
                            {currentLevel} Level
                          </span>
                          <span className="bg-yellow-400/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] md:text-[10px] lg:text-xs font-black uppercase tracking-wider text-yellow-200">
                            {userProfile?.xp || 0} XP
                          </span>
                        </div>
                        <h1 className="text-xl md:text-2xl lg:text-4xl font-black tracking-tight mb-1 md:mb-2 leading-tight">
                          Welcome back, <span className="text-white">
                            {userProfile?.name ? userProfile.name.split(' ')[0] : 'Lovelies'}
                          </span>
                        </h1>
                        <p className="text-lovelya-100 text-[8px] md:text-xs lg:text-base font-medium max-w-2xl opacity-90 leading-relaxed md:leading-snug">
                          Ready to continue? {tasks.length - completedTasks} tasks left today. Keep up the great work!
                        </p>
                      </div>
                      <div data-tour="hero-actions" className="flex flex-row md:flex-row gap-2 w-full md:w-auto self-stretch md:self-center">
                        <button
                          onClick={() => {
                            const randomQuote = ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
                            setCurrentQuote(randomQuote);
                            setShowWisdomModal(true);
                          }}
                          className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl font-bold transition active:scale-95 flex items-center justify-center gap-2 text-[8px] md:text-xs lg:text-sm shadow-sm"
                        >
                          <i className="fas fa-quote-left text-[7px] md:text-xs"></i> <span>Wisdom</span>
                        </button>
                        <button onClick={() => setView(AppView.ASSESSMENT)} className="flex-1 md:flex-none bg-white text-lovelya-600 px-3.5 py-2 lg:px-7 lg:py-3 rounded-xl lg:rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-lovelya-50 transition active:scale-95 flex items-center justify-center gap-2 text-[8px] md:text-xs lg:text-sm">
                          <i className="fas fa-graduation-cap text-[7px] md:text-xs"></i> <span>Test</span>
                        </button>
                        <button onClick={openPlanModal} className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-2 lg:px-6 lg:py-3 rounded-xl lg:rounded-2xl font-bold transition active:scale-95 flex items-center justify-center gap-2 text-[8px] md:text-xs lg:text-sm shadow-sm">
                          <i className="fas fa-sliders-h text-[7px] md:text-xs"></i> <span>Plan</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. Categories Grid - Redesigned for Large Screens */}
                  <div data-tour="learning-hub" className="pt-2 md:pt-4">
                    <div className="flex items-center justify-between mb-3 md:mb-6">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-1.5 h-6 bg-lovelya-600 rounded-full"></div>
                        <h3 className="text-sm md:text-2xl lg:text-3xl font-black text-gray-800 dark:text-white tracking-tight">Learning Hub</h3>
                      </div>
                      <button
                        onClick={() => setShowModules(!showModules)}
                        className="flex items-center gap-2 px-3 py-1.5 lg:px-5 lg:py-2 bg-lovelya-50 dark:bg-lovelya-900/30 text-lovelya-600 dark:text-lovelya-400 rounded-full font-bold text-[8px] md:text-xs lg:text-sm hover:bg-lovelya-100 dark:hover:bg-lovelya-900/50 transition-all active:scale-95 shadow-sm"
                      >
                        <i className={`fas ${showModules ? 'fa-eye-slash' : 'fa-eye'} text-[7px] md:text-xs`}></i>
                        {showModules ? 'Hide Modules' : 'Show Modules'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showModules && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="flex overflow-x-auto gap-3 md:gap-4 pb-2 custom-scrollbar snap-x">
                            {[
                              { id: AppView.READING, icon: 'fa-book-open', label: 'Reading', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                              { id: AppView.LISTENING, icon: 'fa-headphones', label: 'Listening', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                              { id: AppView.GRAMMAR, icon: 'fa-spell-check', label: 'Grammar', color: 'text-lovelya-500', bg: 'bg-lovelya-50 dark:bg-lovelya-900/20' },
                              { id: AppView.VOCAB, icon: 'fa-shapes', label: 'Vocab', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                              { id: AppView.LIVE, icon: 'fa-microphone-alt', label: 'Speaking', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
                              { id: AppView.SHADOWING, icon: 'fa-wave-square', label: 'Shadow', color: 'text-lovelya-600', bg: 'bg-lovelya-50 dark:bg-lovelya-900/20' },
                              { id: AppView.DIARY, icon: 'fa-book-bookmark', label: 'Diary', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                              { id: AppView.CHAT, icon: 'fa-robot', label: 'Tutor', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
                              { id: AppView.TRANSLATE, icon: 'fa-language', label: 'Translate', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                            ].map(item => (
                              <button
                                key={item.id}
                                onClick={() => handleNavigate(item.id as AppView)}
                                className="flex-shrink-0 w-[72px] md:w-28 lg:w-32 flex flex-col items-center justify-center p-3 lg:p-4 bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-lovelya-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group snap-center"
                              >
                                <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl ${item.bg} flex items-center justify-center text-sm md:text-lg lg:text-xl ${item.color} mb-2 lg:mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                                  <i className={`fas ${item.icon}`}></i>
                                </div>
                                <span className="font-bold text-gray-600 dark:text-gray-300 text-[7px] md:text-[10px] lg:text-xs text-center leading-tight">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 4. Detailed Schedule & Stats - Responsive for all screens */}
                  <div className="block">
                    {!plan ? (
                      <div data-tour="daily-missions" className="text-center py-10 md:py-24 lg:py-32 bg-white dark:bg-gray-800 rounded-3xl md:rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm px-6">
                        <div className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-lovelya-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl md:text-5xl lg:text-6xl text-lovelya-500 mx-auto mb-8 shadow-inner">
                          <i className="fas fa-rocket"></i>
                        </div>
                        <h3 className="text-xl md:text-3xl lg:text-4xl font-black text-gray-800 dark:text-white mb-3">No Active Plan</h3>
                        <p className="text-[10px] md:text-base lg:text-lg text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">Setup your personalized learning path to get daily tasks tailored to your needs and track your progress.</p>
                        <button onClick={openPlanModal} className="bg-lovelya-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-2xl lg:rounded-2xl font-black text-sm md:text-lg lg:text-xl shadow-xl hover:bg-lovelya-700 hover:shadow-2xl transition-all active:scale-95">
                          Start Training Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6 md:space-y-8">
                        <div data-tour="daily-missions" className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-7 bg-lovelya-600 rounded-full"></div>
                            <h3 className="text-sm md:text-2xl lg:text-3xl font-black text-gray-800 dark:text-white tracking-tight">Daily Missions</h3>
                          </div>
                          <div className="flex flex-col items-center sm:items-end gap-2">
                            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-2xl flex shrink-0 w-full sm:w-auto shadow-inner">
                              <button onClick={() => setDashboardView('yesterday')} className={`flex-1 sm:flex-none px-4 py-2 lg:px-6 lg:py-2.5 text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-wider rounded-xl transition-all ${dashboardView === 'yesterday' ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Yesterday</button>
                              <button onClick={() => setDashboardView('today')} className={`flex-1 sm:flex-none px-4 py-2 lg:px-6 lg:py-2.5 text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-wider rounded-xl transition-all ${dashboardView === 'today' ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Today</button>
                              <button onClick={() => setDashboardView('week')} className={`flex-1 sm:flex-none px-4 py-2 lg:px-6 lg:py-2.5 text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-wider rounded-xl transition-all ${dashboardView === 'week' ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Next 7 Days</button>
                              <button onClick={() => setDashboardView('month')} className={`flex-1 sm:flex-none px-4 py-2 lg:px-6 lg:py-2.5 text-[9px] md:text-xs lg:text-sm font-black uppercase tracking-wider rounded-xl transition-all ${dashboardView === 'month' ? 'bg-white dark:bg-gray-600 text-lovelya-600 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>Calendar</button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
                          {/* Left: Focus Areas */}
                          <div className="md:col-span-5 lg:col-span-4 space-y-4 md:space-y-5">
                            {assignedTasks.length > 0 && (
                              <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-4 md:p-5 lg:p-6 shadow-sm border-2 border-lovelya-300 dark:border-lovelya-700/70 ring-4 ring-lovelya-50 dark:ring-lovelya-900/20">
                                <div className="flex items-center justify-between gap-3 mb-3 md:mb-4">
                                  <h3 className="font-black text-gray-800 dark:text-white text-sm md:text-base lg:text-lg flex items-center gap-2"><i className="fas fa-clipboard-check text-lovelya-500" /> Tugas dari Admin</h3>
                                  <span className="text-[10px] md:text-xs font-black text-white bg-lovelya-500 px-2.5 py-1 rounded-full shrink-0">{assignedTasks.filter(item => item.status !== 'completed').length} aktif</span>
                                </div>
                                <div className="space-y-2 md:space-y-2.5 max-h-[22rem] overflow-y-auto pr-0.5">
                                  {assignedTasks.map(assignment => (
                                    <button key={assignment.id} type="button" onClick={() => void handleStartAssignment(assignment)} className="w-full text-left rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-3 md:p-3.5 hover:border-lovelya-300 hover:bg-lovelya-50/50 dark:hover:bg-gray-700 transition-colors">
                                      <div className="flex items-start justify-between gap-3"><span className="font-black text-xs md:text-sm text-gray-800 dark:text-white">{assignment.title}</span><i className="fas fa-arrow-up-right-from-square text-lovelya-500 text-[11px] md:text-xs shrink-0 mt-0.5" /></div>
                                      <div className="mt-1 text-[10px] md:text-xs text-gray-500 dark:text-gray-300">{assignment.target.packTitle || assignment.target.title || assignment.target.topic || assignment.target.theme || assignment.target.kind}</div>
                                      <div className="mt-2 flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-400"><span>{assignment.status === 'completed' ? 'Selesai' : assignment.status === 'needs_retake' ? 'Perlu retake' : 'Belum selesai'}</span>{assignment.dueAt && <span>· Tenggat {new Date(assignment.dueAt).toLocaleDateString('id-ID')}</span>}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Daily Goal + Skill Focus merged into one compact widget */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-4 md:p-5 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:opacity-20" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * progressPercent) / 100} className="text-lovelya-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-800 dark:text-white">
                                    <span className="text-sm md:text-base font-black">{progressPercent}%</span>
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-1.5 text-xs md:text-sm">
                                    <i className="fas fa-bullseye text-lovelya-500"></i> Daily Goal
                                  </h3>
                                  <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-xs font-bold mt-1">{completedTasks} of {tasks.length} missions done</p>
                                </div>
                              </div>

                              {activeTargetData.length > 0 && <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5"><i className="fas fa-star text-purple-500"></i> Skill Focus</h4>
                                <div className="flex flex-wrap gap-1.5 md:gap-2">
                                  {activeTargetData.map(t => (
                                    <div key={t.id} className="flex items-center gap-1.5 md:gap-2 pl-1.5 pr-2.5 md:pl-2 md:pr-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700/50 border border-transparent hover:border-lovelya-200 hover:bg-white dark:hover:bg-gray-700 transition-all">
                                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[9px] md:text-[10px] ${t.color} bg-white dark:bg-gray-800 shadow-sm shrink-0`}>
                                        <i className={`fas ${t.icon}`}></i>
                                      </div>
                                      <span className="font-black text-[9px] md:text-[10px] text-gray-700 dark:text-gray-200 whitespace-nowrap">{t.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>}
                            </div>
                          </div>

                          {/* Right: Task List / Schedule Views - Main Content Area */}
                          <div className="md:col-span-7 lg:col-span-8">
                            {(dashboardView === 'today' || dashboardView === 'yesterday') && (
                              <div className="grid gap-3 lg:gap-4 animate-slide-up">
                                <div className="text-[9px] lg:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-2 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-lovelya-100 dark:bg-lovelya-900/40 text-lovelya-600 dark:text-lovelya-400 px-2 py-0.5 rounded-md font-black">Day {Math.min(Math.max(1, (planDayNumber || 1) - (dashboardView === 'yesterday' ? 1 : 0)), 30)} / 30</span>
                                    <span>Strategy</span>
                                  </div>
                                  <span className="text-lovelya-600 dark:text-lovelya-400">{dashboardView === 'yesterday' ? 'Yesterday' : getWIBDateString()}</span>
                                </div>
                                {tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl border transition-all duration-500 hover:shadow-md hover:-translate-y-0.5
                                                        ${task.isCompleted
                                        ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60'
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-lovelya-300 shadow-sm'}
                                                    `}
                                  >
                                    <div className="p-3 md:p-4 lg:p-5 flex items-center gap-3 md:gap-4 lg:gap-5">
                                      <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0 transition-all duration-500 shadow-sm
                                                            ${task.isCompleted ? 'bg-green-100 text-green-600' : 'bg-lovelya-50 text-lovelya-600 group-hover:bg-lovelya-500 group-hover:text-white'}
                                                        `}>
                                        {task.isCompleted ? <i className="fas fa-check"></i> : <i className={`fas ${task.icon}`}></i>}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                          <h4 className={`font-black text-xs md:text-sm lg:text-base leading-tight truncate ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-white'}`}>
                                            {task.title}
                                          </h4>
                                          {!task.isCompleted && <span className="bg-yellow-400 text-[7px] md:text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full text-black">New</span>}
                                        </div>
                                        <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 leading-snug truncate max-w-lg">{task.description}</p>
                                      </div>

                                      {!task.isCompleted && (
                                        <button
                                          onClick={() => handleStartTask(task)}
                                          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 md:px-5 md:py-2.5 rounded-lg lg:rounded-xl font-black text-[9px] md:text-xs hover:bg-lovelya-600 dark:hover:bg-lovelya-400 hover:text-white transition-all shadow-sm hover:shadow-md shrink-0 active:scale-95 whitespace-nowrap"
                                        >
                                          Start
                                        </button>
                                      )}
                                    </div>
                                    {!task.isCompleted && <div className="absolute bottom-0 left-0 w-0 h-1 bg-lovelya-500 transition-all duration-1000 group-hover:w-full"></div>}
                                  </div>
                                ))}
                              </div>
                            )}

                            {dashboardView === 'week' && (
                              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 lg:gap-8 animate-slide-up">
                                {getProjectedSchedule(7).map((day, idx) => (
                                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-[2.5rem] lg:rounded-[3.5rem] border border-gray-100 dark:border-gray-700 p-5 md:p-6 lg:p-10 shadow-sm transition-all hover:shadow-xl">
                                    <details className="group/details" open={idx === 0}>
                                      <summary className="list-none cursor-pointer outline-none mb-2 lg:mb-4">
                                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                            <div className={`font-black px-4 py-2 lg:px-6 lg:py-3 rounded-2xl text-xs md:text-sm lg:text-base uppercase tracking-wider shadow-lg ${idx === 0 ? 'bg-lovelya-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                              {idx === 0 ? 'Today' : day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </div>
                                            <span className="text-[10px] lg:text-xs text-gray-400 font-black uppercase tracking-widest pl-1">{day.tasks.length} Missions</span>
                                          </div>
                                          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover/details:bg-lovelya-50 dark:group-hover/details:bg-lovelya-900/20 transition-colors">
                                            <i className="fas fa-chevron-down text-gray-400 group-open/details:rotate-180 transition-transform duration-300"></i>
                                          </div>
                                        </div>
                                      </summary>
                                      <div className="mt-4 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 animate-slide-up">
                                        {day.tasks.map((t, tIdx) => (
                                          <div key={tIdx} className="flex flex-col gap-2 p-3.5 lg:p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-lovelya-100 transition-all shadow-sm">
                                            <div className="flex items-center gap-3 lg:gap-4">
                                              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-sm md:text-lg text-lovelya-600 shadow-sm shrink-0">
                                                <i className={`fas ${t.icon}`}></i>
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <span className="text-xs lg:text-sm font-black text-gray-800 dark:text-white block leading-tight">{t.title}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-[9px] lg:text-[10px] text-gray-500 uppercase font-bold tracking-tighter flex items-center gap-1">
                                                    <i className="far fa-clock text-lovelya-400"></i> {t.goalMinutes}m
                                                  </span>
                                                  <span className="text-[9px] lg:text-[10px] text-gray-500 uppercase font-bold tracking-tighter flex items-center gap-1">
                                                    <i className="fas fa-star text-yellow-400"></i> {t.xpReward} XP
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                            <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{t.description}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </details>
                                  </div>
                                ))}
                              </div>
                            )}

                            {dashboardView === 'month' && (
                              <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 lg:p-14 border border-gray-100 dark:border-gray-700 shadow-xl animate-slide-up overflow-x-auto">
                                <div className="min-w-[400px]">
                                  <div className="grid grid-cols-7 gap-3 lg:gap-6 mb-8 text-center bg-gray-50 dark:bg-gray-700/50 py-4 rounded-[2rem]">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                      <div key={d} className="text-[11px] lg:text-base font-black text-gray-500 uppercase tracking-widest">{d}</div>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-7 gap-3 lg:gap-6">
                                    {getProjectedSchedule(30).map((day, idx) => {
                                      const isToday = idx === 0;
                                      const boxStyle = isToday 
                                        ? 'bg-lovelya-50 border-lovelya-200 dark:bg-lovelya-900/20 dark:border-lovelya-800/50' 
                                        : 'bg-gray-50 border-transparent dark:bg-gray-700/50';
                                      const textStyle = isToday ? 'text-lovelya-600 dark:text-lovelya-400' : 'text-gray-800 dark:text-gray-300';

                                      return (
                                        <div key={idx} className={`aspect-square rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center relative hover:bg-lovelya-600 transition-all duration-300 group cursor-default border hover:border-lovelya-300 hover:scale-105 hover:shadow-xl hover:z-10 group/day ${boxStyle}`}>
                                          <span className={`text-sm md:text-xl lg:text-2xl font-black group-hover:text-white transition-colors ${textStyle}`}>{day.date.getDate()}</span>
                                          <div className="flex gap-1 mt-1 lg:mt-2">
                                            {day.tasks.slice(0, 3).map((t, i) => {
                                              let dot = 'bg-gray-300';
                                              if (t.moduleView === AppView.READING) dot = 'bg-blue-400';
                                              if (t.moduleView === AppView.LIVE || t.moduleView === AppView.SHADOWING) dot = 'bg-red-400';
                                              if (t.moduleView === AppView.GRAMMAR || t.moduleView === AppView.VOCAB) dot = 'bg-purple-400';
                                              if (t.moduleView === AppView.LISTENING) dot = 'bg-yellow-400';
                                              return <div key={i} className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${dot} group-hover:bg-white`}></div>;
                                            })}
                                          </div>
                                          <div className="absolute bottom-full mb-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] lg:text-sm font-bold p-3 lg:p-5 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 w-48 lg:w-56 shadow-2xl scale-50 group-hover:scale-100 origin-bottom">
                                            <div className="mb-2 pb-2 border-b border-gray-100/20 text-center">{day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                                            {day.tasks.slice(0, 4).map((t, i) => (
                                              <div key={i} className="text-[10px] lg:text-xs opacity-90 mb-1.5 flex items-center gap-2">
                                                <i className={`fas ${t.icon} w-3 text-center text-lovelya-300`}></i> 
                                                <span className="truncate flex-1">{t.title}</span>
                                              </div>
                                            ))}
                                            {day.tasks.length > 4 && <div className="text-[9px] text-center mt-2 opacity-60">+{day.tasks.length - 4} more</div>}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  <div className="mt-12 flex flex-wrap justify-center gap-6 lg:gap-10 text-[10px] lg:text-sm font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 dark:bg-gray-700/50 py-5 rounded-[2rem]">
                                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></div> Reading</div>
                                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-400 shadow-sm shadow-red-400/50"></div> Speaking</div>
                                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50"></div> Grammar</div>
                                    <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-gray-300"></div> Electives</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
          }
        })()}
      </div>
    );
  };
  if (loading) {
    return (
      <SplashScreen message="Initializing LovSpeak..." stuckGuard />
    );
  }

  if (window.location.pathname.startsWith('/admin')) {
    if (!user) return <AdminLogin />;
    return <AdminPortal user={user} isAdmin={isAdmin} onLogout={signout} />;
  }

  if (!user) {
    return <LoginPage />;
  }

  // If user exists but sync is still happening, we might want to show a subtle loader 
  // but keep them on the landing page or a transition screen.
  // Actually, keeping them on LP is cleaner until we know their status.

  if (isSyncing && !isActive) {
    return (
      <SplashScreen message="Syncing your progress..." />
    );
  }

  if (!isActive) {
    return <ActivationPage />;
  }

  if (!hasApiKey) {
    return <ApiKeySetupPage />;
  }

  return (
    <Layout currentView={view} onNavigate={handleNavigate} userProfile={userProfile}>
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-lovelya-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        {renderContent()}
      </Suspense>
      <InstallPrompt />
      <ApiLimitModal onNavigateToSettings={() => setView(AppView.SETTINGS)} />

      <AnimatePresence>
        {taskPopup && (
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-2rem)] max-w-md rounded-2xl bg-white dark:bg-gray-800 border border-lovelya-200 dark:border-gray-700 shadow-2xl p-4">
            <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-lovelya-50 dark:bg-lovelya-900/30 text-lovelya-600 flex items-center justify-center shrink-0"><i className="fas fa-bell" /></div><div className="min-w-0"><p className="font-black text-sm text-gray-900 dark:text-white">{taskPopup.title}</p><p className="text-xs text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">{taskPopup.message}</p></div><button type="button" aria-label="Tutup notifikasi" onClick={() => setTaskPopup(null)} className="ml-auto text-gray-400 hover:text-gray-700"><i className="fas fa-times" /></button></div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce-in flex items-center gap-3 text-white font-bold text-sm backdrop-blur-md
            ${toast.type === 'success' ? 'bg-green-600/90' : 'bg-blue-600/90'}
        `}>
          {toast.type === 'success' && <i className="fas fa-check-circle text-lg"></i>}
          <span>{toast.message}</span>
        </div>
      )}

      {showWisdomModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative p-10 md:p-14 text-center border border-gray-200 dark:border-gray-800"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lovelya-200 via-lovelya-500 to-lovelya-200"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-lovelya-100/20 dark:bg-lovelya-900/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gray-100/50 dark:bg-gray-800/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-10">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gray-900 dark:bg-lovelya-500/10 text-lovelya-500 shadow-2xl shadow-lovelya-500/20 mx-auto transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <i className="fas fa-quote-left text-3xl"></i>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-lovelya-600 dark:text-lovelya-400 uppercase tracking-[0.4em]">Daily Wisdom</h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] w-8 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-lovelya-500"></div>
                  <div className="h-[1px] w-8 bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>

              <div className="relative px-4">
                <p className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white leading-tight tracking-tight">
                  {currentQuote.split(' (')[0]}
                </p>
              </div>

              {currentQuote.includes('(') && (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-px bg-gray-100 dark:bg-gray-800"></div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 italic tracking-wide">
                    {currentQuote.split(' (')[1].replace(')', '')}
                  </p>
                  <div className="w-6 h-px bg-gray-100 dark:bg-gray-800"></div>
                </div>
              )}

              <div className="pt-6">
                <button
                  onClick={() => setShowWisdomModal(false)}
                  className="group relative w-full py-5 bg-gray-900 dark:bg-lovelya-500 text-white dark:text-gray-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10">Enter LovSpeak</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-lovelya-400 to-lovelya-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <p className="mt-6 text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] opacity-60">
                  Excellence is a habit, not an act
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 w-8 rounded-full ${step >= i ? 'bg-lovelya-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                ))}
              </div>
              <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
            </div>

            <div className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">Select Proficiency Level</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LEVEL_DEFINITIONS.map(lvl => (
                      <button
                        key={lvl.id}
                        onClick={() => setTempLevel(lvl.id as Level)}
                        className={`text-left p-5 rounded-2xl border-2 transition group hover:shadow-md ${tempLevel === lvl.id ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20' : 'border-gray-200 dark:border-gray-600'} ${step > 1 ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-xl font-black ${tempLevel === lvl.id ? 'text-lovelya-600' : 'text-gray-400'}`}>{lvl.id}</span>
                          {tempLevel === lvl.id && <i className="fas fa-check-circle text-lovelya-500"></i>}
                        </div>
                        <div className="font-bold mt-1">{lvl.title}</div>
                        <div className="text-sm text-gray-500">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} className="w-full py-4 bg-lovelya-600 text-white rounded-xl font-bold hover:bg-lovelya-700 transition">Next</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Select Focus Areas</h2>
                    <p className="text-gray-500 text-sm font-medium">Choose up to 3 skills to prioritize in your daily plan.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
                    {LEARNING_TARGETS.map(t => {
                      const isSelected = tempTargets.includes(t.id);
                      const isMax = tempTargets.length >= 3 && !isSelected;
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleTarget(t.id)}
                          disabled={isMax}
                          className={`
                                 relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group flex items-start gap-4
                                 ${isSelected
                              ? 'border-lovelya-500 bg-lovelya-50 dark:bg-lovelya-900/20 shadow-md ring-1 ring-lovelya-200 dark:ring-lovelya-800'
                              : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-lovelya-200 dark:hover:border-gray-500 hover:shadow-sm'}
                                 ${isMax ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                               `}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-colors ${isSelected ? 'bg-lovelya-500 text-white' : `${t.color} bg-gray-50 dark:bg-gray-700`}`}>
                            <i className={`fas ${t.icon}`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-800 dark:text-white mb-1 flex items-center justify-between">
                              <span className="truncate">{t.name}</span>
                              {isSelected && <i className="fas fa-check-circle text-lovelya-500"></i>}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">
                              {t.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => setStep(1)} className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">Back</button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={tempTargets.length === 0}
                      className="flex-1 py-3.5 bg-lovelya-600 text-white rounded-xl font-bold hover:bg-lovelya-700 disabled:opacity-50 shadow-lg shadow-lovelya-200/50 transition transform active:scale-[0.98]"
                    >
                      Continue ({tempTargets.length}/3)
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center">Intensity</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {LEARNING_INTENSITIES.map(i => (
                      <button key={i.id} onClick={() => setTempIntensity(i.id)} className={`p-4 rounded-xl border-2 text-center ${tempIntensity === i.id ? 'border-lovelya-500 bg-lovelya-50' : 'border-gray-200'}`}>
                        <div className="text-2xl mb-2"><i className={`fas ${i.icon}`}></i></div>
                        <div className="font-bold text-sm">{i.name}</div>
                        <div className="text-xs text-gray-500">{i.duration}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600">Back</button>
                    <button onClick={handleSavePlan} disabled={!tempIntensity} className="flex-1 py-3 bg-lovelya-600 text-white rounded-xl font-bold hover:bg-lovelya-700 disabled:opacity-50">Finish</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <TourGuide
        steps={buildAppTourSteps({ hasPlan: !!plan })}
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        storageKey={TOUR_KEY_APP}
      />
    </Layout>
  );
};

export default App;
