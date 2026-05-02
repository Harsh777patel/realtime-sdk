"use client";

import React, { useState } from "react";
import { 
  IconPaint, 
  IconCheck, 
  IconCopy, 
  IconArrowLeft,
  IconCpu,
  IconCloudUpload,
  IconBolt
} from "@tabler/icons-react";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";

export default function WhiteboardDocs() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const installCode = `npm install @streamkit/realtime`;
  const usageCode = `import { Whiteboard } from "@streamkit/realtime";

function App() {
  return (
    <Whiteboard 
      apiKey="YOUR_API_KEY"
      userId="user_123"
      roomId="collaborative_room_01"
    />
  );
}`;

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <Link href="/docs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12">
          <IconArrowLeft size={18} />
          Back to Documentation
        </Link>

        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-3xl bg-pink-600/10 border border-pink-600/20 flex items-center justify-center text-pink-500 shadow-2xl shadow-pink-600/20">
            <IconPaint size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight mb-2">Smart Whiteboard</h1>
            <p className="text-zinc-400 text-lg">Collaborative digital canvas with intelligent shape recognition.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <FeatureCard 
            icon={<IconCpu size={24} />} 
            title="Intelligent" 
            desc="Auto-converts sketches into perfect geometric shapes."
          />
          <FeatureCard 
            icon={<IconCloudUpload size={24} />} 
            title="Persistent" 
            desc="Board data is automatically saved to your cloud workspace."
          />
          <FeatureCard 
            icon={<IconBolt size={24} />} 
            title="Real-Time" 
            desc="Multi-user collaboration with zero-latency synchronization."
          />
        </div>

        <article className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-black mb-6">Installation</h2>
          <div className="relative mb-12">
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 font-mono text-sm text-pink-400">
              <pre>{installCode}</pre>
            </div>
            <button 
              onClick={() => copyToClipboard(installCode)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10"
            >
              {copied ? <IconCheck size={18} className="text-green-500" /> : <IconCopy size={18} />}
            </button>
          </div>

          <h2 className="text-3xl font-black mb-6">Basic Usage</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Drop the <code className="text-pink-400">Whiteboard</code> component into any React project. It handles all canvas rendering, socket management, and persistence logic out of the box.
          </p>
          
          <div className="mb-20">
             <CodeBlock code={usageCode} language="javascript" />
          </div>

          <h2 className="text-3xl font-black mb-6">Properties</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-white/5 rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-white/5 text-xs uppercase tracking-widest font-bold text-zinc-500">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-sm">
                <tr>
                  <td className="px-6 py-5 text-pink-400 mono">apiKey</td>
                  <td className="px-6 py-5 text-zinc-400 italic">string</td>
                  <td className="px-6 py-5 text-zinc-300">Your StreamKit API key for authentication.</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-pink-400 mono">userId</td>
                  <td className="px-6 py-5 text-zinc-400 italic">string</td>
                  <td className="px-6 py-5 text-zinc-300">A unique identifier for the current user.</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-pink-400 mono">roomId</td>
                  <td className="px-6 py-5 text-zinc-400 italic">string</td>
                  <td className="px-6 py-5 text-zinc-300">The synchronization ID for drawing collaboration.</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-pink-400 mono">onSave</td>
                  <td className="px-6 py-5 text-zinc-400 italic">function</td>
                  <td className="px-6 py-5 text-zinc-300">Optional callback triggered when board is saved.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <div className="mt-32 p-12 rounded-[3rem] bg-pink-600 text-center shadow-2xl shadow-pink-600/20">
           <h2 className="text-4xl font-black mb-4 text-white">Ready to draw?</h2>
           <p className="text-pink-100 mb-10 max-w-lg mx-auto">Get your API key today and start building collaborative tools in minutes.</p>
           <Link href="/signup" className="px-10 py-4 bg-white text-pink-600 font-black rounded-full hover:scale-105 transition-all inline-block">
              Create Free Account
           </Link>
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass-panel p-8 group hover:border-pink-500/30 transition-all border border-white/5 bg-zinc-900/50 rounded-3xl">
    <div className="w-12 h-12 rounded-2xl bg-pink-600/10 border border-pink-600/20 flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
  </div>
);
