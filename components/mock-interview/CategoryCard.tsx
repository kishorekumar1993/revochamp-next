import { CategoryItem } from '@/lib/interviews';

interface Props {
  category: CategoryItem;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryCard({ category, isSelected, onClick }: Props) {
  const bgColor = `#${category.color.toString(16).padStart(6, '0')}`;
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-xl border-2 transition-all text-center ${
        isSelected
          ? 'border-rich-blue bg-rich-blue/5'
          : 'border-light-gray bg-white hover:border-rich-blue/30'
      }`}
    >
      <div className="text-4xl mb-2">{category.emoji}</div>
      <h3 className="font-bold text-text-dark text-sm">{category.name}</h3>
      <p className="text-xs text-text-muted mt-1">{category.count} interviews</p>
    </button>
  );
}