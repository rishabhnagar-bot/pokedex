/**
 * MovesTab.tsx — "Moves" tab inside the Pokémon detail modal.
 *
 * Shows moves in pages of DISPLAY_COUNT (10).
 * A "Show More" button appends the next page; "Show Less" collapses back to 10.
 *
 * Sort order:
 *   1. Level-up moves first, ascending by level learned
 *   2. All other learn methods alphabetically
 */

import { useState } from 'react';
import type { PokemonMove } from '../../../types';
import styles from './MovesTab.module.css';

interface MovesTabProps {
  moves: PokemonMove[];
}

const PAGE_SIZE = 10;

const METHOD_LABELS: Record<string, string> = {
  'level-up': 'Level Up',
  machine:    'TM/HM',
  tutor:      'Tutor',
  egg:        'Egg',
};

function methodLabel(method: string): string {
  return METHOD_LABELS[method] ?? method.replace(/-/g, ' ');
}

export function MovesTab({ moves }: MovesTabProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sorted = [...moves].sort((a, b) => {
    if (a.learnMethod === 'level-up' && b.learnMethod !== 'level-up') return -1;
    if (a.learnMethod !== 'level-up' && b.learnMethod === 'level-up') return 1;
    if (a.learnMethod === 'level-up') return a.levelLearnedAt - b.levelLearnedAt;
    return a.name.localeCompare(b.name);
  });

  const displayed = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;
  const isExpanded = visibleCount > PAGE_SIZE;

  return (
    <div className={styles.wrapper}>
      {/* Column headers */}
      <div className={styles.header}>
        <span>Move</span>
        <span>Method</span>
        <span>Lv.</span>
      </div>

      {/* Move rows */}
      {displayed.map((move, i) => (
        <div
          key={move.name}
          className={[styles.row, i % 2 === 0 ? styles.rowEven : ''].join(' ')}
        >
          <span className={styles.moveName}>{move.name.replace(/-/g, ' ')}</span>
          <span className={styles.method}>{methodLabel(move.learnMethod)}</span>
          <span className={styles.level}>
            {move.learnMethod === 'level-up' && move.levelLearnedAt > 0
              ? move.levelLearnedAt
              : '—'}
          </span>
        </div>
      ))}

      {/* Footer: count + expand/collapse controls */}
      <div className={styles.footer}>
        <span className={styles.note}>
          Showing {displayed.length} of {sorted.length}
        </span>

        <div className={styles.actions}>
          {hasMore && (
            <button
              className={styles.toggleBtn}
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              Show More
            </button>
          )}
          {isExpanded && (
            <button
              className={styles.toggleBtn}
              onClick={() => setVisibleCount(PAGE_SIZE)}
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
