"use client";
import React, { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Examples", href: "/examples" },
  { label: "Changelog", href: "/changelog" },
  { label: "GitHub", href: "https://github.com" },
];

const FEATURES = [
  {
    icon: "💬",
    title: "Real-Time Chat",
    desc: "WebSocket-powered messaging with typing indicators, read receipts, message threading, and file attachments — production-ready out of the box.",
    color: "#6366f1",
    href: "/docs/chat",
    badge: "Popular",
  },
  {
    icon: "🎥",
    title: "Video Calling",
    desc: "Crystal-clear WebRTC peer-to-peer and group video calls with adaptive bitrate, screen sharing, and recording support.",
    color: "#10b981",
    href: "/docs/video",
    badge: null,
  },
  {
    icon: "🎧",
    title: "Audio Calling",
    desc: "Low-latency audio with noise cancellation, microphone level indicators, DTMF tones, and SIP gateway integration.",
    color: "#f59e0b",
    href: "/docs/audio",
    badge: null,
  },
];

const STEPS = [
  { num: "01", title: "Install the SDK", code: "npm install @yoursdk/core" },
  { num: "02", title: "Add your API key", code: `import { SDK } from "@yoursdk/core";\nconst sdk = new SDK({ apiKey: "YOUR_KEY" });` },
  { num: "03", title: "Drop in a component", code: `<Chat userId="u_123" roomId="room_1" />` },
];

const STATS = [
  { value: "< 50ms", label: "Average latency" },
  { value: "99.99%", label: "Uptime SLA" },
  { value: "180+", label: "Countries" },
  { value: "10M+", label: "Messages/day" },
];

export default function LandingPage() {
  const [copied, setCopied] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{ fontFamily: "'DM Mono', 'Fira Code', monospace", background: "#09090b", color: "#fafafa", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-glow {
          position: absolute;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
          top: -200px; left: 50%; transform: translateX(-50%);
          pointer-events: none;
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          color: #a1a1aa;
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #fafafa; }

        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          background: #6366f1;
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-primary:hover { background: #4f46e5; transform: translateY(-1px); }

        .btn-ghost {
          font-family: 'DM Sans', sans-serif;
          background: transparent;
          color: #a1a1aa;
          border: 1px solid #27272a;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-ghost:hover { border-color: #52525b; color: #fafafa; transform: translateY(-1px); }

        .feature-card {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 16px;
          padding: 28px;
          cursor: pointer;
          transition: border-color 0.25s, transform 0.25s;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          display: block;
        }
        .feature-card:hover { transform: translateY(-4px); }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .feature-card:hover::before { opacity: 1; }

        .code-block {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 12px;
          padding: 20px 24px;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: #a1a1aa;
          position: relative;
          overflow-x: auto;
        }
        .code-block code { white-space: pre; color: #e4e4e7; }
        .code-block .kw { color: #818cf8; }
        .code-block .str { color: #34d399; }
        .code-block .cmt { color: #52525b; }

        .copy-btn {
          position: absolute;
          top: 12px; right: 12px;
          background: #1c1c1f;
          border: 1px solid #27272a;
          color: #71717a;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .copy-btn:hover { color: #fafafa; border-color: #52525b; }

        .step-num {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #6366f1;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .stat-value {
          font-family: 'DM Mono', monospace;
          font-size: 32px;
          font-weight: 500;
          color: #fafafa;
          letter-spacing: -0.02em;
        }

        .badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          padding: 3px 8px;
          border-radius: 99px;
          border: 1px solid rgba(99,102,241,0.3);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #52525b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .divider { border: none; border-top: 1px solid #1c1c1f; margin: 0; }

        .animate-in {
          animation: fadeUp 0.6s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .terminal-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(9,9,11,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1c1c1f" : "1px solid transparent",
        transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 48px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "#6366f1", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14 }}>⚡</span>
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 15, color: "#fafafa", letterSpacing: "-0.02em" }}>
            StreamKit
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6366f1", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", padding: "1px 7px", borderRadius: 4, marginLeft: 4 }}>
            v2.4
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a href="/login" className="btn-ghost">Sign in</a>
          <a href="/signup" className="btn-primary">Get API Key →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", paddingTop: 160, paddingBottom: 100, textAlign: "center", overflow: "hidden" }}>
        <div className="hero-glow" />

        {/* terminal-style eyebrow */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#111113", border: "1px solid #27272a", borderRadius: 8, padding: "6px 14px", marginBottom: 32 }}>
          <span className="terminal-dot" style={{ background: "#ef4444" }} />
          <span className="terminal-dot" style={{ background: "#f59e0b" }} />
          <span className="terminal-dot" style={{ background: "#10b981" }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#71717a", marginLeft: 6 }}>
            <span style={{ color: "#6366f1" }}>→</span> npm install @yoursdk/core
          </span>
        </div>

        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(42px, 6vw, 76px)",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1.08,
          maxWidth: 820,
          margin: "0 auto 24px",
          color: "#fafafa",
        }}>
          Real-time comms<br />
          <span style={{ color: "#52525b" }}>for modern apps.</span>
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 18,
          color: "#71717a",
          maxWidth: 520,
          margin: "0 auto 44px",
          lineHeight: 1.6,
          fontWeight: 300,
        }}>
          Drop-in chat, audio, and video components. One SDK. Zero WebRTC headaches.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <a href="/docs" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
            Start building →
          </a>
          <a href="/docs" className="btn-ghost" style={{ fontSize: 15, padding: "12px 28px" }}>
            View docs
          </a>
        </div>

        {/* Hero code preview */}
        <div style={{ maxWidth: 680, margin: "60px auto 0", position: "relative" }}>
          <div style={{ background: "#111113", border: "1px solid #1c1c1f", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: "1px solid #1c1c1f", display: "flex", alignItems: "center", gap: 8 }}>
              <span className="terminal-dot" style={{ background: "#ef4444" }} />
              <span className="terminal-dot" style={{ background: "#f59e0b" }} />
              <span className="terminal-dot" style={{ background: "#10b981" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginLeft: 8 }}>app.tsx</span>
            </div>
            <div style={{ padding: "24px 28px", textAlign: "left" }}>
              <pre style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.7, color: "#71717a", overflow: "auto" }}>{`import { Chat, VideoCall } from <span style="color:#34d399">"@yoursdk/core"</span>;

export default function App() {
  return (
    <span style="color:#52525b">{/* 3 lines. That's it. */}</span>
    <<span style="color:#818cf8">Chat</span>       apiKey=<span style="color:#34d399">"sk_live_..."</span> roomId=<span style="color:#34d399">"room_1"</span> />
    <<span style="color:#818cf8">VideoCall</span>  apiKey=<span style="color:#34d399">"sk_live_..."</span> roomId=<span style="color:#34d399">"room_1"</span> />
  );
}`}</pre>
            </div>
          </div>
          {/* glow under hero card */}
          <div style={{ position: "absolute", bottom: -40, left: "20%", right: "20%", height: 80, background: "radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />
        </div>
      </section>

      <hr className="divider" />

      {/* STATS */}
      <section style={{ padding: "56px 48px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            textAlign: "center",
            padding: "24px",
            borderRight: i < 3 ? "1px solid #1c1c1f" : "none",
          }}>
            <div className="stat-value">{s.value}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#52525b", marginTop: 6, fontWeight: 300 }}>{s.label}</div>
          </div>
        ))}
      </section>

      <hr className="divider" />

      {/* FEATURES */}
      <section style={{ padding: "80px 48px" }}>
        <div style={{ marginBottom: 48 }}>
          <div className="section-label">// components</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 36, fontWeight: 500, letterSpacing: "-0.03em", color: "#fafafa", maxWidth: 480 }}>
            Everything you need, nothing you don't.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <a
              href={f.href}
              key={i}
              className="feature-card"
              style={{ "--accent": f.color, borderColor: "#1c1c1f", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = f.color + "55"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1c1c1f"}
            >
              <style>{`.feature-card:nth-child(${i+1})::before { background: linear-gradient(90deg, ${f.color}, transparent); }`}</style>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: f.color + "18",
                  border: `1px solid ${f.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>
                  {f.icon}
                </div>
                {f.badge && <span className="badge">{f.badge}</span>}
              </div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#fafafa", marginBottom: 10, letterSpacing: "-0.02em" }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#71717a", lineHeight: 1.65, fontWeight: 300 }}>
                {f.desc}
              </p>
              <div style={{ marginTop: 20, fontFamily: "'DM Mono', monospace", fontSize: 12, color: f.color, opacity: 0.8 }}>
                Read docs →
              </div>
            </a>
          ))}
        </div>

        {/* secondary feature grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 16 }}>
          {[
            { title: "Live Streaming", desc: "Broadcast to thousands with sub-500ms latency." },
            { title: "Presence & Typing", desc: "Show who's online and typing in real time." },
            { title: "Webhooks & Events", desc: "React to any real-time event server-side." },
          ].map((f, i) => (
            <div key={i} style={{
              background: "#111113",
              border: "1px solid #1c1c1f",
              borderRadius: 16,
              padding: "24px 28px",
            }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: "#d4d4d8", marginBottom: 8, letterSpacing: "-0.01em" }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#52525b", lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* GET STARTED */}
      <section style={{ padding: "80px 48px" }}>
        <div className="section-label">// quickstart</div>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 36, fontWeight: 500, letterSpacing: "-0.03em", color: "#fafafa", marginBottom: 48 }}>
          Up and running in 3 steps.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {STEPS.map((step, i) => (
            <div key={i}>
              <div className="step-num">{step.num}</div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: "#d4d4d8", marginBottom: 14, letterSpacing: "-0.01em" }}>
                {step.title}
              </h3>
              <div className="code-block" style={{ position: "relative" }}>
                <code>{step.code}</code>
                <button className="copy-btn" onClick={() => copy(step.code, i)}>
                  {copied === i ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* CTA */}
      <section style={{ padding: "100px 48px", textAlign: "center" }}>
        <div style={{
          maxWidth: 640,
          margin: "0 auto",
          background: "#111113",
          border: "1px solid #27272a",
          borderRadius: 24,
          padding: "64px 48px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div className="section-label" style={{ marginBottom: 16 }}>// start today</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 36, fontWeight: 500, letterSpacing: "-0.03em", color: "#fafafa", marginBottom: 16 }}>
            Ship real-time features this week.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#71717a", marginBottom: 32, fontWeight: 300, lineHeight: 1.6 }}>
            Free tier includes 10,000 messages/month. No credit card required.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <a href="/signup" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
              Get your free API key →
            </a>
            <a href="/docs" className="btn-ghost" style={{ fontSize: 15, padding: "12px 28px" }}>
              Read the docs
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1c1c1f", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#3f3f46" }}>
          © 2025 StreamKit. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Status", "Twitter"].map(l => (
            <a key={l} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#52525b", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "#a1a1aa"}
              onMouseLeave={e => e.currentTarget.style.color = "#52525b"}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
