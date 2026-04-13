import { db } from '../db';
import { Team } from '../../domain/team/types';

export const teamRepo = {
  save(team: Team): void {
    db.teams.set(team.id, team);
  },
  findById(id: string): Team | undefined {
    return db.teams.get(id);
  },
  findAll(): Team[] {
    return Array.from(db.teams.values());
  },
  delete(id: string): void {
    db.teams.delete(id);
  },
};
