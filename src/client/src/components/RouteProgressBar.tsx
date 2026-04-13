import { useState } from 'react';
import { useRouteStore } from '../state/routeStore';

export default function RouteProgressBar() {
  const { activeRoute, logSteps } = useRouteStore();
  const [steps, setSteps] = useState('');
  const [logging, setLogging] = useState(false);
  const [msg, setMsg] = useState('');

  if (!activeRoute) return null;

  const pct = Math.min(100, Math.round(activeRoute.progressPercent));

  const handleLog = async () => {
    const n = parseInt(steps, 10);
    if (!n || n <= 0) return;
    setLogging(true);
    try {
      await logSteps(n);
      setMsg(`✅ Logged ${n} steps!`);
      setSteps('');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('❌ Failed to log steps');
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="progress-card">
      <h3>🥾 Route Progress</h3>
      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${pct}%` }} />
        <span className="progress-label">{pct}%</span>
      </div>
      <div className="progress-stats">
        <span>📏 {activeRoute.completedDistanceKm.toFixed(2)} / {activeRoute.totalDistanceKm.toFixed(2)} km</span>
      </div>
      <div className="log-steps-row">
        <input
          type="number"
          min="1"
          placeholder="Steps to log"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          className="steps-input"
        />
        <button className="scout-btn" onClick={handleLog} disabled={logging || !steps}>
          {logging ? 'Logging…' : 'Log Steps'}
        </button>
      </div>
      {msg && <p className="step-msg">{msg}</p>}
    </div>
  );
}
