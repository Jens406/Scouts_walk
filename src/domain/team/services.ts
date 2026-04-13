import { v4 as uuidv4 } from 'uuid';
import { Team, TeamType } from './types';

export interface CreateTeamInput {
  name: string;
  type: TeamType;
  description?: string;
  leaderId: string;
  scoutOrg: 'boy_scouts' | 'girl_scouts' | 'mixed';
  region: string;
}

export function createTeam(input: CreateTeamInput): Team {
  return {
    id: uuidv4(),
    name: input.name,
    type: input.type,
    description: input.description,
    leaderId: input.leaderId,
    memberIds: [input.leaderId],
    scoutOrg: input.scoutOrg,
    region: input.region,
    createdAt: new Date(),
  };
}

export function joinTeam(team: Team, userId: string): Team {
  if (team.memberIds.includes(userId)) return team;
  return { ...team, memberIds: [...team.memberIds, userId] };
}

export interface TeamStats {
  memberCount: number;
  leaderId: string;
  teamId: string;
  name: string;
}

export function teamStats(team: Team): TeamStats {
  return {
    memberCount: team.memberIds.length,
    leaderId: team.leaderId,
    teamId: team.id,
    name: team.name,
  };
}
