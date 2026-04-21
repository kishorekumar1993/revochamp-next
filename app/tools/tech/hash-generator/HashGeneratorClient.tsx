// app/tools/hash-generator/HashGeneratorClient.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Hash,
  Copy,
  Trash2,
  CheckCircle2,
  FileUp,
  FileText,
  RefreshCw,
  AlertCircle,
  Shield,
  Zap,
  History,
  X,
  ChevronRight,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const algorithms = [
  { value: 'MD5', label: 'MD5', color: 'from-amber-500 to-orange-500', insecure: true },
  { value: 'SHA-1', label: 'SHA-1', color: 'from-yellow-500 to-amber-500', insecure: true },
  { value: 'SHA-256', label: 'SHA-256', color: 'from-blue-500 to-cyan-500', insecure: false },
  { value: 'SHA-384', label: 'SHA-384', color: 'from-indigo-500 to-purple-500', insecure: false },
  { value: 'SHA-512', label: 'SHA-512', color: 'from-violet-500 to-purple-500', insecure: false },
];

const sampleTexts = [
  { name: 'Quick Brown Fox', text: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Hello World', text: 'Hello, World!' },
  { name: 'Empty String', text: '' },
  { name: 'Numbers', text: '1234567890' },
];

export default function HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hash, setHash] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [hashHistory, setHashHistory] = useState<Array<{ algo: string; hash: string; input: string; timestamp: Date }>>([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const addToHistory = (algo: string, hashValue: string, inputText: string) => {
    if (!hashValue) return;
    setHashHistory(prev => [
      { algo, hash: hashValue, input: inputText.slice(0, 50) + (inputText.length > 50 ? '...' : ''), timestamp: new Date() },
      ...prev.slice(0, 9)
    ]);
  };

  const generateHashFromText = useCallback(async (text: string, algo: string) => {
    if (!text) {
      setHash('');
      return;
    }

    setIsProcessing(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      if (algo === 'MD5') {
        // For demo - in production use crypto-js or spark-md5
        setHash('MD5 requires external library (use SHA for production)');
      } else {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashHex = bufferToHex(hashBuffer);
        setHash(hashHex);
        addToHistory(algo, hashHex, text);
      }
    } catch (err) {
      console.error('Hash generation failed:', err);
      setHash('Error generating hash');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      if (algorithm === 'MD5') {
        setHash('MD5 file hashing not supported in demo');
      } else {
        const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
        const hashHex = bufferToHex(hashBuffer);
        setHash(hashHex);
        addToHistory(algorithm, hashHex, `[File: ${file.name}]`);
      }
    } catch (err) {
      console.error('File hash failed:', err);
      setHash('Error reading file');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [algorithm]);

  useEffect(() => {
    if (!fileName && input) {
      const timer = setTimeout(() => {
        generateHashFromText(input, algorithm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [input, algorithm, fileName, generateHashFromText]);

  const handleAlgorithmChange = (algo: string) => {
    setAlgorithm(algo);
    if (!fileName && input) {
      generateHashFromText(input, algo);
    }
  };

  const handleClear = () => {
    setInput('');
    setHash('');
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    inputRef.current?.focus();
  };

  const handleCopy = async () => {
    if (!hash || hash.startsWith('MD5 requires')) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleSample = (text: string) => {
    setInput(text);
    setFileName(null);
    generateHashFromText(text, algorithm);
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const currentAlgo = algorithms.find(a => a.value === algorithm)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <div className="flex items-center gap-3">
            <span className={`${poppins.className} text-sm font-medium text-slate-600 hidden sm:block`}>Hash Generator</span>
            <div className="h-6 w-px bg-slate-300 hidden sm:block" />
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-100"
              title="Hash History"
            >
              <History size={20} />
              {hashHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {hashHistory.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Shield size={16} /> Military-Grade Hashing
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            Cryptographic <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Hash</span> Generator
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Generate secure SHA-256, SHA-512, MD5 hashes from text or files. Everything happens locally in your browser.
          </p>
        </motion.div>

        {/* Algorithm Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {algorithms.map((algo) => (
              <motion.button
                key={algo.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAlgorithmChange(algo.value)}
                className={`relative px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-sm ${
                  algorithm === algo.value
                    ? `bg-gradient-to-r ${algo.color} text-white shadow-md`
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {algo.label}
                {algo.insecure && algorithm === algo.value && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 text-white text-[10px] items-center justify-center">!</span>
                  </span>
                )}
              </motion.button>
            ))}
          </div>
          {currentAlgo.insecure && (
            <div className="mt-3 flex items-center justify-center gap-2 text-amber-600 text-sm">
              <AlertCircle size={14} />
              <span>{currentAlgo.label} is considered cryptographically broken. Use only for checksums.</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Settings */}
          <div className="lg:col-span-2 space-y-5">
            {/* Input Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden backdrop-blur-sm"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText size={18} className="text-indigo-600" />
                  Input Data
                  {fileName && (
                    <span className="ml-2 text-sm font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      {fileName}
                    </span>
                  )}
                </h2>
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button
                    onClick={triggerFileUpload}
                    className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5 font-medium"
                  >
                    <FileUp size={14} /> Upload File
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-slate-600"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to hash..."
                disabled={!!fileName}
                className="w-full p-5 min-h-[220px] bg-white text-slate-800 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-sm leading-relaxed disabled:bg-slate-50 disabled:text-slate-500 placeholder:text-slate-400"
                spellCheck={false}
              />
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap gap-2">
                <span className="text-xs text-slate-500 mr-2 flex items-center">Samples:</span>
                {sampleTexts.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSample(sample.text)}
                    className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-all text-slate-600 hover:text-indigo-700 shadow-sm"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Output Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Hash size={18} className="text-indigo-600" />
                  {algorithm} Hash
                </h2>
                <button
                  onClick={handleCopy}
                  disabled={!hash || isProcessing || hash.startsWith('MD5 requires')}
                  className={`text-xs px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 font-medium ${
                    hash && !isProcessing && !hash.startsWith('MD5 requires')
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {copySuccess ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {copySuccess ? 'Copied!' : 'Copy Hash'}
                </button>
              </div>
              <div className="p-5 bg-slate-50/30 min-h-[120px] flex items-center">
                {isProcessing ? (
                  <div className="flex items-center gap-3 text-indigo-600">
                    <RefreshCw size={20} className="animate-spin" />
                    <span className="font-medium">Computing hash...</span>
                  </div>
                ) : hash ? (
                  <div className="w-full">
                    <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                      <code className="font-mono text-sm break-all select-all text-slate-800">{hash}</code>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <Zap size={12} /> {hash.length} characters
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <ChevronRight size={16} />
                    Enter text or upload a file to generate hash
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - History & Info */}
          <div className="space-y-5">
            {/* Hash History */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden"
                >
                  <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <History size={18} className="text-indigo-600" />
                      Recent Hashes
                    </h3>
                    <button
                      onClick={() => setHashHistory([])}
                      className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {hashHistory.length === 0 ? (
                      <p className="p-5 text-sm text-slate-500 text-center">No hashes generated yet</p>
                    ) : (
                      hashHistory.map((item, idx) => (
                        <div key={idx} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{item.algo}</span>
                            <span className="text-[10px] text-slate-400">{item.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="font-mono text-xs text-slate-700 truncate mb-1">{item.hash}</p>
                          <p className="text-xs text-slate-500 truncate">{item.input}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-xl border border-indigo-200/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Shield size={20} className="text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Why Hash?</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Verify file integrity</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Store passwords securely</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Generate unique identifiers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>100% client-side, zero data leaves your browser</span>
                </li>
              </ul>
              <div className="mt-5 pt-5 border-t border-indigo-200/50">
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Pro tip:</span> Use SHA-256 or SHA-512 for security-critical applications.
                </p>
              </div>
            </motion.div>
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