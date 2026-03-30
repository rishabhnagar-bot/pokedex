/**
 * CaughtAnimation.tsx — Tier-based "Pokémon caught" full-screen pop-up effect.
 *
 * Renders via a React portal onto document.body (z-index 300, pointer-events none).
 *
 * Each power tier gets a distinct 3D entrance animation and a zoom-through-screen exit
 * where the sprite scales to ~22× its size, bursting past the viewport edge.
 *
 * Tier durations are driven by TIER_DURATION from catchSound.ts so the component
 * auto-dismisses exactly when its animation ends.
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { SoundTier } from '../../utils/catchSound';
import { TIER_DURATION } from '../../utils/catchSound';
import styles from './CaughtAnimation.module.css';

interface CaughtAnimationProps {
  pokemon: { name: string; sprite: string; tier: SoundTier } | null;
  onDone: () => void;
}

const TIER_CLASS: Record<SoundTier, string> = {
  legendary: styles.tierLegendary,
  heavy:     styles.tierHeavy,
  nature:    styles.tierNature,
  tricky:    styles.tierTricky,
  normal:    styles.tierNormal,
};

export function CaughtAnimation({ pokemon, onDone }: CaughtAnimationProps) {
  useEffect(() => {
    if (!pokemon) return;
    const timer = setTimeout(onDone, TIER_DURATION[pokemon.tier]);
    return () => clearTimeout(timer);
  }, [pokemon, onDone]);

  if (!pokemon) return null;

  const tierClass = TIER_CLASS[pokemon.tier];

  return createPortal(
    <div
      className={`${styles.backdrop} ${tierClass}`}
      aria-live="assertive"
      role="status"
      aria-label={`${pokemon.name} added to team`}
    >
      <div className={styles.stage}>
        {/* Pokéball ring burst — 3 rings, colors set per tier in CSS */}
        <span className={`${styles.ring} ${styles.ring1}`} />
        <span className={`${styles.ring} ${styles.ring2}`} />
        <span className={`${styles.ring} ${styles.ring3}`} />

        {/* Sprite — 3D entrance + zoom-through-screen exit */}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className={styles.sprite}
          draggable={false}
        />

        {/* Name badge */}
        <div className={styles.label}>
          <span className={styles.name}>{pokemon.name}</span>
          <span className={styles.sub}>Added to team!</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
