import React from 'react';

export default function PolicyDirectory({ onBack }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Policy Registry</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Browse, filter, and track policy types and coverage lifecycle terms.</p>
        </div>
        <button onClick={onBack} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>← Back to Dashboard</button>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ paddingBottom: '10px' }}>Policy ID</th>
              <th style={{ paddingBottom: '10px' }}>Category</th>
              <th style={{ paddingBottom: '10px' }}>Holder Name</th>
              <th style={{ paddingBottom: '10px' }}>Premium</th>
              <th style={{ paddingBottom: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 0', fontWeight: '600', color: '#2563eb' }}>PD-HL-98821</td>
              <td style={{ padding: '12px 0' }}>Health Insurance</td>
              <td style={{ padding: '12px 0' }}>Emily Carter</td>
              <td style={{ padding: '12px 0', fontWeight: '700' }}>₹20,500</td>
              <td style={{ padding: '12px 0' }}><span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px' }}>Active</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 0', fontWeight: '600', color: '#2563eb' }}>PD-LF-48892</td>
              <td style={{ padding: '12px 0' }}>Life Insurance</td>
              <td style={{ padding: '12px 0' }}>Emily Carter</td>
              <td style={{ padding: '12px 0', fontWeight: '700' }}>₹15,400</td>
              <td style={{ padding: '12px 0' }}><span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px' }}>Active</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 0', fontWeight: '600', color: '#2563eb' }}>PD-LF-11223</td>
              <td style={{ padding: '12px 0' }}>Auto Insurance</td>
              <td style={{ padding: '12px 0' }}>Marcus Vance</td>
              <td style={{ padding: '12px 0', fontWeight: '700' }}>₹12,200</td>
              <td style={{ padding: '12px 0' }}><span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px' }}>Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
