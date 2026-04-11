import type { ReactNode } from 'react';
import { TypeBadge } from '../common/TypeBadge';
import type { PokemonType } from '../../types';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  types: PokemonType[];
  activeType: string | null;
  onSelect: (typeName: string | null) => void;
  isLoading?: boolean;
  searchSlot?: ReactNode;
}

const SKELETON_COUNT = 10;

export function TypeFilter({ types, activeType, onSelect, isLoading, searchSlot }: TypeFilterProps) {
  return (
    <div className={styles.bar}>
      <span className={styles.label}>Filter by type</span>
      <div className={styles.chipRow} role="toolbar" aria-label="Filter Pokémon by type">
        {isLoading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <span key={i} className={styles.skeleton} />
          ))
        ) : (
          types.map((type) => (
            <TypeBadge
              key={type.name}
              type={type}
              asFilter
              isActive={activeType === type.name}
              onClick={() => onSelect(activeType === type.name ? null : type.name)}
            />
          ))
        )}
      </div>
      {searchSlot}
    </div>
  );
}
