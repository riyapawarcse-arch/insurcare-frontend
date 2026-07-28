// src/ClaimsSettlement.jsx
import React, { useState, useEffect } from 'react';

// ==========================================
// 1. INLINE API MOCK WITH AUDIT LOGS
// ==========================================
const api = {
  getClaims: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
      {
        id: "CLM-1001",
        name: "Aarav Sharma",
        policy: "POL-88219",
        amount: "₹45,000",
        numericAmount: 45000,
        date: "2026-02-10",
        status: "Pending",
        description: "Medical reimbursement for emergency hospitalization at Max Healthcare.",
        document: "Hospital_Bill_Receipt.pdf",
        history: [
          {
            id: "log-101",
            timestamp: "2026-02-10 10:15 AM",
            actor: "Aarav Sharma (Customer)",
            action: "CREATED",
            details: "Submitted claim application with initial hospital bill proof."
          }
        ],
        receiptDetails: {
          vendor: "Max Healthcare Ltd",
          invoiceNo: "INV-9921",
          date: "2026-02-09",
          items: [
            { desc: "Emergency Room Consultation", cost: "₹5,000" },
            { desc: "Lab Tests & Diagnostics", cost: "₹15,000" },
            { desc: "Inpatient Room Charge (2 Days)", cost: "₹25,000" }
          ]
        }
      },
      {
        id: "CLM-1002",
        name: "Priya Verma",
        policy: "POL-44102",
        amount: "₹12,500",
        numericAmount: 12500,
        date: "2026-02-08",
        status: "Approved",
        description: "Dental surgery and root canal treatment charges.",
        document: "Dental_Clinic_Invoice.pdf",
        history: [
          {
            id: "log-102",
            timestamp: "2026-02-08 11:30 AM",
            actor: "Priya Verma (Customer)",
            action: "CREATED",
            details: "Submitted claim application."
          },
          {
            id: "log-103",
            timestamp: "2026-02-09 02:45 PM",
            actor: "Claims Officer",
            action: "APPROVED",
            details: "Verified invoice and approved payout of ₹12,500."
          }
        ],
        receiptDetails: {
          vendor: "SmileCare Dental Clinic",
          invoiceNo: "INV-4412",
          date: "2026-02-07",
          items: [
            { desc: "Root Canal Procedure", cost: "₹9,000" },
            { desc: "Prescription Medication & X-Ray", cost: "₹3,500" }
          ]
        }
      }
    ];
  },
  updateClaimStatus: async (claimId, status) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, claimId, status };
  },
  addClaim: async (newClaim) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { ...newClaim, id: `CLM-${Math.floor(1000 + Math.random() * 9000)}` };
  }
};

// Helpers
const parseAmount = (amtStr) => {
  if (typeof amtStr === 'number') return amtStr;
  if (!amtStr) return 0;
  const cleaned = amtStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
};

const formatINR = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function ClaimsSettlement({ onBack }) {
  const [claimsList, setClaimsList] = useState([]);
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    policy: '',
    amount: '',
    description: '',
    document: ''
  });

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getClaims();
      const records = Array.isArray(data) ? data : [];
      setClaimsList(records);
      
      if (records.length > 0) {
        setSelectedClaimId(records[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch claims.');
    } finally {
      setLoading(false);
    }
  };

  const getClaimId = (claim) => claim?.id || claim?.claim_id;

  // Filter Logic
  const filteredClaims = claimsList.filter((claim) => {
    const matchesSearch =
      claim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.policy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'All' || claim.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedClaim =
    claimsList.find((c) => getClaimId(c) === selectedClaimId) || filteredClaims[0];

  // Dynamic Metrics
  const totalClaimsCount = claimsList.length;
  const pendingAmountTotal = claimsList
    .filter((c) => c.status === 'Pending')
    .reduce((sum, c) => sum + parseAmount(c.amount), 0);
  const approvedCount = claimsList.filter((c) => c.status === 'Approved').length;
  const rejectedCount = claimsList.filter((c) => c.status === 'Rejected').length;
  const resolvedTotal = approvedCount + rejectedCount;
  const approvalRatePercent = resolvedTotal > 0
    ? Math.round((approvedCount / resolvedTotal) * 100)
    : 0;

  // Handle Status Change with Audit Log Injection
  const handleStatusChange = async (newStatus) => {
    if (!selectedClaim) return;
    const currentId = getClaimId(selectedClaim);
    const nowStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    const newAuditEntry = {
      id: `log-${Date.now()}`,
      timestamp: nowStr,
      actor: "Claims Officer",
      action: newStatus.toUpperCase(),
      details: newStatus === 'Approved'
        ? `Verified billing documents and approved full payout of ${selectedClaim.amount}.`
        : `Claim application rejected after verification review.`
    };

    try {
      await api.updateClaimStatus(currentId, newStatus);
      setClaimsList((prev) =>
        prev.map((c) =>
          getClaimId(c) === currentId 
            ? { 
                ...c, 
                status: newStatus,
                history: [newAuditEntry, ...(c.history || [])] 
              } 
            : c
        )
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Handle Claim Submission with Initial Audit Log
  const handleCreateClaim = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.policy || !formData.amount) {
      alert('Please fill in all required fields.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const rawVal = parseAmount(formData.amount);
    const formattedAmount = formatINR(rawVal);
    const nowStr = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

    const newClaimPayload = {
      name: formData.name,
      policy: formData.policy,
      amount: formattedAmount,
      date: today,
      status: 'Pending',
      description: formData.description || 'No description provided.',
      document: formData.document || 'Submitted_Proof.pdf',
      history: [
        {
          id: `log-${Date.now()}`,
          timestamp: nowStr,
          actor: `${formData.name} (Applicant)`,
          action: 'CREATED',
          details: 'Claim application submitted via customer portal.'
        }
      ],
      receiptDetails: {
        vendor: 'General Provider',
        invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        date: today,
        items: [{ desc: formData.description || 'Claim Reimbursement', cost: formattedAmount }]
      }
    };

    try {
      const created = await api.addClaim(newClaimPayload);
      setClaimsList((prev) => [created, ...prev]);
      setSelectedClaimId(created.id);
      setIsSubmitModalOpen(false);
      setFormData({ name: '', policy: '', amount: '', description: '', document: '' });
    } catch (err) {
      alert('Failed to submit claim.');
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Approved':
        return { background: '#ecfdf5', color: '#059669' };
      case 'Rejected':
        return { background: '#fef2f2', color: '#dc2626' };
      default:
        return { background: '#fef3c7', color: '#d97706' };
    }
  };

  const handlePrint = () => {
    const items = selectedClaim?.receiptDetails?.items || [];
    if (items.length === 0) {
      alert('No itemized receipt details available to print.');
      return;
    }

    const printWindow = window.open('', '_blank');
    const itemsHtml = items
      .map(
        (item) =>
          `<tr><td style="padding: 8px 0; border-bottom: 1px dashed #ccc;">${item.desc || 'Item'}</td><td style="text-align: right; font-weight: bold; padding: 8px 0; border-bottom: 1px dashed #ccc;">${item.cost || '₹0'}</td></tr>`
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt_${selectedClaim.receiptDetails?.invoiceNo || 'N/A'}</title>
          <style>
            body { font-family: monospace; padding: 20px; color: #1e293b; }
            h2 { font-family: sans-serif; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; font-family: sans-serif; border-bottom: 2px solid #000; padding-bottom: 6px; }
            .total { font-weight: bold; font-size: 16px; border-top: 2px solid #000; padding-top: 10px; margin-top: 20px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <h2>${selectedClaim.receiptDetails?.vendor || 'Vendor Receipt'}</h2>
          <p>Invoice #: ${selectedClaim.receiptDetails?.invoiceNo || 'N/A'} | Date: ${selectedClaim.receiptDetails?.date || selectedClaim.date || 'N/A'}</p>
          <hr />
          <p><strong>Applicant:</strong> ${selectedClaim.name} (${selectedClaim.policy})</p>
          <table>
            <thead>
              <tr><th>Description</th><th style="text-align: right;">Amount</th></tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="total">
            <span>TOTAL PAID:</span>
            <span>${selectedClaim.amount}</span>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadReport = () => {
    if (!selectedClaim) return;

    const itemsText = selectedClaim.receiptDetails?.items?.length
      ? selectedClaim.receiptDetails.items.map((item) => `- ${item.desc}: ${item.cost}`).join('\n')
      : 'No itemized receipt details available.';

    const historyText = selectedClaim.history?.length
      ? selectedClaim.history.map((h) => `[${h.timestamp}] ${h.actor} (${h.action}): ${h.details}`).join('\n')
      : 'No history logs recorded.';

    const content = `====================================================
CLAIM & RECEIPT AUDIT REPORT
====================================================
Applicant Name : ${selectedClaim.name}
Policy ID      : ${selectedClaim.policy}
Submission Date: ${selectedClaim.date}
Status         : ${selectedClaim.status}
Requested Payout: ${selectedClaim.amount}

AUDIT TRAIL LOGS
----------------------------------------------------
${historyText}

VENDOR RECEIPT BREAKDOWN
----------------------------------------------------
Vendor Name    : ${selectedClaim.receiptDetails?.vendor || 'N/A'}
Invoice Number : ${selectedClaim.receiptDetails?.invoiceNo || 'N/A'}
Invoice Date   : ${selectedClaim.receiptDetails?.date || 'N/A'}

ITEMS LIST:
${itemsText}

TOTAL AMOUNT PAID: ${selectedClaim.amount}
====================================================`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Claim_Summary_${getClaimId(selectedClaim)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>Loading claim records...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif', color: '#dc2626' }}>
        <h3>Failed to load claims</h3>
        <p>{error}</p>
        <button onClick={loadClaims} style={{ padding: '8px 14px', cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      {/* Top Header */}
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
          {onBack && (
            <button
              onClick={onBack}
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* METRICS OVERVIEW CARDS */}
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
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '6px', fontSize: '14px' }}>⏳</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#d97706' }}>{formatINR(pendingAmountTotal)}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Awaiting officer resolution</div>
        </div>

        <div style={{ background: '#fff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Approval Settlement Rate</span>
            <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '14px' }}>✅</span>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#059669' }}>{approvalRatePercent}%</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{approvedCount} approved / {resolvedTotal} resolved</div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Left Column: List + Search + Filters */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Search by name or policy ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '12px', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? '#0f172a' : '#f1f5f9',
                    color: isActive ? '#fff' : '#64748b'
                  }}
                >
                  {status}
                </button>
              );
            })}
          </div>

          <h3 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 12px 0' }}>
            Submitted Claims ({filteredClaims.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredClaims.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '20px 0' }}>
                No matching claims found.
              </p>
            ) : (
              filteredClaims.map((claim) => {
                const claimId = getClaimId(claim);
                const isSelected = claimId === getClaimId(selectedClaim);
                const badgeStyle = getStatusBadgeStyle(claim.status);

                return (
                  <div
                    key={claimId}
                    onClick={() => setSelectedClaimId(claimId)}
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
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{claim.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {claim.policy} • {claim.amount}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        background: badgeStyle.background,
                        color: badgeStyle.color,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: '700'
                      }}
                    >
                      {claim.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case File Details */}
        {selectedClaim ? (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', color: '#0f172a', margin: 0 }}>Claim Case File ({selectedClaim.id})</h3>
              <span style={{ fontSize: '12px', ...getStatusBadgeStyle(selectedClaim.status), padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
                {selectedClaim.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Customer Applicant</span>
                <strong style={{ color: '#0f172a' }}>{selectedClaim.name}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Requested Payout</span>
                <strong style={{ color: '#059669' }}>{selectedClaim.amount}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Submission Date</span>
                <strong style={{ color: '#0f172a' }}>{selectedClaim.date}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Policy ID</span>
                <strong style={{ color: '#2563eb' }}>{selectedClaim.policy}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '13px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Incident Description</span>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#334155' }}>
                {selectedClaim.description}
              </div>
            </div>

            <div style={{ fontSize: '13px', marginBottom: '20px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Verification Proof</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#2563eb', fontWeight: '600' }}>📄 {selectedClaim.document || 'Document.pdf'}</span>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  style={{ background: '#2563eb', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  View Proof File
                </button>
              </div>
            </div>

            {/* AUDIT TRAIL / HISTORY TIMELINE */}
            <div style={{ marginBottom: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700' }}>
                Audit Trail & History Log
              </span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                {(selectedClaim.history || []).map((log) => (
                  <div key={log.id} style={{ background: '#f8fafc', borderLeft: '3px solid #2563eb', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <strong style={{ color: '#0f172a' }}>{log.actor}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '10px' }}>{log.timestamp}</span>
                    </div>
                    <div style={{ color: '#475569' }}>{log.details}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Process Resolution:</span>
              {selectedClaim.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleStatusChange('Rejected')}
                    style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => handleStatusChange('Approved')}
                    style={{ background: '#10b981', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Approve Payout
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>
                  Case Closed ({selectedClaim.status})
                </span>
              )}
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Select a claim from the list to view case details.
          </div>
        )}
      </div>

      {/* Modal 1: Document Preview */}
      {isPreviewOpen && selectedClaim && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '600px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Document Preview</h3>
              <button onClick={() => setIsPreviewOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', fontFamily: 'monospace', marginBottom: '16px' }}>
              <p><strong>Vendor:</strong> {selectedClaim.receiptDetails?.vendor || 'Vendor Receipt'}</p>
              <p><strong>Invoice No:</strong> {selectedClaim.receiptDetails?.invoiceNo || 'N/A'}</p>
              <p><strong>Applicant:</strong> {selectedClaim.name} ({selectedClaim.policy})</p>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '10px' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#059669' }}>{selectedClaim.amount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handlePrint} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>🖨️ Print</button>
                <button onClick={handleDownloadReport} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>📥 Report</button>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Submit New Claim Form */}
      {isSubmitModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '500px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Submit New Coverage Claim</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateClaim} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Applicant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Policy ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. POL-99301"
                    value={formData.policy}
                    onChange={(e) => setFormData({ ...formData, policy: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Claim Amount *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 18000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Incident Description</label>
                <textarea
                  rows="3"
                  placeholder="Briefly describe the medical/incident expense..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>Document Name / File</label>
                <input
                  type="text"
                  placeholder="e.g. Max_Hospital_Receipt.pdf"
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
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
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}






