const TARGET_STORAGE_KEY = 'tfg-anvil-targets';

type TargetMemory = Record<string, number>;

/**
 * Target values are `40 + hash(recipe id)` seeded by the world seed, so a given item always has
 * the same target within one world. Remembering it means the value only has to be typed once.
 */
function readMemory(): TargetMemory {
  try {
    const stored = window.localStorage.getItem(TARGET_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    return parsed && typeof parsed === 'object' ? (parsed as TargetMemory) : {};
  } catch {
    return {};
  }
}

export function recallTarget(recipeId: string): number | null {
  const target = readMemory()[recipeId];
  return Number.isInteger(target) ? target : null;
}

export function rememberTarget(recipeId: string, targetValue: number): void {
  try {
    const memory = readMemory();
    memory[recipeId] = targetValue;
    window.localStorage.setItem(TARGET_STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // Storage can be unavailable (private browsing, blocked site data); remembering is optional.
  }
}
