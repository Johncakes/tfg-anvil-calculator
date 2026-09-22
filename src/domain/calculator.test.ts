import { describe, expect, it } from 'vitest';
import { ACTION_VALUES, type ResolvedActionId, type SelectedInstruction } from './actions';
import { solve, ZERO_ALIGNED_BOUNDS, type Bounds } from './calculator';
import { ANVIL_RECIPES } from './recipes';

// Independent rule predicates: never use the production sorter to validate a plan.
function satisfies(actions: ResolvedActionId[], rules: SelectedInstruction[]): boolean {
  const last = actions.slice(-3).reverse();
  return rules.every(({ action, priority }) => {
    const positions = { last: [0], 'second-last': [1], 'third-last': [2], 'not-last': [1, 2], any: [0, 1, 2] }[priority];
    return positions.some((position) => action === 'hit'
      ? ['lightHit', 'mediumHit', 'hardHit'].includes(last[position])
      : last[position] === action);
  });
}

function sum(actions: ResolvedActionId[]): number {
  return actions.reduce((total, action) => total + ACTION_VALUES[action], 0);
}

function plan(target: number, rules: SelectedInstruction[], zeroAligned = false, bounds?: Bounds): ResolvedActionId[] {
  const outcome = solve({ target, rules, bounds: bounds ?? (zeroAligned ? ZERO_ALIGNED_BOUNDS : undefined) });
  if (!outcome.ok) throw new Error(outcome.error);
  return [...outcome.plan.setupActions, ...outcome.plan.finalActions];
}

function assertPlan(actions: ResolvedActionId[], target: number, rules: SelectedInstruction[], min = 0, max = 150) {
  let position = 0;
  for (const action of actions) {
    position += ACTION_VALUES[action];
    expect(position).toBeGreaterThanOrEqual(min);
    expect(position).toBeLessThanOrEqual(max);
  }
  expect(position).toBe(target);
  expect(satisfies(actions, rules)).toBe(true);
}

// Exhaustively enumerate short complete paths, without production normalization,
// setup search, or rule ordering. Only used for tiny, bounded reference cases.
function shortestLength(target: number, rules: SelectedInstruction[], limit: number, min = 0, max = 150): number | undefined {
  let paths: ResolvedActionId[][] = [[]];
  for (let depth = 0; depth <= limit; depth++) {
    if (paths.some((path) => sum(path) === target && satisfies(path, rules))) return depth;
    if (depth === limit) break;
    paths = paths.flatMap((path) => (Object.keys(ACTION_VALUES) as ResolvedActionId[])
      .filter((action) => sum(path) + ACTION_VALUES[action] >= min && sum(path) + ACTION_VALUES[action] <= max)
      .map((action) => [...path, action]));
  }
  return undefined;
}

describe('independent rule checks', () => {
  it('treats rules as predicates, including shared actions and generic hits', () => {
    expect(satisfies(['hardHit', 'bend', 'punch'], [
      { action: 'hit', priority: 'third-last' }, { action: 'bend', priority: 'not-last' }, { action: 'punch', priority: 'last' },
    ])).toBe(true);
    expect(satisfies(['punch'], [{ action: 'punch', priority: 'last' }, { action: 'punch', priority: 'any' }])).toBe(true);
    expect(satisfies(['punch'], [{ action: 'punch', priority: 'second-last' }])).toBe(false);
    expect(satisfies(['punch', 'bend', 'draw'], [{ action: 'punch', priority: 'second-last' }])).toBe(false);
    expect(satisfies(['punch', 'bend', 'draw', 'shrink'], [{ action: 'punch', priority: 'any' }])).toBe(false);
  });
});

describe('catalog plan invariants', () => {
  for (const recipe of ANVIL_RECIPES) {
    it(`${recipe.id}: generated targets 40–113 reach the target and satisfy the rules`, () => {
      for (let target = 40; target <= 113; target++) {
        assertPlan(plan(target, recipe.instructions), target, recipe.instructions);
      }
    });
    it(`${recipe.id}: zero-aligned plan returns to the aligned offset`, () => {
      const actions = plan(0, recipe.instructions, true);
      assertPlan(actions, 0, recipe.instructions, ZERO_ALIGNED_BOUNDS.min, ZERO_ALIGNED_BOUNDS.max);
    });
  }
});

describe('small exhaustive reference cases', () => {
  const referenceRules: SelectedInstruction[][] = [
    [], [{ action: 'hit', priority: 'last' }],
    [{ action: 'punch', priority: 'second-last' }],
    [{ action: 'bend', priority: 'not-last' }, { action: 'hit', priority: 'any' }],
    [{ action: 'punch', priority: 'last' }, { action: 'punch', priority: 'any' }],
  ];
  it.each(referenceRules.map((rules, index) => ({ rules, index })))('agrees with exhaustive paths for rule set $index', ({ rules }) => {
    for (let target = 0; target <= 20; target++) {
      const expected = shortestLength(target, rules, 4, 0, 20);
      const outcome = solve({ target, rules, bounds: { min: 0, max: 20 } });
      if (expected !== undefined) {
        expect(outcome.ok).toBe(true);
        if (outcome.ok) {
          const actions = [...outcome.plan.setupActions, ...outcome.plan.finalActions];
          assertPlan(actions, target, rules, 0, 20);
          expect(actions.length).toBe(expected);
        }
      } else if (outcome.ok) {
        expect(outcome.plan.setupActions.length + outcome.plan.finalActions.length).toBeGreaterThan(4);
      }
    }
  });
  it.each([2, 7, 13, 16, 18, 20])('finds a shortest unconstrained plan for %i', (target) => {
    const actions = plan(target, []);
    assertPlan(actions, target, []);
    expect(actions.length).toBe(shortestLength(target, [], 3));
  });
  it('allows negative relative offsets in zero-aligned setup', () => {
    const rules: SelectedInstruction[] = [{ action: 'punch', priority: 'last' }];
    const actions = plan(0, rules, true);
    assertPlan(actions, 0, rules, -150, 150);
    expect(actions.length).toBe(shortestLength(0, rules, 4, -150, 150));
  });
});

describe('solver regressions', () => {
  it('shares draw rules to keep the scraping knife inside bounds at target 119', () => {
    const recipe = ANVIL_RECIPES.find((recipe) => recipe.id === 'scraping_knife_blade')!;
    assertPlan(plan(119, recipe.instructions), 119, recipe.instructions);
  });
  it('rejects a blowpipe target requiring a position above 150', () => {
    const recipe = ANVIL_RECIPES.find((recipe) => recipe.id === 'blowpipe')!;
    expect(solve({ target: 119, rules: recipe.instructions })).toEqual({
      ok: false, error: 'No plan can reach this target within the allowed bounds.',
    });
  });
  it('revisits positions reached by a backward action', () => {
    const witness: ResolvedActionId[] = ['punch', 'punch', 'lightHit', 'punch', 'punch'];
    assertPlan(witness, 5, [], 0, 5);
    assertPlan(plan(5, [], false, { min: 0, max: 5 }), 5, [], 0, 5);
  });
  it('allows overshooting the setup target to shorten a valid plan', () => {
    const recipe = ANVIL_RECIPES.find(({ id }) => id === 'unfinished_boots')!;
    const witness: ResolvedActionId[] = ['upset', 'lightHit', 'shrink', 'bend', 'bend'];
    assertPlan(witness, 40, recipe.instructions);
    expect(plan(40, recipe.instructions).length).toBeLessThanOrEqual(witness.length);
  });
  it('chooses hit strengths using the complete plan length', () => {
    const recipe = ANVIL_RECIPES.find(({ id }) => id === 'high_carbon_steel_ingot')!;
    const witness: ResolvedActionId[] = ['shrink', 'shrink', 'shrink', 'punch', 'lightHit', 'lightHit', 'lightHit'];
    assertPlan(witness, 41, recipe.instructions);
    expect(plan(41, recipe.instructions).length).toBeLessThanOrEqual(witness.length);
  });
  it('preserves second-last when other rules have Any priority', () => {
    const rules: SelectedInstruction[] = [
      { action: 'punch', priority: 'second-last' }, { action: 'bend', priority: 'any' }, { action: 'draw', priority: 'any' },
    ];
    expect(satisfies(['bend', 'punch', 'draw'], rules)).toBe(true);
    assertPlan(plan(72, rules), 72, rules);
  });
  it('shares a final action between compatible rules', () => {
    const rules: SelectedInstruction[] = [{ action: 'punch', priority: 'last' }, { action: 'punch', priority: 'any' }];
    expect(shortestLength(2, rules, 2)).toBe(1);
    assertPlan(plan(2, rules), 2, rules);
  });
});

describe('request validation and explicit failures', () => {
  it.each([NaN, Infinity, -Infinity, -1, 151, 72.9, 4294967296])('rejects invalid target %s', (target) => {
    expect(solve({ target, rules: [] }).ok).toBe(false);
  });
  it.each([
    { min: 1, max: 150 }, { min: 0, max: -1 }, { min: 0.5, max: 10 },
    { min: 0, max: Infinity }, { min: -151, max: 150 }, { min: 0, max: 151 },
  ])('rejects invalid bounds %j', (bounds) => {
    expect(solve({ target: 0, rules: [], bounds }).ok).toBe(false);
  });
  it('rejects incomplete and unknown rules at runtime', () => {
    for (const rule of [
      { action: 'punch', priority: '' }, { action: '', priority: 'last' },
      { action: 'unknown', priority: 'last' }, { action: 'punch', priority: 'unknown' },
    ]) expect(solve({ target: 72, rules: [rule as SelectedInstruction] }).ok).toBe(false);
  });
  it('rejects more than three rules', () => {
    expect(solve({ target: 72, rules: Array.from({ length: 4 }, () => ({ action: 'hit', priority: 'last' })) }).ok).toBe(false);
  });
  it('reports conflicting rules', () => {
    expect(solve({ target: 72, rules: [{ action: 'punch', priority: 'last' }, { action: 'bend', priority: 'last' }] }))
      .toEqual({ ok: false, error: 'These rules conflict: no final sequence can satisfy all of them.' });
  });
  it('distinguishes unreachable targets from successful empty plans', () => {
    expect(solve({ target: 1, rules: [], bounds: { min: 0, max: 1 } }).ok).toBe(false);
    expect(solve({ target: 0, rules: [] })).toEqual({ ok: true, plan: { setupActions: [], finalActions: [] } });
    expect(solve({ target: 2, rules: [{ action: 'punch', priority: 'last' }] }))
      .toEqual({ ok: true, plan: { setupActions: [], finalActions: ['punch'] } });
  });
  it('is deterministic and does not mutate rules or bounds', () => {
    const rule = Object.freeze({ action: 'hit', priority: 'last' } as const);
    const request = { target: 72, rules: Object.freeze([rule]), bounds: Object.freeze({ min: 0, max: 150 }) };
    expect(solve(request)).toEqual(solve(request));
  });
});
