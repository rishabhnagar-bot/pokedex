/**
 * PokemonModal.tsx — Pokémon detail modal built on top of the generic Modal.
 *
 * Concerns handled HERE (Pokémon-specific):
 *   - Fetching detail data when a Pokémon id is selected
 *   - Rendering the header (sprite, name, id, types)
 *   - Tab bar (Stats / Moves / About) via the reusable Tabs component
 *   - Loading spinner and error state inside the panel
 *
 * Concerns delegated to <Modal>:
 *   - Backdrop, Escape key, body scroll lock, framer-motion animations, X button
 */

import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { Modal } from '../common/Modal';
import { Tabs } from '../common/Tabs';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { PokemonTypeBadge } from '../common/PokemonTypeBadge';
import { StatsTab } from './tabs/StatsTab';
import { MovesTab } from './tabs/MovesTab';
import { AboutTab } from './tabs/AboutTab';
import styles from './PokemonModal.module.css';

interface PokemonModalProps {
  pokemonId: number | null;
  onClose: () => void;
}

export function PokemonModal({ pokemonId, onClose }: PokemonModalProps) {
  const { detail, isLoading, error } = usePokemonDetail(pokemonId);

  return (
    <Modal isOpen={pokemonId !== null} onClose={onClose} maxWidth="480px">
      {/* Loading */}
      {isLoading && (
        <div className={styles.loadingState}>
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Content */}
      {detail && !isLoading && (
        <>
          {/* Header: sprite · id · name · types */}
          <div className={styles.header}>
            <img src={detail.sprite} alt={detail.name} className={styles.sprite} />
            <div className={styles.meta}>
              <span className={styles.id}>#{String(detail.id).padStart(3, '0')}</span>
              <h2 className={styles.name}>{detail.name}</h2>
              <div className={styles.types}>
                {detail.types.map((t) => (
                  <PokemonTypeBadge key={t.name} type={t.name} />
                ))}
              </div>
            </div>
          </div>

          {/* Tabs — reusable component handles bar + active panel */}
          <Tabs
            // Reset to Stats tab when a new Pokémon is opened
            key={pokemonId}
            tabs={[
              {
                id: 'stats',
                label: 'Stats',
                content: <StatsTab stats={detail.stats} />,
              },
              {
                id: 'moves',
                label: 'Moves',
                content: <MovesTab moves={detail.moves} />,
              },
              {
                id: 'about',
                label: 'About',
                content: <AboutTab detail={detail} />,
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
}
