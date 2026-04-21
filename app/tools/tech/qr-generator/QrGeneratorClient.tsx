// app/tools/qr-generator/QrGeneratorClient.tsx
// app/tools/qr-generator/QrGeneratorClient.tsx
"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import {
  QrCode,
  Download,
  Copy,
  CheckCircle2,
  Settings,
  Type,
  Link2,
  Wifi,
  Mail,
  Phone,
  User,
} from 'lucide-react';


const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

// Content type presets
const contentTypes = [
  { id: 'url', label: 'URL', icon: Link2, placeholder: 'https://example.com' },
  { id: 'text', label: 'Text', icon: Type, placeholder: 'Enter any text...' },
  { id: 'wifi', label: 'WiFi', icon: Wifi, placeholder: 'WIFI:S:MyNetwork;T:WPA;P:password;;' },
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'mailto:example@domain.com' },
  { id: 'phone', label: 'Phone', icon: Phone, placeholder: 'tel:+1234567890' },
  { id: 'contact', label: 'vCard', icon: User, placeholder: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEND:VCARD' },
];

export default function QrGeneratorClient() {
  const [content, setContent] = useState('https://example.com');
  const [contentType, setContentType] = useState('url');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [copySuccess, setCopySuccess] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Update placeholder when content type changes
  const handleContentTypeChange = (typeId: string) => {
    setContentType(typeId);
    const preset = contentTypes.find(t => t.id === typeId);
    if (preset && typeId !== 'url') {
      setContent(preset.placeholder);
    } else if (typeId === 'url') {
      setContent('https://example.com');
    }
  };

  // Download QR code as PNG
  const handleDownload = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  // Copy QR code image to clipboard
  const handleCopyImage = useCallback(async () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy image: ', err);
      alert('Copy image failed. Try download instead.');
    }
  }, []);

  // Sample presets
  const handleSample = (preset: string) => {
    if (preset === 'url') {
      setContent('https://example.com');
      setContentType('url');
    } else if (preset === 'wifi') {
      setContent('WIFI:S:MyWiFi;T:WPA;P:mypassword123;;');
      setContentType('wifi');
    } else if (preset === 'vcard') {
      setContent('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD');
      setContentType('contact');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>QR Generator</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <QrCode size={16} /> Free Developer Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            QR Code <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Generator</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Create custom QR codes for URLs, text, WiFi, and more. Download as PNG or copy to clipboard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input & Settings */}
          <div className="space-y-6">
            {/* Content Type Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <label className="block text-sm font-medium text-slate-600 mb-3">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleContentTypeChange(type.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      contentType === type.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <type.icon size={14} />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <label className="block text-sm font-medium text-slate-600 mb-2">
                {contentType === 'url' ? 'URL' : 'Content'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={contentTypes.find(t => t.id === contentType)?.placeholder || 'Enter content...'}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-mono text-sm resize-y min-h-[120px] focus:ring-2 focus:ring-blue-500"
                spellCheck={false}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleSample('url')}
                  className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Sample URL
                </button>
                <button
                  onClick={() => handleSample('wifi')}
                  className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Sample WiFi
                </button>
                <button
                  onClick={() => handleSample('vcard')}
                  className="text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Sample vCard
                </button>
              </div>
            </div>

            {/* Customization Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                <Settings size={16} /> Customization
              </h3>
              
              <div className="space-y-4">
                {/* Size Slider */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-600">Size: {size}px</label>
                  </div>
                  <input
                    type="range"
                    min={128}
                    max={512}
                    step={16}
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Foreground</label>
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Background</label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Error Correction */}
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Error Correction</label>
                  <select
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 w-full text-left">Preview</h3>
            
            <div
              ref={qrRef}
              className="bg-white p-4 rounded-xl border border-slate-200 inline-block"
              style={{ backgroundColor: bgColor }}
            >
              <QRCode
                value={content}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level={errorCorrection}
                includeMargin={true}
                // renderAs="canvas"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
              >
                <Download size={16} /> Download PNG
              </button>
              <button
                onClick={handleCopyImage}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm"
              >
                {copySuccess ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                Copy Image
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
              Scan to test • {content.length} characters
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Multiple content types (URL, text, WiFi, vCard, email, phone)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Customizable size (128–512px)</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Foreground & background colors</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Adjustable error correction level</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Download as PNG</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy image to clipboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Sample presets for quick testing</li>
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