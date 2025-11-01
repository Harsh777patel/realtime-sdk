import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const AudioCall = () => {
  const [inCall, setInCall] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    socket.on("offer", async (offer) => {
      peerConnectionRef.current = createPeerConnection();
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", answer);
      setInCall(true);
    });

    socket.on("answer", async (answer) => {
      await peerConnectionRef.current.setRemoteDescription(answer);
    });

    socket.on("candidate", async (candidate) => {
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding received ICE candidate", err);
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const setupAudioAnalyser = (stream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const updateLevel = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      setAudioLevel(average);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", event.candidate);
      }
    };

    return pc;
  };

  const startCall = async () => {
    setIsCaller(true);
    setInCall(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    setupAudioAnalyser(stream);

    peerConnectionRef.current = createPeerConnection();
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, stream);
    });

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  const endCall = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAudioLevel(0);
    setInCall(false);
    setIsCaller(false);
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-lg bg-white flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-6">Audio Call</h2>

      {/* Status */}
      <p className="mb-4 text-gray-700">
        {inCall ? (isCaller ? "You are in call" : "Incoming call") : "Not in call"}
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        {!inCall ? (
          <button
            onClick={startCall}
            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
          >
            End Call
          </button>
        )}
      </div>

      {/* Remote audio */}
      <div className="w-full mt-4">
        <audio ref={remoteAudioRef} autoPlay controls className="w-full rounded-md" />
      </div>

      {/* Audio Level Meter */}
      {inCall && (
        <div className="w-full mt-4">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-100"
              style={{ 
                width: `${(audioLevel / 255) * 100}%`,
                backgroundColor: audioLevel > 128 ? '#ef4444' : '#22c55e'
              }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Microphone Level: {Math.round((audioLevel / 255) * 100)}%
          </div>
        </div>
      )}

      {/* Connection Status */}
      {inCall && (
        <div className="mt-4 text-sm text-gray-500">
          Microphone is active 🎤
        </div>
      )}
    </div>
  );
};

export default AudioCall;