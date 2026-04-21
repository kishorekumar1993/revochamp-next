// app/tools/ssl-checker/SslCheckerClient.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Shield,
  Globe,
  Search,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Fingerprint,
  Key,
  Server,
  Wifi,
  RefreshCw,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Info,
  History,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';
import { checkSSLCertificate, CertificateDetails } from './actions';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const sampleDomains = [
  { name: 'Google', domain: 'google.com', icon: '🔍' },
  { name: 'GitHub', domain: 'github.com', icon: '🐙' },
  { name: 'Cloudflare', domain: 'cloudflare.com', icon: '☁️' },
  { name: 'Mozilla', domain: 'mozilla.org', icon: '🦊' },
  { name: 'Apple', domain: 'apple.com', icon: '🍎' },
  { name: 'Amazon', domain: 'amazon.com', icon: '📦' },
];

interface HistoryItem {
  domain: string;
  timestamp: Date;
  isValid: boolean;
  daysRemaining: number;
}

export default function SslCheckerClient() {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [certDetails, setCertDetails] = useState<CertificateDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'fingerprints' | 'sans'>('details');
  const [recentChecks, setRecentChecks] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ssl-checker-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecentChecks(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (e) {}
    }
  }, []);

  const addToHistory = (domainName: string, isValid: boolean, daysLeft: number) => {
    const newItem: HistoryItem = {
      domain: domainName,
      timestamp: new Date(),
      isValid,
      daysRemaining: daysLeft,
    };
    const updated = [newItem, ...recentChecks.filter(h => h.domain !== domainName)].slice(0, 5);
    setRecentChecks(updated);
    localStorage.setItem('ssl-checker-history', JSON.stringify(updated));
  };

  const handleCheck = useCallback(async (domainToCheck: string) => {
    if (!domainToCheck.trim()) return;

    let cleanDomain = domainToCheck.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
    cleanDomain = cleanDomain.split('/')[0];
    cleanDomain = cleanDomain.split(':')[0];

    setIsLoading(true);
    setError(null);
    setCertDetails(null);

    try {
      const result = await checkSSLCertificate(cleanDomain);
      if (result.success && result.data) {
        setCertDetails(result.data);
        addToHistory(cleanDomain, result.data.isValid, result.data.daysRemaining);
      } else {
        setError(result.error || 'Failed to retrieve SSL certificate.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [recentChecks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheck(domain);
  };

  const handleSample = (sampleDomain: string) => {
    setDomain(sampleDomain);
    handleCheck(sampleDomain);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getValidityStatus = (daysRemaining: number) => {
    if (daysRemaining < 0) return { 
      label: 'Expired', 
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: XCircle,
      progress: 0
    };
    if (daysRemaining < 30) return { 
      label: 'Expiring Soon', 
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      icon: AlertCircle,
      progress: (daysRemaining / 30) * 100
    };
    return { 
      label: 'Valid', 
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: CheckCircle2,
      progress: 100
    };
  };

  const getSecurityGrade = (details: CertificateDetails): { grade: string; color: string } => {
    if (!details.isValid) return { grade: 'F', color: 'text-red-600' };
    if (details.signatureAlgorithm.includes('SHA1')) return { grade: 'C', color: 'text-amber-600' };
    if (details.publicKeyAlgorithm.includes('RSA') && details.signatureAlgorithm.includes('SHA256')) {
      if (details.daysRemaining > 60) return { grade: 'A+', color: 'text-green-600' };
      return { grade: 'A', color: 'text-green-600' };
    }
    if (details.signatureAlgorithm.includes('SHA384')) return { grade: 'A+', color: 'text-green-600' };
    return { grade: 'B+', color: 'text-blue-600' };
  };

  const clearHistory = () => {
    setRecentChecks([]);
    localStorage.removeItem('ssl-checker-history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <div className="flex items-center gap-3">
            <span className={`${poppins.className} text-sm font-medium text-slate-600 hidden sm:block`}>
              SSL Checker
            </span>
            {recentChecks.length > 0 && (
              <div className="relative group">
                <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-100">
                  <History size={18} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 hidden group-hover:block">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-xs font-medium text-slate-500">Recent Checks</span>
                    <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700">Clear</button>
                  </div>
                  {recentChecks.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSample(item.domain)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{item.domain}</span>
                        <span className={`text-xs ${item.isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {item.daysRemaining}d
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{item.timestamp.toLocaleTimeString()}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Shield size={16} /> Enterprise-Grade SSL Inspector
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            SSL Certificate <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Checker</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Verify SSL/TLS certificates instantly. Check expiration, issuer, cipher strength, and more.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Globe size={20} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain name (e.g., example.com)"
              className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-base transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !domain.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search size={14} />
                  Check SSL
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            <span className="text-xs text-slate-500 mr-1 flex items-center">Try:</span>
            {sampleDomains.map((sample) => (
              <button
                key={sample.domain}
                onClick={() => handleSample(sample.domain)}
                className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all text-slate-600 hover:text-blue-700 shadow-sm flex items-center gap-1"
              >
                <span>{sample.icon}</span> {sample.name}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-16"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                </div>
                <p className="text-slate-600 font-medium">Establishing secure connection...</p>
                <p className="text-sm text-slate-400">Fetching certificate for {domain}</p>
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
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1">Connection Failed</h3>
                  <p className="text-red-700">{error}</p>
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => inputRef.current?.focus()}
                      className="text-sm text-red-700 font-medium hover:text-red-800"
                    >
                      Try another domain
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {certDetails && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${certDetails.isValid ? 'bg-green-100' : 'bg-red-100'}`}>
                        {certDetails.isValid ? (
                          <Shield size={24} className="text-green-600" />
                        ) : (
                          <AlertCircle size={24} className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="font-bold text-slate-800 text-xl">{domain}</h2>
                          <a
                            href={`https://${domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                        <p className="text-sm text-slate-500">
                          Issued by {certDetails.issuer.commonName || certDetails.issuer.organization || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getValidityStatus(certDetails.daysRemaining).color}`}>
                        <span className="flex items-center gap-1.5">
                          {React.createElement(getValidityStatus(certDetails.daysRemaining).icon, { size: 14 })}
                          {getValidityStatus(certDetails.daysRemaining).label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800">{getSecurityGrade(certDetails).grade}</div>
                        <div className="text-xs text-slate-500">Security Grade</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Certificate Validity</span>
                    <span className="font-medium text-slate-800">
                      {certDetails.daysRemaining > 0 ? `${certDetails.daysRemaining} days remaining` : 'Expired'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        certDetails.daysRemaining < 0 ? 'bg-red-500' :
                        certDetails.daysRemaining < 30 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, (certDetails.daysRemaining / 90) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Issued: {formatDate(certDetails.validFrom)}</span>
                    <span>Expires: {formatDate(certDetails.validTo)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50/50">
                  <StatCard icon={<Key size={16} />} label="Signature" value={certDetails.signatureAlgorithm} />
                  <StatCard icon={<Wifi size={16} />} label="Protocol" value={certDetails.protocol || 'TLS'} />
                  <StatCard icon={<Server size={16} />} label="Cipher Suite" value={certDetails.cipher || 'N/A'} />
                  <StatCard icon={<Fingerprint size={16} />} label="Public Key" value={certDetails.publicKeyAlgorithm} />
                </div>

                <div className="border-t border-slate-200">
                  <div className="flex border-b border-slate-200">
                    {[
                      { id: 'details', label: 'Certificate Details', icon: Info },
                      { id: 'fingerprints', label: 'Fingerprints', icon: Fingerprint },
                      { id: 'sans', label: 'Subject Alt Names', icon: Layers },
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

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      {activeTab === 'details' && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Subject</h4>
                            <div className="space-y-3">
                              <InfoRow label="Common Name" value={certDetails.subject.commonName || 'N/A'} onCopy={handleCopy} />
                              <InfoRow label="Organization" value={certDetails.subject.organization || 'N/A'} onCopy={handleCopy} />
                              <InfoRow label="Organizational Unit" value={certDetails.subject.organizationalUnit || 'N/A'} onCopy={handleCopy} />
                              <InfoRow label="Locality" value={certDetails.subject.locality || 'N/A'} onCopy={handleCopy} />
                              <InfoRow label="State/Province" value={certDetails.subject.state || 'N/A'} onCopy={handleCopy} />
                              <InfoRow label="Country" value={certDetails.subject.country || 'N/A'} onCopy={handleCopy} />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Issuer</h4>
                            <div className="space-y-3">
                              <InfoRow label="Common Name" value={certDetails.issuer.commonName || 'N/A'} onCopy={handleCopy} />
                              <InfoRow label="Organization" value={certDetails.issuer.organization || 'N/A'} onCopy={handleCopy} />
                              <InfoRow label="Country" value={certDetails.issuer.country || 'N/A'} onCopy={handleCopy} />
                              <InfoRow label="Serial Number" value={certDetails.serialNumber} onCopy={handleCopy} monospace />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'fingerprints' && (
                        <motion.div
                          key="fingerprints"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 mb-2">SHA-256 Fingerprint</p>
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-sm text-slate-800 break-all flex-1">{certDetails.fingerprint256}</code>
                              <CopyButton text={certDetails.fingerprint256} />
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 mb-2">SHA-1 Fingerprint (Legacy)</p>
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-sm text-slate-800 break-all flex-1">{certDetails.fingerprint}</code>
                              <CopyButton text={certDetails.fingerprint} />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'sans' && (
                        <motion.div
                          key="sans"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <h4 className="text-sm font-semibold text-slate-700 mb-3">Subject Alternative Names</h4>
                          {certDetails.subjectAltNames.length > 0 ? (
                            <div className="bg-slate-50 rounded-xl divide-y divide-slate-200">
                              {certDetails.subjectAltNames.map((name, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3">
                                  <span className="font-mono text-sm text-slate-700">{name}</span>
                                  <CopyButton text={name} />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">No Subject Alternative Names found.</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {certDetails.daysRemaining < 30 && certDetails.daysRemaining >= 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-md"
                >
                  <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Certificate expires in {certDetails.daysRemaining} days</p>
                    <p className="text-sm text-amber-700 mt-1">Renew soon to maintain trust and avoid browser warnings.</p>
                  </div>
                </motion.div>
              )}
              {certDetails.daysRemaining < 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4 shadow-md"
                >
                  <XCircle size={20} className="text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Certificate has expired</p>
                    <p className="text-sm text-red-700 mt-1">Visitors will see security warnings. Renew immediately.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Zap className="text-amber-500" />}
            title="Instant Analysis"
            description="Real-time SSL/TLS inspection with detailed certificate chain information."
          />
          <FeatureCard
            icon={<Shield className="text-green-500" />}
            title="Security Grade"
            description="Automated security scoring based on cipher strength and protocol version."
          />
          <FeatureCard
            icon={<History className="text-blue-500" />}
            title="Check History"
            description="Recent checks are saved locally for quick access and monitoring."
          />
        </div>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} DevTools. Built with ❤️ for developers.
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-mono text-sm font-medium text-slate-800 truncate" title={value}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value, onCopy, monospace = false }: { label: string; value: string; onCopy: (text: string) => void; monospace?: boolean }) {
  return (
    <div className="flex items-start justify-between py-1">
      <span className="text-sm text-slate-500 w-32 flex-shrink-0">{label}</span>
      <div className="flex-1 flex items-center gap-2">
        <span className={`text-sm text-slate-800 break-all ${monospace ? 'font-mono' : ''}`}>{value}</span>
        {value !== 'N/A' && <CopyButton text={value} />}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };
  return (
    <button onClick={handleCopy} className="text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0">
      {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

// // app/tools/ssl-checker/SslCheckerClient.tsx
// "use client";

// import React, { useState, useCallback, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Playfair_Display, Poppins } from 'next/font/google';
// import Link from 'next/link';
// import {
//   Shield,
//   Globe,
//   Search,
//   Copy,
//   CheckCircle2,
//   AlertCircle,
//   Clock,
//   Calendar,
//   Fingerprint,
//   Key,
//   Hash,
//   Server,
//   Wifi,
//   RefreshCw,
//   ChevronRight,
//   XCircle,
// } from 'lucide-react';
// import { checkSSLCertificate, CertificateDetails } from './actions';

// const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
// const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// const sampleDomains = [
//   { name: 'Google', domain: 'google.com' },
//   { name: 'GitHub', domain: 'github.com' },
//   { name: 'Cloudflare', domain: 'cloudflare.com' },
//   { name: 'Mozilla', domain: 'mozilla.org' },
// ];

// export default function SslCheckerClient() {
//   const [domain, setDomain] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [certDetails, setCertDetails] = useState<CertificateDetails | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [copySuccess, setCopySuccess] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleCheck = useCallback(async (domainToCheck: string) => {
//     if (!domainToCheck.trim()) return;

//     // Clean domain input
//     let cleanDomain = domainToCheck.trim().toLowerCase();
//     cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
//     cleanDomain = cleanDomain.split('/')[0];
//     cleanDomain = cleanDomain.split(':')[0];

//     setIsLoading(true);
//     setError(null);
//     setCertDetails(null);

//     try {
//       const result = await checkSSLCertificate(cleanDomain);
//       if (result.success && result.data) {
//         setCertDetails(result.data);
//       } else {
//         setError(result.error || 'Failed to retrieve SSL certificate.');
//       }
//     } catch (err) {
//       setError('An unexpected error occurred.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     handleCheck(domain);
//   };

//   const handleSample = (sampleDomain: string) => {
//     setDomain(sampleDomain);
//     handleCheck(sampleDomain);
//   };

//   const handleCopy = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//     } catch (err) {
//       console.error('Copy failed:', err);
//     }
//   };

//   const formatDate = (isoString: string) => {
//     return new Date(isoString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const getValidityStatus = (daysRemaining: number) => {
//     if (daysRemaining < 0) return { label: 'Expired', color: 'text-red-600 bg-red-50' };
//     if (daysRemaining < 30) return { label: 'Expiring Soon', color: 'text-amber-600 bg-amber-50' };
//     return { label: 'Valid', color: 'text-green-600 bg-green-50' };
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-800">
//       <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
//           <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
//             DevTools
//           </Link>
//           <span className={`${poppins.className} text-sm font-medium text-slate-600`}>SSL Checker</span>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
//           <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
//             <Shield size={16} /> SSL/TLS Certificate Inspector
//           </div>
//           <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
//             SSL Certificate <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Checker</span>
//           </h1>
//           <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
//             Verify SSL/TLS certificates for any domain. Check expiration, issuer, and security details.
//           </p>
//         </motion.div>

//         {/* Search Input */}
//         <div className="max-w-3xl mx-auto mb-10">
//           <form onSubmit={handleSubmit} className="relative">
//             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//               <Globe size={20} />
//             </div>
//             <input
//               ref={inputRef}
//               type="text"
//               value={domain}
//               onChange={(e) => setDomain(e.target.value)}
//               placeholder="Enter domain (e.g., example.com)"
//               className="w-full pl-12 pr-28 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-base"
//               disabled={isLoading}
//             />
//             <button
//               type="submit"
//               disabled={isLoading || !domain.trim()}
//               className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <RefreshCw size={14} className="animate-spin" />
//                   Checking...
//                 </>
//               ) : (
//                 <>
//                   <Search size={14} />
//                   Check
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Sample Domains */}
//           <div className="flex flex-wrap justify-center gap-2 mt-4">
//             <span className="text-xs text-slate-500 mr-2 flex items-center">Try:</span>
//             {sampleDomains.map((sample) => (
//               <button
//                 key={sample.domain}
//                 onClick={() => handleSample(sample.domain)}
//                 className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all text-slate-600 hover:text-blue-700 shadow-sm"
//               >
//                 {sample.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Results */}
//         <AnimatePresence mode="wait">
//           {isLoading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex justify-center py-12"
//             >
//               <div className="flex flex-col items-center gap-3">
//                 <RefreshCw size={32} className="animate-spin text-blue-600" />
//                 <p className="text-slate-600">Fetching SSL certificate...</p>
//               </div>
//             </motion.div>
//           )}

//           {error && !isLoading && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="max-w-3xl mx-auto"
//             >
//               <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
//                 <div className="p-2 bg-red-100 rounded-full">
//                   <XCircle size={24} className="text-red-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-red-800 mb-1">Certificate Check Failed</h3>
//                   <p className="text-red-700">{error}</p>
//                   <p className="text-sm text-red-600 mt-2">Make sure the domain is reachable and has a valid SSL certificate.</p>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {certDetails && !isLoading && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="space-y-6"
//             >
//               {/* Summary Card */}
//               <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
//                 <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200 flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-blue-100 rounded-xl">
//                       <Shield size={20} className="text-blue-600" />
//                     </div>
//                     <div>
//                       <h2 className="font-semibold text-slate-800 text-lg">{domain || 'Certificate'}</h2>
//                       <p className="text-sm text-slate-500">Issued by {certDetails.issuer.commonName || certDetails.issuer.organization || 'Unknown'}</p>
//                     </div>
//                   </div>
//                   <div className={`px-4 py-2 rounded-full text-sm font-medium ${getValidityStatus(certDetails.daysRemaining).color}`}>
//                     {getValidityStatus(certDetails.daysRemaining).label}
//                     {certDetails.isValid && certDetails.daysRemaining >= 0 && (
//                       <span className="ml-2 text-xs">({certDetails.daysRemaining} days left)</span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
//                   <div>
//                     <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar size={12} /> Valid From</p>
//                     <p className="font-mono text-sm font-medium text-slate-800">{formatDate(certDetails.validFrom)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Calendar size={12} /> Valid To</p>
//                     <p className="font-mono text-sm font-medium text-slate-800">{formatDate(certDetails.validTo)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Key size={12} /> Signature</p>
//                     <p className="font-mono text-sm font-medium text-slate-800">{certDetails.signatureAlgorithm}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><Wifi size={12} /> Protocol</p>
//                     <p className="font-mono text-sm font-medium text-slate-800">{certDetails.protocol || 'TLS'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Detailed Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Issuer & Subject */}
//                 <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6">
//                   <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                     <Server size={18} className="text-indigo-600" />
//                     Certificate Details
//                   </h3>
//                   <div className="space-y-4">
//                     <InfoRow label="Common Name" value={certDetails.subject.commonName || 'N/A'} onCopy={() => handleCopy(certDetails.subject.commonName || '')} />
//                     <InfoRow label="Organization" value={certDetails.subject.organization || 'N/A'} onCopy={() => handleCopy(certDetails.subject.organization || '')} />
//                     <InfoRow label="Issuer CN" value={certDetails.issuer.commonName || 'N/A'} onCopy={() => handleCopy(certDetails.issuer.commonName || '')} />
//                     <InfoRow label="Issuer Org" value={certDetails.issuer.organization || 'N/A'} onCopy={() => handleCopy(certDetails.issuer.organization || '')} />
//                     <InfoRow label="Serial Number" value={certDetails.serialNumber} onCopy={() => handleCopy(certDetails.serialNumber)} />
//                     <InfoRow label="Public Key Algorithm" value={certDetails.publicKeyAlgorithm} onCopy={() => handleCopy(certDetails.publicKeyAlgorithm)} />
//                     <InfoRow label="Cipher Suite" value={certDetails.cipher || 'N/A'} onCopy={() => handleCopy(certDetails.cipher || '')} />
//                   </div>
//                 </div>

//                 {/* Fingerprints & SANs */}
//                 <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6">
//                   <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
//                     <Fingerprint size={18} className="text-indigo-600" />
//                     Fingerprints & SANs
//                   </h3>
//                   <div className="space-y-4">
//                     <InfoRow label="SHA-1 Fingerprint" value={certDetails.fingerprint} onCopy={() => handleCopy(certDetails.fingerprint)} monospace />
//                     <InfoRow label="SHA-256 Fingerprint" value={certDetails.fingerprint256} onCopy={() => handleCopy(certDetails.fingerprint256)} monospace />
//                     <div>
//                       <p className="text-xs text-slate-500 mb-2">Subject Alternative Names (SANs)</p>
//                       {certDetails.subjectAltNames.length > 0 ? (
//                         <div className="bg-slate-50 rounded-xl p-3 max-h-40 overflow-y-auto">
//                           {certDetails.subjectAltNames.map((name, idx) => (
//                             <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
//                               <span className="font-mono text-sm text-slate-700">{name}</span>
//                               <button
//                                 onClick={() => handleCopy(name)}
//                                 className="text-slate-400 hover:text-blue-600 transition-colors"
//                               >
//                                 <Copy size={12} />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-sm text-slate-400">No SANs found</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Validity Warning */}
//               {certDetails.daysRemaining < 30 && certDetails.daysRemaining >= 0 && (
//                 <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
//                   <AlertCircle size={20} className="text-amber-600 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-amber-800">Certificate expires in {certDetails.daysRemaining} days</p>
//                     <p className="text-sm text-amber-700 mt-1">Renew your SSL certificate soon to avoid service interruption.</p>
//                   </div>
//                 </div>
//               )}
//               {certDetails.daysRemaining < 0 && (
//                 <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
//                   <XCircle size={20} className="text-red-600 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-red-800">Certificate has expired</p>
//                     <p className="text-sm text-red-700 mt-1">This certificate is no longer valid. Visitors will see security warnings.</p>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Features */}
//         <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-slate-200/80">
//           <h3 className={`${poppins.className} font-semibold text-slate-800 mb-4`}>Features</h3>
//           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
//             <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Check SSL certificate of any domain</li>
//             <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> View issuer and subject details</li>
//             <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Check expiration date and days remaining</li>
//             <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Display SHA-1 and SHA-256 fingerprints</li>
//             <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> List Subject Alternative Names (SANs)</li>
//             <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy certificate details to clipboard</li>
//             <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Real-time validation status</li>
//             <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> 100% secure server-side checking</li>
//           </ul>
//         </div>
//       </main>

//       <footer className="border-t border-slate-200/60 py-8 mt-8 bg-white/50 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
//           © {new Date().getFullYear()} DevTools. Built with ❤️ for developers.
//         </div>
//       </footer>
//     </div>
//   );
// }

// // Helper component for info rows
// function InfoRow({ label, value, onCopy, monospace = false }: { label: string; value: string; onCopy: () => void; monospace?: boolean }) {
//   const [copied, setCopied] = useState(false);
//   const handleCopy = () => {
//     onCopy();
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };
//   return (
//     <div className="flex items-start justify-between">
//       <span className="text-sm text-slate-500 w-32 flex-shrink-0">{label}</span>
//       <div className="flex-1 flex items-center gap-2">
//         <span className={`text-sm text-slate-800 break-all ${monospace ? 'font-mono' : ''}`}>{value}</span>
//         {value !== 'N/A' && (
//           <button onClick={handleCopy} className="text-slate-400 hover:text-blue-600 transition-colors flex-shrink-0">
//             {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }