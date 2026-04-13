export type RouteStatus = 'planning' | 'active' | 'completed' | 'paused';

export interface RoutePoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteSegment {
  id: string;
  startPoint: RoutePoint;
  endPoint: RoutePoint;
  distanceKm: number;
  communityId?: string;
}

export interface Route {
  id: string;
  userId: string;
  name: string;
  start: RoutePoint;
  destination: RoutePoint;
  segments: RouteSegment[];
  communities: string[];
  poiIds: string[];
  milestoneIds: string[];
  totalDistanceKm: number;
  completedDistanceKm: number;
  progressPercent: number;
  status: RouteStatus;
  createdAt: Date;
  updatedAt: Date;
}
