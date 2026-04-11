import { motion } from 'framer-motion';
import type { PokemonListItem, TeamMember } from '../../types';
import { PokemonTypeBadge } from '../common/PokemonTypeBadge';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  isInTeam: boolean;
  isTeamFull: boolean;
  onClick: () => void;
  onAddTeam: (member: TeamMember) => void;
  onRemoveTeam: (id: number) => void;
}

export function PokemonCard({
  pokemon,
  isInTeam,
  isTeamFull,
  onClick,
  onAddTeam,
  onRemoveTeam,
}: PokemonCardProps) {
  const handleAddTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddTeam({ ...pokemon, stats: [] });
  };

  const handleRemoveTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveTeam(pokemon.id);
  };

  return (
    <motion.article
      className={`${styles.card} ${isInTeam ? styles.cardInTeam : ''}`}
      style={{ animationDelay: `${(pokemon.id % 20) * 0.03}s` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      whileTap={{ scale: 0.91, filter: 'brightness(1.6)' }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      {/* Header: name + id */}
      <div className={styles.header}>
        <h3 className={styles.name}>{pokemon.name}</h3>
        <span className={styles.id}>#{String(pokemon.id).padStart(3, '0')}</span>
      </div>

      {/* Sprite */}
      <div className={styles.imageWrapper}>
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className={styles.sprite}
          loading="lazy"
        />
      </div>

      {/* Footer: types + icon action button */}
      <div className={styles.footer}>
        <div className={styles.types}>
          {pokemon.types.map((type) => (
            <PokemonTypeBadge key={type.name} type={type.name} />
          ))}
        </div>
        {isInTeam ? (
          <button
            className={`${styles.iconBtn} ${styles.iconBtnRemove}`}
            onClick={handleRemoveTeam}
            aria-label={`Remove ${pokemon.name} from team`}
          >
            −
          </button>
        ) : (
          <button
            className={`${styles.iconBtn} ${styles.iconBtnAdd}`}
            onClick={handleAddTeam}
            disabled={isTeamFull}
            aria-label={`Add ${pokemon.name} to team`}
          >
            +
          </button>
        )}
      </div>
    </motion.article>
  );
}
