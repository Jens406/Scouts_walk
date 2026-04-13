import { RoutePoint } from '../../domain/route/types';
import { ScoutCommunity } from '../../domain/community/types';
import { communityRepo } from '../repositories/communityRepo';
import { haversineKm } from '../../utils/geo';

export { haversineKm } from '../../utils/geo';

function distanceToSegment(
  startPoint: RoutePoint,
  endPoint: RoutePoint,
  point: RoutePoint
): number {
  let minDist = Infinity;
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = startPoint.lat + (endPoint.lat - startPoint.lat) * t;
    const lng = startPoint.lng + (endPoint.lng - startPoint.lng) * t;
    const d = haversineKm(lat, lng, point.lat, point.lng);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

export interface RoutingResult {
  waypoints: RoutePoint[];
  nearbyCommunitiesAlongPath: ScoutCommunity[];
  totalDistanceKm: number;
}

export function getRoute(start: RoutePoint, end: RoutePoint): RoutingResult {
  const allCommunities = communityRepo.findAll();
  const nearbyCommunitiesAlongPath = allCommunities.filter(c => {
    const dist = distanceToSegment(start, end, c.location);
    return dist <= 20;
  });

  nearbyCommunitiesAlongPath.sort((a, b) => {
    const da = haversineKm(start.lat, start.lng, a.location.lat, a.location.lng);
    const db = haversineKm(start.lat, start.lng, b.location.lat, b.location.lng);
    return da - db;
  });

  const waypoints: RoutePoint[] = [
    start,
    ...nearbyCommunitiesAlongPath.map(c => ({
      lat: c.location.lat,
      lng: c.location.lng,
      name: c.name,
    })),
    end,
  ];

  let totalDistanceKm = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistanceKm += haversineKm(
      waypoints[i].lat, waypoints[i].lng,
      waypoints[i+1].lat, waypoints[i+1].lng
    );
  }

  return { waypoints, nearbyCommunitiesAlongPath, totalDistanceKm };
}
