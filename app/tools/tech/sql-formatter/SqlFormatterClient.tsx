// app/tools/sql-formatter/SqlFormatterClient.tsx
"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';

import Link from 'next/link';
import {
  Database,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Settings,
  FileCode,
  AlignLeft,
  Zap,
} from 'lucide-react';
// import { format, FormatOptions } from 'sql-formatter';
import { format, type FormatOptions, type SqlLanguage } from 'sql-formatter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const dialects = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'tsql', label: 'Transact-SQL' },
  { value: 'plsql', label: 'PL/SQL' },
];

const sampleQueries: Record<string, string> = {
  sql: `SELECT id, name, email, created_at FROM users WHERE status = 'active' AND created_at > '2024-01-01' ORDER BY created_at DESC LIMIT 10;`,
  mysql: `SELECT u.id, u.name, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' GROUP BY u.id HAVING order_count > 5 ORDER BY order_count DESC;`,
  postgresql: `WITH active_users AS (SELECT id, name FROM users WHERE last_login > NOW() - INTERVAL '30 days') SELECT au.name, COUNT(l.id) AS login_count FROM active_users au JOIN logins l ON au.id = l.user_id GROUP BY au.id ORDER BY login_count DESC;`,
};

export default function SqlFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dialect, setDialect] = useState('sql');
  const [indentSize, setIndentSize] = useState(2);
  const [useTabs, setUseTabs] = useState(false);
  const [uppercase, setUppercase] = useState(true);
  const [linesBetweenQueries, setLinesBetweenQueries] = useState(2);
  const [copySuccess, setCopySuccess] = useState(false);

  const formatSql = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
    //   const options: FormatOptions = {
    //     language: dialect as any,
    //     tabWidth: indentSize,
    //     useTabs,
    //     keywordCase: uppercase ? 'upper' : 'preserve',
    //     linesBetweenQueries,
    //   };
    const options: FormatOptions = {
        tabWidth: indentSize,
        useTabs,
        keywordCase: uppercase ? 'upper' : 'preserve',
        linesBetweenQueries,
        identifierCase: 'upper',
        dataTypeCase: 'upper',
        functionCase: 'upper',
        indentStyle: 'standard',
        logicalOperatorNewline: 'before',
        expressionWidth: 50,
        denseOperators: false,
        newlineBeforeSemicolon: false
    };
const formatted = format(input, { ...options, language: dialect as SqlLanguage });

    //   const formatted = format(input, options,);
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input, dialect, indentSize, useTabs, uppercase, linesBetweenQueries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleSample = () => {
    const sample = sampleQueries[dialect] || sampleQueries.sql;
    setInput(sample);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>SQL Formatter</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Database size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            SQL <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Formatter</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Beautify, format, and minify SQL queries. Supports multiple dialects and customization options.
          </p>
        </motion.div>

        {/* Controls Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Dialect:</label>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                {dialects.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Indent:</label>
              <input
                type="number"
                min={1}
                max={8}
                value={indentSize}
                onChange={(e) => setIndentSize(parseInt(e.target.value) || 2)}
                className="w-16 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={useTabs}
                onChange={(e) => setUseTabs(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Use tabs
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Uppercase keywords
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Lines between queries:</label>
              <input
                type="number"
                min={0}
                max={5}
                value={linesBetweenQueries}
                onChange={(e) => setLinesBetweenQueries(parseInt(e.target.value) || 0)}
                className="w-16 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>
            <div className="flex-1" />
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
                onClick={formatSql}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
              >
                <AlignLeft size={16} /> Format
              </button>
            </div>
          </div>
        </div>

        {/* Input/Output Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[600px]">
            <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <FileCode size={18} className="text-blue-600" />
                Input SQL
              </h2>
              <span className="text-xs text-slate-500">{input.length} characters</span>
            </div>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your SQL query here..."
              className="flex-1 p-4 font-mono text-sm bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[600px]">
            <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Database size={18} className="text-indigo-600" />
                Formatted SQL
              </h2>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded transition-colors ${
                  output ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {copySuccess ? 'Copied!' : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-[#1E1E1E] p-1">
              {error ? (
                <div className="p-4 text-red-400 font-mono text-sm">
                  <strong className="flex items-center gap-2"><AlertCircle size={16} /> Error</strong>
                  <p className="mt-2">{error}</p>
                </div>
              ) : output ? (
                <SyntaxHighlighter
                  language="sql"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, background: 'transparent', fontSize: '14px', height: '100%' }}
                  showLineNumbers
                >
                  {output}
                </SyntaxHighlighter>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 font-mono">
                  Formatted SQL will appear here
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Support for multiple SQL dialects</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Customizable indentation (spaces/tabs)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Uppercase keywords option</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Syntax highlighting in output</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Sample queries for testing</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy formatted SQL to clipboard</li>
          </ul>
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