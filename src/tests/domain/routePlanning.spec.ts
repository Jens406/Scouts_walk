import { planRoute, haversineKm, recalcProgress } from '../../domain/route/services';
import { ScoutCommunity } from '../../domain/community/types';
import { RoutePoint } from '../../domain/route/types';

const london: RoutePoint = { lat: 51.5074, lng: -0.1278, name: 'London' };
const paris: RoutePoint = { lat: 48.8566, lng: 2.3522, name: 'Paris' };

const mockCommunities: ScoutCommunity[] = [
  {
    id: 'comm-1',
    name: 'Folkestone Scouts',
    // On the London-Paris straight line path at approximately t=0.3
    location: { lat: 50.815, lng: 0.617, city: 'Folkestone', country: 'UK' },
    type: 'group',
    memberCount: 25,
  },
  {
    id: 'comm-2',
    name: 'Boulogne Scouts',
    // On the London-Paris straight line path at approximately t=0.45
    location: { lat: 50.236, lng: 1.116, city: 'Boulogne', country: 'France' },
    type: 'group',
    memberCount: 20,
  },
  {
    id: 'comm-far',
    name: 'Madrid Scouts',
    location: { lat: 40.4168, lng: -3.7038, city: 'Madrid', country: 'Spain' },
    type: 'group',
    memberCount: 42,
  },
];

describe('haversineKm', () => {
  it('calculates distance between London and Paris approximately correctly', () => {
    const dist = haversineKm(london.lat, london.lng, paris.lat, paris.lng);
    expect(dist).toBeGreaterThan(300);
    expect(dist).toBeLessThan(400);
  });

  it('returns 0 for same point', () => {
    const dist = haversineKm(51.5, -0.12, 51.5, -0.12);
    expect(dist).toBeCloseTo(0, 5);
  });
});

describe('planRoute', () => {
  it('creates a route with start and destination', () => {
    const route = planRoute({
      userId: 'user-1',
      name: 'London to Paris',
      start: london,
      destination: paris,
      communities: [],
    });
    expect(route.userId).toBe('user-1');
    expect(route.name).toBe('London to Paris');
    expect(route.segments.length).toBeGreaterThan(0);
    expect(route.totalDistanceKm).toBeGreaterThan(0);
  });

  it('snaps to communities within 20km of path', () => {
    const route = planRoute({
      userId: 'user-1',
      name: 'London to Paris',
      start: london,
      destination: paris,
      communities: mockCommunities,
    });
    expect(route.communities).toContain('comm-1');
    expect(route.communities).toContain('comm-2');
    expect(route.communities).not.toContain('comm-far');
  });

  it('calculates total distance as sum of segments', () => {
    const route = planRoute({
      userId: 'user-1',
      name: 'Test Route',
      start: london,
      destination: paris,
      communities: [],
    });
    const segmentSum = route.segments.reduce((s, seg) => s + seg.distanceKm, 0);
    expect(Math.abs(route.totalDistanceKm - segmentSum)).toBeLessThan(0.01);
  });

  it('initializes with zero progress', () => {
    const route = planRoute({
      userId: 'user-1',
      name: 'Test',
      start: london,
      destination: paris,
      communities: [],
    });
    expect(route.completedDistanceKm).toBe(0);
    expect(route.progressPercent).toBe(0);
  });
});

describe('recalcProgress', () => {
  it('updates progress correctly based on steps', () => {
    const route = planRoute({
      userId: 'user-1',
      name: 'Test',
      start: london,
      destination: paris,
      communities: [],
    });
    const stepsNeeded = Math.ceil(route.totalDistanceKm / 0.0008);
    const updated = recalcProgress(route, stepsNeeded);
    expect(updated.progressPercent).toBeCloseTo(100, 0);
    expect(updated.status).toBe('completed');
  });

  it('caps progress at 100%', () => {
    const route = planRoute({
      userId: 'user-1',
      name: 'Test',
      start: london,
      destination: paris,
      communities: [],
    });
    const updated = recalcProgress(route, 10_000_000);
    expect(updated.progressPercent).toBe(100);
    expect(updated.completedDistanceKm).toBe(route.totalDistanceKm);
  });
});
