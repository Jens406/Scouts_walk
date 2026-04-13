import { ChatMessage } from '../../domain/chat/types';

export interface ChatMessageDTO {
  id: string;
  channelId: string;
  channelType: string;
  userId: string;
  username: string;
  content: string;
  milestoneId?: string;
  communityId?: string;
  createdAt: string;
}

export function toChatMessageDTO(message: ChatMessage): ChatMessageDTO {
  return {
    id: message.id,
    channelId: message.channelId,
    channelType: message.channelType,
    userId: message.userId,
    username: message.username,
    content: message.content,
    milestoneId: message.milestoneId,
    communityId: message.communityId,
    createdAt: message.createdAt.toISOString(),
  };
}
