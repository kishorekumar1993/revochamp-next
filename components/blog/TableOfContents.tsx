// TableOfContents.tsx
'use client';
import { useEffect, useState } from 'react';

export function TableOfContents({ headings }: { headings: string[] }) {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '0px 0px -40% 0px' }
    );
    headings.forEach(h => {
      const el = document.getElementById(slugify(h));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="hidden md:block">
      <h3 className="text-xs font-semibold tracking-wider text-[#6B6760] border-b pb-2 mb-3">IN THIS ARTICLE</h3>
      <ul className="space-y-2 text-sm">
        {headings.map(h => (
          <li key={h}>
            <a href={`#${slugify(h)}`} className={`hover:text-[#C8401E] ${activeId === slugify(h) ? 'text-[#C8401E] font-medium' : ''}`}>
              {h}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}