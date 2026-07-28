import React, { useState } from 'react';
import API from './api';

const Login = ({ onLoginSuccess }) => {
  const [view, setView] = useState('login'); // 'login', 'register', or 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    new_password: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          password: formData.password
        });
        const token = loginResponse.data.access_token;
        if (token) {
          localStorage.setItem('token', token);
          if (onLoginSuccess) onLoginSuccess(token);
          else window.location.reload();
        }
      } else if (view === 'forgot') {
        await API.post('/auth/forgot-password', {
          email: formData.email,
          new_password: formData.new_password
        });
        setSuccessMsg('Password updated successfully! Please sign in.');
        setTimeout(() => setView('login'), 2000);
      } else {
        const response = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div 
            style={{ 
              display: 'inline-block', 
              padding: '10px 14px', 
              background: '#eff6ff', 
              color: '#2563eb', 
              borderRadius: '12px', 
              fontWeight: '700', 
              fontSize: '14px',
              marginBottom: '14px'
            }}
          >
            🛡️ InsurePro
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
            {view === 'register' && 'Create an Account'}
            {view === 'forgot' && 'Reset Password'}
            {view === 'login' && 'Welcome Back'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            {view === 'register' && 'Enter your details to register for the platform'}
            {view === 'forgot' && 'Enter your email and choose a new password'}
            {view === 'login' && 'Please sign in to access your dashboard'}
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center',
              border: '1px solid #fecaca',
              fontWeight: '500'
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center',
              border: '1px solid #bbf7d0',
              fontWeight: '500'
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
              Email Address
            </label>
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
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#f8fafc'
              }}
            />
          </div>

          {view !== 'forgot' && (
            <div style={{ marginBottom: view === 'login' ? '12px' : '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
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
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#f8fafc'
                }}
              />
            </div>
          )}

          {view === 'forgot' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  backgroundColor: '#f8fafc'
                }}
              />
            </div>
          )}

          {view === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => { setView('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}
          >
            {loading ? 'Processing...' : (
              view === 'register' ? 'Create Account' : view === 'forgot' ? 'Reset Password' : 'Sign In'
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
          {view === 'forgot' ? (
            <button
              onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
            >
              Back to Sign In
            </button>
          ) : (
            <>
              {view === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setView(view === 'register' ? 'login' : 'register'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
              >
                {view === 'register' ? 'Sign In' : 'Register now'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;


