import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { IconShieldCheck, IconLock, IconEye, IconUsers } from '@tabler/icons-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Data Collection",
      icon: <IconShieldCheck />,
      content: "We collect information you provide directly to us, such as when you create or modify your account, request customer support, or communicate with us. This includes name, email, and any components you build using our SDK."
    },
    {
      title: "How We Use Data",
      icon: <IconLock />,
      content: "Your data is used to provide, maintain, and improve our services. We use real-time connection data solely for routing and delivery of messages. We do not store private conversation content longer than necessary for delivery."
    },
    {
      title: "Transparency",
      icon: <IconEye />,
      content: "We are committed to being transparent about how we handle your data. You can request a copy of your data or its deletion at any time through your dashboard profile settings."
    },
    {
      title: "Third Parties",
      icon: <IconUsers />,
      content: "We do not sell your personal data. We only share data with service providers who help us maintain our infrastructure, such as cloud hosting and database services, under strict confidentiality agreements."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-lg leading-relaxed mb-4 text-zinc-500">
            Last updated: April 13, 2025
          </p>
          <p className="leading-relaxed text-zinc-400">
            At StreamKit, your privacy is our top priority. This policy outlines how we handle your data when you use our real-time communication platform and SDKs.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx} className="group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-600/20 group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <p className="text-zinc-500 leading-relaxed pl-14">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-indigo-600/5 border border-indigo-600/10 text-center">
          <h3 className="text-white font-bold mb-4">Questions about your data?</h3>
          <p className="mb-6 text-sm text-zinc-500">Our DPO is here to help you with any privacy-related inquiries.</p>
          <a href="mailto:privacy@streamkit.io" className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20">
            Contact Privacy Team
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
