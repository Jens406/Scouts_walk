import { useUserStore } from '../state/userStore';

const BADGE_ICONS: Record<string, string> = {
  first_steps: '👣',
  halfway: '🏃',
  complete: '🏆',
  explorer: '🗺️',
  social: '👥',
};

export default function ProfileAndTeamCard() {
  const { user, team } = useUserStore();

  if (!user) return null;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">{user.displayName.charAt(0).toUpperCase()}</div>
        <div>
          <h2>{user.displayName}</h2>
          <span className="profile-role scout-badge">{user.role}</span>
        </div>
      </div>

      {team && (
        <div className="profile-team">
          <h4>🏕️ {team.name}</h4>
          <small>{team.type}</small>
        </div>
      )}

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{user.totalSteps.toLocaleString()}</span>
          <span className="stat-label">👣 Steps</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{user.totalXP}</span>
          <span className="stat-label">⭐ XP</span>
        </div>
      </div>

      {user.areasOfInterest.length > 0 && (
        <div className="profile-interests">
          <h4>Areas of Interest</h4>
          <div className="tags">
            {user.areasOfInterest.map((area) => (
              <span key={area} className="tag">{area}</span>
            ))}
          </div>
        </div>
      )}

      {user.badges.length > 0 && (
        <div className="profile-badges">
          <h4>🏅 Badges</h4>
          <div className="badges">
            {user.badges.map((b) => (
              <span key={b} className="badge-icon" title={b}>
                {BADGE_ICONS[b] ?? '🏅'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
