'use client';
import Link from "next/link";

const cards = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M18 3H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4l3 3 3-3h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M5 8h10M5 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: "Chat SDK",
    desc: "WebSocket-powered messaging with threads, reactions, typing indicators, and file uploads.",
    href: "/docs/chat",
    color: "#6366f1",
    tag: "Stable",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="4" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M14 8l5-3v10l-5-3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Video Call",
    desc: "WebRTC peer-to-peer and group video with adaptive quality, screen share, and recording.",
    href: "/docs/video",
    color: "#10b981",
    tag: "Stable",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 1a4 4 0 0 1 4 4v5a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3 9a7 7 0 0 0 14 0M10 16v3M7 19h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: "Audio Call",
    desc: "Low-latency audio with noise suppression, mic level indicators, and PSTN gateway.",
    href: "/docs/audio",
    color: "#f59e0b",
    tag: "Stable",
  },
];

const quickLinks = [
  { label: "Installation", code: "npm install @yoursdk/core", href: "#install" },
  { label: "Authentication", code: "new SDK({ apiKey: 'sk_...' })", href: "#auth" },
  { label: "First component", code: "<Chat roomId=\"room_1\" />", href: "#first" },
];

export default function DocsHome() {
  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        .docs-home * { box-sizing: border-box; }

        .doc-card {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 14px;
          padding: 24px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .doc-card:hover { transform: translateY(-2px); }

        .quick-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 10px;
          text-decoration: none;
          transition: border-color 0.15s;
          gap: 16px;
        }
        .quick-link:hover { border-color: #27272a; }
      `}</style>

      <div className="docs-home">
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            // overview
          </div>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 36, fontWeight: 500, letterSpacing: "-0.03em", color: "#fafafa", marginBottom: 14 }}>
            SDK Documentation
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#71717a", lineHeight: 1.65, fontWeight: 300, maxWidth: 560 }}>
            StreamKit gives you production-ready chat, video, and audio components that work out of the box. Drop them in, pass your API key, and ship.
          </p>
        </div>

        {/* Component cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 48 }}>
          {cards.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              className="doc-card"
              onMouseEnter={e => e.currentTarget.style.borderColor = c.color + "44"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1c1c1f"}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  width: 40, height: 40,
                  background: c.color + "15",
                  border: `1px solid ${c.color}25`,
                  borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: c.color,
                }}>
                  {c.icon}
                </div>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10, color: "#3f3f46",
                  background: "#1c1c1f",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}>
                  {c.tag}
                </span>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: "#fafafa", marginBottom: 6, letterSpacing: "-0.01em" }}>
                  {c.title}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#71717a", lineHeight: 1.6, fontWeight: 300 }}>
                  {c.desc}
                </div>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: c.color, marginTop: "auto" }}>
                Explore →
              </div>
            </Link>
          ))}
        </div>

        {/* Quick start */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
            // quick start
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {quickLinks.map((l, i) => (
              <a key={i} href={l.href} className="quick-link">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "2px 8px", borderRadius: 4, minWidth: 100, textAlign: "center" }}>
                    {l.label}
                  </span>
                  <code style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#71717a" }}>{l.code}</code>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: "#3f3f46" }}>
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
