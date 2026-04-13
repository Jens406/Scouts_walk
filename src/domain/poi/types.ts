export type PoiCategory = 'historic_site' | 'nature' | 'viewpoint' | 'camp_site' | 'water_source' | 'emergency' | 'scout_hut';

export interface PointOfInterest {
  id: string;
  routeId: string;
  name: string;
  description?: string;
  category: PoiCategory;
  location: { lat: number; lng: number };
  addedByUserId: string;
  createdAt: Date;
}
