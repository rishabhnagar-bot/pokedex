/**
 * PokemonTypeBadge.tsx — Colored pill for displaying a single Pokémon type.
 *
 * Props:
 *   type  — the type name string (e.g. "fire", "water", "grass")
 *
 * The component looks up the display color from TYPE_COLORS internally,
 * so callers only need to pass the plain type name — no color object needed.
 * Falls back to a neutral grey for any unknown type string.
 *
 * Used on:
 *   - PokemonCard  — 1–2 badges below the Pokémon name
 *   - PokemonModal — types shown in the header next to the name
 *   - TeamTab      — types shown beside each team member's name
 *
 * Note: this is intentionally a display-only component.
 *       For interactive filter chips, use TypeBadge with asFilter=true.
 */

import { TYPE_COLORS } from '../../../utils/typeColors';
import styles from './PokemonTypeBadge.module.css';

interface PokemonTypeBadgeProps {
  type: string;
}

export function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
  const color = TYPE_COLORS[type] ?? '#9E9E9E';

  return (
    <span
      className={styles.badge}
      style={{ backgroundColor: color }}
      title={type}
    >
      {type}
    </span>
  );
}
