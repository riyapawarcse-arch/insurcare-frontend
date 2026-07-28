import React, { useState, useEffect } from 'react';

// Mock baseline customer dataset with Indian Rupee amounts
const INITIAL_CUSTOMERS = [
  { id: 'cust-1', name: 'Emily Carter', email: 'emily.carter@email.com', policies: 2, status: 'Active', docText: 'View Stored Passport & Receipts' },
  { id: 'cust-2', name: 'Marcus Vance', email: 'marcus.vance@email.com', policies: 1, status: 'Active', docText: 'View Stored Records' },
  { id: 'cust-3', name: 'Sophia Lane', email: 'sophia.lane@email.com', policies: 1, status: 'Active', docText: 'View Claim Proofs & Invoices' }
];

const CUSTOMER_DOCUMENTS = {
  'Emily Carter': [
    { title: 'Passport_Copy_Emily_Carter.pdf', type: 'Identification', date: '2026-01-10', size: '2.4 MB' },
    { title: 'Premium_Payment_Receipt_HL88821.pdf', type: 'Payment Receipt', date: '2026-02-15', size: '410 KB' }
  ],
  'Marcus Vance': [
    { title: 'Driver_License_Marcus_Vance.pdf', type: 'Identification', date: '2026-01-16', size: '1.8 MB' }
  ],
  'Sophia Lane': [
    { title: 'Medical_Dental_Invoice_May2026.pdf', type: 'Claim Proof', date: '2026-05-10', size: '890 KB' }
  ]
};

export default function ReportsDashboard() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);

  // Synchronize dynamically added customer accounts from local storage
  useEffect(() => {
    const saved = localStorage.getItem('safeshield_customers');
    if (saved) {
      const dynamicEmails = JSON.parse(saved);
      const existingEmails = new Set(INITIAL_CUSTOMERS.map(c => c.email.toLowerCase()));

      const dynamicList = dynamicEmails
        .filter(email => !existingEmails.has(email.toLowerCase()))
        .map((email, index) => ({
          id: `cust-${INITIAL_CUSTOMERS.length + index + 1}`,
          name: email.split('@')[0].replace('.', ' '),
          email: email,
          policies: 1,
          status: 'Active',
          docText: 'View Verification Records'
        }));

      setCustomers([...INITIAL_CUSTOMERS, ...dynamicList]);
    }
  }, []);

  const handleOpenDocs = (customerName) => {
    setSelectedCustomer(customerName);
    const docs = CUSTOMER_DOCUMENTS[customerName] || [
      { title: `${customerName.replace(' ', '_')}_Verification.pdf`, type: 'Identification', date: '2026-06-01', size: '1.2 MB' }
    ];
    setActiveDoc(docs[0]);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#0f172a' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' }}>Business Reports & Analytics</h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Real-time indicators of policies, claim settlement units, and premium tracking.
        </p>
      </div>

      {/* Main Grid: Left Side Panel & Right Analytics Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* --- LEFT HAND SIDE: TOTAL CUSTOMERS & SCROLLABLE DIRECTORY --- */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '620px' }}>
          
          <div style={{ paddingBottom: '14px', borderBottom: '1px solid #f1f5f9', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Free Trial Plan</span>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Total Customers</h2>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#2563eb', background: '#eff6ff', padding: '2px 10px', borderRadius: '12px' }}>{customers.length}</span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>Live roster of registered policy holders.</p>
          </div>

          {/* Auto-Scrollable Customer List Container */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {customers.map((cust) => (
              <div 
                key={cust.id} 
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a', textTransform: 'capitalize' }}>{cust.name}</strong>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#059669', background: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>{cust.status}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>{cust.email}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>🆔 {cust.id}</span>
                  <span style={{ color: '#2563eb', fontWeight: '700' }}>{cust.policies} Policy(s)</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* --- RIGHT HAND SIDE: ANALYTICS, CHARTS & LEDGER --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Metric Cards with Indian Rupee (₹) Symbol */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>PREMIUM COLLECTED</div>
              <div style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0' }}>₹1,20,000</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '600' }}>Pending: ₹40,000</div>
            </div>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>ACTIVE POLICIES</div>
              <div style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0' }}>4</div>
              <div style={{ fontSize: '11px', color: '#e11d48', fontWeight: '600' }}>Expired: 2</div>
            </div>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>CLAIMS SETTLED</div>
              <div style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0' }}>₹85,000</div>
              <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '600' }}>Pending: ₹25,000</div>
            </div>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>TOTAL CUSTOMERS</div>
              <div style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0' }}>{customers.length}</div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>Active System Growth</div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '16px' }}>
            
            {/* Donut Chart */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>Policy Distribution</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                  <svg width="100" height="100" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0284c7" strokeWidth="6" strokeDasharray="33 67" strokeDashoffset="25"></circle>
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#059669" strokeWidth="6" strokeDasharray="33 67" strokeDashoffset="92"></circle>
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="6" strokeDasharray="34 66" strokeDashoffset="59"></circle>
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>6</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Health Insurance</span>
                    <strong>2 (33%)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Life Insurance</span>
                    <strong>2 (33%)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Auto Insurance</span>
                    <strong>2 (33%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>Customer Growth Trend</h3>
              <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px', position: 'relative' }}>
                <svg style={{ position: 'absolute', top: 10, left: 0, width: '100%', height: '70px', pointerEvents: 'none' }}>
                  <path d="M 20,60 L 60,45 L 100,50 L 140,25 L 180,35 L 220,10" fill="none" stroke="#2563eb" strokeWidth="2" />
                </svg>

                {[
                  { month: 'Jan', val: 1 },
                  { month: 'Feb', val: 2 },
                  { month: 'Mar', val: 2 },
                  { month: 'Apr', val: 4 },
                  { month: 'May', val: 3 },
                  { month: 'Jun', val: customers.length }
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                    <span style={{ fontSize: '9px', background: '#dbeafe', color: '#1e40af', padding: '1px 5px', borderRadius: '8px', fontWeight: '700' }}>{pt.val}</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', border: '2px solid #fff', marginTop: '4px' }}></span>
                    <span style={{ fontSize: '10px', color: '#64748b', marginTop: '8px' }}>{pt.month}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Monthly Business Ledger Table */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700' }}>Monthly Business Ledger & Expiry Forecasts</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>Chronological transaction collections and upcoming policy expires list.</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', textTransform: 'uppercase', fontSize: '10px' }}>
                  <th style={{ padding: '10px 6px' }}>Customer</th>
                  <th style={{ padding: '10px 6px' }}>Type ID</th>
                  <th style={{ padding: '10px 6px' }}>Active Policies</th>
                  <th style={{ padding: '10px 6px' }}>Action Proof Link</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust) => (
                  <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 6px', fontWeight: '700', color: '#2563eb' }}>{cust.name}</td>
                    <td style={{ padding: '12px 6px', color: '#64748b' }}>{cust.id}</td>
                    <td style={{ padding: '12px 6px', fontWeight: '600' }}>{cust.policies} Active</td>
                    <td style={{ padding: '12px 6px' }}>
                      <button
                        onClick={() => handleOpenDocs(cust.name)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', fontSize: '12px', padding: 0 }}
                      >
                        📂 {cust.docText || 'View Stored Records'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* --- FUNCTIONAL DOCUMENT VIEW MODAL --- */}
      {selectedCustomer && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '700px', maxHeight: '80vh', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Verification Vault: {selectedCustomer}</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>Stored passports, receipts, and claim attachments</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: '800' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '16px', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '220px', borderRight: '1px solid #e2e8f0', paddingRight: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Documents</span>
                {(CUSTOMER_DOCUMENTS[selectedCustomer] || [{ title: `${selectedCustomer.replace(' ', '_')}_Verification.pdf`, type: 'Identification', size: '1.2 MB' }]).map((doc, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveDoc(doc)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: activeDoc?.title === doc.title ? '#eff6ff' : '#f8fafc',
                      border: activeDoc?.title === doc.title ? '1px solid #3b82f6' : '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📄 {doc.title}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>{doc.type} • {doc.size}</div>
                  </div>
                ))}
              </div>

              <div style={{ flex: 1, background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {activeDoc && (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '6px', padding: '16px', boxSizing: 'border-box' }}>
                    <div style={{ fontSize: '40px', marginBottom: '8px' }}>📜</div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700' }}>{activeDoc.title}</h4>
                    <button onClick={() => alert(`Downloading ${activeDoc.title}...`)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', marginTop: '12px' }}>
                      ⬇️ Download File
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}


