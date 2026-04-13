export type BadgeType = 'first_step' | 'community_visitor' | 'trail_blazer' | 'greeter' | 'team_player' | 'distance_champion' | 'poi_explorer';

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  iconUrl: string;
  xpValue: number;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  routeId?: string;
  earnedAt: Date;
}

export interface XPEvent {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  createdAt: Date;
}
