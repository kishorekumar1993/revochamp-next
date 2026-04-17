'use client';

import { useState } from 'react';

export default function SearchBar({
  initialQuery,
  onSearch,
}: {
  initialQuery: string;
  onSearch: (q: string) => void;
}) {
  const [value, setValue] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`
          relative flex items-center gap-3
          px-3 sm:px-4 py-2.5 sm:py-3
          bg-white border-2 rounded-lg
          transition-all duration-300
          ${
            isFocused
              ? 'border-blue-500 shadow-lg shadow-blue-500/20'
              : 'border-slate-300 hover:border-slate-400'
          }
        `}
      >
        {/* Search icon */}
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input field */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search articles..."
          className="
            flex-1 bg-transparent outline-none
            text-sm sm:text-base text-slate-900 placeholder-slate-500
            min-w-0
          "
        />

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="
              flex-shrink-0 p-1 text-slate-400 hover:text-slate-600
              transition-colors duration-200
              rounded hover:bg-slate-100
            "
            aria-label="Clear search"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Submit button - mobile hidden on smaller screens */}
        <button
          type="submit"
          className="
            flex-shrink-0 p-1 text-blue-500 hover:text-blue-600
            transition-colors duration-200 rounded hover:bg-blue-50
            hidden sm:block
          "
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Mobile submit indicator */}
      <p className="text-xs text-slate-500 mt-1 sm:hidden">
        Press enter to search
      </p>
    </form>
  );
}

// 'use client';
// import { useState } from 'react';

// export default function SearchBar({
//   initialQuery,
//   onSearch,
// }: {
//   initialQuery: string;
//   onSearch: (q: string) => void;
// }) {
//   const [value, setValue] = useState(initialQuery);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSearch(value);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="relative">
//       <input
//         type="text"
//         value={value}
//         onChange={e => setValue(e.target.value)}
//         placeholder="Search articles..."
//         className="border border-border bg-white/50 px-4 py-2 pr-10 w-64 focus:outline-none focus:border-red"
//       />
//       <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
//         🔍
//       </button>
//     </form>
//   );
// }