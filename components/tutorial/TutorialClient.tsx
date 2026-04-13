"use client";

import { useEffect, useState, useRef, useMemo, useCallback, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TutorialData, QuizQuestionState } from "@/lib/types";
import QuizCard from "./QuizCard";
import ScoreCard from "./ScoreCard";
import { saveProgress, loadProgress, updateStudyStreak } from "@/lib/progress";
import { analytics } from "@/lib/analytics";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "./CodeEditor";

interface TutorialClientProps {
  initialData: TutorialData;
  category: string;
  slug: string;
  allTopics: Array<{ slug: string; title?: string }>;
}

type ContentItem =
  | { type: "heading"; value: string; id?: string }
  | { type: "text"; value: string; id?: string }
  | { type: "code"; value: string; id?: string }
  | { type: "list"; value: string[]; id?: string }
  | { type: "table"; tableData: any; id?: string };

export default function TutorialClient({
  initialData,
  category,
  slug,
  allTopics,
}: TutorialClientProps) {
  const router = useRouter();
  const data = initialData;

  // Extract headings for TOC
  const headings = useMemo(() => {
    return data.content
      .filter((item): item is ContentItem & { type: "heading" } => item.type === "heading")
      .map((item, idx) => ({ id: `heading-${idx}`, text: item.value }));
  }, [data.content]);

  const headingRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>(headings[0]?.id || "");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [mobileQuickLinksOpen, setMobileQuickLinksOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Quiz state
  const initialQuizStates = useMemo(
    () =>
      (data.quiz || []).map(() => ({
        selectedAnswer: null,
        isCorrect: undefined,
        explanation: undefined,
      })),
    [data.quiz]
  );

  const [quizStates, setQuizStates] = useState<QuizQuestionState[]>(initialQuizStates);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Tracking
  useEffect(() => {
    updateStudyStreak();
    analytics.trackTutorialView(category, slug, data.title);
  }, [category, slug, data.title]);

  // Load progress
  useEffect(() => {
    const saved = loadProgress(slug);
    if (saved.quizAnswers?.length === (data.quiz?.length || 0)) {
      setQuizStates((prev) =>
        prev.map((state, idx) => ({ ...state, selectedAnswer: saved.quizAnswers[idx] ?? null }))
      );
    }
    if (saved.completed) setQuizSubmitted(true);
    if (saved.scrollPercent && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = (scrollRef.current.scrollHeight * saved.scrollPercent) / 100;
        }
      }, 0);
    }
  }, [slug, data.quiz]);

  // Scroll progress
  useEffect(() => {
    const div = scrollRef.current;
    if (!div) return;
    const handleScroll = throttle(() => {
      const maxScroll = div.scrollHeight - div.clientHeight;
      const percent = maxScroll > 0 ? (div.scrollTop / maxScroll) * 100 : 0;
      setScrollProgress(percent);
      setShowScrollTop(div.scrollTop > 400);
      saveProgress(slug, { scrollPercent: percent, quizAnswers: quizStates.map(s => s.selectedAnswer) });
    }, 100);
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [slug, quizStates]);

  // Scroll spy
  useEffect(() => {
    if (!scrollRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) {
          const topmost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
          setActiveHeadingId(topmost.target.id);
        }
      },
      { root: scrollRef.current, rootMargin: "-120px 0px -60% 0px", threshold: 0.1 }
    );
    headingRefs.current.forEach(ref => observer.observe(ref));
    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = useCallback((headingId: string) => {
    const el = document.getElementById(headingId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeadingId(headingId);
      setMobileTocOpen(false);
    }
  }, []);

  const handleAnswerSelect = useCallback(
    (qIndex: number, answerIndex: number) => {
      if (quizSubmitted) return;
      setQuizStates(prev => {
        const next = [...prev];
        next[qIndex] = { ...next[qIndex], selectedAnswer: answerIndex };
        saveProgress(slug, { quizAnswers: next.map(s => s.selectedAnswer) });
        return next;
      });
      setError(null);
    },
    [quizSubmitted, slug]
  );

  const submitQuiz = () => {
    if (quizStates.some(s => s.selectedAnswer === null)) {
      setError("Please answer all questions before submitting.");
      return;
    }
    let correctCount = 0;
    const newStates = quizStates.map((state, idx) => {
      const q = data.quiz?.[idx];
      if (!q) return state;
      const isCorrect = state.selectedAnswer === q.answer;
      if (isCorrect) correctCount++;
      return { ...state, isCorrect, explanation: q.explanation };
    });
    setQuizStates(newStates);
    setQuizSubmitted(true);
    setScore(correctCount);
    setError(null);
    analytics.trackQuizSubmitted(slug, correctCount, data.quiz.length);
    saveProgress(slug, { completed: true, quizAnswers: newStates.map(s => s.selectedAnswer) });
  };

  const resetQuiz = () => {
    setQuizStates(initialQuizStates);
    setQuizSubmitted(false);
    setScore(0);
    setError(null);
    saveProgress(slug, { quizAnswers: [], completed: false });
  };

  const currentIndex = allTopics.findIndex(t => t.slug === slug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  if (!data?.content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    let headingCounter = 0;
    return data.content.map((item, idx) => {
      const key = `${item.type}-${idx}`;
      // if (item.type === "heading") {
      //   const headingId = headings[headingCounter]?.id || `heading-${headingCounter}`;
      //   headingCounter++;
      //   return (
      //     <div key={key} id={headingId} ref={el => { if (el) headingRefs.current.set(headingId, el); }} className="scroll-mt-28">
      //       <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-5">
      //         <ReactMarkdown>{item.value as string}</ReactMarkdown>
      //       </h2>
      //     </div>
      //   );
      // }
      if (item.type === "heading") {
  // Use a stable ID from the item if possible, otherwise fallback to counter
  const headingId = headings[headingCounter]?.id || `heading-${headingCounter}`;
  headingCounter++;

  return (
    <div 
      key={headingId} 
      id={headingId} 
      ref={(el) => {
        if (el) {
          headingRefs.current.set(headingId, el);
        } else {
          headingRefs.current.delete(headingId);
        }
      }} 
      className="scroll-mt-28"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-5">
        <ReactMarkdown 
          components={{
            p: ({ children }) => <>{children}</>, // Unwraps the default <p> tag
          }}
        >
          {item.value as string}
        </ReactMarkdown>
      </h2>
    </div>
  );
}
      if (item.type === "text") {
  if (!item.value || String(item.value).trim() === "") {
    return null;
  }

  return (
    <div 
      key={key} 
      className="my-5 prose prose-gray prose-headings:mb-4 prose-p:leading-relaxed max-w-none"
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-4">{children}</p>,
        }}
      >
        {String(item.value)}
      </ReactMarkdown>
    </div>
  );
}
      // if (item.type === "code") {
      //   return <CodeBlock key={key} code={item.value as string} />;
      // }
    if (item.type === "code") {
  return (
    <CodeEditor
      key={key}
      code={item.value as string}
      language={item.language}   // or infer from item if available
      readOnly={true}
      showLineNumbers={true}
    />
  );
}if (item.type === "list") {
  let items: string[] = [];

  if (Array.isArray(item.value)) {
    items = item.value;
  } else if (typeof item.value === "string") {
    items = item.value
      .split("\n")
      // Improved regex to handle -, *, +, and numbered 1. lists
      .map(l => l.replace(/^[\s-*+]+|^\d+\.\s*/, "").trim())
      .filter(Boolean);
  }

  if (!items.length) return null;

  return (
    <ul key={key} className="list-disc pl-6 my-6 space-y-2 text-gray-700 marker:text-gray-400">
      {items.map((li, i) => (
        <li key={`${key}-li-${i}`}>
          <ReactMarkdown 
            components={{
              // Prevents the markdown from injecting a <p> that breaks list styling
              p: ({ children }) => <>{children}</>,
              // Useful if your list items contain links
              a: ({ children, ...props }) => (
                <a {...props} className="text-blue-600 hover:underline">{children}</a>
              ),
            }}
          >
            {li}
          </ReactMarkdown>
        </li>
      ))}
    </ul>
  );
}
      // if (item.type === "list") {
      //   let items: string[] = [];
      //   if (Array.isArray(item.value)) items = item.value;
      //   else if (typeof item.value === "string") {
      //     items = item.value.split("\n").map(l => l.replace(/^[-*]\s*/, "").trim()).filter(Boolean);
      //   }
      //   if (!items.length) return null;
      //   return (
      //     <ul key={key} className="list-disc pl-5 my-5 space-y-1 text-gray-700">
      //       {items.map((li, i) => <li key={i}><ReactMarkdown>{li}</ReactMarkdown></li>)}
      //     </ul>
      //   );
      // }
      if (item.type === "table") {
        const headers = item.tableData?.headers ?? [];
        let rows = item.tableData?.rows ?? item.tableData?.data ?? item.tableData?.body ?? [];
        if (!rows.length) return null;
        const normalised = rows.map((row: any) => Array.isArray(row) ? row : (row.cells || row.columns || Object.values(row)));
        return (
          <div key={key} className="my-8 overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm">
              {headers.length > 0 && (
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{headers.map((h: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, i: Key | null | undefined) => <th key={i} className="px-4 py-3 text-left font-semibold text-gray-700">{h}</th>)}</tr>
                </thead>
              )}
              <tbody className="divide-y divide-gray-100">
                {normalised.map((rowCells: any[], i: Key | null | undefined) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    {rowCells.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-600">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-100 z-50">
        <motion.div
          className="h-full bg-blue-500"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Sticky header */}
<header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-[1800px] mx-auto h-14 flex items-center justify-between px-4">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link 
            href={`/tech/${category}`} 
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{category}</span>
            </div>
            <span className="text-gray-300">/</span>
            <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-none">
              {data.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile View Toggles */}
          <div className="lg:hidden flex bg-gray-50 border border-gray-200 rounded-lg p-0.5">
            <button onClick={() => setMobileTocOpen(true)} className="px-3 py-1 text-[10px] font-bold text-gray-600 hover:bg-white rounded-md shadow-none hover:shadow-sm">INDEX</button>
            <button onClick={() => setMobileQuickLinksOpen(true)} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /></svg>
            </button>
          </div>
          
          <div className="hidden lg:flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
             <span className="text-[10px] font-medium text-gray-400 italic">Last Sync: Today</span>
          </div>
        </div>
      </div>
    </header>
      {/* Mobile Drawers */}
      <MobileDrawer isOpen={mobileTocOpen} onClose={() => setMobileTocOpen(false)} title="On this page">
        <nav className="space-y-1">
          {headings.map(heading => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm ${
                activeHeadingId === heading.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </MobileDrawer>

      <MobileDrawer isOpen={mobileQuickLinksOpen} onClose={() => setMobileQuickLinksOpen(false)} title="Related">
        <QuickLinksContent category={category} relatedSlugs={data.relatedSlugs} router={router} />
      </MobileDrawer>

      {/* Main layout */}
      <div className="flex max-w-[1800px] mx-auto">
        {/* Left Sidebar – Table of Contents */}
      
<aside className="hidden lg:block w-80 flex-shrink-0 sticky top-20 h-fit max-h-[calc(100vh-8rem)] px-4">
      <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        
        {/* Top Progress Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                animate={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400 tabular-nums">
              {Math.round(scrollProgress)}%
            </span>
          </div>
          
          <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Table of Contents
          </h3>
        </div>

        {/* Navigation Area */}
        <nav className="p-3 relative">
          <div className="space-y-1 relative">
            {headings.map((heading) => {
              const isActive = activeHeadingId === heading.id;
              
              return (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`relative w-full flex items-center py-2.5 px-4 text-sm rounded-xl transition-all duration-300 group ${
                    isActive ? "text-blue-700" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {/* Background Highlight Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-blue-50/80 border border-blue-100/50 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Left Line Indicator */}
                  <span className={`mr-3 w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive ? "bg-blue-500 scale-150" : "bg-gray-300 group-hover:bg-gray-400"
                  }`} />
                  
                  <span className={`truncate ${isActive ? "font-bold" : "font-medium"}`}>
                    {heading.text}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Dynamic Footer Info */}
        <div className="bg-gray-50/80 p-5 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Est. Reading</span>
              <span className="text-xs font-bold text-gray-700">{data.readTime || "5 min"}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>
          </div>
        </div>
      </div>
    </aside>


        {/* Main Content */}
        <main ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Article Header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                  {category}
                </span>
                {data.difficulty && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      data.difficulty === "Beginner" ? "bg-green-500" : data.difficulty === "Intermediate" ? "bg-amber-500" : "bg-red-500"
                    }`} />
                    {data.difficulty}
                  </span>
                )}
                {data.readTime && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {data.readTime}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{data.title}</h1>
              {data.subtitle && <p className="mt-3 text-lg text-gray-500">{data.subtitle}</p>}
            </header>

            {/* Content */}
            <article className="prose prose-gray max-w-none">
              {renderContent()}
            </article>

            {/* Practice section */}
            {data.defaultCode && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-500 rounded-full" />
                  Try it yourself
                </h2>
                <CodeBlock code={data.defaultCode} />
              </section>
            )}

            {/* Quiz */}
            {data.quiz && data.quiz.length > 0 && (
              <section className="mt-14">
                <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-500 rounded-full" />
                  Test Your Knowledge
                </h2>
                {error && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
                )}
                <div className="space-y-4">
                  {data.quiz.map((q, idx) => (
                    <QuizCard
                      key={idx}
                      index={idx}
                      total={data.quiz.length}
                      question={q}
                      state={quizStates[idx]}
                      submitted={quizSubmitted}
                      onAnswerSelected={(ans) => handleAnswerSelect(idx, ans)}
                    />
                  ))}
                </div>
                {!quizSubmitted ? (
                  <div className="mt-6 flex gap-3">
                    <button onClick={submitQuiz} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
                      Submit Answers
                    </button>
                    <button onClick={resetQuiz} className="px-5 py-2.5 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition">
                      Reset
                    </button>
                  </div>
                ) : (
                  <div className="mt-6">
                    <ScoreCard score={score} total={data.quiz.length} />
                    <button onClick={resetQuiz} className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                      Try Again
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* FAQ */}
            {data.faq && data.faq.length > 0 && (
              <section className="mt-14">
                <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-500 rounded-full" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {data.faq.map((faq, i) => (
                    <details key={i} className="group border border-gray-200 rounded-lg bg-white">
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-4 text-gray-600 text-sm"><ReactMarkdown>{faq.answer}</ReactMarkdown></div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Navigation */}
            <footer className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {prevTopic ? (
                  <Link href={`/tech/${category}/${prevTopic.slug}`} className="group flex-1 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition">
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Previous</p>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 capitalize">
                          {prevTopic.title || prevTopic.slug.replace(/-/g, " ")}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : <div className="flex-1" />}
                {nextTopic && (
                  <Link href={`/tech/${category}/${nextTopic.slug}`} className="group flex-1 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition">
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Next</p>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 capitalize">
                          {nextTopic.title || nextTopic.slug.replace(/-/g, " ")}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </Link>
                )}
              </div>
            </footer>
          </div>
        </main>

        {/* Right Sidebar – Quick Links */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-gray-100 bg-white">
          <div className="p-6">
            <QuickLinksContent category={category} relatedSlugs={data.relatedSlugs} router={router} />
          </div>
        </aside>
      </div>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 p-3 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper Components
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative group">
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="bg-gray-900 text-gray-100 p-5 rounded-lg overflow-x-auto text-sm font-mono">
        {code}
      </pre>
    </div>
  );
}

function Breadcrumbs({ category, title }: { category: string; title: string }) {
  return (
    <nav className="hidden sm:flex items-center text-sm">
      <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
      <span className="mx-2 text-gray-300">/</span>
      <Link href="/tech" className="text-gray-500 hover:text-gray-900">Learn</Link>
      <span className="mx-2 text-gray-300">/</span>
      <Link href={`/tech/${category}`} className="text-gray-500 hover:text-gray-900 capitalize">{category}</Link>
      <span className="mx-2 text-gray-300">/</span>
      <span className="text-gray-700 font-medium truncate max-w-[150px]">{title}</span>
    </nav>
  );
}

function QuickLinksContent({ category, relatedSlugs, router }: { category: string; relatedSlugs: string[]; router: any }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header with decorative line */}
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] whitespace-nowrap">
          Related Content
        </h3>
        <div className="h-[1px] w-full bg-gray-100" />
      </div>

      {relatedSlugs.length > 0 ? (
        <nav className="space-y-1">
          {relatedSlugs.slice(0, 6).map((relatedSlug) => (
            <button
              key={relatedSlug}
              onClick={() => router.push(`/tech/${category}/${relatedSlug}`)}
              className="group relative w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-500 hover:text-blue-600 transition-all duration-200 rounded-xl hover:bg-blue-50/50"
            >
              {/* Subtle Icon Indicator */}
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 group-hover:scale-125 transition-all duration-200" />
              
              <span className="flex-1 text-left font-medium capitalize truncate">
                {relatedSlug.replace(/-/g, " ")}
              </span>

              {/* Hover Arrow */}
              <svg 
                className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-blue-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </nav>
      ) : (
        <div className="py-4 px-3 border border-dashed border-gray-200 rounded-xl">
          <p className="text-xs text-gray-400 text-center italic">No related tutorials yet.</p>
        </div>
      )}

      {/* Modern Support Card */}
      <div className="mt-10">
        <div className="relative group overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 shadow-lg shadow-gray-200/50">
          {/* Decorative Background Pattern */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-[13px] font-bold text-white">Need help?</h4>
            </div>
            
            <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
              Explore our comprehensive docs or start a chat with our tech experts.
            </p>
            
            <button className="w-full py-2 bg-white/10 hover:bg-white text-white hover:text-gray-900 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all border border-white/10">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function throttle<T extends (...args: any[]) => void>(fn: T, limit: number): T {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}