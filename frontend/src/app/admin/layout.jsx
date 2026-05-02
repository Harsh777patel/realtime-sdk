'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  IconLayoutDashboard, 
  IconUsers, 
  IconShieldLock, 
  IconServer, 
  IconActivity,
  IconSettings, 
  IconLogout,
  IconBell,
  IconSearch,
  IconMenu2,
  IconX,
  IconDatabase,
  IconLock,
  IconShieldCheck
} from '@tabler/icons-react';

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/users/getbyid`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Strict Admin Restriction
      if (res.data.email !== "harsh4004@gmail.com") {
        toast.error("Unauthorized Access: Administrative privileges required.");
        router.push('/user/dashboard');
        return;
      }

      setAdmin(res.data);
    } catch (err) {
      router.push('/login');
    }
  };

  const menuItems = [
    { title: "Control Center", href: "/admin/dashboard", icon: <IconLayoutDashboard size={20} /> },
    { title: "Manage Users", href: "/admin/users", icon: <IconUsers size={20} /> },
    { title: "API Key Audit", href: "/admin/keys", icon: <IconShieldLock size={20} /> },
    { title: "Node Infrastructure", href: "/admin/infrastructure", icon: <IconServer size={20} /> },
    { title: "Traffic Analytics", href: "/admin/analytics", icon: <IconActivity size={20} /> },
    { title: "Security Protocols", href: "/admin/security", icon: <IconLock size={20} /> },
  ];

  if (!admin) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans selection:bg-indigo-500/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-80 border-r border-white/5 bg-[#020617] z-40 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                <IconShieldCheck size={24} className="text-white" />
             </div>
             <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-white">CORE</span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Admin Portal</span>
             </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-10 px-6 space-y-2">
          {menuItems.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer text-sm font-bold transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button 
            onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/5 transition-all"
          >
            <IconLogout size={22} />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 border-b border-white/5 px-10 flex justify-between items-center bg-[#020617]/50 backdrop-blur-xl">
          <div className="flex items-center gap-6">
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Root Administration</h2>
             <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">System Online</span>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
               <input 
                 type="text" 
                 placeholder="Search platform..." 
                 className="bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-xs text-white outline-none focus:border-indigo-500/50 w-64 transition-all"
               />
               <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            <div className="h-10 w-px bg-white/5"></div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-black text-white">{admin.name}</p>
                <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Platform Owner</p>
              </div>
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-black text-indigo-400 text-lg">
                {admin.name[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
