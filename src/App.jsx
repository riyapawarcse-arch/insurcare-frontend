// src/App.jsx
import React, { useState } from 'react';
import CustomerRegistry from './CustomerRegistry';
import PolicyManager from './PolicyManager';
import AnalyticsDashboard from './AnalyticsDashboard';
// Replace localhost with your actual live Render URL
const API_BASE_URL = 'https://insurcare-api.onrender.com/api';

// ==========================================
// MOCK USERS (NISHANT REMOVED, RIYA IS ADMIN)
// ==========================================
const availableUsers = [
  {
    id: "USR-001",
    name: "Riya Pawar",
    role: "System Admin & Operations Lead",
    email: "riya.pawar@insurcare.com",
    avatar: "👩‍💼"
  },
  {
    id: "USR-002",
    name: "Vikram Malhotra",
    role: "Corporate Client Admin (Nexus Tech)",
    email: "vikram@nexustech.com",
    avatar: "🏢"
  },
  {
    id: "USR-003",
    name: "Aarav Sharma",
    role: "Claims Settlement Officer",
    email: "aarav.sharma@insurcare.com",
    avatar: "👨‍⚕️"
  }
];

const initialClaimsData = [
  {
    id: "CLM-1001",
    applicant: "Aarav Sharma",
    policyId: "POL-88219",
    amount: "₹45,000",
    numericAmount: 45000,
    status: "Pending",
    submissionDate: "2026-02-10",
    description: "Medical reimbursement for emergency hospitalization at Max Healthcare.",
    proofFile: "Hospital_Bill_Receipt.pdf"
  },
  {
    id: "CLM-1002",
    applicant: "Priya Verma",
    policyId: "POL-44102",
    amount: "₹12,500",
    numericAmount: 12500,
    status: "Approved",
    submissionDate: "2026-02-08",
    description: "Dental procedure reimbursement and routine consultation fees.",
    proofFile: "Dental_Clinic_Invoice.pdf"
  },
  {
    id: "CLM-1003",
    applicant: "Rohan Gupta",
    policyId: "POL-11928",
    amount: "₹28,000",
    numericAmount: 28000,
    status: "Rejected",
    submissionDate: "2026-02-05",
    description: "Outpatient surgical procedure claim submitted past coverage window.",
    proofFile: "OPD_Consultation_Bill.pdf"
  }
];

function ClaimsSettlementDesk({ onNavigateToCustomers, currentUser }) {
  const [claims, setClaims] = useState(initialClaimsData);
  const [selectedClaimId, setSelectedClaimId] = useState("CLM-1001");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const totalClaimsCount = claims.length;
  const pendingClaims = claims.filter((c) => c.status === "Pending");
  const pendingPayoutVolume = pendingClaims.reduce((sum, c) => sum + c.numericAmount, 0);

  const resolvedClaims = claims.filter((c) => c.status !== "Pending");
  const approvedClaims = claims.filter((c) => c.status === "Approved");
  const approvalRate =
    resolvedClaims.length > 0
      ? Math.round((approvedClaims.length / resolvedClaims.length) * 100)
      : 0;

  const filteredClaims = claims.filter((c) => {
    if (filterStatus === "All") return true;
    return c.status === filterStatus;
  });

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || filteredClaims[0];

  const handleResolution = (id, newStatus) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
            Claims Settlement Desk
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Active Session: Logged in as <strong style={{ color: '#2563eb' }}>{currentUser.name}</strong> ({currentUser.role})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            + Submit New Claim
          </button>
          <button
            onClick={onNavigateToCustomers}
            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            Manage Customers →
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Total Claims File</span>
            <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontSize: '14px' }}>📁</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>{totalClaimsCount}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Active entries in workspace</div>
        </div>

        <div style={{ background: '#fff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Pending Payout Volume</span>
            <span style={{ background: '#fffbebe', color: '#d97706', padding: '4px 8px', borderRadius: '6px', fontSize: '14px' }}>⏳</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#d97706' }}>₹{pendingPayoutVolume.toLocaleString("en-IN")}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Awaiting officer resolution</div>
        </div>

        <div style={{ background: '#fff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Approval Settlement Rate</span>
            <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '14px' }}>✅</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#059669' }}>{approvalRate}%</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{approvedClaims.length} approved / {resolvedClaims.length} resolved</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  background: filterStatus === st ? '#0f172a' : '#f1f5f9',
                  color: filterStatus === st ? '#fff' : '#64748b'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 12px 0' }}>
            Submitted Claims ({filteredClaims.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredClaims.map((c) => {
              const isSelected = c.id === selectedClaim?.id;
              let badgeBg = '#fef3c7';
              let badgeColor = '#d97706';
              if (c.status === 'Approved') { badgeBg = '#ecfdf5'; badgeColor = '#059669'; }
              if (c.status === 'Rejected') { badgeBg = '#fef2f2'; badgeColor = '#dc2626'; }

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClaimId(c.id)}
                  style={{
                    padding: '12px 14px',
                    background: isSelected ? '#f8fafc' : '#fff',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{c.applicant}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      {c.policyId} • <strong style={{ color: '#0f172a' }}>{c.amount}</strong>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', background: badgeBg, color: badgeColor, padding: '4px 8px', borderRadius: '6px', fontWeight: '700' }}>
                    {c.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {selectedClaim ? (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', color: '#0f172a', margin: 0 }}>Claim Case File ({selectedClaim.id})</h3>
              <span
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontWeight: '700',
                  background: selectedClaim.status === 'Approved' ? '#ecfdf5' : selectedClaim.status === 'Rejected' ? '#fef2f2' : '#fef3c7',
                  color: selectedClaim.status === 'Approved' ? '#059669' : selectedClaim.status === 'Rejected' ? '#dc2626' : '#d97706'
                }}
              >
                {selectedClaim.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Customer Applicant</span>
                <strong style={{ color: '#0f172a' }}>{selectedClaim.applicant}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Requested Payout</span>
                <strong style={{ color: '#2563eb' }}>{selectedClaim.amount}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '13px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Incident Description</span>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#334155' }}>
                {selectedClaim.description}
              </div>
            </div>

            {selectedClaim.status === 'Pending' ? (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
                  Action By Officer ({currentUser.name}):
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleResolution(selectedClaim.id, 'Rejected')}
                    style={{ flex: 1, background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => handleResolution(selectedClaim.id, 'Approved')}
                    style={{ flex: 1, background: '#16a34a', border: 'none', color: '#fff', padding: '10px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Approve Payout
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                Resolution locked in audit registry by {currentUser.name}.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(availableUsers[0]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ background: '#0f172a', padding: '0 24px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '16px' }}>
            🛡️
          </div>
          <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '0.5px' }}>
            INSUR-CARE PORTAL
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['dashboard', 'claims', 'customers', 'policies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#2563eb' : 'transparent',
                color: activeTab === tab ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'claims' ? 'Claims Desk' : tab === 'customers' ? 'Customer Directory' : tab}
            </button>
          ))}
        </div>

        {/* LOGGED IN USER PROFILE */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#1e293b',
              border: '1px solid #334155',
              padding: '6px 12px',
              borderRadius: '20px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '16px' }}>{currentUser.avatar}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>{currentUser.name}</div>
              <div style={{ fontSize: '10px', color: '#38bdf8' }}>● {currentUser.role.split(' ')[0]}</div>
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>▼</span>
          </button>

          {isUserMenuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '260px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #cbd5e1',
                zIndex: 1000,
                padding: '8px'
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #e2e8f0', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b' }}>
                  Currently Signed In
                </span>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{currentUser.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{currentUser.email}</div>
              </div>

              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', padding: '4px 12px', display: 'block' }}>
                Switch Active User Account:
              </span>

              {availableUsers.map((usr) => (
                <button
                  key={usr.id}
                  onClick={() => {
                    setCurrentUser(usr);
                    setIsUserMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: currentUser.id === usr.id ? '#eff6ff' : 'transparent',
                    color: '#0f172a',
                    fontSize: '12px',
                    fontWeight: currentUser.id === usr.id ? '700' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{usr.avatar}</span>
                  <div>
                    <div>{usr.name}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{usr.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard onNavigate={(tab) => setActiveTab(tab)} currentUser={currentUser} />
        )}
        {activeTab === 'claims' && (
          <ClaimsSettlementDesk onNavigateToCustomers={() => setActiveTab('customers')} currentUser={currentUser} />
        )}
        {activeTab === 'customers' && (
          <CustomerRegistry onBack={() => setActiveTab('claims')} currentUser={currentUser} />
        )}
        {activeTab === 'policies' && (
          <PolicyManager onBack={() => setActiveTab('claims')} currentUser={currentUser} />
        )}
      </main>
    </div>
  );
}



