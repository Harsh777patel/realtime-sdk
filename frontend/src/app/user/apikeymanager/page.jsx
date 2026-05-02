'use client'
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { 
  IconKey, 
  IconPlus, 
  IconTrash, 
  IconCopy, 
  IconCheck, 
  IconShieldLock,
  IconLoaderQuarter,
  IconDeviceLaptop,
  IconExternalLink
} from "@tabler/icons-react";

const ApiKeys = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [keyName, setKeyName] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatedKey, setGeneratedKey] = useState('');
    const [copied, setCopied] = useState(false);

    const loadKeys = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiUrl}/api/keys`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setKeys(data.data || []);
        } catch (error) {
            console.error('Error loading keys:', error);
            toast.error('Failed to load API keys');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!keyName.trim()) {
            toast.error('Please enter a name for the API key');
            return;
        }

        setGenerating(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiUrl}/api/keys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: keyName })
            });
            const data = await res.json();
            
            if (data.success) {
                setGeneratedKey(data.data.apiKey);
                loadKeys();
                toast.success('API key generated successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error generating key:', error);
            toast.error('Failed to generate API key');
        } finally {
            setGenerating(false);
        }
    };

    const maskApiKey = (key) => {
        if (!key) return 'sk_***********';
        return key.length > 20 ? key.slice(0, 15) + '...' + key.slice(-4) : key;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('API Key copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this key? This action cannot be undone.')) return;
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiUrl}/api/keys/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            
            if (data.success) {
                toast.success('API key deleted');
                loadKeys();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to delete key');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setGeneratedKey('');
        setKeyName('');
    };

    useEffect(() => {
        loadKeys();
    }, []);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">API Keys</h1>
                    <p className="text-sm text-zinc-500">Manage keys used to authenticate requests from your server components.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                    <IconPlus size={18} />
                    Create New Key
                </button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <IconLoaderQuarter className="animate-spin text-indigo-500 mb-4" size={40} />
                    <p className="text-zinc-500 font-medium">Loading keys...</p>
                </div>
            ) : keys.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-16 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <IconKey className="text-zinc-500" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No API keys found</h2>
                    <p className="text-zinc-500 text-sm mb-8">You haven't generated any API keys yet.</p>
                    <button onClick={() => setShowModal(true)} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Generate your first key</button>
                </div>
            ) : (
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                                    <th className="px-8 py-4">API Key Name & Token</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Created / Last Used</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {keys.map((k) => (
                                    <tr key={k._id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm font-bold text-zinc-200">{k.name || 'Unnamed Key'}</span>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-[11px] mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                        {maskApiKey(k.apiKey)}
                                                    </code>
                                                    <button 
                                                        onClick={() => copyToClipboard(k.apiKey)}
                                                        className="p-1 rounded hover:bg-white/10 text-zinc-600 hover:text-white transition-all"
                                                    >
                                                        <IconCopy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold tracking-tight uppercase ${
                                                k.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
                                                {k.isActive ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col text-xs space-y-1">
                                                <span className="text-zinc-600">Created: <span className="text-zinc-400">{new Date(k.createdAt || Date.now()).toLocaleDateString()}</span></span>
                                                <span className="text-zinc-600">Last used: <span className="text-zinc-400">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}</span></span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleDelete(k._id)}
                                                className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-indigo-600/5 border border-indigo-600/20 p-8 rounded-3xl flex gap-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/20">
                        <IconShieldLock className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-2">Keep your keys private</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Do not share your API keys in public repositories or client-side code. Used leaked keys should be rotated immediately.
                        </p>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl flex gap-6 group hover:border-indigo-600/30 transition-all">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <IconDeviceLaptop className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-2">SDK Integration</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-4">Learn how to use these keys with our Node.js, Python, or Go SDKs.</p>
                        <a href="/docs/api" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                            Go to API Docs <IconExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fadeIn">
                    <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full"></div>
                        
                        {!generatedKey ? (
                            <>
                                <h2 className="text-3xl font-black text-white mb-2">Create Key</h2>
                                <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Give your key a descriptive name to help you identify it later.</p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-600 mb-2 ml-1">Key Name</label>
                                        <input
                                            type="text"
                                            value={keyName}
                                            onChange={(e) => setKeyName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                                            placeholder="e.g. Production Frontend"
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-indigo-600 transition-all placeholder:text-zinc-700"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 py-4 px-6 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all outline-none"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleGenerate}
                                            disabled={generating}
                                            className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 outline-none shadow-xl shadow-indigo-600/30"
                                        >
                                            {generating ? <IconLoaderQuarter className="animate-spin" size={20} /> : 'Generate'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                                    <IconCheck className="text-green-500" size={32} />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">Key Generated!</h2>
                                <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Copy this key now. For security purposes, <span className="text-zinc-300 font-bold">it will never be shown again.</span></p>

                                <div className="bg-indigo-600/10 border-2 border-indigo-600/30 rounded-2xl p-6 mb-8 group transition-all">
                                    <code className="text-sm font-mono text-zinc-200 break-all block mb-4">
                                        {maskApiKey(generatedKey)}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(generatedKey)}
                                        className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                                            copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-zinc-200'
                                        }`}
                                    >
                                        {copied ? <><IconCheck size={18} /> Copied!</> : <><IconCopy size={18} /> Copy Key</>}
                                    </button>
                                </div>

                                <button
                                    onClick={closeModal}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 outline-none"
                                >
                                    I've copied the key
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeys;
