import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';

export default function PremiumDirectory({ onBack }) {
  const { customers } = useContext(AppContext);
  const [premiums, setPremiums] = useState([
    { id: 'PRM-01', customer: 'Emily Carter', amount: '$258', status: 'Paid', date: '2026-01-20' },
    { id: 'PRM-02', customer: 'Marcus Vance', amount: '$450', status: 'Paid', date: '2026-02-10' },
    { id: 'PRM-03', customer: 'Sophia Lane', amount: '$320', status: 'Pending', date: '2026-04-10' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCust, setNewCust] = useState('Emily Carter');
  const [newAmount, setNewAmount] = useState('$200');

  const handleAddPremium = (e) => {
    e.preventDefault();
    setPremiums([...premiums, { id: `PRM-0${premiums.length + 1}`, customer: newCust, amount: newAmount, status: 'Paid', date: new Date().toISOString().split('T')[0] }]);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Premium Tracking & Payments</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Monitor payment status, due dates, and transaction records.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowModal(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Record Payment</button>
          <button onClick={onBack} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>← Back to Dashboard</button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 24px' }}>Transaction ID</th>
              <th style={{ padding: '14px 24px' }}>Customer Name</th>
              <th style={{ padding: '14px 24px' }}>Amount</th>
              <th style={{ padding: '14px 24px' }}>Status</th>
              <th style={{ padding: '14px 24px' }}>Date Logged</th>
            </tr>
          </thead>
          <tbody>
            {premiums.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
                <td style={{ padding: '16px 24px', fontWeight: '600', color: '#2563eb' }}>{p.id}</td>
                <td style={{ padding: '16px 24px', color: '#0f172a', fontWeight: '600' }}>{p.customer}</td>
                <td style={{ padding: '16px 24px', color: '#059669', fontWeight: '700' }}>{p.amount}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ background: p.status === 'Paid' ? '#ecfdf5' : '#fef3c7', color: p.status === 'Paid' ? '#059669' : '#d97706', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{p.status}</span>
                </td>
                <td style={{ padding: '16px 24px', color: '#64748b' }}>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={handleAddPayment} style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Record New Premium Payment</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Customer</label>
              <select value={newCust} onChange={(e) => setNewCust(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Amount ($)</label>
              <input type="text" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Save Record</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
