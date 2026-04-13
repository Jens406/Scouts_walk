import { Router, Response } from 'express';
import { milestoneRepo } from '../../infra/repositories/milestoneRepo';
import { routeRepo } from '../../infra/repositories/routeRepo';
import { chatRepo } from '../../infra/repositories/chatRepo';
import { userRepo } from '../../infra/repositories/userRepo';
import { authMiddleware, AuthenticatedRequest } from '../../infra/auth/authMiddleware';
import { postMessage } from '../../domain/chat/services';
import { emitMilestoneUnlocked, emitNewMessage } from '../../infra/messaging/websocketServer';
import { toChatMessageDTO } from '../mappers/chatMapper';

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const route = routeRepo.findById(req.params.id);
  if (!route || route.userId !== req.userId) {
    res.status(404).json({ error: 'Route not found' });
    return;
  }
  res.json(milestoneRepo.findByRouteId(route.id));
});

router.post('/:milestoneId/greet', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const route = routeRepo.findById(req.params.id);
  if (!route || route.userId !== req.userId) {
    res.status(404).json({ error: 'Route not found' });
    return;
  }

  const milestone = milestoneRepo.findById(req.params.milestoneId);
  if (!milestone || milestone.routeId !== route.id) {
    res.status(404).json({ error: 'Milestone not found' });
    return;
  }

  const user = userRepo.findById(req.userId!);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const content = (req.body as { content?: string }).content ?? `Hello from ${user.displayName} at ${milestone.name}!`;

  const message = postMessage({
    channelId: milestone.chatChannelId,
    channelType: 'milestone',
    userId: user.id,
    username: user.username,
    content,
    milestoneId: milestone.id,
  });

  chatRepo.saveMessage(message);
  emitNewMessage(milestone.chatChannelId, toChatMessageDTO(message));
  emitMilestoneUnlocked(route.id, user.id, milestone.id);

  res.status(201).json(toChatMessageDTO(message));
});

export default router;
