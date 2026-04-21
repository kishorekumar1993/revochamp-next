// app/tools/csv-to-json/CsvToJsonClient.tsx
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  FileJson,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  RefreshCw,
  Download,
  Settings,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function CsvToJsonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState('auto');
  const [hasHeader, setHasHeader] = useState(true);
  const [prettyPrint, setPrettyPrint] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Auto-detect delimiter from input
  const detectedDelimiter = useMemo(() => {
    if (!input.trim()) return ',';
    const firstLine = input.split('\n')[0] || '';
    const delimiters = [',', ';', '\t', '|'];
    const counts = delimiters.map(d => ({
      delimiter: d,
      count: (firstLine.match(new RegExp(`\\${d}`, 'g')) || []).length
    }));
    const best = counts.reduce((a, b) => a.count > b.count ? a : b);
    return best.count > 0 ? best.delimiter : ',';
  }, [input]);

  const effectiveDelimiter = delimiter === 'auto' ? detectedDelimiter : delimiter;

  // Convert CSV to JSON
  const convertCsvToJson = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const lines = input.trim().split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        setError('No data found');
        return;
      }

      const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === effectiveDelimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const headers = hasHeader ? parseLine(lines[0]) : null;
      const startIndex = hasHeader ? 1 : 0;
      
      const jsonArray: any[] = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const values = parseLine(lines[i]);
        if (hasHeader && headers) {
          const obj: Record<string, string> = {};
          headers.forEach((header, idx) => {
            if (header) {
              obj[header] = values[idx] || '';
            }
          });
          jsonArray.push(obj);
        } else {
          jsonArray.push(values);
        }
      }

      const jsonString = prettyPrint 
        ? JSON.stringify(jsonArray, null, 2)
        : JSON.stringify(jsonArray);
      
      setOutput(jsonString);
      setError(null);
    } catch (e: any) {
      setError(`Conversion error: ${e.message}`);
      setOutput('');
    }
  }, [input, effectiveDelimiter, hasHeader, prettyPrint]);

  // Auto-convert on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleSample = () => {
    setInput(`name,age,city,email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com`);
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

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>CSV to JSON</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <FileJson size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            CSV to JSON <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Converter</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Convert CSV data to JSON format. Auto‑detect delimiters, handle headers, and pretty‑print output.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Delimiter:</label>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="auto">Auto-detect ({detectedDelimiter === '\t' ? 'Tab' : detectedDelimiter})</option>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              First row as header
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={prettyPrint}
                onChange={(e) => setPrettyPrint(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Pretty print
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSample}
              className="px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-1"
            >
              <FileCode size={16} /> Sample
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-2 text-red-600 bg-white border border-slate-300 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center gap-1"
            >
              <Trash2 size={16} /> Clear
            </button>
            <button
              onClick={convertCsvToJson}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <RefreshCw size={16} /> Convert
            </button>
          </div>
        </div>

        {/* Input/Output Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CSV Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <FileCode size={16} /> CSV Input
              </h2>
              <span className="text-xs text-slate-500">
                {input.split('\n').filter(l => l.trim()).length} rows
              </span>
            </div>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder={`Paste your CSV data here. Example:\nname,age,city\nJohn,30,New York\nJane,25,Los Angeles`}
              className="flex-1 p-4 font-mono text-sm bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              spellCheck={false}
            />
          </div>

          {/* JSON Output */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <FileJson size={16} /> JSON Output
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                    output ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {copySuccess ? 'Copied!' : <><Copy size={14} /> Copy</>}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                    output ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-[#1E1E1E] p-1">
              {error ? (
                <div className="p-4 text-red-400 font-mono text-sm">
                  <strong className="flex items-center gap-2"><AlertCircle size={16} /> Error</strong>
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
                  Converted JSON will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Auto‑detect delimiter (comma, semicolon, tab, pipe)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Optional header row</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Pretty‑print JSON output</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy to clipboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Download as JSON file</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Handles quoted fields and escaped quotes</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Privacy‑first (client‑side only)</li>
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