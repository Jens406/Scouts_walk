export type MilestoneType = 'community_visit' | 'distance' | 'poi_reached' | 'steps_count' | 'greeting_sent';

export interface Milestone {
  id: string;
  routeId: string;
  type: MilestoneType;
  name: string;
  description: string;
  targetValue: number;
  location?: { lat: number; lng: number };
  communityId?: string;
  chatChannelId: string;
  order: number;
}

export interface MilestoneUnlock {
  id: string;
  milestoneId: string;
  userId: string;
  unlockedAt: Date;
  greetingPosted: boolean;
}
