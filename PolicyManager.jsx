// src/PolicyManager.jsx
import React, { useState } from 'react';

const initialPolicies = [
  { id: "POL-88219", type: "Health Supreme Comprehensive", customer: "Aarav Sharma", premium: "₹24,000 / yr", startDate: "2025-03-01", endDate: "2026-03-01", status: "Active" },
  { id: "POL-44102", type: "Dental Family & Care", customer: "Priya Verma", premium: "₹12,500 / yr", startDate: "2025-02-14", endDate: "2026-02-14", status: "Expired" },
  { id: "POL-11928", type: "Commercial Fleet Shield", customer: "Zenith Retail Corp", premium: "₹50,200 / yr", startDate: "2025-06-10", endDate: "2026-06-10", status: "Active" }
];

export default function PolicyManager({ onBack, currentUser }) {
  const [policies, setPolicies] = useState(initialPolicies);

  const handleRenew = (id) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, status: 'Active', endDate: '2027-02-14' } : p));
  };

  return (
    <div style={{ color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800' }}>Policy Administration</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Issue, renew, and inspect coverage policies across client accounts.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {policies.map(pol => (
          <div key={pol.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '800', background: pol.status === 'Active' ? '#ecfdf5' : '#fef2f2', color: pol.status === 'Active' ? '#059669' : '#dc2626' }}>
              {pol.status}
            </span>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>{pol.id}</div>
            <h3 style={{ margin: '6px 0 12px 0', fontSize: '16px' }}>{pol.type}</h3>
            
            <div style={{ fontSize: '13px', color: '#334155', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Holder:</strong> {pol.customer}</div>
              <div><strong>Premium:</strong> <span style={{ color: '#2563eb', fontWeight: '700' }}>{pol.premium}</span></div>
              <div><strong>Valid Until:</strong> {pol.endDate}</div>
            </div>

            {pol.status === 'Expired' && (
              <button onClick={() => handleRenew(pol.id)} style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
                Renew Policy →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

