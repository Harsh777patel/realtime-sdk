import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './audio.css';

const AudioCall = ({
  apiKey,
  userId,
  name = "Guest",
  serverUrl = "http://localhost:5000",
  roomId = "default",
  iceServers = [{ urls: "stun:stun.l.google.com:19302" }],
}) => {
  const [inCall, setInCall] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  /* =========================
     SOCKET CONNECTION
  ========================= */
  useEffect(() => {
    if (!apiKey) return;

    const socketInstance = io(serverUrl, {
      auth: { apiKey, userId, name, roomId },
    });

    socketRef.current = socketInstance;

    socketInstance.emit("join-room", { roomId, userId, name });

    return () => socketInstance.disconnect();
  }, [apiKey, serverUrl, roomId]);

  /* =========================
     SOCKET LISTENERS
  ========================= */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("offer", async (offer) => {
      peerConnectionRef.current = createPeerConnection();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      localStreamRef.current = stream;
      setupAudioAnalyser(stream);

      stream.getTracks().forEach((track) =>
        peerConnectionRef.current.addTrack(track, stream)
      );

      await peerConnectionRef.current.setRemoteDescription(offer);

      // ✅ Flush queued candidates
      await flushCandidates();

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("answer", answer);
      setInCall(true);
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current?.setRemoteDescription(answer);

      // ✅ Flush queued candidates
      await flushCandidates();
    });

    socket.on("candidate", async (candidate) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate);
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, []);

  /* =========================
     FLUSH ICE QUEUE
  ========================= */
  const flushCandidates = async () => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    for (const c of pendingCandidatesRef.current) {
      await pc.addIceCandidate(c);
    }

    pendingCandidatesRef.current = [];
  };

  /* =========================
     PEER CONNECTION
  ========================= */
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers });

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("candidate", event.candidate);
      }
    };

    return pc;
  };

  /* =========================
     AUDIO ANALYSER
  ========================= */
  const setupAudioAnalyser = (stream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const updateLevel = () => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);

      const avg =
        data.reduce((sum, val) => sum + val, 0) / data.length;

      setAudioLevel(avg);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  /* =========================
     START CALL
  ========================= */
  const startCall = async () => {
    setIsCaller(true);
    setInCall(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    localStreamRef.current = stream;
    setupAudioAnalyser(stream);

    peerConnectionRef.current = createPeerConnection();

    stream.getTracks().forEach((track) =>
      peerConnectionRef.current.addTrack(track, stream)
    );

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socketRef.current?.emit("offer", offer);
  };

  /* =========================
     END CALL
  ========================= */
  const endCall = () => {
    setInCall(false);
    setIsCaller(false);
    setAudioLevel(0);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    pendingCandidatesRef.current = [];
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="audio-container">
      <div className="audio-card">

        {/* Header */}
        <div className="audio-header">
          <h2>Audio Call</h2>
          <span className={`audio-status ${inCall ? "active" : ""}`}>
            {inCall ? "Connected" : "Idle"}
          </span>
        </div>

        {/* Avatar / Call Visual */}
        <div className="audio-visual">
          <div className="avatar">
            {name?.[0]?.toUpperCase()}
          </div>

          {inCall && (
            <div className="pulse-ring"></div>
          )}
        </div>

        {/* Status */}
        <p className="audio-text">
          {inCall
            ? isCaller
              ? "You are in call"
              : "Incoming call"
            : "Start a call"}
        </p>

        {/* Controls */}
        <div className="audio-controls">
          {!inCall ? (
            <button className="btn start" onClick={startCall}>
              📞 Start
            </button>
          ) : (
            <button className="btn end" onClick={endCall}>
              ❌ End
            </button>
          )}
        </div>

        {/* Hidden audio */}
        <audio ref={remoteAudioRef} autoPlay />

        {/* Audio Meter */}
        {inCall && (
          <div className="audio-meter">
            <div
              className="audio-bar"
              style={{ width: `${(audioLevel / 255) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );

};

export default AudioCall;