// Assessment Test Template Packs
// 6 packs × 10 questions each (2 Speaking + 6 Grammar MCQ + 2 Writing)
// Grammar questions include correctIndex and difficulty level for analysis

import { AssessmentQuestion } from '../../types';

export interface AssessmentTemplatePack {
  id: string;
  questions: (AssessmentQuestion & { difficulty?: 'easy' | 'medium' | 'hard' })[];
}

export const ASSESSMENT_PACKS: AssessmentTemplatePack[] = [
  // ============================
  // PACK 1: Daily Life & Habits
  // ============================
  {
    id: 'pack_1',
    questions: [
      // --- SPEAKING (2) ---
      {
        id: 'p1_s1',
        type: 'speaking',
        prompt: 'Describe your typical morning routine from the moment you wake up. What do you do first, and why?',
      },
      {
        id: 'p1_s2',
        type: 'speaking',
        prompt: 'Tell me about a meal you recently enjoyed. Who prepared it, what was in it, and why was it special?',
      },
      // --- GRAMMAR (6) ---
      {
        id: 'p1_g1',
        type: 'grammar',
        prompt: 'She _____ to the library every Saturday.',
        options: ['go', 'goes', 'going', 'gone'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p1_g2',
        type: 'grammar',
        prompt: 'I have been living here _____ 2018.',
        options: ['for', 'since', 'from', 'during'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p1_g3',
        type: 'grammar',
        prompt: 'If I _____ enough money, I would buy a new laptop.',
        options: ['have', 'has', 'had', 'having'],
        correctIndex: 2,
        difficulty: 'medium',
      },
      {
        id: 'p1_g4',
        type: 'grammar',
        prompt: 'The report must _____ before Friday.',
        options: ['be completed', 'completed', 'be completing', 'to complete'],
        correctIndex: 0,
        difficulty: 'medium',
      },
      {
        id: 'p1_g5',
        type: 'grammar',
        prompt: 'Neither the students nor the teacher _____ aware of the schedule change.',
        options: ['were', 'was', 'are', 'have been'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      {
        id: 'p1_g6',
        type: 'grammar',
        prompt: 'Had she known about the delay, she _____ left earlier.',
        options: ['will have', 'would have', 'could', 'should'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      // --- WRITING (2) ---
      {
        id: 'p1_w1',
        type: 'writing',
        prompt: 'Write about a good habit you developed recently. How did you start it, and how has it changed your daily life?',
      },
      {
        id: 'p1_w2',
        type: 'writing',
        prompt: 'Describe a place in your neighborhood that you visit often. What makes it important to you?',
      },
    ],
  },

  // ============================
  // PACK 2: Education & Learning
  // ============================
  {
    id: 'pack_2',
    questions: [
      // --- SPEAKING (2) ---
      {
        id: 'p2_s1',
        type: 'speaking',
        prompt: 'Tell me about a subject you enjoyed studying at school. What made it interesting for you?',
      },
      {
        id: 'p2_s2',
        type: 'speaking',
        prompt: 'Describe a time when you learned something new outside of school. How did you learn it, and what was the result?',
      },
      // --- GRAMMAR (6) ---
      {
        id: 'p2_g1',
        type: 'grammar',
        prompt: 'There _____ many books on the shelf.',
        options: ['is', 'are', 'was', 'has'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p2_g2',
        type: 'grammar',
        prompt: 'She asked me where I _____.',
        options: ['live', 'lived', 'living', 'lives'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p2_g3',
        type: 'grammar',
        prompt: 'By the time we arrived, the lecture _____.',
        options: ['already started', 'had already started', 'has already started', 'already starts'],
        correctIndex: 1,
        difficulty: 'medium',
      },
      {
        id: 'p2_g4',
        type: 'grammar',
        prompt: 'The students are looking forward _____ the field trip.',
        options: ['to', 'for', 'at', 'in'],
        correctIndex: 0,
        difficulty: 'medium',
      },
      {
        id: 'p2_g5',
        type: 'grammar',
        prompt: 'Not only _____ the exam, but she also received a scholarship.',
        options: ['she passed', 'did she pass', 'she did pass', 'passed she'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      {
        id: 'p2_g6',
        type: 'grammar',
        prompt: 'The research, along with its findings, _____ published in a prestigious journal.',
        options: ['were', 'are', 'was', 'have been'],
        correctIndex: 2,
        difficulty: 'hard',
      },
      // --- WRITING (2) ---
      {
        id: 'p2_w1',
        type: 'writing',
        prompt: 'Do you think online learning is as effective as learning in a classroom? Explain your opinion with reasons.',
      },
      {
        id: 'p2_w2',
        type: 'writing',
        prompt: 'Write about a teacher or mentor who had a positive impact on your life. What did they teach you?',
      },
    ],
  },

  // ============================
  // PACK 3: Family & Relationships
  // ============================
  {
    id: 'pack_3',
    questions: [
      // --- SPEAKING (2) ---
      {
        id: 'p3_s1',
        type: 'speaking',
        prompt: 'Describe a family member you are close to. What kind of person are they, and what do you enjoy doing together?',
      },
      {
        id: 'p3_s2',
        type: 'speaking',
        prompt: 'Tell me about a family tradition or gathering that is meaningful to you. What happens during this event?',
      },
      // --- GRAMMAR (6) ---
      {
        id: 'p3_g1',
        type: 'grammar',
        prompt: 'My mother _____ cooking when I came home.',
        options: ['is', 'was', 'were', 'has been'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p3_g2',
        type: 'grammar',
        prompt: 'They have known each other _____ a long time.',
        options: ['since', 'for', 'during', 'while'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p3_g3',
        type: 'grammar',
        prompt: 'I wish I _____ more time to spend with my grandparents.',
        options: ['have', 'has', 'had', 'having'],
        correctIndex: 2,
        difficulty: 'medium',
      },
      {
        id: 'p3_g4',
        type: 'grammar',
        prompt: 'She is the person _____ helped me the most during difficult times.',
        options: ['which', 'whom', 'who', 'whose'],
        correctIndex: 2,
        difficulty: 'medium',
      },
      {
        id: 'p3_g5',
        type: 'grammar',
        prompt: 'Rarely _____ my father complain about his work.',
        options: ['do', 'does', 'did', 'has'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      {
        id: 'p3_g6',
        type: 'grammar',
        prompt: 'It is essential that every child _____ access to quality education.',
        options: ['has', 'have', 'had', 'having'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      // --- WRITING (2) ---
      {
        id: 'p3_w1',
        type: 'writing',
        prompt: 'Write about a lesson you learned from an older family member. How has this lesson shaped your character?',
      },
      {
        id: 'p3_w2',
        type: 'writing',
        prompt: 'Describe how your family supports each other during challenging times. Give a specific example.',
      },
    ],
  },

  // ============================
  // PACK 4: Health & Well-being
  // ============================
  {
    id: 'pack_4',
    questions: [
      // --- SPEAKING (2) ---
      {
        id: 'p4_s1',
        type: 'speaking',
        prompt: 'What do you do to stay healthy? Describe your routine for taking care of your body and mind.',
      },
      {
        id: 'p4_s2',
        type: 'speaking',
        prompt: 'Tell me about a time you felt unwell. What happened, and how did you recover?',
      },
      // --- GRAMMAR (6) ---
      {
        id: 'p4_g1',
        type: 'grammar',
        prompt: 'You should drink _____ water every day.',
        options: ['many', 'much', 'a lot', 'enough'],
        correctIndex: 3,
        difficulty: 'easy',
      },
      {
        id: 'p4_g2',
        type: 'grammar',
        prompt: 'He _____ exercising for an hour when it started to rain.',
        options: ['has been', 'had been', 'was being', 'is being'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p4_g3',
        type: 'grammar',
        prompt: 'If you _____ earlier, you would feel more refreshed.',
        options: ['sleep', 'slept', 'sleeping', 'had slept'],
        correctIndex: 1,
        difficulty: 'medium',
      },
      {
        id: 'p4_g4',
        type: 'grammar',
        prompt: 'The doctor advised him _____ smoking immediately.',
        options: ['to stop', 'stop', 'stopping', 'stopped'],
        correctIndex: 0,
        difficulty: 'medium',
      },
      {
        id: 'p4_g5',
        type: 'grammar',
        prompt: 'So concerned _____ about her health that she changed her entire lifestyle.',
        options: ['she was', 'was she', 'she is', 'is she'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      {
        id: 'p4_g6',
        type: 'grammar',
        prompt: 'Were it not for regular exercise, he _____ recovered so quickly.',
        options: ['would not have', 'will not have', 'did not', 'has not'],
        correctIndex: 0,
        difficulty: 'hard',
      },
      // --- WRITING (2) ---
      {
        id: 'p4_w1',
        type: 'writing',
        prompt: 'Write about why maintaining a balanced diet is important. What challenges do people face in eating healthy?',
      },
      {
        id: 'p4_w2',
        type: 'writing',
        prompt: 'Describe how physical activity or exercise has benefited you or someone you know. Give specific examples.',
      },
    ],
  },

  // ============================
  // PACK 5: Work & Ambition
  // ============================
  {
    id: 'pack_5',
    questions: [
      // --- SPEAKING (2) ---
      {
        id: 'p5_s1',
        type: 'speaking',
        prompt: 'What kind of work or career interests you the most? Explain why this field appeals to you.',
      },
      {
        id: 'p5_s2',
        type: 'speaking',
        prompt: 'Describe a goal you are currently working toward. What steps have you taken so far to achieve it?',
      },
      // --- GRAMMAR (6) ---
      {
        id: 'p5_g1',
        type: 'grammar',
        prompt: 'She _____ at this company for five years now.',
        options: ['works', 'worked', 'has worked', 'is working'],
        correctIndex: 2,
        difficulty: 'easy',
      },
      {
        id: 'p5_g2',
        type: 'grammar',
        prompt: 'The manager asked us _____ the report by Monday.',
        options: ['finish', 'to finish', 'finishing', 'finished'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p5_g3',
        type: 'grammar',
        prompt: 'I would apply for that position if I _____ the required experience.',
        options: ['have', 'has', 'had', 'will have'],
        correctIndex: 2,
        difficulty: 'medium',
      },
      {
        id: 'p5_g4',
        type: 'grammar',
        prompt: 'The project, which _____ last month, is now nearly finished.',
        options: ['began', 'begun', 'beginning', 'has began'],
        correctIndex: 0,
        difficulty: 'medium',
      },
      {
        id: 'p5_g5',
        type: 'grammar',
        prompt: 'Only after he had submitted his resignation _____ realize his mistake.',
        options: ['he did', 'did he', 'he does', 'does he'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      {
        id: 'p5_g6',
        type: 'grammar',
        prompt: 'The committee insists that every applicant _____ a written examination.',
        options: ['takes', 'take', 'took', 'taking'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      // --- WRITING (2) ---
      {
        id: 'p5_w1',
        type: 'writing',
        prompt: 'What qualities do you think a good leader should have? Describe these qualities with examples from real life.',
      },
      {
        id: 'p5_w2',
        type: 'writing',
        prompt: 'Write about a time you faced a challenge at work or in a project. How did you overcome it, and what did you learn?',
      },
    ],
  },

  // ============================
  // PACK 6: Community & Environment
  // ============================
  {
    id: 'pack_6',
    questions: [
      // --- SPEAKING (2) ---
      {
        id: 'p6_s1',
        type: 'speaking',
        prompt: 'Describe your neighborhood or community. What do you like about it, and what would you change?',
      },
      {
        id: 'p6_s2',
        type: 'speaking',
        prompt: 'Tell me about a community event or activity you participated in. What was your role, and what did you gain from it?',
      },
      // --- GRAMMAR (6) ---
      {
        id: 'p6_g1',
        type: 'grammar',
        prompt: 'We should take care _____ our environment.',
        options: ['for', 'of', 'about', 'with'],
        correctIndex: 1,
        difficulty: 'easy',
      },
      {
        id: 'p6_g2',
        type: 'grammar',
        prompt: 'The children _____ playing in the park when it started raining.',
        options: ['are', 'is', 'was', 'were'],
        correctIndex: 3,
        difficulty: 'easy',
      },
      {
        id: 'p6_g3',
        type: 'grammar',
        prompt: 'If everyone _____ their part, the city would be much cleaner.',
        options: ['do', 'does', 'did', 'doing'],
        correctIndex: 2,
        difficulty: 'medium',
      },
      {
        id: 'p6_g4',
        type: 'grammar',
        prompt: 'The volunteers, _____ worked tirelessly, deserved recognition.',
        options: ['which', 'who', 'whom', 'whose'],
        correctIndex: 1,
        difficulty: 'medium',
      },
      {
        id: 'p6_g5',
        type: 'grammar',
        prompt: 'Under no circumstances _____ littering be tolerated in this area.',
        options: ['should', 'shall', 'can', 'would'],
        correctIndex: 0,
        difficulty: 'hard',
      },
      {
        id: 'p6_g6',
        type: 'grammar',
        prompt: 'Had the government invested in renewable energy sooner, the environmental damage _____ less severe.',
        options: ['would be', 'would have been', 'will be', 'has been'],
        correctIndex: 1,
        difficulty: 'hard',
      },
      // --- WRITING (2) ---
      {
        id: 'p6_w1',
        type: 'writing',
        prompt: 'What can individuals do to protect the environment in their daily lives? Give practical suggestions with explanations.',
      },
      {
        id: 'p6_w2',
        type: 'writing',
        prompt: 'Write about the importance of helping others in your community. Share an experience where you or someone you know made a difference.',
      },
    ],
  },
];

// Select a random pack, excluding the last 3 recently used packs
// This ensures a pack won't repeat until at least 3 other tests have been taken
const RECENT_PACKS_COOLDOWN = 3;

export const getRandomAssessmentPack = (recentPackIds: string[] = []): AssessmentTemplatePack => {
  let availablePacks = ASSESSMENT_PACKS;
  
  // Exclude recently used packs (up to last 3)
  if (recentPackIds.length > 0) {
    const filtered = ASSESSMENT_PACKS.filter(p => !recentPackIds.includes(p.id));
    // Safety: if all packs are excluded (shouldn't happen with 6 packs / 3 cooldown), use all
    if (filtered.length > 0) {
      availablePacks = filtered;
    }
  }
  
  const randomIndex = Math.floor(Math.random() * availablePacks.length);
  return availablePacks[randomIndex];
};

// Helper to get recent pack history from localStorage
export const getRecentAssessmentPacks = (): string[] => {
  try {
    const stored = localStorage.getItem('lovelya_recent_assessment_packs');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

// Helper to save a pack ID to the recent history (keeps last 3)
export const saveRecentAssessmentPack = (packId: string): void => {
  const recent = getRecentAssessmentPacks();
  // Add to front, remove duplicates, keep only last RECENT_PACKS_COOLDOWN
  const updated = [packId, ...recent.filter(id => id !== packId)].slice(0, RECENT_PACKS_COOLDOWN);
  localStorage.setItem('lovelya_recent_assessment_packs', JSON.stringify(updated));
};

