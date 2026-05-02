import React, { useMemo, useState, useRef, useEffect } from "react";
import { Chat, Whiteboard, VideoCall, AudioCall } from "reactify-library-x";
import "reactify-library-x/dist/cjs/styles.css";
import io from "socket.io-client";

const API_KEY = "sk_c40cd993612a2c41e8a8b402c652df31bf87e1601ec7fb51b51651a45a062eaf";
const SERVER_URL = "http://localhost:5000";
const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];



/* ─────────────────────── Main App ─────────────────────── */

export default function App() {
  const [apiKey, setApiKey] = useState(API_KEY);
  const [showApiInput, setShowApiInput] = useState(!API_KEY || API_KEY === "sk_c40cd993612a2c41e8a8b402c652df31bf87e1601ec7fb51b51651a45a062eaf");
  
  const userId = useMemo(() => "user_" + Math.random().toString(36).slice(2, 8), []);



  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      {showApiInput && (
        <div style={{
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          border: "1px solid #475569",
          borderRadius: 16,
          padding: 32,
          maxWidth: 600,
          margin: "0 auto 40px",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
            🔑 API Key Required
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: 24, fontSize: 15 }}>
            Please enter your API key to use the demo features
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <input
              type="password"
              placeholder="sk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                flex: 1,
                padding: "12px 16px",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: 8,
                color: "#f1f5f9",
                fontSize: 14,
                outline: "none"
              }}
              onKeyPress={(e) => e.key === "Enter" && setShowApiInput(false)}
            />
            <button
              onClick={() => apiKey.length > 10 && setShowApiInput(false)}
              style={{
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 28px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Continue
            </button>
          </div>
          <p style={{ color: "#64748b", fontSize: 13 }}>
            Get your API key from the <a href="/admin/keys" style={{ color: "#6366f1", textDecoration: "none" }}>dashboard</a>
          </p>
        </div>
      )}

      {!showApiInput && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
          <h2 style={{ color: "#f1f5f9", marginBottom: 0, fontSize: 22, fontWeight: 800 }}>
            🚀 Demo App – All Components
          </h2>
          <button
            onClick={() => { setShowApiInput(true); setApiKey(""); }}
            style={{
              background: "#475569",
              color: "#e2e8f0",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 13,
              cursor: "pointer"
            }}
          >
            Change API Key
          </button>
        </div>
      )}

      {!showApiInput && (
        <>
          {/* ── WHITEBOARD ── */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: "#94a3b8", marginBottom: 10, fontSize: 15 }}>🖊️ Whiteboard</h3>
            <div style={{ height: 400, background: "white", borderRadius: 12, overflow: "hidden" }}>
              <Whiteboard apiKey={apiKey} userId={userId} roomId="demo" serverUrl={SERVER_URL} />
            </div>
          </section>

          {/* ── VIDEO CALL ── */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: "#94a3b8", marginBottom: 10, fontSize: 15 }}>📹 Video Call</h3>
            <div style={{ borderRadius: 16, overflow: "hidden" }}>
              <VideoCall apiKey={apiKey} userId={userId} name="Demo User" roomId="demo-video" serverUrl={SERVER_URL} />
            </div>
          </section>

          {/* ── AUDIO CALL ── */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: "#94a3b8", marginBottom: 10, fontSize: 15 }}>🎙️ Audio Call</h3>
            <div style={{ borderRadius: 20, overflow: "hidden" }}>
              <AudioCall apiKey={apiKey} userId={userId} name="Demo User" roomId="demo-audio" serverUrl={SERVER_URL} />
            </div>
          </section>

          {/* ── CHAT ── */}
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ color: "#94a3b8", marginBottom: 10, fontSize: 15 }}>💬 Chat</h3>
            <div style={{ height: 500, background: "#1e293b", borderRadius: 12, overflow: "hidden" }}>
              <Chat apiKey={apiKey} userId={userId} roomId="demo" serverUrl={SERVER_URL} position="bottom-right" />
            </div>
          </section>
        </>
      )}
    </div>
  );
}