import { Search } from 'lucide-react';
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
          <Search size={16} strokeWidth={2.5} />
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
