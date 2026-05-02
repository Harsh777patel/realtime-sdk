"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
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
  IconTrash,
  IconCloudUpload,
  IconShare,
  IconChevronLeft,
  IconPlus,
  IconChevronRight,
  IconX
} from "@tabler/icons-react";
import "./Whiteboard.css";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const imageCache = new Map();

export default function Whiteboard({ whiteboardId: initialId }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const startPoint = useRef(null);
  const socketRef = useRef(null);
  const currentDrawingPathSegments = useRef([]);
  const lastKnownMousePos = useRef({ x: 0, y: 0 });
  const activeTextRef = useRef(null);

  const [id, setId] = useState(initialId);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#4f46e5");
  const [fillColor, setFillColor] = useState("#6366f1");
  const [size, setSize] = useState(3);
  const [pages, setPages] = useState([[]]);
  const pagesRef = useRef([[]]);
  useEffect(() => { pagesRef.current = pages; }, [pages]);
  const [currentPage, setCurrentPage] = useState(0);
  const [fill, setFill] = useState(false);
  const [activeText, setActiveText] = useState(null);
  const [boardName, setBoardName] = useState("Untitled Whiteboard");
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState('light');

  const themes = {
    light: { bg: '#ffffff', pattern: 'none' },
    dark: { bg: '#020617', pattern: 'none' },
    grid: { bg: '#ffffff', pattern: 'radial-gradient(#e5e7eb 1px, transparent 1px)', size: '20px 20px' },
    dots: { bg: '#ffffff', pattern: 'radial-gradient(#d1d5db 1px, transparent 1px)', size: '10px 10px' }
  };

  // Fetch Board Data
  useEffect(() => {
    if (id) {
      const fetchBoard = async () => {
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.get(`${SOCKET_URL}/api/whiteboards/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (data.success) {
            setPages(data.whiteboard.data || [[]]);
            setBoardName(data.whiteboard.name);
          }
        } catch (e) { toast.error("Failed to load whiteboard data"); }
      };
      fetchBoard();
    }
  }, [id]);

  // Socket setup
  useEffect(() => {
    const token = localStorage.getItem("token");
    socketRef.current = io(SOCKET_URL, {
        auth: { token }
    });
    
    socketRef.current.on("whiteboard-draw", (stroke) => {
      setPages(prev => prev.map((p, i) => i === currentPage ? [...p, stroke] : p));
    });
    
    socketRef.current.on("whiteboard-clear", () => setPages(p => p.map((pg, i) => i === currentPage ? [] : pg)));

    return () => socketRef.current?.disconnect();
  }, [currentPage]);

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
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => { redraw(); }, [pages, currentPage, theme]);

  const drawStroke = (s) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.save();
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
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
    const w = maxX - minX, h = maxY - minY;
    if (dist < Math.max(30, Math.hypot(w, h) * 0.25)) {
      const cx = minX + w / 2, cy = minY + h / 2;
      let totalR = 0; points.forEach(p => totalR += Math.hypot(p.x - cx, p.y - cy));
      const avgR = totalR / points.length;
      let varR = 0; points.forEach(p => varR += Math.pow(Math.hypot(p.x - cx, p.y - cy) - avgR, 2));
      if (Math.sqrt(varR / points.length) / avgR < 0.2) return { type: "circle", centerX: cx, centerY: cy, radius: avgR };
      return { type: "rect", x: minX, y: minY, w, h };
    }
    return null;
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e?.clientX ?? lastKnownMousePos.current.x, cy = e?.clientY ?? lastKnownMousePos.current.y;
    const pos = { x: cx - rect.left, y: cy - rect.top };
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
      return pos;
    }
    return pos;
  };

  const addStroke = (s, emit = true) => {
    const newPages = pagesRef.current.map((p, i) => i === currentPage ? [...p, s] : p);
    pagesRef.current = newPages; setPages(newPages); redraw();
    if (emit && socketRef.current) socketRef.current.emit("whiteboard-draw", s);
  };

  const clearPage = () => {
    setPages(p => p.map((pg, i) => i === currentPage ? [] : pg));
    if (socketRef.current) socketRef.current.emit("whiteboard-clear");
    redraw();
  };

  const saveToCloud = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      let nameToSave = boardName;
      if (!id) {
        const inputName = prompt("Enter whiteboard name:", boardName);
        if (inputName === null) { setSaving(false); return; }
        nameToSave = inputName || boardName;
        setBoardName(nameToSave);
      }
      const { data } = await axios.post(`${SOCKET_URL}/api/whiteboards/save`, { id, name: nameToSave, data: pages }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) { toast.success("Saved!"); if (!id) setId(data.whiteboard._id); }
    } catch (e) { toast.error("Save failed"); } finally { setSaving(false); }
  };

  const handleMouseDown = (e) => {
    const pos = getPos(e); startPoint.current = pos; lastKnownMousePos.current = { x: e.clientX, y: e.clientY };
    if (activeText && tool !== "text") { addStroke({ type: "text", x: activeText.x, y: activeText.y, text: activeText.text, color, size, id: Date.now() }); setActiveText(null); }
    if (tool === "text") { setActiveText({ x: pos.x, y: pos.y, text: "" }); return; }
    drawing.current = true; if (tool === "pen" || tool === "eraser") currentDrawingPathSegments.current = [pos];
  };

  const handleMouseMove = (e) => {
    const pos = getPos(e); lastKnownMousePos.current = { x: e.clientX, y: e.clientY };
    if (!drawing.current) return redraw();
    if (tool === "pen" || tool === "eraser") currentDrawingPathSegments.current.push(pos);
    redraw();
  };

  const handleMouseUp = (e) => {
    if (!drawing.current || tool === "text") { drawing.current = false; return; }
    drawing.current = false; const pos = getPos(e);
    if (tool === "pen" || tool === "eraser") {
      if (currentDrawingPathSegments.current.length > 1) {
        if (tool === "pen") {
          const shape = recognizeShape(currentDrawingPathSegments.current);
          if (shape?.type === "circle") addStroke({ type: "circle", from: { x: shape.centerX, y: shape.centerY }, to: { x: shape.centerX + shape.radius, y: shape.centerY }, color, fillColor, size, fill, id: Date.now() });
          else if (shape?.type === "rect") addStroke({ type: "rect", from: { x: shape.x, y: shape.y }, to: { x: shape.x + shape.w, y: shape.y + shape.h }, color, fillColor, size, fill, id: Date.now() });
          else addStroke({ type: "path", points: [...currentDrawingPathSegments.current], color, size, id: Date.now() });
        } else addStroke({ type: "eraserPath", points: [...currentDrawingPathSegments.current], color, size, id: Date.now() });
      }
      currentDrawingPathSegments.current = [];
    } else if (tool !== "select") addStroke({ type: tool, from: startPoint.current, to: pos, color, fillColor, size, fill, id: Date.now() });
    redraw();
  };

  return (
    <div className="whiteboard-container" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: theme === 'dark' ? '#020617' : '#f1f5f9', '--canvas-bg': themes[theme].bg, '--canvas-pattern': themes[theme].pattern, '--canvas-pattern-size': themes[theme].size }}>
      <div className="whiteboard-toolbar">
         <button className="tool-btn" onClick={() => router.back()}><IconX size={22}/><span>Close</span></button>
         <div className="h-8 w-px bg-white/10 mx-2"></div>
         <div className="tool-group">
          {[ { id: "pen", Icon: IconPencil, label: "Draw" }, { id: "eraser", Icon: IconEraser, label: "Erase" }, { id: "text", Icon: IconTypography, label: "Type" } ].map(t => (
            <button key={t.id} className={`tool-btn ${tool === t.id ? 'active' : ''}`} onClick={() => setTool(t.id)} data-tool={t.id}><t.Icon size={22}/><span>{t.label}</span></button>
          ))}
        </div>
        <div className="tool-group">
          {[ { id: "rect", Icon: IconSquare, label: "Box" }, { id: "circle", Icon: IconCircle, label: "Circle" }, { id: "line", Icon: IconMinus, label: "Line" }, { id: "arrow", Icon: IconArrowRight, label: "Arrow" } ].map(t => (
            <button key={t.id} className={`tool-btn ${tool === t.id ? 'active' : ''}`} onClick={() => setTool(t.id)} data-tool={t.id}><t.Icon size={22}/><span>{t.label}</span></button>
          ))}
        </div>
        <div className="theme-selector">
          {Object.keys(themes).map(t => ( <div key={t} className={`theme-dot ${theme === t ? 'active' : ''}`} style={{ background: themes[t].bg, border: t === 'light' ? '1px solid #ddd' : 'none' }} onClick={() => setTheme(t)} /> ))}
        </div>
        <div className="color-picker-group">
          <input type="color" className="color-input" value={color} onChange={(e) => setColor(e.target.value)} />
          <button className={`tool-btn ${fill ? 'active' : ''}`} onClick={() => setFill(!fill)}><IconPaint size={20}/><span>Fill</span></button>
        </div>
        <div className="tool-group" style={{ marginLeft: 'auto' }}>
            <button className="tool-btn" onClick={clearPage}><IconTrash size={20}/><span>Clear</span></button>
            <button className="tool-btn" onClick={saveToCloud} disabled={saving}><IconCloudUpload size={20}/><span>{saving ? 'Saving...' : 'Save'}</span></button>
        </div>
      </div>
      <div className="canvas-wrapper" style={{ height: 'calc(100vh - 80px)', position: 'relative', backgroundSize: themes[theme].size }}>
        <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} className="main-canvas" />
        {activeText && (
          <textarea ref={activeTextRef} value={activeText.text} onChange={(e) => setActiveText({ ...activeText, text: e.target.value })} onBlur={() => { addStroke({ type: "text", x: activeText.x, y: activeText.y, text: activeText.text, color, size, id: Date.now() }); setActiveText(null); }} style={{ position: 'absolute', left: activeText.x, top: activeText.y, fontSize: `${size * 5}px`, color, background: 'transparent', border: '1px dashed #4F46E5', minWidth: '200px', outline: 'none' }} autoFocus />
        )}
      </div>
    </div>
  );
}
