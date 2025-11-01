"use client";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function Broadcast() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const connectedRef = useRef(false);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on("broadcast", (payload) => {
      // payload = { text, from, time }
      setAnnouncements((prev) => [payload, ...prev]);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const sendBroadcast = () => {
    if (!message.trim() || !socket) return;
    const payload = { text: message.trim(), time: Date.now() };
    // Server should broadcast this payload to all clients
    socket.emit("broadcast", payload);
    setAnnouncements((prev) => [ { ...payload, from: "You" }, ...prev ]);
    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-3">📢 Broadcast</h3>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write announcement..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button onClick={sendBroadcast} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Send
        </button>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Broadcasts</h4>
        <ul className="space-y-3 max-h-60 overflow-y-auto">
          {announcements.map((a, i) => (
            <li key={i} className="p-3 bg-gray-50 rounded-md border">
              <div className="text-sm text-gray-800">{a.text}</div>
              <div className="text-xs text-gray-500 mt-1">{a.from ? a.from : "Admin"} • {new Date(a.time).toLocaleString()}</div>
            </li>
          ))}
          {announcements.length === 0 && <li className="text-sm text-gray-500">No broadcasts yet.</li>}
        </ul>
      </div>
    </div>
  );
}
