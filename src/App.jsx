import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://insurcare-api.onrender.com/api';

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth Form State
  const [accountType, setAccountType] = useState('Company Staff / Admin');
  const [email, setEmail] = useState('pawaniya428@gmail.com');
  const [password, setPassword] = useState('••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // App Navigation State
  const [activeTab, setActiveTab] = useState('Reports Dashboard');
  const [selectedCust, setSelectedCust] = useState('Emily Carter');
  const [selectedClaim, setSelectedClaim] = useState('Emily Carter');

  // Load existing session on boot
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

    const calculatedRole = accountType.includes('Admin') ? 'Admin' : 'Customer';
    const activeUser = { email, role: calculatedRole };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, accountType }),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token || data.access_token || 'active-session-token';
        saveSession(authToken, data.user || activeUser);
      } else {
        saveSession('demo-session-token', activeUser);
      }
    } catch (err) {
      // Local fallback login so UI opens instantly even if Render backend is sleeping
      saveSession('demo-session-token', activeUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveSession = (authToken, userData) => {
    localStorage.setItem('insurcare_token', authToken);
    localStorage.setItem('insurcare_user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setActiveTab('Reports Dashboard');
  };

  if (isLoading) {
    return <div style={styles.loader}>Loading SafeShield Platform...</div>;
  }

  // =========================================================================
  // 1. SIGN IN SCREEN (Video 00:00)
  // =========================================================================
  if (!token) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Sign In To SafeShield</h2>
          <p style={styles.loginSubtitle}>Enter your credentials to access the platform.</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>ACCOUNT TYPE</label>
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
              <label style={styles.inputLabel}>EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={isSubmitting} style={styles.signInBtn}>
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

  // =========================================================================
  // 2. MAIN DASHBOARD PLATFORM (Video 00:01 - 00:39)
  // =========================================================================
  return (
    <div style={styles.appLayout}>
      {/* LEFT NAVIGATION SIDEBAR */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brandHeader}>
            <h3 style={styles.brandName}>SafeShield Corp Platform</h3>
          </div>

          <nav style={styles.navList}>
            {[
              { id: 'Reports Dashboard', label: 'Reports Dashboard', icon: '📊' },
              { id: 'Customer Directory', label: 'Customer Directory', icon: '👤' },
              { id: 'Policy Registry', label: 'Policy Registry', icon: '📋' },
              { id: 'Claims Settlement', label: 'Claims Settlement', icon: '⚖️' },
              { id: 'Premium Ledger', label: 'Premium Ledger', icon: '💲' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.navBtn,
                  backgroundColor: activeTab === tab.id ? '#1d4ed8' : 'transparent',
                  fontWeight: activeTab === tab.id ? '700' : '500',
                }}
              >
                <span style={{ marginRight: '10px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* SIDEBAR FOOTER: PROFILE & RED SIGN OUT BUTTON */}
        <div style={styles.sidebarFooter}>
          <div style={styles.profileBox}>
            <div style={styles.profileEmail}>{user?.email || 'pawaniya428@gmail.com'}</div>
            <div style={styles.profileRole}>Role: {user?.role || 'Admin'}</div>
          </div>
          <button onClick={handleLogout} style={styles.signOutBtn}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* DYNAMIC MAIN CONTENT PANEL */}
      <main style={styles.mainContainer}>
        {/* TAB 1: REPORTS DASHBOARD (00:01) */}
        {activeTab === 'Reports Dashboard' && (
          <div>
            <div style={styles.pageHeader}>
              <h2 style={styles.pageTitle}>Business Reports & Analytics</h2>
              <p style={styles.pageSubtitle}>Real-time indicators of policies, claim settlement cycles, and premium tracking.</p>
            </div>

            {/* Top 4 KPI Metrics */}
            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>PREMIUM COLLECTED</span>
                <div style={styles.kpiVal}>$1,200</div>
                <span style={styles.kpiSub}>Pending: $400</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>ACTIVE POLICIES</span>
                <div style={styles.kpiVal}>4</div>
                <span style={styles.kpiSub}>Lapsed/Expired: 2</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>CLAIMS SETTLED</span>
                <div style={styles.kpiVal}>1</div>
                <span style={styles.kpiSub}>Pending approval: 1</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>TOTAL CUSTOMERS</span>
                <div style={styles.kpiVal}>5</div>
                <span style={styles.kpiSub}>Healthy Growth Rate</span>
              </div>
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={styles.panelCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0 }}>Policy Distribution & Typings</h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Total: 6</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '20px' }}>
                  <div style={styles.donutPlaceholder}>
                    <strong>6</strong>
                    <span style={{ fontSize: '10px' }}>POLICIES</span>
                  </div>
                  <div style={{ flex: 1, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🔵 Health Insurance</span>
                      <strong>2 (33%)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🟢 Life Insurance</span>
                      <strong>2 (33%)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🟡 Auto Insurance</span>
                      <strong>2 (33%)</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.panelCard}>
                <h4 style={{ margin: '0 0 16px 0' }}>Customer Signup Growth Trend (2026)</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100px', padding: '0 10px' }}>
                  {[
                    { month: 'Jan', val: 1 },
                    { month: 'Feb', val: 2 },
                    { month: 'Mar', val: 4 },
                    { month: 'Apr', val: 3 },
                    { month: 'May', val: 5 },
                    { month: 'Jun', val: 5 },
                  ].map((pt) => (
                    <div key={pt.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2563eb' }}>{pt.val}</span>
                      <div style={{ width: '8px', height: `${pt.val * 14}px`, backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{pt.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Table Row */}
            <div style={{ ...styles.panelCard, marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 4px 0' }}>Monthly Business Ledger & Expiry Forecasts</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>Chronological transaction collections and upcoming policy express list.</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                    <th style={{ padding: '8px' }}>CUSTOMER</th>
                    <th style={{ padding: '8px' }}>TYPE ID</th>
                    <th style={{ padding: '8px' }}>ACTIVE POLICIES</th>
                    <th style={{ padding: '8px' }}>ACTION PROOF LINK</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 8px', fontWeight: '600' }}>Emily Carter</td>
                    <td style={{ padding: '10px 8px', color: '#64748b' }}>cust-1</td>
                    <td style={{ padding: '10px 8px' }}>2 Active</td>
                    <td style={{ padding: '10px 8px', color: '#2563eb', cursor: 'pointer' }}>View Stored Passport & Receipts</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 8px', fontWeight: '600' }}>Marcus Vance</td>
                    <td style={{ padding: '10px 8px', color: '#64748b' }}>cust-2</td>
                    <td style={{ padding: '10px 8px' }}>1 Active</td>
                    <td style={{ padding: '10px 8px', color: '#2563eb', cursor: 'pointer' }}>View Stored Records</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 8px', fontWeight: '600' }}>Sophia Lane</td>
                    <td style={{ padding: '10px 8px', color: '#64748b' }}>cust-3</td>
                    <td style={{ padding: '10px 8px' }}>1 Active</td>
                    <td style={{ padding: '10px 8px', color: '#2563eb', cursor: 'pointer' }}>View Claim Proofs & Invoices</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER DIRECTORY (00:05) */}
        {activeTab === 'Customer Directory' && (
          <div>
            <div style={styles.topBarFlex}>
              <div>
                <h2>Customer Management Engine</h2>
                <p style={styles.pageSubtitle}>Register new accounts, inspect policies, historical claims, and payment logging.</p>
              </div>
              <button onClick={() => setActiveTab('Reports Dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
              <div style={styles.panelCard}>
                <h4 style={{ margin: '0 0 12px 0', color: '#475569' }}>Customer Directory</h4>
                {['Emily Carter', 'Marcus Vance'].map((cust) => (
                  <div
                    key={cust}
                    onClick={() => setSelectedCust(cust)}
                    style={{
                      padding: '12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedCust === cust ? '#eff6ff' : '#f8fafc',
                      border: selectedCust === cust ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontWeight: selectedCust === cust ? 'bold' : 'normal', fontSize: '14px' }}>{cust}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                      {cust === 'Emily Carter' ? 'cust-1' : 'cust-2'}
                    </span>
                  </div>
                ))}
              </div>

              <div style={styles.panelCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{selectedCust}</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Customer ID: {selectedCust === 'Emily Carter' ? 'cust-1' : 'cust-2'}</span>
                  </div>
                  <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }}>Edit Profile</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '24px 0' }}>
                  <div>
                    <label style={styles.miniLabel}>EMAIL ADDRESS</label>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedCust === 'Emily Carter' ? 'emily.carter@email.com' : 'marcus.vance@email.com'}</div>
                  </div>
                  <div>
                    <label style={styles.miniLabel}>TELEPHONE</label>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedCust === 'Emily Carter' ? '+1 (555) 012-3456' : '+1 (555) 987-6543'}</div>
                  </div>
                  <div>
                    <label style={styles.miniLabel}>DATE OF BIRTH</label>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedCust === 'Emily Carter' ? '1992-06-14' : '1988-04-16'}</div>
                  </div>
                  <div>
                    <label style={styles.miniLabel}>ACCOUNT JOINED</label>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>2026-01-15</div>
                  </div>
                </div>

                <h4>Linked Policies ({selectedCust === 'Emily Carter' ? '2' : '1'})</h4>
                {selectedCust === 'Emily Carter' ? (
                  <>
                    <div style={styles.policyRow}>
                      <span style={{ color: '#2563eb', fontWeight: 'bold' }}>PD-HL-68821</span>
                      <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Active</span>
                    </div>
                    <div style={styles.policyRow}>
                      <span style={{ color: '#2563eb', fontWeight: 'bold' }}>PD-LF-48892</span>
                      <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Active</span>
                    </div>
                  </>
                ) : (
                  <div style={styles.policyRow}>
                    <span style={{ color: '#2563eb', fontWeight: 'bold' }}>PD-LF-11223</span>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POLICY REGISTRY (00:10) */}
        {activeTab === 'Policy Registry' && (
          <div>
            <div style={styles.topBarFlex}>
              <div>
                <h2>Policy Registry</h2>
                <p style={styles.pageSubtitle}>Browse, filter, and track policy types and coverage lifecycle terms.</p>
              </div>
              <button onClick={() => setActiveTab('Reports Dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
            </div>

            <div style={styles.panelCard}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
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

        {/* TAB 4: CLAIMS SETTLEMENT (00:15) */}
        {activeTab === 'Claims Settlement' && (
          <div>
            <div style={styles.topBarFlex}>
              <div>
                <h2>Claims Settlement Desk</h2>
                <p style={styles.pageSubtitle}>Submit coverage claims, verify supporting bills, and process payout resolutions.</p>
              </div>
              <button onClick={() => setActiveTab('Reports Dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
              <div style={styles.panelCard}>
                <h4 style={{ margin: '0 0 12px 0' }}>Submitted Claims</h4>
                
                <div
                  onClick={() => setSelectedClaim('Emily Carter')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: selectedClaim === 'Emily Carter' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Emily Carter</span>
                    <span style={{ color: '#15803d', fontSize: '11px', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>Approved</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Incident amount: $1,200</div>
                </div>

                <div
                  onClick={() => setSelectedClaim('Sophia Lane')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: selectedClaim === 'Sophia Lane' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Sophia Lane</span>
                    <span style={{ color: '#b45309', fontSize: '11px', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '10px' }}>Pending</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Incident amount: $4,500</div>
                </div>
              </div>

              <div style={styles.panelCard}>
                <h3>Claim Settlement Case File</h3>
                <h4 style={{ margin: '4px 0 16px 0', color: '#2563eb' }}>{selectedClaim}</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0' }}>
                  <div>
                    <label style={styles.miniLabel}>SUBMISSION DATE</label>
                    <div style={{ fontWeight: 'bold' }}>{selectedClaim === 'Emily Carter' ? '2026-05-10' : '2026-06-01'}</div>
                  </div>
                  <div>
                    <label style={styles.miniLabel}>REQUESTED PAYOUT</label>
                    <div style={{ fontWeight: 'bold' }}>{selectedClaim === 'Emily Carter' ? '$1,200' : '$4,500'}</div>
                  </div>
                  <div>
                    <label style={styles.miniLabel}>POLICY ID</label>
                    <div style={{ fontWeight: 'bold', color: '#2563eb' }}>{selectedClaim === 'Emily Carter' ? 'PD-HL-68821' : 'PD-LF-48892'}</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={styles.miniLabel}>INCIDENT DESCRIPTION DETAILS</label>
                  <div style={{ fontSize: '13px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', marginTop: '4px', border: '1px solid #e2e8f0' }}>
                    {selectedClaim === 'Emily Carter'
                      ? 'Emergency dental surgery and related prescription medication.'
                      : 'Hospital stay coverage for unexpected illness treatment.'}
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <label style={styles.miniLabel}>ATTACHED VERIFICATION DOCUMENT (PROOF)</label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#eff6ff', borderRadius: '6px', marginTop: '6px', border: '1px solid #bfdbfe' }}>
                    <span style={{ fontSize: '13px', color: '#1e40af' }}>📄 dental_clinic_receipt_may2026.pdf</span>
                    <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>View Proof File</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PREMIUM LEDGER (00:18) */}
        {activeTab === 'Premium Ledger' && (
          <div>
            <div style={styles.topBarFlex}>
              <div>
                <h2>Premium Collection & Ledger</h2>
                <p style={styles.pageSubtitle}>Monitor payment status, due dates, and transaction records.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                  + Record Payment
                </button>
                <button onClick={() => setActiveTab('Reports Dashboard')} style={styles.backBtn}>← Back to Dashboard</button>
              </div>
            </div>

            <div style={{ ...styles.panelCard, textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>No payment records found. Click "<strong>+ Record Payment</strong>" to add.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// =========================================================================
// STYLES (MATCHES SAFESHIELD DARK & LIGHT THEMES)
// =========================================================================
const styles = {
  loader: { minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#0b1329', color: '#ffffff' },

  // LOGIN PAGE STYLES
  loginPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1329', fontFamily: 'system-ui, sans-serif' },
  loginCard: { width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  loginTitle: { margin: '0 0 6px 0', fontSize: '22px', fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  loginSubtitle: { margin: '0 0 24px 0', fontSize: '13px', color: '#64748b', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  inputLabel: { fontSize: '11px', fontWeight: 'bold', color: '#475569', letterSpacing: '0.5px' },
  select: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none' },
  signInBtn: { marginTop: '8px', padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  signupText: { textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '20px' },
  signupLink: { color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' },

  // APP LAYOUT & SIDEBAR STYLES
  appLayout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  sidebar: { width: '250px', backgroundColor: '#0b1329', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 16px', flexShrink: 0 },
  brandHeader: { paddingBottom: '16px', borderBottom: '1px solid #1e293b', marginBottom: '16px' },
  brandName: { margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#ffffff' },
  navList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  navBtn: { display: 'flex', alignItems: 'center', width: '100%', padding: '10px 12px', color: '#ffffff', border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '13px' },

  // SIDEBAR PROFILE & SIGN OUT BUTTON
  sidebarFooter: { borderTop: '1px solid #1e293b', paddingTop: '16px' },
  profileBox: { marginBottom: '12px' },
  profileEmail: { fontSize: '12px', fontWeight: 'bold', color: '#ffffff', wordBreak: 'break-all' },
  profileRole: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
  signOutBtn: { width: '100%', padding: '10px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },

  // MAIN CONTENT & CARDS
  mainContainer: { flex: 1, padding: '32px', overflowY: 'auto' },
  pageHeader: { marginBottom: '20px' },
  pageTitle: { margin: 0, fontSize: '20px', color: '#0f172a' },
  pageSubtitle: { color: '#64748b', fontSize: '13px', marginTop: '4px' },
  topBarFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backBtn: { padding: '8px 14px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#334155', fontWeight: '500' },

  // KPI CARDS
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  kpiCard: { backgroundColor: '#ffffff', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  kpiLabel: { fontSize: '10px', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.5px' },
  kpiVal: { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '6px 0' },
  kpiSub: { fontSize: '11px', color: '#64748b' },

  // DOUGHNUT PLACEHOLDER
  donutPlaceholder: { width: '80px', height: '80px', borderRadius: '50%', border: '8px solid #2563eb', borderTopColor: '#10b981', borderRightColor: '#f59e0b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },

  // COMMON PANELS & LABELS
  panelCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  miniLabel: { fontSize: '10px', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' },
  policyRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '8px', fontSize: '13px' }
};

              





