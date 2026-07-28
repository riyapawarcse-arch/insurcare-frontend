// src/CustomerRegistry.jsx
import React, { useState } from 'react';

const initialCustomers = [
  { id: "CUST-601", name: "Aarav Sharma", email: "aarav.sharma@gmail.com", phone: "+91 98765 43210", address: "Connaught Place, New Delhi", activePolicies: 2, status: "Active" },
  { id: "CUST-602", name: "Priya Verma", email: "priya.v@gmail.com", phone: "+91 98123 45678", address: "Gachibowli, Hyderabad", activePolicies: 1, status: "Active" },
  { id: "CUST-603", name: "Zenith Retail Corp", email: "admin@zenith.com", phone: "+91 11 4100 2200", address: "BKC, Mumbai", activePolicies: 0, status: "Pending Verification" }
];

export default function CustomerRegistry({ onBack, currentUser }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCust, setNewCust] = useState({ name: "", email: "", phone: "", address: "" });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCust.name || !newCust.email) return;
    const created = {
      id: `CUST-60${customers.length + 1}`,
      ...newCust,
      activePolicies: 0,
      status: "Active"
    };
    setCustomers([created, ...customers]);
    setNewCust({ name: "", email: "", phone: "", address: "" });
    setIsModalOpen(false);
  };

  return (
    <div style={{ color: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800' }}>Customer Directory</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Register, view, and manage customer records and policy bindings.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
          + Register New Customer
        </button>
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search customer by name, ID, or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
        />
      </div>

      {/* CUSTOMER TABLE */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 16px' }}>Customer ID</th>
              <th style={{ padding: '14px 16px' }}>Name</th>
              <th style={{ padding: '14px 16px' }}>Contact Info</th>
              <th style={{ padding: '14px 16px' }}>Active Policies</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(cust => (
              <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: '#2563eb' }}>{cust.id}</td>
                <td style={{ padding: '14px 16px', fontWeight: '700' }}>{cust.name}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>
                  <div>{cust.email}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{cust.phone}</div>
                </td>
                <td style={{ padding: '14px 16px' }}><span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', fontSize: '12px' }}>{cust.activePolicies} Bound</span></td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: cust.status === 'Active' ? '#ecfdf5' : '#fffbebe', color: cust.status === 'Active' ? '#059669' : '#d97706', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '12px' }}>
                    {cust.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REGISTER CUSTOMER MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>Register New Customer</h3>
            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input placeholder="Full Name / Company Name" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
              <input type="email" placeholder="Email Address" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
              <input placeholder="Phone Number" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input placeholder="Address" value={newCust.address} onChange={e => setNewCust({...newCust, address: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


