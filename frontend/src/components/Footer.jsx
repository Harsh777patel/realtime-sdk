import React from 'react';
import Link from 'next/link';
import { IconBrandTwitter, IconBrandGithub, IconBrandLinkedin, IconMessages } from '@tabler/icons-react';

const Footer = () => {
  return (
    <footer className="bg-[#09090b] text-zinc-400 border-t border-white/5 pt-20 pb-10 relative z-10 font-sans">
      <div className="container px-6 mx-auto">
        <div className="flex flex-wrap justify-between gap-12 mb-16">
          <div className="w-full lg:w-1/3 mb-10 lg:mb-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">⚡</div>
              <span className="text-xl font-bold text-white tracking-tight">Vellix</span>
            </div>
            <p className="max-w-xs leading-relaxed text-sm">
              The infrastructure layer for real-time human connection. 
              Build chat, video, and audio features in record time.
            </p>
          </div>
          
          <div className="flex-grow flex flex-wrap justify-between gap-8">
            <div className="min-w-[120px]">
              <h2 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Products</h2>
              <nav className="flex flex-col gap-4 text-sm font-medium">
                <Link href="/docs/chat" className="hover:text-indigo-400 transition-colors">Real-time Chat</Link>
                <Link href="/docs/video" className="hover:text-indigo-400 transition-colors">Video Calling</Link>
                <Link href="/docs/audio" className="hover:text-indigo-400 transition-colors">Audio Rooms</Link>
                <Link href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link>
              </nav>
            </div>
            <div className="min-w-[120px]">
              <h2 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Resources</h2>
              <nav className="flex flex-col gap-4 text-sm font-medium">
                <Link href="/docs" className="hover:text-indigo-400 transition-colors">Documentation</Link>
                <Link href="/docs/api" className="hover:text-indigo-400 transition-colors">API Reference</Link>
                <Link href="/examples" className="hover:text-indigo-400 transition-colors">Sample Apps</Link>
                <Link href="/changelog" className="hover:text-indigo-400 transition-colors">Changelog</Link>
              </nav>
            </div>
            <div className="min-w-[120px]">
              <h2 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Company</h2>
              <nav className="flex flex-col gap-4 text-sm font-medium">
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">Support</Link>
                <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] uppercase tracking-widest font-bold">
            © 2026 Vellix Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com" className="hover:text-white transition-colors"><IconBrandTwitter size={20} /></a>
            <a href="https://github.com" className="hover:text-white transition-colors"><IconBrandGithub size={20} /></a>
            <a href="https://linkedin.com" className="hover:text-white transition-colors"><IconBrandLinkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

