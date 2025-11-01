"use client";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);

  const [tool, setTool] = useState("pen"); // pen | eraser | rect | circle | text
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(3);
  const [pages, setPages] = useState([[]]);
  const [currentPage, setCurrentPage] = useState(0);

  const socketRef = useRef(null);

  // Canvas setup and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctxRef.current = ctx;
      redraw();
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Socket setup
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on("draw", (stroke) => addStroke(stroke, false));
    socketRef.current.on("clear", () => clearPage(false));

    return () => {
      socketRef.current.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [currentPage]);

  // Get pointer coordinates scaled to canvas
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  // Add stroke to page
  const addStroke = (stroke, emit = true) => {
    const updatedPages = [...pages];
    updatedPages[currentPage].push(stroke);
    setPages(updatedPages);
    drawStroke(stroke);
    if (emit) socketRef.current.emit("draw", stroke);
  };

  // Draw a stroke
  const drawStroke = (s) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = s.type === "eraser" ? "#ffffff" : s.color;
    ctx.fillStyle = s.color;
    ctx.lineWidth = s.size;

    if (s.type === "pen" || s.type === "eraser") {
      ctx.beginPath();
      ctx.moveTo(s.from.x, s.from.y);
      ctx.lineTo(s.to.x, s.to.y);
      ctx.stroke();
      ctx.closePath();
    } else if (s.type === "rect") {
      ctx.strokeRect(s.from.x, s.from.y, s.to.x - s.from.x, s.to.y - s.from.y);
    } else if (s.type === "circle") {
      ctx.beginPath();
      const r = Math.hypot(s.to.x - s.from.x, s.to.y - s.from.y);
      ctx.arc(s.from.x, s.from.y, r, 0, Math.PI * 2);
      ctx.stroke();
    } else if (s.type === "text") {
      ctx.font = `${s.size * 5}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.text, s.from.x, s.from.y);
    }
  };

  // Redraw current page
  const redraw = () => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    pages[currentPage].forEach(drawStroke);
  };

  // Pointer handlers
  const handlePointerDown = (e) => {
    const pos = getPos(e);
    canvasRef.current._start = pos;

    if (tool === "text") {
      const text = prompt("Enter text:");
      if (text && text.trim() !== "") {
        addStroke({ type: "text", from: pos, text, color, size });
      }
      drawing.current = false;
    } else {
      drawing.current = true;
    }
  };

  const handlePointerMove = (e) => {
    if (!drawing.current || tool === "text") return;
    const pos = getPos(e);
    const start = canvasRef.current._start;

    if (tool === "pen" || tool === "eraser") {
      addStroke({ type: tool, from: start, to: pos, color, size });
      canvasRef.current._start = pos;
    } else {
      redraw();
      drawStroke({ type: tool, from: start, to: pos, color, size });
    }
  };

  const handlePointerUp = (e) => {
    if (!drawing.current || tool === "pen" || tool === "text") {
      drawing.current = false;
      return;
    }
    const pos = getPos(e);
    const start = canvasRef.current._start;
    addStroke({ type: tool, from: start, to: pos, color, size });
    drawing.current = false;
  };

  // Clear page
  const clearPage = (emit = true) => {
    const updatedPages = [...pages];
    updatedPages[currentPage] = [];
    setPages(updatedPages);
    redraw();
    if (emit) socketRef.current.emit("clear");
  };

  const newPage = () => {
    setPages([...pages, []]);
    setCurrentPage(pages.length);
  };

  return (
    <div className="fixed inset-0 bg-white">
      {/* Toolbar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-md z-10">
        <button onClick={() => setTool("pen")} className="px-2 py-1 border">✏️ Pen</button>
        <button onClick={() => setTool("eraser")} className="px-2 py-1 border">🩹 Eraser</button>
        <button onClick={() => setTool("rect")} className="px-2 py-1 border">▭ Rect</button>
        <button onClick={() => setTool("circle")} className="px-2 py-1 border">⚪ Circle</button>
        <button onClick={() => setTool("text")} className="px-2 py-1 border">🔤 Text</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min="1" max="10" value={size} onChange={(e) => setSize(+e.target.value)} />
        <button onClick={() => clearPage(true)} className="bg-red-500 text-white px-3">Clear</button>
        <button onClick={newPage} className="bg-green-500 text-white px-3">➕ New Page</button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />

      {/* Pages */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-3 py-1 border rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            Page {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
