/**
 * TeamDrawer.tsx — Slide-in panel for the Team Builder.
 *
 * Structure:
 *   ┌────────────────────────────┐
 *   │  Battle Team    [X] [Clear]│
 *   │  ─────────────────────────│
 *   │  [Team] [Stats] [Coverage] │
 *   │  ─────────────────────────│
 *   │  <tab content>             │
 *   └────────────────────────────┘
 *
 * Behaviours:
 *   - Slides in from the right when `isOpen` is true.
 *   - Clicking the backdrop closes the drawer.
 *   - Body scroll is locked while the drawer is open.
 *   - "Clear All" removes all team members after confirmation (simple window.confirm for now).
 *
 * Props:
 *   - isOpen    — controls drawer visibility
 *   - onClose   — callback to close the drawer
 */

import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useTeam } from '../../hooks/useTeam';
import { TeamTab } from './tabs/TeamTab';
import { TeamStatsTab } from './tabs/StatsTab';
import { CoverageTab } from './tabs/CoverageTab';
import type { DrawerTab } from '../../utils/constants';
import { DRAWER_TABS } from '../../utils/constants';
import styles from './TeamDrawer.module.css';

const TAB_LABELS: Record<DrawerTab, string> = {
  team: 'Team',
  stats: 'Stats',
  coverage: 'Coverage',
};

interface TeamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeamDrawer({ isOpen, onClose }: TeamDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>('team');
  const { team, removeMember, clearTeam } = useTeam();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClearAll = () => {
    if (team.length > 0 && window.confirm('Clear all Pokémon from your team?')) {
      clearTeam();
    }
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Backdrop — only rendered when open so it doesn't intercept events when closed */}
      {isOpen && (
        <div className={styles.backdrop} onClick={handleBackdropClick} aria-hidden="true" />
      )}

      <aside
        className={[styles.drawer, isOpen ? styles.open : ''].join(' ')}
        aria-label="Battle Team"
        role="complementary"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Battle Team</h2>
          <div className={styles.headerActions}>
            {team.length > 0 && (
              <button className={styles.clearBtn} onClick={handleClearAll}>
                Clear All
              </button>
            )}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
              ✕
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className={styles.tabs} role="tablist">
          {DRAWER_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={[styles.tab, activeTab === tab ? styles.tabActive : ''].join(' ')}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.content}>
          {activeTab === 'team'     && <TeamTab members={team} onRemove={removeMember} />}
          {activeTab === 'stats'    && <TeamStatsTab members={team} />}
          {activeTab === 'coverage' && <CoverageTab members={team} />}
        </div>
      </aside>
    </>
  );
}
