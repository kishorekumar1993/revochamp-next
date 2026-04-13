export interface BlogSummary {
  id: string;
  title: string;
  summary: string;
  slug: string;
  image: string | null;
  date: string;          // ISO string
  category: string | null;
  author?: string | null;
  readTime?: number | null;
}

export interface BlogResponse {
  page: number;
  totalPages: number;
  data: BlogSummary[];
}

export interface BlogPost extends BlogSummary {
  content: string;       // HTML or markdown
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}
