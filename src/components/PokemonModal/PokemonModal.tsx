/**
 * PokemonModal.tsx — Pokémon detail modal.
 * Two-card layout: hero card + tabs card.
 */

import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { Modal } from '../common/Modal';
import { Tabs } from '../common/Tabs';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { PokemonTypeBadge } from '../common/PokemonTypeBadge';
import { StatsTab } from './tabs/StatsTab';
import { MovesTab } from './tabs/MovesTab';
import { AboutTab } from './tabs/AboutTab';
import { Ruler, Scale, Zap, Star } from 'lucide-react';
import { formatHeight, formatWeight, formatName } from '../../utils/statHelpers';
import styles from './PokemonModal.module.css';

interface PokemonModalProps {
  pokemonId: number | null;
  onClose: () => void;
}

export function PokemonModal({ pokemonId, onClose }: PokemonModalProps) {
  const { detail, isLoading, error } = usePokemonDetail(pokemonId);

  return (
    <Modal isOpen={pokemonId !== null} onClose={onClose} maxWidth="520px" title="Pokémon Details">
      {isLoading && (
        <div className={styles.loadingState}>
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {detail && !isLoading && (
        <>
          {/* ── Card 1: Hero ── */}
          <div className={styles.heroCard}>
            <img src={detail.sprite} alt={detail.name} className={styles.sprite} />

            <div className={styles.meta}>
              <span className={styles.id}>#{String(detail.id).padStart(3, '0')}</span>
              <h2 className={styles.name}>{detail.name}</h2>
              <div className={styles.types}>
                {detail.types.map((t) => (
                  <PokemonTypeBadge key={t.name} type={t.name} />
                ))}
              </div>

              {/* 2×2 quick stats */}
              <div className={styles.quickStats}>
                <div className={styles.quickStat}>
                  <Ruler size={13} aria-hidden className={styles.qIcon} />
                  <div>
                    <span className={styles.qLabel}>Height</span>
                    <span className={styles.qValue}>{formatHeight(detail.height)}</span>
                  </div>
                </div>

                <div className={styles.quickStat}>
                  <Scale size={13} aria-hidden className={`${styles.qIcon} ${styles.qIconGreen}`} />
                  <div>
                    <span className={styles.qLabel}>Weight</span>
                    <span className={styles.qValue}>{formatWeight(detail.weight)}</span>
                  </div>
                </div>

                <div className={styles.quickStat}>
                  <Zap size={13} aria-hidden className={`${styles.qIcon} ${styles.qIconYellow}`} />
                  <div>
                    <span className={styles.qLabel}>Abilities</span>
                    <span className={styles.qValue}>{detail.abilities.map(formatName).join(', ')}</span>
                  </div>
                </div>

                {detail.hiddenAbility && (
                  <div className={styles.quickStat}>
                    <Star size={13} aria-hidden className={`${styles.qIcon} ${styles.qIconPurple}`} />
                    <div>
                      <span className={styles.qLabel}>Hidden Ability</span>
                      <span className={styles.qValue}>{formatName(detail.hiddenAbility)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Card 2: Tabs ── */}
          <div className={styles.tabsCard}>
            <Tabs
              key={pokemonId}
              tabs={[
                { id: 'stats', label: 'Stats',  content: <StatsTab stats={detail.stats} /> },
                { id: 'moves', label: 'Moves',  content: <MovesTab moves={detail.moves} /> },
                { id: 'about', label: 'About',  content: <AboutTab detail={detail} /> },
              ]}
            />
          </div>
        </>
      )}
    </Modal>
  );
}
