"use client";

import { CategoryItem } from "@/types/course";

interface CategoryCardProps {
  category: CategoryItem;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryCard({
  category,
  isSelected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-xl border-2 transition-all text-left ${
        isSelected
          ? "border-blue-500 bg-blue-50/50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="text-5xl mb-3">{category.emoji}</div>
      <div className="font-bold text-gray-900">{category.name}</div>
      <div className="text-xs text-gray-500 mt-1">{category.count} courses</div>
    </button>
  );
}