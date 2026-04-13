"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Chat",
    href: "/docs/chat",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M14 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3l2 2 2-2h5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M4 6h8M4 9h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    color: "#6366f1",
  },
  {
    name: "Video",
    href: "/docs/video",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3.5" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M11 6.5l4-2v7l-4-2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#10b981",
  },
  {
    name: "Audio",
    href: "/docs/audio",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V4a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2 7a6 6 0 0 0 12 0M8 13v2M6 15h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    color: "#f59e0b",
  },
];

const resources = [
  { name: "API Reference", href: "/docs/api" },
  { name: "Examples", href: "/examples" },
  { name: "Changelog", href: "/changelog" },
  { name: "GitHub", href: "https://github.com" },
];

export default function DocsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div style={{ fontFamily: "'DM Mono', 'Fira Code', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .docs-layout {
          display: flex;
          min-height: 100vh;
          background: #09090b;
          color: #fafafa;
        }

        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: #09090b;
          border-right: 1px solid #1c1c1f;
          display: flex;
          flex-direction: column;
          padding: 0;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          overflow-y: auto;
        }

        .sidebar-logo {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #1c1c1f;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-mark {
          width: 28px;
          height: 28px;
          background: #6366f1;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .logo-text {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 15px;
          color: #fafafa;
          letter-spacing: -0.02em;
        }

        .version-badge {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #6366f1;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.25);
          padding: 1px 6px;
          border-radius: 4px;
          margin-left: auto;
        }

        .sidebar-section {
          padding: 20px 12px 12px;
        }

        .sidebar-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #3f3f46;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0 8px;
          margin-bottom: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          text-decoration: none;
          color: #71717a;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 2px;
          position: relative;
        }
        .nav-item:hover { background: #111113; color: #d4d4d8; }
        .nav-item.active { background: #111113; color: #fafafa; }

        .nav-item-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .nav-item.active .nav-item-dot { opacity: 1; }

        .resource-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 6px;
          text-decoration: none;
          color: #52525b;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 300;
          transition: color 0.15s;
          margin-bottom: 1px;
        }
        .resource-link:hover { color: #a1a1aa; }

        .sidebar-bottom {
          margin-top: auto;
          padding: 16px 12px;
          border-top: 1px solid #1c1c1f;
        }

        .docs-main {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .docs-topbar {
          border-bottom: 1px solid #1c1c1f;
          padding: 14px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #09090b;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .breadcrumb {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #52525b;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .breadcrumb-sep { color: #27272a; }
        .breadcrumb-current { color: #a1a1aa; }

        .search-bar {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 8px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #52525b;
          cursor: pointer;
          transition: border-color 0.15s;
          min-width: 200px;
        }
        .search-bar:hover { border-color: #27272a; }

        .docs-content {
          padding: 52px 48px;
          max-width: 820px;
          width: 100%;
          animation: fadeUp 0.4s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="docs-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <Link href="/" className="sidebar-logo">
            <div className="logo-mark">⚡</div>
            <span className="logo-text">StreamKit</span>
            <span className="version-badge">v2.4</span>
          </Link>

          {/* Main nav */}
          <div className="sidebar-section">
            <div className="sidebar-section-label">// components</div>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`nav-item ${active ? "active" : ""}`}>
                  <span style={{ color: active ? item.color : "inherit", display: "flex" }}>
                    {item.icon}
                  </span>
                  {item.name}
                  <span className="nav-item-dot" style={{ background: item.color, marginLeft: "auto" }} />
                </Link>
              );
            })}
          </div>

          <div className="sidebar-section" style={{ paddingTop: 8 }}>
            <div className="sidebar-section-label">// resources</div>
            {resources.map((r) => (
              <Link key={r.href} href={r.href} className="resource-link">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {r.name}
              </Link>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#818cf8", fontWeight: 500, marginBottom: 4 }}>
                Need help?
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#52525b", fontWeight: 300, lineHeight: 1.5, marginBottom: 10 }}>
                Join our Discord for real-time support.
              </div>
              <Link href="/discord" style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#818cf8",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
              }}>
                Join Discord →
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="docs-main">
          <div className="docs-topbar">
            <div className="breadcrumb">
              <span>docs</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">
                {pathname?.split("/").pop() || "home"}
              </span>
            </div>
            <div className="search-bar">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Search docs...
              <span style={{ marginLeft: "auto", background: "#1c1c1f", borderRadius: 4, padding: "1px 6px", fontSize: 10, color: "#3f3f46" }}>⌘K</span>
            </div>
          </div>

          <main className="docs-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
