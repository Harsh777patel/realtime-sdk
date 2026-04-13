'use client';
import CodeBlock from "@/components/CodeBlock";

const props = [
  { name: "apiKey", type: "string", required: true, desc: "Your StreamKit API key." },
  { name: "userId", type: "string", required: true, desc: "Unique identifier for the current caller." },
  { name: "name", type: "string", required: false, desc: "Display name shown during the call." },
  { name: "roomId", type: "string", required: false, desc: "Room to join. A new room is created if omitted." },
  { name: "noiseSuppression", type: "boolean", required: false, desc: "Enable ML-based noise suppression. Default: true." },
  { name: "echoCancellation", type: "boolean", required: false, desc: "Hardware echo cancellation. Default: true." },
  { name: "showMicLevel", type: "boolean", required: false, desc: "Display an animated mic level bar. Default: true." },
  { name: "codec", type: "'opus' | 'pcm'", required: false, desc: "Audio codec. Opus is recommended for most cases." },
];

const features = [
  { title: "Low-latency streaming", desc: "Sub-100ms audio over WebRTC with OPUS codec." },
  { title: "Noise suppression", desc: "ML-powered background noise removal in real time." },
  { title: "Mic level indicator", desc: "Animated bar showing live microphone amplitude." },
  { title: "DTMF tones", desc: "Send touch-tone digits for IVR or phone tree navigation." },
  { title: "PSTN / SIP gateway", desc: "Bridge to standard telephone networks via SIP trunk." },
  { title: "Device switching", desc: "Swap mic or speaker mid-call without dropping." },
];

export default function AudioDocs() {
  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        .audio-docs * { box-sizing: border-box; }

        .section-card {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 14px;
          padding: 28px;
          margin-bottom: 24px;
          transition: border-color 0.2s;
        }
        .section-card:hover { border-color: #27272a; }
        .section-card.amber { border-left: 2px solid #f59e0b; }

        .props-table { width: 100%; border-collapse: collapse; }
        .props-table th {
          font-family: 'DM Mono', monospace;
          font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.1em; color: #52525b;
          text-align: left; padding: 0 0 10px;
          border-bottom: 1px solid #1c1c1f; font-weight: 400;
        }
        .props-table td {
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: #a1a1aa;
          padding: 10px 0; border-bottom: 1px solid #111113;
          vertical-align: top;
        }
        .props-table tr:last-child td { border-bottom: none; }
        .props-table .prop-name { color: #e4e4e7; min-width: 160px; }
        .props-table .prop-type { color: #fbbf24; min-width: 160px; padding-right: 20px; }
        .props-table .prop-desc { color: #71717a; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 300; line-height: 1.5; }

        .required-badge {
          font-family: 'DM Mono', monospace; font-size: 9px;
          color: #ef4444; background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          padding: 1px 5px; border-radius: 3px;
          margin-left: 6px; vertical-align: middle;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .feature-item {
          background: #0d0d0f;
          border: 1px solid #1c1c1f;
          border-radius: 10px;
          padding: 14px 16px;
        }

        .mic-demo {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 16px 20px;
          background: #0d0d0f;
          border: 1px solid #1c1c1f;
          border-radius: 10px;
          margin-top: 16px;
        }

        .bar {
          width: 3px;
          background: #f59e0b;
          border-radius: 2px;
          animation: micBounce 1s ease-in-out infinite;
        }

        @keyframes micBounce {
          0%, 100% { height: 6px; opacity: 0.4; }
          50% { height: var(--h); opacity: 1; }
        }
      `}</style>

      <div className="audio-docs">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              🎧
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em" }}>component</div>
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 30, fontWeight: 500, letterSpacing: "-0.03em", color: "#fafafa" }}>
                Audio Call
              </h1>
            </div>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#71717a", lineHeight: 1.65, fontWeight: 300, maxWidth: 520 }}>
            Lightweight WebRTC audio calling with noise suppression, mic visualizer, and PSTN gateway support.
          </p>

          {/* Mic level demo */}
          <div className="mic-demo" style={{ marginTop: 20, maxWidth: 300 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginRight: 10 }}>mic level</span>
            {[14, 22, 10, 28, 18, 8, 24, 16, 20, 12, 26, 14, 22, 10, 18].map((h, i) => (
              <div key={i} className="bar" style={{ "--h": `${h}px`, animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        </div>

        {/* Install */}
        <div className="section-card amber">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#f59e0b", marginBottom: 12, letterSpacing: "0.05em" }}>01 / install</div>
          <CodeBlock code={`npm install @yoursdk/core`} />
        </div>

        {/* Basic */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 12, letterSpacing: "0.05em" }}>02 / usage</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Basic usage
          </h2>
          <CodeBlock
            code={`import { AudioCall } from "@yoursdk/core";

export default function App() {
  return (
    <AudioCall
      apiKey="sk_live_YOUR_KEY"
      userId="user_123"
      name="Jane Doe"
    />
  );
}`}
          />
        </div>

        {/* Advanced */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 12, letterSpacing: "0.05em" }}>03 / advanced</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 16 }}>
            With all options
          </h2>
          <CodeBlock
            code={`import { AudioCall } from "@yoursdk/core";

export default function App() {
  return (
    <AudioCall
      apiKey="sk_live_YOUR_KEY"
      userId="user_123"
      name="Jane Doe"
      roomId="room_support"
      noiseSuppression={true}
      echoCancellation={true}
      showMicLevel={true}
      codec="opus"
      onConnect={() => console.log("Call connected")}
      onDisconnect={() => console.log("Call ended")}
      onError={(err) => console.error(err)}
    />
  );
}`}
          />
        </div>

        {/* Features */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 16, letterSpacing: "0.05em" }}>04 / features</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 18 }}>
            What's included
          </h2>
          <div className="feature-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-item">
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#f59e0b", marginTop: 1, fontSize: 12, flexShrink: 0 }}>✓</span>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#d4d4d8", marginBottom: 3 }}>
                      {f.title}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#52525b", fontWeight: 300, lineHeight: 1.5 }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Props */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 16, letterSpacing: "0.05em" }}>05 / props</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 20 }}>
            Component props
          </h2>
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {props.map((p) => (
                <tr key={p.name}>
                  <td className="prop-name">
                    {p.name}
                    {p.required && <span className="required-badge">required</span>}
                  </td>
                  <td className="prop-type">{p.type}</td>
                  <td className="prop-desc">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
