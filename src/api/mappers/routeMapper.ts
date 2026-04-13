import { Route } from '../../domain/route/types';

export interface RouteDTO {
  id: string;
  userId: string;
  name: string;
  start: { lat: number; lng: number; name?: string };
  destination: { lat: number; lng: number; name?: string };
  totalDistanceKm: number;
  completedDistanceKm: number;
  progressPercent: number;
  status: string;
  communities: string[];
  poiIds: string[];
  milestoneIds: string[];
  createdAt: string;
  updatedAt: string;
}

export function toRouteDTO(route: Route): RouteDTO {
  return {
    id: route.id,
    userId: route.userId,
    name: route.name,
    start: route.start,
    destination: route.destination,
    totalDistanceKm: route.totalDistanceKm,
    completedDistanceKm: route.completedDistanceKm,
    progressPercent: route.progressPercent,
    status: route.status,
    communities: route.communities,
    poiIds: route.poiIds,
    milestoneIds: route.milestoneIds,
    createdAt: route.createdAt.toISOString(),
    updatedAt: route.updatedAt.toISOString(),
  };
}
