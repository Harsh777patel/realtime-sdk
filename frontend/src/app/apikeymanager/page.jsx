// pages/ApiKeys.jsx
'use client'
import { useEffect, useState } from "react";

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
            const res = await fetch('http://localhost:5000/api/keys', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            console.log(data);
            
            setKeys(data.data || []);
        } catch (error) {
            console.error('Error loading keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateClick = () => {
        setShowModal(true);
        setKeyName('');
    };

    const handleGenerate = async () => {
        if (!keyName.trim()) {
            alert('Please enter a name for the API key');
            return;
        }

        setGenerating(true);
        try {
            const res = await fetch('http://localhost:5000/api/keys', {
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
            } else {
                alert('❌ Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error generating key:', error);
            alert('Failed to generate API key');
        } finally {
            setGenerating(false);
        }
    };

    // const maskApiKey = (key) => {
    //     const parts = key.split('_');
    //     if (parts.length > 1) {
    //         return parts[0] + '_' + '*'.repeat(20) + '_' + parts[parts.length - 1];
    //     }
    //     return '*'.repeat(20) + key.slice(-4);
    // };
 // 🔹 Show only first 15 characters
    const maskApiKey = (key) => {
        if (!key) return 'sk_***********';
        return key.length > 20 ? key.slice(0, 20) + '...' : key;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyKeyToClipboard = (key) => {
        navigator.clipboard.writeText(key);
        alert('✅ API Key copied to clipboard!');
    };

    const closeModal = () => {
        setShowModal(false);
        setGeneratedKey('');
        setKeyName('');
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this key?')) {
            try {
                const res = await fetch(`http://localhost:5000/api/keys/${id}`, {
                    method: 'DELETE',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                
                if (data.success) {
                    alert('✅ API key deleted successfully');
                    loadKeys();
                } else {
                    alert('❌ Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error deleting key:', error);
                alert('Failed to delete API key');
            }
        }
    };

    useEffect(() => {
        loadKeys();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">API Keys Management</h1>
                    <p className="text-gray-600">Manage your API keys for accessing the Real-Time Builder API</p>
                </div>

                {/* Action Bar */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                    >
                        ➕ Generate New API Key
                    </button>
                </div>

                {/* Table Section */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-gray-500 text-lg">Loading...</div>
                    </div>
                ) : keys.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 text-lg">No API keys yet. Click the button above to generate one.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Api Keys</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Used</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {keys.map((k) => (
                                        <tr key={k._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <code className="font-mono text-xs bg-gray-100 px-3 py-1 rounded">
                                                        {maskApiKey(k.apiKey || '')}
                                                    </code>
                                                    <button
                                                        onClick={() => copyKeyToClipboard(k.apiKey)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-xs transition-all duration-200"
                                                        title="Copy API Key"
                                                    >
                                                        Copy
                                                        {/* 📋 Copy */}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${k.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {k.isActive ? '● Active' : '● Disabled'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => handleDelete(k._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                                                >
                                                    ❌ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        {!generatedKey ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Create API Key</h2>
                                <p className="text-gray-600 mb-4">Enter a name for your new API key</p>

                                <input
                                    type="text"
                                    value={keyName}
                                    onChange={(e) => setKeyName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                                    placeholder="e.g., Development, Production, Mobile App"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
                                    autoFocus
                                />

                                <div className="flex gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {generating ? 'Generating...' : 'Generate'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ API Key Created!</h2>
                                <p className="text-gray-600 mb-6">Copy your API key now. You won't see it again!</p>

                                <div className="bg-gray-50 border-2 border-blue-500 rounded-lg p-4 mb-6">
                                    <p className="text-xs text-gray-500 mb-2">Your API Key:</p>
                                    <div className="flex items-center gap-3">
                                        <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                                            {maskApiKey(generatedKey)}
                                        </code>
                                        <button
                                            onClick={copyToClipboard}
                                            className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                                                copied
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                        >
                                            {copied ? '✓ Copied!' : '📋 Copy'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={closeModal}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200"
                                >
                                    Done
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeys;

