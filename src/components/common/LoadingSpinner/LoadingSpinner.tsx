/**
 * LoadingSpinner.tsx — Generic loading indicator.
 *
 * Used in:
 *   - PokemonGrid   — shown during initial page load.
 *   - PokemonModal  — shown while fetching detail data.
 *
 * Size variants: "sm" | "md" | "lg"
 */

import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className={[styles.spinner, styles[size]].join(' ')} role="status" aria-label="Loading" />
  );
}
