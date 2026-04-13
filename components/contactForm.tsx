'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showSnackbarMessage = (message: string, type: 'success' | 'error') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => setSnackbar({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) {
      showSnackbarMessage('Please fill all fields', 'error');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    showSnackbarMessage("✅ Message sent! We'll get back to you soon.", 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <div className="bg-gradient-to-br from-rich-blue/5 to-white border border-light-gray rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-rich-blue/10 rounded-xl flex items-center justify-center text-2xl">
            📝
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-text-dark tracking-tight">
            Send us a Message
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-text-dark mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-blue/50 focus:border-rich-blue text-text-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-dark mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-white border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-blue/50 focus:border-rich-blue text-text-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-dark mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              className="w-full px-4 py-3 bg-white border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-blue/50 focus:border-rich-blue text-text-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-text-dark mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Your message here..."
              className="w-full px-4 py-3 bg-white border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-blue/50 focus:border-rich-blue text-text-dark resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-rich-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Message →'
            )}
          </button>
        </form>
      </div>

      {/* Snackbar */}
      {snackbar.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rich-blue text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <span>✓</span>
          <span className="text-sm font-medium">{snackbar.message}</span>
          <button onClick={() => setSnackbar({ show: false, message: '', type: 'success' })} className="ml-2 text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}
    </>
  );
}