import {
  ACTION_VALUES, PICKABLE_ACTIONS, PRIORITIES,
  type ResolvedActionId, type SelectedInstruction,
} from './actions';

export interface Bounds { min: number; max: number }
export const ANVIL_BOUNDS: Bounds = { min: 0, max: 150 };
// TFC 1.20.x generates targets 40–113. These offsets stay inside 0–150
// for every such target, even when the player cannot read its numeric value.
export const ZERO_ALIGNED_BOUNDS: Bounds = { min: -40, max: 37 };

export interface CalculationResult {
  setupActions: ResolvedActionId[];
  finalActions: ResolvedActionId[];
}

export type SolveResult =
  | { ok: true; plan: CalculationResult }
  | { ok: false; error: string };

interface SolveRequest {
  target: number;
  rules: readonly SelectedInstruction[];
  /** Inclusive positions relative to the starting position, which is always 0. */
  bounds?: Bounds;
}

const actions = Object.keys(ACTION_VALUES) as ResolvedActionId[];
const positions = {
  last: [0], 'second-last': [1], 'third-last': [2],
  'not-last': [1, 2], any: [0, 1, 2],
} as const;

function matches(final: ResolvedActionId[], rules: readonly SelectedInstruction[]): boolean {
  return rules.every((rule) => positions[rule.priority].some((offset) => {
    const action = final[final.length - 1 - offset];
    return rule.action === 'hit'
      ? action === 'lightHit' || action === 'mediumHit' || action === 'hardHit'
      : action === rule.action;
  }));
}

/** Find a shortest complete plan, not separately optimized setup/final parts.
 * All rule-relevant suffixes have at most three actions (8³ possibilities).
 * A BFS supplies a shortest bounded prefix for every possible suffix start.
 * Together these cover every valid plan, including overlapping rules and hits.
 */
export function solve({ target, rules, bounds = ANVIL_BOUNDS }: SolveRequest): SolveResult {
  const { min, max } = bounds;
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > 0 || max < 0 || min < -150 || max > 150) {
    return { ok: false, error: 'Bounds must be whole numbers within -150 to 150 and include the starting position 0.' };
  }
  if (!Number.isInteger(target) || target < min || target > max) {
    return { ok: false, error: `Enter a whole-number target between ${min} and ${max}.` };
  }
  if (rules.length > 3 || rules.some((rule) =>
    !PICKABLE_ACTIONS.includes(rule.action) || !PRIORITIES.some(({ value }) => value !== '' && value === rule.priority))) {
    return { ok: false, error: 'Choose up to three complete action and priority rules.' };
  }

  const paths = new Map<number, ResolvedActionId[]>([[0, []]]);
  const queue = [0];
  for (let index = 0; index < queue.length; index++) {
    const position = queue[index];
    for (const action of actions) {
      const next = position + ACTION_VALUES[action];
      if (next < min || next > max || paths.has(next)) continue;
      paths.set(next, [...paths.get(position)!, action]);
      queue.push(next);
    }
  }

  let best: CalculationResult | undefined;
  let bestLength = Infinity;
  let consistent = false;

  function visit(final: ResolvedActionId[], delta: number) {
    if (matches(final, rules)) {
      consistent = true;
      let position = target - delta;
      const setup = paths.get(position);
      if (setup && setup.length + final.length < bestLength) {
        const withinBounds = final.every((action) => {
          position += ACTION_VALUES[action];
          return position >= min && position <= max;
        });
        if (withinBounds) {
          best = { setupActions: setup, finalActions: final };
          bestLength = setup.length + final.length;
        }
      }
    }
    if (final.length < 3) {
      for (const action of actions) visit([...final, action], delta + ACTION_VALUES[action]);
    }
  }

  visit([], 0);
  if (best) return { ok: true, plan: best };
  return { ok: false, error: consistent
    ? 'No plan can reach this target within the allowed bounds.'
    : 'These rules conflict: no final sequence can satisfy all of them.' };
}
