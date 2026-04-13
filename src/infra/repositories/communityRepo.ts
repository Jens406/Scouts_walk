import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { ScoutCommunity } from '../../domain/community/types';

const seedCommunities: ScoutCommunity[] = [
  { id: uuidv4(), name: 'London Scout Group', location: { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' }, type: 'group', memberCount: 45 },
  { id: uuidv4(), name: 'Paris Scouts de France', location: { lat: 48.8566, lng: 2.3522, city: 'Paris', country: 'France' }, type: 'group', memberCount: 60 },
  { id: uuidv4(), name: 'Berlin Pfadfinder', location: { lat: 52.5200, lng: 13.4050, city: 'Berlin', country: 'Germany' }, type: 'troop', memberCount: 38 },
  { id: uuidv4(), name: 'Amsterdam Scouts', location: { lat: 52.3676, lng: 4.9041, city: 'Amsterdam', country: 'Netherlands' }, type: 'group', memberCount: 30 },
  { id: uuidv4(), name: 'Brussels Scout Council', location: { lat: 50.8503, lng: 4.3517, city: 'Brussels', country: 'Belgium' }, type: 'council', memberCount: 120 },
  { id: uuidv4(), name: 'New York Scouts', location: { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' }, type: 'troop', memberCount: 80 },
  { id: uuidv4(), name: 'Toronto Scout Troop', location: { lat: 43.6532, lng: -79.3832, city: 'Toronto', country: 'Canada' }, type: 'troop', memberCount: 55 },
  { id: uuidv4(), name: 'Chicago Scout Council', location: { lat: 41.8781, lng: -87.6298, city: 'Chicago', country: 'USA' }, type: 'council', memberCount: 200 },
  { id: uuidv4(), name: 'Los Angeles Scouts', location: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' }, type: 'group', memberCount: 70 },
  { id: uuidv4(), name: 'Madrid Scouts', location: { lat: 40.4168, lng: -3.7038, city: 'Madrid', country: 'Spain' }, type: 'group', memberCount: 42 },
  { id: uuidv4(), name: 'Rome Scout Group', location: { lat: 41.9028, lng: 12.4964, city: 'Rome', country: 'Italy' }, type: 'group', memberCount: 36 },
  { id: uuidv4(), name: 'Vienna Pfadfinder', location: { lat: 48.2082, lng: 16.3738, city: 'Vienna', country: 'Austria' }, type: 'troop', memberCount: 48 },
  { id: uuidv4(), name: 'Zurich Scouts', location: { lat: 47.3769, lng: 8.5417, city: 'Zurich', country: 'Switzerland' }, type: 'group', memberCount: 29 },
  { id: uuidv4(), name: 'Stockholm Scout District', location: { lat: 59.3293, lng: 18.0686, city: 'Stockholm', country: 'Sweden' }, type: 'council', memberCount: 90 },
  { id: uuidv4(), name: 'Oslo Scout Troop', location: { lat: 59.9139, lng: 10.7522, city: 'Oslo', country: 'Norway' }, type: 'troop', memberCount: 33 },
  { id: uuidv4(), name: 'Copenhagen Scouts', location: { lat: 55.6761, lng: 12.5683, city: 'Copenhagen', country: 'Denmark' }, type: 'group', memberCount: 44 },
  { id: uuidv4(), name: 'Dublin Scout Council', location: { lat: 53.3498, lng: -6.2603, city: 'Dublin', country: 'Ireland' }, type: 'council', memberCount: 110 },
  { id: uuidv4(), name: 'Lisbon Scouts', location: { lat: 38.7223, lng: -9.1393, city: 'Lisbon', country: 'Portugal' }, type: 'group', memberCount: 52 },
  { id: uuidv4(), name: 'Warsaw Scout Group', location: { lat: 52.2297, lng: 21.0122, city: 'Warsaw', country: 'Poland' }, type: 'group', memberCount: 40 },
  { id: uuidv4(), name: 'Prague Scout Troop', location: { lat: 50.0755, lng: 14.4378, city: 'Prague', country: 'Czech Republic' }, type: 'troop', memberCount: 35 },
];

seedCommunities.forEach(c => db.communities.set(c.id, c));

export const communityRepo = {
  save(community: ScoutCommunity): void {
    db.communities.set(community.id, community);
  },
  findById(id: string): ScoutCommunity | undefined {
    return db.communities.get(id);
  },
  findAll(): ScoutCommunity[] {
    return Array.from(db.communities.values());
  },
  delete(id: string): void {
    db.communities.delete(id);
  },
};
