import { Link } from 'react-router-dom';
import type { MilestoneDTO } from '../apiClient/routeApi';

interface Props {
  milestones: MilestoneDTO[];
}

export default function MilestoneTimeline({ milestones }: Props) {
  if (milestones.length === 0) {
    return (
      <div className="milestone-card">
        <h3>🏆 Milestones</h3>
        <p className="empty-msg">No milestones on this route.</p>
      </div>
    );
  }

  return (
    <div className="milestone-card">
      <h3>🏆 Milestones</h3>
      <ul className="milestone-timeline">
        {milestones.map((m, i) => (
          <li key={m.id} className={`milestone-item ${m.isUnlocked ? 'unlocked' : 'locked'}`}>
            <div className="milestone-dot">{m.isUnlocked ? '✅' : '🔒'}</div>
            {i < milestones.length - 1 && <div className="milestone-line" />}
            <div className="milestone-content">
              <strong>{m.name}</strong>
              <p>{m.description}</p>
              <small>📏 {m.distanceKm.toFixed(1)} km</small>
              {m.isUnlocked && (
                <Link
                  to={`/community?channel=${m.channelId}`}
                  className="milestone-chat-link"
                >
                  💬 Open Chat
                </Link>
              )}
              {!m.isUnlocked && (
                <span className="milestone-locked-hint">
                  Keep walking to unlock!
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
