/**
 * PokemonModal.tsx — Pokémon detail modal with type-colored hero banner.
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

  // Primary type color drives the banner gradient
  const primaryColor = detail?.types[0]?.color ?? '#6366f1';

  return (
    <Modal isOpen={pokemonId !== null} onClose={onClose} maxWidth="720px">
      {isLoading && (
        <div className={styles.loadingState}>
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {detail && !isLoading && (
        <>
          {/* ── Hero banner ── */}
          <div
            className={styles.banner}
            style={{
              '--primary-color': primaryColor,
              '--secondary-color': detail.types[1]?.color ?? primaryColor,
            } as React.CSSProperties}
          >
            {/* Decorative blobs */}
            <div className={styles.blobTR} />
            <div className={styles.blobBL} />

            {/* Floating sprite */}
            <div className={styles.spriteWrap}>
              <div className={styles.spriteRing} />
              <img src={detail.sprite} alt={detail.name} className={styles.sprite} />
            </div>

            {/* Name / ID / types */}
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

          {/* ── Tabs ── */}
          <Tabs
            key={pokemonId}
            tabs={[
              { id: 'stats', label: 'Stats',  content: <StatsTab stats={detail.stats} /> },
              { id: 'moves', label: 'Moves',  content: <MovesTab moves={detail.moves} /> },
              { id: 'about', label: 'About',  content: <AboutTab detail={detail} /> },
            ]}
          />
        </>
      )}
    </Modal>
  );
}
