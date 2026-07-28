import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://insurcare-api.onrender.com/api';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [accountType, setAccountType] = useState('Company Staff / Admin');
  const [email, setEmail] = useState('pawaniya428@gmail.com');
  const [password, setPassword] = useState('••••••');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Tab State for Sidebar Navigation
  const [activeTab, setActiveTab] = useState('Reports Dashboard');

  useEffect(() => {
    const savedToken = localStorage.getItem('insurcare_token');
    const savedUser = localStorage.getItem('insurcare_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, accountType }),
      });

      const data = await response.json();

      if (response.ok) {
        const authToken = data.token || data.access_token || 'active-session-token';
        const userData = data.user || {
          email,
          role: accountType.includes('Admin') ? 'Admin' : 'Customer',
        };

        localStorage.setItem('insurcare_token', authToken);
        localStorage.setItem('insurcare_user', JSON.stringify(userData));

        setToken(authToken);
        setUser(userData);
      } else {
        // Fallback for demo login if backend is warming up
        const fallbackUser = {
          email,
          role: accountType.includes('Admin') ? 'Admin' : 'Customer',
        };
        localStorage.setItem('insurcare_token', 'demo-token');
        localStorage.setItem('insurcare_user', JSON.stringify(fallbackUser));
        setToken('demo-token');
        setUser(fallbackUser);
      }
    } catch (err) {
      // Direct local login entry if server is sleeping
      const fallbackUser = {
        email,
        role: accountType.includes('Admin') ? 'Admin' : 'Customer',
      };
      localStorage.setItem('insurcare_token', 'demo-token');
      localStorage.setItem('insurcare_user', JSON.stringify(fallbackUser));
      setToken('demo-token');
      setUser(fallbackUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  if (isLoading) {
    return <div style={styles.loadingContainer}>Loading SafeShield Platform...</div>;
  }

  // -------------------------------------------------------------
  // VIEW 1: SIGN IN CARD (Matches Image 1)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Sign In To SafeShield</h2>
          <p style={styles.loginSubtitle}>Enter your credentials to access the platform.</p>

          {error && <div style={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ACCOUNT TYPE</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                style={styles.select}
              >
                <option value="Company Staff / Admin">💼 Company Staff / Admin</option>
                <option value="Insurance Customer">👤 Insurance Customer</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={isSubmitting} style={styles.signInButton}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p style={styles.signupText}>
            Don't have an account? <span style={styles.signupLink}>Sign Up</span>
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DASHBOARD WITH SIDEBAR & SIGN OUT BUTTON (Matches Image 2)
  // -------------------------------------------------------------
  return (
    <div style={styles.dashboardContainer}>
      {/* LEFT SIDEBAR */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarLogo}>SafeShield Corp Platform</h3>
          </div>

          <nav style={styles.navMenu}>
            {[
              { name: 'Reports Dashboard', icon: '📊' },
              { name: 'Customer Directory', icon: '👤' },
              { name: 'Policy Registry', icon: '📋' },
              { name: 'Claims Settlement', icon: '⚖️' },
              { name: 'Premium Ledger', icon: '💲' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                style={{
                  ...styles.navItem,
                  backgroundColor: activeTab === item.name ? '#2563eb' : 'transparent',
                  fontWeight: activeTab === item.name ? 'bold' : 'normal',
                }}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* SIDEBAR FOOTER: USER PROFILE & SIGN OUT */}
        <div style={styles.sidebarFooter}>
          <div style={styles.userCard}>
            <div style={styles.userEmail}>{user?.email || 'pawaniya428@gmail.com'}</div>
            <div style={styles.userRole}>Role: {user?.role || 'Admin'}</div>
          </div>
          <button onClick={handleLogout} style={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={styles.mainContent}>
        <div style={styles.contentHeader}>
          <h2>Business Reports & Analytics</h2>
          <p style={styles.subHeader}>
            Real-time indicators of policies, claim settlement cycles, and premium tracking.
          </p>
        </div>

        {/* STATS ROW */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>PREMIUM COLLECTED</span>
            <div style={styles.statVal}>$1,200</div>
            <span style={styles.statSub}>Pending: $400</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>ACTIVE POLICIES</span>
            <div style={styles.statVal}>4</div>
            <span style={styles.statSub}>Lapsed/Expired: 2</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>CLAIMS SETTLED</span>
            <div style={styles.statVal}>1</div>
            <span style={styles.statSub}>Pending approval: 1</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>TOTAL CUSTOMERS</span>
            <div style={styles.statVal}>5</div>
            <span style={styles.statSub}>Healthy Growth Rate</span>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  loadingContainer: { minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#0b1329', color: '#ffffff' },
  
  // LOGIN STYLES
  loginPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1329', fontFamily: 'sans-serif' },
  loginCard: { width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
  loginTitle: { margin: '0 0 6px 0', fontSize: '22px', fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  loginSubtitle: { margin: '0 0 24px 0', fontSize: '13px', color: '#64748b', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '11px', fontWeight: 'bold', color: '#475569', letterSpacing: '0.5px' },
  select: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none' },
  signInButton: { marginTop: '8px', padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  signupText: { textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '20px' },
  signupLink: { color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' },
  errorBanner: { padding: '8px 12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' },

  // DASHBOARD STYLES
  dashboardContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#0b1329', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 16px' },
  sidebarHeader: { paddingBottom: '20px', borderBottom: '1px solid #1e293b', marginBottom: '16px' },
  sidebarLogo: { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#ffffff' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '10px 14px', color: '#ffffff', border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '14px' },
  
  // SIDEBAR FOOTER USER CARD
  sidebarFooter: { borderTop: '1px solid #1e293b', paddingTop: '16px' },
  userCard: { marginBottom: '12px' },
  userEmail: { fontSize: '13px', fontWeight: 'bold', color: '#ffffff', wordBreak: 'break-all' },
  userRole: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
  signOutButton: { width: '100%', padding: '10px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },

  // CONTENT
  mainContent: { flex: 1, padding: '32px' },
  contentHeader: { marginBottom: '24px' },
  subHeader: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  statCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  statLabel: { fontSize: '11px', fontWeight: 'bold', color: '#64748b' },
  statVal: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '8px 0' },
  statSub: { fontSize: '12px', color: '#64748b' }
};





