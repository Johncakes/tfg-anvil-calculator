import type { HistoryItem } from '../../domain/history';
import { recipeTextureUrl } from '../../domain/recipes';
import './HistoryPanel.css';

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export default function HistoryPanel({ items, onSelect, onClear }: HistoryPanelProps) {
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

      <ul className="history-list">
        {items.map((item) => (
          <li key={`${item.recipeId}-${item.target}-${item.zeroAligned}`}>
            <button
              type="button"
              className="history-entry"
              onClick={() => onSelect(item)}
              title={`Show the result for ${item.recipe.label} again`}
            >
              <img className="history-entry-icon" src={recipeTextureUrl(item.recipeId)} alt="" />
              <span className="history-entry-label">{item.recipe.label}</span>
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
