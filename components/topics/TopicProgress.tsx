interface Props {
  progress: number;
  completed: number;
  total: number;
}

export default function TopicProgress({ progress, completed, total }: Props) {
  const message = progress > 80 
    ? "🎉 You're almost there! Keep pushing forward!"
    : progress > 30 
      ? "💪 Great progress! Keep learning, one topic at a time."
      : "🌟 Start your journey today. Every expert was once a beginner.";
  
  return (
    <div className="container">
      <div className="stats-card" style={{ background: 'white', border: '1.5px solid var(--light-gray)', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontWeight: 600 }}>Your Learning Progress</span>
          <span style={{ background: 'var(--rich-blue)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
            {Math.round(progress)}% • {completed}/{total}
          </span>
        </div>
        <div style={{ height: '8px', background: 'var(--light-gray)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${progress}%`, 
              height: '100%', 
              background: 'var(--rich-blue)',
              transition: 'width 0.3s ease'
            }} 
          />
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>{message}</p>
      </div>
    </div>
  );
}