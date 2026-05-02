"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { IconMail, IconArrowLeft, IconCheck, IconLoader2 } from '@tabler/icons-react';
import toast from 'react-hot-toast';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSent(true);
      toast.success('Reset link sent to your email!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-10 flex flex-col items-center">
          <Link href="/" className="mb-8 group">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:scale-110 transition-transform">
              ⚡
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-3">Reset your password</h1>
          <p className="text-zinc-500 text-center text-sm leading-relaxed max-w-[280px]">
            {isSent 
              ? "We've sent a password reset link to your email address." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          {!isSent ? (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 px-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
                        <IconMail size={18} stroke={1.5} />
                      </div>
                      <Field
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className={`w-full bg-[#09090b] border ${errors.email && touched.email ? 'border-red-500' : 'border-white/5'} text-white text-sm rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-zinc-700`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-[10px] mt-2 font-medium px-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <IconLoader2 className="animate-spin" size={20} />
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-500/20">
                <IconCheck size={32} />
              </div>
              <button 
                onClick={() => setIsSent(false)}
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group"
          >
            <IconArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
