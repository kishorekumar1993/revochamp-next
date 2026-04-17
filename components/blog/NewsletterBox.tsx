// components/NewsletterBox.tsx
"use client";

import { useState } from "react";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 text-white">
        <div className="mb-2 text-2xl">💌</div>
        <h3 className="text-lg font-bold mb-1">Stay Updated</h3>
        <p className="text-sm text-slate-300 mb-4">
          Get the latest job market trends and career insights delivered to your inbox.
        </p>

        {subscribed ? (
          <div className="rounded-lg bg-green-500/20 border border-green-400/50 p-3 text-center">
            <p className="text-sm font-semibold text-green-100">
              ✓ Thanks for subscribing!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>
        )}
      </div>
      <div className="p-4 bg-slate-50 text-xs text-slate-600">
        We respect your privacy. Unsubscribe anytime.
      </div>
    </div>
  );
}

// // NewsletterBox.tsx
// 'use client';
// import { useState } from 'react';

// export function NewsletterBox() {
//   const [email, setEmail] = useState('');
//   const [subscribed, setSubscribed] = useState(false);
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email) setSubscribed(true);
//   };
//   return (
//     <div>
//       <h3 className="text-xs font-semibold tracking-wider text-[#6B6760] border-b pb-2 mb-3">NEWSLETTER</h3>
//       {subscribed ? (
//         <div className="bg-[#EAF3DE] p-4 text-sm">You're subscribed!</div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-2">
//           <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-[#DDD9D2] p-2 text-sm" required />
//           <button type="submit" className="w-full bg-[#0F0E0C] text-white text-sm py-2">SUBSCRIBE</button>
//         </form>
//       )}
//     </div>
//   );
// }