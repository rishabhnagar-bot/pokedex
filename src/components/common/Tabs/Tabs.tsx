/**
 * Tabs.tsx — Generic reusable tab bar + content switcher.
 *
 * Renders a horizontal tab bar and displays the content of the active tab.
 * Each tab definition supplies the label and the content to render.
 *
 * Usage:
 *   const tabs = [
 *     { id: 'stats', label: 'Stats', content: <StatsTab /> },
 *     { id: 'moves', label: 'Moves', content: <MovesTab /> },
 *   ];
 *   <Tabs tabs={tabs} />
 *
 * Optional:
 *   defaultTab — id of the initially active tab (defaults to first tab)
 *   onChange   — callback fired when the active tab changes
 */

import { useState } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? '');

  const handleSelect = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div className={styles.container}>
      {/* Tab bar */}
      <div className={styles.tabList} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeId === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={[
              styles.tab,
              activeId === tab.id ? styles.tabActive : '',
            ].join(' ')}
            onClick={() => handleSelect(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div
        className={styles.panel}
        role="tabpanel"
        id={`tabpanel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
      >
        {activeTab?.content}
      </div>
    </div>
  );
}
