'use client';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import Link from 'next/link';
import AnimatedBackground from '@/components/AnimatedBackground';
import { IconBrandGoogle, IconMail, IconLock, IconUser, IconArrowRight, IconLoaderQuarter, IconCircleCheck } from '@tabler/icons-react';

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required').min(8, 'Min 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase').matches(/[a-z]/, 'Must contain lowercase')
    .matches(/[0-9]/, 'Must contain number').matches(/\W/, 'Must contain special character'),
  confirmPassword: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const Signup = () => {
  const router = useRouter();

  const signupForm = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axios.post('http://localhost:5000/api/users/register', values);
        toast.success('Account created successfully!');
        router.push('/login');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Something went wrong');
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema: SignupSchema,
  });

  const f = signupForm;

  return (
    <div style={{ minHeight:'100vh', background:'#030712', color:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', position:'relative', overflow:'hidden', fontFamily:"'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .input-field {
          width:100%; padding:13px 13px 13px 44px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:12px; color:#f8fafc; font-size:14px; outline:none;
          transition:border-color 0.2s, box-shadow 0.2s; font-family:'Outfit',sans-serif;
          box-sizing:border-box;
        }
        .input-field:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.15); }
        .input-field::placeholder { color:#475569; }
        .input-err { border-color:rgba(239,68,68,0.5) !important; }
        .google-btn {
          width:100%; padding:13px; display:flex; align-items:center; justify-content:center; gap:10px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
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
        .two-col { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:480px) { .two-col { grid-template-columns:1fr; } }
      `}</style>

      <AnimatedBackground intensity="normal" />
      <div style={{ position:'fixed', top:'-20%', right:'-10%', width:'50vw', height:'60vh', background:'radial-gradient(ellipse, rgba(99,102,241,0.13) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'fixed', bottom:'-20%', left:'-10%', width:'40vw', height:'50vh', background:'radial-gradient(ellipse, rgba(168,85,247,0.09) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      <div style={{ width:'100%', maxWidth:'480px', position:'relative', zIndex:10 }}>
        {/* Logo */}
        <div className="fade-up" style={{ textAlign:'center', marginBottom:'32px' }}>
          <Link href="/" style={{ display:'inline-flex', alignItems:'center', gap:'10px', textDecoration:'none', marginBottom:'24px' }}>
            <div style={{ width:'44px', height:'44px', background:'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', boxShadow:'0 8px 24px rgba(99,102,241,0.4)' }}>⚡</div>
            <span style={{ fontSize:'22px', fontWeight:800, color:'#f8fafc', letterSpacing:'-0.02em' }}>StreamKit</span>
          </Link>
          <h1 style={{ fontSize:'28px', fontWeight:900, letterSpacing:'-0.03em', marginBottom:'8px' }}>Create your account</h1>
          <p style={{ color:'#64748b', fontSize:'14px' }}>Join thousands of developers building real-time apps</p>
        </div>

        {/* Card */}
        <div className="fade-up" style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'24px', padding:'36px', boxShadow:'0 40px 80px rgba(0,0,0,0.4)', animationDelay:'0.1s' }}>
          {/* Google */}
          <button type="button" className="google-btn" style={{ marginBottom:'22px' }}>
            <IconBrandGoogle size={20} />
            <span>Sign up with Google</span>
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'22px' }}>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize:'11px', color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>or use email</span>
            <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={f.handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            {/* Name */}
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#94a3b8', marginBottom:'7px' }}>Full Name</label>
              <div style={{ position:'relative' }}>
                <IconUser size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#475569' }} />
                <input type="text" name="name" placeholder="John Doe"
                  onChange={f.handleChange} onBlur={f.handleBlur} value={f.values.name}
                  className={`input-field${f.touched.name && f.errors.name ? ' input-err' : ''}`} />
              </div>
              {f.touched.name && f.errors.name && <p style={{ color:'#ef4444', fontSize:'12px', marginTop:'5px' }}>{f.errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#94a3b8', marginBottom:'7px' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <IconMail size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#475569' }} />
                <input type="email" name="email" placeholder="name@example.com"
                  onChange={f.handleChange} onBlur={f.handleBlur} value={f.values.email}
                  className={`input-field${f.touched.email && f.errors.email ? ' input-err' : ''}`} />
              </div>
              {f.touched.email && f.errors.email && <p style={{ color:'#ef4444', fontSize:'12px', marginTop:'5px' }}>{f.errors.email}</p>}
            </div>

            {/* Passwords */}
            <div className="two-col">
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#94a3b8', marginBottom:'7px' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <IconLock size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#475569' }} />
                  <input type="password" name="password" placeholder="••••••••"
                    onChange={f.handleChange} onBlur={f.handleBlur} value={f.values.password}
                    className={`input-field${f.touched.password && f.errors.password ? ' input-err' : ''}`} />
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'#94a3b8', marginBottom:'7px' }}>Confirm</label>
                <div style={{ position:'relative' }}>
                  <IconCircleCheck size={17} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'#475569' }} />
                  <input type="password" name="confirmPassword" placeholder="••••••••"
                    onChange={f.handleChange} onBlur={f.handleBlur} value={f.values.confirmPassword}
                    className={`input-field${f.touched.confirmPassword && f.errors.confirmPassword ? ' input-err' : ''}`} />
                </div>
              </div>
            </div>

            {f.touched.password && f.errors.password && <p style={{ color:'#ef4444', fontSize:'12px', marginTop:'-8px' }}>{f.errors.password}</p>}
            {f.touched.confirmPassword && f.errors.confirmPassword && <p style={{ color:'#ef4444', fontSize:'12px', marginTop:'-8px' }}>{f.errors.confirmPassword}</p>}

            {/* Terms */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
              <input id="terms" type="checkbox" required style={{ width:'16px', height:'16px', marginTop:'2px', accentColor:'#6366f1', cursor:'pointer', flexShrink:0 }} />
              <label htmlFor="terms" style={{ fontSize:'12px', color:'#64748b', lineHeight:1.6, cursor:'pointer' }}>
                I agree to the{' '}
                <Link href="/terms" style={{ color:'#818cf8', textDecoration:'none', fontWeight:600 }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color:'#818cf8', textDecoration:'none', fontWeight:600 }}>Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={f.isSubmitting} className="submit-btn" style={{ marginTop:'4px' }}>
              {f.isSubmitting
                ? <IconLoaderQuarter size={20} style={{ animation:'spin 1s linear infinite' }} />
                : <><span>Create Account</span><IconArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        <p className="fade-up" style={{ textAlign:'center', marginTop:'24px', color:'#475569', fontSize:'14px', animationDelay:'0.2s' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color:'#818cf8', fontWeight:700, textDecoration:'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;