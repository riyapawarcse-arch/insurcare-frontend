import React, { useState } from 'react';
import API from './api';

const Login = ({ onLoginSuccess }) => {
  const [view, setView] = useState('login'); // 'login', 'register', or 'forgot'
  const [loginType, setLoginType] = useState('staff'); // 'staff' or 'customer'
  const [formData, setFormData] = useState({
    email: 'pawarrya428@gmail.com',
    password: '',
    new_password: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const companyStaffList = [
    { name: 'Riya Pawar', email: 'pawarrya428@gmail.com', role: 'Company Staff / Admin' },
    { name: 'Vikram Malhotra', email: 'vikram@safeshield.com', role: 'Corporate Client Admin' },
    { name: 'Ananya Deshmukh', email: 'ananya@safeshield.com', role: 'Support Specialist' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStaffSelect = (e) => {
    const selectedEmail = e.target.value;
    const staff = companyStaffList.find(s => s.email === selectedEmail);
    if (staff) {
      setFormData({
        ...formData,
        email: staff.email,
        password: 'default_staff_password'
      });
    } else {
      setFormData({ ...formData, email: '', password: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (view === 'register') {
        await API.post('/auth/register', {
          email: formData.email,
          password: formData.password
        });
        setSuccessMsg('Account created successfully! Signing you in...');
        const loginResponse = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password,
          type: 'customer'
        });
        const token = loginResponse.data.access_token;
        if (token) {
          localStorage.setItem('token', token);
          if (onLoginSuccess) onLoginSuccess(token);
          else window.location.reload();
        }
      } else {
        const response = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password,
          type: loginType
        });
        const token = response.data.access_token;
        if (token) {
          localStorage.setItem('token', token);
          if (onLoginSuccess) onLoginSuccess(token);
          else window.location.reload();
        } else {
          setErrorMsg('Authorization token missing.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b1329',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', margin: '0 0 6px 0' }}>
            {view === 'register' ? 'Create an Account' : 'Sign In to SafeShield'}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            {view === 'register' ? 'Enter your details to register for the platform' : 'Enter your credentials to access the platform.'}
          </p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid #fecaca' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid #bbf7d0' }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {view === 'login' && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
                Account Type
              </label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'staff') {
                    setLoginType('staff');
                    setFormData({ ...formData, email: 'pawarrya428@gmail.com' });
                  } else {
                    setLoginType('customer');
                    setFormData({ ...formData, email: '' });
                  }
                }}
                value={loginType}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  color: '#111827',
                  fontWeight: '500'
                }}
              >
                <option value="staff">🏢 Company Staff / Admin</option>
                <option value="customer">👤 Customer Account</option>
              </select>
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
              Email Address
            </label>
            {view === 'login' && loginType === 'staff' ? (
              <select
                onChange={handleStaffSelect}
                value={formData.email}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#111827'
                }}
              >
                {companyStaffList.map((staff, idx) => (
                  <option key={idx} value={staff.email}>
                    {staff.email} ({staff.name})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#111827'
                }}
              />
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', letterSpacing: '0.05em', marginBottom: '6px', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#f3f4f6',
                color: '#111827'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
          >
            {loading ? 'Processing...' : (view === 'register' ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
          {view === 'register' ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { setView('register'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '14px', padding: 0 }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;



