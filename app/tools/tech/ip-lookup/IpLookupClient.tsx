// app/tools/ip-lookup/IpLookupClient.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Copy,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Globe,
  Server,
  Clock,
  Flag,
  Building2,
  History,
  X,
  Zap,
  Shield,
} from 'lucide-react';
import { lookupIp, IpInfo } from './actions';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface HistoryItem {
  ip: string;
  timestamp: Date;
  country?: string;
  city?: string;
}

export default function IpLookupClient() {
  const [ip, setIp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ipData, setIpData] = useState<IpInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [myIp, setMyIp] = useState<string>('');

  // Get user's IP on mount
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setMyIp(data.ip))
      .catch(() => {});
  }, []);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ip-lookup-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })));
      } catch (e) {}
    }
  }, []);

  const addToHistory = (ipAddress: string, data?: IpInfo) => {
    const newItem: HistoryItem = {
      ip: ipAddress,
      timestamp: new Date(),
      country: data?.country,
      city: data?.city,
    };
    const updated = [newItem, ...history.filter(h => h.ip !== ipAddress)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('ip-lookup-history', JSON.stringify(updated));
  };

  const handleLookup = useCallback(async (ipAddress: string) => {
    if (!ipAddress.trim()) {
      setError('Please enter an IP address');
      return;
    }

    // Basic IP validation
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress.trim()) && ipAddress !== 'localhost') {
      setError('Invalid IP address format');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIpData(null);

    try {
      const result = await lookupIp(ipAddress.trim());
      if (result.success && result.data) {
        setIpData(result.data);
        addToHistory(ipAddress.trim(), result.data);
      } else {
        setError(result.error || 'Failed to lookup IP address');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(ip);
  };

  const handleMyIp = () => {
    if (myIp) {
      setIp(myIp);
      handleLookup(myIp);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {}
  };

  const handleUseHistory = (historyIp: string) => {
    setIp(historyIp);
    handleLookup(historyIp);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ip-lookup-history');
  };

  const handleClear = () => {
    setIp('');
    setIpData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <div className="flex items-center gap-3">
            <span className={`${poppins.className} text-sm font-medium text-slate-600 hidden sm:block`}>IP Lookup</span>
            {history.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-100 relative"
                >
                  <History size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {history.length}
                  </span>
                </button>
                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40"
                    >
                      <div className="flex items-center justify-between mb-2 px-2">
                        <span className="text-xs font-medium text-slate-500">Recent Lookups</span>
                        <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700">Clear</button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {history.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleUseHistory(item.ip)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-mono text-slate-700">{item.ip}</span>
                              <span className="text-xs text-slate-400">{item.timestamp.toLocaleTimeString()}</span>
                            </div>
                            {item.city && item.country && (
                              <p className="text-xs text-slate-500">{item.city}, {item.country}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <Globe size={16} /> Free IP Geolocation Tool
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            IP <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Lookup</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Find detailed information about any IP address. Location, ISP, timezone, and more.
          </p>
        </motion.div>

        {/* Search Input */}
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-base font-mono transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleMyIp}
                className="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                My IP
              </button>
              <button
                type="submit"
                disabled={isLoading || !ip.trim()}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Looking up...
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    Lookup
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
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
                  <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                </div>
                <p className="text-slate-600 font-medium">Fetching IP information...</p>
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
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Lookup Failed</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {ipData && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Main Info Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-2xl">
                        <Globe size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="font-bold text-slate-800 text-xl font-mono">{ipData.query}</h2>
                          <button
                            onClick={() => handleCopy(ipData.query)}
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            {copySuccess ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                        <p className="text-sm text-slate-500">{ipData.isp}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClear}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm flex items-center gap-1"
                    >
                      <X size={14} /> Clear
                    </button>
                  </div>
                </div>

                {/* Map Preview */}
                <div className="aspect-video w-full bg-slate-100 relative">
                  <img
                    src={`https://staticmap.openstreetmap.de/staticmap.php?center=${ipData.lat},${ipData.lon}&zoom=10&size=1200x400&markers=${ipData.lat},${ipData.lon},lightblue`}
                    alt="Location Map"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${ipData.lat}&mlon=${ipData.lon}#map=10/${ipData.lat}/${ipData.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-700 shadow-sm hover:bg-white transition-colors flex items-center gap-1"
                  >
                    View on Map <ExternalLink size={12} />
                  </a>
                </div>

                {/* Details Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" />
                      Location
                    </h3>
                    <InfoRow icon={<Flag size={14} />} label="Country" value={ipData.country} sub={ipData.countryCode} />
                    <InfoRow icon={<MapPin size={14} />} label="Region" value={ipData.regionName} />
                    <InfoRow icon={<MapPin size={14} />} label="City" value={ipData.city} />
                    <InfoRow icon={<MapPin size={14} />} label="ZIP" value={ipData.zip} />
                    <InfoRow icon={<MapPin size={14} />} label="Coordinates" value={`${ipData.lat}, ${ipData.lon}`} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Server size={16} className="text-indigo-600" />
                      Network
                    </h3>
                    <InfoRow icon={<Building2 size={14} />} label="ISP" value={ipData.isp} />
                    <InfoRow icon={<Building2 size={14} />} label="Organization" value={ipData.org} />
                    <InfoRow icon={<Server size={14} />} label="ASN" value={ipData.as} />
                    <InfoRow icon={<Clock size={14} />} label="Timezone" value={ipData.timezone} />
                  </div>
                </div>
              </div>

              {/* Copy Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleCopy(JSON.stringify(ipData, null, 2))}
                  className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Copy size={14} /> Copy as JSON
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<Globe className="text-blue-500" size={20} />}
            title="Accurate Geolocation"
            description="Get precise location data including country, region, city, and coordinates."
          />
          <FeatureCard
            icon={<Server className="text-indigo-500" size={20} />}
            title="Network Details"
            description="Find ISP, organization, and ASN information for any IP address."
          />
          <FeatureCard
            icon={<History className="text-green-500" size={20} />}
            title="Lookup History"
            description="Recent lookups are saved locally for quick access later."
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

function InfoRow({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  if (!value || value === '') return null;
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">
          {value}
          {sub && <span className="text-slate-400 ml-1 text-xs">({sub})</span>}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}