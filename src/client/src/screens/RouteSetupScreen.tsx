import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapPicker from '../components/MapPicker';
import { useRouteStore } from '../state/routeStore';
import { useUserStore } from '../state/userStore';

export default function RouteSetupScreen() {
  const { routes, planRoute, loadRoutes, selectRoute, activeRoute, isLoading, error } = useRouteStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadRoutes();
  }, []);

  const handlePlan = async (
    start: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    name: string
  ) => {
    await planRoute({ name, start, destination });
    navigate('/dashboard');
  };

  return (
    <div className="route-setup-screen">
      <header className="screen-header">
        <h2>🗺️ Plan Your Route</h2>
        {user && <span className="header-user">👤 {user.displayName}</span>}
      </header>

      <MapPicker onPlanRoute={handlePlan} isLoading={isLoading} />

      {error && <div className="error-msg">⚠️ {error}</div>}

      {routes.length > 0 && (
        <section className="existing-routes">
          <h3>Your Routes</h3>
          <ul className="route-list">
            {routes.map((r) => (
              <li
                key={r.id}
                className={`route-item ${activeRoute?.id === r.id ? 'active' : ''}`}
                onClick={() => { selectRoute(r.id); navigate('/dashboard'); }}
              >
                <span className="route-name">{r.name}</span>
                <span className="route-meta">
                  {r.totalDistanceKm.toFixed(1)} km · {Math.round(r.progressPercent)}%
                </span>
                <span className={`route-status ${r.status}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
