'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  IconPaint, 
  IconPlus, 
  IconTrash, 
  IconExternalLink, 
  IconCalendar,
  IconLoader
} from '@tabler/icons-react';
import { toast } from 'react-hot-toast';

export default function WhiteboardManager() {
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const fetchWhiteboards = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.get(`${apiUrl}/api/whiteboards/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWhiteboards(res.data.whiteboards || []);
    } catch (err) {
      console.error("Error fetching whiteboards:", err);
      toast.error("Failed to load whiteboards");
    } finally {
      setLoading(false);
    }
  };

  const deleteWhiteboard = async (id) => {
    if (!confirm("Are you sure you want to delete this whiteboard?")) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await axios.delete(`${apiUrl}/api/whiteboards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Whiteboard deleted");
      setWhiteboards(whiteboards.filter(wb => wb._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">My Whiteboards</h1>
          <p className="text-zinc-500 text-sm">Manage and collaborate on your digital canvases.</p>
        </div>
        <Link 
          href="/user/whiteboard/canvas"
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <IconPlus size={18} />
          New Canvas
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <IconLoader className="animate-spin text-indigo-500" size={40} />
          <p className="text-zinc-500 font-medium">Fetching your canvases...</p>
        </div>
      ) : whiteboards.length === 0 ? (
        <div className="glass-panel p-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-3xl">🎨</div>
          <h3 className="text-xl font-bold">No whiteboards yet</h3>
          <p className="text-zinc-500 max-w-xs">Create your first collaborative whiteboard to start building together.</p>
          <Link 
            href="/user/whiteboard/canvas"
            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all"
          >
            Create Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whiteboards.map((wb) => (
            <div key={wb._id} className="glass-panel group hover:border-indigo-500/30 transition-all overflow-hidden">
              <div className="aspect-video bg-zinc-900 flex items-center justify-center relative border-b border-white/5">
                <IconPaint size={40} className="text-zinc-800 group-hover:text-indigo-500/50 transition-colors" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link 
                    href={`/user/whiteboard/canvas?id=${wb._id}`}
                    className="p-3 bg-white text-black rounded-xl hover:scale-110 transition-transform"
                    title="Open Canvas"
                  >
                    <IconExternalLink size={20} />
                  </Link>
                  <button 
                    onClick={() => deleteWhiteboard(wb._id)}
                    className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                    title="Delete"
                  >
                    <IconTrash size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 truncate">{wb.name}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <IconCalendar size={14} />
                  <span>Modified {new Date(wb.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
