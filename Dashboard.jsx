import React, { useContext } from 'react';
import { AppContext } from './AppContext';

export default function ReportsDashboard({ setCurrentView }) {
  const { customers, claims, setCustomers, setClaims } = useContext(AppContext);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Name,Email,Phone", ...customers.map(c => `${c.id},${c.name},${c.email},${c.phone}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "safeshield_customers_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleResetSeedData = () => {
    if (window.confirm("Reset application data back to default seed state?")) {
      window.location.reload();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Business Reports & Analytics</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Real-time indicators of policies, claim settlement cycles, and premium tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportCSV} style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Export CSV</button>
          <button onClick={handlePrintReport} style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Print Report</button>
          <button onClick={handleResetSeedData} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Reset Seed Data</button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Premium Collected</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>$1,200</div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>Pending: $400</div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Policies</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>4</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Lapsed/Expired: 2</div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Claims Settled</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>{claims.filter(c => c.status === 'Approved').length}</div>
          <div style={{ fontSize: '12px', color: '#d97706', fontWeight: '600' }}>Pending approval: {claims.filter(c => c.status === 'Pending').length}</div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Customers</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>{customers.length}</div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>Healthy Growth rate</div>
        </div>
      </div>

      {/* Live Business Ledger Summary Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>
          Monthly Business Ledger & Expiry Forecasts
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 20px' }}>Customer</th>
              <th style={{ padding: '12px 20px' }}>Type ID</th>
              <th style={{ padding: '12px 20px' }}>Active Policies</th>
              <th style={{ padding: '12px 20px' }}>Action Proof Link</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '14px' }}>
                <td style={{ padding: '14px 20px', fontWeight: '600', color: '#2563eb', cursor: 'pointer' }} onClick={() => setCurrentView('customers')}>
                  {cust.name}
                </td>
                <td style={{ padding: '14px 20px', color: '#64748b' }}>{cust.id}</td>
                <td style={{ padding: '14px 20px', color: '#0f172a', fontWeight: '600' }}>{cust.policies.length} Active</td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => setCurrentView('claims')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: '13px' }}>
                    View Stored Proofs & Receipts
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


