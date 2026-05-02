import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { IconRocket, IconAdjustments, IconPlus } from '@tabler/icons-react';

export default function Changelog() {
  const updates = [
    {
      version: "2.4.0",
      date: "April 10, 2025",
      type: "Major Update",
      icon: <IconRocket />,
      items: [
        { label: "New", text: "Added high-frequency WebSocket clustering support." },
        { label: "New", text: "Released React Hooks library for simpler state management." },
        { label: "Improve", text: "Reduced initial handshake latency by 45%." }
      ]
    },
    {
      version: "2.3.5",
      date: "March 28, 2025",
      type: "Maintenance",
      icon: <IconAdjustments />,
      items: [
        { label: "Fix", text: "Resolved connection leak in background tabs on Safari." },
        { label: "Fix", text: "Fixed race condition in group chat initial loading." },
        { label: "Update", text: "Improved authentication middleware logging." }
      ]
    },
    {
      version: "2.3.0",
      date: "March 15, 2025",
      type: "Feature Update",
      icon: <IconPlus />,
      items: [
        { label: "New", text: "Introduction of 'Audio Rooms' component." },
        { label: "New", text: "Support for custom themes in Chat SDK." },
        { label: "Improve", text: "Better TypeScript definitions for all SDK components." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="mb-20 text-center">
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-6">What's New</h1>
          <p className="text-lg leading-relaxed text-zinc-500 max-w-xl mx-auto">
            Stay up to date with the latest features, improvements, and bug fixes for the StreamKit platform.
          </p>
        </div>

        <div className="space-y-24 relative">
          <div className="absolute left-[39px] top-0 bottom-0 w-[1px] bg-white/5 hidden md:block"></div>

          {updates.map((update, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row gap-8 md:gap-20">
              <div className="md:w-32 flex-shrink-0 text-left md:text-right pt-2">
                <div className="text-white font-bold text-xl mb-1">{update.version}</div>
                <div className="text-xs font-medium text-zinc-600 uppercase tracking-widest">{update.date}</div>
              </div>
              
              <div className="absolute left-[31px] top-2 transition-transform group-hover:scale-110 hidden md:block">
                <div className="w-4 h-4 rounded-full bg-indigo-600 border-4 border-[#09090b] shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-600/20">
                    {update.icon}
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{update.type}</span>
                </div>
                
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-xl">
                  <ul className="space-y-4">
                    {update.items.map((item, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 ${
                          item.label === 'New' ? 'bg-green-500/10 text-green-500' : 
                          item.label === 'Fix' ? 'bg-red-500/10 text-red-500' : 
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {item.label}
                        </span>
                        <span className="text-zinc-300 leading-relaxed text-sm">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
