/**
 * TypeBadge.tsx — Colored pill label for a single Pokémon type.
 *
 * Used in:
 *   - PokemonCard — shows the 1–2 types on each card.
 *   - PokemonModal — shows types in the header.
 *   - TypeFilter   — each filter chip is a TypeBadge variant.
 *
 * The background colour comes from the type's `color` property
 * (set by utils/typeColors.ts when building PokemonType objects).
 */

import type { PokemonType } from '../../../types';
import styles from './TypeBadge.module.css';

interface TypeBadgeProps {
  type: PokemonType;
  /** When true, renders as an interactive filter chip with active state */
  asFilter?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function TypeBadge({ type, asFilter, isActive, onClick }: TypeBadgeProps) {
  const Tag = asFilter ? 'button' : 'span';

  return (
    <Tag
      className={[
        styles.badge,
        asFilter ? styles.filter : '',
        isActive ? styles.active : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--type-color': type.color } as React.CSSProperties}
      onClick={onClick}
    >
      {type.name}
    </Tag>
  );
}
