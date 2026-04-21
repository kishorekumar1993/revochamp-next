// app/tools/json-formatter/JsonFormatterClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import { Braces, Copy, Trash2, AlertCircle, CheckCircle2, Minus, Plus } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function JsonFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [isValid, setIsValid] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // --- Core Functionality ---
  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
      setIsValid(false);
    }
  }, [input, indentSize]);

  const minifyJson = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      setIsValid(true);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
      setIsValid(false);
    }
  }, [input]);

  // Auto-format on input change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      formatJson();
    }, 300);
    return () => clearTimeout(timer);
  }, [input, indentSize, formatJson]);

  // --- Helper Actions ---
  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(false);
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
    const sample = { "name": "John Doe", "age": 30, "city": "New York", "hobbies": ["reading", "coding"] };
    setInput(JSON.stringify(sample));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>JSON Formatter</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Braces size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            JSON <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Formatter</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Beautify, validate, and minify JSON data. A fast, privacy-first tool for developers.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={formatJson}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <Braces size={16} /> Format
            </button>
            <button
              onClick={minifyJson}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <Minus size={16} /> Minify
            </button>
            <div className="flex items-center gap-2 ml-4">
              <label className="text-sm text-slate-600">Indent:</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="px-2 py-1 border border-slate-300 rounded text-sm bg-white"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700">Input JSON</h2>
              {isValid && input && <CheckCircle2 size={18} className="text-green-500" />}
              {error && <AlertCircle size={18} className="text-red-500" />}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here, e.g., { "key": "value" }'
              className="flex-1 p-4 font-mono text-sm bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700">Formatted JSON</h2>
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
            <div className="flex-1 overflow-auto p-1 bg-[#1E1E1E]">
              {error ? (
                <div className="p-4 text-red-400 font-mono text-sm">
                  <strong className="flex items-center gap-2"><AlertCircle size={16} /> Syntax Error</strong>
                  <p className="mt-2">{error}</p>
                </div>
              ) : output ? (
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, background: 'transparent', fontSize: '14px', height: '100%' }}
                  showLineNumbers
                >
                  {output}
                </SyntaxHighlighter>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 font-mono">
                  Formatted JSON will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Description */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-2`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Auto-format on paste</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Syntax highlighting</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Minify to reduce size</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy to clipboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Clear & sample data</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Privacy-first (all in browser)</li>
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