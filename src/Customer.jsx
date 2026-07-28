import React, { useState, useEffect } from 'react';
import API from './api';
import { UserPlus, Mail, Phone, Trash2, Search, ArrowLeft } from 'lucide-react';

export default function Customers({ onBack }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/customers/');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Failed to fetch customers.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await API.post('/customers/', formData);
      setStatusMsg({ type: 'success', text: 'Customer registered successfully!' });
      setFormData({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Error adding customer.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await API.delete(`/customers/${id}`);
      setStatusMsg({ type: 'success', text: 'Customer removed.' });
      fetchCustomers();
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to delete customer.' });
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-[#151c2c] border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-400" /> Add New Customer
          </h2>

          {statusMsg.text && (
            <div className={`p-3 rounded-lg text-xs mb-4 ${statusMsg.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleAddCustomer} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mt-1 bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                placeholder="+1 555-0199"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full mt-1 bg-[#0b1120] border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white"
                rows="2"
                placeholder="123 Main St..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition text-sm cursor-pointer"
            >
              Register Customer
            </button>
          </form>
        </div>

        {/* Customer List Column */}
        <div className="lg:col-span-2 bg-[#151c2c] border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold">Registered Customers</h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0b1120] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-white"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm py-8 text-center">Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">No customers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-[#0b1120] text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                      <td className="px-4 py-3 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300"><Mail className="w-3 h-3 text-slate-500" /> {c.email}</div>
                        {c.phone && <div className="flex items-center gap-1.5 text-slate-400"><Phone className="w-3 h-3 text-slate-500" /> {c.phone}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
