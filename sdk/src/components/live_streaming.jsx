"use client";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function LiveStreaming() {
  const [streaming, setStreaming] = useState(false);
  const [recording, setRecording] = useState(false);
  const localVideoRef = useRef(null);
  const playbackRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // create socket but don't auto connect until user starts preview
    socketRef.current = io(SOCKET_URL, { autoConnect: false });

    // receive remote live-stream chunks (very simple playback)
    socketRef.current.on("live-stream-chunk", (data) => {
      // data expected as ArrayBuffer (or base64). Here we assume binary (blob)
      const blob = new Blob([data], { type: "video/webm" });
      // Simple append-play approach - create object URL and play once
      try {
        const url = URL.createObjectURL(blob);
        playbackRef.current.src = url;
        playbackRef.current.play().catch(() => {});
        // release after a short time
        setTimeout(() => URL.revokeObjectURL(url), 30000);
      } catch (err) {
        // ignore
      }
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off("live-stream-chunk");
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startPreview = async () => {
    if (!localVideoRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
    await localVideoRef.current.play().catch(() => {});
    socketRef.current.connect();
    setStreaming(true);
  };

  const stopPreview = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localVideoRef.current.srcObject = null;
    setStreaming(false);
    socketRef.current.disconnect();
  };

  const startStream = () => {
    if (!localStreamRef.current) return;
    // create MediaRecorder (webm)
    const options = { mimeType: "video/webm; codecs=vp8,opus" };
    const mr = new MediaRecorder(localStreamRef.current, options);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];

    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);

        // send each chunk to server (small, near-realtime)
        // server should broadcast to viewers: socket.on('live-stream-chunk', (chunk) => socket.broadcast.emit('live-stream-chunk', chunk))
        socketRef.current.emit("live-stream-chunk", e.data);
      }
    };

    mr.onstop = () => {
      // optionally assemble final blob
      setRecording(false);
    };

    mr.start(1000); // timeslice (ms) — emit roughly every second
    setRecording(true);
  };

  const stopStream = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 rounded-xl bg-white shadow-lg">
      <h3 className="text-xl font-semibold mb-3">📡 Live Streaming</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Local preview */}
        <div className="bg-gray-900 rounded-lg overflow-hidden relative">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 object-cover bg-black"
          />
          <div className="p-2 absolute top-2 left-2">
            <span className={`px-2 py-1 rounded ${streaming ? "bg-green-600" : "bg-gray-400"} text-white text-sm`}>
              {streaming ? "Preview ON" : "Preview OFF"}
            </span>
          </div>
        </div>

        {/* Remote playback */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <video ref={playbackRef} controls className="w-full h-64 object-cover bg-black" />
          <div className="p-2 text-gray-200 text-sm">Remote playback (incoming chunks)</div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap gap-3">
        {!streaming ? (
          <button onClick={startPreview} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Start Preview</button>
        ) : (
          <button onClick={stopPreview} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">Stop Preview</button>
        )}

        {!recording ? (
          <button
            onClick={startStream}
            disabled={!streaming}
            className={`px-4 py-2 rounded-lg font-medium ${streaming ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            Start Stream
          </button>
        ) : (
          <button onClick={stopStream} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Stop Stream</button>
        )}

        <p className="text-sm text-gray-600 mt-2 w-full">
          Note: This component sends recorded chunks to the Socket.IO server as binary blobs. On the server, broadcast `live-stream-chunk` to viewers (or forward to an RTMP/streaming pipeline).
        </p>
      </div>
    </div>
  );
}
