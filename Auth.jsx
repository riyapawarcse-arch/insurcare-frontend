import React, { useState, useEffect } from 'react';

// Primary Admin Email (handles minor typos/variations smoothly)
const PRIMARY_ADMIN_EMAIL = 'pawariya428@gmail.com';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('pawariya428@gmail.com');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Dynamic Customer Storage
  const [registeredCustomers, setRegisteredCustomers] = useState([
    'emily.carter@email.com',
    'marcus.vance@email.com'
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('safeshield_customers');
    if (saved) {
      setRegisteredCustomers(JSON.parse(saved));
    }
  }, []);

  // Helper check for admin identity
  const isAdminEmail = (inputEmail) => {
    const clean = inputEmail.trim().toLowerCase();
    return clean === PRIMARY_ADMIN_EMAIL || clean === 'pawarriya428@gmail.com';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const formattedEmail = email.trim().toLowerCase();

    if (!formattedEmail || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (isLogin) {
      // --- ADMIN LOGIN ---
      if (role === 'admin') {
        if (!isAdminEmail(formattedEmail)) {
          setErrorMsg(`Access Denied: ${formattedEmail} is not authorized as an Admin.`);
          return;
        }
        // Admin log in successful
        onLogin({ email: PRIMARY_ADMIN_EMAIL, role: 'admin' });
        return;
      }

      // --- CUSTOMER LOGIN ---
      if (role === 'customer') {
        if (isAdminEmail(formattedEmail)) {
          setErrorMsg('This is a Company Admin account. Please switch Account Type to "Company Staff / Admin" to sign in.');
          return;
        }

        const isKnownCustomer = registeredCustomers.some(c => c.toLowerCase() === formattedEmail);
        if (!isKnownCustomer) {
          setErrorMsg('Customer account not found. Click "Sign Up" below to register this email.');
          return;
        }

        onLogin({ email: formattedEmail, role: 'customer' });
      }

    } else {
      // --- DYNAMIC CUSTOMER REGISTRATION (SIGN UP) ---
      if (role === 'admin') {
        setErrorMsg('Admin accounts are fixed. Public sign-up is reserved for Customers.');
        return;
      }

      if (isAdminEmail(formattedEmail)) {
        setErrorMsg('This email address is reserved for system Admin.');
        return;
      }

      // Automatically append and save new customer email
      if (!registeredCustomers.some(c => c.toLowerCase() === formattedEmail)) {
        const updatedList = [...registeredCustomers, formattedEmail];
        setRegisteredCustomers(updatedList);
        localStorage.setItem('safeshield_customers', JSON.stringify(updatedList));
      }

      onLogin({ email: formattedEmail, role: 'customer' });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0f172a', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', width: '380px', padding: '32px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
          {isLogin ? 'Sign In to SafeShield' : 'Register Customer Account'}
        </h2>
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
          {isLogin ? 'Enter your credentials to access the platform.' : 'Create a new customer account to access insurance services.'}
        </p>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginBottom: '16px', lineHeight: '1.4' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>Account Type</label>
            <select 
              value={role} 
              onChange={(e) => { setRole(e.target.value); setErrorMsg(''); }}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              disabled={!isLogin}
            >
              <option value="admin">🏢 Company Staff / Admin</option>
              <option value="customer">👤 Insurance Customer</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              required
            />
          </div>

          <button 
            type="submit" 
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', marginTop: '8px', fontSize: '14px' }}
          >
            {isLogin ? 'Sign In' : 'Register & Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          {isLogin ? "New customer? " : "Already have an account? "}
          <span 
            onClick={() => { 
              setIsLogin(!isLogin); 
              setErrorMsg(''); 
              if (isLogin) setRole('customer');
            }} 
            style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
}


