// app/tools/regex-tester/RegexTesterClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Hash,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Settings,
  List,
  Flag,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface MatchResult {
  index: number;
  match: string;
  groups: (string | undefined)[];
  namedGroups?: Record<string, string>;
}

export default function RegexTesterClient() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const flagOptions = [
    { value: 'g', label: 'Global', description: 'Find all matches' },
    { value: 'i', label: 'Ignore Case', description: 'Case-insensitive' },
    { value: 'm', label: 'Multiline', description: '^ and $ match line boundaries' },
    { value: 's', label: 'Dot All', description: '. matches newline' },
    { value: 'u', label: 'Unicode', description: 'Full Unicode support' },
    { value: 'y', label: 'Sticky', description: 'Match from lastIndex' },
  ];

  const regex = useMemo(() => {
    if (!pattern) return null;
    try {
      return new RegExp(pattern, flags);
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, [pattern, flags]);

  const matches = useMemo<MatchResult[]>(() => {
    if (!regex || !testString) {
      setError(null);
      return [];
    }

    try {
      setError(null);
      const results: MatchResult[] = [];
      
      if (flags.includes('g')) {
        // Use matchAll for global matches with groups
        const matchesIterator = testString.matchAll(regex);
        for (const match of matchesIterator) {
          results.push({
            index: match.index!,
            match: match[0],
            groups: match.slice(1),
            namedGroups: match.groups || undefined,
          });
        }
      } else {
        // Single match without global flag
        const match = testString.match(regex);
        if (match) {
          results.push({
            index: match.index!,
            match: match[0],
            groups: match.slice(1),
            namedGroups: match.groups || undefined,
          });
        }
      }
      return results;
    } catch (e: any) {
      setError(e.message);
      return [];
    }
  }, [regex, testString, flags]);

  const highlightedText = useMemo(() => {
    if (!testString || matches.length === 0) return testString;
    
    const parts: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;
    
    // Sort matches by index
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    
    for (const match of sortedMatches) {
      if (match.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, match.index), isMatch: false });
      }
      parts.push({ text: match.match, isMatch: true });
      lastIndex = match.index + match.match.length;
    }
    
    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false });
    }
    
    return parts;
  }, [testString, matches]);

  const handleClear = () => {
    setPattern('');
    setFlags('g');
    setTestString('');
    setError(null);
  };

  const handleSample = () => {
    setPattern('(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})');
    setFlags('g');
    setTestString('Dates: 2023-10-05, 2024-01-15, and 2025-12-25.');
  };

  const handleCopyMatches = async () => {
    if (matches.length === 0) return;
    const matchText = matches.map(m => m.match).join('\n');
    try {
      await navigator.clipboard.writeText(matchText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>Regex Tester</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Hash size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            Regex <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tester</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Build and test regular expressions in real time. Highlight matches, extract groups, and debug patterns.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Regex Pattern Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Regular Expression</label>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-lg font-mono">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern (e.g., \w+@\w+\.\w+)"
                className="flex-1 px-3 py-2.5 bg-white text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-base"
                spellCheck={false}
              />
              <span className="text-slate-400 text-lg font-mono">/</span>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-20 px-3 py-2.5 bg-white text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-base"
                placeholder="g"
                spellCheck={false}
              />
            </div>
            
            {/* Flag Toggles */}
            <div className="mt-3 flex flex-wrap gap-2">
              {flagOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleFlag(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    flags.includes(opt.value)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={opt.description}
                >
                  {opt.label} ({opt.value})
                </button>
              ))}
            </div>
          </div>

          {/* Test String Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <FileCode size={16} /> Test String
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSample}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1 shadow-sm"
                >
                  <Hash size={14} /> Sample
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-1 text-red-600"
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against the regex..."
              className="w-full p-4 min-h-[150px] bg-white text-slate-800 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm"
              spellCheck={false}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <span className="font-mono text-sm">{error}</span>
            </div>
          )}

          {/* Match Results */}
          {regex && testString && !error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <List size={16} /> Matches ({matches.length})
                </h3>
                {matches.length > 0 && (
                  <button
                    onClick={handleCopyMatches}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {copySuccess ? 'Copied!' : <><Copy size={14} /> Copy All Matches</>}
                  </button>
                )}
              </div>
              
              {/* Highlighted Text Preview */}
              {highlightedText && (
                <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                  <p className="text-sm font-medium text-slate-600 mb-2">Highlighted Matches:</p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-sm whitespace-pre-wrap break-all">
                    {Array.isArray(highlightedText) ? (
                      highlightedText.map((part, i) => (
                        part.isMatch ? (
                          <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part.text}</mark>
                        ) : (
                          <span key={i}>{part.text}</span>
                        )
                      ))
                    ) : (
                      <span className="text-slate-500">{highlightedText}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Match List */}
              <div className="p-4 max-h-[400px] overflow-auto">
                {matches.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">No matches found.</p>
                ) : (
                  <div className="space-y-3">
                    {matches.map((match, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Match {idx + 1}
                          </span>
                          <span className="text-xs text-slate-500">
                            Index: {match.index}
                          </span>
                        </div>
                        <code className="block font-mono text-sm bg-white p-2 rounded border border-slate-200 break-all">
                          {match.match}
                        </code>
                        
                        {/* Capturing Groups */}
                        {match.groups.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-slate-600 mb-1">Groups:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {match.groups.map((group, gIdx) => (
                                <div key={gIdx} className="text-sm">
                                  <span className="text-slate-500">${gIdx + 1}:</span>{' '}
                                  <code className="font-mono bg-slate-100 px-1 rounded">
                                    {group || '(empty)'}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Named Groups */}
                        {match.namedGroups && Object.keys(match.namedGroups).length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-slate-600 mb-1">Named Groups:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(match.namedGroups).map(([name, value]) => (
                                <div key={name} className="text-sm">
                                  <span className="text-slate-500">{name}:</span>{' '}
                                  <code className="font-mono bg-slate-100 px-1 rounded">
                                    {value || '(empty)'}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Real‑time regex testing</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> All JavaScript regex flags supported</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Match highlighting in text</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Extract capturing & named groups</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy all matches to clipboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Clear error messages for invalid patterns</li>
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