import React, { useState, useEffect } from 'react';
import API from './api';

const PolicyModal = ({ isOpen, onClose, onPolicyAdded }) => {
  const [formData, setFormData] = useState({
    policy_number: '',
    policy_type: '',
    coverage_amount: '',
    customer_id: ''
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      API.get('/customers')
        .then((res) => setCustomers(res.data))
        .catch((err) => console.error('Error loading customers for policy:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/policies', formData);
      onPolicyAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add policy.');
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
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Create New Policy</h3>
        {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Policy Number</label>
            <input type="text" name="policy_number" value={formData.policy_number} onChange={handleChange} required placeholder="e.g. POL-9988" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Policy Type</label>
            <input type="text" name="policy_type" value={formData.policy_type} onChange={handleChange} required placeholder="e.g. Health, Auto, Life" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Coverage Amount (₹)</label>
            <input type="number" name="coverage_amount" value={formData.coverage_amount} onChange={handleChange} required placeholder="e.g. 500000" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Assign to Customer</label>
            <select name="customer_id" value={formData.customer_id} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }}>
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ background: '#10b981', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{loading ? 'Saving...' : 'Save Policy'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PolicyModal;
