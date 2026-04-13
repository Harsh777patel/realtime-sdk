import React, { useEffect, useRef, useState } from "react";
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
  const [inCall, setInCall] = useState(false);

  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  useEffect((): any => {
    const socket = io(serverUrl, {
      auth: { apiKey, userId, name, roomId },
    });

    socketRef.current = socket;
    socket.emit("join-room", { roomId, userId, name });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
      const pc = createPC();
      peerRef.current = pc;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      stream.getTracks().forEach((track) =>
        pc.addTrack(track, stream)
      );

      await pc.setRemoteDescription(offer);
      await flushCandidates();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", answer);
      setInCall(true);
    });

    socket.on("candidate", async (candidate: RTCIceCandidateInit) => {
      const pc = peerRef.current;
      if (!pc) return;

      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate);
      } else {
        pendingCandidates.current.push(candidate);
      }
    });
  }, []);

  const createPC = () => {
    const pc = new RTCPeerConnection({ iceServers });

    pc.ontrack = (e) => {
      if (remoteAudioRef.current)
        remoteAudioRef.current.srcObject = e.streams[0];
    };

    return pc;
  };

  const flushCandidates = async () => {
    const pc = peerRef.current;
    if (!pc) return;

    for (const c of pendingCandidates.current) {
      await pc.addIceCandidate(c);
    }
    pendingCandidates.current = [];
  };

  return (
    <div>
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
};

export default AudioCall;