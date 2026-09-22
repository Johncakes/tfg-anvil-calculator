import { useEffect, useRef, useState } from 'react';
import type { HistoryItem } from '../../domain/history';
import { recipeTextureUrl } from '../../domain/recipes';
import './HistoryPanel.css';

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export default function HistoryPanel({ items, onSelect, onClear }: HistoryPanelProps) {
  const [search, setSearch] = useState('');
  const listRef = useRef<HTMLUListElement>(null);
  const tokens = search.toLowerCase().replace(/[-_]/g, ' ').trim().split(/\s+/).filter(Boolean);
  const filtered = items.filter((item) => {
    const text = `${item.recipe.label} ${item.material || 'Material not specified'} ${item.zeroAligned ? 'Zero aligned' : item.target}`
      .toLowerCase().replace(/[-_]/g, ' ');
    return tokens.every((token) => text.includes(token));
  });

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [search]);

  return (
    <section className="panel history-panel">
      <div className="section-heading">
        <h2>History</h2>
        <div className="section-heading-actions">
          <button type="button" className="quiet-button" onClick={onClear}>
            Clear all
          </button>
        </div>
      </div>

      <div className="history-search">
        <input type="search" aria-label="Search history" placeholder="Search item, material, or target…"
          value={search} onChange={(event) => setSearch(event.target.value)} />
        <span className="history-count" role="status">{filtered.length} of {items.length}</span>
      </div>

      {filtered.length === 0 ? <p className="empty-state">No history matches your search.</p> : null}
      <ul className="history-list" ref={listRef} aria-label="Calculation history"
        tabIndex={filtered.length > 0 ? 0 : undefined}>
        {filtered.map((item) => (
          <li key={JSON.stringify([item.recipeId, item.material.toLowerCase(), item.target, item.zeroAligned])}>
            <button
              type="button"
              className="history-entry"
              onClick={() => onSelect(item)}
              title={`Show the result for ${item.recipe.label} again`}
            >
              <img className="history-entry-icon" src={recipeTextureUrl(item.recipeId)} alt="" />
              <span className="history-entry-label">
                {item.recipe.label}
                <span className="history-entry-material">{item.material || 'Material not specified'}</span>
              </span>
              <span className="history-entry-target">
                {item.zeroAligned ? 'Zero-aligned' : item.target}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
