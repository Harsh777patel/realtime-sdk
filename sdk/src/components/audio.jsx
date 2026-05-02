'use client';
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
  accentColor = "#6366f1"
}) => {
  const [inCall, setInCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const animationFrameRef = useRef(null);
  const pendingCandidates = useRef([]);

  useEffect(() => {
    if (!apiKey) return;
    socketRef.current = io(serverUrl, { auth: { apiKey, userId, name, roomId } });
    socketRef.current.emit("join-room", { roomId, userId, name });

    socketRef.current.on("offer", handleReceiveOffer);
    socketRef.current.on("answer", handleReceiveAnswer);
    socketRef.current.on("candidate", handleReceiveCandidate);

    return () => socketRef.current.disconnect();
  }, [apiKey, serverUrl, roomId]);

  const createPeer = () => {
    const pc = new RTCPeerConnection({ iceServers });
    pc.ontrack = (e) => {
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = e.streams[0];
    };
    pc.onicecandidate = (e) => {
      if (e.candidate) socketRef.current.emit("candidate", e.candidate);
    };
    return pc;
  };

  const setupAnalyser = (stream) => {
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    
    const update = () => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b) / data.length;
      setAudioLevel(avg);
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const startCall = async () => {
    setIsCalling(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    setupAnalyser(stream);
    peerConnectionRef.current = createPeer();
    stream.getTracks().forEach(t => peerConnectionRef.current.addTrack(t, stream));
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socketRef.current.emit("offer", offer);
    setInCall(true);
  };

  const handleReceiveOffer = async (offer) => {
    peerConnectionRef.current = createPeer();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    setupAnalyser(stream);
    stream.getTracks().forEach(t => peerConnectionRef.current.addTrack(t, stream));
    await peerConnectionRef.current.setRemoteDescription(offer);
    
    for (const c of pendingCandidates.current) {
      await peerConnectionRef.current.addIceCandidate(c);
    }
    pendingCandidates.current = [];

    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);
    socketRef.current.emit("answer", answer);
    setInCall(true);
  };

  const handleReceiveAnswer = async (answer) => {
    await peerConnectionRef.current.setRemoteDescription(answer);
    for (const c of pendingCandidates.current) {
      await peerConnectionRef.current.addIceCandidate(c);
    }
    pendingCandidates.current = [];
  };

  const handleReceiveCandidate = async (candidate) => {
    if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } else {
      pendingCandidates.current.push(candidate);
    }
  };

  const endCall = () => {
    setInCall(false);
    setIsCalling(false);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    peerConnectionRef.current?.close();
    pendingCandidates.current = [];
    localStreamRef.current?.getTracks().forEach(t => t.stop());
  };

  return (
    <div className="sk-audio-widget">
      <div className="sk-call-info">
         <div className="sk-avatar-large" style={{ 
           background: accentColor,
           boxShadow: `0 0 ${audioLevel / 2}px ${accentColor}`
         }}>
           {name[0]}
         </div>
         <h3 className="sk-caller-name">{name}</h3>
         <p className="sk-call-status">{inCall ? 'Line Active' : 'Available for voice'}</p>
      </div>

      <div className="sk-call-actions">
        {!inCall ? (
          <button className="sk-call-btn" onClick={startCall} style={{ background: '#10b981' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Start Call
          </button>
        ) : (
          <button className="sk-call-btn end" onClick={endCall} style={{ background: '#ef4444' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 21 18-18"/><path d="M7 5 3.1 8.9a3 3 0 0 0 0 4.2l9.8 9.8a3 3 0 0 0 4.2 0l3.9-3.9"/><path d="m15 11 2-2"/><path d="m11 15 2-2"/></svg>
            End Session
          </button>
        )}
      </div>
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
};

export default AudioCall;