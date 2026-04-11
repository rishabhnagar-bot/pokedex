import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import type { ColorTheme } from '../../../context/ThemeContext';
import type { TeamMember } from '../../../types/team';
import styles from './Navbar.module.css';

interface NavbarProps {
  team: TeamMember[];
  onTeamClick: () => void;
  onBack: () => void;
  onReset: () => void;
}

const THEMES: { id: ColorTheme; label: string; color: string | null }[] = [
  { id: 'default',   label: 'Default Theme', color: null },
  { id: 'normal',    label: 'Normal Type',   color: '#A8A77A' },
  { id: 'fire',      label: 'Fire Type',     color: '#EE8130' },
  { id: 'water',     label: 'Water Type',    color: '#6390F0' },
  { id: 'electric',  label: 'Electric Type', color: '#F7D02C' },
  { id: 'grass',     label: 'Grass Type',    color: '#7AC74C' },
  { id: 'ice',       label: 'Ice Type',      color: '#96D9D6' },
  { id: 'fighting',  label: 'Fighting Type', color: '#C22E28' },
  { id: 'poison',    label: 'Poison Type',   color: '#A33EA1' },
  { id: 'ground',    label: 'Ground Type',   color: '#E2BF65' },
  { id: 'flying',    label: 'Flying Type',   color: '#A98FF3' },
  { id: 'psychic',   label: 'Psychic Type',  color: '#F95587' },
  { id: 'bug',       label: 'Bug Type',      color: '#A6B91A' },
  { id: 'rock',      label: 'Rock Type',     color: '#B6A136' },
  { id: 'ghost',     label: 'Ghost Type',    color: '#735797' },
  { id: 'dragon',    label: 'Dragon Type',   color: '#6F35FC' },
  { id: 'dark',      label: 'Dark Type',     color: '#705746' },
  { id: 'steel',     label: 'Steel Type',    color: '#B7B7CE' },
  { id: 'fairy',     label: 'Fairy Type',    color: '#D685AD' },
];

export function Navbar({ onBack }: NavbarProps) {
  const { theme, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES.find((t) => t.id === colorTheme) ?? THEMES[0];

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  return (
    <header className={styles.navbar}>
      {/* Left: logo + title */}
      <button className={styles.title} onClick={onBack} aria-label="Back to home">
        <img src="/pokemon-ball-logo.png" alt="" className={styles.logo} aria-hidden />
        Pocket Pokédex
      </button>

      {/* Right: theme dropdown + light/dark toggle */}
      <div className={styles.actions}>

        {/* ── Theme colour dropdown ── */}
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button
            className={`${styles.themeBtn} ${isOpen ? styles.themeBtnOpen : ''}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            {/* Paintbrush icon */}
            <svg className={styles.paintbrush} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3z"/>
              <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
              <path d="M14.5 17.5 4.5 15"/>
            </svg>
            <span>{activeTheme.label}</span>
            <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {isOpen && (
            <div className={styles.dropdown} role="listbox">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.dropdownItem} ${t.id === colorTheme ? styles.dropdownItemActive : ''}`}
                  role="option"
                  aria-selected={t.id === colorTheme}
                  onClick={() => { setColorTheme(t.id); setIsOpen(false); }}
                >
                  {t.color ? (
                    <span className={styles.typeDot} style={{ backgroundColor: t.color }} />
                  ) : (
                    <span className={styles.typeDotEmpty} />
                  )}
                  <span className={styles.dropdownLabel}>{t.label}</span>
                  {t.id === colorTheme && (
                    <svg className={styles.dropdownCheck} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Light / dark mode toggle (sun icon, square) ── */}
        <button
          className={`${styles.modeBtn} ${theme === 'dark' ? styles.modeBtnDark : ''}`}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {/* Sun icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
        </button>

      </div>
    </header>
  );
}
