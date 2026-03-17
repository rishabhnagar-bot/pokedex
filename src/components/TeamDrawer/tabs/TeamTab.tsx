/**
 * TeamTab.tsx — "Team" tab inside the TeamDrawer.
 *
 * Lists each team member as a row with:
 *   - Sprite thumbnail
 *   - Name + types
 *   - An "X" remove button revealed on hover (per the Figma spec)
 *
 * Shows an empty state prompt when the team has no members.
 */

import type { TeamMember } from '../../../types';
import { PokemonTypeBadge } from '../../common/PokemonTypeBadge';
import styles from './TeamTab.module.css';

interface TeamTabProps {
  members: TeamMember[];
  onRemove: (id: number) => void;
}

export function TeamTab({ members, onRemove }: TeamTabProps) {
  if (members.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Your team is empty.</p>
        <p>Add Pokémon from the gallery to build your battle team.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {members.map((member) => (
        <li key={member.id} className={styles.memberRow}>
          <img
            src={member.sprite}
            alt={member.name}
            className={styles.sprite}
          />
          <div className={styles.info}>
            <span className={styles.name}>{member.name}</span>
            <div className={styles.types}>
              {member.types.map((t) => (
                <PokemonTypeBadge key={t.name} type={t.name} />
              ))}
            </div>
          </div>
          {/* Remove button — hidden until row is hovered (CSS handles visibility) */}
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(member.id)}
            aria-label={`Remove ${member.name}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
