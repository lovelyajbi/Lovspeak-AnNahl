
import { GrammarLesson } from '../../types';

export const LEVEL_ADVANCED: GrammarLesson[] = [
  // --- C1 ---
  {
    id: 'c1-inversion', title: 'Inversion (Stylistic)', level: 'C1', icon: 'fa-sort', description: 'Never have I seen...',
    sections: [{ heading: '1. Negative Adverbials', content: 'Reversing subject/verb for drama.', examples: [{ text: 'Rarely do we see such rain.', isCorrect: true }] }],
    mindmap: { id: 'inv', label: 'Inversion', type: 'root' }
  },
  {
    id: 'c1-mixed-conditionals', title: 'Mixed Conditionals', level: 'C1', icon: 'fa-code-branch', description: 'Past to Present result.',
    sections: [{ heading: '1. Mixed Logic', content: 'If I had known (past), I would be (now).', examples: [{ text: 'If I had won, I would be rich now.', isCorrect: true }] }],
    mindmap: { id: 'mx', label: 'Mixed If', type: 'root' }
  },
  { id: 'c1-participle', title: 'Participle Clauses', level: 'C1', icon: 'fa-cut', description: 'Sentence reduction.', sections: [], mindmap: { id: 'pc', label: 'Participles', type: 'root' } },
  { id: 'c1-future-perfect-cont', title: 'Future Perfect Continuous', level: 'C1', icon: 'fa-hourglass', description: 'Will have been doing.', sections: [], mindmap: { id: 'fpc', label: 'Future Perf Cont', type: 'root' } },
  
  // --- C2 ---
  {
    id: 'c2-subjunctive', title: 'The Subjunctive', level: 'C2', icon: 'fa-crown', description: 'I suggest he go.',
    sections: [{ heading: '1. Mandative Subjunctive', content: 'Bare infinitive for formal advice.', examples: [{ text: 'It is vital he attend.', isCorrect: true }] }],
    mindmap: { id: 'subju', label: 'Subjunctive', type: 'root' }
  },
  {
    id: 'c2-cleft', title: 'Cleft Sentences', level: 'C2', icon: 'fa-magic', description: 'It is... that...',
    sections: [{ heading: '1. Focus', content: 'It was John who broke it.', examples: [{ text: 'What I need is coffee.', isCorrect: true }] }],
    mindmap: { id: 'clft', label: 'Clefts', type: 'root' }
  },
  { id: 'c2-impersonal-passive', title: 'Impersonal Passive', level: 'C2', icon: 'fa-newspaper', description: 'It is said that...', sections: [], mindmap: { id: 'impas', label: 'Public Passive', type: 'root' } },
  { id: 'c2-discourse-markers', title: 'Discourse Markers', level: 'C2', icon: 'fa-pen-fancy', description: 'Albeit, Notwithstanding.', sections: [], mindmap: { id: 'dm', label: 'Academic Linkers', type: 'root' } },
  { id: 'c2-ellipsis', title: 'Ellipsis & Substitution', level: 'C2', icon: 'fa-ghost', description: 'Skipping words.', sections: [], mindmap: { id: 'els', label: 'Ellipsis', type: 'root' } },
  { id: 'c2-nominalization', title: 'Nominalization', level: 'C2', icon: 'fa-font', description: 'Nouns for formality.', sections: [], mindmap: { id: 'nom', label: 'Nouns Power', type: 'root' } },
  { id: 'c2-double-comp', title: 'Double Comparatives', level: 'C2', icon: 'fa-equals', description: 'The more, the better.', sections: [], mindmap: { id: 'dbc', label: 'Correlation', type: 'root' } }
];
