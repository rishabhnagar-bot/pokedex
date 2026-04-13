import type { ReactNode } from 'react';
import type { PokemonMove } from '../../../types';
import { formatName as fmt } from '../../../utils/statHelpers';
import styles from './MovesTab.module.css';

interface MovesTabProps {
  moves: PokemonMove[];
}

function MoveRow({ move, meta }: { move: PokemonMove; meta: ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.moveName}>{fmt(move.name)}</span>
      {meta}
    </div>
  );
}

export function MovesTab({ moves }: MovesTabProps) {
  const levelUpMoves = moves
    .filter((m) => m.learnMethod === 'level-up')
    .sort((a, b) => a.levelLearnedAt - b.levelLearnedAt);

  const otherMoves = moves
    .filter((m) => m.learnMethod !== 'level-up')
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.wrapper}>
      {levelUpMoves.length > 0 && (
        <section>
          <p className={styles.groupLabel}>Level-up Moves</p>
          {levelUpMoves.map((move) => (
            <MoveRow
              key={move.name}
              move={move}
              meta={<span className={styles.level}>Level {move.levelLearnedAt}</span>}
            />
          ))}
        </section>
      )}

      {otherMoves.length > 0 && (
        <section className={styles.section}>
          <p className={styles.groupLabel}>Other Moves</p>
          {otherMoves.map((move) => (
            <MoveRow
              key={move.name}
              move={move}
              meta={<span className={styles.method}>{fmt(move.learnMethod)}</span>}
            />
          ))}
        </section>
      )}
    </div>
  );
}
