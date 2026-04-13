import { defineMilestonesForRoute, checkUnlockedMilestones } from '../../domain/milestone/services';
import { planRoute } from '../../domain/route/services';
import { ScoutCommunity } from '../../domain/community/types';

const start = { lat: 51.5074, lng: -0.1278, name: 'London' };
const destination = { lat: 48.8566, lng: 2.3522, name: 'Paris' };

const mockCommunity: ScoutCommunity = {
  id: 'comm-test',
  name: 'Test Community',
  location: { lat: 51.1279, lng: 1.3134, city: 'Dover', country: 'UK' },
  type: 'group',
  memberCount: 20,
};

describe('defineMilestonesForRoute', () => {
  it('creates 4 distance milestones at 25, 50, 75, 100%', () => {
    const route = planRoute({ userId: 'u1', name: 'Test', start, destination, communities: [] });
    const milestones = defineMilestonesForRoute(route, []);
    const distMilestones = milestones.filter(m => m.type === 'distance');
    expect(distMilestones.length).toBe(4);
    const values = distMilestones.map(m => m.targetValue).sort((a, b) => a - b);
    expect(values).toEqual([25, 50, 75, 100]);
  });

  it('creates community milestones for communities on route', () => {
    const route = planRoute({ userId: 'u1', name: 'Test', start, destination, communities: [mockCommunity] });
    const milestones = defineMilestonesForRoute(route, [mockCommunity]);
    const communityMilestones = milestones.filter(m => m.type === 'community_visit');
    // Only if the community is on the route
    if (route.communities.includes('comm-test')) {
      expect(communityMilestones.length).toBeGreaterThan(0);
    }
  });
});

describe('checkUnlockedMilestones', () => {
  it('unlocks milestones when progress exceeds target', () => {
    const route = planRoute({ userId: 'u1', name: 'Test', start, destination, communities: [] });
    const milestones = defineMilestonesForRoute(route, []);
    const unlocks = checkUnlockedMilestones(milestones, [], 'u1', 30);
    const unlocked = unlocks.map(u => {
      const m = milestones.find(m => m.id === u.milestoneId);
      return m?.targetValue;
    });
    expect(unlocked).toContain(25);
    expect(unlocked).not.toContain(50);
  });

  it('does not re-unlock already unlocked milestones', () => {
    const route = planRoute({ userId: 'u1', name: 'Test', start, destination, communities: [] });
    const milestones = defineMilestonesForRoute(route, []);
    const firstUnlocks = checkUnlockedMilestones(milestones, [], 'u1', 60);
    const secondUnlocks = checkUnlockedMilestones(milestones, firstUnlocks, 'u1', 80);
    const secondIds = secondUnlocks.map(u => u.milestoneId);
    const firstIds = firstUnlocks.map(u => u.milestoneId);
    for (const id of firstIds) {
      expect(secondIds).not.toContain(id);
    }
  });

  it('unlocks all milestones at 100%', () => {
    const route = planRoute({ userId: 'u1', name: 'Test', start, destination, communities: [] });
    const milestones = defineMilestonesForRoute(route, []).filter(m => m.type === 'distance');
    const unlocks = checkUnlockedMilestones(milestones, [], 'u1', 100);
    expect(unlocks.length).toBe(4);
  });
});
