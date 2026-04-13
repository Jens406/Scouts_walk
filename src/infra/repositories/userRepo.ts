import { db } from '../db';
import { UserProfile } from '../../domain/user/types';

export const userRepo = {
  save(user: UserProfile): void {
    db.users.set(user.id, user);
  },
  findById(id: string): UserProfile | undefined {
    return db.users.get(id);
  },
  findByEmail(email: string): UserProfile | undefined {
    return Array.from(db.users.values()).find(u => u.email === email);
  },
  findByUsername(username: string): UserProfile | undefined {
    return Array.from(db.users.values()).find(u => u.username === username);
  },
  findAll(): UserProfile[] {
    return Array.from(db.users.values());
  },
  delete(id: string): void {
    db.users.delete(id);
  },
};
