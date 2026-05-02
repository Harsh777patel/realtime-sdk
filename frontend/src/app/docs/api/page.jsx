'use client';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CodeBlock from "@/components/CodeBlock";
import { IconBolt, IconLock, IconWorld, IconServer } from '@tabler/icons-react';

export default function APIRef() {
  const endpoints = [
    {
      method: "POST",
      path: "/v1/rooms",
      desc: "Creates a new real-time room for chat, video, or audio sessions.",
      params: [
        { name: "type", type: "string", desc: "'chat', 'video', or 'audio'" },
        { name: "metadata", type: "object", desc: "Custom data to attach to the room" }
      ]
    },
    {
      method: "GET",
      path: "/v1/rooms/:id",
      desc: "Retrieves details and current participant state for a specific room.",
      params: []
    },
    {
      method: "DELETE",
      path: "/v1/rooms/:id",
      desc: "Ends a session and disconnects all active participants.",
      params: []
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <IconBolt className="text-indigo-500" size={24} />
            <h2 className="mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">API Reference</h2>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">REST API Reference</h1>
          <p className="text-lg text-zinc-500 leading-relaxed mb-6">
            The StreamKit REST API allows you to manage rooms, users, and sessions programmatically from your server-side environment.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-medium">
              <IconWorld size={14} className="text-indigo-400" />
              <span className="text-zinc-500">Base URL:</span>
              <span className="mono text-zinc-300">https://api.streamkit.io/v1</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-medium">
              <IconLock size={14} className="text-indigo-400" />
              <span className="text-zinc-500">Auth:</span>
              <span className="mono text-zinc-300">Bearer Token</span>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-600/20">
                <IconServer size={18} />
              </div>
              <h2 className="text-2xl font-bold text-white">Rooms Management</h2>
            </div>

            <div className="space-y-8">
              {endpoints.map((ep, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="bg-white/5 p-4 flex items-center gap-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.method === 'POST' ? 'bg-green-500/10 text-green-500' : 
                      ep.method === 'GET' ? 'bg-indigo-500/10 text-indigo-400' : 
                      'bg-red-500/10 text-red-500'
                    }`}>{ep.method}</span>
                    <span className="mono text-sm text-zinc-300">{ep.path}</span>
                  </div>
                  <div className="p-6">
                    <p className="text-zinc-500 text-sm mb-6">{ep.desc}</p>
                    
                    {ep.params.length > 0 && (
                      <div>
                        <h4 className="mono text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Body Parameters</h4>
                        <div className="space-y-3">
                          {ep.params.map((p, pi) => (
                            <div key={pi} className="flex gap-4 items-start py-2 border-b border-white/5 last:border-0">
                              <span className="mono text-zinc-300 text-xs w-24 flex-shrink-0">{p.name}</span>
                              <span className="text-indigo-400 text-[10px] font-bold uppercase w-20 flex-shrink-0">{p.type}</span>
                              <span className="text-zinc-500 text-xs leading-relaxed">{p.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8">
                      <h4 className="mono text-[10px] uppercase tracking-widest text-zinc-600 mb-4">Example Request</h4>
                      <CodeBlock 
                        code={`curl -X ${ep.method} https://api.streamkit.io${ep.path} \\
    -H "Authorization: Bearer YOUR_SECRET_KEY" \\
    -H "Content-Type: application/json" \\
    ${ep.method === 'POST' ? '-d \'{"type": "chat", "metadata": {"name": "Lobby"}}\'' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-indigo-600/5 border border-indigo-600/10 flex flex-col items-center text-center">
          <h3 className="text-white font-bold mb-2">Looking for SDKs?</h3>
          <p className="text-sm mb-6 text-zinc-500">We recommend using our native SDKs for the best development experience.</p>
          <div className="flex gap-4">
             <Link href="/docs/chat" className="text-indigo-400 text-sm font-bold hover:underline">Chat SDK</Link>
             <Link href="/docs/video" className="text-indigo-400 text-sm font-bold hover:underline">Video SDK</Link>
             <Link href="/docs/audio" className="text-indigo-400 text-sm font-bold hover:underline">Audio SDK</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
