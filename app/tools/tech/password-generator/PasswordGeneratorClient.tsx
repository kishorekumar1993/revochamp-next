// app/tools/password-generator/PasswordGeneratorClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Lock,
  Copy,
  RefreshCw,
  CheckCircle2,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Settings,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface CharacterSets {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [charSets, setCharSets] = useState<CharacterSets>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [strength, setStrength] = useState<{ score: number; label: string; color: string }>({
    score: 0,
    label: 'Weak',
    color: 'text-red-500',
  });

  // Character pools
  const pools = {
    uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
    lowercase: 'abcdefghijkmnpqrstuvwxyz',
    numbers: '23456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  const ambiguousPools = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
  };

  // Calculate password strength
  const calculateStrength = useCallback((pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'text-slate-400' };
    
    let score = 0;
    const checks = [
      pwd.length >= 8,
      pwd.length >= 12,
      pwd.length >= 16,
      /[A-Z]/.test(pwd),
      /[a-z]/.test(pwd),
      /[0-9]/.test(pwd),
      /[^A-Za-z0-9]/.test(pwd),
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score <= 2) return { score, label: 'Weak', color: 'text-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'text-yellow-500' };
    if (score <= 5) return { score, label: 'Good', color: 'text-blue-500' };
    return { score, label: 'Strong', color: 'text-green-500' };
  }, []);

  // Generate password
  const generatePassword = useCallback(() => {
    const selectedPools = charSets.excludeAmbiguous ? pools : ambiguousPools;
    
    let chars = '';
    if (charSets.uppercase) chars += selectedPools.uppercase;
    if (charSets.lowercase) chars += selectedPools.lowercase;
    if (charSets.numbers) chars += selectedPools.numbers;
    if (charSets.symbols) chars += selectedPools.symbols;

    if (!chars) {
      setPassword('');
      setStrength({ score: 0, label: 'None', color: 'text-slate-400' });
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    // Ensure at least one character from each selected set
    if (charSets.uppercase && !/[A-Z]/.test(result)) {
      const pos = Math.floor(Math.random() * length);
      const char = selectedPools.uppercase[Math.floor(Math.random() * selectedPools.uppercase.length)];
      result = result.substring(0, pos) + char + result.substring(pos + 1);
    }
    if (charSets.lowercase && !/[a-z]/.test(result)) {
      const pos = Math.floor(Math.random() * length);
      const char = selectedPools.lowercase[Math.floor(Math.random() * selectedPools.lowercase.length)];
      result = result.substring(0, pos) + char + result.substring(pos + 1);
    }
    if (charSets.numbers && !/[0-9]/.test(result)) {
      const pos = Math.floor(Math.random() * length);
      const char = selectedPools.numbers[Math.floor(Math.random() * selectedPools.numbers.length)];
      result = result.substring(0, pos) + char + result.substring(pos + 1);
    }
    if (charSets.symbols && !/[^A-Za-z0-9]/.test(result)) {
      const pos = Math.floor(Math.random() * length);
      const char = selectedPools.symbols[Math.floor(Math.random() * selectedPools.symbols.length)];
      result = result.substring(0, pos) + char + result.substring(pos + 1);
    }

    setPassword(result);
    setStrength(calculateStrength(result));
  }, [length, charSets, calculateStrength]);

  // Regenerate on settings change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleCharSet = (key: keyof CharacterSets) => {
    setCharSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStrengthIcon = () => {
    if (strength.score <= 2) return <ShieldAlert size={16} className="text-red-500" />;
    if (strength.score <= 4) return <Shield size={16} className="text-yellow-500" />;
    return <ShieldCheck size={16} className="text-green-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>Password Generator</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Lock size={16} /> Free Security Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            Password <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Generator</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Create strong, random passwords with customizable length and character sets. 100% client‑side and secure.
          </p>
        </motion.div>

        {/* Password Display */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                readOnly
                className="w-full px-4 py-3 pr-24 bg-slate-50 border border-slate-300 rounded-xl font-mono text-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy password"
                >
                  {copySuccess ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
                <button
                  onClick={generatePassword}
                  className="p-1.5 text-slate-500 hover:text-blue-600 transition-colors"
                  title="Generate new password"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Strength Meter */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-600 flex items-center gap-1">
                {getStrengthIcon()}
                Strength: <span className={`font-medium ${strength.color}`}>{strength.label}</span>
              </span>
              <span className="text-xs text-slate-500">{password.length} characters</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  strength.score <= 2 ? 'bg-red-500 w-1/4' :
                  strength.score <= 4 ? 'bg-yellow-500 w-2/4' :
                  strength.score <= 5 ? 'bg-blue-500 w-3/4' :
                  'bg-green-500 w-full'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
            <Settings size={16} /> Customize Password
          </h3>

          {/* Length Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-slate-600">Length</label>
              <span className="text-sm font-mono font-medium text-slate-800">{length}</span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Set Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={charSets.uppercase}
                onChange={() => toggleCharSet('uppercase')}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={charSets.lowercase}
                onChange={() => toggleCharSet('lowercase')}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={charSets.numbers}
                onChange={() => toggleCharSet('numbers')}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={charSets.symbols}
                onChange={() => toggleCharSet('symbols')}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Symbols (!@#$...)</span>
            </label>
          </div>

          {/* Exclude Ambiguous Characters */}
          <label className="flex items-center gap-3 mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={charSets.excludeAmbiguous}
              onChange={() => toggleCharSet('excludeAmbiguous')}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">
              Exclude ambiguous characters (e.g., I, l, 1, O, 0)
            </span>
          </label>
        </div>

        {/* Features */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Cryptographically secure random</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Customizable length (4-64)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Select character types</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Exclude ambiguous characters</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Real-time strength meter</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Show/hide password</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy to clipboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> 100% client-side generation</li>
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