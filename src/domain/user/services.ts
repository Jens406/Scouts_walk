import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { UserProfile, ScoutRole, AreaOfInterest } from './types';

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  displayName: string;
  role: ScoutRole;
  areasOfInterest?: AreaOfInterest[];
}

export interface UpdateProfileInput {
  displayName?: string;
  role?: ScoutRole;
  areasOfInterest?: AreaOfInterest[];
  avatarUrl?: string;
  teamId?: string;
}

export async function createUser(input: CreateUserInput): Promise<UserProfile> {
  const passwordHash = await bcrypt.hash(input.password, 10);
  const now = new Date();
  return {
    id: uuidv4(),
    username: input.username,
    email: input.email,
    passwordHash,
    displayName: input.displayName,
    role: input.role,
    areasOfInterest: input.areasOfInterest ?? [],
    totalSteps: 0,
    totalXP: 0,
    badges: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function updateProfile(user: UserProfile, input: UpdateProfileInput): UserProfile {
  return {
    ...user,
    ...(input.displayName !== undefined && { displayName: input.displayName }),
    ...(input.role !== undefined && { role: input.role }),
    ...(input.areasOfInterest !== undefined && { areasOfInterest: input.areasOfInterest }),
    ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
    ...(input.teamId !== undefined && { teamId: input.teamId }),
    updatedAt: new Date(),
  };
}

export function linkToTeam(user: UserProfile, teamId: string): UserProfile {
  return { ...user, teamId, updatedAt: new Date() };
}

export async function verifyPassword(user: UserProfile, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
