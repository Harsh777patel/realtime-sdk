import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import './chat.css';

const Chat = ({
  apiKey,
  userId,
  name = "Guest",
  email,
  serverUrl = "http://localhost:5000",
  roomId = "default",
  theme = "light",
  primaryColor = "#667eea",
  docsUrl = "https://yourplatform.com/docs"
}) => {
  const [apiKeyError, setApiKeyError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hoveredMessageIdx, setHoveredMessageIdx] = useState(null);
  const chatEndRef = useRef(null);

  // Validate API Key and connect socket
  useEffect(() => {
    const verifyKeyAndConnect = async () => {
      if (!apiKey) {
        setApiKeyError("API key not configured");
        return;
      }

      try {
        await axios.post(
          `${serverUrl}/api/keys/validate-key`,
          {},
          {
            headers: {
              "x-api-key": apiKey,
            },
          }
        );

        const socketInstance = io(serverUrl, {
          auth: {
            apiKey,
            userId,
            name,
            roomId,
          },
        });

        setSocket(socketInstance);
      } catch (err) {
        setApiKeyError("Invalid API key");
      }
    };

    verifyKeyAndConnect();
  }, [apiKey, serverUrl, userId, name, roomId]);

  // Join room after socket connect
  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", {
      roomId,
      userId,
      name,
    });

    socket.on("rec-message", (msg) => {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        { text: msg, type: "received", time, read: false },
      ]);
    });

    return () => {
      socket.off("rec-message");
    };
  }, [socket]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!socket) return;

    if (input.trim()) {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      socket.emit("send-message", input);

      setMessages((prev) => [
        ...prev,
        { text: input, type: "sent", time, read: true },
      ]);

      setInput("");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const getAvatarColor = (type) => {
    return type === "sent" ? primaryColor : "#764ba2";
  };

  const getInitial = (type) => {
    return type === "sent" ? name[0] : "S";
  };

  const isConsecutiveMessage = (currentIdx) => {
    if (currentIdx === 0) return false;
    return messages[currentIdx].type === messages[currentIdx - 1].type;
  };

  // API key error screen
  if (apiKeyError) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        fontFamily: "Segoe UI"
      }}>
        <div style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#ef4444" }}>
            API Key Not Configured
          </h2>

          <p>This chat widget requires an API key.</p>

          <div style={{
            background: "#111827",
            color: "#10b981",
            padding: "15px",
            borderRadius: "8px",
            textAlign: "left",
            fontSize: "13px"
          }}>
{`<script src="https://yourplatform.com/sdk.js"></script>
<script>
RealtimeSDK.init({
  apiKey: "YOUR_API_KEY",
  userId: "USER_ID",
  name: "John Doe"
});
</script>`}
          </div>

          <p style={{ marginTop: "20px" }}>
            See documentation:
          </p>

          <a href={docsUrl} target="_blank" rel="noreferrer">
            Integration Documentation →
          </a>
        </div>
      </div>
    );
  }

return (
  <div className="chat-container">
    
    {/* Header */}
    <div className="chat-header">
      <div>
        <h3>{name}</h3>
        <small className="status">● Online</small>
      </div>
      <div className="chat-actions">
        <button>📞</button>
        <button>📹</button>
      </div>
    </div>

    {/* Messages */}
    <div className="chat-messages">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`chat-row ${
            msg.type === "sent" ? "sent" : "received"
          }`}
        >
          <div className="chat-bubble">
            {msg.text}
            <div className="chat-time">{msg.time}</div>
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>

    {/* Input */}
    <div className="chat-input">
      <input
        value={input}
        onChange={handleInputChange}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  </div>
);
};

export default Chat;