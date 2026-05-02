import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { IconAlertCircle } from '@tabler/icons-react';

export default function TermsOfService() {
  const points = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using StreamKit, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services."
    },
    {
      title: "Allowed Use",
      content: "You may use our SDKs for any legal application. However, you are prohibited from using StreamKit for malicious purposes, including DDoS attacks, data scraping, or spreading malware."
    },
    {
      title: "API Usage Limits",
      content: "Fair usage limits apply to all free and paid plans. Excessive use that degrades the service for others may result in temporary or permanent suspension of your API access."
    },
    {
      title: "Liability",
      content: "StreamKit is provided 'as is'. While we strive for 99.9% uptime, we are not liable for any losses resulting from service downtime or data transmission failures."
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-3xl">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Terms of Service</h1>
          <p className="text-lg leading-relaxed mb-4 text-zinc-500">
            Effective Date: April 13, 2025
          </p>
          <p className="leading-relaxed text-zinc-400">
            Please read these terms carefully before using our platform. Your use of StreamKit constitutes acceptance of these conditions.
          </p>
        </div>

        <div className="space-y-12">
          {points.map((point, idx) => (
            <div key={idx} className="border-l-2 border-indigo-600/20 pl-8 group hover:border-indigo-600 transition-colors py-2">
              <h2 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">{point.title}</h2>
              <p className="text-zinc-500 leading-relaxed text-sm">
                {point.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/10 items-start">
          <IconAlertCircle className="text-indigo-400 flex-shrink-0 mt-1" size={24} />
          <p className="text-sm leading-relaxed text-zinc-500">
            Violation of these terms may result in account termination without notice. We reserve the right to modify these terms at any time. Significant changes will be announced on our official channels.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
