import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserStore } from '../state/userStore';

interface FriendProgress {
  userId: string;
  username: string;
  displayName: string;
  progressPercent: number;
}

let socket: Socket | null = null;

export default function FriendsAlongRoute({ routeId }: { routeId: string }) {
  const { user } = useUserStore();
  const [friends, setFriends] = useState<FriendProgress[]>([]);

  useEffect(() => {
    if (!routeId) return;

    if (!socket) {
      socket = io('http://localhost:3000', {
        auth: { token: localStorage.getItem('scout_token') },
      });
    }

    socket.emit('subscribe:route', routeId);

    socket.on('progress:update', (data: { routeId: string; userId: string; progress: number; username?: string }) => {
      if (data.routeId !== routeId || data.userId === user?.id) return;
      setFriends((prev) => {
        const existing = prev.find((f) => f.userId === data.userId);
        if (existing) {
          return prev.map((f) =>
            f.userId === data.userId ? { ...f, progressPercent: data.progress } : f
          );
        }
        return [...prev, {
          userId: data.userId,
          username: data.username ?? data.userId,
          displayName: data.username ?? data.userId,
          progressPercent: data.progress,
        }];
      });
    });

    return () => {
      socket?.off('progress:update');
    };
  }, [routeId, user?.id]);

  if (friends.length === 0) {
    return (
      <div className="friends-card">
        <h3>👥 Friends Along Route</h3>
        <p className="empty-msg">No friends on this route yet — share the route to get started!</p>
      </div>
    );
  }

  return (
    <div className="friends-card">
      <h3>👥 Friends Along Route</h3>
      <div className="friends-list">
        {friends.map((f) => (
          <div key={f.userId} className="friend-avatar-block">
            <div className="friend-avatar">{f.displayName.charAt(0).toUpperCase()}</div>
            <div className="friend-info">
              <span className="friend-name">{f.displayName}</span>
              <div className="mini-bar">
                <div className="mini-bar-fill" style={{ width: `${Math.min(100, f.progressPercent)}%` }} />
              </div>
              <small>{Math.round(f.progressPercent)}%</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
