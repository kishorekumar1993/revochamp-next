// app/tools/url-parser/UrlParserClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Link2,
  Globe,
  Server,
  Hash,
  FileText,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Settings,
  Lock,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface ParsedUrl {
  href: string;
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  isValid: boolean;
  queryParams: Record<string, string>;
}

export default function UrlParserClient() {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const parsed = useMemo<ParsedUrl | null>(() => {
    if (!input.trim()) {
      setError(null);
      return null;
    }

    try {
      // Try to construct a URL object
      const url = new URL(input);
      
      // Parse query parameters
      const queryParams: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      setError(null);
      return {
        href: url.href,
        protocol: url.protocol.replace(':', ''),
        username: url.username,
        password: url.password,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        isValid: true,
        queryParams,
      };
    } catch (e) {
      setError('Invalid URL. Please check the format and try again.');
      return null;
    }
  }, [input]);

  const handleClear = () => {
    setInput('');
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      console.error('Failed to paste: ', err);
    }
  };

  const handleSample = () => {
    setInput('https://john:secret@api.example.com:8080/v1/users?page=2&limit=50&sort=desc#results');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>URL Parser</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Link2 size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            URL <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Parser</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Analyze and extract components from any URL — protocol, host, path, query parameters, and more.
          </p>
        </motion.div>

        {/* Input Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Link2 size={18} />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a URL to parse (e.g., https://example.com:8080/path?key=value#section)"
                className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePaste}
                className="px-4 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Copy size={16} /> Paste
              </button>
              <button
                onClick={handleSample}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <Search size={16} /> Sample
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2 text-red-600"
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Parsed Results */}
        {parsed && parsed.isValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`${poppins.className} font-semibold text-slate-800 text-lg`}>URL Overview</h2>
                <button
                  onClick={() => handleCopy(parsed.href)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {copySuccess ? 'Copied!' : <><Copy size={14} /> Copy Full URL</>}
                </button>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 break-all font-mono text-sm text-slate-700 border border-slate-200">
                {parsed.href}
              </div>
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Protocol & Origin */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <Globe size={16} /> Protocol & Origin
                </h3>
                <div className="space-y-3">
                  <ComponentRow label="Protocol" value={parsed.protocol} onCopy={() => handleCopy(parsed.protocol)} />
                  <ComponentRow label="Origin" value={parsed.origin} onCopy={() => handleCopy(parsed.origin)} />
                </div>
              </div>

              {/* Host & Port */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <Server size={16} /> Host Information
                </h3>
                <div className="space-y-3">
                  <ComponentRow label="Hostname" value={parsed.hostname} onCopy={() => handleCopy(parsed.hostname)} />
                  <ComponentRow label="Port" value={parsed.port || '80/443 (default)'} onCopy={() => handleCopy(parsed.port)} />
                  {parsed.username && (
                    <ComponentRow label="Username" value={parsed.username} onCopy={() => handleCopy(parsed.username)} />
                  )}
                  {parsed.password && (
                    <ComponentRow label="Password" value={'•'.repeat(parsed.password.length)} onCopy={() => handleCopy(parsed.password)} />
                  )}
                </div>
              </div>

              {/* Path */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <FileText size={16} /> Path
                </h3>
                <ComponentRow label="Pathname" value={parsed.pathname || '/'} onCopy={() => handleCopy(parsed.pathname)} />
              </div>

              {/* Hash / Fragment */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-3">
                  <Hash size={16} /> Fragment
                </h3>
                <ComponentRow 
                  label="Hash" 
                  value={parsed.hash ? parsed.hash.substring(1) : '(none)'} 
                  onCopy={() => handleCopy(parsed.hash)} 
                />
              </div>
            </div>

            {/* Query Parameters */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-4">
                <Settings size={16} /> Query Parameters
              </h3>
              {Object.keys(parsed.queryParams).length > 0 ? (
                <div className="divide-y divide-slate-200">
                  {Object.entries(parsed.queryParams).map(([key, value]) => (
                    <div key={key} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {key}
                        </span>
                        <ArrowRight size={14} className="text-slate-400" />
                        <span className="font-mono text-sm text-slate-600 break-all">
                          {decodeURIComponent(value)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(value)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="Copy value"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No query parameters present.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!parsed && !error && input.trim() === '' && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
              <Link2 size={28} className="text-blue-600" />
            </div>
            <h3 className={`${poppins.className} font-medium text-slate-700 mb-1`}>Enter a URL to begin</h3>
            <p className="text-sm text-slate-500">Paste any URL and we'll break it down into its components.</p>
          </div>
        )}

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Parse any valid URL</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Extract query parameters</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Decode percent-encoded values</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy individual components</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Sample URL for testing</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Privacy-first (client-side)</li>
          </ul>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} DevTools. Built for developers.
        </div>
      </footer>
    </div>
  );
}

// Helper component for displaying a row with copy button
function ComponentRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500 w-24">{label}:</span>
      <div className="flex-1 flex items-center justify-between gap-2">
        <code className="font-mono text-sm text-slate-800 break-all">{value}</code>
        {value && value !== '(none)' && value !== '80/443 (default)' && (
          <button
            onClick={onCopy}
            className="text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0"
            title="Copy"
          >
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}