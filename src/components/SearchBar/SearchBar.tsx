/**
 * SearchBar.tsx — Fuzzy search input for the Pokémon grid.
 *
 * Designed to sit inside the sticky TypeFilter bar as a second row.
 * Theme-aware: adapts between dark HUD and light mode.
 */

import styles from './SearchBar.module.css';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  resultCount?: number;
  hasQuery?: boolean;
}

export function SearchBar({ query, onChange, resultCount, hasQuery }: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <span className={styles.icon} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          className={styles.input}
          type="search"
          placeholder="Search Pokémon by name…"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button className={styles.clear} onClick={() => onChange('')} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {hasQuery && resultCount !== undefined && (
        <span className={styles.hint}>
          {resultCount === 0
            ? 'No matches found'
            : `${resultCount} Pokémon found`}
        </span>
      )}
    </div>
  );
}
