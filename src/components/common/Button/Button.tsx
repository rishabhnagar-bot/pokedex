/**
 * Button.tsx — Reusable button component.
 *
 * Variants:
 *   - "primary"   — filled, used for main CTAs like "Load More" and "Add to Team".
 *   - "secondary" — outlined, used for secondary actions.
 *   - "ghost"     — no border or background, used for icon buttons (close, remove).
 *
 * The `badge` prop renders a small number indicator on the button,
 * used by the "Battle Team" button in the Navbar to show team count.
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'warning';
  badge?: number;
  children: ReactNode;
}

export function Button({ variant = 'primary', badge, children, className, ...rest }: ButtonProps) {
  return (
    <button
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className={styles.badge}>{badge}</span>
      )}
    </button>
  );
}
