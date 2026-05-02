"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { IconMessages, IconVideo, IconMicrophone, IconPaint, IconArrowRight, IconBolt, IconShieldCheck, IconWorld, IconChartBar, IconCopy, IconCheck, IconPlayerPlay, IconX } from "@tabler/icons-react";

const FEATURES = [
  { icon: <IconMessages size={28} />, title: "", desc: "WebSocket-powered messaging with typing indicators, read receipts, emoji reactions and file sharing.", color: "#818cf8", bg: "rgba(99,102,241,0.12)", img: "/chat_preview.png", link: "/docs/chat"},
  { icon: <IconVideo size={28} />, title: "Video Calling", desc: "Crystal-clear WebRTC group video with adaptive bitrate, noise cancellation, and screen sharing.", color: "#34d399", bg: "rgba(16,185,129,0.12)", img: "/dashboard_preview.png",  link: "/docs/video" },
  { icon: <IconMicrophone size={28} />, title: "Audio Calling", desc: "Studio-quality audio calls with echo cancellation, SIP gateway and real-time transcription.", color: "#fbbf24", bg: "rgba(245,158,11,0.12)", img: null,  link: "/docs/audio" },
  { icon: <IconPaint size={28} />, title: "Smart Whiteboard", desc: "Collaborative infinite canvas with shape recognition, laser pointer, and cloud persistence.", color: "#f472b6", bg: "rgba(236,72,153,0.12)", img: "/whiteboard_preview.png",  link: "/docs/whiteboard" },
];

const STATS = [
  { value: "< 50ms", label: "Latency", icon: <IconBolt size={24} />, color: "#fbbf24" },
  { value: "99.99%", label: "Uptime SLA", icon: <IconShieldCheck size={24} />, color: "#34d399" },
  { value: "180+", label: "Countries", icon: <IconWorld size={24} />, color: "#60a5fa" },
  { value: "10M+", label: "Events/Day", icon: <IconChartBar size={24} />, color: "#a78bfa" },
];

const STEPS = [
  { num: "01", title: "Install", code: "npm install reactify-library-x" },
  { num: "02", title: "Initialize", code: 'import { SDK } from "reactify-library-x";\nconst sdk = new SDK({ apiKey: "sk_live_..." });' },
  { num: "03", title: "Render", code: '<VideoCall roomId="room_1" userId="user_1" />' },
];

const LOGOS = ["Vercel", "Stripe", "Linear", "Notion", "Loom", "Figma", "Supabase", "Railway"];

export default function LandingPage() {
  const [copied, setCopied] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => { setIsLogged(!!localStorage.getItem('token')); }, []);

  const copy = (code, id) => { navigator.clipboard.writeText(code); setCopied(id); setTimeout(() => setCopied(null), 1800); };

  return (
    <div style={{ background: "#030712", color: "#f8fafc", minHeight: "100vh", overflowX: "hidden", fontFamily: "'Outfit',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        .mono{font-family:'DM Mono',monospace}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes shimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse-ring{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:0}}
        .fade-up{animation:fadeUp 0.7s ease forwards}
        .float{animation:float 5s ease-in-out infinite}
        .grad-text{background:linear-gradient(135deg,#f8fafc 0%,#c7d2fe 40%,#818cf8 70%,#6366f1 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .shimmer-btn{background:linear-gradient(90deg,#4f46e5,#7c3aed,#6366f1,#4f46e5);background-size:300% auto;animation:shimmer 2.5s linear infinite;box-shadow:0 0 40px rgba(99,102,241,0.5)}
        .glass{background:rgba(255,255,255,0.03);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
        .feature-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:24px;transition:all 0.4s cubic-bezier(0.4,0,0.2,1);overflow:hidden}
        .feature-card:hover{transform:translateY(-6px);border-color:rgba(99,102,241,0.4);box-shadow:0 24px 64px rgba(99,102,241,0.18)}
        .stat-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:20px;transition:all 0.3s}
        .stat-card:hover{transform:translateY(-3px);border-color:rgba(99,102,241,0.35);box-shadow:0 16px 40px rgba(99,102,241,0.12)}
        .logo-pill{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:12px 24px;font-size:14px;font-weight:600;color:#64748b;white-space:nowrap;transition:all 0.2s}
        .logo-pill:hover{background:rgba(255,255,255,0.07);color:#94a3b8}
        .step-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:32px;transition:all 0.3s}
        .step-card:hover{border-color:rgba(99,102,241,0.3);background:rgba(99,102,241,0.05)}
        .img-frame{border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);box-shadow:0 32px 80px rgba(0,0,0,0.6)}
        .play-btn{width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);border:2px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s;position:relative}
        .play-btn::before{content:'';position:absolute;inset:-8px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);animation:pulse-ring 2s ease-in-out infinite}
        .play-btn:hover{transform:scale(1.1);background:rgba(255,255,255,0.25)}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px}
        section{position:relative;z-index:10}
      `}</style>

      <AnimatedBackground intensity="high" />
      {/* ambient glows */}
      <div style={{ position: 'fixed', top: '-15%', left: '5%', width: '55vw', height: '55vh', background: 'radial-gradient(ellipse,rgba(99,102,241,0.18) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '0', width: '45vw', height: '45vh', background: 'radial-gradient(ellipse,rgba(168,85,247,0.12) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'fixed', top: '40%', left: '-10%', width: '30vw', height: '40vh', background: 'radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />

        {/* ═══ HERO ═══ */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px' }}>
          <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', borderRadius: '999px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)', color: '#818cf8', fontSize: '13px', fontWeight: 700, marginBottom: '32px', letterSpacing: '0.04em' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', display: 'inline-block', boxShadow: '0 0 8px #6366f1' }} />
            STREAMKIT SDK v2.4 IS NOW LIVE
          </div>

          <h1 className="grad-text fade-up" style={{ fontSize: 'clamp(54px,8.5vw,104px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '28px', animationDelay: '0.1s', maxWidth: '900px' }}>
            Ship Real-Time<br />Features in Minutes.
          </h1>

          <p className="fade-up" style={{ fontSize: 'clamp(16px,2vw,21px)', color: '#64748b', maxWidth: '580px', lineHeight: 1.7, marginBottom: '48px', animationDelay: '0.2s' }}>
            Drop-in React components for video calls, audio, chat, and collaborative whiteboards. Production-ready on day one.
          </p>

          <div className="fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginBottom: '64px', animationDelay: '0.3s' }}>
            <Link href={isLogged ? "/user/dashboard" : "/signup"} className="shimmer-btn" style={{ padding: '16px 40px', borderRadius: '14px', color: '#fff', fontWeight: 800, fontSize: '17px', display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', letterSpacing: '-0.01em' }}>
              {isLogged ? "Open Dashboard" : "Start Building Free"} <IconArrowRight size={20} />
            </Link>
            <button onClick={() => setVideoOpen(true)} style={{ padding: '16px 36px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#e2e8f0', fontWeight: 700, fontSize: '17px', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', backdropFilter: 'blur(12px)' }}>
              <IconPlayerPlay size={20} style={{ color: '#818cf8' }} /> Watch Demo
            </button>
          </div>

          {/* Hero dashboard image */}
          <div className="float fade-up" style={{ width: '100%', maxWidth: '1100px', animationDelay: '0.4s', position: 'relative' }}>
            <div className="img-frame" style={{ width: '100%', aspectRatio: '16/9', background: '#0a0a14', position: 'relative', overflow: 'hidden' }}>
              <video
                src="/video_demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
              {/* play overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,7,18,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button className="play-btn" onClick={() => setVideoOpen(true)}>
                  <IconPlayerPlay size={30} style={{ color: '#fff', marginLeft: '4px' }} />
                </button>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', width: '70%', height: '60px', background: 'radial-gradient(ellipse,rgba(99,102,241,0.35) 0%,transparent 70%)', filter: 'blur(20px)' }} />
          </div>
        </section>

        {/* ═══ LOGOS / TRUSTED BY ═══ */}
        <section style={{ padding: '64px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#334155', marginBottom: '32px' }}>TRUSTED BY TEAMS AT</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
            {LOGOS.map((l, i) => <div key={i} className="logo-pill">{l}</div>)}
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-card" style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{ color: s.color, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                <div className="mono" style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#475569', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section style={{ padding: '120px 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '72px', textAlign: 'center' }}>
            <p className="mono" style={{ color: '#6366f1', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>// Components</p>
            <h2 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, maxWidth: '700px', margin: '0 auto' }}>
              Four components.<br /><span style={{ color: '#334155' }}>Infinite possibilities.</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ display: 'grid', gridTemplateColumns: f.img ? '1fr 1fr' : '1fr', gap: 0, alignItems: 'stretch', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                {/* Text side */}
                <div style={{ padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: '28px', border: `1px solid ${f.color}30` }}>{f.icon}</div>
                  <h3 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '16px' }}>{f.title}</h3>
                  <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '16px', marginBottom: '32px' }}>{f.desc}</p>
                  {/* <Link href={`/docs/${f.title.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: f.color, fontWeight: 700, fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    View Documentation <IconArrowRight size={18} />
                  </Link> */}
                  <Link 
  href={f.link}
  style={{
    color: f.color,
    fontWeight: 700,
    fontSize: '15px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  }}
>
  View Documentation <IconArrowRight size={18} />
</Link>
                </div>
                {/* Image side */}
                {f.img && (
                  <div style={{ background: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', minHeight: '380px', order: i % 2 === 0 ? 1 : 0 }}>
                    <Image src={f.img} alt={f.title} fill style={{ objectFit: 'cover', opacity: 0.9 }} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${i % 2 === 0 ? 'to right' : 'to left'},rgba(3,7,18,0) 60%,rgba(3,7,18,0.3) 100%)` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ═══ VIDEO SECTION ═══ */}
        <section style={{ padding: '120px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <p className="mono" style={{ color: '#6366f1', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>// Live Preview</p>
              <h2 style={{ fontSize: 'clamp(34px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}>See it in action.<br /><span style={{ color: '#334155' }}>Real calls, zero setup.</span></h2>
              <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '16px', marginBottom: '40px' }}>Watch how StreamKit components integrate into any React project in under 60 seconds. No backend configuration. No devOps headaches. Just working real-time features.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[{ label: 'End-to-end encrypted', color: '#34d399' }, { label: 'WebRTC P2P & SFU modes', color: '#818cf8' }, { label: 'Auto-reconnect on network loss', color: '#fbbf24' }].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: b.color, display: 'inline-block', boxShadow: `0 0 8px ${b.color}`, flexShrink: 0 }} />
                    <span style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 500 }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Video thumbnail */}
            <div style={{ position: 'relative' }}>
              <div className="img-frame" style={{ width: '100%', aspectRatio: '16/10', position: 'relative', overflow: 'hidden', background: '#0a0a14' }}>
                {/* <Image src="/dashboard_preview.png" alt="Video call demo" fill style={{ objectFit: 'cover' }} /> */}
                <video
                src="/video_demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,7,18,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button className="play-btn" onClick={() => setVideoOpen(true)}>
                    <IconPlayerPlay size={32} style={{ color: '#fff', marginLeft: '4px' }} />
                  </button>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'rgba(99,102,241,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '16px 20px' }}>
                <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>LIVE PARTICIPANTS</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.03em' }}>2,847</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ QUICKSTART ═══ */}
        <section style={{ padding: '120px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
              <p className="mono" style={{ color: '#6366f1', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>// Quickstart</p>
              <h2 style={{ fontSize: 'clamp(34px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.03em' }}>Up and running in 3 steps.</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
              {STEPS.map((s, i) => (
                <div key={i} className="step-card">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '56px', fontWeight: 900, color: 'rgba(99,102,241,0.2)', lineHeight: 1, letterSpacing: '-0.05em' }}>{s.num}</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{s.title}</h3>
                  </div>
                  <div style={{ background: '#070710', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px', position: 'relative' }}>
                    <pre className="mono" style={{ fontSize: '13px', color: '#94a3b8', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.9 }}>{s.code}</pre>
                    <button onClick={() => copy(s.code, i)} style={{ position: 'absolute', top: '12px', right: '12px', padding: '7px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: copied === i ? '#34d399' : '#475569', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' }}>
                      {copied === i ? <IconCheck size={15} /> : <IconCopy size={15} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SHOWCASE ROW ═══ */}
        <section style={{ padding: '0 24px 120px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="img-frame" style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', background: '#0a0a14' }}>
                <Image src="/chat_preview.png" alt="Chat component" fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', background: 'linear-gradient(to top,rgba(3,7,18,0.95),transparent)' }}>
                  <p style={{ fontWeight: 800, fontSize: '18px', marginBottom: '4px' }}>Chat SDK</p>
                  <p style={{ color: '#64748b', fontSize: '13px' }}>Drop-in messaging for any app</p>
                </div>
              </div>
              <div className="img-frame" style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', background: '#0a0a14' }}>
                {/* <Image src="/whiteboard_preview.png" alt="Whiteboard component" fill style={{ objectFit: 'cover' }} /> */}
                 <video
                src="/whiteboard-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', background: 'linear-gradient(to top,rgba(3,7,18,0.95),transparent)' }}>
                  <p style={{ fontWeight: 800, fontSize: '18px', marginBottom: '4px' }}>Smart Whiteboard</p>
                  <p style={{ color: '#64748b', fontSize: '13px' }}>Collaborative canvas that thinks</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section style={{ padding: '0 24px 120px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: '32px', padding: '100px 60px', textAlign: 'center', background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)', border: '1px solid rgba(139,92,246,0.35)', boxShadow: '0 40px 100px rgba(99,102,241,0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', background: 'radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', background: 'radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%)' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px' }}>Build the future,<br />one message at a time.</h2>
              <p style={{ color: 'rgba(199,210,254,0.8)', fontSize: '18px', marginBottom: '48px', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 48px' }}>Free tier includes 10k events/month. No credit card. No enterprise sales calls. Ship today.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                <Link href="/signup" style={{ padding: '18px 48px', borderRadius: '14px', background: '#fff', color: '#1e1b4b', fontWeight: 900, fontSize: '17px', textDecoration: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>Get Your API Key</Link>
                <Link href="/docs" style={{ padding: '18px 48px', borderRadius: '14px', border: '2px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, fontSize: '17px', textDecoration: 'none' }}>View Examples</Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* ═══ VIDEO MODAL ═══ */}
      {videoOpen && (
        <div className="modal-overlay" onClick={() => setVideoOpen(false)}>
          <div style={{ width: '100%', maxWidth: '960px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setVideoOpen(false)} style={{ position: 'absolute', top: '-48px', right: '0', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconX size={20} />
            </button>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#0a0a14', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
              {/* <Image src="/dashboard_preview.png" alt="Demo video" fill style={{ objectFit: 'cover' }} /> */}
              <video
                src="/video_demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,7,18,0.5)' }}>
                <p style={{ color: '#64748b', fontSize: '16px' }}>🎬 Your demo video goes here — replace /dashboard_preview.png with a &lt;video&gt; tag</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
