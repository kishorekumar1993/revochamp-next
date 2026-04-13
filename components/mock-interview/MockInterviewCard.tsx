import { Interview } from '@/lib/interviews';

interface Props {
  interview: Interview;
  onClick: () => void;
  onStart: () => void;
}

export default function MockInterviewCard({ interview, onClick, onStart }: Props) {
  const bgColor = `#${interview.color.toString(16).padStart(6, '0')}`;
  return (
    <div
      className="bg-white border border-light-gray rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div
        className="h-28 relative"
        style={{
          background: `linear-gradient(135deg, ${bgColor}10 0%, ${bgColor}05 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-5xl">
          {interview.emoji}
        </div>
        <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 text-xs font-semibold flex items-center gap-1">
          <span>⭐</span>
          <span>{interview.rating}</span>
        </div>
        <div
          className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-semibold"
          style={{ backgroundColor: `${bgColor}26`, color: bgColor }}
        >
          {interview.level}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-text-dark leading-tight mb-1 line-clamp-2">
          {interview.title}
        </h3>
        <p className="text-text-muted text-xs mb-2 line-clamp-2">
          {interview.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {interview.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-xs rounded"
              style={{ backgroundColor: `${bgColor}14`, color: bgColor }}
            >
              {topic}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
          <span className="flex items-center gap-1">⏱️ {interview.duration}</span>
          <span className="flex items-center gap-1">
            👥 {(interview.participantCount / 1000).toFixed(0)}k
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          className="w-full bg-rich-blue text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Start Practicing
        </button>
      </div>
    </div>
  );
}