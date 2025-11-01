import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const VideoCall = () => {
  const [inCall, setInCall] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    socket.on("offer", async (offer) => {
      peerConnectionRef.current = createPeerConnection();

      // Receiver apna local stream attach karega
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
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
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    });

    socket.on("candidate", async (candidate) => {
      try {
        await peerConnectionRef.current.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding received ice candidate", err);
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      console.log("📹 Remote stream received:", event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(() => {});
      }
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

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;

    peerConnectionRef.current = createPeerConnection();
    stream.getTracks().forEach((track) =>
      peerConnectionRef.current.addTrack(track, stream)
    );

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  const endCall = () => {
    setInCall(false);
    setIsCaller(false);

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }

    localVideoRef.current.srcObject = null;
    remoteVideoRef.current.srcObject = null;
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-4 border rounded-xl shadow-lg bg-gray-100 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Video Call</h2>

      {/* Video Display */}
      <div className="w-full h-64 bg-black rounded-lg overflow-hidden mb-4 relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-32 h-32 absolute bottom-2 right-2 border-2 border-white rounded-lg object-cover"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-2">
        {!inCall ? (
          <button
            onClick={startCall}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Start Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
          >
            End Call
          </button>
        )}
      </div>

      {/* Status */}
      <p className="text-gray-700 text-sm">
        {inCall
          ? isCaller
            ? "📞 You started the call"
            : "📥 Incoming call connected"
          : "❌ Not in call"}
      </p>
    </div>
  );
};

export default VideoCall;
