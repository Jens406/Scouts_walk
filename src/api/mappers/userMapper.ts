import { UserProfile } from '../../domain/user/types';

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  teamId?: string;
  areasOfInterest: string[];
  avatarUrl?: string;
  totalSteps: number;
  totalXP: number;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export function toUserDTO(user: UserProfile): UserDTO {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    teamId: user.teamId,
    areasOfInterest: user.areasOfInterest,
    avatarUrl: user.avatarUrl,
    totalSteps: user.totalSteps,
    totalXP: user.totalXP,
    badges: user.badges,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
