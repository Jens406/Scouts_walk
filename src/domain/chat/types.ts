export type ChannelType = 'route' | 'milestone' | 'community' | 'team';

export interface ChatMessage {
  id: string;
  channelId: string;
  channelType: ChannelType;
  userId: string;
  username: string;
  content: string;
  milestoneId?: string;
  communityId?: string;
  createdAt: Date;
}

export interface ChatChannel {
  id: string;
  type: ChannelType;
  name: string;
  referenceId: string;
}
