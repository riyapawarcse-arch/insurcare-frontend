import React, { useState } from 'react';

export default function CustomerDirectory({ onBack }) {
  const [selectedCustomer, setSelectedCustomer] = useState({
    name: 'Emily Carter',
    id: 'cust-1',
    email: 'emily.carter@email.com',
    phone: '+1 (555) 012-3456',
    dob: '1992-06-14',
    created: '2026-01-15',
    policies: [
      { id: 'PD-HL-98821', status: 'Active' },
      { id: 'PD-LF-48892', status: 'Active' }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(selectedCustomer);

  const handleSelectCustomer = (cust) => {
    setSelectedCustomer(cust);
    setEditForm(cust);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSelectedCustomer(editForm);
    setIsEditing(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Customer Management Engine</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Register new customer accounts, inspect policies, historical claims, and payment logging.</p>
        </div>
        <button onClick={onBack} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>← Back to Dashboard</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
        {/* Customer List */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#0f172a', margin: '0 0 16px 0' }}>Customer Directory</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              onClick={() => handleSelectCustomer({
                name: 'Emily Carter', id: 'cust-1', email: 'emily.carter@email.com', phone: '+1 (555) 012-3456', dob: '1992-06-14', created: '2026-01-15',
                policies: [{ id: 'PD-HL-98821', status: 'Active' }, { id: 'PD-LF-48892', status: 'Active' }]
              })}
              style={{ padding: '12px', background: selectedCustomer.id === 'cust-1' ? '#f8fafc' : '#fff', border: selectedCustomer.id === 'cust-1' ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>Emily Carter</div>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>cust-1</span>
            </div>

            <div 
              onClick={() => handleSelectCustomer({
                name: 'Marcus Vance', id: 'cust-2', email: 'marcus.vance@email.com', phone: '+1 (555) 987-6543', dob: '1990-04-16', created: '2026-01-16',
                policies: [{ id: 'PD-LF-11223', status: 'Active' }]
              })}
              style={{ padding: '12px', background: selectedCustomer.id === 'cust-2' ? '#f8fafc' : '#fff', border: selectedCustomer.id === 'cust-2' ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>Marcus Vance</div>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>cust-2</span>
            </div>
          </div>
        </div>

        {/* Customer Details Panel / Edit Form */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{selectedCustomer.name}</h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Customer ID: {selectedCustomer.id}</span>
            </div>
            <button 
              onClick={() => { setIsEditing(!isEditing); setEditForm(selectedCustomer); }}
              style={{ background: isEditing ? '#e2e8f0' : '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {!isEditing ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Email Address</span>
                  <strong style={{ color: '#0f172a' }}>{selectedCustomer.email}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Telephone</span>
                  <strong style={{ color: '#0f172a' }}>{selectedCustomer.phone}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Date of Birth</span>
                  <strong style={{ color: '#0f172a' }}>{selectedCustomer.dob}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Account Joined</span>
                  <strong style={{ color: '#0f172a' }}>{selectedCustomer.created}</strong>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 12px 0' }}>Linked Policies ({selectedCustomer.policies.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedCustomer.policies.map(pol => (
                  <div key={pol.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600', color: '#2563eb' }}>{pol.id}</span>
                    <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>{pol.status}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</label>
                <input 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Telephone</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Date of Birth</label>
                <input 
                  type="date" 
                  value={editForm.dob} 
                  onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>Save Changes</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

