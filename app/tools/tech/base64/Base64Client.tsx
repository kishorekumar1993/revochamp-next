// app/tools/base64/Base64Client.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import { Code2, Copy, Trash2, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function Base64Client() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // --- Core Functionality ---
  const handleProcess = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (mode === 'encode') {
        // Safe Unicode to Base64 using TextEncoder
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const binaryString = String.fromCharCode(...data);
        const encoded = btoa(binaryString);
        setOutput(encoded);
      } else {
        // Decode Base64 to Unicode
        const binaryString = atob(input);
        const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
        const decoder = new TextDecoder('utf-8');
        const decoded = decoder.decode(bytes);
        setOutput(decoded);
      }
      setError(null);
    } catch (err: any) {
      setError(mode === 'decode' ? 'Invalid Base64 string' : 'Encoding failed');
      setOutput('');
    }
  }, [input, mode]);

  // --- Helper Actions ---
  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
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
    const sampleText = 'Hello, World! 🌍 こんにちは';
    setInput(sampleText);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>Base64 Encoder/Decoder</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Code2 size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            Base64 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Encoder/Decoder</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Convert text to Base64 or decode Base64 strings back to plain text. Fully Unicode‑aware and privacy‑first.
          </p>
        </motion.div>

        {/* Mode Toggle & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'encode'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'decode'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Decode
              </button>
            </div>
            <button
              onClick={handleProcess}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <ArrowRightLeft size={16} /> Process
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePaste} className="px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-1">
              <Copy size={16} /> Paste
            </button>
            <button onClick={handleSample} className="px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              Sample
            </button>
            <button onClick={handleClear} className="px-3 py-2 text-red-600 bg-white border border-slate-300 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center gap-1">
              <Trash2 size={16} /> Clear
            </button>
          </div>
        </div>

        {/* Input/Output Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700">
                {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
              </h2>
              {input && !error && <CheckCircle2 size={18} className="text-green-500" />}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
              className="flex-1 p-4 font-mono text-sm bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMode}
                  className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
                  title="Swap input and output"
                >
                  Swap
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                    output ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {copySuccess ? 'Copied!' : <><Copy size={14} /> Copy</>}
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto bg-slate-50/50">
              {error ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-mono text-sm">
                  <strong>Error:</strong> {error}
                </div>
              ) : output ? (
                <pre className="font-mono text-sm whitespace-pre-wrap break-all text-slate-800">
                  {output}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 font-mono text-sm">
                  {mode === 'encode' ? 'Base64 output will appear here' : 'Decoded text will appear here'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features & Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className={`${poppins.className} font-semibold text-slate-800 mb-2`}>Features</h3>
            <ul className="grid grid-cols-1 gap-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Full Unicode support (emoji, CJK, etc.)</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> One-click encode/decode toggle</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Swap input/output</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy results to clipboard</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Paste from clipboard</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Clear all fields</li>
            </ul>
          </div>
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className={`${poppins.className} font-semibold text-slate-800 mb-2`}>About Base64</h3>
            <p className="text-sm text-slate-600">
              Base64 encoding represents binary data in an ASCII string format by translating it into a radix-64 representation.
              It is commonly used to embed image data or other binary assets in text formats like JSON, XML, or HTML.
              This tool uses the browser's built‑in APIs to ensure data never leaves your computer.
            </p>
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