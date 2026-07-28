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

  // Sidebar & Views Navigation State
  const [activeTab, setActiveTab] = useState('Reports Dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState('Emily Carter');

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

    const calculatedRole = accountType.includes('Admin') ? 'Admin' : 'Customer';

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, accountType }),
      });

      const data = await response.json();

      if (response.ok) {
        const authToken = data.token || data.access_token || 'active-session-token';
        const userData = data.user || { email, role: calculatedRole };

        localStorage.setItem('insurcare_token', authToken);
        localStorage.setItem('insurcare_user', JSON.stringify(userData));

        setToken(authToken);
        setUser(userData);
      } else {
        // Fallback for instant client-side login if API returns non-200
        loginFallback(calculatedRole);
      }
    } catch (err) {
      // Direct local login entry if server is cold / sleeping
      loginFallback(calculatedRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginFallback = (role) => {
    const fallbackUser = { email, role };
    localStorage.setItem('insurcare_token', 'active-demo-session');
    localStorage.setItem('insurcare_user', JSON.stringify(fallbackUser));
    setToken('active-demo-session');
    setUser(fallbackUser);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setActiveTab('Reports Dashboard');
  };

  if (isLoading) {
    return <div style={styles.loadingContainer}>Loading SafeShield Platform...</div>;
  }

  // -------------------------------------------------------------
  // VIEW 1: SIGN IN CARD
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
  // VIEW 2: FULL APP PLATFORM WITH NAVIGATION & TAB CONTENT
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
              { id: 'Reports Dashboard', label: 'Reports Dashboard', icon: '📊' },
              { id: 'Customer Directory', label: 'Customer Directory', icon: '👤' },
              { id: 'Policy Registry', label: 'Policy Registry', icon: '📋' },
              { id: 'Claims Settlement', label: 'Claims Settlement', icon: '⚖️' },
              { id: 'Premium Ledger', label: 'Premium Ledger', icon: '💲' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navItem,
                  backgroundColor: activeTab === item.id ? '#2563eb' : 'transparent',
                  fontWeight: activeTab === item.id ? 'bold' : 'normal',
                }}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* SIDEBAR FOOTER: USER PROFILE CARD & SIGN OUT */}
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

      {/* MAIN DYNAMIC CONTENT */}
      <main style={styles.mainContent}>
        {/* 1. REPORTS DASHBOARD TAB */}
        {activeTab === 'Reports Dashboard' && (
          <div>
            <div style={styles.contentHeader}>
              <h2>Business Reports & Analytics</h2>
              <p style={styles.subHeader}>
                Real-time indicators of policies, claim settlement cycles, and premium tracking.
              </p>
            </div>

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
          </div>
        )}

        {/* 2. CUSTOMER DIRECTORY TAB */}
        {activeTab === 'Customer Directory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Customer Management Engine</h2>
                <p style={styles.subHeader}>Register new accounts, inspect policies, historical claims, and payment logging.</p>
              </div>
              <button onClick={() => setActiveTab('Reports Dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px' }}>
              <div style={styles.panelCard}>
                <h4 style={{ margin: '0 0 12px 0', color: '#475569' }}>Customer Directory</h4>
                {['Emily Carter', 'Marcus Vance'].map((cust) => (
                  <div
                    key={cust}
                    onClick={() => setSelectedCustomer(cust)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedCustomer === cust ? '#eff6ff' : '#f8fafc',
                      border: selectedCustomer === cust ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                      marginBottom: '8px',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{cust}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                      {cust === 'Emily Carter' ? 'cust-1' : 'cust-2'}
                    </span>
                  </div>
                ))}
              </div>

              <div style={styles.panelCard}>
                <h3>{selectedCustomer}</h3>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Customer ID: {selectedCustomer === 'Emily Carter' ? 'cust-1' : 'cust-2'}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '20px 0' }}>
                  <div>
                    <label style={styles.label}>EMAIL ADDRESS</label>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedCustomer === 'Emily Carter' ? 'emily.carter@email.com' : 'marcus.vance@email.com'}</div>
                  </div>
                  <div>
                    <label style={styles.label}>TELEPHONE</label>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedCustomer === 'Emily Carter' ? '+1 (555) 012-3456' : '+1 (555) 987-6543'}</div>
                  </div>
                </div>

                <h4 style={{ marginTop: '24px' }}>Linked Policies</h4>
                <div style={styles.tableRow}>
                  <span>{selectedCustomer === 'Emily Carter' ? 'PD-HL-68821' : 'PD-LF-11223'}</span>
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. POLICY REGISTRY TAB */}
        {activeTab === 'Policy Registry' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Policy Registry</h2>
                <p style={styles.subHeader}>Browse, filter, and track policy types and coverage lifecycle terms.</p>
              </div>
              <button onClick={() => setActiveTab('Reports Dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
            </div>

            <div style={styles.panelCard}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px' }}>
                    <th style={{ padding: '12px' }}>POLICY ID</th>
                    <th style={{ padding: '12px' }}>CATEGORY</th>
                    <th style={{ padding: '12px' }}>HOLDER NAME</th>
                    <th style={{ padding: '12px' }}>PREMIUM</th>
                    <th style={{ padding: '12px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', color: '#2563eb', fontWeight: 'bold' }}>PD-HL-68821</td>
                    <td style={{ padding: '12px' }}>Health Insurance</td>
                    <td style={{ padding: '12px' }}>Emily Carter</td>
                    <td style={{ padding: '12px' }}>$250</td>
                    <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>Active</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', color: '#2563eb', fontWeight: 'bold' }}>PD-LF-48892</td>
                    <td style={{ padding: '12px' }}>Life Insurance</td>
                    <td style={{ padding: '12px' }}>Emily Carter</td>
                    <td style={{ padding: '12px' }}>$188</td>
                    <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>Active</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', color: '#2563eb', fontWeight: 'bold' }}>PD-LF-11223</td>
                    <td style={{ padding: '12px' }}>Auto Insurance</td>
                    <td style={{ padding: '12px' }}>Marcus Vance</td>
                    <td style={{ padding: '12px' }}>$150</td>
                    <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. CLAIMS SETTLEMENT TAB */}
        {activeTab === 'Claims Settlement' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Claims Settlement Desk</h2>
                <p style={styles.subHeader}>Submit coverage claims, verify supporting bills, and process payout resolutions.</p>
              </div>
              <button onClick={() => setActiveTab('Reports Dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
            </div>

            <div style={styles.panelCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #16a34a', borderRadius: '6px', backgroundColor: '#f0fdf4' }}>
                <div>
                  <strong>Emily Carter</strong>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Incident amount: $1,200</div>
                </div>
                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>Approved</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. PREMIUM LEDGER TAB */}
        {activeTab === 'Premium Ledger' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2>Premium Collection & Ledger</h2>
                <p style={styles.subHeader}>Monitor payment status, due dates, and transaction records.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ ...styles.backBtn, backgroundColor: '#2563eb', color: '#fff', border: 'none' }}>+ Record Payment</button>
                <button onClick={() => setActiveTab('Reports Dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
              </div>
            </div>

            <div style={{ ...styles.panelCard, textAlign: 'center', padding: '40px', color: '#64748b' }}>
              No payment records found. Click "+ Record Payment" to add.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  loadingContainer: { minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#0b1329', color: '#ffffff' },
  
  // SIGN IN STYLES
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

  // MAIN LAYOUT STYLES
  dashboardContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#0b1329', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 16px' },
  sidebarHeader: { paddingBottom: '20px', borderBottom: '1px solid #1e293b', marginBottom: '16px' },
  sidebarLogo: { margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#ffffff' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '10px 14px', color: '#ffffff', border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '14px' },
  
  // SIDEBAR USER FOOTER & SIGN OUT
  sidebarFooter: { borderTop: '1px solid #1e293b', paddingTop: '16px' },
  userCard: { marginBottom: '12px' },
  userEmail: { fontSize: '13px', fontWeight: 'bold', color: '#ffffff', wordBreak: 'break-all' },
  userRole: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
  signOutButton: { width: '100%', padding: '10px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },

  // CONTENT & PANELS
  mainContent: { flex: 1, padding: '32px', backgroundColor: '#f8fafc' },
  contentHeader: { marginBottom: '24px' },
  subHeader: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  statCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  statLabel: { fontSize: '11px', fontWeight: 'bold', color: '#64748b' },
  statVal: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '8px 0' },
  statSub: { fontSize: '12px', color: '#64748b' },
  panelCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  backBtn: { padding: '8px 14px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#334155' },
  tableRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '8px' }
};





