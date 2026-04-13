// types/blog-detail.ts (clean version)
export interface StatItem {
  value: string;
  label: string;
}
// export enum ContentType {
//   heading = "heading",
//   text = "text",
//   code = "code",
//   list = "list",
//   image = "image",
//   table = "table",
//   highlight = "highlight",
//   tip = "tip",
//   warning = "warning",
//   cta = "cta",
//   featureBox = "featureBox",
// }
export enum ContentType {
  heading = 'heading',
  text = 'text',
  code = 'code',
  list = 'list',
  image = 'image',
  table = 'table',
  highlight = 'highlight',
  tip = 'tip',
  warning = 'warning',
  cta = 'cta',
  feature_box = 'feature_box',   // note: underscore, not camelCase
  stat_card = 'stat_card',
  divider = 'divider',
}
export interface ContentItem {
  type: string;
  value: string;
  language?: string;
  imageUrl?: string;
  caption?: string;
  headers?: string[];
  rows?: string[][];
}
export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  date: Date;
  categories: string[];
  tags: string[];
  readTime: string;
  featuredImage?: string;
  stats: StatItem[];
  content: ContentItem[];
  meta?: { description?: string; title?: string };
  faq?: Array<{ question: string; answer: string }>;
  related: string[];
  design?: string;
}
// // types/blog-detail.ts

// export interface StatItem {
//   value: string;
//   label: string;
// }

// export enum ContentType {
//   heading = 'heading',
//   text = 'text',
//   code = 'code',
//   list = 'list',
//   image = 'image',
//   table = 'table',
//   highlight = 'highlight',
//   tip = 'tip',
//   warning = 'warning',
//   cta = 'cta',
//   featureBox = 'featureBox',
// }

// export interface ContentItem {
//   type: string;        // you can also use `type: ContentType` if you prefer
//   value: string;
//   language?: string;
//   imageUrl?: string;
//   caption?: string;
//   headers?: string[];
//   rows?: string[][];
// }

// // This is the BlogPost your client component expects
// export interface BlogPost {
//   slug: string;
//   title: string;
//   subtitle: string;
//   author: string;
//   date: Date;
//   categories: string[];
//   tags: string[];
//   readTime: string;
//   featuredImage?: string;
//   stats: StatItem[];
//   content: ContentItem[];
//   meta?: { description?: string; title?: string };
//   faq?: Array<{ question: string; answer: string }>;
//   related: string[];
//   design?: string;
// }
