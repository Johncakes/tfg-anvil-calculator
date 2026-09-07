import { useId, useMemo, useState } from 'react';
import HistoryPanel from './components/HistoryPanel';
import InstructionRow from './components/InstructionRow';
import ItemPicker from './components/ItemPicker';
import ModeTabs, { type SmithingMode } from './components/ModeTabs';
import ResultStrip from './components/ResultStrip';
import ThemeToggle from './components/ThemeToggle';
import {
  emptyInstruction,
  type Instruction,
  type ResolvedActionId,
  type SelectedInstruction,
} from './domain/actions';
import { calculateSetupActions, normalizeInstructions, sortInstructions } from './domain/calculator';
import type { HistoryItem } from './domain/history';
import { findRecipe, type AnvilRecipe } from './domain/recipes';
import { useHistory } from './hooks/useHistory';
import { useTheme } from './hooks/useTheme';
import './App.css';

interface CalculationResult {
  setupActions: ResolvedActionId[];
  finalActions: ResolvedActionId[];
}

function isSelectedInstruction(instruction: Instruction): instruction is SelectedInstruction {
  return instruction.action !== '' && instruction.priority !== '';
}

/** A recipe fills the three rows; anything it leaves over stays empty. */
function instructionRows(recipe: AnvilRecipe): Instruction[] {
  return [
    ...recipe.instructions,
    ...Array.from({ length: 3 - recipe.instructions.length }, emptyInstruction),
  ];
}

function runCalculation(
  selected: SelectedInstruction[],
  target: number,
  allowBelowZeroSetup: boolean,
): CalculationResult {
  const finalInstructions = normalizeInstructions(selected, target);

  return {
    setupActions: calculateSetupActions(target, finalInstructions, { allowBelowZeroSetup }),
    finalActions: sortInstructions(finalInstructions).map((instruction) => instruction.action),
  };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { history, remember, clear: clearHistory } = useHistory();
  const [mode, setMode] = useState<SmithingMode>('auto');
  const [instructions, setInstructions] = useState<Instruction[]>([
    emptyInstruction(),
    emptyInstruction(),
    emptyInstruction(),
  ]);
  const [recipeId, setRecipeId] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [zeroAlignedMode, setZeroAlignedMode] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');
  const panelPrefix = useId();
  const panelIds = { auto: `${panelPrefix}-auto`, manual: `${panelPrefix}-manual` };

  const validInstructions = useMemo(
    () => instructions.filter(isSelectedInstruction),
    [instructions],
  );

  const recipe = useMemo(() => findRecipe(recipeId), [recipeId]);

  function updateInstruction(index: number, patch: Partial<Instruction>) {
    // Hand-editing a row means the rows no longer describe the picked item.
    setRecipeId('');
    setInstructions((current) =>
      current.map((instruction, instructionIndex) =>
        instructionIndex === index ? { ...instruction, ...patch } : instruction,
      ),
    );
  }

  function selectRecipe(nextRecipeId: string) {
    setRecipeId(nextRecipeId);
    setResult(null);
    setError('');

    const nextRecipe = findRecipe(nextRecipeId);
    if (!nextRecipe) {
      setInstructions([emptyInstruction(), emptyInstruction(), emptyInstruction()]);
      return;
    }

    setInstructions(instructionRows(nextRecipe));

    // The target depends on the metal as well as the item, so a value typed for
    // one item never carries over to the next. Past targets come back through the
    // history, where each entry carries the target it was calculated with.
    setTargetValue('');
  }

  function calculate() {
    const parsedTarget = zeroAlignedMode ? 0 : Number.parseInt(targetValue, 10);

    if (!Number.isInteger(parsedTarget) || parsedTarget < 0) {
      setError('Enter a target value of 0 or higher.');
      setResult(null);
      return;
    }

    // Calculating is the point you actually forge the item, so that is what the
    // history records; hand-set instructions have no item to record.
    if (recipeId) {
      remember({ recipeId, target: parsedTarget, zeroAligned: zeroAlignedMode });
    }

    setError('');
    setResult(runCalculation(validInstructions, parsedTarget, zeroAlignedMode));
  }

  function restore(item: HistoryItem) {
    setMode('auto');
    setRecipeId(item.recipeId);
    setInstructions(instructionRows(item.recipe));
    setTargetValue(item.zeroAligned ? '' : String(item.target));
    setZeroAlignedMode(item.zeroAligned);
    setError('');
    // Results are derived, so old entries are recalculated rather than stored and
    // replayed; an entry can never show a result the calculator would not give now.
    setResult(runCalculation(item.recipe.instructions, item.target, item.zeroAligned));
  }

  function changeMode(nextMode: SmithingMode) {
    // The two modes can describe different instructions, so a result from one is
    // not an answer for the other. Rows are kept, so a picked item is a starting
    // point you can then tweak by hand.
    setMode(nextMode);
    setResult(null);
    setError('');
  }

  function reset() {
    setRecipeId('');
    setInstructions([emptyInstruction(), emptyInstruction(), emptyInstruction()]);
    setTargetValue('');
    setResult(null);
    setError('');
  }

  function toggleZeroAlignedMode() {
    setZeroAlignedMode((currentMode) => !currentMode);
    setResult(null);
    setError('');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="title-lockup">
          <img
            className="title-icon"
            src={`${import.meta.env.BASE_URL}textures/steel-anvil.png`}
            alt=""
          />
          <h1>TerraFirmaGreg Anvil Calculator</h1>
        </div>
      </header>

      <div className="layout">
        <section className="panel instructions-panel">
          <div className="section-heading">
            <h2>Smithing Instructions</h2>
            <div className="section-heading-actions">
              {mode === 'manual' ? <span>{validInstructions.length}/3 set</span> : null}
              <button type="button" className="quiet-button" onClick={reset}>
                Clear all
              </button>
            </div>
          </div>

          <ModeTabs mode={mode} panelIds={panelIds} onChange={changeMode} />

          {mode === 'auto' ? (
            <div
              className="mode-body"
              id={panelIds.auto}
              role="tabpanel"
              aria-labelledby={`${panelIds.auto}-tab`}
            >
              <ItemPicker value={recipeId} recipe={recipe} onChange={selectRecipe} />
            </div>
          ) : (
            <div
              className="mode-body"
              id={panelIds.manual}
              role="tabpanel"
              aria-labelledby={`${panelIds.manual}-tab`}
            >
              <div className="instruction-list-header" aria-hidden="true">
                <span>Action</span>
                <span>Priority</span>
              </div>

              <div className="instruction-list">
                {instructions.map((instruction, index) => (
                  <InstructionRow
                    key={index}
                    instruction={instruction}
                    index={index}
                    onActionChange={(action) => updateInstruction(index, { action })}
                    onPriorityChange={(priority) => updateInstruction(index, { priority })}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="instructions-result">
            <div className="section-heading">
              <h3>Result</h3>
              {result ? (
                <span>{result.setupActions.length + result.finalActions.length} actions</span>
              ) : null}
            </div>

            {result ? (
              <>
                <ResultStrip
                  title="1. Setup"
                  actions={result.setupActions}
                  emptyText="No setup actions needed."
                  intro={
                    zeroAlignedMode ? (
                      <div className="alignment-step">
                        <p>Align the red and green pointers in the anvil UI.</p>
                        <img
                          src={`${import.meta.env.BASE_URL}textures/interface.png`}
                          alt="Anvil UI with red and green pointers aligned"
                        />
                      </div>
                    ) : undefined
                  }
                />
                <ResultStrip
                  title="2. Finally"
                  actions={result.finalActions}
                  emptyText="No final instructions selected."
                />
              </>
            ) : (
              <p className="empty-state">
                {mode === 'auto'
                  ? 'Pick an item, enter the target, then calculate.'
                  : 'Choose instructions, enter the target, then calculate.'}
              </p>
            )}
          </div>
        </section>

        <div className="side-panel-stack">
          <aside className="panel target-panel">
            <h2>Target Value</h2>
            <label className="target-field">
              <input
                type="number"
                min="0"
                value={zeroAlignedMode ? '0' : targetValue}
                disabled={zeroAlignedMode}
                onChange={(event) => setTargetValue(event.target.value)}
                placeholder="Example: 72"
              />
            </label>
            {error ? <p className="error-message">{error}</p> : null}
            <button type="button" className="primary-button" onClick={calculate}>
              Calculate
            </button>
          </aside>

          <aside className="panel settings-panel">
            <h2>Settings</h2>
            <div className="settings-list">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleZeroAlignedMode}
                role="switch"
                aria-checked={zeroAlignedMode}
              >
                <span>Zero-aligned mode</span>
                <span className="theme-switch" aria-hidden="true">
                  <span className="theme-switch-thumb" />
                </span>
              </button>
            </div>
          </aside>
        </div>
      </div>

      {history.length > 0 ? (
        <HistoryPanel items={history} onSelect={restore} onClear={clearHistory} />
      ) : null}

      <footer className="app-footer">
        <a
          className="github-link"
          href="https://github.com/Johncakes/tfg-anvil-calculator"
          target="_blank"
          rel="noreferrer"
          aria-label="View source on GitHub"
        >
          <svg
            aria-hidden="true"
            className="github-icon"
            viewBox="0 0 16 16"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.86c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            />
          </svg>
          GitHub
        </a>
      </footer>
    </main>
  );
}
