import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../state/userStore';

const SCOUT_ROLES = ['scout', 'cub', 'venture', 'leader', 'helper'];
const INTEREST_OPTIONS = [
  'hiking', 'camping', 'navigation', 'first aid', 'nature', 'photography',
  'cooking', 'climbing', 'cycling', 'swimming',
];

export default function OnboardingScreen() {
  const { register, login, error, isLoading, clearError } = useUserStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('scout');
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (val: string) =>
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      if (mode === 'register') {
        await register({ username, email, password, displayName, role, areasOfInterest: interests });
      } else {
        await login(email, password);
      }
      navigate('/routes');
    } catch {
      // error shown via store
    }
  };

  return (
    <div className="onboarding-screen">
      <div className="onboarding-card">
        <div className="onboarding-logo">🏕️</div>
        <h1>Virtual Scout Walk</h1>
        <p className="onboarding-subtitle">Walk together. Discover communities.</p>

        <div className="mode-toggle">
          <button
            className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); clearError(); }}
          >
            Register
          </button>
          <button
            className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); clearError(); }}
          >
            Log In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                {SCOUT_ROLES.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
              <div className="interests-section">
                <label>Areas of Interest</label>
                <div className="interest-checkboxes">
                  {INTEREST_OPTIONS.map((opt) => (
                    <label key={opt} className="interest-label">
                      <input
                        type="checkbox"
                        checked={interests.includes(opt)}
                        onChange={() => toggleInterest(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && <div className="error-msg">⚠️ {error}</div>}

          <button type="submit" className="scout-btn primary" disabled={isLoading}>
            {isLoading ? 'Please wait…' : mode === 'register' ? 'Create Account' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
