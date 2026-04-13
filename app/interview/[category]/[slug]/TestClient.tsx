'use client';

import { useState } from 'react';
import { TestSession } from '@/lib/testService';
import TestIntro from './TestIntro';
import QuizScreen from './QuizScreen';
import ResultsScreen from './ResultsScreen';

interface Props {
  session: TestSession;
  category: string;
}

export default function TestClient({ session, category }: Props) {
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [userAnswers, setUserAnswers] = useState<Record<string, { selected: number; isCorrect: boolean; usedHint: boolean }>>({});
  const [hintsUsed, setHintsUsed] = useState<Set<string>>(new Set());
  const [timeTaken, setTimeTaken] = useState<number>(0); // seconds

  const handleStart = () => setScreen('quiz');
  const handleFinish = (answers: typeof userAnswers, hints: Set<string>, time: number) => {
    setUserAnswers(answers);
    setHintsUsed(hints);
    setTimeTaken(time);
    setScreen('results');
  };
  const handleRetake = () => {
    setUserAnswers({});
    setHintsUsed(new Set());
    setTimeTaken(0);
    setScreen('intro');
  };

  return (
    <>
      {screen === 'intro' && (
        <TestIntro session={session} category={category} onStart={handleStart} />
      )}
      {screen === 'quiz' && (
        <QuizScreen session={session} onFinish={handleFinish} onBack={() => setScreen('intro')} />
      )}
      {screen === 'results' && (
        <ResultsScreen
          session={session}
          userAnswers={userAnswers}
          hintsUsed={hintsUsed.size}
          timeTaken={timeTaken}
          onRetake={handleRetake}
          onExit={() => window.history.back()}
        />
      )}
    </>
  );
}