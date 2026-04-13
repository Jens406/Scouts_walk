import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from './state/userStore';
import OnboardingScreen from './screens/OnboardingScreen';
import RouteSetupScreen from './screens/RouteSetupScreen';
import RouteDashboardScreen from './screens/RouteDashboardScreen';
import CommunityFeedScreen from './screens/CommunityFeedScreen';
import './globals.css';

function NavBar() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="nav-bar">
      <div className="nav-brand" onClick={() => navigate('/dashboard')}>🏕️ Scout Walk</div>
      <div className="nav-links">
        <button
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-link ${location.pathname === '/routes' ? 'active' : ''}`}
          onClick={() => navigate('/routes')}
        >
          Routes
        </button>
        <button
          className={`nav-link ${location.pathname === '/community' ? 'active' : ''}`}
          onClick={() => navigate('/community')}
        >
          Community
        </button>
        <button className="nav-link logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useUserStore();
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppContent() {
  const { token, loadProfile } = useUserStore();

  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  return (
    <>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <OnboardingScreen />} />
          <Route path="/routes" element={<RequireAuth><RouteSetupScreen /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><RouteDashboardScreen /></RequireAuth>} />
          <Route path="/community" element={<RequireAuth><CommunityFeedScreen /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
