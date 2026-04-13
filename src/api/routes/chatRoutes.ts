import { Router, Response } from 'express';
import { postMessage, listMessagesForChannel } from '../../domain/chat/services';
import { chatRepo } from '../../infra/repositories/chatRepo';
import { userRepo } from '../../infra/repositories/userRepo';
import { authMiddleware, AuthenticatedRequest } from '../../infra/auth/authMiddleware';
import { toChatMessageDTO } from '../mappers/chatMapper';
import { emitNewMessage } from '../../infra/messaging/websocketServer';
import { db } from '../../infra/db';

const router = Router({ mergeParams: true });

router.get('/:channelId/messages', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const messages = listMessagesForChannel(
    Array.from(db.chatMessages.values()),
    req.params.channelId
  );
  res.json(messages.map(toChatMessageDTO));
});

router.post('/:channelId/messages', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = userRepo.findById(req.userId!);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const { content, channelType, milestoneId, communityId } = req.body as {
    content: string;
    channelType: string;
    milestoneId?: string;
    communityId?: string;
  };

  if (!content || !channelType) {
    res.status(400).json({ error: 'content and channelType are required' });
    return;
  }

  const message = postMessage({
    channelId: req.params.channelId,
    channelType: channelType as any,
    userId: user.id,
    username: user.username,
    content,
    milestoneId,
    communityId,
  });

  chatRepo.saveMessage(message);
  emitNewMessage(req.params.channelId, toChatMessageDTO(message));

  res.status(201).json(toChatMessageDTO(message));
});

export default router;
