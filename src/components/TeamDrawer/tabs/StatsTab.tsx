import type { TeamMember } from '../../../types';
import { aggregateTeamStats, formatStatName, MAX_BASE_STAT } from '../../../utils/statHelpers';
import { MAX_TEAM_SIZE, STAT_ORDER } from '../../../utils/constants';
import styles from './StatsTab.module.css';

interface TeamStatsTabProps {
  members: TeamMember[];
}

const MAX_TEAM_STAT = MAX_BASE_STAT * MAX_TEAM_SIZE;

// Human-readable stat names matching the Figma
const STAT_DISPLAY: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Special Attach',
  'special-defense': 'Special Defense',
  speed: 'Speed',
};

export function TeamStatsTab({ members }: TeamStatsTabProps) {
  if (members.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={styles.emptyIcon}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
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
            <span className={styles.label}>{STAT_DISPLAY[stat.name] ?? formatStatName(stat.name)}</span>
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
