import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// 1. RENDER BACKEND API CONFIGURATION
// ---------------------------------------------------------------------------
const API_BASE_URL = 'https://insurcare-api.onrender.com/api';

// ---------------------------------------------------------------------------
// 2. LOGIN / AUTHENTICATION COMPONENT
// ---------------------------------------------------------------------------
function Login({ setToken, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const authToken = data.token || data.access_token || 'authenticated-token';
        const userData = data.user || { email };

        localStorage.setItem('insurcare_token', authToken);
        localStorage.setItem('insurcare_user', JSON.stringify(userData));

        setToken(authToken);
        setUser(userData);
        
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to reach Render backend server. Please wait ~30s for the instance to wake up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <h2 style={styles.title}>Insur-Care Portal</h2>
        <p style={styles.subtitle}>Sign in to access your dashboard</p>
        
        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@insurcare.com"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
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

          <button type="submit" disabled={loading} style={styles.primaryButton}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. PROTECTED DASHBOARD COMPONENT
// ---------------------------------------------------------------------------
function Dashboard({ user, handleLogout }) {
  return (
    <div style={styles.dashboardLayout}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Insur-Care Portal</h1>
        <div style={styles.userInfo}>
          <span>Logged in as: {user?.email || 'Admin User'}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
        </div>
      </header>
      <main style={styles.mainContent}>
        <h2>Executive Dashboard</h2>
        <p>Welcome back! Authentication successfully verified via Render API.</p>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. MAIN APP ROUTER WITH EXPORT DEFAULT
// ---------------------------------------------------------------------------
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('insurcare_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('insurcare_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('insurcare_token');
    localStorage.removeItem('insurcare_user');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login setToken={setToken} setUser={setUser} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

// ---------------------------------------------------------------------------
// 5. STYLES
// ---------------------------------------------------------------------------
const styles = {
  authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f6f8' },
  authCard: { width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '10px', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 8px 0', color: '#1a202c', textAlign: 'center' },
  subtitle: { margin: '0 0 24px 0', color: '#718096', textAlign: 'center', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#4a5568' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px' },
  primaryButton: { padding: '12px', backgroundColor: '#3182ce', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  errorAlert: { padding: '10px', backgroundColor: '#fed7d7', color: '#c53030', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' },
  dashboardLayout: { minHeight: '100vh', backgroundColor: '#f8fafc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#1e293b', color: '#ffffff' },
  logo: { fontSize: '20px', margin: 0 },
  userInfo: { display: 'flex', alignItems: 'center', gap: '16px' },
  logoutButton: { padding: '6px 12px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  mainContent: { padding: '32px' }
};




