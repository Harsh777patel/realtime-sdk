'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { 
  IconRocket, 
  IconChevronRight,
  IconCopy,
  IconCheck
} from "@tabler/icons-react";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/users/getbyid`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back, {user.name.split(' ')[0]}!</h1>
          <p className="text-zinc-500 text-sm">Here's what's happening with your projects today.</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
          <IconRocket size={18} />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value="12" increase="+2" />
        <StatCard title="API Requests" value="14.2k" increase="+12%" />
        <StatCard title="Active Users" value="892" increase="+18%" />
        <StatCard title="Health Score" value="99.9%" status="Healthy" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* SDK Integration */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold mb-1">Quick Integration</h2>
                <p className="text-sm text-zinc-500">Copy the snippet to start building.</p>
              </div>
              <button 
                onClick={() => copyToClipboard(`StreamKit.init({ apiKey: "YOUR_API_KEY", userId: "${user._id}" });`)}
                className="p-2.5 rounded-xl bg-foreground/5 border border-border hover:bg-foreground/10 transition-all text-foreground/40 hover:text-foreground"
              >
                {copied ? <IconCheck size={18} className="text-green-500" /> : <IconCopy size={18} />}
              </button>
            </div>
            <div className="bg-foreground/5 rounded-2xl p-6 border border-border font-mono text-xs leading-relaxed overflow-x-auto text-indigo-500">
              <pre>
{`<script src="https://cdn.streamkit.io/sdk.js"></script>
<script>
  StreamKit.init({
    apiKey: "YOUR_API_KEY",
    userId: "${user._id}",
    name: "${user.name}"
  });
</script>`}
              </pre>
            </div>
          </div>

          {/* Projects Table */}
          <div className="glass-panel overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Active Projects</h2>
              <Link href="/user/projects" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                View All <IconChevronRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-foreground/5 text-[10px] uppercase tracking-widest font-bold text-foreground/50">
                    <th className="px-8 py-4">Project Name</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Requests / 24h</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium">
                  {[
                    { name: "Alpha App", status: "Active", reqs: "1,245" },
                    { name: "Beta Project", status: "Active", reqs: "892" },
                    { name: "Website Chatbot", status: "Maintenance", reqs: "45" },
                  ].map((project, i) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-zinc-200">{project.name}</td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${project.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm mono text-zinc-400">{project.reqs}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-white transition-colors">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Profile Summary Side */}
        <div className="space-y-6">
          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold mb-6">Profile Summary</h2>
            <div className="space-y-5">
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Current Plan" value="Free Tier (10k ops)" />
              <ProfileItem label="Member Since" value="April 2025" />
              <ProfileItem label="Region" value="US East (N. Virginia)" />
            </div>
          <a href="/user/settings">
  <button className="w-full mt-8 py-3 rounded-xl border border-border text-sm font-bold hover:bg-foreground/5 transition-all">
    Update Information
  </button>
</a>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <h2 className="text-xl font-black mb-2 relative z-10">Pro Plan</h2>
            <p className="text-sm text-indigo-100 mb-6 relative z-10 leading-relaxed shadow-sm">Unlock high-priority support, unlimited rooms, and custom domains.</p>
            <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg relative z-10 hover:scale-105 transition-transform active:scale-95">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, increase, status }) => (
  <div className="glass-panel p-6 border border-border hover:bg-foreground/5 transition-colors shadow-xl">
    <p className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-4">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-black tracking-tight text-foreground">{value}</h3>
      {increase && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">{increase}</span>}
      {status && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 italic">{status}</span>}
    </div>
  </div>
);

const ProfileItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/30">{label}</p>
    <p className="text-sm text-foreground/80 font-medium truncate">{value}</p>
  </div>
);

export default UserDashboard;