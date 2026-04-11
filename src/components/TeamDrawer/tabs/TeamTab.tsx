import type { TeamMember } from '../../../types';
import { MAX_TEAM_SIZE } from '../../../utils/constants';
import styles from './TeamTab.module.css';

interface TeamTabProps {
  members: TeamMember[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export function TeamTab({ members, onRemove, onClear }: TeamTabProps) {
  const slots: (TeamMember | null)[] = [
    ...members,
    ...Array(MAX_TEAM_SIZE - members.length).fill(null),
  ];

  return (
    <div className={styles.wrapper}>
      {/* 3×2 slot grid */}
      <div className={styles.grid}>
        {slots.map((member, i) =>
          member ? (
            <button
              key={member.id}
              className={styles.slotFilled}
              onClick={() => onRemove(member.id)}
              title={`Remove ${member.name}`}
            >
              <img src={member.sprite} alt={member.name} className={styles.slotSprite} />
            </button>
          ) : (
            <div key={`empty-${i}`} className={styles.slotEmpty}>
              <span className={styles.slotPlus}>+</span>
            </div>
          )
        )}
      </div>

      {/* Empty state */}
      {members.length === 0 && (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={styles.emptyIcon}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p className={styles.emptyTitle}>Your team is empty</p>
          <p className={styles.emptySubtitle}>Add Pokémon from the browser to build your team</p>
        </div>
      )}

      {/* Clear team button */}
      {members.length > 0 && (
        <div className={styles.clearRow}>
          <button className={styles.clearBtn} onClick={onClear}>
            Clear Team
          </button>
        </div>
      )}
    </div>
  );
}
