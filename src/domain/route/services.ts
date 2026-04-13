import { v4 as uuidv4 } from 'uuid';
import { Route, RoutePoint, RouteSegment } from './types';
import { ScoutCommunity } from '../community/types';

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function interpolatePoint(start: RoutePoint, end: RoutePoint, t: number): RoutePoint {
  return {
    lat: start.lat + (end.lat - start.lat) * t,
    lng: start.lng + (end.lng - start.lng) * t,
  };
}

function isNearPath(
  start: RoutePoint,
  end: RoutePoint,
  point: RoutePoint,
  thresholdKm: number
): boolean {
  for (let t = 0; t <= 1; t += 0.1) {
    const p = interpolatePoint(start, end, t);
    if (haversineKm(p.lat, p.lng, point.lat, point.lng) <= thresholdKm) return true;
  }
  return false;
}

export interface PlanRouteInput {
  userId: string;
  name: string;
  start: RoutePoint;
  destination: RoutePoint;
  communities: ScoutCommunity[];
}

export function planRoute(input: PlanRouteInput): Route {
  const { userId, name, start, destination, communities } = input;
  const nearbyCommunities = communities.filter(c =>
    isNearPath(start, destination, c.location, 20)
  );

  const sorted = nearbyCommunities.slice().sort((a, b) => {
    const da = haversineKm(start.lat, start.lng, a.location.lat, a.location.lng);
    const db = haversineKm(start.lat, start.lng, b.location.lat, b.location.lng);
    return da - db;
  });

  const waypoints: (RoutePoint & { communityId?: string })[] = [
    { ...start },
    ...sorted.map(c => ({
      lat: c.location.lat,
      lng: c.location.lng,
      name: c.name,
      communityId: c.id,
    })),
    { ...destination },
  ];

  const segments: RouteSegment[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const s = waypoints[i];
    const e = waypoints[i + 1];
    segments.push({
      id: uuidv4(),
      startPoint: s,
      endPoint: e,
      distanceKm: haversineKm(s.lat, s.lng, e.lat, e.lng),
      communityId: e.communityId,
    });
  }

  const totalDistanceKm = segments.reduce((sum, seg) => sum + seg.distanceKm, 0);
  const now = new Date();

  return {
    id: uuidv4(),
    userId,
    name,
    start,
    destination,
    segments,
    communities: sorted.map(c => c.id),
    poiIds: [],
    milestoneIds: [],
    totalDistanceKm,
    completedDistanceKm: 0,
    progressPercent: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
}

export function recalcProgress(route: Route, totalSteps: number): Route {
  const KM_PER_STEP = 0.0008;
  const completedDistanceKm = Math.min(totalSteps * KM_PER_STEP, route.totalDistanceKm);
  const progressPercent = route.totalDistanceKm > 0
    ? Math.min((completedDistanceKm / route.totalDistanceKm) * 100, 100)
    : 0;
  const status = progressPercent >= 100 ? 'completed' : route.status === 'planning' ? 'active' : route.status;
  return {
    ...route,
    completedDistanceKm,
    progressPercent,
    status,
    updatedAt: new Date(),
  };
}

export function snapToCommunities(route: Route, communities: ScoutCommunity[]): Route {
  const visitedIds = communities
    .filter(c => isNearPath(route.start, route.destination, c.location, 20))
    .map(c => c.id);
  return { ...route, communities: visitedIds, updatedAt: new Date() };
}
