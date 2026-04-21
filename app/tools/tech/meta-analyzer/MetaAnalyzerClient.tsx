// app/tools/meta-analyzer/MetaAnalyzerClient.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Search,
  Globe,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  FileText,
  Image,
  Share2,
  X,
  XCircle,
  Shield,
  Award,
  TrendingUp,
  Eye,
  Code,
  ChevronRight,
} from 'lucide-react';
import { analyzeMetaTags, MetaTags } from './actions';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const sampleUrls = [
  { name: 'Google', url: 'google.com', icon: '🔍' },
  { name: 'GitHub', url: 'github.com', icon: '🐙' },
  { name: 'OpenAI', url: 'openai.com', icon: '🤖' },
  { name: 'Vercel', url: 'vercel.com', icon: '▲' },
];

export default function MetaAnalyzerClient() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metaData, setMetaData] = useState<MetaTags | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'seo' | 'social' | 'other'>('seo');

  const handleAnalyze = useCallback(async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setIsLoading(true);
    setError(null);
    setMetaData(null);

    try {
      const result = await analyzeMetaTags(targetUrl);
      if (result.success && result.data) {
        setMetaData(result.data);
      } else {
        setError(result.error || 'Failed to analyze URL');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze(url);
  };

  const handleSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    handleAnalyze(sampleUrl);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {}
  };

  // Calculate SEO score
  const getSeoScore = (data: MetaTags): number => {
    let score = 0;
    if (data.title) score += 25;
    if (data.description && data.description.length >= 50 && data.description.length <= 160) score += 25;
    if (data.viewport) score += 15;
    if (data.robots && !data.robots.includes('noindex')) score += 15;
    if (data.canonical) score += 10;
    if (data.language) score += 10;
    return Math.min(100, score);
  };

  const seoScore = metaData ? getSeoScore(metaData) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>Meta Analyzer</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Search size={16} /> SEO & Social Meta Inspector
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            Meta Tag <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Analyze title, description, Open Graph, Twitter Cards, and more. Optimize your site's appearance in search and social media.
          </p>
        </motion.div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Globe size={20} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-base transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={14} />
                  Analyze
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            <span className="text-xs text-slate-500 mr-1 flex items-center">Try:</span>
            {sampleUrls.map((sample) => (
              <button
                key={sample.url}
                onClick={() => handleSample(sample.url)}
                className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all text-slate-600 hover:text-blue-700 shadow-sm flex items-center gap-1"
              >
                <span>{sample.icon}</span> {sample.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading & Error States */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                </div>
                <p className="text-slate-600 font-medium">Fetching meta tags...</p>
              </div>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 shadow-lg">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Analysis Failed</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {metaData && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* URL Bar with Score */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Globe size={18} className="text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-mono text-sm truncate max-w-md">{metaData.url}</span>
                  <a
                    href={metaData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                  >
                    Visit <ExternalLink size={14} />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">SEO Score</p>
                    <p className="text-2xl font-bold text-slate-800">{seoScore}<span className="text-sm font-normal text-slate-400">/100</span></p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    seoScore >= 80 ? 'bg-green-100 text-green-600' :
                    seoScore >= 50 ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Award size={24} />
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-slate-200">
                {[
                  { id: 'seo', label: 'SEO Tags', icon: FileText },
                  { id: 'social', label: 'Social Cards', icon: Share2 },
                  { id: 'other', label: 'Other', icon: Code },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'seo' && (
                    <motion.div
                      key="seo"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <MetaCard title="Essential SEO" icon={<FileText size={18} className="text-blue-600" />}>
                        <MetaRow label="Title" value={metaData.title} required onCopy={() => handleCopy(metaData.title || '', 'title')} copySuccess={copySuccess} />
                        <MetaRow label="Description" value={metaData.description} required onCopy={() => handleCopy(metaData.description || '', 'description')} copySuccess={copySuccess} />
                        <MetaRow label="Keywords" value={metaData.keywords} onCopy={() => handleCopy(metaData.keywords || '', 'keywords')} copySuccess={copySuccess} />
                        <MetaRow label="Author" value={metaData.author} onCopy={() => handleCopy(metaData.author || '', 'author')} copySuccess={copySuccess} />
                        <MetaRow label="Canonical" value={metaData.canonical} onCopy={() => handleCopy(metaData.canonical || '', 'canonical')} copySuccess={copySuccess} />
                      </MetaCard>
                      <MetaCard title="Technical SEO" icon={<Search size={18} className="text-indigo-600" />}>
                        <MetaRow label="Viewport" value={metaData.viewport} required onCopy={() => handleCopy(metaData.viewport || '', 'viewport')} copySuccess={copySuccess} />
                        <MetaRow label="Robots" value={metaData.robots} onCopy={() => handleCopy(metaData.robots || '', 'robots')} copySuccess={copySuccess} />
                        <MetaRow label="Language" value={metaData.language} onCopy={() => handleCopy(metaData.language || '', 'language')} copySuccess={copySuccess} />
                        <MetaRow label="Charset" value={metaData.charset} onCopy={() => handleCopy(metaData.charset || '', 'charset')} copySuccess={copySuccess} />
                      </MetaCard>
                    </motion.div>
                  )}

                  {activeTab === 'social' && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <MetaCard title="Open Graph" icon={<Share2 size={18} className="text-indigo-600" />}>
                        <MetaRow label="og:title" value={metaData.ogTitle} onCopy={() => handleCopy(metaData.ogTitle || '', 'og:title')} copySuccess={copySuccess} />
                        <MetaRow label="og:description" value={metaData.ogDescription} onCopy={() => handleCopy(metaData.ogDescription || '', 'og:description')} copySuccess={copySuccess} />
                        <MetaRow label="og:image" value={metaData.ogImage} onCopy={() => handleCopy(metaData.ogImage || '', 'og:image')} copySuccess={copySuccess} />
                        <MetaRow label="og:url" value={metaData.ogUrl} onCopy={() => handleCopy(metaData.ogUrl || '', 'og:url')} copySuccess={copySuccess} />
                        <MetaRow label="og:type" value={metaData.ogType} onCopy={() => handleCopy(metaData.ogType || '', 'og:type')} copySuccess={copySuccess} />
                        <MetaRow label="og:site_name" value={metaData.ogSiteName} onCopy={() => handleCopy(metaData.ogSiteName || '', 'og:site_name')} copySuccess={copySuccess} />
                        {metaData.ogImage && (
                          <div className="mt-3">
                            <p className="text-xs text-slate-500 mb-2">Image Preview</p>
                            <img src={metaData.ogImage} alt="OG" className="max-h-32 rounded-lg border border-slate-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                      </MetaCard>
                      <MetaCard title="X (Twitter) Cards" icon={<X size={18} className="text-slate-700" />}>
                        <MetaRow label="twitter:card" value={metaData.twitterCard} onCopy={() => handleCopy(metaData.twitterCard || '', 'twitter:card')} copySuccess={copySuccess} />
                        <MetaRow label="twitter:title" value={metaData.twitterTitle} onCopy={() => handleCopy(metaData.twitterTitle || '', 'twitter:title')} copySuccess={copySuccess} />
                        <MetaRow label="twitter:description" value={metaData.twitterDescription} onCopy={() => handleCopy(metaData.twitterDescription || '', 'twitter:description')} copySuccess={copySuccess} />
                        <MetaRow label="twitter:image" value={metaData.twitterImage} onCopy={() => handleCopy(metaData.twitterImage || '', 'twitter:image')} copySuccess={copySuccess} />
                        <MetaRow label="twitter:site" value={metaData.twitterSite} onCopy={() => handleCopy(metaData.twitterSite || '', 'twitter:site')} copySuccess={copySuccess} />
                      </MetaCard>
                    </motion.div>
                  )}

                  {activeTab === 'other' && (
                    <motion.div
                      key="other"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="lg:col-span-2"
                    >
                      <MetaCard title="Other Meta Tags" icon={<Code size={18} className="text-purple-600" />}>
                        <MetaRow label="Favicon" value={metaData.favicon} onCopy={() => handleCopy(metaData.favicon || '', 'favicon')} copySuccess={copySuccess} />
                        {metaData.favicon && (
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm text-slate-500">Preview:</span>
                            <img src={metaData.favicon} alt="favicon" className="w-5 h-5" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                      </MetaCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Summary Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  Summary
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatBadge label="Title" present={!!metaData.title} />
                  <StatBadge label="Description" present={!!metaData.description} />
                  <StatBadge label="Open Graph" present={!!metaData.ogTitle && !!metaData.ogImage} />
                  <StatBadge label="Twitter Card" present={!!metaData.twitterCard} />
                  <StatBadge label="Viewport" present={!!metaData.viewport} />
                  <StatBadge label="Canonical" present={!!metaData.canonical} />
                  <StatBadge label="Language" present={!!metaData.language} />
                  <StatBadge label="Favicon" present={!!metaData.favicon} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<Search className="text-blue-500" size={20} />}
            title="Complete Analysis"
            description="Extracts all meta tags: basic SEO, Open Graph, Twitter Cards, and more."
          />
          <FeatureCard
            icon={<Award className="text-amber-500" size={20} />}
            title="SEO Scoring"
            description="Get an instant SEO score based on essential meta tag presence."
          />
          <FeatureCard
            icon={<Copy className="text-indigo-500" size={20} />}
            title="Easy Copy"
            description="Copy any meta tag value with one click for quick use."
          />
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

// Helper Components
function MetaCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          {icon}
          {title}
        </h3>
      </div>
      <div className="p-5 space-y-3">
        {children}
      </div>
    </div>
  );
}

function MetaRow({ label, value, required, onCopy, copySuccess }: { label: string; value: string | null; required?: boolean; onCopy: () => void; copySuccess: string | null }) {
  const statusIcon = value ? <CheckCircle2 size={14} className="text-green-500" /> : required ? <XCircle size={14} className="text-red-500" /> : <AlertCircle size={14} className="text-amber-500" />;
  
  return (
    <div className="flex items-start gap-2 group">
      <div className="w-24 flex-shrink-0 flex items-center gap-1.5">
        {statusIcon}
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className={`text-sm break-all ${value ? 'text-slate-800' : 'text-slate-400 italic'}`}>
          {value || 'Not specified'}
        </span>
        {value && (
          <button onClick={onCopy} className="text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
            {copySuccess === label ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}

function StatBadge({ label, present }: { label: string; present: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      present ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      {present ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {label}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
