'use client';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  totalTopics: number;
  category: string;
}

export default function TopicSearch({ value, onChange, onClear, totalTopics, category }: Props) {
  return (
    <div className="container">
      <div className="search-bar-wrapper" style={{ marginBottom: '24px' }}>
        <div className="search-bar">
          <span className="material-icons">search</span>
          <input
            type="search"
            placeholder={`Search ${totalTopics}+ ${category} topics...`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {/* ✅ Always render the button, control visibility with CSS */}
          <button
            className="clear-btn"
            onClick={onClear}
            style={{ visibility: value ? 'visible' : 'hidden' }}
          >
            <span className="material-icons">close</span>
          </button>
          <button className="search-btn">Search</button>
        </div>
      </div>
    </div>
  );
}