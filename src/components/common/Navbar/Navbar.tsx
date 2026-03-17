/**
 * Navbar.tsx — Top navigation bar.
 *
 * Contains:
 *   - Logo / title (left) — clicking it navigates back to the landing page.
 *   - Theme toggle button (right).
 *   - "Refresh Team" button — clears team and resets type filter.
 *   - "Battle Team" button with badge showing current team size (right).
 *
 * Props:
 *   - teamCount   — drives the badge count on the Battle Team button.
 *   - onTeamClick — opens the TeamDrawer.
 *   - onBack      — navigates back to the landing page.
 *   - onReset     — clears team and resets type filter.
 */

import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../Button';
import styles from './Navbar.module.css';

interface NavbarProps {
  teamCount: number;
  onTeamClick: () => void;
  onBack: () => void;
  onReset: () => void;
}

export function Navbar({ teamCount, onTeamClick, onBack, onReset }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.navbar}>
      <button className={styles.logo} onClick={onBack} aria-label="Back to home">
        <span className={styles.logoText}>Pocket Pokédex</span>
      </button>

      <div className={styles.actions}>
        <Button variant="warning" onClick={onReset}>
          Refresh Team
        </Button>

        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <Button
          variant={teamCount > 0 ? 'secondary' : 'primary'}
          badge={teamCount > 0 ? teamCount : undefined}
          onClick={onTeamClick}
        >
          Battle Team
        </Button>
      </div>
    </header>
  );
}
