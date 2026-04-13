import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteProgressBar from '../components/RouteProgressBar';
import MilestoneTimeline from '../components/MilestoneTimeline';
import FriendsAlongRoute from '../components/FriendsAlongRoute';
import PoiList from '../components/PoiList';
import ProfileAndTeamCard from '../components/ProfileAndTeamCard';
import { useRouteStore } from '../state/routeStore';

export default function RouteDashboardScreen() {
  const { activeRoute, milestones, loadRoutes, refreshProgress } = useRouteStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeRoute) {
      loadRoutes();
    }
  }, []);

  useEffect(() => {
    if (!activeRoute) return;
    const interval = setInterval(refreshProgress, 30_000);
    return () => clearInterval(interval);
  }, [activeRoute?.id]);

  if (!activeRoute) {
    return (
      <div className="dashboard-screen empty">
        <h2>No Active Route</h2>
        <p>Plan a route to start your scout walk!</p>
        <button className="scout-btn primary" onClick={() => navigate('/routes')}>
          Plan a Route
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-screen">
      <header className="screen-header">
        <h2>📍 {activeRoute.name}</h2>
        <button className="scout-btn small" onClick={() => navigate('/routes')}>
          Change Route
        </button>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <RouteProgressBar />
          <MilestoneTimeline milestones={milestones} />
          <PoiList />
        </div>
        <div className="dashboard-side">
          <ProfileAndTeamCard />
          <FriendsAlongRoute routeId={activeRoute.id} />
          <div className="route-info-card">
            <h3>Route Info</h3>
            <p><strong>Start:</strong> {activeRoute.start.name ?? `${activeRoute.start.lat.toFixed(3)}, ${activeRoute.start.lng.toFixed(3)}`}</p>
            <p><strong>Destination:</strong> {activeRoute.destination.name ?? `${activeRoute.destination.lat.toFixed(3)}, ${activeRoute.destination.lng.toFixed(3)}`}</p>
            <p><strong>Status:</strong> <span className={`route-status ${activeRoute.status}`}>{activeRoute.status}</span></p>
            <button className="scout-btn small" onClick={() => navigate('/community')}>
              💬 Community Feed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
