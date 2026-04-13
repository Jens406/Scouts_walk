import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChannelType } from './types';

export interface PostMessageInput {
  channelId: string;
  channelType: ChannelType;
  userId: string;
  username: string;
  content: string;
  milestoneId?: string;
  communityId?: string;
}

export function postMessage(input: PostMessageInput): ChatMessage {
  return {
    id: uuidv4(),
    channelId: input.channelId,
    channelType: input.channelType,
    userId: input.userId,
    username: input.username,
    content: input.content,
    milestoneId: input.milestoneId,
    communityId: input.communityId,
    createdAt: new Date(),
  };
}

export function listMessagesForChannel(
  messages: ChatMessage[],
  channelId: string
): ChatMessage[] {
  return messages
    .filter(m => m.channelId === channelId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}
