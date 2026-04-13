import { db } from '../db';
import { Milestone, MilestoneUnlock } from '../../domain/milestone/types';

export const milestoneRepo = {
  save(milestone: Milestone): void {
    db.milestones.set(milestone.id, milestone);
  },
  findById(id: string): Milestone | undefined {
    return db.milestones.get(id);
  },
  findByRouteId(routeId: string): Milestone[] {
    return Array.from(db.milestones.values()).filter(m => m.routeId === routeId);
  },
  findAll(): Milestone[] {
    return Array.from(db.milestones.values());
  },
  saveUnlock(unlock: MilestoneUnlock): void {
    db.milestoneUnlocks.set(unlock.id, unlock);
  },
  findUnlocksByUser(userId: string): MilestoneUnlock[] {
    return Array.from(db.milestoneUnlocks.values()).filter(u => u.userId === userId);
  },
  findUnlocksByMilestone(milestoneId: string): MilestoneUnlock[] {
    return Array.from(db.milestoneUnlocks.values()).filter(u => u.milestoneId === milestoneId);
  },
  delete(id: string): void {
    db.milestones.delete(id);
  },
};
