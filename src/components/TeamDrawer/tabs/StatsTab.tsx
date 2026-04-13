import { Shield } from 'lucide-react';
import type { TeamMember } from '../../../types';
import { aggregateTeamStats, formatStatNameFull, MAX_BASE_STAT } from '../../../utils/statHelpers';
import { MAX_TEAM_SIZE, STAT_ORDER } from '../../../utils/constants';
import styles from './StatsTab.module.css';

interface TeamStatsTabProps {
  members: TeamMember[];
}

const MAX_TEAM_STAT = MAX_BASE_STAT * MAX_TEAM_SIZE;

export function TeamStatsTab({ members }: TeamStatsTabProps) {
  if (members.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Shield size={40} strokeWidth={1.5} aria-hidden className={styles.emptyIcon} />
        <p className={styles.emptyTitle}>No stats available</p>
        <p className={styles.emptySubtitle}>Add Pokémon to your team to see stats</p>
      </div>
    );
  }

  const aggregated = aggregateTeamStats(members.map((m) => m.stats));
  const sorted = STAT_ORDER
    .map((name) => aggregated.find((s) => s.name === name))
    .filter(Boolean) as typeof aggregated;

  return (
    <div className={styles.wrapper}>
      <p className={styles.heading}>Team Stats</p>
      {sorted.map((stat) => (
        <div key={stat.name} className={styles.statItem}>
          <div className={styles.statHeader}>
            <span className={styles.label}>{formatStatNameFull(stat.name)}</span>
            <span className={styles.value}>{stat.total}</span>
          </div>
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
