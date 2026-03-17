/**
 * PokemonGrid.tsx — Responsive grid of PokemonCard components.
 *
 * Responsibilities:
 *   - Renders a CSS grid of PokemonCard items.
 *   - Shows a LoadingSpinner during the initial fetch.
 *   - Shows an error message if the fetch fails.
 *   - Shows an empty state when filters produce 0 results.
 *   - Renders the "Load More" button below the grid when there are more pages.
 *
 * Props are all passed down from HomePage which owns the data-fetching hooks.
 */

import type { PokemonListItem, TeamMember } from '../../types';
import { PokemonCard } from '../PokemonCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../common/Button';
import styles from './PokemonGrid.module.css';

interface PokemonGridProps {
  pokemon: PokemonListItem[];
  teamIds: Set<number>;
  isTeamFull: boolean;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onCardClick: (id: number) => void;
  onAddTeam: (member: TeamMember) => void;
  onLoadMore: () => void;
}

export function PokemonGrid({
  pokemon,
  teamIds,
  isTeamFull,
  isInitialLoading,
  isLoadingMore,
  error,
  hasMore,
  onCardClick,
  onAddTeam,
  onLoadMore,
}: PokemonGridProps) {
  if (isInitialLoading) {
    return (
      <div className={styles.centred}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centred}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className={styles.centred}>
        <p className={styles.empty}>No Pokémon match the selected filter.</p>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {pokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            isInTeam={teamIds.has(p.id)}
            isTeamFull={isTeamFull}
            onClick={() => onCardClick(p.id)}
            onAddTeam={onAddTeam}
          />
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMoreWrapper}>
          <Button variant="secondary" onClick={onLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading…' : 'Load More'}
          </Button>
        </div>
      )}
    </section>
  );
}
