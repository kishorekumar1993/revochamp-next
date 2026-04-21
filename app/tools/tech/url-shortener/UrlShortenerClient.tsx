// app/tools/url-shortener/UrlShortenerClient.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Link2,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  History,
  Trash2,
  ExternalLink,
  QrCode,
  Sparkles,
  Zap,
  Globe,
  Shield,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface HistoryItem {
  original: string;
  short: string;
  timestamp: Date;
}

export default function UrlShortenerClient() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('url-shortener-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })));
      } catch (e) {}
    }
  }, []);

  const addToHistory = (originalUrl: string, shortenedUrl: string) => {
    const newItem: HistoryItem = { original: originalUrl, short: shortenedUrl, timestamp: new Date() };
    const updated = [newItem, ...history.filter(h => h.short !== shortenedUrl)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('url-shortener-history', JSON.stringify(updated));
  };

  const handleShorten = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    let validUrl = url.trim();
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'https://' + validUrl;
    }
    try {
      new URL(validUrl);
    } catch {
      setError('Invalid URL format');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShortUrl('');

    try {
      const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(validUrl)}`);
      const data = await response.json();
      
      if (data.shorturl) {
        setShortUrl(data.shorturl);
        addToHistory(validUrl, data.shorturl);
      } else {
        setError(data.error || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [url, history]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {}
  };

  const handleClear = () => {
    setUrl('');
    setShortUrl('');
    setError(null);
  };

  const handleUseHistory = (item: HistoryItem) => {
    setUrl(item.original);
    setShortUrl(item.short);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('url-shortener-history');
  };

  const handleQrRedirect = () => {
    if (shortUrl) {
      window.open(`/tools/qr-generator?url=${encodeURIComponent(shortUrl)}`, '_blank');
    }
  };

  // Extract domain from URL for preview
  const getDomain = (fullUrl: string) => {
    try {
      const urlObj = new URL(fullUrl);
      return urlObj.hostname;
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-slate-800">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <div className="flex items-center gap-3">
            <span className={`${poppins.className} text-sm font-medium text-slate-600 hidden sm:block`}>URL Shortener</span>
            {history.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-100 relative"
                >
                  <History size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {history.length}
                  </span>
                </button>
                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40"
                    >
                      <div className="flex items-center justify-between mb-2 px-2">
                        <span className="text-xs font-medium text-slate-500">Recent Short Links</span>
                        <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700">Clear</button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {history.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleUseHistory(item)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                          >
                            <p className="text-xs text-slate-500 truncate">{item.original}</p>
                            <p className="text-sm font-medium text-blue-600 truncate">{item.short}</p>
                            <p className="text-[10px] text-slate-400">{item.timestamp.toLocaleString()}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Link2 size={16} /> Free & Fast URL Shortener
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            Shorten Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Links</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Transform long, messy URLs into clean, shareable links. Perfect for social media, emails, and anywhere else.
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden backdrop-blur-sm">
          <div className="p-6 md:p-8">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Globe size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                className="w-full pl-12 pr-28 py-4 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-base transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                disabled={isLoading}
              />
              <button
                onClick={handleShorten}
                disabled={isLoading || !url.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Shorten URL
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <AnimatePresence>
              {shortUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  className="mt-6"
                >
                  {/* URL Preview Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <CheckCircle2 size={16} className="text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-green-800">Short link created successfully!</span>
                    </div>

                    {/* Original URL Preview */}
                    <div className="bg-white/60 rounded-lg p-3 mb-3">
                      <p className="text-xs text-slate-500 mb-1">Original URL</p>
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-700 truncate">{url}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{getDomain(url)}</p>
                    </div>

                    {/* Short URL Display */}
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-slate-500 mb-1">Shortened URL</p>
                      <div className="flex items-center gap-2">
                        <Link2 size={14} className="text-green-600 flex-shrink-0" />
                        <input
                          type="text"
                          value={shortUrl}
                          readOnly
                          className="flex-1 bg-transparent font-mono text-sm text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      <button
                        onClick={() => handleCopy(shortUrl)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 text-sm font-medium shadow-sm"
                      >
                        {copySuccess ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                        Copy Link
                      </button>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-sm"
                      >
                        <ExternalLink size={16} />
                        Visit
                      </a>
                      <button
                        onClick={handleQrRedirect}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-sm"
                      >
                        <QrCode size={16} />
                        QR Code
                      </button>
                      <button
                        onClick={handleClear}
                        className="px-4 py-2 text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5 text-sm ml-auto"
                      >
                        <Trash2 size={14} />
                        New URL
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Features Grid - Enhanced */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap className="text-amber-500" size={22} />}
            title="Lightning Fast"
            description="Shorten URLs instantly with the reliable is.gd API. No delays, no waiting."
          />
          <FeatureCard
            icon={<History className="text-blue-500" size={22} />}
            title="Smart History"
            description="All shortened links are saved locally. Quick access to your recent creations."
          />
          <FeatureCard
            icon={<QrCode className="text-indigo-500" size={22} />}
            title="QR Ready"
            description="Generate a QR code for any short link with a single click."
          />
        </div>

        {/* Trust Badge */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <Shield size={14} className="text-green-600" />
            <span className="text-xs text-slate-600">Your data stays private — we never store your URLs</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} DevTools. Built with ❤️ for developers.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}