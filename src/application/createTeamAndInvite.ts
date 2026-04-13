import { createTeam, CreateTeamInput } from '../domain/team/services';
import { teamRepo } from '../infra/repositories/teamRepo';
import { userRepo } from '../infra/repositories/userRepo';
import { linkToTeam } from '../domain/user/services';
import { Team } from '../domain/team/types';

export function createTeamAndInvite(input: CreateTeamInput, inviteeIds: string[]): Team {
  const team = createTeam(input);
  const withInvitees = { ...team, memberIds: [...new Set([...team.memberIds, ...inviteeIds])] };
  teamRepo.save(withInvitees);

  for (const userId of withInvitees.memberIds) {
    const user = userRepo.findById(userId);
    if (user) userRepo.save(linkToTeam(user, withInvitees.id));
  }

  return withInvitees;
}
