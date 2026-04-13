export interface FriendPresence {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  routeId: string;
  progressPercent: number;
  currentSegmentIndex: number;
  lastSeen: Date;
}

export interface VirtualNeighbor {
  user: FriendPresence;
  segmentOverlap: number;
  distanceAheadKm: number;
}
