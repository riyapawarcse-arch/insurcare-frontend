// src/App.jsx
import React, { useState } from 'react';
import CustomerRegistry from './CustomerRegistry';
// Replace localhost with your actual live Render API URL
const API_BASE_URL = "https://insurcare-api.onrender.com";

// ==========================================
// 1. MOCK DATA & API HANDLERS FOR CLAIMS
// ==========================================
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

// ==========================================
// 2. CLAIMS SETTLEMENT DESK MODULE
// ==========================================
function ClaimsSettlementDesk({ onNavigateToCustomers }) {
  const [claims, setClaims] = useState(initialClaimsData);
  const [selectedClaimId, setSelectedClaimId] = useState("CLM-1001");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // New Claim Form State
  const [newApplicant, setNewApplicant] = useState("");
  const [newPolicyId, setNewPolicyId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Metrics Calculations
  const totalClaimsCount = claims.length;
  const pendingClaims = claims.filter((c) => c.status === "Pending");
  const pendingPayoutVolume = pendingClaims.reduce((sum, c) => sum + c.numericAmount, 0);

  const resolvedClaims = claims.filter((c) => c.status !== "Pending");
  const approvedClaims = claims.filter((c) => c.status === "Approved");
  const approvalRate =
    resolvedClaims.length > 0
      ? Math.round((approvedClaims.length / resolvedClaims.length) * 100)
      : 0;

  // Filter List Logic
  const filteredClaims = claims.filter((c) => {
    if (filterStatus === "All") return true;
    return c.status === filterStatus;
  });

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || filteredClaims[0];

  // Actions
  const handleResolution = (id, newStatus) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleCreateClaim = (e) => {
    e.preventDefault();
    if (!newApplicant || !newPolicyId || !newAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    const numericVal = parseFloat(newAmount.replace(/[^0-9.]/g, "")) || 0;
    const today = new Date().toISOString().split("T")[0];

    const newClaimObj = {
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      applicant: newApplicant,
      policyId: newPolicyId,
      amount: `₹${numericVal.toLocaleString("en-IN")}`,
      numericAmount: numericVal,
      status: "Pending",
      submissionDate: today,
      description: newDescription || "Standard policy coverage reimbursement request.",
      proofFile: "Uploaded_Document_Receipt.pdf"
    };

    setClaims((prev) => [newClaimObj, ...prev]);
    setSelectedClaimId(newClaimObj.id);
    setIsSubmitModalOpen(false);

    // Reset Form
    setNewApplicant("");
    setNewPolicyId("");
    setNewAmount("");
    setNewDescription("");
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
            Claims Settlement Desk
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Submit coverage claims, verify supporting bills, and process payout resolutions.
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

      {/* Metrics Bar */}
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

      {/* Main Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Claim List */}
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
            {filteredClaims.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '20px 0' }}>No claims matching filter.</p>
            ) : (
              filteredClaims.map((c) => {
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
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Claim Details */}
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
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Submission Date</span>
                <strong style={{ color: '#0f172a' }}>{selectedClaim.submissionDate}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Policy ID</span>
                <strong style={{ color: '#0f172a' }}>{selectedClaim.policyId}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '13px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Incident Description</span>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#334155' }}>
                {selectedClaim.description}
              </div>
            </div>

            <div style={{ marginBottom: '20px', fontSize: '13px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Verification Proof</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '6px' }}>
                <span style={{ color: '#1e40af', fontWeight: '600' }}>📄 {selectedClaim.proofFile}</span>
                <button
                  onClick={() => setIsProofModalOpen(true)}
                  style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                >
                  View Proof File
                </button>
              </div>
            </div>

            {/* Resolution Actions */}
            {selectedClaim.status === 'Pending' ? (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>Process Resolution:</span>
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
                Resolution completed and locked into audit registry.
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Select a claim case from the left list.
          </div>
        )}
      </div>

      {/* Submit New Claim Modal */}
      {isSubmitModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '480px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Submit New Coverage Claim</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <form onSubmit={handleCreateClaim} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Applicant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={newApplicant}
                  onChange={(e) => setNewApplicant(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Policy ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. POL-88219"
                  value={newPolicyId}
                  onChange={(e) => setNewPolicyId(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Claim Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 45000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Incident Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe reason for hospitalization or medical claim..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  File Coverage Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proof Preview Modal */}
      {isProofModalOpen && selectedClaim && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '520px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Document Proof: {selectedClaim.proofFile}</h3>
              <button onClick={() => setIsProofModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏥</div>
              <h4 style={{ margin: '0 0 4px 0', color: '#0f172a' }}>Verified Hospital Invoice</h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>Issued by Max Healthcare Ltd, New Delhi</p>
              
              <div style={{ textAlign: 'left', background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Patient Name:</span> <strong>{selectedClaim.applicant}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Policy Reference:</span> <strong>{selectedClaim.policyId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '6px' }}>
                  <span>Total Amount Billed:</span> <strong style={{ color: '#2563eb' }}>{selectedClaim.amount}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsProofModalOpen(false)}
                style={{ background: '#0f172a', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                Close Verification Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MAIN ROOT APP COMPONENT (WITH NAVBAR)
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('claims'); // 'claims' | 'customers'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>
      {/* GLOBAL NAVBAR */}
      <nav style={{ background: '#0f172a', padding: '0 24px', height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '16px' }}>
            🛡️
          </div>
          <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '0.5px' }}>
            INSUR-CARE PORTAL
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('claims')}
            style={{
              background: activeTab === 'claims' ? '#2563eb' : 'transparent',
              color: activeTab === 'claims' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Claims Desk
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            style={{
              background: activeTab === 'customers' ? '#2563eb' : 'transparent',
              color: activeTab === 'customers' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Customer Directory
          </button>
        </div>
      </nav>

      {/* VIEWPORT BODY */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        {activeTab === 'claims' ? (
          <ClaimsSettlementDesk onNavigateToCustomers={() => setActiveTab('customers')} />
        ) : (
          <CustomerRegistry onBack={() => setActiveTab('claims')} />
        )}
      </main>
    </div>
  );
}
 

