import React, { useContext } from 'react';
import { AppContext } from './AppContext';

export default function SidebarLayout({ currentView, setCurrentView, children }) {
  const { simulatedUser, setSimulatedUser } = useContext(AppContext);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Left Sidebar Navigation */}
      <div style={{ width: '260px', background: '#0f172a', color: '#94a3b8', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛡️ SafeShield Corp
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>POLICY LEDGER PLATFORM</div>
        </div>

        <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: '700', padding: '8px 12px', color: '#64748b', textTransform: 'uppercase' }}>Main Menu</div>
          
          {[
            { id: 'dashboard', label: 'Reports Dashboard', icon: '📊' },
            { id: 'customers', label: 'Customer Directory', icon: '👥' },
            { id: 'policies', label: 'Policy Registry', icon: '📋' },
            { id: 'claims', label: 'Claims Settlement', icon: '⚖️' },
            { id: 'premiums', label: 'Premium Ledger', icon: '💳' },
            { id: 'documents', label: 'Document Vault', icon: '📁' },
          ].map(item => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: 'flex',
                  alignItem: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  background: active ? '#1e293b' : 'transparent',
                  color: active ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            );
          })}
        </div>

        {/* Footer Status */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '600' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> DATABASE ONLINE
          </div>
          <div style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>Active policies: 4 | Claims settled: 1</div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Top Header Bar with Role Switcher */}
        <div style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Insurance Management Platform</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Simulated Role:</span>
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '6px', gap: '4px' }}>
              <button 
                onClick={() => setSimulatedUser('Sarah Connor (Administrator)')}
                style={{ background: simulatedUser?.includes('Sarah') ? '#0f172a' : 'transparent', color: simulatedUser?.includes('Sarah') ? '#fff' : '#475569', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
              >
                Sarah Connor (Administrator)
              </button>
              <button 
                onClick={() => setSimulatedUser('Marcus Vance (Agent)')}
                style={{ background: simulatedUser?.includes('Marcus') ? '#0f172a' : 'transparent', color: simulatedUser?.includes('Marcus') ? '#fff' : '#475569', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
              >
                Marcus Vance (Agent)
              </button>
            </div>
          </div>
        </div>

        {/* View Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </div>
      </div>

    </div>
  );
}

