import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';

export default function ClaimDirectory() {
  const { claims, documents } = useContext(AppContext);
  const [selectedClaim, setSelectedClaim] = useState(claims[0]);
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleViewProof = (docName) => {
    const foundDoc = documents.find(d => d.name === docName);
    if (foundDoc) {
      setPreviewDoc(foundDoc);
    } else {
      alert(`Document ${docName} not found in vault.`);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      {/* Left List of Claims */}
      <div style={{ width: '350px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#0f172a' }}>Submitted Claims</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {claims.map(claim => (
            <div
              key={claim.id}
              onClick={() => setSelectedClaim(claim)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: selectedClaim?.id === claim.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: selectedClaim?.id === claim.id ? '#eff6ff' : '#f8fafc',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                <span>{claim.customer}</span>
                <span style={{ fontSize: '12px', color: claim.status === 'Approved' ? '#059669' : '#d97706' }}>{claim.status}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Amount: {claim.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Claim Details Case File */}
      {selectedClaim && (
        <div style={{ flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Claim Settlement Case File</h2>
            <span style={{ background: selectedClaim.status === 'Approved' ? '#ecfdf5' : '#fef3c7', color: selectedClaim.status === 'Approved' ? '#059669' : '#d97706', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
              {selectedClaim.status}
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Incident Description</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>{selectedClaim.description}</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Attached Verification Document (Proof)</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#2563eb' }}>📄 {selectedClaim.document}</span>
              <button 
                onClick={() => handleViewProof(selectedClaim.document)}
                style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                View Proof File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Modal Preview */}
      {previewDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '550px', borderRadius: '12px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Document Preview</h3>
              <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>{previewDoc.category}</span>
            </div>
            
            <div style={{ marginBottom: '16px', fontSize: '13px', color: '#334155', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div><strong>File Name:</strong> {previewDoc.name}</div>
              <div><strong>Owner:</strong> {previewDoc.owner}</div>
              <div><strong>Uploaded Date:</strong> {previewDoc.uploaded}</div>
              <div><strong>Status:</strong> Verified & Audited</div>
            </div>

            {/* Realistic Receipt Content Attachment View */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', fontWeight: '800', fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>METRO DENTAL CARE & SURGERY CLINIC</div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>Official Patient Invoice & Treatment Summary</div>
              
              <div style={{ fontSize: '13px', borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '10px 0', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Emergency Root Canal & Extraction</span>
                  <span>$950.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Prescription Analgesics & Antibiotics</span>
                  <span>$250.00</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>
                <span>Total Amount Paid:</span>
                <span style={{ color: '#059669' }}>$1,200.00</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Download PDF</button>
              <button onClick={() => setPreviewDoc(null)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

