import type { ReactNode } from 'react';
import ActionIcon from '../ActionIcon';
import { ACTIONS, type ResolvedActionId } from '../../domain/actions';
import './ResultStrip.css';

interface ResultStripProps {
  title: string;
  actions: ResolvedActionId[];
  emptyText: string;
  intro?: ReactNode;
}

interface ActionRun {
  action: ResolvedActionId;
  count: number;
  startIndex: number;
}

function getActionRuns(actions: ResolvedActionId[]): ActionRun[] {
  return actions.reduce<ActionRun[]>((runs, action, index) => {
    const currentRun = runs[runs.length - 1];

    if (currentRun?.action === action) {
      currentRun.count += 1;
      return runs;
    }

    runs.push({ action, count: 1, startIndex: index });
    return runs;
  }, []);
}

export default function ResultStrip({ title, actions, emptyText, intro }: ResultStripProps) {
  const actionRuns = getActionRuns(actions);

  return (
    <section className="result-strip">
      <h3>{title}</h3>
      {intro}
      <div className="action-row">
        {actions.length > 0 ? (
          actionRuns.map((run) => (
            <span className="action-run" key={`${run.action}-${run.startIndex}`}>
              <ActionIcon
                action={run.action}
                button={false}
                className="result-icon"
                description={ACTIONS[run.action].label}
                showDescription
              />
              {run.count > 1 ? <span className="action-count">(x{run.count})</span> : null}
            </span>
          ))
        ) : (
          <span className="empty-result">{emptyText}</span>
        )}
      </div>
    </section>
  );
}
