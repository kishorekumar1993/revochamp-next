// app/tools/uuid-generator/UuidGeneratorClient.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Fingerprint,
  Copy,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Download,
  Settings,
  Plus,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function UuidGeneratorClient() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [copySuccess, setCopySuccess] = useState<number | null>(null);

  // Generate a single UUID v4
  const generateUuid = useCallback((): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }, []);

  // Apply formatting options
  const formatUuid = useCallback((uuid: string): string => {
    let formatted = uuid;
    if (uppercase) {
      formatted = formatted.toUpperCase();
    }
    if (noHyphens) {
      formatted = formatted.replace(/-/g, '');
    }
    return formatted;
  }, [uppercase, noHyphens]);

  // Generate multiple UUIDs
  const handleGenerate = useCallback(() => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(formatUuid(generateUuid()));
    }
    setUuids(newUuids);
  }, [count, generateUuid, formatUuid]);

  // Generate on initial load
  React.useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Copy single UUID
  const handleCopy = async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopySuccess(index);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Copy all UUIDs
  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopySuccess(-1); // -1 indicates "copy all"
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Download as text file
  const handleDownload = () => {
    if (uuids.length === 0) return;
    const content = uuids.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all
  const handleClear = () => {
    setUuids([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>UUID Generator</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Fingerprint size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            UUID <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Generator</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Generate random UUID v4 identifiers. Batch generate, format, and copy with ease.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Count:</label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Uppercase
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={noHyphens}
                onChange={(e) => setNoHyphens(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remove hyphens
            </label>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
              >
                <RefreshCw size={16} /> Generate
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2 text-red-600"
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Generated UUIDs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <Fingerprint size={16} /> Generated UUIDs ({uuids.length})
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                disabled={uuids.length === 0}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded transition-colors ${
                  uuids.length > 0 ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {copySuccess === -1 ? 'Copied!' : <><Copy size={14} /> Copy All</>}
              </button>
              <button
                onClick={handleDownload}
                disabled={uuids.length === 0}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded transition-colors ${
                  uuids.length > 0 ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
          <div className="p-4 max-h-[500px] overflow-auto">
            {uuids.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No UUIDs generated. Click "Generate" to create.</p>
            ) : (
              <div className="space-y-2">
                {uuids.map((uuid, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors group"
                  >
                    <code className="font-mono text-sm text-slate-800 break-all">{uuid}</code>
                    <button
                      onClick={() => handleCopy(uuid, index)}
                      className="ml-3 p-1.5 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy UUID"
                    >
                      {copySuccess === index ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Information Box */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className={`${poppins.className} font-semibold text-slate-800 mb-2`}>What is a UUID?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A Universally Unique Identifier (UUID) is a 128-bit label used for information in computer systems.
              This tool generates UUID v4 which is randomly generated and has 122 bits of randomness.
              The format is: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where 'y' is one of 8, 9, A, or B.
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className={`${poppins.className} font-semibold text-slate-800 mb-2`}>Features</h3>
            <ul className="grid grid-cols-1 gap-1 text-sm text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Generate UUID v4 (RFC 4122)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Batch generation (up to 100)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Formatting options (uppercase, no hyphens)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy individual or all UUIDs</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Download as text file</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> 100% client-side generation</li>
            </ul>
          </div>
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