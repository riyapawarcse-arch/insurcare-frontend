import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const revenueData = [
  { month: 'January', revenue: 42000 },
  { month: 'February', revenue: 53000 },
  { month: 'March', revenue: 48000 },
  { month: 'April', revenue: 61000 },
  { month: 'May', revenue: 58000 },
  { month: 'June', revenue: 75000 },
];

const customerGrowthData = [
  { month: 'January', customers: 120 },
  { month: 'February', customers: 190 },
  { month: 'March', customers: 150 },
  { month: 'April', customers: 220 },
  { month: 'May', customers: 280 },
  { month: 'June', customers: 340 },
];

const policyDistributionData = [
  { name: 'Health', value: 45 },
  { name: 'Motor', value: 30 },
  { name: 'Life', value: 15 },
  { name: 'Travel', value: 7 },
  { name: 'Home', value: 3 },
];

const claimsStatusData = [
  { name: 'Approved', value: 65 },
  { name: 'Pending', value: 20 },
  { name: 'Rejected', value: 15 },
];

const premiumCollectionData = [
  { month: 'January', premium: 35000 },
  { month: 'February', premium: 42000 },
  { month: 'March', premium: 39000 },
  { month: 'April', premium: 51000 },
  { month: 'May', premium: 48000 },
  { month: 'June', premium: 62000 },
];

const recentCustomersData = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', policy: 'Health Shield Gold', premium: '₹12,500', status: 'Active', joinedDate: '2026-06-28' },
  { id: 2, name: 'Priya Verma', email: 'priya.verma@example.com', policy: 'Motor Secure Plus', premium: '₹8,200', status: 'Active', joinedDate: '2026-06-27' },
  { id: 3, name: 'Rohan Gupta', email: 'rohan.gupta@example.com', policy: 'Term Life Prime', premium: '₹18,000', status: 'Pending Verification', joinedDate: '2026-06-26' },
  { id: 4, name: 'Ananya Iyer', email: 'ananya.iyer@example.com', policy: 'Global Travel Elite', premium: '₹4,500', status: 'Active', joinedDate: '2026-06-25' },
  { id: 5, name: 'Vikram Malhotra', email: 'vikram.m@example.com', policy: 'Home Shield Comprehensive', premium: '₹15,000', status: 'Active', joinedDate: '2026-06-24' },
];

const activityTimelineData = [
  { id: 1, type: 'policy', title: 'Latest policy purchased', desc: 'Aarav Sharma enrolled in Health Shield Gold', time: '10 mins ago' },
  { id: 2, type: 'claim', title: 'Latest claim', desc: 'Claim CLM-1002 submitted by Priya Verma', time: '45 mins ago' },
  { id: 3, type: 'customer', title: 'Latest customer', desc: 'Ananya Iyer registered corporate profile', time: '2 hours ago' },
  { id: 4, type: 'payment', title: 'Latest payment', desc: 'Received ₹15,000 premium for Vikram Malhotra', time: '3 hours ago' },
];

const notificationsData = [
  { id: 1, type: 'expiry', text: 'Policy POL-5091 for Rohan Gupta expiring in 7 days.' },
  { id: 2, type: 'approval', text: '3 new claims waiting for officer audit and sign-off.' },
  { id: 3, type: 'waiting', text: 'Pending KYC documentation review for 5 recent user profiles.' },
];

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
const CLAIMS_COLORS = ['#16a34a', '#f59e0b', '#dc2626'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div style={styles.portalLayout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.sidebarBrand}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <span style={styles.brandText}>INSUR-CARE PORTAL</span>
          </div>
          <div style={styles.navMenu}>
            <button style={{ ...styles.navItem, ...(activeTab === 'dashboard' ? styles.navActive : {}) }} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
            <button style={{ ...styles.navItem, ...(activeTab === 'claims' ? styles.navActive : {}) }} onClick={() => setActiveTab('claims')}>⚖️ Claims Desk</button>
            <button style={{ ...styles.navItem, ...(activeTab === 'directory' ? styles.navActive : {}) }} onClick={() => setActiveTab('directory')}>👤 Customer Directory</button>
            <button style={{ ...styles.navItem, ...(activeTab === 'policies' ? styles.navActive : {}) }} onClick={() => setActiveTab('policies')}>📋 Policies</button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={styles.mainContent}>
        <header style={styles.topHeader}>
          <div style={styles.topHeaderNav}>
            {['dashboard', 'claims', 'directory', 'policies'].map((tab) => (
              <button
                key={tab}
                style={{ ...styles.headerTabBtn, ...(activeTab === tab ? styles.headerTabActive : {}) }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div style={styles.userProfilePill}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>Riya Pawar</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>● System</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>▼</span>
          </div>
        </header>

        <div style={styles.workspaceBody}>
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={styles.sectionTitle}>Executive Analytics Dashboard</h2>
                  <p style={styles.sectionSub}>Comprehensive corporate performance metrics, live data feeds, and operational insights.</p>
                </div>
                <button style={styles.primaryBtn} onClick={() => setActiveTab('claims')}>Go to Claims Desk →</button>
              </div>

              {/* 1. TOP KPI CARDS */}
              <div style={styles.kpiGrid}>
                <div style={styles.kpiCard}>
                  <div style={styles.kpiIconBox}>👥</div>
                  <div>
                    <span style={styles.metricLabel}>TOTAL CUSTOMERS</span>
                    <div style={styles.metricVal}>1,482</div>
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>↑ +12% this month</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIconBox}>📋</div>
                  <div>
                    <span style={styles.metricLabel}>TOTAL POLICIES</span>
                    <div style={styles.metricVal}>2,150</div>
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>● Bound & Operational</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIconBox}>⚖️</div>
                  <div>
                    <span style={styles.metricLabel}>ACTIVE CLAIMS</span>
                    <div style={styles.metricVal}>48</div>
                    <span style={{ fontSize: '11px', color: '#d97706', fontWeight: '600' }}>Requires evaluation</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIconBox}>💳</div>
                  <div>
                    <span style={styles.metricLabel}>PREMIUM COLLECTED</span>
                    <div style={styles.metricVal}>₹3.42M</div>
                    <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>YTD Aggregate</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIconBox}>⏳</div>
                  <div>
                    <span style={styles.metricLabel}>PENDING CLAIMS</span>
                    <div style={styles.metricVal}>14</div>
                    <span style={{ fontSize: '11px', color: '#d97706', fontWeight: '600' }}>Officer audit ongoing</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIconBox}>📈</div>
                  <div>
                    <span style={styles.metricLabel}>SETTLEMENT RATE</span>
                    <div style={styles.metricVal}>92.4%</div>
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>Approval efficiency</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIconBox}>💵</div>
                  <div>
                    <span style={styles.metricLabel}>MONTHLY REVENUE</span>
                    <div style={styles.metricVal}>₹75,000</div>
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>Peak performance</span>
                  </div>
                </div>

                <div style={styles.kpiCard}>
                  <div style={styles.kpiIconBox}>🚀</div>
                  <div>
                    <span style={styles.metricLabel}>NEW REGISTRATIONS</span>
                    <div style={styles.metricVal}>340</div>
                    <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: '600' }}>June 2026 Cycle</span>
                  </div>
                </div>
              </div>

              {/* CHARTS GRID SECTION */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                
                {/* 1. Revenue Trend (Line Chart) */}
                <div style={styles.cardBox}>
                  <h3 style={styles.chartTitle}>Monthly Revenue Trend</h3>
                  <p style={styles.chartSub}>January - June 2026 performance</p>
                  <div style={{ width: '100%', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 5 }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Customer Growth (Bar Chart) */}
                <div style={styles.cardBox}>
                  <h3 style={styles.chartTitle}>Customer Growth Registration</h3>
                  <p style={styles.chartSub}>New user registrations per month</p>
                  <div style={{ width: '100%', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={customerGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="customers" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Policy Distribution (Pie Chart) */}
                <div style={styles.cardBox}>
                  <h3 style={styles.chartTitle}>Policy Distribution Breakdown</h3>
                  <p style={styles.chartSub}>Health, Motor, Life, Travel, Home</p>
                  <div style={{ width: '100%', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={policyDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                          {policyDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Claims Status (Pie Chart) */}
                <div style={styles.cardBox}>
                  <h3 style={styles.chartTitle}>Claims Status Distribution</h3>
                  <p style={styles.chartSub}>Approved, Pending, Rejected metrics</p>
                  <div style={{ width: '100%', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={claimsStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                          {claimsStatusData.map((entry, index) => (
                            <Cell key={`claim-cell-${index}`} fill={CLAIMS_COLORS[index % CLAIMS_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* QUICK ACTIONS SECTION */}
              <div style={styles.cardBox}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Quick Actions Section</h3>
                <div style={styles.quickActionsGrid}>
                  <button style={styles.actionBtn} onClick={() => showToast('Opened Add Customer Modal')}>
                    <span style={{ fontSize: '18px' }}>👤</span> Add Customer
                  </button>
                  <button style={styles.actionBtn} onClick={() => showToast('Opened Policy Creation Wizard')}>
                    <span style={{ fontSize: '18px' }}>📋</span> Create Policy
                  </button>
                  <button style={styles.actionBtn} onClick={() => showToast('Navigated to Claims Review')}>
                    <span style={{ fontSize: '18px' }}>⚖️</span> Approve Claim
                  </button>
                  <button style={styles.actionBtn} onClick={() => showToast('Analytics Report Generated successfully!')}>
                    <span style={{ fontSize: '18px' }}>📊</span> Generate Report
                  </button>
                  <button style={styles.actionBtn} onClick={() => showToast('CSV Export downloaded successfully!')}>
                    <span style={{ fontSize: '18px' }}>📥</span> Export CSV
                  </button>
                </div>
              </div>

              {/* Premium Collection Bar Chart */}
              <div style={styles.cardBox}>
                <h3 style={styles.chartTitle}>Monthly Premium Collection</h3>
                <p style={styles.chartSub}>Aggregated premium inflows over past 6 months</p>
                <div style={{ width: '100%', marginTop: '16px' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={premiumCollectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="premium" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Customers Table */}
              <div style={styles.cardBox}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Recent Customers Roster</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Latest registered clients and active policy statuses</p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.th}>Customer</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Policy</th>
                        <th style={styles.th}>Premium</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCustomersData.map((cust) => (
                        <tr key={cust.id} style={styles.tr}>
                          <td style={styles.td}><strong style={{ color: '#0f172a' }}>{cust.name}</strong></td>
                          <td style={styles.td}>{cust.email}</td>
                          <td style={styles.td}>{cust.policy}</td>
                          <td style={styles.td}>{cust.premium}</td>
                          <td style={styles.td}>
                            <span style={{ ...styles.statusBadge, backgroundColor: cust.status === 'Active' ? '#dcfce7' : '#fef3c7', color: cust.status === 'Active' ? '#16a34a' : '#d97706' }}>
                              {cust.status}
                            </span>
                          </td>
                          <td style={styles.td}>{cust.joinedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Timeline & Notifications Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                
                {/* Activity Timeline */}
                <div style={styles.cardBox}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Activity Timeline</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Real-time audit log of system events</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activityTimelineData.map((item) => (
                      <div key={item.id} style={styles.timelineItem}>
                        <div style={styles.timelineDot}></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '13px', color: '#0f172a' }}>{item.title}</strong>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>{item.time}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0 0' }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications Card */}
                <div style={styles.cardBox}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Notifications & Alerts</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Urgent operational items requiring attention</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notificationsData.map((note) => (
                      <div key={note.id} style={styles.notificationBox}>
                        <span style={{ fontSize: '16px' }}>⚠️</span>
                        <p style={{ fontSize: '13px', color: '#334155', margin: 0, fontWeight: '500' }}>{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div style={styles.cardBox}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Quick Navigation Shortcuts</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={styles.shortcutCard} onClick={() => setActiveTab('claims')}>
                    <span style={{ fontSize: '24px' }}>⚖️</span>
                    <div>
                      <strong>Claims Desk & Proofs</strong>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Review and verify claims</p>
                    </div>
                  </div>
                  <div style={styles.shortcutCard} onClick={() => setActiveTab('directory')}>
                    <span style={{ fontSize: '24px' }}>👤</span>
                    <div>
                      <strong style={{ display: 'block' }}>Customer Directory</strong>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Corporate client roster</p>
                    </div>
                  </div>
                  <div style={styles.shortcutCard} onClick={() => setActiveTab('policies')}>
                    <span style={{ fontSize: '24px' }}>📋</span>
                    <div>
                      <strong style={{ display: 'block' }}>Policy Administration</strong>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Active insurance terms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div style={styles.cardBox}>
              <h2 style={styles.sectionTitle}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Workspace</h2>
              <p style={styles.sectionSub}>Manage enterprise operations for {activeTab}.</p>
            </div>
          )}
        </div>
      </main>

      {toast && <div style={styles.toastNotification}>⚠️ {toast}</div>}
    </div>
  );
}

const styles = {
  portalLayout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#0b132b', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px', boxSizing: 'border-box' },
  sidebarBrand: { display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid #1e293b' },
  brandText: { fontSize: '13px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.05em' },
  navMenu: { display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', backgroundColor: 'transparent', color: '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textAlign: 'left' },
  navActive: { backgroundColor: '#2563eb', color: 'white', fontWeight: '600' },

  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topHeader: { backgroundColor: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' },
  topHeaderNav: { display: 'flex', gap: '8px' },
  headerTabBtn: { padding: '8px 16px', background: 'none', border: 'none', fontSize: '13px', fontWeight: '600', color: '#64748b', cursor: 'pointer', borderRadius: '6px' },
  headerTabActive: { backgroundColor: '#f1f5f9', color: '#0f172a' },
  userProfilePill: { display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' },

  workspaceBody: { padding: '24px 32px', flex: 1 },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
  sectionSub: { fontSize: '13px', color: '#64748b', margin: 0 },

  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' },
  kpiCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', display: 'flex', alignItems: 'center', gap: '16px' },
  kpiIconBox: { width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },

  metricLabel: { fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
  metricVal: { fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: '4px 0 2px 0' },

  cardBox: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', marginBottom: '24px', minWidth: 0 },
  shortcutCard: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' },

  quickActionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' },
  actionBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },

  chartTitle: { fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' },
  chartSub: { fontSize: '12px', color: '#64748b', margin: 0 },

  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' },
  tableHeaderRow: { borderBottom: '2px solid #e2e8f0', color: '#64748b', backgroundColor: '#f8fafc' },
  th: { padding: '12px 16px', fontWeight: '700' },
  td: { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', color: '#334155' },
  statusBadge: { padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' },

  timelineItem: { display: 'flex', gap: '12px', position: 'relative', paddingLeft: '8px' },
  timelineDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb', marginTop: '5px', flexShrink: 0 },

  notificationBox: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px' },

  primaryBtn: { padding: '10px 18px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)' },
  toastNotification: { position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#0f172a', color: 'white', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', zIndex: 2000, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }
};










