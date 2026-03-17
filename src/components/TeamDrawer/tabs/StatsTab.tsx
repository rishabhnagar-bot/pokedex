/**
 * StatsTab.tsx (TeamDrawer) — "Stats" tab inside the Team Builder drawer.
 *
 * Shows combined base stats across all team members as a bar chart.
 * Each stat bar's maximum scale is MAX_BASE_STAT × 6 (6 team members max).
 *
 * This differs from PokemonModal/tabs/StatsTab which shows individual stats.
 */

import type { TeamMember } from '../../../types';
import { aggregateTeamStats, formatStatName, MAX_BASE_STAT } from '../../../utils/statHelpers';
import { MAX_TEAM_SIZE, STAT_ORDER } from '../../../utils/constants';
import styles from './StatsTab.module.css';

interface TeamStatsTabProps {
  members: TeamMember[];
}

const MAX_TEAM_STAT = MAX_BASE_STAT * MAX_TEAM_SIZE;

export function TeamStatsTab({ members }: TeamStatsTabProps) {
  if (members.length === 0) {
    return <p className={styles.empty}>Add Pokémon to see combined stats.</p>;
  }

  const aggregated = aggregateTeamStats(members.map((m) => m.stats));

  const sorted = STAT_ORDER
    .map((name) => aggregated.find((s) => s.name === name))
    .filter(Boolean) as typeof aggregated;

  return (
    <div className={styles.wrapper}>
      {sorted.map((stat) => (
        <div key={stat.name} className={styles.row}>
          <span className={styles.label}>{formatStatName(stat.name)}</span>
          <span className={styles.value}>{stat.total}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${Math.min(100, (stat.total / MAX_TEAM_STAT) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
