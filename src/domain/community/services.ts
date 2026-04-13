import { ScoutCommunity } from './types';
import { haversineKm } from '../../utils/geo';

export function listCommunitiesInArea(
  communities: ScoutCommunity[],
  lat: number,
  lng: number,
  radiusKm: number
): ScoutCommunity[] {
  return communities.filter(c =>
    haversineKm(lat, lng, c.location.lat, c.location.lng) <= radiusKm
  );
}

export function getCommunityById(
  communities: ScoutCommunity[],
  id: string
): ScoutCommunity | undefined {
  return communities.find(c => c.id === id);
}
