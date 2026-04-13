import { db } from '../db';
import { ChatMessage, ChatChannel } from '../../domain/chat/types';

export const chatRepo = {
  saveMessage(message: ChatMessage): void {
    db.chatMessages.set(message.id, message);
  },
  findMessagesByChannel(channelId: string): ChatMessage[] {
    return Array.from(db.chatMessages.values())
      .filter(m => m.channelId === channelId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },
  findMessageById(id: string): ChatMessage | undefined {
    return db.chatMessages.get(id);
  },
  saveChannel(channel: ChatChannel): void {
    db.chatChannels.set(channel.id, channel);
  },
  findChannelById(id: string): ChatChannel | undefined {
    return db.chatChannels.get(id);
  },
  findAllChannels(): ChatChannel[] {
    return Array.from(db.chatChannels.values());
  },
};
