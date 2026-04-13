import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Message } from "../types";

interface Props {
  apiKey: string;
  userId: string;
  name?: string;
  serverUrl?: string;
  roomId?: string;
}

const Chat: React.FC<Props> = ({
  apiKey,
  userId,
  name = "Guest",
  serverUrl = "http://localhost:5000",
  roomId = "default",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect((): any => {
    const socket = io(serverUrl, {
      auth: { apiKey, userId, name, roomId },
    });

    socketRef.current = socket;
    socket.emit("join-room", { roomId, userId, name });

    socket.on("rec-message", (msg: string) => {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((p) => [...p, { text: msg, type: "received", time }]);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;

    socketRef.current?.emit("send-message", input);

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((p) => [...p, { text: input, type: "sent", time }]);
    setInput("");
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.type === "sent" ? "justify-end" : "justify-start"}`}>
            <div className="bg-gray-700 px-3 py-2 rounded-lg max-w-xs">
              {m.text}
              <div className="text-xs opacity-60 text-right">{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex p-3 gap-2 bg-gray-800">
        <input
          className="flex-1 p-2 rounded-lg bg-gray-700 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={send} className="bg-blue-500 px-4 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;