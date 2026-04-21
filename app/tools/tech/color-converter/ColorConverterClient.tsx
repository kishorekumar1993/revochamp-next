// app/tools/color-converter/ColorConverterClient.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Palette,
  Copy,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Pipette,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

// Utility functions for color conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const c = 1 - (r / 255);
  const m = 1 - (g / 255);
  const y = 1 - (b / 255);
  const k = Math.min(c, m, y);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((c - k) / (1 - k)) * 100),
    m: Math.round(((m - k) / (1 - k)) * 100),
    y: Math.round(((y - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number } {
  c /= 100; m /= 100; y /= 100; k /= 100;
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

export default function ColorConverterClient() {
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [cmyk, setCmyk] = useState({ c: 76, m: 47, y: 0, k: 4 });
  const [activeInput, setActiveInput] = useState<'hex' | 'rgb' | 'hsl' | 'cmyk'>('hex');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Sync all formats based on the active input
  const updateFromHex = useCallback((newHex: string) => {
    setHex(newHex);
    const rgbVal = hexToRgb(newHex);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
      setCmyk(rgbToCmyk(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  }, []);

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
    setCmyk(rgbToCmyk(r, g, b));
  }, []);

  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const rgbVal = hslToRgb(h, s, l);
    setRgb(rgbVal);
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
    setCmyk(rgbToCmyk(rgbVal.r, rgbVal.g, rgbVal.b));
  }, []);

  const updateFromCmyk = useCallback((c: number, m: number, y: number, k: number) => {
    setCmyk({ c, m, y, k });
    const rgbVal = cmykToRgb(c, m, y, k);
    setRgb(rgbVal);
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
    setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
  }, []);

  // Handle input changes
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setActiveInput('hex');
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      updateFromHex(val);
    } else {
      setHex(val);
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    setActiveInput('rgb');
    const newRgb = { ...rgb, [channel]: Math.min(255, Math.max(0, value)) };
    updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    setActiveInput('hsl');
    const max = channel === 'h' ? 360 : 100;
    const newHsl = { ...hsl, [channel]: Math.min(max, Math.max(0, value)) };
    updateFromHsl(newHsl.h, newHsl.s, newHsl.l);
  };

  const handleCmykChange = (channel: 'c' | 'm' | 'y' | 'k', value: number) => {
    setActiveInput('cmyk');
    const newCmyk = { ...cmyk, [channel]: Math.min(100, Math.max(0, value)) };
    updateFromCmyk(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
  };

  const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setActiveInput('hex');
    updateFromHex(val);
  };

  const handleCopy = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(format);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSample = () => {
    updateFromHex('#F97316'); // Orange-500
  };

  const handleReset = () => {
    updateFromHex('#3B82F6'); // Blue-500
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>Color Converter</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Palette size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            Color <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Converter</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Convert colors between HEX, RGB, HSL, and CMYK. Real‑time preview and easy copying.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Preview & Picker */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center space-y-4">
            <div
              className="w-48 h-48 rounded-2xl shadow-lg border-4 border-white ring-1 ring-slate-200 transition-colors duration-150"
              style={{ backgroundColor: hex }}
            />
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={handleColorPicker}
                className="w-12 h-12 rounded-lg cursor-pointer border border-slate-300"
                title="Pick a color"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSample}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm flex items-center gap-1"
                >
                  <RefreshCw size={14} /> Sample
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-1"
                >
                  <Trash2 size={14} /> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Color Formats */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
            {/* HEX */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">HEX</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={hex}
                  onChange={handleHexChange}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="#RRGGBB"
                />
                <button
                  onClick={() => handleCopy(hex, 'hex')}
                  className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy HEX"
                >
                  {copySuccess === 'hex' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* RGB */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">RGB</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={rgb.r}
                      onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                      min={0}
                      max={255}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">R</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={rgb.g}
                      onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                      min={0}
                      max={255}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">G</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={rgb.b}
                      onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                      min={0}
                      max={255}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">B</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                  className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy RGB"
                >
                  {copySuccess === 'rgb' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
              {/* RGB Sliders */}
              <div className="mt-2 space-y-1">
                <Slider label="R" value={rgb.r} max={255} onChange={(v) => handleRgbChange('r', v)} color="red" />
                <Slider label="G" value={rgb.g} max={255} onChange={(v) => handleRgbChange('g', v)} color="green" />
                <Slider label="B" value={rgb.b} max={255} onChange={(v) => handleRgbChange('b', v)} color="blue" />
              </div>
            </div>

            {/* HSL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">HSL</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={hsl.h}
                      onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                      min={0}
                      max={360}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">H°</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={hsl.s}
                      onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">S%</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={hsl.l}
                      onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">L%</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                  className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy HSL"
                >
                  {copySuccess === 'hsl' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <Slider label="H" value={hsl.h} max={360} onChange={(v) => handleHslChange('h', v)} color="slate" />
                <Slider label="S" value={hsl.s} max={100} onChange={(v) => handleHslChange('s', v)} color="slate" />
                <Slider label="L" value={hsl.l} max={100} onChange={(v) => handleHslChange('l', v)} color="slate" />
              </div>
            </div>

            {/* CMYK */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CMYK</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <div>
                    <input
                      type="number"
                      value={cmyk.c}
                      onChange={(e) => handleCmykChange('c', parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">C%</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={cmyk.m}
                      onChange={(e) => handleCmykChange('m', parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">M%</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={cmyk.y}
                      onChange={(e) => handleCmykChange('y', parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">Y%</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={cmyk.k}
                      onChange={(e) => handleCmykChange('k', parseInt(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm text-center"
                    />
                    <span className="text-xs text-slate-500 block text-center mt-0.5">K%</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'cmyk')}
                  className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy CMYK"
                >
                  {copySuccess === 'cmyk' ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Convert between HEX, RGB, HSL, CMYK</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Color picker with preview</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Sliders for RGB and HSL channels</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Real‑time synchronization</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy individual formats</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Sample and reset buttons</li>
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

// Slider component for RGB/HSL
function Slider({ label, value, max, onChange, color }: { label: string; value: number; max: number; onChange: (v: number) => void; color: string }) {
  const getTrackStyle = () => {
    if (color === 'red') return 'bg-gradient-to-r from-black via-red-500 to-red-500';
    if (color === 'green') return 'bg-gradient-to-r from-black via-green-500 to-green-500';
    if (color === 'blue') return 'bg-gradient-to-r from-black via-blue-500 to-blue-500';
    return 'bg-gradient-to-r from-slate-300 to-slate-600';
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono w-8">{label}</span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer ${getTrackStyle()}`}
      />
      <span className="text-xs font-mono w-10 text-right">{value}</span>
    </div>
  );
}