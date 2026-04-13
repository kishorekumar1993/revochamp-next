// components/blog/FeatureList.tsx
'use client';

import { ReactNode } from 'react';

interface FeatureListProps {
  raw: string;
}

// Parse inline markdown like **bold** and convert to React elements
const parseInline = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-[#2C2A27]">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export function FeatureList({ raw }: FeatureListProps) {
  if (!raw || typeof raw !== 'string') return null;

  // Split by newline and filter out empty lines
  const items = raw.split('\n').filter(line => line.trim().length > 0);

  return (
    <div className="my-3 max-w-3xl mx-auto">
      {items.map((line, idx) => {
        const isFirst = idx === 0;
        // Remove leading bullets (-, •) and clean whitespace
        const cleanLine = line.replace(/^[-•]\s*/, '').trim();

        return (
          <div
            key={idx}
            className={`
              py-3 px-1
              border-b border-[#DDD9D2]
              ${isFirst ? 'border-t' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              {/* Optional bullet dot (uncomment if needed) */}
              {/* <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C8401E] shrink-0" /> */}
              <div className="flex-1 text-[#3A3732] text-sm leading-relaxed">
                {parseInline(cleanLine)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}