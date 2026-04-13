import { DifficultyConfig } from '@/types/topic';

interface Props {
  difficulties: DifficultyConfig[];
  selected: string;
  onSelect: (difficulty: string) => void;
}

export default function TopicFilters({ difficulties, selected, onSelect }: Props) {
  return (
    <div className="container">
      <div className="level-filters">
        {difficulties.map((diff) => (
          <button
            key={diff.name}
            className={`filter-chip ${selected === diff.name ? 'selected' : ''}`}
            onClick={() => onSelect(diff.name)}
            style={selected === diff.name ? { backgroundColor: diff.color, borderColor: diff.color } : undefined}
          >
            <span style={{ marginRight: '4px' }}>{diff.icon}</span>
            {diff.name}
          </button>
        ))}
      </div>
    </div>
  );
}