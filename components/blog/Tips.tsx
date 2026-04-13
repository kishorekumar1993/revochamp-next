'use client';

import { Lightbulb, Gem } from 'lucide-react';

export function TipSection({ value }: { value: string }) {
  // Enhanced parser: Removes emojis and formats bold **text**
  const formatText = (text: string) => {
    // Remove emojis from the beginning of the string
    const cleanText = text.replace(/^[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{2B50}]/gu, '').trim();
    
    // Split on **markdown**
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-[#FBFBFA]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="my-14 relative group">
      {/* 🔷 Rich, Deep Navy Background with Soft Shadow */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-8 md:p-10 shadow-xl shadow-black/10 border border-[#1E293B]">
        
        {/* Subtle decorative "halo" light effect */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[80px]" />
        
        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 relative z-10">
          {/* 🔶 Icon with Classy, Gem-like Styling */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 text-emerald-400 shadow-inner">
            <Gem size={28} className="opacity-70" />
          </div>

          <div className="space-y-3">
            {/* Header Label - Sophisticated Typography */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-emerald-400/70">
                Strategic Insight
              </span>
              <div className="h-[1px] w-12 bg-emerald-400/20" />
            </div>
            
            {/* 🔷 The Content - High-End Serif for Authority */}
            <div className="text-[19px] md:text-[21px] leading-[1.7] text-[#E2E8F0] font-serif italic selection:bg-emerald-400/10">
              {formatText(value)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}