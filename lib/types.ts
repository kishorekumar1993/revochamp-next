export type ContentType = 
  | 'heading'
  | 'subheading'
  | 'text'
  | 'code'
  | 'list'
  | 'table'
  | 'callout';

export interface ContentItem {
  type: ContentType;
  value: string | string[];
  language?: string;
  tableData?: Record<string, any>;
  variant?: 'info' | 'warning' | 'tip' | 'danger';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface TutorialData {
  title: string;
  subtitle: string;
  difficulty: string;
  readTime: string;
  meta?: { image?: string; datePublished?: string; dateModified?: string };
  faq: { question: string; answer: string }[];
  content: ContentItem[];
  quiz: QuizQuestion[];
  defaultCode: string;
  relatedSlugs: string[];
}

export interface QuizQuestionState {
  selectedAnswer: number | null;
  isCorrect?: boolean;
  explanation?: string;
}