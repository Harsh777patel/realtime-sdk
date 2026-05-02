'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';
import { 
  IconSun, 
  IconMoon, 
  IconArrowRight, 
  IconMenu2, 
  IconX,
  IconLogout,
  IconUser,
  IconLayoutDashboard
} from '@tabler/icons-react';

const Navbar = ({ scrolled: externalScrolled }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check login state
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navLinks = [
    { label: "Docs", href: "/docs" },
    { label: "Examples", href: "/examples" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
  ];

  const isDarkMode = theme === 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 sm:px-12 py-4 flex items-center justify-between ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-lg' : 'bg-transparent'}`}>
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
          <span className="text-xl">⚡</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className={`font-bold text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Vellix</span>
          <span className="hidden sm:inline font-mono text-[9px] text-indigo-400 uppercase tracking-widest font-black">Real-Time-Applications</span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link 
            key={link.label} 
            href={link.href} 
            className={`text-sm font-medium transition-colors ${pathname.startsWith(link.href) ? 'text-indigo-500 font-bold' : (isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-indigo-600')}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Real Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${isDarkMode ? 'bg-white/5 border-white/10 text-zinc-400 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-indigo-600'}`}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
        </button>

        <div className="h-6 w-px bg-border hidden sm:block"></div>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Link href="/user/dashboard" className={`hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-indigo-600'}`}>
              <IconLayoutDashboard size={18} />
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className={`px-5 py-2.5 text-sm font-bold rounded-full transition-all flex items-center gap-2 border ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-zinc-200 shadow-sm'}`}
            >
              <IconLogout size={16} />
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" className={`hidden sm:block px-5 py-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-indigo-600'}`}>Sign in</Link>
            <Link href="/signup" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20">
              Get Started
              <IconArrowRight size={16} />
            </Link>
          </>
        )}
        
        {/* Mobile Menu Toggle */}
        <button 
          className={`md:hidden w-10 h-10 flex items-center justify-center ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`absolute top-full left-0 right-0 border-b p-6 flex flex-col gap-4 md:hidden animate-slideDown shadow-2xl ${isDarkMode ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-100'}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href} 
              className={`text-lg font-medium ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-indigo-600'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px my-2 bg-border"></div>
          {isLoggedIn ? (
            <>
              <Link href="/user/dashboard" className={`text-lg font-medium px-4 py-3 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-zinc-100'}`} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              <button 
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="text-lg font-medium text-red-400 text-left px-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`text-lg font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
              <Link href="/signup" className="text-lg font-bold text-indigo-500" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;