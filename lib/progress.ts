export interface TutorialProgress {
  scrollPercent: number;
  quizAnswers: (number | null)[];
  completed: boolean;
  lastAccessed: string;
}

export function saveProgress(slug: string, progress: Partial<TutorialProgress>) {
  if (typeof window === 'undefined') return;
  const key = `progress_${slug}`;
  const existing = loadProgress(slug);
  const updated = { ...existing, ...progress, lastAccessed: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(updated));
}

export function loadProgress(slug: string): TutorialProgress {
  if (typeof window === 'undefined') {
    return { scrollPercent: 0, quizAnswers: [], completed: false, lastAccessed: '' };
  }
  const raw = localStorage.getItem(`progress_${slug}`);
  if (!raw) return { scrollPercent: 0, quizAnswers: [], completed: false, lastAccessed: '' };
  try {
    return JSON.parse(raw);
  } catch {
    return { scrollPercent: 0, quizAnswers: [], completed: false, lastAccessed: '' };
  }
}

export function updateStudyStreak(): number {
  if (typeof window === 'undefined') return 0;
  const today = new Date().toDateString();
  const last = localStorage.getItem('last_access');
  let streak = parseInt(localStorage.getItem('current_streak') || '0', 10);

  if (!last) {
    streak = 1;
  } else if (last !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (last === yesterday.toDateString()) {
      streak++;
    } else {
      streak = 1;
    }
  }
  localStorage.setItem('current_streak', streak.toString());
  localStorage.setItem('last_access', today);
  return streak;
}