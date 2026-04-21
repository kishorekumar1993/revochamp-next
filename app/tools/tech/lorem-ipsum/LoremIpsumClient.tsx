// app/tools/lorem-ipsum/LoremIpsumClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  FileText,
  Copy,
  RefreshCw,
  CheckCircle2,
  Type,
  AlignLeft,
  Pilcrow,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

// Lorem Ipsum word pool
const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
  'est', 'laborum',
];

export default function LoremIpsumClient() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Mark when we're on the client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate a single word
  const generateWord = useCallback((): string => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }, []);

  // Generate a sentence
  const generateSentence = useCallback((): string => {
    const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(generateWord());
    }
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  }, [generateWord]);

  // Generate a paragraph
  const generateParagraph = useCallback((): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-7 sentences
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  }, [generateSentence]);

  // Main generation function
  const generateText = useCallback(() => {
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      let item = '';
      if (type === 'paragraphs') {
        item = generateParagraph();
      } else if (type === 'sentences') {
        item = generateSentence();
      } else {
        const wordList: string[] = [];
        for (let j = 0; j < 10; j++) {
          wordList.push(generateWord());
        }
        item = wordList.join(' ');
      }
      results.push(item);
    }

    let finalText = type === 'paragraphs' ? results.join('\n\n') : results.join(' ');

    if (startWithLorem && type !== 'words') {
      const prefix = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
      if (type === 'paragraphs') {
        const firstPara = results[0];
        if (!firstPara.toLowerCase().startsWith('lorem ipsum')) {
          results[0] = prefix + firstPara;
          finalText = results.join('\n\n');
        }
      } else if (type === 'sentences') {
        if (!finalText.toLowerCase().startsWith('lorem ipsum')) {
          finalText = prefix + finalText;
        }
      }
    }

    setGeneratedText(finalText);
  }, [type, count, startWithLorem, generateParagraph, generateSentence, generateWord]);

  // Generate text on initial client mount and whenever dependencies change
  useEffect(() => {
    if (isClient) {
      generateText();
    }
  }, [isClient, generateText]);

  const handleCopy = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleRegenerate = () => {
    generateText();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>Lorem Ipsum</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <FileText size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            Lorem Ipsum <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Generator</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Generate placeholder text for your designs and mockups. Customize type, count, and copy instantly.
          </p>
        </motion.div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Generate</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setType('paragraphs')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                    type === 'paragraphs'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Pilcrow size={14} /> Paragraphs
                </button>
                <button
                  onClick={() => setType('sentences')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                    type === 'sentences'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <AlignLeft size={14} /> Sentences
                </button>
                <button
                  onClick={() => setType('words')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                    type === 'words'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Type size={14} /> Words
                </button>
              </div>
            </div>

            {/* Count */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Number of {type}
              </label>
              <input
                type="number"
                min={1}
                max={type === 'words' ? 100 : 20}
                value={count}
                onChange={(e) => setCount(Math.min(type === 'words' ? 100 : 20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Options */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  disabled={type === 'words'}
                />
                Start with "Lorem ipsum..."
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleRegenerate}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
            >
              <RefreshCw size={14} /> Regenerate
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={16} /> Generated Text
            </h2>
            <button
              onClick={handleCopy}
              disabled={!generatedText}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded transition-colors ${
                generatedText ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {copySuccess ? 'Copied!' : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <div className="p-6 bg-white max-h-[500px] overflow-auto">
            {generatedText ? (
              <div className="prose prose-slate max-w-none">
                {type === 'paragraphs' ? (
                  generatedText.split('\n\n').map((para, idx) => (
                    <p key={idx} className="text-slate-700 leading-relaxed mb-4 last:mb-0">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-700 leading-relaxed">{generatedText}</p>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Loading...</p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Generate paragraphs, sentences, or words</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Customizable count</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Option to start with "Lorem ipsum"</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Regenerate with new random text</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy to clipboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Clean, readable output</li>
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