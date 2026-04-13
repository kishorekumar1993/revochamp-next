'use client';

const CATEGORIES = [
  'All', 'Technology', 'AI', 'Business', 'Finance', 'Insurance',
  'Startups', 'Health', 'Education', 'Politics', 'International',
  'Entertainment', 'Consumer',
];

export default function CategoryFilter({
  activeCategory,
  onSelect,
}: {
  activeCategory: string | null;
  onSelect: (cat: string | null) => void;
}) {
  return (
    <div className="w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div 
          className="flex gap-3 py-4 px-4 overflow-x-auto no-scrollbar items-center scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat || (cat === 'All' && !activeCategory);
            console.log('CategoryFilter rendering, activeCategory:', activeCategory);
            return (
              <button
                key={cat}
onClick={() => onSelect(cat === 'All' ? null : cat)}
                className={`
                  relative px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest 
                  transition-all duration-300 ease-out whitespace-nowrap border
                  ${isActive 
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' 
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'}
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
