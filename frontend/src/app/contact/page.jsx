'use client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';

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
    onSubmit: (values) => {
      console.log('Contact Form Data:', values);
      alert('Message sent successfully!');
    }
  });

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="max-w-2xl w-full my-10 bg-white border border-gray-200 rounded-xl shadow-md dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
            Contact Us
          </h1>
          <p className="text-sm text-gray-600 dark:text-neutral-400 text-center mb-6">
            We'd love to hear from you! Fill out the form below.
          </p>

          <form onSubmit={contactForm.handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm mb-1 dark:text-white">Full Name</label>
              <input
                id="name"
                type="text"
                onChange={contactForm.handleChange}
                value={contactForm.values.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              {contactForm.touched.name && contactForm.errors.name && (
                <p className="text-xs text-red-600">{contactForm.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm mb-1 dark:text-white">Email</label>
              <input
                id="email"
                type="email"
                onChange={contactForm.handleChange}
                value={contactForm.values.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              {contactForm.touched.email && contactForm.errors.email && (
                <p className="text-xs text-red-600">{contactForm.errors.email}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm mb-1 dark:text-white">Subject</label>
              <input
                id="subject"
                type="text"
                onChange={contactForm.handleChange}
                value={contactForm.values.subject}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              {contactForm.touched.subject && contactForm.errors.subject && (
                <p className="text-xs text-red-600">{contactForm.errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm mb-1 dark:text-white">Message</label>
              <textarea
                id="message"
                rows="5"
                onChange={contactForm.handleChange}
                value={contactForm.values.message}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              />
              {contactForm.touched.message && contactForm.errors.message && (
                <p className="text-xs text-red-600">{contactForm.errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact;
