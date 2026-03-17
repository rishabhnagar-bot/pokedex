/**
 * useTeam.ts — Convenience hook for consuming TeamContext.
 *
 * Throws a clear error if used outside <TeamProvider> so that
 * missing provider setup is caught early during development.
 *
 * Usage:
 *   const { team, addMember, removeMember, clearTeam } = useTeam();
 */

import { useContext } from 'react';
import { TeamContext } from '../context/TeamContext';

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used inside <TeamProvider>');
  return ctx;
}
