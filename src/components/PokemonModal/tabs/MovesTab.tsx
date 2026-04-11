import type { PokemonMove } from '../../../types';
import styles from './MovesTab.module.css';

interface MovesTabProps {
  moves: PokemonMove[];
}

export function MovesTab({ moves }: MovesTabProps) {
  const levelUpMoves = [...moves]
    .filter((m) => m.learnMethod === 'level-up')
    .sort((a, b) => a.levelLearnedAt - b.levelLearnedAt);

  const otherMoves = [...moves]
    .filter((m) => m.learnMethod !== 'level-up')
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={styles.wrapper}>
      {levelUpMoves.length > 0 && (
        <section>
          <p className={styles.groupLabel}>Level-up Moves</p>
          {levelUpMoves.map((move) => (
            <div key={move.name} className={styles.row}>
              <span className={styles.moveName}>{move.name.replace(/-/g, ' ')}</span>
              <span className={styles.level}>Level {move.levelLearnedAt}</span>
            </div>
          ))}
        </section>
      )}

      {otherMoves.length > 0 && (
        <section className={styles.section}>
          <p className={styles.groupLabel}>Other Moves</p>
          {otherMoves.map((move) => (
            <div key={move.name} className={styles.row}>
              <span className={styles.moveName}>{move.name.replace(/-/g, ' ')}</span>
              <span className={styles.method}>{move.learnMethod.replace(/-/g, ' ')}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
