import { db } from '../db';
import { PointOfInterest } from '../../domain/poi/types';

export const poiRepo = {
  save(poi: PointOfInterest): void {
    db.pois.set(poi.id, poi);
  },
  findById(id: string): PointOfInterest | undefined {
    return db.pois.get(id);
  },
  findByRouteId(routeId: string): PointOfInterest[] {
    return Array.from(db.pois.values()).filter(p => p.routeId === routeId);
  },
  findAll(): PointOfInterest[] {
    return Array.from(db.pois.values());
  },
  delete(id: string): void {
    db.pois.delete(id);
  },
};
