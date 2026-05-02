'use client';
import React from 'react';
import { 
  IconChartLine, 
  IconUsers, 
  IconClock, 
  IconPointer,
  IconArrowUpRight,
  IconArrowDownRight,
  IconWorld,
  IconDeviceLaptop
} from '@tabler/icons-react';

export default function Analytics() {
  const stats = [
    { label: "Real-time Users", value: "842", sub: "+12.5%", trending: "up", icon: <IconUsers className="text-blue-500" /> },
    { label: "Avg. Latency", value: "42ms", sub: "-5ms", trending: "up", icon: <IconClock className="text-emerald-500" /> },
    { label: "Total Handshakes", value: "148k", sub: "+8%", trending: "up", icon: <IconPointer className="text-amber-500" /> },
    { label: "Bandwidth Used", value: "2.4 GB", sub: "+14%", trending: "up", icon: <IconChartLine className="text-purple-500" /> },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Usage Analytics</h1>
        <p className="text-zinc-500">Monitor your project performance and real-time event traffic.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:border-white/10 transition-colors shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  {stat.icon}
                </div>
                {stat.trending === 'up' ? (
                  <div className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                    {stat.sub} <IconArrowUpRight size={14} />
                  </div>
                ) : (
                  <div className="flex items-center text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg">
                    {stat.sub} <IconArrowDownRight size={14} />
                  </div>
                )}
             </div>
             <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-600 mb-2">{stat.label}</p>
             <h3 className="text-3xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 flex flex-col min-h-[450px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
             <IconChartLine size={180} />
          </div>
          <div className="relative z-10 flex-1">
            <h3 className="text-xl font-bold mb-8">Event Traffic Over Time</h3>
            <div className="w-full flex-1 flex items-end gap-2 pt-10 pb-4">
              {[60, 45, 80, 55, 90, 70, 40, 65, 85, 50, 75, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-600/20 hover:bg-indigo-600 rounded-t-xl transition-all relative group/bar" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                    {h}k events
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6 text-[10px] uppercase font-bold tracking-widest text-zinc-600 border-t border-white/5 pt-6">
              <span>May 01</span>
              <span>May 15</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="space-y-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-8">
              <IconWorld className="text-indigo-400" size={20} /> Geographic Distribution
            </h3>
            <div className="space-y-6">
              <CountryBar label="United States" val="42%" color="bg-blue-500" />
              <CountryBar label="India" val="28%" color="bg-orange-500" />
              <CountryBar label="Germany" val="15%" color="bg-red-500" />
              <CountryBar label="United Kingdom" val="10%" color="bg-emerald-500" />
              <CountryBar label="Other" val="5%" color="bg-zinc-500" />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-8">
              <IconDeviceLaptop className="text-indigo-400" size={20} /> Browser & Device
            </h3>
            <div className="flex items-center justify-between text-center pb-4 border-b border-white/5">
              <div>
                <p className="text-2xl font-black">68%</p>
                <p className="text-[10px] font-bold text-zinc-600 uppercase">Chrome</p>
              </div>
              <div className="h-8 w-px bg-white/5"></div>
              <div>
                <p className="text-2xl font-black">14%</p>
                <p className="text-[10px] font-bold text-zinc-600 uppercase">Safari</p>
              </div>
              <div className="h-8 w-px bg-white/5"></div>
              <div>
                <p className="text-2xl font-black">18%</p>
                <p className="text-[10px] font-bold text-zinc-600 uppercase">Other</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CountryBar = ({ label, val, color }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs font-bold">
      <span className="text-zinc-500">{label}</span>
      <span className="text-white">{val}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: val }}></div>
    </div>
  </div>
);
