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

import type { ReactNode } from 'react';
import { useRef, useState, useEffect } from 'react';
import { TypeBadge } from '../common/TypeBadge';
import type { PokemonType } from '../../types';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  types: PokemonType[];
  activeType: string | null;
  onSelect: (typeName: string | null) => void;
  isLoading?: boolean;
  /** Optional slot rendered below the chip row — used for the SearchBar */
  searchSlot?: ReactNode;
}

/** Number of skeleton chips to show while types are being fetched */
const SKELETON_COUNT = 10;

export function TypeFilter({ types, activeType, onSelect, isLoading, searchSlot }: TypeFilterProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => { updateArrows(); }, [types, isLoading]);

  const scroll = (dir: 'left' | 'right') => {
    rowRef.current?.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.chipWrapper}>
        <button
          className={styles.arrowBtn}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          style={{ opacity: canLeft ? 1 : 0.25, pointerEvents: canLeft ? 'auto' : 'none' }}
        >
          ‹
        </button>

        <div
          ref={rowRef}
          className={styles.chipRow}
          onScroll={updateArrows}
          role="toolbar"
          aria-label="Filter Pokémon by type"
        >
          {isLoading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <span key={i} className={styles.skeleton} />
            ))
          ) : (
            <>
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

        <button
          className={styles.arrowBtn}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          style={{ opacity: canRight ? 1 : 0.25, pointerEvents: canRight ? 'auto' : 'none' }}
        >
          ›
        </button>
      </div>
      {searchSlot}
    </div>
  );
}
