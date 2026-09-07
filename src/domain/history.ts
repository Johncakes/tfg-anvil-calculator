import { findRecipe, type AnvilRecipe } from './recipes';

const HISTORY_STORAGE_KEY = 'tfg-anvil-history';
const HISTORY_LIMIT = 8;

/**
 * One past calculation: what was forged, and the target it was forged to. The target belongs to
 * the entry rather than to the item, because it is generated from the world seed and the in-game
 * recipe id, which includes the metal — the same item has a different target in every metal.
 */
export interface HistoryEntry {
  recipeId: string;
  target: number;
  /** Zero-aligned runs allow setup below zero, so the mode has to come back with the entry. */
  zeroAligned: boolean;
}

/** An entry paired with the recipe it names, so the list can render without another lookup. */
export interface HistoryItem extends HistoryEntry {
  recipe: AnvilRecipe;
}

function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<HistoryEntry>;
  return (
    typeof candidate.recipeId === 'string' &&
    Number.isInteger(candidate.target) &&
    (candidate.target as number) >= 0 &&
    typeof candidate.zeroAligned === 'boolean'
  );
}

function sameEntry(a: HistoryEntry, b: HistoryEntry): boolean {
  return a.recipeId === b.recipeId && a.target === b.target && a.zeroAligned === b.zeroAligned;
}

/** Entries whose item no longer exists are dropped, so a renamed recipe cannot linger. */
function toItems(entries: HistoryEntry[]): HistoryItem[] {
  return entries.flatMap((entry) => {
    const recipe = findRecipe(entry.recipeId);
    return recipe ? [{ ...entry, recipe }] : [];
  });
}

function readEntries(): HistoryEntry[] {
  try {
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: HistoryEntry[]): void {
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage can be unavailable (private browsing, blocked site data); the history is optional.
  }
}

export function readHistory(): HistoryItem[] {
  return toItems(readEntries());
}

/** Records a calculation, newest first, and returns the history as it now stands. */
export function rememberCalculation(entry: HistoryEntry): HistoryItem[] {
  if (!findRecipe(entry.recipeId)) {
    return readHistory();
  }

  // Forging the same item to the same target again moves it back to the top rather than
  // taking a second row; a different target is a different entry.
  const nextEntries = [entry, ...readEntries().filter((stored) => !sameEntry(stored, entry))].slice(
    0,
    HISTORY_LIMIT,
  );

  writeEntries(nextEntries);
  return toItems(nextEntries);
}

export function clearHistory(): HistoryItem[] {
  try {
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // See writeEntries.
  }

  return [];
}
