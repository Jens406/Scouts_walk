import { addPoiToRoute as domainAddPoi, AddPoiInput } from '../domain/poi/services';
import { poiRepo } from '../infra/repositories/poiRepo';
import { routeRepo } from '../infra/repositories/routeRepo';
import { PointOfInterest } from '../domain/poi/types';

export function addPoiToRoute(input: AddPoiInput): PointOfInterest {
  const route = routeRepo.findById(input.routeId);
  if (!route) throw new Error('Route not found');

  const poi = domainAddPoi(input);
  poiRepo.save(poi);

  routeRepo.save({ ...route, poiIds: [...route.poiIds, poi.id], updatedAt: new Date() });
  return poi;
}
