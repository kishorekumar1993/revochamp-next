// NewsletterBox.tsx
'use client';
import { useState } from 'react';

export function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };
  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wider text-[#6B6760] border-b pb-2 mb-3">NEWSLETTER</h3>
      {subscribed ? (
        <div className="bg-[#EAF3DE] p-4 text-sm">You're subscribed!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-[#DDD9D2] p-2 text-sm" required />
          <button type="submit" className="w-full bg-[#0F0E0C] text-white text-sm py-2">SUBSCRIBE</button>
        </form>
      )}
    </div>
  );
}