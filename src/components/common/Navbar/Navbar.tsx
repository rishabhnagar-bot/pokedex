import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../Button';
import logoUrl from '../../../assets/pokemon-ball-logo.png';
import { MAX_TEAM_SIZE } from '../../../utils/constants';
import type { TeamMember } from '../../../types/team';
import styles from './Navbar.module.css';

interface NavbarProps {
  team: TeamMember[];
  onTeamClick: () => void;
  onBack: () => void;
  onReset: () => void;
}

export function Navbar({ team, onTeamClick, onBack, onReset }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const teamCount = team.length;
  const isFull = teamCount >= MAX_TEAM_SIZE;

  return (
    <header className={styles.navbar}>

      {/* ── Left: Logo ── */}
      <button className={styles.logo} onClick={onBack} aria-label="Back to home">
        <img src={logoUrl} alt="" className={styles.logoImg} />
        <span className={styles.logoText}>Pokédex</span>
      </button>

      {/* ── Center: 6 Pokéball slot indicators ── */}
      <div
        className={`${styles.teamSlots} ${isFull ? styles.slotsComplete : ''}`}
        aria-label={`Team: ${teamCount} of ${MAX_TEAM_SIZE}`}
      >
        {Array.from({ length: MAX_TEAM_SIZE }, (_, i) => {
          const member = team[i];
          return (
            <div
              key={i}
              className={styles.slotWrapper}
              data-name={member ? member.name : undefined}
            >
              <span
                className={`${styles.slot} ${member ? styles.slotFilled : ''}`}
                aria-hidden
              >
                {member && (
                  <img
                    src={member.sprite}
                    alt={member.name}
                    className={styles.slotSprite}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Right: Actions ── */}
      <div className={styles.actions}>
        <Button variant="warning" onClick={onReset} className={styles.navBtn}>
          Reset
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
          className={`${styles.navBtn} ${isFull ? styles.navBtnFull : ''}`}
        >
          Battle Team
        </Button>
      </div>
    </header>
  );
}
