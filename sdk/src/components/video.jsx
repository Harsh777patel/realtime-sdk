import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import './video.css';


const VideoCall = ({
  apiKey,
  userId,
  name = "Guest",
  serverUrl = "http://localhost:5000",
  roomId = "default",
  iceServers = [{ urls: "stun:stun.l.google.com:19302" }],
}) => {
  const [inCall, setInCall] = useState(false);
  const [isCaller, setIsCaller] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);

  // Connect socket
  useEffect(() => {
    if (!apiKey) return;

    const socketInstance = io(serverUrl, {
      auth: { apiKey, userId, name, roomId },
    });

    socketRef.current = socketInstance;
    socketInstance.emit("join-room", { roomId, userId, name });

    return () => socketInstance.disconnect();
  }, [apiKey, serverUrl, roomId]);

  // Socket listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("offer", async (offer) => {
      peerConnectionRef.current = createPeerConnection();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current)
        localVideoRef.current.srcObject = stream;

      stream.getTracks().forEach((track) =>
        peerConnectionRef.current.addTrack(track, stream)
      );

      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("answer", answer);
      setInCall(true);
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current?.setRemoteDescription(answer);
    });

    socket.on("candidate", async (candidate) => {
      await peerConnectionRef.current?.addIceCandidate(candidate);
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({ iceServers });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("candidate", event.candidate);
      }
    };

    return pc;
  };

  const startCall = async () => {
    setIsCaller(true);
    setInCall(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current)
      localVideoRef.current.srcObject = stream;

    peerConnectionRef.current = createPeerConnection();

    stream.getTracks().forEach((track) =>
      peerConnectionRef.current.addTrack(track, stream)
    );

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socketRef.current?.emit("offer", offer);
  };

  const endCall = () => {
    setInCall(false);
    setIsCaller(false);

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (remoteVideoRef.current)
      remoteVideoRef.current.srcObject = null;
  };

  return (
    <div className="vc-container">
      <div className="vc-card">

        {/* Header */}
        <div className="vc-header">
          <h2>Video Call</h2>
          <span className={`vc-status ${inCall ? "active" : ""}`}>
            {inCall ? "Connected" : "Idle"}
          </span>
        </div>

        {/* Video Area */}
        <div className="vc-video-wrapper">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="vc-remote-video"
          />

          <div className="vc-local-wrapper">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="vc-local-video"
            />
          </div>

          {!inCall && (
            <div className="vc-overlay">
              <p>Start a call to connect</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="vc-controls">
          {!inCall ? (
            <button className="vc-btn start" onClick={startCall}>
              Start Call
            </button>
          ) : (
            <button className="vc-btn end" onClick={endCall}>
              End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;