// src/AnalyticsDashboard.jsx
import React from 'react';

export default function AnalyticsDashboard({ onNavigate, currentUser }) {
  // Mock pending actionable work items
  const pendingTasks = [
    {
      id: "TASK-001",
      type: "Claim Review",
      title: "CLM-1001: Aarav Sharma (₹45,000)",
      reason: "High payout volume medical claim pending approval",
      severity: "high",
      targetTab: "claims"
    },
    {
      id: "TASK-002",
      type: "Policy Expiry",
      title: "POL-44102: Dental Family & Care",
      reason: "Policy expired on 2026-02-14 — needs renewal/update",
      severity: "medium",
      targetTab: "policies"
    },
    {
      id: "TASK-003",
      type: "Customer Verification",
      title: "CUST-603: Zenith Retail Corp",
      reason: "0 active policies bound — account unassigned",
      severity: "low",
      targetTab: "customers"
    }
  ];

  // Chart data for monthly payout trend
  const monthlyData = [
    { month: 'Oct', payout: 20000 },
    { month: 'Nov', payout: 35000 },
    { month: 'Dec', payout: 18000 },
    { month: 'Jan', payout: 52000 },
    { month: 'Feb', payout: 45000 }
  ];

  // Maximum scale value for 100% height calculation
  const maxPayout = 60000;
  const maxBarHeightPx = 110; // Max height in pixels

  return (
    <div style={{ color: '#0f172a' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800' }}>
            Executive Analytics Dashboard
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Real-time metric monitoring, policy volume distribution, and actionable task center.
          </p>
        </div>
        <button
          onClick={() => onNavigate('claims')}
          style={{
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.2)'
          }}
        >
          Go to Claims Desk →
        </button>
      </div>

      {/* TOP SUMMARY STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Total Premiums Bound
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>₹86,700</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', fontWeight: '600' }}>↑ 4 Active Policies</div>
        </div>

        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Total Claims Volume
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>₹85,500</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>3 Claims Processed</div>
        </div>

        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Net Loss Ratio
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626' }}>98.6%</div>
          <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', fontWeight: '600' }}>⚠️ High Payout Volume</div>
        </div>

        <div style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Net Underwriting Profit
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#16a34a' }}>₹1,200</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Gross Margin Earned</div>
        </div>
      </div>

      {/* ACTION REQUIRED / PENDING WORK ALERT BOX */}
      <div style={{ background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#92400e' }}>
                Pending Work Center ({pendingTasks.length} Action Items Required)
              </h3>
              <span style={{ fontSize: '12px', color: '#b45309' }}>Review and resolve these pending tasks assigned to operations</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pendingTasks.map((task) => {
            const isHigh = task.severity === 'high';
            const isMed = task.severity === 'medium';
            const badgeBg = isHigh ? '#fef2f2' : isMed ? '#fff7ed' : '#eff6ff';
            const badgeColor = isHigh ? '#dc2626' : isMed ? '#c2410c' : '#2563eb';

            return (
              <div
                key={task.id}
                style={{
                  background: '#fff',
                  border: '1px solid #fef3c7',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', background: badgeBg, color: badgeColor, padding: '3px 8px', borderRadius: '4px', fontWeight: '800', textTransform: 'uppercase' }}>
                      {task.type}
                    </span>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{task.title}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{task.reason}</div>
                </div>

                <button
                  onClick={() => onNavigate(task.targetTab)}
                  style={{
                    background: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Inspect & Update →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* GRAPH 1: MONTHLY CLAIM PAYOUT TREND */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
              Monthly Claims Settlement Payout Trend
            </h3>
            <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>
              INR (₹) Volume
            </span>
          </div>

          {/* BAR CHART WITH FIXED PIXEL HEIGHT CALCULATION */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '150px', borderBottom: '2px solid #cbd5e1', paddingBottom: '0px' }}>
            {monthlyData.map((item) => {
              const barHeightPx = Math.round((item.payout / maxPayout) * maxBarHeightPx);

              return (
                <div key={item.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
                    ₹{(item.payout / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{
                      width: '28px',
                      height: `${barHeightPx}px`,
                      background: item.month === 'Jan' ? '#2563eb' : '#94a3b8',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginTop: '8px' }}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '14px', textAlign: 'center' }}>
            Peak payout recorded in <strong>Jan 2026 (₹52,000)</strong>
          </div>
        </div>

        {/* GRAPH 2: CLAIMS VOLUME BREAKDOWN BY CATEGORY */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
            Claims Breakdown by Insurance Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Health Insurance Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Health Insurance (2 claims)</span>
                <strong style={{ color: '#0f172a' }}>₹57,500 (67%)</strong>
              </div>
              <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '67%', height: '100%', background: '#2563eb', borderRadius: '6px' }} />
              </div>
            </div>

            {/* Motor / Auto Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Motor / Auto (1 claim)</span>
                <strong style={{ color: '#0f172a' }}>₹28,000 (33%)</strong>
              </div>
              <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', background: '#0284c7', borderRadius: '6px' }} />
              </div>
            </div>

            {/* Term Life Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Life & Term Assurance (0 claims)</span>
                <strong style={{ color: '#64748b' }}>₹0 (0%)</strong>
              </div>
              <div style={{ height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '0%', height: '100%', background: '#10b981', borderRadius: '6px' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY LOG */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
          Live System Activity Feed
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>Claim Pending</span>
              <span style={{ fontSize: '13px', color: '#334155' }}>Aarav Sharma submitted ₹45,000 claim</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>10 mins ago</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>Policy Issued</span>
              <span style={{ fontSize: '13px', color: '#334155' }}>Term Life Assurance issued to Rohan Gupta</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 hour ago</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>Claim Approved</span>
              <span style={{ fontSize: '13px', color: '#334155' }}>Priya Verma ₹12,500 payout approved</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>1 day ago</span>
          </div>
        </div>
      </div>

    </div>
  );
}



