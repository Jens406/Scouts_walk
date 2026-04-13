import { v4 as uuidv4 } from 'uuid';
import { Badge, Achievement, XPEvent, BadgeType } from './types';
import { MilestoneUnlock } from '../milestone/types';

const BADGE_CATALOG: Badge[] = [
  { id: 'badge-first-step', type: 'first_step', name: 'First Step', description: 'Logged your first steps', iconUrl: '/icons/first-step.png', xpValue: 50 },
  { id: 'badge-community-visitor', type: 'community_visitor', name: 'Community Visitor', description: 'Visited a scout community', iconUrl: '/icons/community.png', xpValue: 100 },
  { id: 'badge-trail-blazer', type: 'trail_blazer', name: 'Trail Blazer', description: 'Completed 50% of a route', iconUrl: '/icons/trailblazer.png', xpValue: 150 },
  { id: 'badge-greeter', type: 'greeter', name: 'Greeter', description: 'Posted a greeting at a milestone', iconUrl: '/icons/greeter.png', xpValue: 75 },
  { id: 'badge-team-player', type: 'team_player', name: 'Team Player', description: 'Joined a scout team', iconUrl: '/icons/team.png', xpValue: 100 },
  { id: 'badge-distance-champion', type: 'distance_champion', name: 'Distance Champion', description: 'Completed a full route', iconUrl: '/icons/distance.png', xpValue: 300 },
  { id: 'badge-poi-explorer', type: 'poi_explorer', name: 'POI Explorer', description: 'Added a Point of Interest', iconUrl: '/icons/poi.png', xpValue: 75 },
];

export function getBadgeCatalog(): Badge[] {
  return BADGE_CATALOG;
}

export function awardBadgeOnMilestone(
  userId: string,
  unlock: MilestoneUnlock,
  milestoneType: string,
  existingBadgeTypes: BadgeType[]
): Achievement | null {
  let badgeType: BadgeType | null = null;

  if (milestoneType === 'community_visit' && !existingBadgeTypes.includes('community_visitor')) {
    badgeType = 'community_visitor';
  } else if (milestoneType === 'distance' && !existingBadgeTypes.includes('trail_blazer')) {
    badgeType = 'trail_blazer';
  } else if (milestoneType === 'greeting_sent' && !existingBadgeTypes.includes('greeter')) {
    badgeType = 'greeter';
  }

  if (!badgeType) return null;

  const badge = BADGE_CATALOG.find(b => b.type === badgeType);
  if (!badge) return null;

  return {
    id: uuidv4(),
    userId,
    badgeId: badge.id,
    routeId: unlock.milestoneId,
    earnedAt: new Date(),
  };
}

export function computeXPFromSteps(userId: string, steps: number): XPEvent {
  const amount = Math.floor(steps / 100);
  return {
    id: uuidv4(),
    userId,
    amount,
    reason: `Logged ${steps} steps`,
    createdAt: new Date(),
  };
}
