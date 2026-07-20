
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Theme {
  id: string;
  name: string;
  isIslamic: boolean;
}

export interface ReadingContent {
  title: string;
  paragraphs: string[];
}

export type ReadingPracticeMode = 'read' | 'translate';

export interface ReadingIndexItem {
  id: string;
  title: string;
  mode: ReadingPracticeMode;
  level: Level;
  themeId: string;
  wordCount: number;
  tags?: string[];
}

export interface StaticReadingItem extends ReadingIndexItem {
  paragraphs: string[];
}

export interface StaticReadingTranslateItem extends ReadingIndexItem {
  paragraphs: string[];
  answerKey: string;
  sourceWordCount: number;
  targetWordCount?: number;
}

export interface ReadingProgress {
  level: Level;
  themeId: string;
  title: string;
  score: number;
  accuracy: number;
  date: string;
}

export interface ActivityLog {
  id: string;
  type: AppView;
  date: string;
  durationSeconds: number;
  score: number;
  accuracy: number;
  details?: string;
  metadata?: any;
}

export interface AdminFeedback {
  id: string;
  recipientId: string;
  authorId: string;
  authorName: string;
  message: string;
  scope: 'general' | 'task';
  taskId?: string;
  taskTitle?: string;
  createdAt: string;
  readAt?: string;
}

export interface AdminReply {
  id: string;
  authorId: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export type AssignmentKind = 'roadmap_pack' | 'grammar' | 'reading' | 'listening' | 'speaking' | 'shadowing';
export type AssignmentStatus = 'assigned' | 'in_progress' | 'completed' | 'needs_retake' | 'expired';

export interface AssignmentTarget {
  kind: AssignmentKind;
  moduleView?: AppView;
  packId?: string;
  packTitle?: string;
  packStepIds?: string[];
  stepId?: string;
  shadowingTaskId?: string;
  title?: string;
  theme?: string;
  topic?: string;
  minScore?: number;
  targetDurationSeconds?: number;
  requireQuiz?: boolean;
}

export interface AdminAssignment {
  id: string;
  title: string;
  description?: string;
  target: AssignmentTarget;
  dueAt?: string | null;
  recipientMode: 'all' | 'selected';
  recipientCount: number;
  createdBy: string;
  createdAt: string;
}

export interface UserAssignment extends AdminAssignment {
  status: AssignmentStatus;
  attempts: number;
  readAt?: string;
  completedAt?: string;
  bestScore?: number;
  bestDurationSeconds?: number;
  progressLabel?: string;
}

export interface UserNotification {
  id: string;
  kind: 'assignment' | 'broadcast';
  refId: string;
  title: string;
  message: string;
  createdAt: string;
  readAt?: string;
}

export interface VocabItem {
  id: string;
  english: string;
  indonesian: string;
  category: string;
  isUserGenerated: boolean;
  sentence?: string;
  synonyms?: string[];
  antonyms?: string[];
  examples?: string[];
  ipa?: string;
}

export interface GrammarErrorDetail {
  mistake: string;
  correction: string;
  explanation: string;
}

export interface GrammarResult {
  correctedText: string;
  generalFeedback: string;
  errors: GrammarErrorDetail[];
  score: number;
  islamicInsight?: string;
}

// --- GRAMMAR LESSON TYPES ---
export interface GrammarExample {
  text: string;
  isCorrect: boolean;
  note?: string;
  translation?: string;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export interface GrammarSection {
  heading: string;
  content: string;
  formula?: string;
  exceptions?: string;
  table?: GrammarTable;
  examples: GrammarExample[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'main' | 'sub' | 'formula' | 'example' | 'warning';
  detail?: string;
  children?: MindMapNode[];
  isInitiallyOpen?: boolean;
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: string;
  icon: string;
  description: string;
  sections: GrammarSection[];
  mindmap?: MindMapNode;
  quiz?: QuizQuestion[];
}

// --- GUIDED CURRICULUM TYPES ---
export type CurriculumStepType = 'context_bridge' | 'grammar_lesson' | 'reading_task' | 'listening_task' | 'speaking_practice' | 'quiz';

export interface CurriculumStep {
  id: string;
  title: string;
  type: CurriculumStepType;
  moduleView: AppView;
  description: string;
  goal: string;
  // Specific data for the module to auto-start
  targetId?: string; // Grammar Lesson ID or Theme ID
  promptContext?: string;
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: string;
  level: Level;
  grammarFocus: string;
  vocabTheme: string;
  description: string;
  steps: CurriculumStep[];
}

export interface LevelCurriculum {
  level: Level;
  units: CurriculumUnit[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  photoData?: string | null; // Base64 image data or null to clear
  level: Level;
  xp: number;
  weeklyInsight?: {
    text: string;
    lastGenerated: string; // ISO date
  };
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  color?: string;
  unlockedDate?: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  moduleView: AppView;
  isCompleted: boolean;
  icon: string;
  targetLessonId?: string;
  shadowingTaskId?: string;
  shadowingSentenceIds?: string[];
  bridgeId?: string;
  bridgeIds?: string[];
  vocabWordIds?: string[];
  listeningTopics?: string[];
  goalMinutes?: number;
  minScore?: number;
  xpReward?: number;
  accumulatedSeconds?: number;
  intensityId?: string;
  level?: Level;
}

export interface LearningPlan {
  targetIds: string[];
  intensityId: string;
  currentLevel: Level;
  daysPerWeek: number;
  dailyTasks: DailyTask[];
  yesterdayTasks?: DailyTask[];
  startDate?: string;
  lastGeneratedDate: string;
}

export enum AppView {
  HOME = 'HOME',
  READING = 'READING',
  LISTENING = 'LISTENING',
  GRAMMAR = 'GRAMMAR',
  VOCAB = 'VOCAB',
  TRANSLATE = 'TRANSLATE',
  LIVE = 'LIVE',
  PROFILE = 'PROFILE',
  ASSESSMENT = 'ASSESSMENT',
  CHAT = 'CHAT',
  GAMES = 'GAMES',
  ROADMAP = 'ROADMAP',
  DIARY = 'DIARY',
  SHADOWING = 'SHADOWING',
  SETTINGS = 'SETTINGS'
}

export interface AssessmentQuestion {
  id: string;
  type: 'speaking' | 'grammar' | 'reading' | 'writing';
  prompt: string;
  context?: string;
  options?: string[];
  correctIndex?: number;
}

export interface AssessmentResult {
  detectedLevel: Level;
  overallScore: number;
  sections: {
    speaking: { score: number; feedback: string };
    grammar: { score: number; feedback: string };
    reading: { score: number; feedback: string };
    writing: { score: number; feedback: string };
  };
  recommendedFocus: string[];
  summary: string;
}

export interface ModuleContext {
  taskId?: string;
  unitId?: string;
  stepId?: string;
  type?: 'unit' | 'daily' | 'assignment' | 'assessment';
  autoStart: boolean;
  level: Level;
  title: string;
  desc: string;
  grammarFocus?: string;
  vocabTheme?: string;
  vocabCategory?: string;
  vocabWordIds?: string[];
  targetLessonId?: string;
  shadowingTaskId?: string;
  shadowingSentenceIds?: string[];
  bridgeId?: string;
  bridgeIds?: string[];
  listeningTopics?: string[];
  promptContext?: string;
  minScore?: number;
  goalCount?: number;
  goalMinutes?: number;
  accumulatedSeconds?: number;
  xpReward?: number;
  intensityId?: string;
  speakingMode?: 'guided' | 'free' | 'roleplay';
}

export interface ModuleProps {
  onComplete?: () => void;
  onSaveProgress?: (data: any) => void;
  onNavigate?: (view: AppView) => void;
  initialContext?: ModuleContext | null;
  onAssessmentResult?: (result: AssessmentResult) => void;
}

export interface ShadowingTask {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
  translation: string;
  scenario?: string;
}

export interface ThematicBridgeContent {
  id: string;
  unitTitle: string;
  level: Level;
  introduction: string;
  thematicInsight: string;
  grammarConnection: string;
  scenarioTitle: string;
  scenarioDialogue: { speaker: string; text: string }[];
  keyTakeaway: string;
  cefrFocus?: string;
  proTips?: string[];
  detailedExplanation?: string;
}
