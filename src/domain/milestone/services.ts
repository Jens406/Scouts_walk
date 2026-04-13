import { v4 as uuidv4 } from 'uuid';
import { Milestone, MilestoneUnlock } from './types';
import { Route } from '../route/types';
import { ScoutCommunity } from '../community/types';

export function defineMilestonesForRoute(route: Route, communities: ScoutCommunity[]): Milestone[] {
  const milestones: Milestone[] = [];
  let order = 1;

  for (const pct of [25, 50, 75, 100]) {
    const targetKm = route.totalDistanceKm * pct / 100;
    milestones.push({
      id: uuidv4(),
      routeId: route.id,
      type: 'distance',
      name: `${pct}% Complete`,
      description: `Reached ${pct}% of the route (${targetKm.toFixed(1)} km)`,
      targetValue: pct,
      chatChannelId: uuidv4(),
      order: order++,
    });
  }

  for (const communityId of route.communities) {
    const community = communities.find(c => c.id === communityId);
    if (!community) continue;
    milestones.push({
      id: uuidv4(),
      routeId: route.id,
      type: 'community_visit',
      name: `Visit ${community.name}`,
      description: `Pass through ${community.name} scout community in ${community.location.city}`,
      targetValue: 1,
      location: { lat: community.location.lat, lng: community.location.lng },
      communityId: community.id,
      chatChannelId: uuidv4(),
      order: order++,
    });
  }

  return milestones;
}

export function checkUnlockedMilestones(
  milestones: Milestone[],
  existingUnlocks: MilestoneUnlock[],
  userId: string,
  progressPercent: number
): MilestoneUnlock[] {
  const newUnlocks: MilestoneUnlock[] = [];
  const alreadyUnlocked = new Set(existingUnlocks.map(u => u.milestoneId));

  for (const milestone of milestones) {
    if (alreadyUnlocked.has(milestone.id)) continue;
    if (milestone.type === 'distance' && progressPercent >= milestone.targetValue) {
      newUnlocks.push({
        id: uuidv4(),
        milestoneId: milestone.id,
        userId,
        unlockedAt: new Date(),
        greetingPosted: false,
      });
    }
  }

  return newUnlocks;
}
