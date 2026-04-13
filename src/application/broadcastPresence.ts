import { db } from '../infra/db';
import { FriendPresence } from '../domain/friends/types';
import { emitProgressUpdate } from '../infra/messaging/websocketServer';

export interface UpdatePresenceInput {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  routeId: string;
  progressPercent: number;
  currentSegmentIndex: number;
}

export function broadcastPresence(input: UpdatePresenceInput): FriendPresence {
  const presence: FriendPresence = {
    ...input,
    lastSeen: new Date(),
  };
  db.presences.set(input.userId, presence);
  emitProgressUpdate(input.routeId, input.userId, input.progressPercent);
  return presence;
}
