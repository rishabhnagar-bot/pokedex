/**
 * TypeFilter.tsx — Sticky horizontal bar of color-coded type filter chips.
 *
 * Behaviours:
 *   - Sticks below the Navbar while the user scrolls the grid.
 *   - Shows skeleton placeholder chips while types are loading from the API.
 *   - "All" chip at the start clears the active filter.
 *   - Clicking an active chip again deselects it (toggles back to "All").
 *   - Row is horizontally scrollable on small screens (no scrollbar shown).
 */

import { TypeBadge } from '../common/TypeBadge';
import type { PokemonType } from '../../types';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  types: PokemonType[];
  activeType: string | null;
  onSelect: (typeName: string | null) => void;
  isLoading?: boolean;
}

/** Number of skeleton chips to show while types are being fetched */
const SKELETON_COUNT = 10;

export function TypeFilter({ types, activeType, onSelect, isLoading }: TypeFilterProps) {
  return (
    <div className={styles.bar}>
      <div
        className={styles.chipRow}
        role="toolbar"
        aria-label="Filter Pokémon by type"
      >
        {isLoading ? (
          // Skeleton placeholders — same size as real chips
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <span key={i} className={styles.skeleton} />
          ))
        ) : (
          <>
            {/* "All" chip — always first, clears any active filter */}
            <button
              className={[
                styles.allChip,
                !activeType ? styles.allChipActive : '',
              ].join(' ')}
              onClick={() => onSelect(null)}
              aria-pressed={!activeType}
            >
              All
            </button>

            {types.map((type) => (
              <TypeBadge
                key={type.name}
                type={type}
                asFilter
                isActive={activeType === type.name}
                onClick={() => onSelect(activeType === type.name ? null : type.name)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
