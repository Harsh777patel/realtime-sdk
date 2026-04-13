'use client';
import CodeBlock from "@/components/CodeBlock";

const props = [
  { name: "apiKey", type: "string", required: true, desc: "Your StreamKit API key." },
  { name: "userId", type: "string", required: true, desc: "Unique identifier for the current participant." },
  { name: "name", type: "string", required: false, desc: "Display name shown above the video tile." },
  { name: "roomId", type: "string", required: false, desc: "Room to join. Generates a new room if omitted." },
  { name: "maxParticipants", type: "number", required: false, desc: "Cap on concurrent participants. Default: 25." },
  { name: "enableScreenShare", type: "boolean", required: false, desc: "Show screen-share button. Default: true." },
  { name: "enableRecording", type: "boolean", required: false, desc: "Allow recording the session. Default: false." },
  { name: "layout", type: "'grid' | 'spotlight' | 'sidebar'", required: false, desc: "Tile layout. Default: 'grid'." },
];

const features = [
  { title: "Adaptive bitrate", desc: "Adjusts quality based on network conditions automatically." },
  { title: "ICE / STUN / TURN", desc: "Full WebRTC infrastructure handled by StreamKit servers." },
  { title: "Screen sharing", desc: "One-click screen, window, or tab sharing for all participants." },
  { title: "Cloud recording", desc: "Save sessions to your S3 bucket or StreamKit storage." },
  { title: "Active speaker", desc: "Spotlights the loudest speaker in real time." },
  { title: "Virtual backgrounds", desc: "Blur or replace the background using ML models." },
];

export default function VideoDocs() {
  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        .video-docs * { box-sizing: border-box; }

        .section-card {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 14px;
          padding: 28px;
          margin-bottom: 24px;
          transition: border-color 0.2s;
        }
        .section-card:hover { border-color: #27272a; }
        .section-card.green { border-left: 2px solid #10b981; }

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
        .props-table .prop-name { color: #e4e4e7; min-width: 140px; }
        .props-table .prop-type { color: #34d399; min-width: 180px; padding-right: 20px; }
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

        .callout-warning {
          background: rgba(245,158,11,0.06);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 10px;
          padding: 16px 18px;
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }
      `}</style>

      <div className="video-docs">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              🎥
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em" }}>component</div>
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 30, fontWeight: 500, letterSpacing: "-0.03em", color: "#fafafa" }}>
                Video Call
              </h1>
            </div>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#71717a", lineHeight: 1.65, fontWeight: 300, maxWidth: 520 }}>
            Peer-to-peer and group video using WebRTC. Adaptive quality, screen sharing, and cloud recording included.
          </p>
        </div>

        {/* Install */}
        <div className="section-card green">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#10b981", marginBottom: 12, letterSpacing: "0.05em" }}>01 / install</div>
          <CodeBlock code={`npm install @yoursdk/core`} />
        </div>

        {/* Usage */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 12, letterSpacing: "0.05em" }}>02 / usage</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Basic usage
          </h2>
          <CodeBlock
            code={`import { VideoCall } from "@yoursdk/core";

export default function Meeting() {
  return (
    <VideoCall
      apiKey="sk_live_YOUR_KEY"
      userId="user_123"
      name="John Doe"
      roomId="room_standup"
    />
  );
}`}
          />
        </div>

        {/* Advanced with recording */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 12, letterSpacing: "0.05em" }}>03 / advanced</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 16 }}>
            With recording & events
          </h2>
          <CodeBlock
            code={`import { VideoCall } from "@yoursdk/core";

export default function Meeting() {
  return (
    <VideoCall
      apiKey="sk_live_YOUR_KEY"
      userId="user_123"
      name="John Doe"
      roomId="room_standup"
      layout="spotlight"
      enableRecording={true}
      enableScreenShare={true}
      maxParticipants={10}
      onParticipantJoin={(p) => console.log("Joined:", p.name)}
      onRecordingStart={(url) => console.log("Recording at:", url)}
    />
  );
}`}
          />
        </div>

        {/* Browser note */}
        <div className="callout-warning">
          <span style={{ fontSize: 14, marginTop: 1 }}>⚠</span>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#f59e0b", fontWeight: 500, marginBottom: 4 }}>
              HTTPS required
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#71717a", lineHeight: 1.6, fontWeight: 300 }}>
              Camera and microphone access require a secure context. Always serve your app over HTTPS in production.
            </div>
          </div>
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
                  <span style={{ color: "#10b981", marginTop: 1, fontSize: 12, flexShrink: 0 }}>✓</span>
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
