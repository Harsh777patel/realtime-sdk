'use client';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedBackground from '@/components/AnimatedBackground';
import { IconBrandGoogle, IconMail, IconLock, IconArrowRight, IconLoaderQuarter, IconSparkles } from '@tabler/icons-react';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const router = useRouter();

  const loginForm = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await axios.post('http://localhost:5000/api/users/login', values);
        if (result?.data?.token) {
          toast.success('Welcome back!');
          localStorage.setItem('token', result.data.token);
          router.push(values.email === 'harsh4004@gmail.com' ? '/admin/dashboard' : '/user/dashboard');
        } else {
          toast.error(result?.data?.message || 'Login failed');
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Something went wrong');
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema: LoginSchema,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping-slow { 0%,100%{transform:scale(1);opacity:0.9} 50%{transform:scale(1.6);opacity:0} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .input-field {
          width:100%; padding:14px 14px 14px 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; color: #f8fafc; font-size:15px;
          outline:none; transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Outfit', sans-serif;
          box-sizing: border-box;
        }
        .input-field:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .input-field::placeholder { color: #475569; }
        .input-err { border-color: rgba(239,68,68,0.5) !important; }
        .google-btn {
          width:100%; padding:13px; display:flex; align-items:center; justify-content:center; gap:10px;
          background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
          border-radius:12px; color:#e2e8f0; font-size:14px; font-weight:600; cursor:pointer;
          transition:all 0.2s; font-family:'Outfit',sans-serif;
        }
        .google-btn:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.2); }
        .submit-btn {
          width:100%; padding:15px; background:linear-gradient(135deg,#4f46e5,#7c3aed);
          border:none; border-radius:12px; color:#fff; font-size:16px; font-weight:700;
          cursor:pointer; transition:all 0.3s; display:flex; align-items:center; justify-content:center;
          gap:8px; font-family:'Outfit',sans-serif; box-shadow:0 8px 30px rgba(99,102,241,0.35);
        }
        .submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 12px 40px rgba(99,102,241,0.5); background:linear-gradient(135deg,#5b54f7,#8b44ff); }
        .submit-btn:disabled { opacity:0.5; cursor:not-allowed; }
      `}</style>

      {/* Sparkles */}
      <AnimatedBackground intensity="normal" />

      {/* Ambient glows */}
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:'50vw', height:'60vh', background:'radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'fixed', bottom:'-20%', right:'-10%', width:'40vw', height:'50vh', background:'radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      <div style={{ width:'100%', maxWidth:'440px', position:'relative', zIndex:10 }}>
        {/* Logo */}
        <div className="fade-up" style={{ textAlign:'center', marginBottom:'36px' }}>
          <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:'10px', textDecoration:'none', marginBottom:'28px' }}>
            <div style={{ width:'44px', height:'44px', background:'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', boxShadow:'0 8px 24px rgba(99,102,241,0.4)' }}>⚡</div>
            <span style={{ fontSize:'22px', fontWeight:800, color:'#f8fafc', letterSpacing:'-0.02em' }}>StreamKit</span>
          </Link>
          <h1 style={{ fontSize:'30px', fontWeight:900, letterSpacing:'-0.03em', marginBottom:'8px' }}>Welcome back</h1>
          <p style={{ color:'#64748b', fontSize:'15px' }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="fade-up" style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'24px', padding:'36px', boxShadow:'0 40px 80px rgba(0,0,0,0.4)', animationDelay:'0.1s' }}>
          {/* Google */}
          <button type="button" className="google-btn" style={{ marginBottom:'24px' }}>
            <IconBrandGoogle size={20} />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize:'11px', color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>or email</span>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={loginForm.handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#94a3b8', marginBottom:'8px' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <IconMail size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#475569' }} />
                <input type="email" name="email" placeholder="name@example.com"
                  onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} value={loginForm.values.email}
                  className={`input-field${loginForm.touched.email && loginForm.errors.email ? ' input-err' : ''}`}
                />
              </div>
              {loginForm.touched.email && loginForm.errors.email && <p style={{ color:'#ef4444', fontSize:'12px', marginTop:'6px' }}>{loginForm.errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <label style={{ fontSize:'13px', fontWeight:600, color:'#94a3b8' }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize:'12px', color:'#818cf8', textDecoration:'none', fontWeight:600 }}>Forgot?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <IconLock size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#475569' }} />
                <input type="password" name="password" placeholder="••••••••"
                  onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} value={loginForm.values.password}
                  className={`input-field${loginForm.touched.password && loginForm.errors.password ? ' input-err' : ''}`}
                />
              </div>
              {loginForm.touched.password && loginForm.errors.password && <p style={{ color:'#ef4444', fontSize:'12px', marginTop:'6px' }}>{loginForm.errors.password}</p>}
            </div>

            {/* Remember */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <input id="remember" type="checkbox" style={{ width:'16px', height:'16px', accentColor:'#6366f1', cursor:'pointer' }} />
              <label htmlFor="remember" style={{ fontSize:'13px', color:'#64748b', cursor:'pointer' }}>Remember me</label>
            </div>

            <button type="submit" disabled={loginForm.isSubmitting} className="submit-btn">
              {loginForm.isSubmitting ? <IconLoaderQuarter size={20} style={{ animation:'spin 1s linear infinite' }} /> : <><span>Sign In</span><IconArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        <p className="fade-up" style={{ textAlign:'center', marginTop:'28px', color:'#475569', fontSize:'14px', animationDelay:'0.2s' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color:'#818cf8', fontWeight:700, textDecoration:'none' }}>Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
