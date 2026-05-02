import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { IconCode, IconExternalLink, IconBrandGithub, IconMessages, IconVideo, IconMicrophone } from '@tabler/icons-react';

export default function Examples() {
  const samples = [
    {
      title: "TeleHealth Dashboard",
      desc: "A HIPAA-compliant video consultation portal with integrated chat and appointment scheduling.",
      tech: ["Next.js", "Video SDK", "Tailwind"],
      icon: <IconVideo className="text-emerald-400" />,
      color: "emerald"
    },
    {
      title: "Gaming Community Lobby",
      desc: "Real-time presence and audio rooms for gamers to coordinate before starting a match.",
      tech: ["React", "Audio SDK", "WebSocket"],
      icon: <IconMicrophone className="text-amber-400" />,
      color: "amber"
    },
    {
      title: "Customer Support Widget",
      desc: "Embeddable chat client that supports rich media, emojis, and ticket creation.",
      tech: ["JS SDK", "Chat SDK", "CSS"],
      icon: <IconMessages className="text-indigo-400" />,
      color: "indigo"
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-6xl">
        <div className="mb-20">
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-6">Build with StreamKit</h1>
          <p className="text-xl leading-relaxed text-zinc-500 max-w-2xl">
            Explore production-ready examples and templates to kickstart your next real-time application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samples.map((sample, idx) => (
            <div key={idx} className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                {sample.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{sample.title}</h3>
              <p className="text-zinc-500 leading-relaxed text-sm mb-8">
                {sample.desc}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {sample.tech.map(t => (
                  <span key={t} className="text-[10px] uppercase font-bold text-white/40 tracking-wider px-2 py-0.5 rounded border border-white/5 bg-white/5">{t}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-auto">
                <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                   <IconBrandGithub size={16} /> Source
                </button>
                <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                   Demo <IconExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[40px] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors">
            <IconCode size={120} stroke={1} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Request a custom template</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Need an example for a specific stack? Let us know and we'll prioritize building it for the community.
          </p>
          <button className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-indigo-50 transition-all active:scale-95">
             Submit Request
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
