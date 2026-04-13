import { Users } from 'lucide-react';
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
          <Users size={40} strokeWidth={1.5} aria-hidden className={styles.emptyIcon} />
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
