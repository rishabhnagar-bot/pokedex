/**
 * CardOpenEffect.tsx — Brief portal animation when a card is clicked to open.
 *
 * Mirrors the "caught" animation style: full-screen overlay, expanding rings,
 * sprite flash. Runs for ~480 ms concurrently with the modal entrance.
 *
 * pointer-events: none so it never blocks interaction.
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './CardOpenEffect.module.css';

interface CardOpenEffectProps {
  pokemon: { sprite: string; name: string } | null;
  onDone: () => void;
}

const DURATION_MS = 500;

export function CardOpenEffect({ pokemon, onDone }: CardOpenEffectProps) {
  useEffect(() => {
    if (!pokemon) return;
    const id = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(id);
  }, [pokemon, onDone]);

  return createPortal(
    <AnimatePresence>
      {pokemon && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {/* Outer expanding ring */}
          <motion.div
            className={styles.ring}
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 4.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Inner ring, slightly delayed */}
          <motion.div
            className={`${styles.ring} ${styles.ringInner}`}
            initial={{ scale: 0.1, opacity: 0.8 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.06 }}
          />

          {/* Sprite — scales up and fades out */}
          <motion.img
            src={pokemon.sprite}
            alt={pokemon.name}
            className={styles.sprite}
            initial={{ scale: 0.6, opacity: 0, filter: 'brightness(4) blur(6px)' }}
            animate={{
              scale: [0.6, 1.5, 1.8],
              opacity: [0, 1, 0],
              filter: ['brightness(4) blur(6px)', 'brightness(1.2) blur(0px)', 'brightness(2) blur(3px)'],
            }}
            transition={{ duration: 0.48, ease: 'easeOut', times: [0, 0.45, 1] }}
          />

          {/* Radial flash from center */}
          <motion.div
            className={styles.flash}
            initial={{ opacity: 0.7, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
