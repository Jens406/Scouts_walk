import { v4 as uuidv4 } from 'uuid';
import { PointOfInterest, PoiCategory } from './types';

export interface AddPoiInput {
  routeId: string;
  name: string;
  description?: string;
  category: PoiCategory;
  location: { lat: number; lng: number };
  addedByUserId: string;
}

export function addPoiToRoute(input: AddPoiInput): PointOfInterest {
  return {
    id: uuidv4(),
    routeId: input.routeId,
    name: input.name,
    description: input.description,
    category: input.category,
    location: input.location,
    addedByUserId: input.addedByUserId,
    createdAt: new Date(),
  };
}

export function listPoisOnRoute(pois: PointOfInterest[], routeId: string): PointOfInterest[] {
  return pois.filter(p => p.routeId === routeId);
}
