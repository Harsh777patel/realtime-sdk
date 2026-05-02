'use client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import { 
  IconMail, 
  IconSend, 
  IconUser, 
  IconMessage, 
  IconCategory,
  IconMapPin,
  IconClock,
  IconPhone
} from '@tabler/icons-react';

const ContactSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().min(10, 'Message too short').required('Message is required')
});

const Contact = () => {
  const contactForm = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    validationSchema: ContactSchema,
    onSubmit: async (values) => {
      console.log('Contact Form Data:', values);
      toast.success('Message sent! Our team will contact you soon.');
      contactForm.resetForm();
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">Get in <span className="text-indigo-600">touch.</span></h1>
              <p className="text-xl text-zinc-500 max-w-md leading-relaxed">
                Have a question about our SDK or need technical support? We're here to help you scale your real-time apps.
              </p>
            </div>

            <div className="space-y-8">
              <ContactInfoItem 
                icon={<IconMapPin size={24} />} 
                title="Office Location" 
                desc="123 Tech Avenue, Silicon Valley, CA 94043" 
              />
              <ContactInfoItem 
                icon={<IconPhone size={24} />} 
                title="Direct Support" 
                desc="+1 (555) 000-KIT-DEV" 
              />
              <ContactInfoItem 
                icon={<IconMail size={24} />} 
                title="Email Us" 
                desc="support@streamkit.io" 
              />
              <ContactInfoItem 
                icon={<IconClock size={24} />} 
                title="Support Hours" 
                desc="Mon-Fri, 9am - 6pm PST (Priority for Pro/Enterprise)" 
              />
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl rounded-full"></div>
            
            <form onSubmit={contactForm.handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 ml-1 flex items-center gap-2">
                    <IconUser size={12} /> Contact Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    onChange={contactForm.handleChange}
                    onBlur={contactForm.handleBlur}
                    value={contactForm.values.name}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-600 transition-all text-white placeholder:text-zinc-700 font-medium"
                  />
                  {contactForm.touched.name && contactForm.errors.name && (
                    <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{contactForm.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 ml-1 flex items-center gap-2">
                    <IconMail size={12} /> Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    onChange={contactForm.handleChange}
                    onBlur={contactForm.handleBlur}
                    value={contactForm.values.email}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-600 transition-all text-white placeholder:text-zinc-700 font-medium"
                  />
                  {contactForm.touched.email && contactForm.errors.email && (
                    <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{contactForm.errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 ml-1 flex items-center gap-2">
                  <IconCategory size={12} /> Inquiry Subject
                </label>
                <input
                  name="subject"
                  type="text"
                  placeholder="How can we help?"
                  onChange={contactForm.handleChange}
                  onBlur={contactForm.handleBlur}
                  value={contactForm.values.subject}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-600 transition-all text-white placeholder:text-zinc-700 font-medium"
                />
                {contactForm.touched.subject && contactForm.errors.subject && (
                  <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{contactForm.errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 ml-1 flex items-center gap-2">
                  <IconMessage size={12} /> Detailed Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Describe your project or issue..."
                  onChange={contactForm.handleChange}
                  onBlur={contactForm.handleBlur}
                  value={contactForm.values.message}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-600 transition-all text-white placeholder:text-zinc-700 font-medium whitespace-pre-wrap"
                />
                {contactForm.touched.message && contactForm.errors.message && (
                  <p className="text-[10px] text-red-500 font-bold ml-1 uppercase">{contactForm.errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/40 hover:scale-[1.02] active:scale-95 group"
              >
                Send Message
                <IconSend size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const ContactInfoItem = ({ icon, title, desc }) => (
  <div className="flex gap-6 group">
    <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
      {icon}
    </div>
    <div className="space-y-1">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-zinc-500">{desc}</p>
    </div>
  </div>
);

export default Contact;
