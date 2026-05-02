'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  IconUsers, 
  IconShieldLock, 
  IconActivity, 
  IconChartBar,
  IconArrowUpRight,
  IconDots,
  IconDeviceImac,
  IconMessageCircle,
  IconVideo,
  IconMicrophone,
  IconKey,
  IconTrash
} from '@tabler/icons-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 glass-panel">
       <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
       <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing System Data...</p>
    </div>
  );

  const statCards = [
    { label: "Total Platform Users", value: stats?.totalUsers || "0", icon: <IconUsers size={24} className="text-indigo-400" /> },
    { label: "Revenue estimated", value: `$${stats?.revenue || "0.00"}`, icon: <IconChartBar size={24} className="text-emerald-400" /> },
    { label: "API Throughput", value: stats?.throughput || "0", icon: <IconActivity size={24} className="text-blue-400" /> },
    { label: "Active Deployments", value: stats?.deployments || "0", icon: <IconDeviceImac size={24} className="text-purple-400" /> },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-panel p-8 relative overflow-hidden group hover:border-indigo-500/20 transition-all shadow-2xl">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                {stat.icon}
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                Service Meta
              </div>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <div className="flex items-end justify-between relative z-10">
               <h3 className="text-4xl font-black text-white">{stat.value}</h3>
               <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mb-1">
                 {stat.increase} <IconArrowUpRight size={14} />
               </span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* User Management Overview */}
        <div className="xl:col-span-2 glass-panel shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
             <h3 className="text-2xl font-black flex items-center gap-3">
               Recent Accounts
               <span className="text-xs font-bold text-indigo-500 italic font-normal tracking-normal">(Real-time sink)</span>
             </h3>
             <button className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-slate-400">
               <IconDots size={24} />
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  <th className="px-10 py-6">User Identity</th>
                  <th className="px-10 py-6">Role</th>
                  <th className="px-10 py-6">Registration Date</th>
                  <th className="px-10 py-6 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {(stats?.recentUsers || []).map((user, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl border border-indigo-600/20 flex items-center justify-center font-black text-indigo-400 text-lg">
                            {user.name ? user.name[0] : 'U'}
                          </div>
                          <div>
                            <p className="font-black text-white">{user.name}</p>
                            <p className="text-xs text-slate-500 mono lowercase">{user.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-white/5 text-slate-400'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-sm font-bold text-slate-400 mono">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href="/admin/keys" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-xl transition-all border border-white/5">Audit</Link>
                          <Link href="/admin/users" className="px-4 py-2 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-500">
                             Manage
                          </Link>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Resource Consumption */}
        <div className="space-y-8">
          <div className="glass-panel p-10 shadow-2xl">
             <h3 className="text-xl font-black mb-10">Resource Allocation</h3>
             <div className="space-y-8">
                <ResourceBar label="WebSocket Clusters" val="72%" icon={<IconActivity className="text-emerald-400" />} color="bg-emerald-400" />
                <ResourceBar label="Media Relay Nodes" val="48%" icon={<IconVideo className="text-blue-400" />} color="bg-blue-400" />
                <ResourceBar label="Auth DB Load" val="18%" icon={<IconShieldLock className="text-purple-400" />} color="bg-purple-400" />
             </div>
          </div>

          <div className="bg-indigo-600 rounded-[3rem] p-10 shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-2xl font-black mb-2 relative z-10">API Health Check</h3>
            <p className="text-sm font-bold opacity-80 mb-8 relative z-10 uppercase tracking-widest">Global Status: High</p>
            <div className="flex items-center gap-4 relative z-10">
               <button className="flex-1 py-4 bg-[#020617] text-white font-black rounded-2xl hover:scale-105 transition-transform active:scale-95 text-xs">Full Diagnostic</button>
               <button className="flex-1 py-4 bg-white/20 border border-white/20 font-black rounded-2xl hover:bg-white/40 transition-colors text-xs">System Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ResourceBar = ({ label, val, icon, color }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <span className="text-sm font-bold text-slate-300">{label}</span>
      </div>
      <span className="text-xs font-black text-white mono">{val}</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]`} style={{ width: val }}></div>
    </div>
  </div>
);
