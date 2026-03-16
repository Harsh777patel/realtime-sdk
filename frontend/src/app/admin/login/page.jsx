'use client';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
});

const AdminLogin = () => {
    const router = useRouter();

    const loginForm = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: (values) => {
            axios.post('http://localhost:5000/api/users/login', values)
                .then((result) => {
                    if (result.data.user.role === 'admin') {
                        toast.success('Admin Login successful');
                        localStorage.setItem('token', result.data.token);
                        localStorage.setItem('user', JSON.stringify(result.data.user));
                        router.push('/admin/dashboard');
                    } else {
                        toast.error('Access Denied: Not an Admin');
                    }
                }).catch((err) => {
                    console.log(err);
                    toast.error(err.response?.data?.message || 'Something went wrong');
                });
        },
        validationSchema: LoginSchema
    });

    return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden p-8 dark:bg-gray-800">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Admin Login</h2>

                <form onSubmit={loginForm.handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            onChange={loginForm.handleChange}
                            value={loginForm.values.email}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="admin@example.com"
                        />
                        {loginForm.touched.email && loginForm.errors.email && (
                            <p className="text-xs text-red-500 mt-1">{loginForm.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={loginForm.handleChange}
                            value={loginForm.values.password}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="••••••••"
                        />
                        {loginForm.touched.password && loginForm.errors.password && (
                            <p className="text-xs text-red-500 mt-1">{loginForm.errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg"
                    >
                        Sign In to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
