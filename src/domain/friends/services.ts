import { FriendPresence, VirtualNeighbor } from './types';
import { Route } from '../route/types';

export function findFriendsOnSameSegment(
  presences: FriendPresence[],
  currentUserId: string,
  routeId: string,
  myProgressPercent: number
): FriendPresence[] {
  return presences.filter(p =>
    p.userId !== currentUserId &&
    p.routeId === routeId &&
    Math.abs(p.progressPercent - myProgressPercent) <= 10
  );
}

export function presenceAlongRoute(
  presences: FriendPresence[],
  routeId: string,
  currentUserId: string
): FriendPresence[] {
  return presences.filter(p => p.routeId === routeId && p.userId !== currentUserId);
}

export function computeVirtualNeighbors(
  presences: FriendPresence[],
  currentUserId: string,
  myProgress: FriendPresence,
  route: Route
): VirtualNeighbor[] {
  return presences
    .filter(p => p.userId !== currentUserId && p.routeId === route.id)
    .map(p => {
      const segmentOverlap = p.currentSegmentIndex === myProgress.currentSegmentIndex ? 1 : 0;
      const distanceAheadKm =
        ((p.progressPercent - myProgress.progressPercent) / 100) * route.totalDistanceKm;
      return { user: p, segmentOverlap, distanceAheadKm };
    });
}
