import React from 'react';

export default function PremiumLedger({ onBack }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Premium Collection & Ledger</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Monitor payment status, due dates, and transaction records.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Record Payment</button>
          <button onClick={onBack} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>← Back to Dashboard</button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>No payment records found. Click "+ Record Payment" to add.</p>
      </div>
    </div>
  );
}

