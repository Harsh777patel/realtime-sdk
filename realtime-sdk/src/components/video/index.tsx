import React, { useEffect, useRef, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { RTCProps } from "../types";

const VideoCall: React.FC<RTCProps> = ({
  apiKey,
  userId,
  name = "Guest",
  serverUrl = "http://localhost:5000",
  roomId = "default",
  iceServers = [{ urls: "stun:stun.l.google.com:19302" }],
}) => {
  const [inCall, setInCall]           = useState(false);
  const [muted, setMuted]             = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream]   = useState<MediaStream | null>(null);

  const localVideoRef  = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef        = useRef<RTCPeerConnection | null>(null);
  const socketRef      = useRef<Socket | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  /* ── Sync streams → video elements whenever they change ── */
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  /* ── Create RTCPeerConnection ── */
  const createPC = useCallback((socket: Socket) => {
    const pc = new RTCPeerConnection({ iceServers });

    pc.ontrack = (e) => {
      // Use the stream that comes WITH the track — most reliable approach
      const stream = e.streams && e.streams[0] ? e.streams[0] : new MediaStream([e.track]);
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch(() => {});
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("candidate", e.candidate);
    };

    pc.onconnectionstatechange = () => {
      console.log("[VideoCall] connection state:", pc.connectionState);
    };

    return pc;
  }, [iceServers]);

  /* ── Flush queued ICE candidates ── */
  const flushCandidates = async (pc: RTCPeerConnection) => {
    for (const c of pendingCandidates.current) {
      await pc.addIceCandidate(c).catch(() => {});
    }
    pendingCandidates.current = [];
  };

  /* ── Single effect: connect socket + wire ALL events ── */
  useEffect((): any => {
    if (!apiKey) return;

    const socket = io(serverUrl, {
      auth: { apiKey, userId, name, roomId },
    });
    socketRef.current = socket;
    socket.emit("join-room", { roomId, userId, name });

    /* Answerer: receives offer → auto-answers */
    socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
      // Clean up any existing peer
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }
      pendingCandidates.current = [];

      const pc = createPC(socket);
      peerRef.current = pc;

      // Get local media first (so answerer's tracks are included in SDP)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      }
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      await pc.setRemoteDescription(offer);
      await flushCandidates(pc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", answer);
      setInCall(true);
    });

    /* Caller: receives answer */
    socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
      const pc = peerRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(answer);
      await flushCandidates(pc);
    });

    /* Both: receive ICE candidates */
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

  /* ── Caller: starts the call ── */
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

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch {
      stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    }
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play().catch(() => {});
    }
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", offer);
    setInCall(true);
  };

  const endCall = () => {
    socketRef.current?.emit("call-ended", { roomId });
    cleanup();
  };

  const cleanup = () => {
    peerRef.current?.close();
    peerRef.current = null;
    pendingCandidates.current = [];

    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);

    if (localVideoRef.current)  localVideoRef.current.srcObject  = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    setInCall(false);
    setMuted(false);
  };

  const toggleMute = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setMuted((m) => !m);
  };

  /* ─── styles ─── */
  const wrap: React.CSSProperties = {
    background: "#0f172a", borderRadius: 16, overflow: "hidden",
    fontFamily: "system-ui, sans-serif", color: "#fff", padding: 16,
  };
  const videoGrid: React.CSSProperties = {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16,
  };
  const videoBox: React.CSSProperties = {
    position: "relative", background: "#1e293b", borderRadius: 12,
    overflow: "hidden", aspectRatio: "16/9", display: "flex",
    alignItems: "center", justifyContent: "center",
  };
  const videoStyle: React.CSSProperties = {
    width: "100%", height: "100%", objectFit: "cover", display: "block",
  };
  const labelStyle: React.CSSProperties = {
    position: "absolute", bottom: 8, left: 10, fontSize: 12,
    background: "rgba(0,0,0,0.55)", padding: "2px 8px",
    borderRadius: 20, color: "#e2e8f0", pointerEvents: "none",
  };
  const placeholderStyle: React.CSSProperties = {
    position: "absolute", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 8, color: "#475569", fontSize: 13,
  };
  const ctrlBar: React.CSSProperties = {
    display: "flex", gap: 12, justifyContent: "center", alignItems: "center",
  };
  const btnBase: React.CSSProperties = {
    border: "none", cursor: "pointer", borderRadius: 50, width: 52, height: 52,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, transition: "transform .15s, box-shadow .15s",
  };
  const startBtn: React.CSSProperties = {
    ...btnBase, background: "linear-gradient(135deg,#22c55e,#16a34a)",
    boxShadow: "0 0 18px rgba(34,197,94,.45)", borderRadius: 14,
    width: "auto", padding: "0 24px", fontSize: 15, fontWeight: 700, gap: 8, height: 48,
  };
  const endBtn: React.CSSProperties = {
    ...btnBase, background: "linear-gradient(135deg,#ef4444,#b91c1c)",
    boxShadow: "0 0 18px rgba(239,68,68,.45)",
  };
  const muteBtn: React.CSSProperties = {
    ...btnBase, background: muted ? "#334155" : "#1e40af",
    boxShadow: muted ? "none" : "0 0 14px rgba(59,130,246,.4)",
  };

  return (
    <div style={wrap}>
      <div style={videoGrid}>
        {/* Remote */}
        <div style={videoBox}>
          <video ref={remoteVideoRef} autoPlay playsInline style={videoStyle} />
          {!remoteStream && (
            <div style={placeholderStyle}>
              <span style={{ fontSize: 36 }}>👤</span>
              <span>{inCall ? "Connecting…" : "Waiting for peer…"}</span>
            </div>
          )}
          <span style={labelStyle}>Remote</span>
        </div>

        {/* Local */}
        <div style={videoBox}>
          <video ref={localVideoRef} autoPlay playsInline muted style={videoStyle} />
          {!localStream && (
            <div style={placeholderStyle}>
              <span style={{ fontSize: 36 }}>🎥</span>
              <span>Your camera</span>
            </div>
          )}
          <span style={labelStyle}>You ({name})</span>
        </div>
      </div>

      <div style={ctrlBar}>
        {!inCall ? (
          <button style={startBtn} onClick={startCall}>
            📹 Start Video Call
          </button>
        ) : (
          <>
            <button style={muteBtn} onClick={toggleMute} title={muted ? "Unmute" : "Mute"}>
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

export default VideoCall;