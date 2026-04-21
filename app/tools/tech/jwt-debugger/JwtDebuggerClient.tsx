// app/tools/jwt-debugger/JwtDebuggerClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  KeyRound,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Shield,
  FileCode,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface DecodedJwt {
  header: any;
  payload: any;
  signature: string;
  isValid: boolean;
  error?: string;
  expiresAt?: Date;
  isExpired?: boolean;
  issuedAt?: Date;
  notBefore?: Date;
}

export default function JwtDebuggerClient() {
  const [input, setInput] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const decoded = useMemo<DecodedJwt | null>(() => {
    if (!input.trim()) return null;

    const parts = input.split('.');
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        signature: '',
        isValid: false,
        error: 'Invalid JWT format. Token must have three parts separated by dots.',
      };
    }

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      // Check expiration
      let expiresAt: Date | undefined;
      let isExpired: boolean | undefined;
      if (payload.exp) {
        expiresAt = new Date(payload.exp * 1000);
        isExpired = expiresAt < new Date();
      }

      // Check issued at
      let issuedAt: Date | undefined;
      if (payload.iat) {
        issuedAt = new Date(payload.iat * 1000);
      }

      // Check not before
      let notBefore: Date | undefined;
      if (payload.nbf) {
        notBefore = new Date(payload.nbf * 1000);
      }

      return {
        header,
        payload,
        signature,
        isValid: true,
        expiresAt,
        isExpired,
        issuedAt,
        notBefore,
      };
    } catch (e: any) {
      return {
        header: null,
        payload: null,
        signature: '',
        isValid: false,
        error: 'Invalid Base64 encoding. Unable to decode header or payload.',
      };
    }
  }, [input]);

  const handleClear = () => {
    setInput('');
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
    // Sample JWT with header, payload, and signature
    setInput('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImFkbWluIjp0cnVlLCJyb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXX0.4AaW3uRj9sH4rK5vP8zN1x2Yd6f7g8h9i0j1k2l3m4n5o6p');
  };

  const handleCopy = async (text: string, part: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(part);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatTimestamp = (date?: Date) => {
    if (!date) return 'N/A';
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>JWT Debugger</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <KeyRound size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            JWT <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Debugger</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Decode, inspect, and validate JSON Web Tokens. All processing happens in your browser — your tokens never leave your machine.
          </p>
        </motion.div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-4 text-slate-400">
                <KeyRound size={18} />
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                className="w-full pl-12 pr-4 py-3.5 min-h-[120px] bg-white text-slate-800 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base placeholder:text-slate-400 font-mono resize-y"
                spellCheck={false}
              />
            </div>
            <div className="flex sm:flex-col gap-2">
              <button
                onClick={handlePaste}
                className="px-4 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2 justify-center"
              >
                <Copy size={16} /> Paste
              </button>
              <button
                onClick={handleSample}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 justify-center shadow-sm"
              >
                <FileCode size={16} /> Sample
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2 justify-center text-red-600"
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {decoded && !decoded.isValid && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span>{decoded.error}</span>
          </div>
        )}

        {/* Decoded Content */}
        {decoded && decoded.isValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Token Validity Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-4">
                <Shield size={16} /> Token Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatusCard
                  label="Expiration"
                  value={decoded.expiresAt ? formatTimestamp(decoded.expiresAt) : 'No expiration'}
                  icon={<Clock size={16} />}
                  alert={decoded.isExpired ? 'expired' : decoded.expiresAt ? 'valid' : 'none'}
                />
                <StatusCard
                  label="Issued At"
                  value={decoded.issuedAt ? formatTimestamp(decoded.issuedAt) : 'Not specified'}
                  icon={<Clock size={16} />}
                />
                <StatusCard
                  label="Not Before"
                  value={decoded.notBefore ? formatTimestamp(decoded.notBefore) : 'Not specified'}
                  icon={<Clock size={16} />}
                />
                <StatusCard
                  label="Signature"
                  value={decoded.signature ? `${decoded.signature.substring(0, 16)}...` : 'Missing'}
                  icon={<Shield size={16} />}
                  alert={decoded.signature ? 'present' : 'missing'}
                />
              </div>
              {decoded.isExpired && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">This token has expired.</span>
                </div>
              )}
            </div>

            {/* Header & Payload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <FileCode size={16} /> Header
                  </h3>
                  <button
                    onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), 'header')}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {copySuccess === 'header' ? 'Copied!' : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
                <div className="p-1 bg-[#1E1E1E]">
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, background: 'transparent', fontSize: '13px' }}
                  >
                    {JSON.stringify(decoded.header, null, 2)}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Payload */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <User size={16} /> Payload
                  </h3>
                  <button
                    onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), 'payload')}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {copySuccess === 'payload' ? 'Copied!' : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
                <div className="p-1 bg-[#1E1E1E]">
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, background: 'transparent', fontSize: '13px' }}
                  >
                    {JSON.stringify(decoded.payload, null, 2)}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Shield size={16} /> Signature
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSignature(!showSignature)}
                    className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors flex items-center gap-1"
                  >
                    {showSignature ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showSignature ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleCopy(decoded.signature, 'signature')}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {copySuccess === 'signature' ? 'Copied!' : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <code className="font-mono text-sm text-slate-800 break-all">
                  {showSignature ? decoded.signature : '•'.repeat(32)}
                </code>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Note: Signature verification requires the secret key and is not performed client-side.
              </p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!decoded && input.trim() === '' && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
              <KeyRound size={28} className="text-blue-600" />
            </div>
            <h3 className={`${poppins.className} font-medium text-slate-700 mb-1`}>Paste a JWT to decode</h3>
            <p className="text-sm text-slate-500">The token will be decoded and inspected instantly.</p>
          </div>
        )}

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Decode JWT header & payload</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Syntax highlighting for JSON</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Validate expiration (exp)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Display issued at (iat) & not before (nbf)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy individual token parts</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> 100% client-side — secure & private</li>
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

// Helper component for status cards
function StatusCard({ label, value, icon, alert }: { label: string; value: string; icon: React.ReactNode; alert?: 'expired' | 'valid' | 'present' | 'missing' | 'none' }) {
  let alertClasses = '';
  if (alert === 'expired') alertClasses = 'border-red-200 bg-red-50 text-red-700';
  else if (alert === 'valid') alertClasses = 'border-green-200 bg-green-50 text-green-700';
  else if (alert === 'present') alertClasses = 'border-blue-200 bg-blue-50 text-blue-700';
  else if (alert === 'missing') alertClasses = 'border-amber-200 bg-amber-50 text-amber-700';

  return (
    <div className={`p-4 rounded-xl border ${alertClasses || 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-2 text-sm font-medium mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-mono">{value}</p>
    </div>
  );
}