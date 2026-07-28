import React, { useState, useEffect } from 'react';
import API from './api';

const PremiumModal = ({ isOpen, onClose, onPaymentAdded }) => {
  const [formData, setFormData] = useState({
    policy_id: '',
    payment_date: '',
    amount: '',
    payment_status: 'Paid'
  });
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      API.get('/policies')
        .then((res) => setPolicies(res.data))
        .catch((err) => console.error('Error loading policies for payment:', err));
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
      await API.post('/premiums', formData);
      onPaymentAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to record payment.');
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
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Record Premium Payment</h3>
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
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Payment Date</label>
            <input type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Amount ($)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required placeholder="e.g. 1200" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#94a3b8' }}>Payment Status</label>
            <select name="payment_status" value={formData.payment_status} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: '#fff', boxSizing: 'border-box' }}>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ background: '#8b5cf6', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>{loading ? 'Saving...' : 'Save Payment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PremiumModal;
