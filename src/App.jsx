import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://insurcare-api.onrender.com/api';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check storage on page load
  useEffect(() => {
    const savedToken = localStorage.getItem('insurcare_token');
    const savedUser = localStorage.getItem('insurcare_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // SIGN IN ACTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const authToken = data.token || data.access_token || 'active-user-session';
        const userData = data.user || { email };

        localStorage.setItem('insurcare_token', authToken);
        localStorage.setItem('insurcare_user', JSON.stringify(userData));

        setToken(authToken);
        setUser(userData);
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Unable to reach Render backend API. Please wait ~30s for spin-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SIGN OUT ACTION
  const handleLogout = () => {
    localStorage.removeItem('insurcare_token');
    localStorage.removeItem('insurcare_user');
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading Insur-Care Portal...</div>;
  }

  // -------------------------------------------------------------
  // VIEW 1: SIGN IN SCREEN (Shown when logged out)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div style={styles.authWrapper}>
        <div style={styles.authCard}>
          <h1 style={styles.authTitle}>Insur-Care Portal</h1>
          <p style={styles.authSub}>Sign in to access your dashboard</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@insurcare.com"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={isSubmitting} style={styles.btnPrimary}>
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DASHBOARD SCREEN (Includes Header Sign Out Control)
  // -------------------------------------------------------------
  return (
    <div style={styles.dashboardWrapper}>
      <header style={styles.header}>
        <h2 style={styles.logo}>Insur-Care Dashboard</h2>
        <div style={styles.headerRight}>
          <span style={styles.userLabel}>{user?.email || 'Authenticated User'}</span>
          <button onClick={handleLogout} style={styles.btnLogout}>
            🔒 Sign Out
          </button>
        </div>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.contentCard}>
          <h2 style={{ marginTop: 0 }}>Executive Analytics</h2>
          <p>Welcome! Your auth session is active.</p>
          <p>To switch users or return to the sign-in form, click the red <strong>🔒 Sign Out</strong> button in the top right header.</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  loading: { minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#ffffff', backgroundColor: '#0f172a' },
  authWrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', padding: '20px' },
  authCard: { width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', padding: '32px', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' },
  authTitle: { color: '#f8fafc', margin: '0 0 6px 0', fontSize: '24px', textAlign: 'center' },
  authSub: { color: '#94a3b8', margin: '0 0 24px 0', fontSize: '14px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#cbd5e1', fontSize: '13px', fontWeight: '600' },
  input: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px', outline: 'none' },
  btnPrimary: { padding: '12px', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '8px' },
  errorBox: { padding: '10px 12px', backgroundColor: '#451a1a', border: '1px solid #7f1d1d', color: '#fca5a5', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' },
  dashboardWrapper: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' },
  logo: { margin: 0, fontSize: '20px', color: '#f8fafc' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  userLabel: { fontSize: '14px', color: '#94a3b8' },
  btnLogout: { padding: '8px 16px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },
  mainContent: { padding: '32px' },
  contentCard: { padding: '24px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }
};




