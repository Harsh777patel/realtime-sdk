'use client';
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import './video.css';

const VideoCall = ({
  apiKey,
  userId,
  name = "Guest",
  serverUrl = "http://localhost:5000",
  roomId = "default",
  iceServers = [{ urls: "stun:stun.l.google.com:19302" }],
  accentColor = "#6366f1"
}) => {
  const [inCall, setInCall] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const pendingCandidates = useRef([]);

  useEffect(() => {
    if (!apiKey) return;
    socketRef.current = io(serverUrl, { auth: { apiKey, userId, name, roomId } });
    socketRef.current.emit("join-room", { roomId, userId, name });

    socketRef.current.on("offer", handleReceiveOffer);
    socketRef.current.on("answer", handleReceiveAnswer);
    socketRef.current.on("candidate", handleReceiveCandidate);

    const getDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(t => t.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        const vInputs = devices.filter(d => d.kind === "videoinput");
        setVideoDevices(vInputs);
        if (vInputs.length > 0) setSelectedVideoDevice(vInputs[0].deviceId);
      } catch(e) {}
    };
    getDevices();

    return () => {
      socketRef.current.disconnect();
      stopAllMedia();
    };
  }, [apiKey, serverUrl, roomId]);

  const stopAllMedia = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setHasRemoteVideo(false);
  };

  const createPeer = () => {
    const pc = new RTCPeerConnection({ iceServers });
    pc.ontrack = (e) => {
      const stream = e.streams && e.streams[0] ? e.streams[0] : new MediaStream([e.track]);
      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject && e.track.kind === 'video') {
           // Track already handled or append
           remoteVideoRef.current.srcObject = stream;
        } else {
           remoteVideoRef.current.srcObject = stream;
        }
      }
      setHasRemoteVideo(true);
    };
    pc.onicecandidate = (e) => {
      if (e.candidate) socketRef.current.emit("candidate", e.candidate);
    };
    return pc;
  };

  const startCall = async () => {
    try {
      const constraints = { 
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true, 
        audio: true 
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      
      peerConnectionRef.current = createPeer();
      stream.getTracks().forEach(t => peerConnectionRef.current.addTrack(t, stream));
      
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socketRef.current.emit("offer", offer);
      setInCall(true);
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const handleReceiveOffer = async (offer) => {
    const constraints = { 
      video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true, 
      audio: true 
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    streamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    
    peerConnectionRef.current = createPeer();
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
    peerConnectionRef.current?.close();
    pendingCandidates.current = [];
    stopAllMedia();
    setHasRemoteVideo(false);
  };

  const toggleMic = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicMuted(!audioTrack.enabled);
    }
  };

  const toggleCam = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCamOff(!videoTrack.enabled);
    }
  };

  const switchCamera = async () => {
    if (videoDevices.length < 2) return;
    const currentIndex = videoDevices.findIndex(d => d.deviceId === selectedVideoDevice);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    const nextDevice = videoDevices[nextIndex].deviceId;
    setSelectedVideoDevice(nextDevice);

    if (inCall && streamRef.current) {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: nextDevice } } });
        const newVideoTrack = newStream.getVideoTracks()[0];
        const oldVideoTrack = streamRef.current.getVideoTracks()[0];
        
        if (oldVideoTrack) {
          oldVideoTrack.stop();
          streamRef.current.removeTrack(oldVideoTrack);
        }
        streamRef.current.addTrack(newVideoTrack);
        if (localVideoRef.current) localVideoRef.current.srcObject = streamRef.current;
        
        const videoSender = peerConnectionRef.current?.getSenders().find(s => s.track?.kind === 'video');
        if (videoSender) videoSender.replaceTrack(newVideoTrack);
      } catch (err) {
        console.error("Failed to switch camera", err);
      }
    }
  };

  return (
    <div className="sk-video-widget">
      <div className="sk-video-stage">
        {hasRemoteVideo && (
          <video ref={remoteVideoRef} autoPlay playsInline className="sk-remote-video" />
        )}
        
        <div className={hasRemoteVideo ? "sk-pip-container" : "sk-fullscreen-local"}>
           <video ref={localVideoRef} autoPlay muted playsInline className="sk-local-video" />
           {isCamOff && <div className="sk-cam-off-overlay">Cam Off</div>}
        </div>

        {!inCall && (
          <div className="sk-landing-overlay">
             <div className="sk-preview-circle" style={{ background: accentColor }}>{name[0]}</div>
             <h2>Ready to join?</h2>
             <p>Host: {roomId}</p>
             {videoDevices.length > 0 && (
               <select 
                 value={selectedVideoDevice}
                 onChange={(e) => setSelectedVideoDevice(e.target.value)}
                 style={{ marginBottom: 20, padding: "10px 16px", borderRadius: 12, background: "rgba(0,0,0,0.5)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", outline: "none", fontSize: 14 }}
               >
                 {videoDevices.map((d, i) => (
                   <option key={d.deviceId} value={d.deviceId} style={{ background: "#18181b" }}>{d.label || `Camera ${i + 1}`}</option>
                 ))}
               </select>
             )}
             <button className="sk-join-btn" onClick={startCall} style={{ background: accentColor }}>Join Room</button>
          </div>
        )}

        {inCall && (
          <div className="sk-call-controls">
            <button className={`sk-control-btn ${isMicMuted ? 'muted' : ''}`} onClick={toggleMic}>
              {isMicMuted ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="2" x2="22" y2="22"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>}
            </button>
            
            <button className="sk-control-btn end" onClick={endCall}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="22" y1="2" x2="2" y2="22"/></svg>
            </button>

            <button className={`sk-control-btn ${isCamOff ? 'muted' : ''}`} onClick={toggleCam}>
              {isCamOff ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m16 16 3 3 3-3V7l-3 3-3-3v10Z"/><path d="M22 22 2 2"/><path d="M13 13H5a2 2 0 0 1-2-2V5c0-.6.2-1.1.6-1.4"/><path d="M16 10.4V7a2 2 0 0 0-2-2H9.6"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m16 10 6-6v16l-6-6V10Z"/><rect x="2" y="5" width="14" height="14" rx="2" ry="2"/></svg>}
            </button>

            {videoDevices.length > 1 && (
              <button className="sk-control-btn" onClick={switchCamera} title="Switch Camera">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/><polyline points="14 2 18 6"/></svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;