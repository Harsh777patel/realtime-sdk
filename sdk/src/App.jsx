import React, { useState } from "react";
import Chat from "./components/chats";
import AudioCall from "./components/audio";
import VideoCall from "./components/video";
import Whiteboard from "./components/whiteboard";
import { 
  IconMessages, 
  IconPhone, 
  IconVideo, 
  IconPaint, 
  IconSettings, 
  IconCode,
  IconBolt,
  IconShieldCheck,
  IconSun,
  IconMoon
} from "@tabler/icons-react";
import './App.css';

function App() {
  const [activeMode, setActiveMode] = useState('chat'); // chat, audio, video, whiteboard
  const [isDark, setIsDark] = useState(true);
  
  const config = {
    apiKey: "sk_4921708c5bad7cecf6c3ba274539b305f78d9260ef61f3dc41d96c16b5ed4e38",
    userId: "dev_user_777",
    name: "Royal Harsh",
    roomId: "main_dev_room"
  };

  const navItems = [
    { id: 'chat', label: 'Messenger', icon: <IconMessages size={20}/>, color: '#6366f1' },
    { id: 'audio', label: 'Voice', icon: <IconPhone size={20}/>, color: '#f59e0b' },
    { id: 'video', label: 'Video', icon: <IconVideo size={20}/>, color: '#10b981' },
    { id: 'whiteboard', label: 'Smart Canvas', icon: <IconPaint size={20}/>, color: '#ec4899' },
  ];

  return (
    <div className="sdk-root" data-theme={isDark ? 'dark' : 'light'}>
      {/* Sidebar Navigation */}
      <aside className="sdk-sidebar">
        <div className="sidebar-header">
           <div className="brand-icon">⚡</div>
           <div className="brand-text">
             <h1>StreamKit</h1>
             <p>Real-Time SDK</p>
           </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-label">Components</p>
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`nav-item ${activeMode === item.id ? 'active' : ''}`}
              onClick={() => setActiveMode(item.id)}
              style={{ '--active-color': item.color }}
            >
              <div className="item-icon">{item.icon}</div>
              <span className="item-label">{item.label}</span>
              {activeMode === item.id && <div className="active-glow"></div>}
            </button>
          ))}
          
          <p className="nav-label" style={{ marginTop: '2rem' }}>Utility</p>
          <button className="nav-item disabled"><div className="item-icon"><IconSettings size={20}/></div><span className="item-label">Configuration</span></button>
          <button className="nav-item disabled"><div className="item-icon"><IconCode size={20}/></div><span className="item-label">API Reference</span></button>
        </nav>

        <div className="sidebar-footer">
           <div className="user-profile">
              <div className="avatar">{config.name[0]}</div>
              <div className="info">
                <span className="name">{config.name}</span>
                <span className="status">Developer Mode</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Preview Container */}
      <main className="sdk-main">
        <header className="main-header">
          <div className="header-left">
            <h2 className="mode-title">{navItems.find(n => n.id === activeMode).label} Feature Preview</h2>
            <div className="breadcrumb">Components / {activeMode}</div>
          </div>
          <div className="header-right">
            <div className="status-badge">
               <IconBolt size={14} className="text-yellow-400" />
               <span>Low Latency Enabled</span>
            </div>
            <div className="status-badge">
               <IconShieldCheck size={14} className="text-emerald-400" />
               <span>Secure Channel</span>
            </div>
            <button
              className="theme-toggle"
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </button>
          </div>
        </header>

        <section className="preview-container">
           <div className="preview-window">
              {activeMode === 'chat' && <Chat {...config} />}
              {activeMode === 'audio' && <div className="widget-center"><AudioCall {...config} /></div>}
              {activeMode === 'video' && <div className="widget-full"><VideoCall {...config} /></div>}
              {activeMode === 'whiteboard' && <div className="widget-full"><Whiteboard {...config} /></div>}
              
              {/* Glass Overlay decoration */}
              <div className="window-decoration top-left"></div>
              <div className="window-decoration bottom-right"></div>
           </div>
        </section>

        <footer className="main-footer">
          <div className="footer-stats">
             <span>Protocol: <strong>WebRTC + WebSocket</strong></span>
             <span>Bitrate: <strong>Dynamic</strong></span>
             <span>Region: <strong>Auto (Mumbai)</strong></span>
          </div>
          <div className="v-tag">v2.4.0-production</div>
        </footer>
      </main>
    </div>
  );
}

export default App;
