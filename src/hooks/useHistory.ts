import { useState } from 'react';
import {
  clearHistory,
  readHistory,
  rememberCalculation,
  type HistoryEntry,
  type HistoryItem,
} from '../domain/history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(readHistory);

  function remember(entry: HistoryEntry) {
    setHistory(rememberCalculation(entry));
  }

  function clear() {
    setHistory(clearHistory());
  }

  return { history, remember, clear };
}
