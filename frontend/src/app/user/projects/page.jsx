'use client';
import React, { useState } from 'react';
import { 
  IconRocket, 
  IconPlus, 
  IconSearch, 
  IconDotsVertical, 
  IconExternalLink,
  IconClock,
  IconFolders
} from '@tabler/icons-react';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const projects = [
    { id: 1, name: "FinTech Dashboard", type: "Chat + Video", status: "Active", updated: "2h ago", color: "from-blue-500 to-indigo-600" },
    { id: 2, name: "Support Widget", type: "Chat only", status: "Active", updated: "5h ago", color: "from-purple-500 to-pink-600" },
    { id: 3, name: "Consultation App", type: "Video only", status: "Maintenance", updated: "1d ago", color: "from-emerald-500 to-teal-600" },
    { id: 4, name: "Gaming Lobby", type: "Audio + Chat", status: "Active", updated: "3d ago", color: "from-orange-500 to-red-600" },
  ];

  const filtered = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">My Projects</h1>
          <p className="text-sm text-zinc-500">Create and manage your real-time communication builds.</p>
        </div>
        <button className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95">
          <IconPlus size={20} />
          Create New Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-4 focus-within:border-indigo-600/50 transition-colors">
          <IconSearch size={20} className="text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search your projects..." 
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-zinc-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
           <button className="px-4 py-3 bg-white/5 rounded-xl text-xs font-bold text-white uppercase tracking-widest">All</button>
           <button className="px-4 py-3 hover:bg-white/5 rounded-xl text-xs font-bold text-zinc-600 uppercase tracking-widest transition-all">Archived</button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((project) => (
            <div key={project.id} className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.04] transition-all relative overflow-hidden flex flex-col min-h-[300px]">
               <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${project.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}></div>
               
               <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white shadow-lg`}>
                     <IconFolders size={28} />
                  </div>
                  <button className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                     <IconDotsVertical size={20} />
                  </button>
               </div>

               <div className="flex-1 relative z-10">
                  <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                  <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">{project.type}</p>
               </div>

               <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                     <IconClock size={12} /> {project.updated}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${project.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {project.status}
                  </div>
               </div>

               <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full py-4 bg-white text-black font-black rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
                     View Project <IconExternalLink size={18} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
           <IconRocket size={48} className="mx-auto mb-6 text-zinc-700" />
           <p className="text-zinc-500 font-medium">No projects found matching your search.</p>
        </div>
      )}
    </div>
  );
}
