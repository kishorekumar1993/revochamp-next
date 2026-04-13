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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search articles..."
        className="border border-border bg-white/50 px-4 py-2 pr-10 w-64 focus:outline-none focus:border-red"
      />
      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
        🔍
      </button>
    </form>
  );
}