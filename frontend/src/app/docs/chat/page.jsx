'use client';
import CodeBlock from "@/components/CodeBlock";
import { IconBolt, IconMessages, IconList, IconCode } from '@tabler/icons-react';

const props = [
  { name: "apiKey", type: "string", required: true, desc: "Your StreamKit API key. Obtain from the dashboard." },
  { name: "userId", type: "string", required: true, desc: "Unique identifier for the current user." },
  { name: "name", type: "string", required: false, desc: "Display name shown in the chat UI." },
  { name: "roomId", type: "string", required: false, desc: "Join a specific room. Omit for a new DM thread." },
  { name: "theme", type: "'dark' | 'light' | 'auto'", required: false, desc: "UI color scheme. Defaults to 'auto'." },
];

const events = [
  { event: "onConnect", desc: "Fired when the WebSocket connection is established." },
  { event: "onMessage", desc: "Called with a Message object on every new message." },
  { event: "onTyping", desc: "Indicates another user is typing in the room." },
];

export default function ChatDocs() {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-600/20">
            <IconMessages size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Chat SDK</h1>
            <p className="text-zinc-500 font-medium">Real-time messaging for any platform.</p>
          </div>
        </div>
        <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
          Integrate powerful messaging capabilities into your application with just a few lines of code. Supports high-concurrency rooms, persistent history, and rich media.
        </p>
      </header>

      <div className="space-y-20">
        {/* Installation */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">
              <IconBolt size={18} />
            </div>
            <h2 className="text-2xl font-bold text-white">Installation</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <CodeBlock code={`npm install @streamkit/chat`} />
          </div>
        </section>

        {/* Quickstart */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">
              <IconCode size={18} />
            </div>
            <h2 className="text-2xl font-bold text-white">Quickstart</h2>
          </div>
          <div className="space-y-6">
            <p className="text-zinc-500">Add the Chat component to your React app. It handles connection state and UI automatically.</p>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <CodeBlock code={`import { Chat } from "@streamkit/chat";

export default function MyChat() {
  return (
    <div style={{ height: "600px" }}>
      <Chat
        apiKey="sk_live_..."
        userId="user_123"
        roomId="general-lobby"
      />
    </div>
  );
}`} />
            </div>
          </div>
        </section>

        {/* Props */}
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
                    <td className="px-6 py-4 mono text-sm font-medium">
                      <span className="text-indigo-400">{p.name}</span>
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

