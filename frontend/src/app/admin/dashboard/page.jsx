'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
        fetchCount();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5000/api/users/all')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    };

    const fetchCount = () => {
        axios.get('http://localhost:5000/api/users/count')
            .then(res => setUserCount(res.data.count))
            .catch(err => console.error(err));
    };

    const deleteUser = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            axios.delete(`http://localhost:5000/api/users/${id}`)
                .then(() => {
                    toast.success('User deleted successfully');
                    fetchUsers();
                    fetchCount();
                })
                .catch(err => {
                    toast.error('Failed to delete user');
                    console.error(err);
                });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden lg:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                </div>
                <nav className="mt-6">
                    <a href="#" className="flex items-center px-6 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600">
                        <span className="font-medium">Dashboard</span>
                    </a>
                    <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 transition-colors">
                        <span className="font-medium">Settings</span>
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        Logout
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{userCount}</p>
                    </div>
                    {/* Add more stats here if needed */}
                </div>

                {/* User Management Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800">Manage Users</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-500 uppercase text-xs">Name</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 uppercase text-xs">Email</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 uppercase text-xs">Role</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 uppercase text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-800 font-medium">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteUser(user._id)}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
