import { createUser, CreateUserInput } from '../domain/user/services';
import { userRepo } from '../infra/repositories/userRepo';
import { UserProfile } from '../domain/user/types';

export async function createUserProfile(input: CreateUserInput): Promise<UserProfile> {
  const existing = userRepo.findByEmail(input.email);
  if (existing) throw new Error('Email already in use');

  const user = await createUser(input);
  userRepo.save(user);
  return user;
}
