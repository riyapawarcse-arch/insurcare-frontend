import React, { useState, useEffect } from 'react';
import API from './api';

const DocumentModal = ({ isOpen, onClose, onDocumentAdded }) => {
  const [formData, setFormData] = useState({
    policy_id: '',
    document_name: '',
    document_type: 'Policy Agreement'
  });
  const [file, setFile] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      API.get('/policies')
        .then((res) => setPolicies(res.data))
        .catch((err) => console.error('Error loading policies for document:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('policy_id', formData.policy_id);
    data.append('document_name', formData.document_name);
    data.append('document_type', formData.document_type);
    if (file) {
      data.append('file', file);
    }

    try {
      await API.post('/documents', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onDocumentAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#1e293b', padding: '30px', borderRadius: '16px',
        width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff', fontFamily: 'Inter, sans-serif'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Upload Document</h3>
        {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Select Policy</label>
            <select name="policy_id" value={formData.policy_id} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }}>
              <option value="">Select a policy</option>
              {policies.map((p) => (
                <option key={p.id} value={p.id}>{p.policy_number} ({p.policy_type})</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Document Name</label>
            <input type="text" name="document_name" value={formData.document_name} onChange={handleChange} required placeholder="e.g. Signed Contract" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Document Type</label>
            <select name="document_type" value={formData.document_type} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }}>
              <option value="Policy Agreement">Policy Agreement</option>
              <option value="ID Proof">ID Proof</option>
              <option value="Claim Evidence">Claim Evidence</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Upload File</label>
            <input type="file" onChange={handleFileChange} required style={{ width: '100%', color: '#94a3b8', fontSize: '13px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ background: '#10b981', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{loading ? 'Uploading...' : 'Upload'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentModal;
