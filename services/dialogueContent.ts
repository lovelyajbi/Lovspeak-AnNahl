import { DialogueScenario } from '../types';

let cached: DialogueScenario[] | null = null;

export const getDialogueScenarios = async (): Promise<DialogueScenario[]> => {
  if (cached) return cached;
  const module = await import('../data/dialogues/scenarios.json');
  cached = module.default as DialogueScenario[];
  return cached;
};
