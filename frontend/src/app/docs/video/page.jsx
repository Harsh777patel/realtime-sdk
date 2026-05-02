'use client';
import CodeBlock from "@/components/CodeBlock";
import { IconBolt, IconVideo, IconList, IconCode } from '@tabler/icons-react';

const props = [
  { name: "apiKey", type: "string", required: true, desc: "Your StreamKit API key." },
  { name: "room", type: "string", required: true, desc: "The ID of the video room to join." },
  { name: "audio", type: "boolean", required: false, desc: "Whether to start with audio enabled. Default: true." },
  { name: "video", type: "boolean", required: false, desc: "Whether to start with video enabled. Default: true." },
];

export default function VideoDocs() {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-400 border border-emerald-600/20">
            <IconVideo size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Video SDK</h1>
            <p className="text-zinc-500 font-medium">Breathtakingly fast video conferencing.</p>
          </div>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
          Low-latency video streaming powered by WebRTC. Supports 1-on-1 calls, group sessions, and screen sharing with automatic bitrate scaling.
        </p>
      </header>

      <div className="space-y-20">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">
              <IconBolt size={18} />
            </div>
            <h2 className="text-2xl font-bold text-white">Installation</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <CodeBlock code={`npm install @streamkit/video`} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">
              <IconCode size={18} />
            </div>
            <h2 className="text-2xl font-bold text-white">Quickstart</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <CodeBlock code={`import { VideoRoom } from "@streamkit/video";

export default function Meeting() {
  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-white/5">
      <VideoRoom
        apiKey="sk_live_..."
        room="project-alpha"
      />
    </div>
  );
}`} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">
              <IconList size={18} />
            </div>
            <h2 className="text-2xl font-bold text-white">Props Reference</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Property</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {props.map((p) => (
                  <tr key={p.name} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 mono text-sm font-medium text-emerald-400">
                      {p.name}
                      {p.required && <span className="ml-2 text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">Required</span>}
                    </td>
                    <td className="px-6 py-4 mono text-xs text-zinc-500">{p.type}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400 leading-relaxed">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
