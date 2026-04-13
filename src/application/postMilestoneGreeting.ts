import { postMessage } from '../domain/chat/services';
import { chatRepo } from '../infra/repositories/chatRepo';
import { milestoneRepo } from '../infra/repositories/milestoneRepo';
import { userRepo } from '../infra/repositories/userRepo';
import { emitNewMessage, emitMilestoneUnlocked } from '../infra/messaging/websocketServer';
import { toChatMessageDTO } from '../api/mappers/chatMapper';

export interface PostMilestoneGreetingInput {
  userId: string;
  milestoneId: string;
  routeId: string;
  content?: string;
}

export function postMilestoneGreeting(input: PostMilestoneGreetingInput): void {
  const user = userRepo.findById(input.userId);
  if (!user) throw new Error('User not found');

  const milestone = milestoneRepo.findById(input.milestoneId);
  if (!milestone) throw new Error('Milestone not found');

  const content = input.content ?? `Greetings from ${user.displayName} at ${milestone.name}!`;

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
  emitMilestoneUnlocked(input.routeId, input.userId, input.milestoneId);
}
