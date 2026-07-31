import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [loginType, setLoginType] = useState('staff'); // 'staff' or 'customer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const navigate = useNavigate();

  // Pre-registered internal company staff accounts
  const companyStaffList = [
    { name: 'Riya Pawar', email: 'riyapawar14@gmail.com', role: 'System Admin & Operations Lead' },
    { name: 'Vikram Malhotra', email: 'vikram@insurcare.com', role: 'Corporate Client Admin (Nexus Tech)' },
    { name: 'Ananya Deshmukh', email: 'ananya@insurcare.com', role: 'Claims Settlement Officer' }
  ];

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff.email);
    setEmail(staff.email);
    setPassword('default_secure_password'); // Auto-fill or handle staff token securely
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call your backend API endpoint
      const response = await axios.post('https://insurcare-api.onrender.com/api/login', {
        email,
        password,
        type: loginType
      });
      
      // Save token & redirect based on role
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">INSUR-CARE PORTAL</h2>

        {/* Role Toggle Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-lg mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === 'staff' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => { setLoginType('staff'); setEmail(''); }}
          >
            Company Member
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${loginType === 'customer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => { setLoginType('customer'); setEmail(''); setSelectedStaff(''); }}
          >
            Customer
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginType === 'staff' ? (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Company Member Profile</label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                onChange={(e) => {
                  const staff = companyStaffList.find(s => s.email === e.target.value);
                  if (staff) handleStaffSelect(staff);
                }}
                value={selectedStaff}
              >
                <option value="">-- Choose Internal Profile --</option>
                {companyStaffList.map((staff, idx) => (
                  <option key={idx} value={staff.email}>
                    {staff.name} ({staff.role})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Customer Email Address</label>
              <input
                type="email"
                required
                placeholder="customer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Sign In to Portal &rarr;
          </button>
        </form>
      </div>
    </div>
  );
}


