import { http } from './httpClient';

export interface LatLng {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteDTO {
  id: string;
  userId: string;
  name: string;
  start: LatLng;
  destination: LatLng;
  waypoints: LatLng[];
  communities: CommunityRef[];
  totalDistanceKm: number;
  completedDistanceKm: number;
  progressPercent: number;
  totalSteps: number;
  status: 'planned' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CommunityRef {
  id: string;
  name: string;
  lat: number;
  lng: number;
  memberCount?: number;
}

export interface MilestoneDTO {
  id: string;
  routeId: string;
  name: string;
  description: string;
  distanceKm: number;
  lat: number;
  lng: number;
  channelId: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface PoiDTO {
  id: string;
  routeId: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface ProgressDTO {
  routeId: string;
  totalDistanceKm: number;
  completedDistanceKm: number;
  progressPercent: number;
  status: string;
}

export interface PlanRouteData {
  name: string;
  start: LatLng;
  destination: LatLng;
}

export interface AddPoiData {
  name: string;
  description?: string;
  category: string;
  lat: number;
  lng: number;
}

export const routeApi = {
  planRoute: (data: PlanRouteData) => http.post<RouteDTO>('/api/routes', data),
  getRoutes: () => http.get<RouteDTO[]>('/api/routes'),
  getRoute: (id: string) => http.get<RouteDTO>(`/api/routes/${id}`),
  getProgress: (id: string) => http.get<ProgressDTO>(`/api/routes/${id}/progress`),
  getMilestones: (id: string) => http.get<MilestoneDTO[]>(`/api/routes/${id}/milestones`),
  addPoi: (routeId: string, data: AddPoiData) =>
    http.post<PoiDTO>(`/api/routes/${routeId}/pois`, data),
  getPois: (routeId: string) => http.get<PoiDTO[]>(`/api/routes/${routeId}/pois`),
};
