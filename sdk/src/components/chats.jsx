import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client';
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Chat = () => {
    const navigate = useNavigate();
const [socket, setSocket] = useState(null);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hoveredMessageIdx, setHoveredMessageIdx] = useState(null);
    const chatEndRef = useRef(null);

useEffect(() => {
  const verifyKeyAndConnect = async () => {
    const apiKey = localStorage.getItem("apiKey");

    if (!apiKey) {
      navigate("/apikeymanager");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/keys/validate-key",
        {  },
        {
            headers: {
                "x-api-key": apiKey,
            },
        }
      );

      const socketInstance = io("http://localhost:5000", {
        auth: { apiKey }
      });

      setSocket(socketInstance);
    } catch (err) {
      localStorage.removeItem("apiKey");
      navigate("/apikeymanager");
    }
  };

  verifyKeyAndConnect();
}, []);


    useEffect(() => {
        if (!socket) return; // Guard clause to prevent null reference
        
        socket.on('rec-message', (msg) => {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { text: msg, type: 'received', time, read: false }]);
        });

        return () => {
            socket.off('rec-message');
        };
    }, [socket]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!socket) {
            console.warn("Socket not connected yet");
            return;
        }
        if (input.trim()) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            socket.emit('send-message', input);
            setMessages(prev => [...prev, { text: input, type: 'sent', time, read: true }]);
            setInput('');
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        setIsTyping(e.target.value.length > 0);
    };

    const getAvatarColor = (type) => {
        return type === 'sent' ? '#667eea' : '#764ba2';
    };

    const getInitial = (type) => {
        return type === 'sent' ? 'Y' : 'T';
    };

    const isConsecutiveMessage = (currentIdx) => {
        if (currentIdx === 0) return false;
        return messages[currentIdx].type === messages[currentIdx - 1].type;
    };

    return (
        <div style={{ 
            maxWidth: 600, 
            margin: '0 auto', 
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderRadius: 0,
            overflow: 'hidden',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                padding: '16px 20px',
                borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}>
                        👤
                    </div>
                    <div>
                        <h2 style={{ 
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#333',
                        }}>
                            John Doe
                        </h2>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#22c55e', fontWeight: '500' }}>
                            🟢 Active now
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '18px',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} title="Call">
                        📞
                    </button>
                    <button style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '18px',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} title="Video call">
                        📹
                    </button>
                </div>
            </div>
            
            {/* Chat messages box */}
            <div style={{ 
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)'
            }}>
                {messages.length === 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        flexDirection: 'column',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textAlign: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ fontSize: '48px' }}>💬</div>
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>No messages yet</p>
                        <p style={{ fontSize: '14px' }}>Start a conversation with John Doe!</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        style={{ 
                            display: 'flex',
                            justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start',
                            alignItems: 'flex-end',
                            gap: '8px',
                            animation: 'fadeIn 0.3s ease-in',
                            marginTop: isConsecutiveMessage(idx) ? '-8px' : '0px'
                        }}
                        onMouseEnter={() => setHoveredMessageIdx(idx)}
                        onMouseLeave={() => setHoveredMessageIdx(null)}
                    >
                        {msg.type === 'received' && (
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: getAvatarColor('received'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                flexShrink: 0,
                                opacity: isConsecutiveMessage(idx) ? 0 : 1,
                                visibility: isConsecutiveMessage(idx) ? 'hidden' : 'visible'
                            }}>
                                {getInitial('received')}
                            </div>
                        )}
                        
                        <div 
                            style={{ 
                                background: msg.type === 'sent' 
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                    : 'rgba(255, 255, 255, 0.95)',
                                color: msg.type === 'sent' ? '#fff' : '#333',
                                padding: '12px 16px',
                                borderRadius: msg.type === 'sent' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                maxWidth: '65%',
                                wordBreak: 'break-word',
                                boxShadow: hoveredMessageIdx === idx 
                                    ? (msg.type === 'sent' 
                                        ? '0 8px 24px rgba(102, 126, 234, 0.4)' 
                                        : '0 8px 24px rgba(0, 0, 0, 0.15)')
                                    : (msg.type === 'sent'
                                        ? '0 2px 8px rgba(0, 0, 0, 0.15)'
                                        : '0 2px 8px rgba(0, 0, 0, 0.1)'),
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.2s ease',
                                transform: hoveredMessageIdx === idx ? 'translateY(-2px)' : 'translateY(0)',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            <p style={{ margin: '0 0 6px 0', fontSize: '14px', lineHeight: '1.4', fontWeight: '500' }}>
                                {msg.text}
                            </p>
                            <div style={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: '4px',
                                fontSize: '11px', 
                                opacity: msg.type === 'sent' ? 0.85 : 0.6,
                            }}>
                                <span>{msg.time}</span>
                                {msg.type === 'sent' && (
                                    <span style={{ fontSize: '12px', marginLeft: '2px' }}>
                                        {msg.read ? '✓✓' : '✓'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {msg.type === 'sent' && (
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: getAvatarColor('sent'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                flexShrink: 0,
                                opacity: isConsecutiveMessage(idx) ? 0 : 1,
                                visibility: isConsecutiveMessage(idx) ? 'hidden' : 'visible'
                            }}>
                                {getInitial('sent')}
                            </div>
                        )}

                        {hoveredMessageIdx === idx && (
                            <div style={{
                                display: 'flex',
                                gap: '4px',
                                animation: 'fadeIn 0.2s ease-in'
                            }}>
                                <button style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                }} title="React">
                                    😊
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Typing indicator */}
            {false && (
                <div style={{
                    padding: '12px 20px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    fontStyle: 'italic'
                }}>
                    Royal is typing...
                </div>
            )}

            {/* Input form */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                padding: '16px 20px',
                borderTop: '2px solid rgba(102, 126, 234, 0.2)',
                backdropFilter: 'blur(10px)'
            }}>
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <button
                        type="button"
                        style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '18px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Add attachment"
                    >
                        📎
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        style={{ 
                            flex: 1, 
                            padding: '12px 16px', 
                            borderRadius: '24px', 
                            border: '2px solid #667eea',
                            outline: 'none',
                            fontSize: '14px',
                            fontFamily: 'inherit',
                            transition: 'all 0.3s ease',
                            boxShadow: input ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
                        }}
                        placeholder="Type a message..."
                        onFocus={(e) => {
                            e.target.style.borderColor = '#764ba2';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#667eea';
                        }}
                    />
                    <button 
                        type="button"
                        style={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '18px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Add emoji"
                    >
                        😊
                    </button>
                    <button 
                        type="submit" 
                        disabled={!input.trim() || !socket}
                        style={{ 
                            padding: '12px 20px', 
                            borderRadius: '24px', 
                            background: (input.trim() && socket)
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                : '#ccc',
                            color: '#fff', 
                            border: 'none',
                            cursor: (input.trim() && socket) ? 'pointer' : 'not-allowed',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            transform: isTyping && input.trim() && socket ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: (input.trim() && socket) ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (input.trim() && socket) {
                                e.target.style.transform = 'scale(1.08)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = isTyping && input.trim() && socket ? 'scale(1.05)' : 'scale(1)';
                        }}
                    >
                        ➤ Send
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                div::-webkit-scrollbar {
                    width: 6px;
                }
                
                div::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                div::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }
                
                div::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                button:hover {
                    transform: scale(1.08);
                }
            `}</style>
        </div>
    );
}

export default Chat;
