'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  IconUser, 
  IconMail, 
  IconLock, 
  IconCamera,
  IconShieldCheck,
  IconDeviceFloppy,
  IconLoaderQuarter
} from '@tabler/icons-react';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/users/getbyid`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.put(`${apiUrl}/api/users/update`, {
        name: formData.name,
        email: formData.email
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated successfully');
      fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <IconLoaderQuarter className="animate-spin text-indigo-500" size={40} />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Account Settings</h1>
        <p className="text-zinc-500">Manage your profile, email preferences, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative inline-block mb-6">
              <img 
                src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`} 
                className="w-24 h-24 rounded-3xl border-4 border-white/5 shadow-2xl object-cover"
                alt="Avatar" 
              />
              <button className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/40 hover:scale-110 transition-transform">
                <IconCamera size={18} />
              </button>
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-zinc-500 mb-6">{user?.email}</p>
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-[10px] font-bold text-green-500 uppercase tracking-widest">
              <IconShieldCheck size={14} /> Verified Account
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleUpdateProfile} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <IconUser className="text-indigo-400" size={20} />
              <h3 className="text-lg font-bold">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-600 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-600 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2"
            >
              {saving ? <IconLoaderQuarter className="animate-spin" size={20} /> : <IconDeviceFloppy size={20} />}
              Save Changes
            </button>
          </form>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <IconLock className="text-indigo-400" size={20} />
              <h3 className="text-lg font-bold">Security & Password</h3>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">Change your password and secure your account with a strong combination of characters.</p>
            <div className="space-y-4">
               <div className="space-y-2 text-zinc-400 text-sm p-4 border border-white/5 rounded-2xl italic">
                  Password management is currently handled via the Forgot Password flow for maximum security.
               </div>
               <button className="text-indigo-400 text-sm font-bold hover:underline">Launch Secure Reset Flow</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
