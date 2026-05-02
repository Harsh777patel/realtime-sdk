'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  IconUsers, 
  IconUserExclamation, 
  IconTrash, 
  IconShieldCheck,
  IconSearch,
  IconLoaderQuarter,
  IconChevronRight,
  IconMail
} from '@tabler/icons-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <IconLoaderQuarter className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing User Database...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Manage Users</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Total Platform Population: {users.length}</p>
        </div>
        <div className="relative group w-full md:w-80">
           <input 
             type="text" 
             placeholder="Filter by name or email..." 
             className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white outline-none focus:border-indigo-600 transition-all placeholder:text-slate-700"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                <th className="px-10 py-6">User Identity</th>
                <th className="px-10 py-6">Role</th>
                <th className="px-10 py-6">Registration Date</th>
                <th className="px-10 py-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl border border-indigo-600/20 flex items-center justify-center font-black text-indigo-400 text-lg">
                          {user.name ? user.name[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-black text-white">{user.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                             <IconMail size={12} />
                             <span className="mono lowercase">{user.email}</span>
                          </div>
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-slate-400'}`}>
                       {user.role}
                     </span>
                  </td>
                  <td className="px-10 py-8">
                     <div className="text-sm font-bold text-slate-400 mono">
                        {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                     <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-all border border-white/5">
                           <IconUserExclamation size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        >
                           <IconTrash size={18} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
