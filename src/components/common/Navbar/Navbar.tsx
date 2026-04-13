import { useEffect, useRef, useState } from 'react';
import { Paintbrush, ChevronDown, Check, Sun } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import type { ColorTheme } from '../../../context/ThemeContext';
import { TYPE_COLORS } from '../../../utils/typeColors';
import styles from './Navbar.module.css';

interface NavbarProps {
  onBack: () => void;
}

const THEMES: { id: ColorTheme; label: string; color: string | null }[] = [
  { id: 'default', label: 'Default Theme', color: null },
  ...(Object.entries(TYPE_COLORS) as [ColorTheme, string][]).map(([id, color]) => ({
    id,
    label: `${id.charAt(0).toUpperCase()}${id.slice(1)} Type`,
    color,
  })),
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

        {/* Theme colour dropdown */}
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <button
            className={`${styles.themeBtn} ${isOpen ? styles.themeBtnOpen : ''}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <Paintbrush className={styles.paintbrush} size={15} />
            <span>{activeTheme.label}</span>
            <ChevronDown className={styles.chevron} size={12} />
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
                    <Check className={styles.dropdownCheck} size={14} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Light / dark toggle */}
        <button
          className={`${styles.modeBtn} ${theme === 'dark' ? styles.modeBtnDark : ''}`}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <Sun size={16} />
        </button>

      </div>
    </header>
  );
}
