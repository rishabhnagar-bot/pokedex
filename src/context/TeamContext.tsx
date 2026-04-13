import { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { TeamMember } from '../types/team';
import type { PokemonStat } from '../types/pokemon';
import { MAX_TEAM_SIZE } from '../utils/constants';

interface TeamContextValue {
  team: TeamMember[];
  addMember: (member: TeamMember) => void;
  removeMember: (id: number) => void;
  clearTeam: () => void;
  updateMemberStats: (id: number, stats: PokemonStat[]) => void;
}

export const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<TeamMember[]>([]);

  const addMember = useCallback((member: TeamMember) => {
    setTeam((prev) => {
      if (prev.length >= MAX_TEAM_SIZE) return prev;
      if (prev.some((m) => m.id === member.id)) return prev;
      return [...prev, member];
    });
  }, []);

  const removeMember = useCallback((id: number) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearTeam = useCallback(() => setTeam([]), []);

  const updateMemberStats = useCallback((id: number, stats: PokemonStat[]) => {
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, stats } : m)));
  }, []);

  return (
    <TeamContext.Provider value={{ team, addMember, removeMember, clearTeam, updateMemberStats }}>
      {children}
    </TeamContext.Provider>
  );
}
