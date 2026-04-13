import { findFriendsOnSameSegment, presenceAlongRoute } from '../../domain/friends/services';
import { FriendPresence } from '../../domain/friends/types';

const makePresence = (userId: string, routeId: string, progressPercent: number): FriendPresence => ({
  userId,
  username: `user-${userId}`,
  displayName: `User ${userId}`,
  routeId,
  progressPercent,
  currentSegmentIndex: Math.floor(progressPercent / 10),
  lastSeen: new Date(),
});

describe('findFriendsOnSameSegment', () => {
  const presences: FriendPresence[] = [
    makePresence('user-1', 'route-1', 50),
    makePresence('user-2', 'route-1', 55),
    makePresence('user-3', 'route-1', 70),
    makePresence('user-4', 'route-1', 45),
    makePresence('user-5', 'route-2', 50),
  ];

  it('finds friends within 10% progress on same route', () => {
    const friends = findFriendsOnSameSegment(presences, 'user-1', 'route-1', 50);
    const ids = friends.map(f => f.userId);
    expect(ids).toContain('user-2');
    expect(ids).toContain('user-4');
  });

  it('excludes friends more than 10% away', () => {
    const friends = findFriendsOnSameSegment(presences, 'user-1', 'route-1', 50);
    const ids = friends.map(f => f.userId);
    expect(ids).not.toContain('user-3');
  });

  it('excludes friends on different routes', () => {
    const friends = findFriendsOnSameSegment(presences, 'user-1', 'route-1', 50);
    const ids = friends.map(f => f.userId);
    expect(ids).not.toContain('user-5');
  });

  it('excludes the current user', () => {
    const friends = findFriendsOnSameSegment(presences, 'user-1', 'route-1', 50);
    const ids = friends.map(f => f.userId);
    expect(ids).not.toContain('user-1');
  });
});

describe('presenceAlongRoute', () => {
  const presences: FriendPresence[] = [
    makePresence('user-1', 'route-1', 30),
    makePresence('user-2', 'route-1', 60),
    makePresence('user-3', 'route-2', 50),
  ];

  it('returns all users on the given route except current user', () => {
    const result = presenceAlongRoute(presences, 'route-1', 'user-1');
    expect(result.length).toBe(1);
    expect(result[0].userId).toBe('user-2');
  });
});
