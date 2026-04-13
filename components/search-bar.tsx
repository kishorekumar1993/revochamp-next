"use client";

import { useState, useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export default function SearchBar({ value, onChange, debounceMs = 300 }: Props) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => onChange(localValue), debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  return (
    <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm px-4 h-12">
      <span className="text-gray-400 mr-2">🔍</span>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search courses by title, topic, or skill..."
        className="w-full outline-none text-sm"
      />
      {localValue && (
        <button onClick={() => setLocalValue("")} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
    )}
    </div>
  );
}