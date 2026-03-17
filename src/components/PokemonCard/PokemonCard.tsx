/**
 * PokemonCard.tsx — Individual Pokémon card in the gallery grid.
 *
 * Displays:
 *   - Official artwork sprite
 *   - Pokémon ID (formatted as #001)
 *   - Pokémon name
 *   - Type badge(s)
 *   - "Add to Team" button (disabled if already on the team or team is full)
 *
 * Events:
 *   - onClick    — opens the detail modal for this Pokémon
 *   - onAddTeam  — adds this Pokémon to the battle team
 *
 * The card itself is clickable (opens modal). The "Add to Team" button
 * stops propagation so clicking it doesn't also open the modal.
 */

import type { PokemonListItem, TeamMember } from '../../types';
import { PokemonTypeBadge } from '../common/PokemonTypeBadge';
import { Button } from '../common/Button';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  isInTeam: boolean;
  isTeamFull: boolean;
  onClick: () => void;
  onAddTeam: (member: TeamMember) => void;
}

export function PokemonCard({
  pokemon,
  isInTeam,
  isTeamFull,
  onClick,
  onAddTeam,
}: PokemonCardProps) {
  const handleAddTeam = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click → modal opening
    onAddTeam({
      ...pokemon,
      stats: [], // Stats will be loaded lazily when drawer opens
    });
  };

  return (
    <article className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      {/* Sprite */}
      <div className={styles.imageWrapper}>
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className={styles.sprite}
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.id}>#{String(pokemon.id).padStart(3, '0')}</span>
        <h3 className={styles.name}>{pokemon.name}</h3>

        <div className={styles.types}>
          {pokemon.types.map((type) => (
            <PokemonTypeBadge key={type.name} type={type.name} />
          ))}
        </div>
      </div>

      {/* Add to Team */}
      <Button
        variant="secondary"
        onClick={handleAddTeam}
        disabled={isInTeam || isTeamFull}
        className={styles.addButton}
      >
        {isInTeam ? 'In Team' : 'Add to Team'}
      </Button>
    </article>
  );
}
