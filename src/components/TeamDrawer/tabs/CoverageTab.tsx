import type { TeamMember } from '../../../types';
import { MAX_TEAM_SIZE } from '../../../utils/constants';
import styles from './CoverageTab.module.css';

interface CoverageTabProps {
  members: TeamMember[];
}

export function CoverageTab({ members }: CoverageTabProps) {
  if (members.length === 0) {
    return (
      <div className={styles.emptyState}>
        {/* swords icon */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/>
          <polyline points="16 16 20 20 20 22 22 22 22 20 20 20"/><line x1="20" y1="4" x2="4" y2="20"/>
        </svg>
        <p className={styles.emptyTitle}>No type coverage</p>
        <p className={styles.emptySubtitle}>Add Pokémon to your team to see type coverage</p>
      </div>
    );
  }

  const coverageMap = new Map<string, { count: number; color: string }>();
  for (const member of members) {
    for (const type of member.types) {
      const existing = coverageMap.get(type.name);
      if (existing) {
        existing.count += 1;
      } else {
        coverageMap.set(type.name, { count: 1, color: type.color });
      }
    }
  }

  const entries = [...coverageMap.entries()].sort(
    ([nameA, a], [nameB, b]) => b.count - a.count || nameA.localeCompare(nameB)
  );

  const analysisText = members.length < MAX_TEAM_SIZE
    ? `Your team has ${members.length}/${MAX_TEAM_SIZE} Pokémon. Consider adding more for better coverage.`
    : `Your team is full with ${MAX_TEAM_SIZE} Pokémon.`;

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionTitle}>Type Coverage</p>
      <div className={styles.chips}>
        {entries.map(([name, { count, color }]) => (
          <div key={name} className={styles.chip}>
            <span className={styles.dot} style={{ backgroundColor: color }} />
            <span className={styles.chipName}>{name}</span>
            <span className={styles.chipCount}>{count}</span>
          </div>
        ))}
      </div>

      <div className={styles.analysis}>
        <p className={styles.analysisTitle}>Team Analysis</p>
        <p className={styles.analysisText}>{analysisText}</p>
      </div>
    </div>
  );
}
