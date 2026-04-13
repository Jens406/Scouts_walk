import { Router, Response } from 'express';
import { createTeam, joinTeam, teamStats } from '../../domain/team/services';
import { teamRepo } from '../../infra/repositories/teamRepo';
import { userRepo } from '../../infra/repositories/userRepo';
import { authMiddleware, AuthenticatedRequest } from '../../infra/auth/authMiddleware';
import { linkToTeam } from '../../domain/user/services';

const router = Router();

router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { name, type, description, scoutOrg, region } = req.body as {
    name: string;
    type: string;
    description?: string;
    scoutOrg: string;
    region: string;
  };

  if (!name || !type || !scoutOrg || !region) {
    res.status(400).json({ error: 'name, type, scoutOrg, and region are required' });
    return;
  }

  const team = createTeam({
    name,
    type: type as any,
    description,
    leaderId: req.userId!,
    scoutOrg: scoutOrg as any,
    region,
  });

  teamRepo.save(team);

  const user = userRepo.findById(req.userId!);
  if (user) userRepo.save(linkToTeam(user, team.id));

  res.status(201).json(team);
});

router.get('/:id', authMiddleware, (req, res: Response) => {
  const team = teamRepo.findById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  res.json(team);
});

router.post('/:id/join', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const team = teamRepo.findById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }

  const updated = joinTeam(team, req.userId!);
  teamRepo.save(updated);

  const user = userRepo.findById(req.userId!);
  if (user) userRepo.save(linkToTeam(user, team.id));

  res.json(updated);
});

router.get('/:id/members', authMiddleware, (req, res: Response) => {
  const team = teamRepo.findById(req.params.id);
  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }
  const members = team.memberIds.map(id => userRepo.findById(id)).filter(Boolean);
  res.json({ stats: teamStats(team), members });
});

export default router;
