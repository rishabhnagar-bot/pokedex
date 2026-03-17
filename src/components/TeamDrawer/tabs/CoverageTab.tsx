/**
 * CoverageTab.tsx — "Coverage" tab inside the Team Builder drawer.
 *
 * Shows which Pokémon types are covered by the current team.
 * Each type that appears on at least one team member is listed with:
 *   - A colored type badge
 *   - A count of how many team members share that type
 *
 * Helps the user build a balanced team that covers multiple types.
 */

import type { TeamMember } from '../../../types';
import { TypeBadge } from '../../common/TypeBadge';
import styles from './CoverageTab.module.css';

interface CoverageTabProps {
  members: TeamMember[];
}

export function CoverageTab({ members }: CoverageTabProps) {
  if (members.length === 0) {
    return <p className={styles.empty}>Add Pokémon to see type coverage.</p>;
  }

  // Aggregate type counts from all team members
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

  // Sort by count descending, then alphabetically
  const entries = [...coverageMap.entries()].sort(
    ([nameA, a], [nameB, b]) => b.count - a.count || nameA.localeCompare(nameB)
  );

  return (
    <div className={styles.wrapper}>
      {entries.map(([name, { count, color }]) => (
        <div key={name} className={styles.row}>
          <TypeBadge type={{ name, color }} />
          <span className={styles.count}>{count} member{count !== 1 ? 's' : ''}</span>
        </div>
      ))}
    </div>
  );
}
