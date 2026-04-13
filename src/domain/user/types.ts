export type ScoutRole = 'scout' | 'scout_leader' | 'patrol_leader' | 'group_leader';
export type AreaOfInterest = 'hiking' | 'camping' | 'navigation' | 'first_aid' | 'environmental' | 'community_service';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: ScoutRole;
  teamId?: string;
  areasOfInterest: AreaOfInterest[];
  avatarUrl?: string;
  totalSteps: number;
  totalXP: number;
  badges: string[];
  createdAt: Date;
  updatedAt: Date;
}
