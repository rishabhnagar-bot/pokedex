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
import { formatHeight, formatWeight } from '../../utils/statHelpers';
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
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={styles.qIcon}>
                    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/>
                    <path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/>
                  </svg>
                  <div>
                    <span className={styles.qLabel}>Height</span>
                    <span className={styles.qValue}>{formatHeight(detail.height)}</span>
                  </div>
                </div>

                <div className={styles.quickStat}>
                  {/* balance / scale icon */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${styles.qIcon} ${styles.qIconGreen}`}>
                    <path d="M12 3v19"/><path d="M5 3h14"/><path d="M5 3l-3 7c0 2.21 2.69 4 6 4s6-1.79 6-4z"/><path d="M19 3l-3 7c0 2.21 2.69 4 6 4s6-1.79 6-4z"/><path d="M3 22h18"/>
                  </svg>
                  <div>
                    <span className={styles.qLabel}>Weight</span>
                    <span className={styles.qValue}>{formatWeight(detail.weight)}</span>
                  </div>
                </div>

                <div className={styles.quickStat}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${styles.qIcon} ${styles.qIconYellow}`}>
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/>
                  </svg>
                  <div>
                    <span className={styles.qLabel}>Abilities</span>
                    <span className={styles.qValue}>{detail.abilities.map((a) => a.replace(/-/g, ' ')).join(', ')}</span>
                  </div>
                </div>

                {detail.hiddenAbility && (
                  <div className={styles.quickStat}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`${styles.qIcon} ${styles.qIconPurple}`}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <div>
                      <span className={styles.qLabel}>Hidden Ability</span>
                      <span className={styles.qValue}>{detail.hiddenAbility.replace(/-/g, ' ')}</span>
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
