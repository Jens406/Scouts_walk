import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MilestoneChat from '../components/MilestoneChat';
import { useRouteStore } from '../state/routeStore';

export default function CommunityFeedScreen() {
  const { activeRoute, milestones, loadMilestones } = useRouteStore();
  const [searchParams] = useSearchParams();
  const focusChannel = searchParams.get('channel');

  useEffect(() => {
    if (activeRoute) {
      loadMilestones(activeRoute.id);
    }
  }, [activeRoute?.id]);

  if (!activeRoute) {
    return (
      <div className="community-screen empty">
        <h2>🏕️ Community Feed</h2>
        <p>Set an active route to see your community channels.</p>
      </div>
    );
  }

  const unlockedMilestones = milestones.filter((m) => m.isUnlocked);
  const routeChannel = `route:${activeRoute.id}`;

  return (
    <div className="community-screen">
      <header className="screen-header">
        <h2>🏕️ Community Feed</h2>
        <span className="header-sub">{activeRoute.name}</span>
      </header>

      <div className="community-grid">
        {/* Route-wide channel */}
        <div className={`community-section ${focusChannel === routeChannel ? 'focused' : ''}`}>
          <MilestoneChat
            channelId={routeChannel}
            channelType="route"
            title={`Route Chat: ${activeRoute.name}`}
          />
        </div>

        {/* Unlocked milestone channels */}
        {unlockedMilestones.length === 0 && (
          <p className="empty-msg">
            🔒 Unlock milestones by walking to open community channels!
          </p>
        )}
        {unlockedMilestones.map((m) => (
          <div
            key={m.id}
            className={`community-section ${focusChannel === m.channelId ? 'focused' : ''}`}
          >
            <MilestoneChat
              channelId={m.channelId}
              channelType="milestone"
              title={`🏆 ${m.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
