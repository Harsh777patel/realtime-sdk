'use client';
import CodeBlock from "@/components/CodeBlock";

const props = [
  { name: "apiKey", type: "string", required: true, desc: "Your StreamKit API key. Obtain from the dashboard." },
  { name: "userId", type: "string", required: true, desc: "Unique identifier for the current user." },
  { name: "name", type: "string", required: false, desc: "Display name shown in the chat UI." },
  { name: "roomId", type: "string", required: false, desc: "Join a specific room. Omit for a new DM thread." },
  { name: "theme", type: "'dark' | 'light' | 'auto'", required: false, desc: "UI color scheme. Defaults to 'auto'." },
  { name: "onMessage", type: "(msg: Message) => void", required: false, desc: "Callback fired on every incoming message." },
];

const events = [
  { event: "onConnect", desc: "Fired when the WebSocket connection is established." },
  { event: "onDisconnect", desc: "Fired on connection drop or manual disconnect." },
  { event: "onMessage", desc: "Called with a Message object on every new message." },
  { event: "onTyping", desc: "Indicates another user is typing in the room." },
  { event: "onError", desc: "Called with an Error object if something goes wrong." },
];

export default function ChatDocs() {
  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        .chat-docs * { box-sizing: border-box; }

        .section-card {
          background: #111113;
          border: 1px solid #1c1c1f;
          border-radius: 14px;
          padding: 28px;
          margin-bottom: 24px;
          transition: border-color 0.2s;
        }
        .section-card:hover { border-color: #27272a; }

        .section-card.indigo { border-left: 2px solid #6366f1; }
        .section-card.purple { border-left: 2px solid #818cf8; }

        .props-table { width: 100%; border-collapse: collapse; }
        .props-table th {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #52525b;
          text-align: left;
          padding: 0 0 10px;
          border-bottom: 1px solid #1c1c1f;
          font-weight: 400;
        }
        .props-table td {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #a1a1aa;
          padding: 10px 0;
          border-bottom: 1px solid #111113;
          vertical-align: top;
        }
        .props-table tr:last-child td { border-bottom: none; }
        .props-table .prop-name { color: #e4e4e7; min-width: 120px; }
        .props-table .prop-type { color: #818cf8; min-width: 160px; padding-right: 20px; }
        .props-table .prop-desc { color: #71717a; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 300; line-height: 1.5; }

        .required-badge {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #ef4444;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          padding: 1px 5px;
          border-radius: 3px;
          margin-left: 6px;
          vertical-align: middle;
        }

        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #1c1c1f;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #a1a1aa;
          font-weight: 300;
          margin: 0 6px 6px 0;
        }
        .feature-pill::before {
          content: '';
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
        }

        .callout {
          background: rgba(99,102,241,0.06);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 10px;
          padding: 16px 18px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .callout-icon {
          flex-shrink: 0;
          width: 18px; height: 18px;
          background: rgba(99,102,241,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          margin-top: 1px;
        }
      `}</style>

      <div className="chat-docs">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              💬
            </div>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em" }}>component</div>
              <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 30, fontWeight: 500, letterSpacing: "-0.03em", color: "#fafafa" }}>
                Chat SDK
              </h1>
            </div>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#71717a", lineHeight: 1.65, fontWeight: 300, maxWidth: 520 }}>
            Real-time messaging powered by WebSockets. Supports rooms, threads, reactions, and file uploads.
          </p>
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap" }}>
            {["Typing indicators", "Read receipts", "File uploads", "Message threading", "Reactions", "Webhooks"].map(f => (
              <span key={f} className="feature-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* Installation */}
        <div className="section-card indigo">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#6366f1", marginBottom: 12, letterSpacing: "0.05em" }}>
            01 / install
          </div>
          <CodeBlock code={`npm install @yoursdk/core`} />
        </div>

        {/* Basic usage */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 12, letterSpacing: "0.05em" }}>
            02 / usage
          </div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 16 }}>
            Basic usage
          </h2>
          <CodeBlock
            code={`import { Chat } from "@yoursdk/core";

export default function App() {
  return (
    <Chat
      apiKey="sk_live_YOUR_KEY"
      userId="user_123"
      name="Jane Doe"
      roomId="room_general"
    />
  );
}`}
          />
        </div>

        {/* Advanced */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 12, letterSpacing: "0.05em" }}>
            03 / events
          </div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 16 }}>
            With event handlers
          </h2>
          <CodeBlock
            code={`import { Chat } from "@yoursdk/core";

export default function App() {
  return (
    <Chat
      apiKey="sk_live_YOUR_KEY"
      userId="user_123"
      name="Jane Doe"
      roomId="room_support"
      onMessage={(msg) => console.log("New:", msg)}
      onConnect={() => console.log("Connected")}
      onError={(err) => console.error(err)}
    />
  );
}`}
          />
        </div>

        {/* Props */}
        <div className="section-card purple">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#818cf8", marginBottom: 16, letterSpacing: "0.05em" }}>
            04 / props
          </div>
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

        {/* Events */}
        <div className="section-card">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#52525b", marginBottom: 16, letterSpacing: "0.05em" }}>
            05 / events
          </div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 500, color: "#d4d4d8", letterSpacing: "-0.02em", marginBottom: 20 }}>
            Event callbacks
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map((e) => (
              <div key={e.event} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <code style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#818cf8", minWidth: 130, flexShrink: 0, paddingTop: 1 }}>
                  {e.event}
                </code>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#71717a", fontWeight: 300, lineHeight: 1.5 }}>
                  {e.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Callout */}
        <div className="callout">
          <div className="callout-icon">💡</div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#818cf8", fontWeight: 500, marginBottom: 4 }}>
              Pro tip
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#71717a", lineHeight: 1.6, fontWeight: 300 }}>
              For multi-tenant apps, generate a scoped JWT instead of exposing your raw API key on the client. See the{" "}
              <a href="/docs/auth" style={{ color: "#818cf8", textDecoration: "none" }}>authentication guide</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
