'use client';

import { useEffect, useState } from 'react';
import { TutorialTopic } from '@/types/topic';
import TopicCard from './TopicCard';

interface Props {
  groupedTopics: Record<string, TutorialTopic[]>;
  completedTopics: string[];
  onTopicClick: (topic: TutorialTopic) => void;
}

export default function TopicGrid({ groupedTopics, completedTopics, onTopicClick }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ NO early return – always render the same structure
  return (
    <div className="container">
      {Object.entries(groupedTopics).map(([category, topics]) => (
        <div key={category} style={{ marginBottom: '40px' }}>
          <div className="section-header">
            <h2>{category}</h2>
          </div>

          <div className="courses-grid">
            {topics.map((topic) => (
              <TopicCard
                key={topic.slug}
                topic={topic}
                // ✅ Only use client data after mount
                isCompleted={mounted && completedTopics.includes(topic.slug)}
                onClick={() => onTopicClick(topic)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
