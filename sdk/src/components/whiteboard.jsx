"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  IconPencil,
  IconEraser,
  IconTypography,
  IconHandGrab,
  IconPaint,
  IconSquare,
  IconCircle,
  IconMinus,
  IconArrowRight,
  IconTriangle,
  IconStar,
  IconDiamond,
  IconPhoto,
  IconCloudUpload,
  IconDownload,
  IconTrash,
  IconPlus,
  IconFileDescription,
  IconX,
  IconLoaderQuarter,
  IconChevronLeft,
  IconChevronRight,
  IconShare
} from "@tabler/icons-react";
import "./whiteboard.css";

const SOCKET_URL = "http://localhost:5000";
const imageCache = new Map();

function WhiteboardContent({ apiKey, userId, name, roomId = "main_dev_room" }) {
  // Refs
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const startPoint = useRef(null);
  const socketRef = useRef(null);
  const draggedElement = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const currentDrawingPathSegments = useRef([]);
  const lastKnownMousePos = useRef({ x: 0, y: 0 });
  const activeTextRef = useRef(null);

  // State
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#4f46e5");
  const [fillColor, setFillColor] = useState("#6366f1");
  const [size, setSize] = useState(3);
  const [pages, setPages] = useState(() => {
    const saved = sessionStorage.getItem(`sk_wb_${roomId}`);
    return saved ? JSON.parse(saved) : [[]];
  });
  const pagesRef = useRef([[]]);
  useEffect(() => { 
    pagesRef.current = pages; 
    sessionStorage.setItem(`sk_wb_${roomId}`, JSON.stringify(pages));
  }, [pages, roomId]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedElements, setSelectedElements] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [fill, setFill] = useState(false);
  const [activeText, setActiveText] = useState(null);
  const [eraserCursorPos, setEraserCursorPos] = useState(null);
  const [whiteboardId, setWhiteboardId] = useState(null);
  const [boardName, setBoardName] = useState("Untitled Whiteboard");
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState('light');

  const themes = {
    light: { bg: '#ffffff', pattern: 'none' },
    dark: { bg: '#020617', pattern: 'none' },
    grid: { 
      bg: '#ffffff', 
      pattern: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
      size: '20px 20px'
    },
    dots: {
      bg: '#ffffff',
      pattern: 'radial-gradient(#d1d5db 1px, transparent 1px)',
      size: '10px 10px'
    }
  };

  // Collaboration
  const copyShareLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?whiteboardId=${whiteboardId || 'demo'}`;
    navigator.clipboard.writeText(link);
    toast.success("Share link copied!");
  };

  // Cloud Save
  const saveToCloud = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      let nameToSave = boardName;
      if (!whiteboardId) {
        const inputName = prompt("Enter whiteboard name:", boardName);
        if (inputName === null) { setSaving(false); return; }
        nameToSave = inputName || boardName;
        setBoardName(nameToSave);
      }
      const { data } = await axios.post(`${SOCKET_URL}/api/whiteboards/save`, { id: whiteboardId, name: nameToSave, data: pages, apiKey, userId }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) { toast.success("Saved to cloud!"); if (!whiteboardId) setWhiteboardId(data.whiteboard._id); }
    } catch (e) { toast.error("Cloud save failed"); } finally { setSaving(false); }
  };

  // Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * ratio;
      canvas.height = parent.clientHeight * ratio;
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
      ctxRef.current = ctx;
      redraw();
    };
    resize();
    window.addEventListener("resize", resize);
    socketRef.current = io(SOCKET_URL, { auth: { apiKey, userId, roomId } });
    socketRef.current.emit("join-room", { roomId, userId, name: "Whiteboard User" });
    socketRef.current.on("whiteboard-draw", (stroke) => { setPages(prev => prev.map((p, i) => i === currentPage ? [...p, stroke] : p)); });
    socketRef.current.on("whiteboard-clear", () => clearPage(false));
    return () => { socketRef.current?.disconnect(); window.removeEventListener("resize", resize); };
  }, [currentPage, apiKey, userId, roomId]);

  useEffect(() => { redraw(); }, [pages, currentPage, theme]);

  const drawStroke = (s) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.save();
    if (s.type === "image") {
      let img = imageCache.get(s.id);
      if (!img) { img = new Image(); img.onload = () => redraw(); img.src = s.data; imageCache.set(s.id, img); }
      if (img.complete) ctx.drawImage(img, s.x, s.y, s.width, s.height);
      ctx.restore(); return;
    }
    ctx.globalCompositeOperation = s.type === "eraserPath" ? "destination-out" : "source-over";
    ctx.strokeStyle = s.color; ctx.fillStyle = s.color; ctx.lineWidth = s.size;
    if (s.type === "path" || s.type === "eraserPath") {
      ctx.beginPath(); if (s.points?.length) { ctx.moveTo(s.points[0].x, s.points[0].y); s.points.forEach(p => ctx.lineTo(p.x, p.y)); } ctx.stroke();
    } else if (s.type === "rect") {
      if (s.fill) { ctx.fillStyle = s.fillColor || s.color; ctx.fillRect(s.from.x, s.from.y, s.to.x - s.from.x, s.to.y - s.from.y); }
      ctx.strokeRect(s.from.x, s.from.y, s.to.x - s.from.x, s.to.y - s.from.y);
    } else if (s.type === "circle") {
      const r = Math.hypot(s.to.x - s.from.x, s.to.y - s.from.y);
      ctx.beginPath(); ctx.arc(s.from.x, s.from.y, r, 0, Math.PI * 2); if (s.fill) { ctx.fillStyle = s.fillColor || s.color; ctx.fill(); } ctx.stroke();
    } else if (s.type === "line" || s.type === "arrow") {
      ctx.beginPath(); ctx.moveTo(s.from.x, s.from.y); ctx.lineTo(s.to.x, s.to.y); ctx.stroke();
      if (s.type === "arrow") {
          const angle = Math.atan2(s.to.y - s.from.y, s.to.x - s.from.x);
          ctx.beginPath(); ctx.moveTo(s.to.x, s.to.y);
          ctx.lineTo(s.to.x - 10 * Math.cos(angle - Math.PI / 6), s.to.y - 10 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(s.to.x - 10 * Math.cos(angle + Math.PI / 6), s.to.y - 10 * Math.sin(angle + Math.PI / 6));
          ctx.closePath(); ctx.fill();
      }
    } else if (s.type === "text") {
      ctx.textBaseline = "top"; ctx.font = `${s.size * 5}px Arial, sans-serif`; ctx.fillStyle = s.color; ctx.fillText(s.text, s.x, s.y);
    }
    ctx.restore();
  };

  const redraw = () => {
    const ctx = ctxRef.current;
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    (pagesRef.current[currentPage] || []).forEach(drawStroke);
    if (drawing.current && startPoint.current) {
      if (tool === "pen" || tool === "eraser") {
        ctx.save(); ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
        ctx.strokeStyle = color; ctx.lineWidth = tool === "eraser" ? size * 2 : size;
        ctx.beginPath(); if (currentDrawingPathSegments.current.length) {
          ctx.moveTo(currentDrawingPathSegments.current[0].x, currentDrawingPathSegments.current[0].y);
          currentDrawingPathSegments.current.forEach(p => ctx.lineTo(p.x, p.y));
        } ctx.stroke(); ctx.restore();
      } else if (tool !== "select" && tool !== "text") {
        const cur = getPos(); drawStroke({ type: tool, from: startPoint.current, to: cur, color, size, fill, fillColor });
      }
    }
  };

  const recognizeShape = (points) => {
    if (!points || points.length < 5) return null;
    const start = points[0], end = points[points.length - 1];
    const dist = Math.hypot(end.x - start.x, end.y - start.y);
    const totalLen = points.reduce((a, p, i) => i === 0 ? 0 : a + Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y), 0);
    if (totalLen < dist * 1.15) return { type: "line" };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
    const w = maxX - minX, h = maxY - minY, aspect = Math.max(w, h) / Math.min(w, h);
    if (dist < Math.max(30, Math.hypot(w, h) * 0.25)) {
      const cx = minX + w / 2, cy = minY + h / 2;
      let totalR = 0; points.forEach(p => totalR += Math.hypot(p.x - cx, p.y - cy));
      const avgR = totalR / points.length;
      let varR = 0; points.forEach(p => varR += Math.pow(Math.hypot(p.x - cx, p.y - cy) - avgR, 2));
      if (Math.sqrt(varR / points.length) / avgR < 0.2 && aspect < 1.5) return { type: "circle", centerX: cx, centerY: cy, radius: avgR };
      return { type: "rect", x: minX, y: minY, w, h };
    }
    return null;
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e?.clientX ?? lastKnownMousePos.current.x, cy = e?.clientY ?? lastKnownMousePos.current.y;
    return { x: (cx - rect.left) / zoom, y: (cy - rect.top) / zoom };
  };

  const addStroke = (s, emit = true) => {
    const newPages = pagesRef.current.map((p, i) => i === currentPage ? [...p, s] : p);
    pagesRef.current = newPages; setPages(newPages); redraw();
    if (emit && socketRef.current) socketRef.current.emit("whiteboard-draw", s);
  };

  const finalizeText = () => {
    if (activeText?.text.trim()) addStroke({ type: "text", x: activeText.x, y: activeText.y, text: activeText.text, color: activeText.color, size: activeText.size, id: Date.now() });
    setActiveText(null);
  };

  const clearPage = (emit = true) => {
    setPages(p => p.map((pg, i) => i === currentPage ? [] : pg));
    if (emit && socketRef.current) socketRef.current.emit("whiteboard-clear");
    redraw();
  };

  const handleMouseDown = (e) => {
    const pos = getPos(e); startPoint.current = pos; lastKnownMousePos.current = { x: e.clientX, y: e.clientY };
    if (activeText && tool !== "text") finalizeText();

    if (tool === "select") {
      const pageElements = pagesRef.current[currentPage] || [];
      // Find element under cursor (reversed to get top-most)
      const hit = [...pageElements].reverse().find(el => {
        if (el.type === "rect" && el.from && el.to) {
          return pos.x >= Math.min(el.from.x, el.to.x) && pos.x <= Math.max(el.from.x, el.to.x) &&
                 pos.y >= Math.min(el.from.y, el.to.y) && pos.y <= Math.max(el.from.y, el.to.y);
        }
        if (el.type === "circle" && el.from && el.to) {
          return Math.hypot(pos.x - el.from.x, pos.y - el.from.y) <= Math.hypot(el.to.x - el.from.x, el.to.y - el.from.y);
        }
        if (el.type === "text" && el.x !== undefined) {
          const w = 150, h = 30; // Rough estimate
          return pos.x >= el.x && pos.x <= el.x + w && pos.y >= el.y && pos.y <= el.y + h;
        }
        return false;
      });

      if (hit) {
        draggedElement.current = hit;
        dragOffset.current = hit.type === "text" ? { x: pos.x - hit.x, y: pos.y - hit.y } : { x: pos.x - hit.from.x, y: pos.y - hit.from.y };
        drawing.current = true;
      }
      return;
    }

    if (tool === "text") { setActiveText({ x: pos.x, y: pos.y, text: "", color, size, id: Date.now() }); return; }
    drawing.current = true; if (tool === "pen" || tool === "eraser") currentDrawingPathSegments.current = [pos];
  };

  const handleMouseMove = (e) => {
    const pos = getPos(e); lastKnownMousePos.current = { x: e.clientX, y: e.clientY };
    if (!drawing.current) return redraw();

    if (tool === "select" && draggedElement.current) {
      const dx = pos.x - startPoint.current.x;
      const dy = pos.y - startPoint.current.y;
      
      const elId = draggedElement.current.id;
      const updatedPages = pagesRef.current.map((p, i) => i === currentPage ? p.map(item => {
        if (item.id === elId) {
          if (item.type === "text") return { ...item, x: draggedElement.current.x + dx, y: draggedElement.current.y + dy };
          const w = draggedElement.current.to.x - draggedElement.current.from.x;
          const h = draggedElement.current.to.y - draggedElement.current.from.y;
          return { ...item, 
            from: { x: draggedElement.current.from.x + dx, y: draggedElement.current.from.y + dy }, 
            to: { x: draggedElement.current.from.x + dx + w, y: draggedElement.current.from.y + dy + h } 
          };
        }
        return item;
      }) : p);
      
      setPages(updatedPages);
      return;
    }

    if (tool === "pen" || tool === "eraser") currentDrawingPathSegments.current.push(pos);
    redraw();
  };

  const handleMouseUp = (e) => {
    if (!drawing.current) return;
    drawing.current = false;
    
    if (tool === "select") {
      if (draggedElement.current && socketRef.current) {
        // Emit the final state
        const finalEl = (pagesRef.current[currentPage] || []).find(it => it.id === draggedElement.current.id);
        if (finalEl) socketRef.current.emit("whiteboard-draw", finalEl);
      }
      draggedElement.current = null;
      return;
    }

    if (tool === "text") return;
    const pos = getPos(e);
    if (tool === "pen" || tool === "eraser") {
      if (currentDrawingPathSegments.current.length > 1) {
        if (tool === "pen") {
          const shape = recognizeShape(currentDrawingPathSegments.current);
          if (shape?.type === "circle") addStroke({ type: "circle", from: { x: shape.centerX, y: shape.centerY }, to: { x: shape.centerX + shape.radius, y: shape.centerY }, color, fillColor, size, fill, id: Date.now() });
          else if (shape?.type === "rect") addStroke({ type: "rect", from: { x: shape.x, y: shape.y }, to: { x: shape.x + shape.w, y: shape.y + shape.h }, color, fillColor, size, fill, id: Date.now() });
          else if (shape?.type === "line") addStroke({ type: "line", from: startPoint.current, to: pos, color, size, id: Date.now() });
          else addStroke({ type: "path", points: [...currentDrawingPathSegments.current], color, size, id: Date.now() });
        } else addStroke({ type: "eraserPath", points: [...currentDrawingPathSegments.current], color, size, id: Date.now() });
      }
      currentDrawingPathSegments.current = [];
    } else if (tool !== "select") addStroke({ type: tool, from: startPoint.current, to: pos, color, fillColor, size, fill, id: Date.now() });
    redraw();
  };

  return (
    <div className="whiteboard-container" style={{ 
      position: 'absolute', 
      inset: 0, 
      zIndex: 10, 
      background: theme === 'dark' ? '#020617' : '#f1f5f9',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      '--canvas-bg': themes[theme].bg,
      '--canvas-pattern': themes[theme].pattern,
      '--canvas-pattern-size': themes[theme].size 
    }}>
      <div className="whiteboard-toolbar">
        <div className="whiteboard-logo" onClick={() => {
           sessionStorage.removeItem(`sk_wb_${roomId}`);
           sessionStorage.removeItem(`sk_chat_${roomId}`);
           window.history.back();
        }} style={{ cursor: 'pointer' }}>
           <div className="logo-circle"><IconChevronLeft size={18} stroke={2.5}/></div>
           <div className="logo-info"><h1>StreamKit</h1><span>Exit to Dashboard</span></div>
        </div>

        <div className="tool-group">
          {[ { id: "pen", Icon: IconPencil, label: "Draw" }, { id: "eraser", Icon: IconEraser, label: "Erase" }, { id: "text", Icon: IconTypography, label: "Type" }, { id: "select", Icon: IconHandGrab, label: "Move" } ].map(t => (
            <button key={t.id} className={`tool-btn ${tool === t.id ? 'active' : ''}`} onClick={() => setTool(t.id)} data-tool={t.id}><t.Icon size={22}/><span>{t.label}</span></button>
          ))}
        </div>

        <div className="tool-group">
          {[ { id: "rect", Icon: IconSquare, label: "Box" }, { id: "circle", Icon: IconCircle, label: "Circle" }, { id: "line", Icon: IconMinus, label: "Line" }, { id: "arrow", Icon: IconArrowRight, label: "Arrow" } ].map(t => (
            <button key={t.id} className={`tool-btn ${tool === t.id ? 'active' : ''}`} onClick={() => setTool(t.id)} data-tool={t.id}><t.Icon size={22}/><span>{t.label}</span></button>
          ))}
        </div>

        <div className="theme-selector">
          {Object.keys(themes).map(t => ( <div key={t} className={`theme-dot ${theme === t ? 'active' : ''}`} style={{ background: themes[t].bg, border: t === 'light' ? '1px solid #ddd' : 'none' }} onClick={() => setTheme(t)} title={`Theme: ${t}`} /> ))}
        </div>

        <div className="color-picker-group">
          <input type="color" className="color-input" value={color} onChange={(e) => setColor(e.target.value)} />
          <button className={`tool-btn ${fill ? 'active' : ''}`} onClick={() => setFill(!fill)} title="Toggle Fill"><IconPaint size={20}/><span>Fill</span></button>
        </div>

        <div className="tool-group" style={{ marginLeft: 'auto' }}>
            <button className="tool-btn" onClick={() => clearPage()}><IconTrash size={20}/><span>Clear</span></button>
            <button className="tool-btn" onClick={saveToCloud}><IconCloudUpload size={20}/><span>Save</span></button>
            <button className="tool-btn" onClick={async () => {
              const link = `${window.location.origin}${window.location.pathname}?whiteboardId=${whiteboardId || 'demo'}`;
              try {
                await navigator.clipboard.writeText(link);
                toast.success("Link copied to clipboard!");
              } catch (err) {
                const input = document.createElement('input');
                input.value = link;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                toast.success("Link copied! (Legacy)");
              }
            }}><IconShare size={20}/><span>Share</span></button>
        </div>
      </div>

      <div className="canvas-wrapper" style={{ height: 'calc(100vh - 80px)', position: 'relative', backgroundSize: themes[theme].size }}>
        <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp} className="main-canvas" />
        
        {activeText && (
          <div style={{ position: 'absolute', left: activeText.x, top: activeText.y - 30, pointerEvents: 'none' }}>
            <span style={{ background: '#4F46E5', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
              Press Enter to Save
            </span>
          </div>
        )}
        
        {activeText && (
          <textarea 
            ref={activeTextRef} 
            value={activeText.text} 
            onChange={(e) => setActiveText({ ...activeText, text: e.target.value })} 
            onKeyDown={(e) => { if (e.key === 'Enter') finalizeText(); }}
            onBlur={finalizeText} 
            placeholder="Type here..."
            style={{ 
              position: 'absolute', 
              left: activeText.x, 
              top: activeText.y, 
              fontSize: `${activeText.size * 5}px`, 
              color: activeText.color, 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(4px)',
              border: '2px solid #4F46E5', 
              borderRadius: '8px',
              minWidth: '200px', 
              minHeight: '60px',
              padding: '10px',
              outline: 'none',
              resize: 'both',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              zIndex: 1000,
              colorScheme: 'dark'
            }} 
            autoFocus 
          />
        )}
      </div>

      {/* Pages Navigation */}
      <div className="page-nav-floating">
        <button className="page-btn" disabled={currentPage === 0} onClick={() => setCurrentPage(c => c - 1)}>
          <IconChevronLeft size={16}/>
        </button>
        <div className="page-indicator">
          Page {currentPage + 1} of {pages.length}
        </div>
        <button className="page-btn" onClick={() => setPages(p => [...p, []])}>
          <IconPlus size={16}/>
        </button>
        <button className="page-btn" disabled={currentPage === pages.length - 1} onClick={() => setCurrentPage(c => c + 1)}>
          <IconChevronRight size={16}/>
        </button>
      </div>
    </div>
  );
}

export default function Whiteboard(props) {
  return ( <Suspense fallback={<div className="loading-state">Initializing Canvas...</div>}><WhiteboardContent {...props} /></Suspense> );
}
