'use client';
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import './chat.css';

const Chat = ({
  apiKey,
  userId,
  name = "Guest",
  serverUrl = "http://localhost:5000",
  roomId = "default",
  accentColor = "#6366f1"
}) => {
  const [apiKeyError, setApiKeyError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(`sk_chat_${roomId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const verifyKeyAndConnect = async () => {
      if (!apiKey) {
        setApiKeyError("API key not configured");
        return;
      }

      try {
        await axios.post(`${serverUrl}/api/keys/validate-key`, {}, {
          headers: { "x-api-key": apiKey }
        });

        const socketInstance = io(serverUrl, {
          auth: { apiKey, userId, name, roomId }
        });

        setSocket(socketInstance);
      } catch (err) {
        setApiKeyError("Invalid or Expired API key");
      }
    };

    verifyKeyAndConnect();
  }, [apiKey, serverUrl, userId, name, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("rec-message", (msg) => {
      setMessages((prev) => [...prev, { 
        text: msg, 
        type: "received", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    });

    return () => socket.off("rec-message");
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    sessionStorage.setItem(`sk_chat_${roomId}`, JSON.stringify(messages));
  }, [messages, roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit("send-message", input);
      setMessages((prev) => [...prev, { 
        text: input, 
        type: "sent", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      setInput("");
    }
  };

  if (apiKeyError) return (
    <div className="sdk-error-box">
      <span className="error-icon">⚠️</span>
      <h4>SDK Config Error</h4>
      <p>{apiKeyError}</p>
      <code>Check your StreamKit dashboard for the correct key.</code>
    </div>
  );

  return (
    <div className="sk-chat-widget">
      <div className="sk-chat-header" style={{ borderTopColor: accentColor }}>
        <div className="sk-user-info">
          <div className="sk-avatar-mini" style={{ background: accentColor }}>{name[0]}</div>
          <div>
            <div className="sk-user-name">{name}</div>
            <div className="sk-status"><span className="sk-dot-online"></span> Support Sync</div>
          </div>
        </div>
      </div>

      <div className="sk-message-area">
        {messages.length === 0 && (
          <div className="sk-empty-state">
             <div className="sk-empty-icon">🗨️</div>
             <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`sk-msg-row ${msg.type}`}>
            {msg.type === "received" && (
              <div className="sk-avatar" style={{ background: "linear-gradient(135deg, #f59e0b, #ec4899)" }}>👥</div>
            )}
            <div className="sk-bubble">
              <div className="sk-text">{msg.text}</div>
              <div className="sk-time">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className="sk-input-area" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write something..."
          className="sk-input"
        />
        <button type="submit" className="sk-send-btn" style={{ background: accentColor }}>
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;