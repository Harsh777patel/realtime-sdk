'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  IconLayoutDashboard, 
  IconRocket, 
  IconKey, 
  IconCode, 
  IconChartBar, 
  IconHistory, 
  IconPhoneCall, 
  IconUsers, 
  IconWallet, 
  IconSettings, 
  IconLogout,
  IconBell,
  IconSearch,
  IconMenu2,
  IconX,
  IconPaint
} from '@tabler/icons-react';

export default function UserLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/users/getbyid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      router.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { title: "Dashboard", href: "/user/dashboard", icon: <IconLayoutDashboard size={20} /> },
    { title: "Projects", href: "/user/projects", icon: <IconRocket size={20} /> },
    { title: "Whiteboard", href: "/user/whiteboard", icon: <IconPaint size={20} /> },
    { title: "API Keys", href: "/user/apikeymanager", icon: <IconKey size={20} /> },
    { title: "SDK Integration", href: "/user/integration", icon: <IconCode size={20} /> },
    { title: "Analytics", href: "/user/analytics", icon: <IconChartBar size={20} /> },
    { title: "Settings", href: "/user/settings", icon: <IconSettings size={20} /> },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-72 border-r border-white/5 bg-[#09090b] z-40 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              <span className="text-xl">⚡</span>
            </div>
            <span className="text-xl font-bold tracking-tight">StreamKit</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5">
          {menuItems.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/5 transition-all"
          >
            <IconLogout size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-30 px-8 flex justify-between items-center">
          <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-4 py-2 rounded-xl w-64 md:w-96 hidden md:flex">
            <IconSearch size={18} className="text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600 w-full"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all">
              <IconBell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-[#09090b]"></span>
            </button>
            <div className="h-8 w-px bg-white/5"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Free Tier</p>
              </div>
              <img
                src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                alt="profile"
                className="w-10 h-10 rounded-xl border border-white/10"
              />
            </div>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}