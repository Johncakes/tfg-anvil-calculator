# Solver contract

`solve({ target, rules, bounds? })` is a pure function returning either
`{ ok: true, plan: { setupActions, finalActions } }` or `{ ok: false, error }`.
Positions start at zero; bounds are inclusive. Input objects are not mutated.

## Invariants

- The complete sequence reaches the target exactly.
- Every rule matches the last three actions. Generic Hit accepts all three hit
  strengths. Multiple compatible rules may match the same action.
- Every intermediate position, including during the final actions, respects bounds.
- The plan minimizes the total number of actions within those bounds. Tie-breaking
  is deterministic but its exact order is not an API guarantee.
- Invalid or unsatisfiable requests return a failure, never a partial plan.
- Empty rules are supported by the solver for unconstrained path finding; the UI
  requires an item or at least one complete manual rule before forging.

## Bounds and zero-aligned mode

Normal mode uses 0–150, matching TFC's physical work limits. Bounds must include
zero, have integer endpoints, and lie within -150 to 150. This bounds memory and
runtime regardless of input. Targets must be integers within the supplied bounds.

TFC 1.20.x generates targets from 40 through 113 (`40 + nextInt(74)`). After manual
alignment, zero-aligned mode solves for offset zero within -40 through +37. This
interval stays inside physical 0–150 for every target in that generated range.
The resulting plan is shortest within this conservative interval, not necessarily
shortest for a particular unknown absolute target. The player must align exactly.
Custom target ranges require numeric mode; no physical safety is claimed for them
when using zero-aligned mode.

Sources:
- [ForgeRule.matches](https://github.com/TerraFirmaCraft/TerraFirmaCraft/blob/1.20.x/src/main/java/net/dries007/tfc/common/capabilities/forge/ForgeRule.java)
- [ForgeStep.LIMIT and action values](https://github.com/TerraFirmaCraft/TerraFirmaCraft/blob/1.20.x/src/main/java/net/dries007/tfc/common/capabilities/forge/ForgeStep.java)
- [AnvilRecipe.computeTarget](https://github.com/TerraFirmaCraft/TerraFirmaCraft/blob/1.20.x/src/main/java/net/dries007/tfc/common/recipes/AnvilRecipe.java)
- [AnvilBlockEntity.work bounds checks](https://github.com/TerraFirmaCraft/TerraFirmaCraft/blob/1.20.x/src/main/java/net/dries007/tfc/common/blockentities/AnvilBlockEntity.java)

## Why the search is complete

1. Breadth-first search over positions finds a shortest bounded prefix to every
   reachable position. Each edge costs one action, including backward moves.
2. Enumerate all suffixes of length zero through three: 585 possibilities for eight
   concrete actions. Keep suffixes satisfying every rule.
3. Subtract a suffix's movement from the target to find its starting position.
   Combine its shortest prefix with that suffix, checking all suffix positions.
4. Choose the candidate with the fewest total actions.

Every valid sequence has a suffix of at most three actions containing all rule
evidence. Replacing the preceding prefix with a shortest bounded path to the same
position cannot invalidate that suffix. Thus the search includes a plan no longer
than any valid sequence. Shorter suffixes also allow overlapping rules and plans
with fewer than three actions. A successful empty prefix differs from no path.

## Verification

Run `npm test`. All previously expected-failure regressions are now ordinary tests.
Every catalog recipe is checked at all generated targets 40–113 and in zero-aligned
mode, including intermediate bounds and independent rule predicates. Short complete
paths are exhaustively enumerated independently for optimality comparisons.
Additional tests cover malformed targets/rules/bounds, contradictions, unreachable
paths, shared rules, hit strengths, deterministic output, and input immutability.

The old 40–119 sweep exceeded the upstream generated range. Target 119 remains a
regression case: the scraping knife can share its Draw rules and find a safe plan;
the blowpipe requires at least 152 before its final three actions and must fail.

The UI parses numeric input without truncation, rejects incomplete/empty requests,
clears stale results after target/rule edits, and records only successful plans.
