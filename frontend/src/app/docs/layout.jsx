"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IconMessages, 
  IconVideo, 
  IconMicrophone, 
  IconFileText, 
  IconCode, 
  IconHistory, 
  IconBrandGithub,
  IconSearch,
  IconCommand,
  IconChevronRight,
  IconHelpCircle,
  IconBrandDiscord,
  IconSun
} from "@tabler/icons-react";

const navItems = [
  {
    name: "Chat",
    href: "/docs/chat",
    icon: <IconMessages size={18} />,
    color: "#6366f1",
  },
  {
    name: "Video",
    href: "/docs/video",
    icon: <IconVideo size={18} />,
    color: "#10b981",
  },
  {
    name: "Audio",
    href: "/docs/audio",
    icon: <IconMicrophone size={18} />,
    color: "#f59e0b",
  },
];

const resources = [
  { name: "API Reference", href: "/docs/api", icon: <IconFileText size={16} /> },
  { name: "Examples", href: "/examples", icon: <IconCode size={16} /> },
  { name: "Changelog", href: "/changelog", icon: <IconHistory size={16} /> },
  { name: "GitHub", href: "https://github.com", icon: <IconBrandGithub size={16} /> },
];

export default function DocsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="bg-[#09090b] text-[#fafafa] min-h-screen flex font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        body { font-family: 'Outfit', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }

        .docs-sidebar {
          width: 280px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          border-right: 1px solid rgba(255,255,255,0.05);
          background: #09090b;
          display: flex;
          flex-direction: column;
          z-index: 40;
        }

        .docs-main {
          margin-left: 280px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .docs-content-container {
          padding: 64px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .docs-sidebar { display: none; }
          .docs-main { margin-left: 0; }
          .docs-content-container { padding: 32px; }
        }

        .nav-link-active {
          background: rgba(99,102,241,0.1);
          color: #818cf8 !important;
          border-right: 2px solid #6366f1;
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="docs-sidebar">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">⚡</div>
          <span className="font-bold text-lg tracking-tight">StreamKit Docs</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-8">
            <h3 className="mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 px-4">// Components</h3>
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-600/10 text-indigo-400' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <span style={{ color: active ? item.color : 'inherit' }}>{item.icon}</span>
                    {item.name}
                    {active && <IconChevronRight size={14} className="ml-auto" />}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 px-4">// Resources</h3>
            <div className="space-y-1">
              {resources.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="p-4 rounded-xl bg-indigo-600/5 border border-indigo-600/10">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <IconHelpCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Help</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">Stuck? Join our community for help.</p>
            <a href="/discord" className="flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition-all">
              <IconBrandDiscord size={14} />
              Join Discord
            </a>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="docs-main">
        <header className="h-16 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mono">
            <Link href="/" className="hover:text-white transition-colors">home</Link>
            <IconChevronRight size={14} />
            <Link href="/docs" className="hover:text-white transition-colors">docs</Link>
            <IconChevronRight size={14} />
            <span className="text-white font-medium">{pathname?.split("/").pop()}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-500 text-sm w-64 hover:border-white/20 transition-all cursor-pointer">
                <IconSearch size={16} />
                <span>Search docs...</span>
                <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px]">
                  <IconCommand size={10} />
                  <span>K</span>
                </div>
              </div>
            </div>
            
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
              <IconSun size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="docs-content-container animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
