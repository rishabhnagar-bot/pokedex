import type { PokemonStat } from '../../../types';
import { formatStatName, statPercent } from '../../../utils/statHelpers';
import { STAT_ORDER } from '../../../utils/constants';
import styles from './StatsTab.module.css';

interface StatsTabProps {
  stats: PokemonStat[];
}

export function StatsTab({ stats }: StatsTabProps) {
  const sorted = STAT_ORDER
    .map((name) => stats.find((s) => s.name === name))
    .filter(Boolean) as PokemonStat[];

  const total = sorted.reduce((sum, s) => sum + s.baseStat, 0);

  return (
    <div className={styles.wrapper}>
      {sorted.map((stat) => (
        <div key={stat.name} className={styles.statItem}>
          <div className={styles.statHeader}>
            <span className={styles.label}>{formatStatName(stat.name)}</span>
            <span className={styles.value}>{stat.baseStat}</span>
          </div>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${statPercent(stat.baseStat)}%` }}
            />
          </div>
        </div>
      ))}

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{total}</span>
      </div>
    </div>
  );
}
