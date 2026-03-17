/**
 * StatsTab.tsx — Base stats display for the Pokémon detail modal.
 *
 * Each stat row shows:
 *   - Stat label (e.g. "Sp. Atk")
 *   - Numeric value
 *   - Animated bar proportional to MAX_BASE_STAT (255)
 *
 * Bar color reflects the stat value:
 *   ≥ 90  → green  (strong)
 *   ≥ 50  → yellow (average)
 *   < 50  → red    (weak)
 *
 * A total base stat row is shown at the bottom.
 */

import type { PokemonStat } from '../../../types';
import { formatStatName, statPercent } from '../../../utils/statHelpers';
import { STAT_ORDER } from '../../../utils/constants';
import styles from './StatsTab.module.css';

interface StatsTabProps {
  stats: PokemonStat[];
}

function barColor(value: number): string {
  if (value >= 90) return 'var(--stat-high)';
  if (value >= 50) return 'var(--stat-mid)';
  return 'var(--stat-low)';
}

export function StatsTab({ stats }: StatsTabProps) {
  const sorted = STAT_ORDER
    .map((name) => stats.find((s) => s.name === name))
    .filter(Boolean) as PokemonStat[];

  const total = sorted.reduce((sum, s) => sum + s.baseStat, 0);

  return (
    <div className={styles.wrapper}>
      {sorted.map((stat) => (
        <div key={stat.name} className={styles.row}>
          <span className={styles.label}>{formatStatName(stat.name)}</span>
          <span className={styles.value}>{stat.baseStat}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{
                width: `${statPercent(stat.baseStat)}%`,
                backgroundColor: barColor(stat.baseStat),
              }}
            />
          </div>
        </div>
      ))}

      {/* Total */}
      <div className={styles.totalRow}>
        <span className={styles.label}>Total</span>
        <span className={styles.totalValue}>{total}</span>
      </div>
    </div>
  );
}
