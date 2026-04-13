export interface CommunityLocation {
  lat: number;
  lng: number;
  address?: string;
  city: string;
  country: string;
}

export interface ScoutCommunity {
  id: string;
  name: string;
  location: CommunityLocation;
  type: 'troop' | 'group' | 'council';
  description?: string;
  memberCount: number;
  contactEmail?: string;
}
