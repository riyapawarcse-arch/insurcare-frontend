import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';

export default function DocumentDirectory({ onBack }) {
  const { documents = [
    { id: 'DOC-101', name: 'Policy_Agreement_PD-HL.pdf', type: 'PDF', date: '2026-01-15', size: '2.4 MB', content: 'Sample text preview for Policy Agreement PDF document content.' },
    { id: 'DOC-102', name: 'Identity_Verification_Emily.jpg', type: 'Image', date: '2026-01-15', size: '1.1 MB', content: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { id: 'DOC-103', name: 'Claim_Statement_CLM-01.pdf', type: 'PDF', date: '2026-01-22', size: '840 KB', content: 'Sample text preview for Claim Statement document content.' }
  ] } = useContext(AppContext) || {};

  const [activeDoc, setActiveDoc] = useState(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Document Vault</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Secure repository for client identification, signed contracts, and claim forms.</p>
        </div>
        <button onClick={onBack} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>← Back to Dashboard</button>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Document List */}
        <div style={{ flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', minHeight: 'calc(100vh - 220px)' }}>
          <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '16px' }}>Uploaded Files & Documents</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents && documents.length > 0 ? (
              documents.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => setActiveDoc(doc)}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px', 
                    background: activeDoc?.id === doc.id ? '#eff6ff' : '#f8fafc', 
                    border: activeDoc?.id === doc.id ? '2px solid #2563eb' : '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{doc.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Uploaded on {doc.date} • Size: {doc.size}</div>
                  </div>
                  <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>{doc.type}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px', fontSize: '14px' }}>No documents found in the vault.</div>
            )}
          </div>
        </div>

        {/* Document Preview Panel */}
        {activeDoc && (
          <div style={{ width: '420px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', color: '#0f172a', margin: 0 }}>File Preview</h3>
              <button onClick={() => setActiveDoc(null)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>FILE NAME</div>
              <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600', marginTop: '2px' }}>{activeDoc.name}</div>
            </div>

            <div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {activeDoc.type === 'Image' ? (
                <img src={activeDoc.content} alt={activeDoc.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} />
              ) : (
                <div style={{ color: '#334155', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                  <div style={{ fontWeight: '700', marginBottom: '8px' }}>{activeDoc.name}</div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{activeDoc.content}</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => alert(`Downloading ${activeDoc.name}...`)}
                style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                Download File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

