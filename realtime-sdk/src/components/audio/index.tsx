import React, { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { RTCProps } from "../types";

const AudioCall: React.FC<RTCProps> = ({
  apiKey,
  userId,
  name = "Guest",
  serverUrl = "http://localhost:5000",
  roomId = "default",
  iceServers = [{ urls: "stun:stun.l.google.com:19302" }],
}) => {
  const [inCall, setInCall]       = useState(false);
  const [muted, setMuted]         = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const remoteAudioRef    = useRef<HTMLAudioElement | null>(null);
  const peerRef           = useRef<RTCPeerConnection | null>(null);
  const socketRef         = useRef<Socket | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const timerRef          = useRef<ReturnType<typeof setInterval> | null>(null);
  const localStreamRef    = useRef<MediaStream | null>(null);

  /* ── Sync remote stream → audio element ── */
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  /* ── Create RTCPeerConnection ── */
  const createPC = useCallback((socket: Socket) => {
    const pc = new RTCPeerConnection({ iceServers });

    pc.ontrack = (e) => {
      const stream = e.streams && e.streams[0] ? e.streams[0] : new MediaStream([e.track]);
      setRemoteStream(stream);
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch(() => {});
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("candidate", e.candidate);
    };

    pc.onconnectionstatechange = () => {
      console.log("[AudioCall] connection state:", pc.connectionState);
    };

    return pc;
  }, [iceServers]);

  const flushCandidates = async (pc: RTCPeerConnection) => {
    for (const c of pendingCandidates.current) {
      await pc.addIceCandidate(c).catch(() => {});
    }
    pendingCandidates.current = [];
  };

  const startTimer = () => {
    setCallDuration(0);
    timerRef.current = setInterval(() => setCallDuration((s) => s + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setCallDuration(0);
  };

  /* ── Single effect: connect + wire events ── */
  useEffect((): any => {
    if (!apiKey) return;

    const socket = io(serverUrl, {
      auth: { apiKey, userId, name, roomId },
    });
    socketRef.current = socket;
    socket.emit("join-room", { roomId, userId, name });

    /* Answerer: auto-answer incoming offer */
    socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
      pendingCandidates.current = [];

      const pc = createPC(socket);
      peerRef.current = pc;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      await pc.setRemoteDescription(offer);
      await flushCandidates(pc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", answer);
      setInCall(true);
      startTimer();
    });

    /* Caller: receives answer */
    socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
      const pc = peerRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(answer);
      await flushCandidates(pc);
    });

    /* Both: ICE candidates */
    socket.on("candidate", async (candidate: RTCIceCandidateInit) => {
      const pc = peerRef.current;
      if (pc && pc.remoteDescription) {
        await pc.addIceCandidate(candidate).catch(() => {});
      } else {
        pendingCandidates.current.push(candidate);
      }
    });

    socket.on("call-ended", () => cleanup());

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [apiKey]); // eslint-disable-line

  /* ── Caller: start call ── */
  const startCall = async () => {
    const socket = socketRef.current;
    if (!socket) return;

    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    pendingCandidates.current = [];
    setRemoteStream(null);

    const pc = createPC(socket);
    peerRef.current = pc;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", offer);
    setInCall(true);
    startTimer();
  };

  const endCall = () => {
    socketRef.current?.emit("call-ended", { roomId });
    cleanup();
  };

  const cleanup = () => {
    peerRef.current?.close();
    peerRef.current = null;
    pendingCandidates.current = [];

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setRemoteStream(null);

    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    setInCall(false);
    setMuted(false);
    stopTimer();
  };

  const toggleMute = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setMuted((m) => !m);
  };

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ── styles ── */
  const wrap: React.CSSProperties = {
    background: "linear-gradient(145deg, #0f172a, #1e293b)", borderRadius: 20,
    padding: 28, display: "flex", flexDirection: "column", alignItems: "center",
    gap: 20, fontFamily: "system-ui, sans-serif", color: "#fff",
    minHeight: 220, justifyContent: "center", boxShadow: "0 8px 32px rgba(0,0,0,.4)",
  };
  const avatar: React.CSSProperties = {
    width: 80, height: 80, borderRadius: "50%",
    background: inCall ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "#1e293b",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
    boxShadow: inCall ? "0 0 0 4px rgba(99,102,241,.35)" : "none",
    transition: "all .3s", border: inCall ? "2px solid #6366f1" : "2px solid #334155",
  };
  const statusText: React.CSSProperties = {
    fontSize: 13, color: inCall ? "#86efac" : "#64748b",
    fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
  };
  const timerStyle: React.CSSProperties = {
    fontSize: 22, fontWeight: 700, color: "#e2e8f0",
    letterSpacing: 2, fontVariantNumeric: "tabular-nums",
  };
  const ctrlBar: React.CSSProperties = { display: "flex", gap: 14, alignItems: "center" };
  const btnBase: React.CSSProperties = {
    border: "none", cursor: "pointer", borderRadius: 50, width: 54, height: 54,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, transition: "transform .15s, box-shadow .15s",
  };
  const startBtn: React.CSSProperties = {
    ...btnBase, background: "linear-gradient(135deg,#22c55e,#16a34a)",
    boxShadow: "0 0 20px rgba(34,197,94,.5)", borderRadius: 14,
    width: "auto", padding: "0 28px", fontSize: 15, fontWeight: 700, gap: 8, height: 50,
  };
  const endBtn: React.CSSProperties = {
    ...btnBase, background: "linear-gradient(135deg,#ef4444,#b91c1c)",
    boxShadow: "0 0 20px rgba(239,68,68,.5)",
  };
  const muteBtn: React.CSSProperties = {
    ...btnBase, background: muted ? "#334155" : "#1e40af",
    boxShadow: muted ? "none" : "0 0 14px rgba(59,130,246,.4)",
  };

  return (
    <div style={wrap}>
      <audio ref={remoteAudioRef} autoPlay playsInline />

      <div style={avatar}>{inCall ? "🎙️" : "👤"}</div>

      <div style={{ textAlign: "center" }}>
        <p style={statusText}>
          {inCall
            ? remoteStream ? "🟢 Connected" : "⏳ Connecting…"
            : "Tap to start audio call"}
        </p>
        <p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0" }}>
          Room: <strong>{roomId}</strong> · You: <strong>{name}</strong>
        </p>
      </div>

      {inCall && <div style={timerStyle}>{formatTime(callDuration)}</div>}

      <div style={ctrlBar}>
        {!inCall ? (
          <button style={startBtn} onClick={startCall}>
            📞 Start Audio Call
          </button>
        ) : (
          <>
            <button style={muteBtn} onClick={toggleMute} title={muted ? "Unmute mic" : "Mute mic"}>
              {muted ? "🔇" : "🎙️"}
            </button>
            <button style={endBtn} onClick={endCall} title="End call">
              📵
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioCall;