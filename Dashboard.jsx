import React, { useContext } from 'react';
import { AppContext } from './AppContext';
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
} from 'recharts';

export default function ReportsDashboard({ setCurrentView }) {
  const { customers, claims, setCustomers, setClaims } = useContext(AppContext);

  // Sample or derived chart data matching your project metrics
  const revenueData = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 41000 },
    { month: 'Mar', revenue: 38000 },
    { month: 'Apr', revenue: 52000 },
    { month: 'May', revenue: 49000 },
    { month: 'Jun', revenue: 75000 },
  ];

  const customerGrowthData = [
    { month: 'Jan', customers: Math.max(1, customers.length - 5) },
    { month: 'Feb', customers: Math.max(2, customers.length - 4) },
    { month: 'Mar', customers: Math.max(2, customers.length - 3) },
    { month: 'Apr', customers: Math.max(3, customers.length - 2) },
    { month: 'May', customers: Math.max(3, customers.length - 1) },
    { month: 'Jun', customers: customers.length },
  ];

  const policyDistributionData = [
    { name: 'Health', value: 45 },
    { name: 'Motor', value: 30 },
    { name: 'Life', value: 15 },
    { name: 'Travel', value: 10 },
  ];

  const approvedClaimsCount = claims.filter(c => c.status === 'Approved').length;
  const pendingClaimsCount = claims.filter(c => c.status === 'Pending').length;
  const rejectedClaimsCount = claims.filter(c => c.status === 'Rejected').length || 2;

  const claimsStatusData = [
    { name: 'Approved', value: approvedClaimsCount || 4 },
    { name: 'Pending', value: pendingClaimsCount || 2 },
    { name: 'Rejected', value: rejectedClaimsCount },
  ];

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
  const CLAIMS_COLORS = ['#16a34a', '#f59e0b', '#dc2626'];

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
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>{approvedClaimsCount}</div>
          <div style={{ fontSize: '12px', color: '#d97706', fontWeight: '600' }}>Pending approval: {pendingClaimsCount}</div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Customers</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>{customers.length}</div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>Healthy Growth rate</div>
        </div>
      </div>

      {/* CHARTS GRID SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* 1. Revenue Trend (Line Chart) */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' }}>Monthly Revenue Trend</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Historical revenue growth cycle</p>
          <div style={{ width: '100%', height: '260px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Customer Growth (Bar Chart) */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' }}>Customer Growth</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Active user acquisition over time</p>
          <div style={{ width: '100%', height: '260px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
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
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' }}>Policy Distribution</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0px }}>Breakdown across insurance categories</p>
          <div style={{ width: '100%', height: '260px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={policyDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' }}>Claims Status</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Distribution of approved, pending, & rejected claims</p>
          <div style={{ width: '100%', height: '260px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={claimsStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
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



