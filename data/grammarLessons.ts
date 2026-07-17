
import { GrammarLesson } from '../types';
import { LEVEL_A1 } from './grammar/levelA1';
import { LEVEL_A2 } from './grammar/levelA2';
import { LEVEL_B1 } from './grammar/levelB1';
import { LEVEL_B2 } from './grammar/levelB2';
import { LEVEL_C1 } from './grammar/levelC1';
import { LEVEL_C2 } from './grammar/levelC2';

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  ...LEVEL_A1,
  ...LEVEL_A2,
  ...LEVEL_B1,
  ...LEVEL_B2,
  ...LEVEL_C1,
  ...LEVEL_C2
];
