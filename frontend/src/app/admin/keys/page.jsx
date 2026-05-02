'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  IconKey, 
  IconShieldLock, 
  IconSearch, 
  IconLoaderQuarter,
  IconCopy,
  IconCheck,
  IconClock,
  IconUser
} from '@tabler/icons-react';

export default function ApiKeyAudit() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/admin/keys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setKeys(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success('Key signature copied');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredKeys = keys.filter(k => 
    k.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    k.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <IconLoaderQuarter className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Auditing Encrypted Signatures...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">API Key Audit</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Total Active Signatures: {keys.length}</p>
        </div>
        <div className="relative group w-full md:w-80">
           <input 
             type="text" 
             placeholder="Search by key name or owner..." 
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
                <th className="px-10 py-6">Key Artifact</th>
                <th className="px-10 py-6">Signature</th>
                <th className="px-10 py-6">Origin User</th>
                <th className="px-10 py-6">Issued At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredKeys.map((key) => (
                <tr key={key._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                           <IconKey size={20} />
                        </div>
                        <div>
                          <p className="font-black text-white">{key.name}</p>
                          <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest mt-1">Live Signature</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-2 w-fit">
                        <code className="text-xs text-slate-400 mono">
                          {key.apiKey?.substring(0, 8)}••••••••{key.apiKey?.substring(key.apiKey.length - 8)}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(key.apiKey)}
                          className="text-slate-500 hover:text-white transition-colors"
                        >
                           {copiedKey === key.apiKey ? <IconCheck size={14} className="text-emerald-500" /> : <IconCopy size={14} />}
                        </button>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-slate-500">
                           <IconUser size={14} />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-300">{key.userId?.name || 'Unknown'}</p>
                           <p className="text-[10px] text-slate-500 mono">{key.userId?.email || 'N/A'}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mono">
                        <IconClock size={14} className="text-slate-600" />
                        {new Date(key.createdAt).toLocaleString()}
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
