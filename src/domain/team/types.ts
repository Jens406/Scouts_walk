export type TeamType = 'patrol' | 'troop' | 'group' | 'district';

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  description?: string;
  leaderId: string;
  memberIds: string[];
  scoutOrg: 'boy_scouts' | 'girl_scouts' | 'mixed';
  region: string;
  createdAt: Date;
}
