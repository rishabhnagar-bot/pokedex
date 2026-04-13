import { useContext } from 'react';
import { TeamContext } from '../context/TeamContext';

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error('useTeam must be used inside <TeamProvider>');
  return ctx;
}
