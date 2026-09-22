import { describe, expect, it } from 'vitest';
import {
  ACTION_VALUES,
  type ResolvedActionId,
  type ResolvedInstruction,
  type SelectedInstruction,
} from './actions';
import { calculateSetupActions, normalizeInstructions, sortInstructions } from './calculator';
import { ANVIL_RECIPES } from './recipes';

function total(actions: ResolvedActionId[]): number {
  return actions.reduce((sum, action) => sum + ACTION_VALUES[action], 0);
}

describe('instruction normalization', () => {
  it('resolves generic Hit to a concrete hit action', () => {
    const instructions: SelectedInstruction[] = [{ action: 'hit', priority: 'last' }];

    expect(normalizeInstructions(instructions, 72)).toEqual([
      { action: 'lightHit', priority: 'last' },
    ]);
  });

  it('resolves each Hit using the running instruction sum', () => {
    const instructions: SelectedInstruction[] = [
      { action: 'punch', priority: 'third-last' },
      { action: 'hit', priority: 'second-last' },
    ];

    expect(normalizeInstructions(instructions, 72)).toEqual([
      { action: 'punch', priority: 'third-last' },
      { action: 'lightHit', priority: 'second-last' },
    ]);
  });
});

describe('final instruction ordering', () => {
  it('keeps Finally equal in length to selected instructions', () => {
    const instructions: ResolvedInstruction[] = [
      { action: 'punch', priority: 'last' },
      { action: 'draw', priority: 'second-last' },
      { action: 'bend', priority: 'third-last' },
    ];

    expect(sortInstructions(instructions)).toEqual([
      { action: 'bend', priority: 'third-last' },
      { action: 'draw', priority: 'second-last' },
      { action: 'punch', priority: 'last' },
    ]);
  });

  it('places Any instructions between fixed final positions', () => {
    const instructions: ResolvedInstruction[] = [
      { action: 'punch', priority: 'last' },
      { action: 'bend', priority: 'any' },
      { action: 'draw', priority: 'second-last' },
    ];

    expect(sortInstructions(instructions)).toEqual([
      { action: 'bend', priority: 'any' },
      { action: 'draw', priority: 'second-last' },
      { action: 'punch', priority: 'last' },
    ]);
  });

  it('preserves every built-in recipe instruction in Finally', () => {
    for (const recipe of ANVIL_RECIPES) {
      const normalized = normalizeInstructions(recipe.instructions, 72);
      expect(sortInstructions(normalized)).toHaveLength(recipe.instructions.length);
    }
  });
});

describe('setup calculation', () => {
  it('finds the previous nonnegative setup path', () => {
    const setup = calculateSetupActions(10, []);

    expect(setup).toEqual(['punch', 'punch', 'punch', 'punch', 'punch']);
    expect(total(setup)).toBe(10);
  });

  it('keeps setup empty when final instructions already reach the target', () => {
    expect(calculateSetupActions(2, [{ action: 'punch', priority: 'last' }])).toEqual([]);
  });

  it('allows zero-aligned setup to start below zero', () => {
    const finalInstructions: ResolvedInstruction[] = [{ action: 'punch', priority: 'last' }];
    const setup = calculateSetupActions(0, finalInstructions, { allowBelowZeroSetup: true });

    expect(total(setup)).toBe(-2);
  });

  it('returns setup in execution order', () => {
    const setup = calculateSetupActions(23, []);

    expect(total(setup)).toBe(23);
    expect(setup.length).toBeGreaterThan(0);
  });
});
