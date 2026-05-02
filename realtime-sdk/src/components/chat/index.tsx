import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Message } from "../types";
import "./Chat.css";

interface Props {
  apiKey: string;
  userId: string;
  name?: string;
  serverUrl?: string;
  roomId?: string;
  position?: string;
}

const Chat: React.FC<Props> = ({
  apiKey,
  userId,
  name = "Guest",
  serverUrl = "http://localhost:5000",
  roomId = "default",
  position
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
  }, [apiKey, userId, name, serverUrl, roomId]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="whatsapp-container">
      {/* Header */}
      <div className="whatsapp-header">
        <div className="whatsapp-avatar">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="whatsapp-header-info">
          <h2>{name}</h2>
          <p>Room: {roomId}</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="whatsapp-messages">
        {messages.length === 0 && (
          <div className="whatsapp-empty">
            <p>Send a message to start the chat</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`whatsapp-message-wrapper ${m.type}`}>
            <div className={`whatsapp-message ${m.type}`}>
              <span className="text">{m.text}</span>
              <span className="time">{m.time}</span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="whatsapp-input-area">
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="whatsapp-input"
        />
        <button onClick={send} disabled={!input.trim()} className="whatsapp-send-btn">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chat;