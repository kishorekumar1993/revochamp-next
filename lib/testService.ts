export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  hints: string[];
  topic: string;
}

export interface TestSession {
  id: string;
  title: string;
  description: string;
  category: string;
  passingScore: number;
  timeLimitMinutes: number;
  questions: Question[];
  topics: string[];
  totalPoints: number;
  beginnerCount: number;
  intermediateCount: number;
  advancedCount: number;
}

// Fetch a single test session from the API
export async function fetchTestSession(category: string, fileName: string): Promise<TestSession | null> {
  try {
    const res = await fetch(
      `https://json.revochamp.site/mockinterview/${category}/${fileName}.json`,
      { next: { revalidate: 3600 } } // ISR: revalidate every hour
    );
    if (!res.ok) return null;
    const data = await res.json();

    const questions: Question[] = (data.questions || []).map((q: any) => ({
      ...q,
      hints: q.hints || [],
    }));

    const topics = [...new Set(questions.map(q => q.topic))];
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const beginnerCount = questions.filter(q => q.difficulty === 'beginner').length;
    const intermediateCount = questions.filter(q => q.difficulty === 'intermediate').length;
    const advancedCount = questions.filter(q => q.difficulty === 'advanced').length;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      passingScore: data.passingScore,
      timeLimitMinutes: data.timeLimitMinutes,
      questions,
      topics,
      totalPoints,
      beginnerCount,
      intermediateCount,
      advancedCount,
    };
  } catch (error) {
    console.error('Error fetching test session:', error);
    return null;
  }
}