import { awardBadgeOnMilestone, computeXPFromSteps, getBadgeCatalog } from '../domain/gamification/services';
import { db } from '../infra/db';
import { userRepo } from '../infra/repositories/userRepo';
import { MilestoneUnlock } from '../domain/milestone/types';
import { milestoneRepo } from '../infra/repositories/milestoneRepo';
import { BadgeType } from '../domain/gamification/types';

export function awardAchievements(userId: string, unlock: MilestoneUnlock): void {
  const milestone = milestoneRepo.findById(unlock.milestoneId);
  if (!milestone) return;

  const existingAchievements = Array.from(db.achievements.values()).filter(a => a.userId === userId);
  const badgeCatalog = getBadgeCatalog();
  const existingBadgeTypes = existingAchievements
    .map(a => {
      const badge = badgeCatalog.find(b => b.id === a.badgeId);
      return badge?.type;
    })
    .filter((t): t is BadgeType => t !== undefined);

  const achievement = awardBadgeOnMilestone(userId, unlock, milestone.type, existingBadgeTypes);
  if (achievement) {
    db.achievements.set(achievement.id, achievement);
    const user = userRepo.findById(userId);
    if (user) {
      const badge = getBadgeCatalog().find(b => b.id === achievement.badgeId);
      if (badge) {
        userRepo.save({ ...user, badges: [...user.badges, achievement.badgeId], updatedAt: new Date() });
      }
    }
  }
}

export function awardStepXP(userId: string, steps: number): void {
  const xpEvent = computeXPFromSteps(userId, steps);
  db.xpEvents.set(xpEvent.id, xpEvent);

  const user = userRepo.findById(userId);
  if (user) {
    userRepo.save({ ...user, totalXP: user.totalXP + xpEvent.amount, updatedAt: new Date() });
  }
}
