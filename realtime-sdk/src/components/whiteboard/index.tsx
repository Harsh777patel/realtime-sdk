

import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import {
  IconPencil,
  IconEraser,
  IconTypography,
  IconPaint,
  IconSquare,
  IconCircle,
  IconMinus,
  IconArrowRight,
  IconTrash,
  IconCloudUpload,
  IconHandGrab,
  IconChevronLeft,
  IconChevronRight,
  IconPlus
} from "@tabler/icons-react";
import "./Whiteboard.css";

interface Point { x: number; y: number; }

interface Stroke {
  type: string;
  points?: Point[];
  from?: Point;
  to?: Point;
  color: string;
  fillColor?: string;
  size: number;
  fill?: boolean;
  text?: string;
  x?: number;
  y?: number;
  id: number;
}

export interface WhiteboardProps {
  apiKey: string;
  userId: string;
  roomId?: string;
  onSave?: (data: any) => void;
  serverUrl?: string;
}

const SOCKET_URL = "http://localhost:5000";

export const Whiteboard: React.FC<WhiteboardProps> = ({
  apiKey,
  userId,
  roomId = "default_room",
  onSave,
  serverUrl = SOCKET_URL
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const startPoint = useRef<Point | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const currentDrawingPathSegments = useRef<Point[]>([]);
  const lastKnownMousePos = useRef<Point>({ x: 0, y: 0 });
  const draggedElement = useRef<Stroke | null>(null);
  const activeTextRef = useRef<HTMLTextAreaElement>(null);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#4f46e5");
  const [fillColor, setFillColor] = useState("#6366f1");
  const [size, setSize] = useState(3);
  const [pages, setPages] = useState<Stroke[][]>([[]]);
  const pagesRef = useRef<Stroke[][]>([[]]);
  useEffect(() => { pagesRef.current = pages; }, [pages]);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [fill, setFill] = useState(false);
  const [activeText, setActiveText] = useState<{x: number, y: number, text: string} | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'grid' | 'dots'>('light');
const themeKeys = ['light', 'dark', 'grid', 'dots'] as const;
 type Theme = {
  bg: string;
  pattern: string;
  size?: string;
};

const themes: Record<string, Theme> = {
  light: { bg: '#ffffff', pattern: 'none', size: 'auto' },
  dark: { bg: '#020617', pattern: 'none', size: 'auto' },
  grid: { bg: '#ffffff', pattern: 'radial-gradient(#e5e7eb 1px, transparent 1px)', size: '20px 20px' },
  dots: { bg: '#ffffff', pattern: 'radial-gradient(#d1d5db 1px, transparent 1px)', size: '10px 10px' }
};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    
    socketRef.current = io(serverUrl, { auth: { apiKey, userId, roomId } });
    socketRef.current.emit("join-room", { roomId, userId, name: "Whiteboard User" });

    socketRef.current.on("whiteboard-draw", (stroke: Stroke) => {
      setPages(prev => prev.map((p, i) => i === currentPage ? [...p, stroke] : p));
    });
    socketRef.current.on("whiteboard-clear", () => setPages(p => p.map((pg, i) => i === currentPage ? [] : pg)));

    return () => {
      socketRef.current?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [apiKey, userId, roomId, serverUrl, currentPage]);

  useEffect(() => { redraw(); }, [pages, currentPage, theme]);

  const drawStroke = (s: Stroke) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = s.type === "eraserPath" ? "destination-out" : "source-over";
    ctx.strokeStyle = s.color; ctx.fillStyle = s.color; ctx.lineWidth = s.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    if (s.type === "path" || s.type === "eraserPath") {
      ctx.beginPath();
      if (s.points?.length) {
        ctx.moveTo(s.points[0].x, s.points[0].y);
        s.points.forEach(p => ctx.lineTo(p.x, p.y));
      }
      ctx.stroke();
    } else if (s.type === "rect" && s.from && s.to) {
      const x = Math.min(s.from.x, s.to.x);
      const y = Math.min(s.from.y, s.to.y);
      const w = Math.abs(s.to.x - s.from.x);
      const h = Math.abs(s.to.y - s.from.y);
      if (s.fill) { ctx.fillStyle = s.fillColor || s.color; ctx.fillRect(x, y, w, h); }
      ctx.strokeRect(x, y, w, h);
    } else if (s.type === "circle" && s.from && s.to) {
      const cx = (s.from.x + s.to.x) / 2;
      const cy = (s.from.y + s.to.y) / 2;
      const rx = Math.abs(s.to.x - s.from.x) / 2;
      const ry = Math.abs(s.to.y - s.from.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
      if (s.fill) { ctx.fillStyle = s.fillColor || s.color; ctx.fill(); }
      ctx.stroke();
    } else if (s.type === "line" && s.from && s.to) {
      ctx.beginPath();
      ctx.moveTo(s.from.x, s.from.y);
      ctx.lineTo(s.to.x, s.to.y);
      ctx.stroke();
    } else if (s.type === "arrow" && s.from && s.to) {
      const headlen = 15;
      const angle = Math.atan2(s.to.y - s.from.y, s.to.x - s.from.x);
      ctx.beginPath();
      ctx.moveTo(s.from.x, s.from.y);
      ctx.lineTo(s.to.x, s.to.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.to.x, s.to.y);
      ctx.lineTo(s.to.x - headlen * Math.cos(angle - Math.PI / 6), s.to.y - headlen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(s.to.x, s.to.y);
      ctx.lineTo(s.to.x - headlen * Math.cos(angle + Math.PI / 6), s.to.y - headlen * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    } else if (s.type === "text" && s.x !== undefined && s.y !== undefined) {
      ctx.textBaseline = "top"; ctx.font = `${s.size * 5}px Arial, sans-serif`; ctx.fillStyle = s.color; ctx.fillText(s.text || "", s.x, s.y);
    }
    ctx.restore();
  };

  const redraw = (previewStroke?: Stroke) => {
    const ctx = ctxRef.current;
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    (pagesRef.current[currentPage] || []).forEach(drawStroke);
    if (previewStroke) {
      ctx.globalAlpha = 0.6;
      drawStroke(previewStroke);
      ctx.globalAlpha = 1;
    }
  };

  const getPos = (e?: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let cx = 0, cy = 0;
    if (e && 'clientX' in e) { cx = (e as React.MouseEvent).clientX; cy = (e as React.MouseEvent).clientY; }
    else if (e && 'touches' in e) { cx = (e as React.TouchEvent).touches[0].clientX; cy = (e as React.TouchEvent).touches[0].clientY; }
    else { cx = lastKnownMousePos.current.x; cy = lastKnownMousePos.current.y; }
    return { x: cx - rect.left, y: cy - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e); startPoint.current = pos;
    if (activeText) {
       addStroke({ type: "text", x: activeText.x, y: activeText.y, text: activeText.text, color, size, id: Date.now() });
       setActiveText(null);
    }

    if (tool === "select") {
      const pageElements = pagesRef.current[currentPage] || [];
      const hit = [...pageElements].reverse().find(el => {
        if (el.type === "rect" && el.from && el.to) {
          return pos.x >= Math.min(el.from.x, el.to.x) && pos.x <= Math.max(el.from.x, el.to.x) &&
                 pos.y >= Math.min(el.from.y, el.to.y) && pos.y <= Math.max(el.from.y, el.to.y);
        }
        if (el.type === "circle" && el.from && el.to) {
          const cx = (el.from.x + el.to.x) / 2;
          const cy = (el.from.y + el.to.y) / 2;
          const rx = Math.abs(el.to.x - el.from.x) / 2;
          const ry = Math.abs(el.to.y - el.from.y) / 2;
          return Math.pow((pos.x - cx) / rx, 2) + Math.pow((pos.y - cy) / ry, 2) <= 1;
        }
        if (el.type === "text" && el.x !== undefined && el.y !== undefined) {
          return pos.x >= el.x && pos.x <= el.x + 150 && pos.y >= el.y && pos.y <= el.y + 30;
        }
        return false;
      });

      if (hit) { draggedElement.current = hit; drawing.current = true; }
      return;
    }

    if (tool === "text") { setActiveText({ x: pos.x, y: pos.y, text: "" }); return; }
    drawing.current = true;
    if (tool === "pen" || tool === "eraser") currentDrawingPathSegments.current = [pos];
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    lastKnownMousePos.current = pos;
    if (!drawing.current) return;

    if (tool === "select" && draggedElement.current && startPoint.current) {
      const dx = pos.x - startPoint.current.x;
      const dy = pos.y - startPoint.current.y;
      
      const elId = draggedElement.current.id;
      const updatedPages = pagesRef.current.map((p, i) => i === currentPage ? p.map(item => {
        if (item.id === elId && draggedElement.current) {
          if (item.type === "text" && draggedElement.current.x !== undefined && draggedElement.current.y !== undefined) {
             return { ...item, x: draggedElement.current.x + dx, y: draggedElement.current.y + dy };
          }
          if (draggedElement.current.from && draggedElement.current.to) {
            const w = draggedElement.current.to.x - draggedElement.current.from.x;
            const h = draggedElement.current.to.y - draggedElement.current.from.y;
            return { ...item, 
              from: { x: draggedElement.current.from.x + dx, y: draggedElement.current.from.y + dy }, 
              to: { x: draggedElement.current.from.x + dx + w, y: draggedElement.current.from.y + dy + h } 
            };
          }
        }
        return item;
      }) : p);
      
      setPages(updatedPages);
      return;
    }

    if (tool === "pen" || tool === "eraser") { 
      currentDrawingPathSegments.current.push(pos); 
      redraw(); 
    } else if (startPoint.current) {
      // Show live preview for shapes (rect, circle, line, arrow)
      const previewStroke: Stroke = { 
        type: tool, 
        from: startPoint.current, 
        to: pos, 
        color, 
        fillColor, 
        size, 
        fill,
        id: -1 
      };
      redraw(previewStroke);
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    drawing.current = false;
    
    if (tool === "select") {
      if (draggedElement.current && socketRef.current) {
        const finalEl = (pagesRef.current[currentPage] || []).find(it => it.id === draggedElement.current!.id);
        if (finalEl) socketRef.current.emit("whiteboard-draw", finalEl);
      }
      draggedElement.current = null;
      return;
    }

    if (tool === "text") return;
    const pos = getPos(e);
    if (tool === "pen" || tool === "eraser") {
       addStroke({ type: tool === "pen" ? "path" : "eraserPath", points: [...currentDrawingPathSegments.current], color, size, id: Date.now() });
       currentDrawingPathSegments.current = [];
    } else if (startPoint.current) {
       addStroke({ type: tool, from: startPoint.current, to: pos, color, fillColor, size, fill, id: Date.now() });
    }
    startPoint.current = null;
    redraw();
  };

  const addStroke = (s: Stroke, emit = true) => {
    const newPages = pagesRef.current.map((p, i) => i === currentPage ? [...p, s] : p);
    pagesRef.current = newPages; setPages(newPages); redraw();
    if (emit && socketRef.current) socketRef.current.emit("whiteboard-draw", s);
  };

  return (
    <div className="stream-whiteboard-container" style={{ 
      background: theme === 'dark' ? '#020617' : '#f1f5f9',
      '--canvas-bg': themes[theme].bg,
      '--canvas-pattern': themes[theme].pattern,
      '--canvas-pattern-size': themes[theme]?.size
    } as any}>
      <div className="stream-whiteboard-toolbar">
         <div className="stream-tool-group">
          {[
            { id: "pen", Icon: IconPencil, label: "Draw" },
            { id: "eraser", Icon: IconEraser, label: "Erase" },
            { id: "text", Icon: IconTypography, label: "Type" },
            { id: "select", Icon: IconHandGrab, label: "Move" }
          ].map(t => (
            <button key={t.id} className={`stream-tool-btn ${tool === t.id ? 'active' : ''}`} onClick={() => setTool(t.id)} data-tool={t.id}>
              <t.Icon size={20}/>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <div className="stream-tool-group">
          {[
            { id: "rect", Icon: IconSquare, label: "Box" },
            { id: "circle", Icon: IconCircle, label: "Circle" },
            { id: "line", Icon: IconMinus, label: "Line" },
            { id: "arrow", Icon: IconArrowRight, label: "Arrow" }
          ].map(t => (
            <button key={t.id} className={`stream-tool-btn ${tool === t.id ? 'active' : ''}`} onClick={() => setTool(t.id)} data-tool={t.id}>
              <t.Icon size={20}/>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Color & Size Controls */}
        <div className="stream-tool-group">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem" }}>
            <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Color:</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="stream-color-input"
              title="Stroke color"
            />
            {["circle", "rect"].includes(tool) && (
              <>
                <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginLeft: "0.3rem" }}>Fill:</label>
                <input 
                  type="color" 
                  value={fillColor} 
                  onChange={(e) => setFillColor(e.target.value)}
                  className="stream-color-input"
                  title="Fill color"
                />
                <input 
                  type="checkbox" 
                  checked={fill} 
                  onChange={(e) => setFill(e.target.checked)}
                  title="Toggle fill"
                  style={{ cursor: "pointer", width: 14, height: 14 }}
                />
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
            <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Size:</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              style={{ width: "5rem", cursor: "pointer" }}
            />
            <span style={{ fontSize: 11, color: "#cbd5e1", minWidth: "1.5rem" }}>{size}px</span>
          </div>
        </div>
        
        <div className="stream-theme-selector">
  {themeKeys.map((t) => (
    <div
      key={t}
      className={`stream-theme-dot ${theme === t ? 'active' : ''}`}
      style={{ background: themes[t].bg }}
      onClick={() => setTheme(t)}
    />
  ))}
</div>
        <div className="stream-tool-group" style={{ marginLeft: 'auto' }}>
            <button className="stream-tool-btn" onClick={() => setPages(p => p.map((pg, i) => i === currentPage ? [] : pg))} title="Clear Page"><IconTrash size={18}/><span>Clear</span></button>
            <button className="stream-tool-btn" onClick={() => onSave?.(pages)}><IconCloudUpload size={18}/><span>Save</span></button>
        </div>
      </div>
      
      <div className="stream-canvas-wrapper" style={{ backgroundSize: themes[theme].size }}>
        <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp} className="stream-main-canvas" />
        
        {activeText && (
          <textarea 
            ref={activeTextRef}
            value={activeText.text}
            onChange={(e) => setActiveText({ ...activeText, text: e.target.value })}
            onBlur={() => { if (activeText.text.trim()) addStroke({ type: "text", x: activeText.x, y: activeText.y, text: activeText.text, color, size, id: Date.now() }); setActiveText(null); }}
            style={{ position: 'absolute', left: activeText.x, top: activeText.y, fontSize: `${size * 5}px`, color, background: 'rgba(255,255,255,0.1)', border: '2px solid #4F46E5', minWidth: '200px', outline: 'none' }}
            autoFocus
          />
        )}
      </div>

      <div className="page-nav-floating">
        <button className="page-btn" disabled={currentPage === 0} onClick={() => setCurrentPage(c => c - 1)}><IconChevronLeft size={16}/></button>
        <div className="page-indicator">Page {currentPage + 1} of {pages.length}</div>
        <button className="page-btn" onClick={() => setPages(p => [...p, []])}><IconPlus size={16}/></button>
        <button className="page-btn" disabled={currentPage === pages.length - 1} onClick={() => setCurrentPage(c => c + 1)}><IconChevronRight size={16}/></button>
      </div>
    </div>
  );
};
