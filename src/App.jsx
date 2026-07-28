import React, { useState, useEffect } from 'react';

// Initial Mock Data matching the full interactive requirements
const INITIAL_CLAIMS = [
  {
    id: 'CLM-1001',
    policyId: 'POL-88219',
    applicant: 'Aarav Sharma',
    payout: 45000,
    status: 'Pending',
    date: '2026-02-10',
    description: 'Medical reimbursement for emergency hospitalization at Max Healthcare',
    proofUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    proofName: 'Hospitalization_Bill_Max_Healthcare.pdf'
  },
  {
    id: 'CLM-1002',
    policyId: 'POL-44102',
    applicant: 'Priya Verma',
    payout: 12500,
    status: 'Approved',
    date: '2026-02-08',
    description: 'Dental procedure reimbursement and routine consultation fees.',
    proofUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce6395?auto=format&fit=crop&w=800&q=80',
    proofName: 'Dental_Invoice_Receipt_Dr_Gupta.pdf'
  },
  {
    id: 'CLM-1003',
    policyId: 'POL-11928',
    applicant: 'Rohan Gupta',
    payout: 28000,
    status: 'Rejected',
    date: '2026-02-05',
    description: 'Outpatient surgical claim submitted past coverage window.',
    proofUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    proofName: 'Outpatient_Surgery_Invoice.pdf'
  }
];

const CUSTOMERS = [
  { id: 'CUST-601', company: 'Nexus Tech Solutions', admin: 'Vikram Malhotra', email: 'vikram@nexustech.com', phone: '+91 98765 43210', activePolicies: 4, coverage: '₹1,80,000,000', status: 'Active' },
  { id: 'CUST-602', company: 'Apex Logistics India', admin: 'Ananya Deshmukh', email: 'ananya.d@apexlogistics.in', phone: '+91 98112 33445', activePolicies: 2, coverage: '₹70,000,000', status: 'Active' },
  { id: 'CUST-603', company: 'Zenith Retail Corp', admin: 'Siddharth Rao', email: 's.rao@zenithretail.com', phone: '+91 97110 99887', activePolicies: 0, coverage: '₹0', status: 'Inactive' },
  { id: 'CUST-604', company: 'Vanguard Infra Projects', admin: 'Meera Kapoor', email: 'meera.k@vanguardinfra.com', phone: '+91 99554 11223', activePolicies: 6, coverage: '₹3,20,000,000', status: 'Active' }
];

const POLICIES = [
  { id: 'POL-88219', name: 'Comprehensive Gold Shield', category: 'Health', holder: 'Aarav Sharma', maxSum: '₹10,000,000', premium: '₹24,500', deductible: '₹5,000', accountId: 'CUST-601', startDate: '2025-02-15', expiryDate: '2027-02-14', status: 'Active' },
  { id: 'POL-33109', name: 'DriveProtect Zero-Dep', category: 'Motor', holder: 'Aarav Sharma', maxSum: '₹800,000', premium: '₹12,000', deductible: '₹1,000', accountId: 'CUST-601', startDate: '2025-06-01', expiryDate: '2026-05-31', status: 'Active' },
  { id: 'POL-44102', name: 'Family Dental & Care', category: 'Health', holder: 'Priya Verma', maxSum: '₹500,000', premium: '₹14,200', deductible: '₹2,000', accountId: 'CUST-602', startDate: '2024-11-01', expiryDate: '2026-10-31', status: 'Active' },
  { id: 'POL-11928', name: 'Term Life Assurance Prime', category: 'Life', holder: 'Rohan Gupta', maxSum: '₹20,000,000', premium: '₹36,000', deductible: '₹0', accountId: 'CUST-603', startDate: '2024-01-20', expiryDate: '2027-01-19', status: 'Active' }
];

const USERS = [
  { name: 'Riya Pawar', role: 'System Admin & Operations Lead', email: 'riya.pawar@insurcare.com', type: 'System' },
  { name: 'Vikram Malhotra', role: 'Corporate Client Admin (Nexus Tech)', email: 'vikram@nexustech.com', type: 'Corporate' },
  { name: 'Ananya Deshmukh', role: 'Claims Settlement Officer', email: 'ananya.d@apexlogistics.in', type: 'Claims' }
];

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(USERS[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth States
  const [accountType, setAccountType] = useState('Company Staff / Admin');
  const [email, setEmail] = useState('riya.pawar@insurcare.com');
  const [password, setPassword] = useState('••••••');

  // Navigation State
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Interactive App States
  const [claims, setClaims] = useState(INITIAL_CLAIMS);
  const [selectedClaimId, setSelectedClaimId] = useState('CLM-1001');
  const [claimFilter, setClaimFilter] = useState('All');
  
  const [selectedModalCust, setSelectedModalCust] = useState(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState('POL-88219');
  const [policyCategoryFilter, setPolicyCategoryFilter] = useState('All');
  const [policySearch, setPolicySearch] = useState('');
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Modal Overlays for Interactive Buttons
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [isNewPolicyModalOpen, setIsNewPolicyModalOpen] = useState(false);
  const [proofViewerDoc, setProofViewerDoc] = useState(null);

  // New Form Inputs
  const [newClaimForm, setNewClaimForm] = useState({ applicant: '', policyId: 'POL-88219', payout: '', description: '', proofName: 'Medical_Receipt.pdf' });
  const [newCompanyForm, setNewCompanyForm] = useState({ company: '', admin: '', email: '', phone: '', coverage: '₹10,000,000' });
  const [newPolicyForm, setNewPolicyForm] = useState({ name: '', category: 'Health', holder: '', maxSum: '₹5,000,000', premium: '₹15,000', deductible: '₹2,000' });

  useEffect(() => {
    const savedToken = localStorage.getItem('insurcare_token');
    const savedUser = localStorage.getItem('insurcare_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const activeUser = USERS.find(u => u.email === email) || USERS[0];
    localStorage.setItem('insurcare_token', 'demo-token');
    localStorage.setItem('insurcare_user', JSON.stringify(activeUser));
    setToken('demo-token');
    setUser(activeUser);
    showToast(`Successfully signed in as ${activeUser.name}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setActiveTab('Dashboard');
  };

  // Fully Interactive Actions
  const handleClaimStatusChange = (id, newStatus) => {
    setClaims(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast(`Claim ${id} status updated to ${newStatus}`);
  };

  const handleCreateClaimSubmit = (e) => {
    e.preventDefault();
    const newId = `CLM-100${claims.length + 1}`;
    const newEntry = {
      id: newId,
      policyId: newClaimForm.policyId,
      applicant: newClaimForm.applicant || 'New Claimant',
      payout: Number(newClaimForm.payout) || 15000,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      description: newClaimForm.description || 'Newly submitted documentation for claim review.',
      proofUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      proofName: newClaimForm.proofName
    };
    setClaims([newEntry, ...claims]);
    setSelectedClaimId(newId);
    setIsNewClaimModalOpen(false);
    setNewClaimForm({ applicant: '', policyId: 'POL-88219', payout: '', description: '', proofName: 'Medical_Receipt.pdf' });
    showToast(`New Claim ${newId} submitted successfully!`);
  };

  const handleCreateCompanySubmit = (e) => {
    e.preventDefault();
    const newCust = {
      id: `CUST-60${CUSTOMERS.length + 1}`,
      company: newCompanyForm.company,
      admin: newCompanyForm.admin,
      email: newCompanyForm.email,
      phone: newCompanyForm.phone,
      activePolicies: 1,
      coverage: newCompanyForm.coverage,
      status: 'Active'
    };
    CUSTOMERS.push(newCust);
    setIsNewCompanyModalOpen(false);
    setNewCompanyForm({ company: '', admin: '', email: '', phone: '', coverage: '₹10,000,000' });
    showToast(`Company account ${newCust.company} created successfully!`);
  };

  const handleCreatePolicySubmit = (e) => {
    e.preventDefault();
    const newPol = {
      id: `POL-99${Math.floor(100 + Math.random() * 900)}`,
      name: newPolicyForm.name,
      category: newPolicyForm.category,
      holder: newPolicyForm.holder,
      maxSum: newPolicyForm.maxSum,
      premium: newPolicyForm.premium,
      deductible: newPolicyForm.deductible,
      accountId: 'CUST-601',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '2027-02-14',
      status: 'Active'
    };
    POLICIES.push(newPol);
    setSelectedPolicyId(newPol.id);
    setIsNewPolicyModalOpen(false);
    setNewPolicyForm({ name: '', category: 'Health', holder: '', maxSum: '₹5,000,000', premium: '₹15,000', deductible: '₹2,000' });
    showToast(`Policy ${newPol.id} issued successfully!`);
  };

  const handleDownloadScriptOrProof = (fileName) => {
    const element = document.createElement("a");
    const file = new Blob([`INSUR-CARE PORTAL - VERIFIED AUDIT & PROOF DOCUMENT\nFile Name: ${fileName}\nTimestamp: ${new Date().toLocaleString()}\nStatus: Cryptographically Verified & Approved`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${fileName.split('.')[0]}_Verified_Copy.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded verified document: ${fileName}`);
  };

  const handlePrintDocument = (docTitle) => {
    window.print();
    showToast(`Print command sent for: ${docTitle}`);
  };

  const selectedClaim = claims.find(c => c.id === selectedClaimId) || claims[0];
  const pendingPayoutTotal = claims.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.payout, 0);
  const approvedCount = claims.filter(c => c.status === 'Approved').length;
  const totalProcessed = claims.filter(c => c.status !== 'Pending').length;
  const approvalRate = totalProcessed > 0 ? Math.round((approvedCount / totalProcessed) * 100) : 0;

  const filteredClaims = claims.filter(c => claimFilter === 'All' ? true : c.status === claimFilter);

  const filteredPolicies = POLICIES.filter(p => {
    const matchesCategory = policyCategoryFilter === 'All' ? true : p.category === policyCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(policySearch.toLowerCase()) || 
                          p.holder.toLowerCase().includes(policySearch.toLowerCase()) || 
                          p.id.toLowerCase().includes(policySearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedPolicy = POLICIES.find(p => p.id === selectedPolicyId) || POLICIES[0];

  if (isLoading) {
    return <div style={styles.loader}>Loading Insur-Care Portal...</div>;
  }

  // SIGN IN SCREEN
  if (!token) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginTitle}>Sign In To SafeShield</h2>
          <p style={styles.loginSubtitle}>Enter your credentials to access the platform.</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>ACCOUNT TYPE</label>
              <select value={accountType} onChange={(e) => setAccountType(e.target.value)} style={styles.select}>
                <option value="Company Staff / Admin">💼 Company Staff / Admin</option>
                <option value="Insurance Customer">👤 Insurance Customer</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>EMAIL ADDRESS</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>PASSWORD</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            </div>

            <button type="submit" style={styles.signInBtn}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appLayout}>
      {/* TOAST NOTIFICATION BANNER */}
      {toastMessage && (
        <div style={styles.toastNotification}>
          🔔 {toastMessage}
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brandHeader}>
            <h3 style={styles.brandName}>🛡️ INSUR-CARE PORTAL</h3>
          </div>

          <nav style={styles.navList}>
            {[
              { id: 'Dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'Claims Desk', label: 'Claims Desk', icon: '⚖️' },
              { id: 'Customer Directory', label: 'Customer Directory', icon: '👤' },
              { id: 'Policies', label: 'Policies', icon: '📋' },
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

        <div style={styles.sidebarFooter}>
          <div style={styles.profileBox}>
            <div style={styles.profileEmail}>{user.name}</div>
            <div style={styles.profileRole}>{user.role}</div>
          </div>
          <button onClick={handleLogout} style={styles.signOutBtn}>Sign Out</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* TOP HEADER */}
        <header style={styles.topHeader}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Dashboard', 'Claims Desk', 'Customer Directory', 'Policies'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.topNavTab,
                  backgroundColor: activeTab === tab ? '#1d4ed8' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : '#94a3b8'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TOP RIGHT 3-USER ACCOUNT SWITCHER */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} style={styles.userDropdownBtn}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff' }}>{user.name} ▾</div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>● {user.type}</div>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div style={styles.profileDropdownMenu}>
                <div style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                  CURRENTLY SIGNED IN AS<br /><strong style={{ color: '#0f172a', fontSize: '12px' }}>{user.name}</strong>
                </div>
                <div style={{ padding: '6px 12px', fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }}>SWITCH ACTIVE USER ACCOUNT:</div>
                {USERS.map((u) => (
                  <button
                    key={u.email}
                    onClick={() => {
                      setUser(u);
                      localStorage.setItem('insurcare_user', JSON.stringify(u));
                      setIsProfileMenuOpen(false);
                      showToast(`Switched active user to ${u.name}`);
                    }}
                    style={{
                      ...styles.dropdownUserOption,
                      backgroundColor: user.email === u.email ? '#eff6ff' : '#ffffff'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#0f172a' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{u.role}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* DYNAMIC VIEW PANELS */}
        <main style={styles.mainContainer}>
          {/* 1. DASHBOARD */}
          {activeTab === 'Dashboard' && (
            <div>
              <div style={styles.topBarFlex}>
                <div>
                  <h2 style={styles.pageTitle}>Executive Analytics Dashboard</h2>
                  <p style={styles.pageSubtitle}>High-level performance metrics, loss ratio analysis, and live system activity.</p>
                </div>
                <button onClick={() => setActiveTab('Claims Desk')} style={styles.actionBlueBtn}>Go to Claims Desk →</button>
              </div>

              <div style={styles.kpiGrid}>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>TOTAL PREMIUMS BOUND</span>
                  <div style={styles.kpiVal}>₹86,700</div>
                  <span style={styles.tagGreen}>● {POLICIES.length} Active Policies</span>
                </div>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>TOTAL CLAIMS VOLUME</span>
                  <div style={styles.kpiVal}>₹85,500</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{claims.length} Claims Filed</span>
                </div>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>NET LOSS RATIO</span>
                  <div style={{ ...styles.kpiVal, color: '#dc2626' }}>98.6%</div>
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 'bold' }}>▲ High payout volume</span>
                </div>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>NET UNDERWRITING PROFIT</span>
                  <div style={{ ...styles.kpiVal, color: '#16a34a' }}>₹1,200</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Gross earned margin</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div style={styles.panelCard}>
                  <h4 style={{ margin: '0 0 16px 0' }}>Claims Volume Breakdown by Category</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                        <span>Health Insurance (2 claims)</span>
                        <span>₹57,500 (67%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                        <div style={{ width: '67%', height: '100%', backgroundColor: '#2563eb', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                        <span>Motor / Auto (1 claims)</span>
                        <span>₹28,000 (33%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                        <div style={{ width: '33%', height: '100%', backgroundColor: '#0284c7', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.panelCard}>
                  <h4 style={{ margin: '0 0 16px 0' }}>Live System Activity Feed</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={styles.tagOrange}>Claim Pending</span>
                      <span><strong>Aarav Sharma</strong> submitted ₹45,000 claim</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={styles.tagBlue}>Policy Issued</span>
                      <span>Term Life Assurance issued to Rohan Gupta</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={styles.tagGreen}>Claim Approved</span>
                      <span><strong>Priya Verma</strong> ₹12,500 payout approved</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ ...styles.panelCard, marginTop: '20px' }}>
                <h4 style={{ margin: '0 0 16px 0' }}>Portal Module Quick Access</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <button onClick={() => setActiveTab('Claims Desk')} style={styles.quickAccessBtn}>
                    <span style={{ fontSize: '24px' }}>⚖️</span>
                    <strong>Claims Desk</strong>
                  </button>
                  <button onClick={() => setActiveTab('Customer Directory')} style={styles.quickAccessBtn}>
                    <span style={{ fontSize: '24px' }}>👥</span>
                    <strong>Customers</strong>
                  </button>
                  <button onClick={() => setActiveTab('Policies')} style={styles.quickAccessBtn}>
                    <span style={{ fontSize: '24px' }}>📋</span>
                    <strong>Policies</strong>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. CLAIMS DESK */}
          {activeTab === 'Claims Desk' && (
            <div>
              <div style={styles.topBarFlex}>
                <div>
                  <h2 style={styles.pageTitle}>Claims Settlement Desk</h2>
                  <p style={styles.pageSubtitle}>Session logged in as <strong>{user.name}</strong> ({user.role})</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setIsNewClaimModalOpen(true)} style={styles.actionBlueBtn}>+ Submit New Claim</button>
                  <button onClick={() => setActiveTab('Customer Directory')} style={styles.backBtn}>Manage Customers →</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>TOTAL CLAIMS FILE</span>
                  <div style={styles.kpiVal}>{claims.length}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Active entries in workspace</span>
                </div>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>PENDING PAYOUT VOLUME</span>
                  <div style={styles.kpiVal}>₹{pendingPayoutTotal.toLocaleString()}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Awaiting officer resolution</span>
                </div>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>APPROVAL SETTLEMENT RATE</span>
                  <div style={{ ...styles.kpiVal, color: '#16a34a' }}>{approvalRate}%</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{approvedCount} approved / {totalProcessed} resolved</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
                <div style={styles.panelCard}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                    {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                      <button
                        key={f}
                        onClick={() => setClaimFilter(f)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '11px',
                          cursor: 'pointer',
                          backgroundColor: claimFilter === f ? '#0f172a' : '#f1f5f9',
                          color: claimFilter === f ? '#ffffff' : '#475569',
                          fontWeight: 'bold'
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredClaims.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedClaimId(c.id)}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: selectedClaimId === c.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: selectedClaimId === c.id ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px' }}>
                          <span>{c.applicant}</span>
                          <span style={c.status === 'Pending' ? styles.tagOrange : c.status === 'Approved' ? styles.tagGreen : styles.tagRed}>
                            {c.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          {c.policyId} • ₹{c.payout.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.panelCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Claim Case File ({selectedClaim.id})</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => handlePrintDocument(`Claim_${selectedClaim.id}`)} style={styles.backBtn} title="Print Case File">🖨️ Print</button>
                      <span style={selectedClaim.status === 'Pending' ? styles.tagOrange : selectedClaim.status === 'Approved' ? styles.tagGreen : styles.tagRed}>
                        {selectedClaim.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '20px 0' }}>
                    <div>
                      <label style={styles.miniLabel}>CUSTOMER APPLICANT</label>
                      <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{selectedClaim.applicant}</div>
                    </div>
                    <div>
                      <label style={styles.miniLabel}>REQUESTED PAYOUT</label>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#2563eb' }}>₹{selectedClaim.payout.toLocaleString()}</div>
                    </div>
                    <div>
                      <label style={styles.miniLabel}>SUBMISSION DATE</label>
                      <div style={{ fontWeight: 'bold' }}>{selectedClaim.date}</div>
                    </div>
                    <div>
                      <label style={styles.miniLabel}>POLICY ID</label>
                      <div style={{ fontWeight: 'bold', color: '#2563eb' }}>{selectedClaim.policyId}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={styles.miniLabel}>INCIDENT DESCRIPTION</label>
                    <div style={{ fontSize: '13px', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', marginTop: '4px' }}>
                      {selectedClaim.description}
                    </div>
                  </div>

                  {/* DOCUMENTATION & PROOF BUTTONS */}
                  <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a' }}>DOCUMENTATION & PROOF FILE</div>
                      <div style={{ fontSize: '12px', color: '#2563eb' }}>📄 {selectedClaim.proofName}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setProofViewerDoc(selectedClaim)} style={styles.backBtn}>🔍 View Proof</button>
                      <button onClick={() => handleDownloadScriptOrProof(selectedClaim.proofName)} style={styles.actionBlueBtn}>⬇ Download Proof Script</button>
                    </div>
                  </div>

                  {selectedClaim.status === 'Pending' ? (
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                      <label style={styles.miniLabel}>ACTION BY OFFICER ({user.name.toUpperCase()})</label>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button onClick={() => handleClaimStatusChange(selectedClaim.id, 'Rejected')} style={styles.rejectBtn}>
                          Reject Claim
                        </button>
                        <button onClick={() => handleClaimStatusChange(selectedClaim.id, 'Approved')} style={styles.approveBtn}>
                          Approve Payout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Resolution locked in audit record by {user.name}.</span>
                      <button onClick={() => handleDownloadScriptOrProof(`Approval_Script_${selectedClaim.id}`)} style={styles.backBtn}>📥 Download Approval Script</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. CUSTOMER DIRECTORY */}
          {activeTab === 'Customer Directory' && (
            <div>
              <div style={styles.topBarFlex}>
                <div>
                  <h2 style={styles.pageTitle}>Customer Directory</h2>
                  <p style={styles.pageSubtitle}>Manage client corporate accounts and primary company administrators.</p>
                </div>
                <button onClick={() => setIsNewCompanyModalOpen(true)} style={styles.actionBlueBtn}>+ Add New Company</button>
              </div>

              <div style={styles.panelCard}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                      <th style={{ padding: '12px' }}>CUSTOMER ID</th>
                      <th style={{ padding: '12px' }}>COMPANY NAME</th>
                      <th style={{ padding: '12px' }}>COMPANY ADMIN (CONTACT)</th>
                      <th style={{ padding: '12px' }}>ACTIVE POLICIES</th>
                      <th style={{ padding: '12px' }}>STATUS</th>
                      <th style={{ padding: '12px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CUSTOMERS.map((cust) => (
                      <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: '#64748b' }}>{cust.id}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{cust.company}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 'bold' }}>👤 {cust.admin}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{cust.email} • {cust.phone}</div>
                        </td>
                        <td style={{ padding: '12px' }}>{cust.activePolicies} Policies</td>
                        <td style={{ padding: '12px' }}>
                          <span style={cust.status === 'Active' ? styles.tagGreen : styles.tagRed}>{cust.status}</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => setSelectedModalCust(cust)} style={styles.backBtn}>View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. POLICIES */}
          {activeTab === 'Policies' && (
            <div>
              <div style={styles.topBarFlex}>
                <div>
                  <h2 style={styles.pageTitle}>Policy Administration</h2>
                  <p style={styles.pageSubtitle}>Issue new insurance products, inspect active terms, and review policy conditions.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setIsNewPolicyModalOpen(true)} style={styles.actionBlueBtn}>+ Issue New Policy</button>
                  <button onClick={() => setActiveTab('Dashboard')} style={styles.backBtn}>← Back</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>ACTIVE POLICIES</span>
                  <div style={styles.kpiVal}>{POLICIES.length}</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Policies bound and active</span>
                </div>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>HEALTH & LIFE PLANS</span>
                  <div style={{ ...styles.kpiVal, color: '#16a34a' }}>3</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>High coverage bindings</span>
                </div>
                <div style={styles.kpiCard}>
                  <span style={styles.kpiLabel}>MOTOR & PROPERTY</span>
                  <div style={{ ...styles.kpiVal, color: '#f59e0b' }}>1</div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Asset protection contracts</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
                <div style={styles.panelCard}>
                  <input
                    type="text"
                    placeholder="🔍 Search policies..."
                    value={policySearch}
                    onChange={(e) => setPolicySearch(e.target.value)}
                    style={{ ...styles.input, marginBottom: '12px' }}
                  />

                  <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                    {['All', 'Health', 'Motor', 'Life'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setPolicyCategoryFilter(cat)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '11px',
                          cursor: 'pointer',
                          backgroundColor: policyCategoryFilter === cat ? '#0f172a' : '#f1f5f9',
                          color: policyCategoryFilter === cat ? '#ffffff' : '#475569',
                          fontWeight: 'bold'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredPolicies.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPolicyId(p.id)}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: selectedPolicyId === p.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: selectedPolicyId === p.id ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px' }}>
                          <span>{p.name}</span>
                          <span style={{ fontSize: '11px', color: '#2563eb' }}>{p.category}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          {p.id} • {p.holder}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.panelCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{selectedPolicy.name}</h3>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Policy Ref. {selectedPolicy.id}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handlePrintDocument(`Policy_${selectedPolicy.id}`)} style={styles.backBtn}>🖨️ Print</button>
                      <button onClick={() => handleDownloadScriptOrProof(`Policy_Terms_${selectedPolicy.id}`)} style={styles.actionBlueBtn}>⬇ Download Script</button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '20px 0' }}>
                    <div>
                      <label style={styles.miniLabel}>POLICYHOLDER</label>
                      <div style={{ fontWeight: 'bold' }}>{selectedPolicy.holder}</div>
                    </div>
                    <div>
                      <label style={styles.miniLabel}>COVERAGE CATEGORY</label>
                      <div style={{ fontWeight: 'bold', color: '#2563eb' }}>{selectedPolicy.category}</div>
                    </div>
                    <div>
                      <label style={styles.miniLabel}>MAXIMUM COVERAGE SUM</label>
                      <div style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '16px' }}>{selectedPolicy.maxSum}</div>
                    </div>
                    <div>
                      <label style={styles.miniLabel}>ANNUAL PREMIUM</label>
                      <div style={{ fontWeight: 'bold' }}>{selectedPolicy.premium}</div>
                    </div>
                    <div>
                      <label style={styles.miniLabel}>DEDUCTIBLE TERM</label>
                      <div style={{ fontWeight: 'bold' }}>{selectedPolicy.deductible}</div>
                    </div>
                    <div>
                      <label style={styles.miniLabel}>LINKED ACCOUNT ID</label>
                      <div style={{ fontWeight: 'bold' }}>{selectedPolicy.accountId}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>EFFECTIVE START: </span>
                      <strong>{selectedPolicy.startDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#dc2626' }}>POLICY EXPIRY: </span>
                      <strong style={{ color: '#dc2626' }}>{selectedPolicy.expiryDate}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- ALL INTERACTIVE MODALS --- */}

      {/* 1. CUSTOMER SUMMARY MODAL */}
      {selectedModalCust && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Customer Account Summary</h3>
              <button onClick={() => setSelectedModalCust(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <hr style={{ margin: '12px 0', borderColor: '#e2e8f0' }} />
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>COMPANY NAME</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>{selectedModalCust.company} ({selectedModalCust.id})</div>
              
              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>DESIGNATED COMPANY ADMIN</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedModalCust.admin}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>✉️ {selectedModalCust.email}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>📞 {selectedModalCust.phone}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Active Policies:</div>
                  <div style={{ fontWeight: 'bold' }}>{selectedModalCust.activePolicies}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Total Coverage Volume:</div>
                  <div style={{ fontWeight: 'bold', color: '#16a34a' }}>{selectedModalCust.coverage}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={() => handlePrintDocument(selectedModalCust.company)} style={styles.backBtn}>🖨️ Print Summary</button>
              <button onClick={() => setSelectedModalCust(null)} style={{ ...styles.actionBlueBtn, flex: 1, backgroundColor: '#0f172a' }}>
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROOF VIEWER MODAL */}
      {proofViewerDoc && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalBox, width: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Proof Documentation Viewer</h3>
              <button onClick={() => setProofViewerDoc(null)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 12px 0' }}>File: {proofViewerDoc.proofName} (Claim ID: {proofViewerDoc.id})</p>
            
            <div style={{ width: '100%', height: '280px', backgroundColor: '#e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={proofViewerDoc.proofUrl} alt="Proof receipt" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => handleDownloadScriptOrProof(proofViewerDoc.proofName)} style={styles.actionBlueBtn}>⬇ Download Proof Script</button>
              <button onClick={() => setProofViewerDoc(null)} style={styles.backBtn}>Close Viewer</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUBMIT NEW CLAIM MODAL */}
      {isNewClaimModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Submit New Claim</h3>
              <button onClick={() => setIsNewClaimModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateClaimSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div>
                <label style={styles.miniLabel}>APPLICANT NAME</label>
                <input type="text" required placeholder="e.g. Kavita Sharma" value={newClaimForm.applicant} onChange={e => setNewClaimForm({...newClaimForm, applicant: e.target.value})} style={styles.inputModal} />
              </div>
              <div>
                <label style={styles.miniLabel}>POLICY REF ID</label>
                <select value={newClaimForm.policyId} onChange={e => setNewClaimForm({...newClaimForm, policyId: e.target.value})} style={styles.selectModal}>
                  {POLICIES.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.miniLabel}>REQUESTED PAYOUT AMOUNT (₹)</label>
                <input type="number" required placeholder="e.g. 18500" value={newClaimForm.payout} onChange={e => setNewClaimForm({...newClaimForm, payout: e.target.value})} style={styles.inputModal} />
              </div>
              <div>
                <label style={styles.miniLabel}>INCIDENT DESCRIPTION</label>
                <textarea required placeholder="Describe medical or incident details..." value={newClaimForm.description} onChange={e => setNewClaimForm({...newClaimForm, description: e.target.value})} style={{ ...styles.inputModal, height: '70px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsNewClaimModalOpen(false)} style={styles.backBtn}>Cancel</button>
                <button type="submit" style={{ ...styles.actionBlueBtn, flex: 1 }}>Submit Claim File</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD NEW COMPANY MODAL */}
      {isNewCompanyModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Add New Company Account</h3>
              <button onClick={() => setIsNewCompanyModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreateCompanySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div>
                <label style={styles.miniLabel}>COMPANY NAME</label>
                <input type="text" required placeholder="e.g. Cyberdyne Systems" value={newCompanyForm.company} onChange={e => setNewCompanyForm({...newCompanyForm, company: e.target.value})} style={styles.inputModal} />
              </div>
              <div>
                <label style={styles.miniLabel}>ADMIN CONTACT NAME</label>
                <input type="text" required placeholder="e.g. John Connor" value={newCompanyForm.admin} onChange={e => setNewCompanyForm({...newCompanyForm, admin: e.target.value})} style={styles.inputModal} />
              </div>
              <div>
                <label style={styles.miniLabel}>EMAIL ADDRESS</label>
                <input type="email" required placeholder="admin@cyberdyne.com" value={newCompanyForm.email} onChange={e => setNewCompanyForm({...newCompanyForm, email: e.target.value})} style={styles.inputModal} />
              </div>
              <div>
                <label style={styles.miniLabel}>PHONE NUMBER</label>
                <input type="text" required placeholder="+91 98765 11223" value={newCompanyForm.phone} onChange={e => setNewCompanyForm({...newCompanyForm, phone: e.target.value})} style={styles.inputModal} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsNewCompanyModalOpen(false)} style={styles.backBtn}>Cancel</button>
                <button type="submit" style={{ ...styles.actionBlueBtn, flex: 1 }}>Create Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ISSUE NEW POLICY MODAL */}
      {isNewPolicyModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Issue New Insurance Policy</h3>
              <button onClick={() => setIsNewPolicyModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleCreatePolicySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div>
                <label style={styles.miniLabel}>POLICY PLAN NAME</label>
                <input type="text" required placeholder="e.g. Executive Elite Health" value={newPolicyForm.name} onChange={e => setNewPolicyForm({...newPolicyForm, name: e.target.value})} style={styles.inputModal} />
              </div>
              <div>
                <label style={styles.miniLabel}>CATEGORY</label>
                <select value={newPolicyForm.category} onChange={e => setNewPolicyForm({...newPolicyForm, category: e.target.value})} style={styles.selectModal}>
                  <option value="Health">Health</option>
                  <option value="Motor">Motor</option>
                  <option value="Life">Life</option>
                </select>
              </div>
              <div>
                <label style={styles.miniLabel}>POLICYHOLDER NAME</label>
                <input type="text" required placeholder="e.g. Aarav Sharma" value={newPolicyForm.holder} onChange={e => setNewPolicyForm({...newPolicyForm, holder: e.target.value})} style={styles.inputModal} />
              </div>
              <div>
                <label style={styles.miniLabel}>MAX COVERAGE SUM</label>
                <input type="text" required placeholder="₹10,000,000" value={newPolicyForm.maxSum} onChange={e => setNewPolicyForm({...newPolicyForm, maxSum: e.target.value})} style={styles.inputModal} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsNewPolicyModalOpen(false)} style={styles.backBtn}>Cancel</button>
                <button type="submit" style={{ ...styles.actionBlueBtn, flex: 1 }}>Issue Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// STYLES
const styles = {
  loader: { minHeight: '100vh', display: 'grid', placeItems: 'center', backgroundColor: '#0b1329', color: '#ffffff' },

  toastNotification: { position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '1px solid #334155', zIndex: 9999, fontSize: '13px', fontWeight: 'bold' },

  loginPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1329', fontFamily: 'sans-serif' },
  loginCard: { width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px' },
  loginTitle: { margin: '0 0 6px 0', fontSize: '22px', fontWeight: 'bold', textAlign: 'center' },
  loginSubtitle: { margin: '0 0 24px 0', fontSize: '13px', color: '#64748b', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  inputLabel: { fontSize: '11px', fontWeight: 'bold', color: '#475569' },
  select: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%', boxSizing: 'border-box' },
  signInBtn: { padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },

  appLayout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  sidebar: { width: '240px', backgroundColor: '#0b1329', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 16px', flexShrink: 0 },
  brandHeader: { paddingBottom: '16px', borderBottom: '1px solid #1e293b', marginBottom: '16px' },
  brandName: { margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#ffffff' },
  navList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  navBtn: { display: 'flex', alignItems: 'center', width: '100%', padding: '10px 12px', color: '#ffffff', border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '13px' },
  sidebarFooter: { borderTop: '1px solid #1e293b', paddingTop: '16px' },
  profileBox: { marginBottom: '12px' },
  profileEmail: { fontSize: '13px', fontWeight: 'bold', color: '#ffffff' },
  profileRole: { fontSize: '11px', color: '#94a3b8' },
  signOutBtn: { width: '100%', padding: '8px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' },

  topHeader: { height: '56px', backgroundColor: '#0b1329', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #1e293b' },
  topNavTab: { padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  userDropdownBtn: { background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  profileDropdownMenu: { position: 'absolute', right: 24, top: '48px', width: '280px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0', zIndex: 100 },
  dropdownUserOption: { width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' },

  mainContainer: { flex: 1, padding: '24px', overflowY: 'auto' },
  topBarFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  pageTitle: { margin: 0, fontSize: '20px', color: '#0f172a' },
  pageSubtitle: { color: '#64748b', fontSize: '13px', marginTop: '4px' },
  
  actionBlueBtn: { padding: '8px 16px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },
  backBtn: { padding: '8px 14px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#334155' },

  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  kpiCard: { backgroundColor: '#ffffff', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  kpiLabel: { fontSize: '10px', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.5px' },
  kpiVal: { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '6px 0' },

  panelCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  miniLabel: { fontSize: '10px', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' },

  tagGreen: { backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' },
  tagOrange: { backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' },
  tagRed: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' },
  tagBlue: { backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' },

  approveBtn: { flex: 1, padding: '10px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },
  rejectBtn: { flex: 1, padding: '10px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },

  quickAccessBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalBox: { backgroundColor: '#ffffff', width: '450px', borderRadius: '12px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  inputModal: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' },
  selectModal: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#ffffff', boxSizing: 'border-box' }
};



              





