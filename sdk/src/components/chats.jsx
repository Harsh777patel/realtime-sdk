import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client';

const Chat = () => {
    const [socket, setSocket] = useState(io('http://localhost:5000', { autoConnect: false }));
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        socket.connect();
        socket.on('rec-message', (msg) => {
            setMessages(prev => [...prev, { text: msg, type: 'received' }]);
        });

        return () => {
            socket.off('rec-message');
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            socket.emit('send-message', input);
            setMessages(prev => [...prev, { text: input, type: 'sent' }]);
            setInput('');
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: '20px auto', border: '2px solid #ccc', padding: 16, borderRadius: 8, fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Chats</h2>
            
            {/* Chat messages box */}
            <div style={{ 
                height: 300, 
                overflowY: 'auto', 
                marginBottom: 16, 
                background: '#f4f4f4', 
                padding: 8, 
                borderRadius: 13,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        style={{ 
                            alignSelf: msg.type === 'sent' ? 'flex-end' : 'flex-start',
                            background: msg.type === 'sent' ? '#0084ff' : '#e9ecef',
                            color: msg.type === 'sent' ? '#fff' : '#000',
                            padding: '8px 12px',
                            borderRadius: 16,
                            margin: '4px 0',
                            maxWidth: '70%',
                            wordBreak: 'break-word',
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    style={{ 
                        flex: 1, 
                        padding: 10, 
                        borderRadius: 20, 
                        border: '1px solid #ccc',
                        outline: 'none'
                    }}
                    placeholder="Type a message..."
                />
                <button 
                    type="submit" 
                    style={{ 
                        padding: '10px 18px', 
                        borderRadius: 20, 
                        background: '#0084ff', 
                        color: '#fff', 
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;
