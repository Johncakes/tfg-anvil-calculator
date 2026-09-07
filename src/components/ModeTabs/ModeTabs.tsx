import type { KeyboardEvent } from 'react';
import './ModeTabs.css';

export type SmithingMode = 'auto' | 'manual';

const MODES = [
  { id: 'auto', label: 'Auto', hint: 'Pick the item and its instructions are filled in for you' },
  { id: 'manual', label: 'Manual', hint: 'Set the three instructions and priorities yourself' },
] as const satisfies readonly { id: SmithingMode; label: string; hint: string }[];

interface ModeTabsProps {
  mode: SmithingMode;
  panelIds: Record<SmithingMode, string>;
  onChange: (mode: SmithingMode) => void;
}

function tabId(panelId: string): string {
  return `${panelId}-tab`;
}

export default function ModeTabs({ mode, panelIds, onChange }: ModeTabsProps) {
  // Arrow keys move between tabs, and focus follows the selection the way a
  // tablist is expected to behave. With two tabs either arrow just flips.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const nextMode: SmithingMode = mode === 'auto' ? 'manual' : 'auto';
    onChange(nextMode);
    document.getElementById(tabId(panelIds[nextMode]))?.focus();
  }

  return (
    <div className="mode-tabs" role="tablist" aria-label="Instruction source" onKeyDown={onKeyDown}>
      {MODES.map((entry) => (
        <button
          key={entry.id}
          type="button"
          role="tab"
          id={tabId(panelIds[entry.id])}
          className={`mode-tab${entry.id === mode ? ' selected' : ''}`}
          aria-selected={entry.id === mode}
          aria-controls={panelIds[entry.id]}
          tabIndex={entry.id === mode ? 0 : -1}
          title={entry.hint}
          onClick={() => onChange(entry.id)}
        >
          {entry.label}
        </button>
      ))}
    </div>
  );
}
