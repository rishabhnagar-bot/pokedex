/**
 * TeamContext.tsx — Global state for the user's battle team.
 *
 * Provides:
 *   - `team`       — the current list of TeamMember objects (max 6)
 *   - `addMember`  — add a Pokémon to the team (no-op if already at max or already added)
 *   - `removeMember` — remove a Pokémon by id
 *   - `clearTeam`  — remove all members
 *
 * Usage:
 *   Wrap <App> with <TeamProvider> in main.tsx.
 *   Consume with the `useTeam` hook from src/hooks/useTeam.ts.
 *
 * Note: Team state lives in memory only (not persisted to localStorage yet).
 * Persistence can be added here later without touching any component.
 */

import { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { TeamMember } from '../types/team';
import { MAX_TEAM_SIZE } from '../utils/constants';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface TeamContextValue {
  team: TeamMember[];
  addMember: (member: TeamMember) => void;
  removeMember: (id: number) => void;
  clearTeam: () => void;
}

export const TeamContext = createContext<TeamContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>([]);

  const addMember = useCallback((member: TeamMember) => {
    setTeam((prev) => {
      // Do nothing if team is full or member already exists
      if (prev.length >= MAX_TEAM_SIZE) return prev;
      if (prev.some((m) => m.id === member.id)) return prev;
      return [...prev, member];
    });
  }, []);

  const removeMember = useCallback((id: number) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearTeam = useCallback(() => {
    setTeam([]);
  }, []);

  return (
    <TeamContext.Provider value={{ team, addMember, removeMember, clearTeam }}>
      {children}
    </TeamContext.Provider>
  );
}
