/**
 * LandingPage.tsx — Full-screen hero that matches the Figma cover design.
 *
 * Design:
 *   - Deep purple starry background (CSS gradient + generated star field)
 *   - Top-left: small "Pocket Pokédex" + "Ready to Explore" tags (matching Figma badges)
 *   - Large bold left-aligned title
 *   - Subtitle paragraph
 *   - "Start Exploring" CTA button → calls onStart() to reveal the main app
 *
 * Animations (framer-motion):
 *   - Stars: fade in on mount
 *   - Tags, title, subtitle, button: staggered slide-up entrance
 *   - Button: hover scale + tap press
 *   - Exit: whole page fades out when onStart is clicked
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoUrl from '../../assets/pokemon-ball-logo.png';
import styles from './LandingPage.module.css';

interface LandingPageProps {
  onStart: () => void;
}

// ── Deterministic star field (golden-ratio distribution, no randomness) ──────
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

function useStars(count: number): Star[] {
  return useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: (i * 23.7  + i * i * 0.013) % 100,
      y: (i * 17.31 + i * i * 0.007) % 100,
      size:    i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : 1,
      opacity: 0.2 + (i % 8) * 0.09,
      delay:   (i % 5) * 0.7,
    })), [count]
  );
}

// ── Animation variants ────────────────────────────────────────────────────────

const pageVariants = {
  visible: { opacity: 1 },
  exit:    { opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
};

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function LandingPage({ onStart }: LandingPageProps) {
  const stars = useStars(3000);

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="visible"
      exit="exit"
    >
      {/* ── Star field ── */}
      <motion.div
        className={styles.starField}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        aria-hidden
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left:             `${s.x}%`,
              top:              `${s.y}%`,
              width:            `${s.size}px`,
              height:           `${s.size}px`,
              opacity:          s.opacity,
              animationDelay:   `${s.delay}s`,
            }}
          />
        ))}
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Spinning Pokéball logo */}
        <motion.img
          src={logoUrl}
          alt=""
          className={styles.heroBall}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            opacity:  { duration: 0.6, delay: 0.2 },
            scale:    { duration: 0.6, delay: 0.2 },
            rotate:   { duration: 12, repeat: Infinity, ease: 'linear', delay: 0 },
          }}
        />

        {/* Title */}
        <motion.h1 className={styles.title} variants={itemVariants}>
          Pokédex
        </motion.h1>

        {/* Subtitle */}
        <motion.p className={styles.subtitle} variants={itemVariants}>
          <h4>Browse, filter, and explore every Pokémon.</h4>
          <h3>Build your ultimate battle team.</h3>
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <motion.button
            className={styles.startBtn}
            onClick={onStart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Exploring
            <span className={styles.arrow}>→</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
