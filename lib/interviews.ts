export interface Interview {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  participantCount: number;
  color: number;
  category: string;
  topics: string[];
  duration: string;
  level: string;
  rating: number;
}

export interface CategoryItem {
  name: string;
  emoji: string;
  color: number;
  count: number;
}

// Static fallback data (a few sample items) in case the API fails
const fallbackInterviews: Interview[] = [
  {
    id: 'f1',
    title: 'HTML & CSS Fundamentals',
    slug: 'html',
    description: 'Master the building blocks of the web',
    emoji: '🌐',
    participantCount: 12500,
    color: 0xff1e40af,
    category: 'Frontend',
    topics: ['HTML5 Semantic', 'CSS Selectors', 'Box Model', 'Flexbox', 'Grid'],
    duration: '8 hours',
    level: 'Beginner',
    rating: 4.8,
  },
  {
    id: 'b1',
    title: 'Node.js & Express',
    slug: 'nodejs-express',
    description: 'JavaScript backend development',
    emoji: '🟢',
    participantCount: 14200,
    color: 0xff047857,
    category: 'Backend',
    topics: ['REST APIs', 'Middleware', 'Auth', 'MongoDB', 'PostgreSQL'],
    duration: '14 hours',
    level: 'Beginner',
    rating: 4.8,
  },
  {
    id: 'd1',
    title: 'Docker & Kubernetes',
    slug: 'docker-kubernetes',
    description: 'Container orchestration',
    emoji: '🐳',
    participantCount: 13200,
    color: 0xff6b21a8,
    category: 'DevOps',
    topics: ['Docker', 'K8s', 'Helm', 'CI/CD', 'Monitoring'],
    duration: '14 hours',
    level: 'Intermediate',
    rating: 4.8,
  },
  {
    id: 'a1',
    title: 'Machine Learning Basics',
    slug: 'machine-learning-basics',
    description: 'Core ML concepts',
    emoji: '🤖',
    participantCount: 11200,
    color: 0xff9f1239,
    category: 'AI & ML',
    topics: ['Regression', 'Classification', 'Clustering', 'Evaluation', 'Feature Engineering'],
    duration: '12 hours',
    level: 'Beginner',
    rating: 4.8,
  },
  {
    id: 'm1',
    title: 'Flutter Complete',
    slug: 'flutter',
    description: 'Cross-platform mobile apps',
    emoji: '🦋',
    participantCount: 15800,
    color: 0xff0369a1,
    category: 'Mobile',
    topics: ['Widgets', 'State', 'Animations', 'Firebase', 'Testing'],
    duration: '16 hours',
    level: 'Beginner',
    rating: 4.8,
  },
  {
    id: 'c1',
    title: 'AWS Fundamentals',
    slug: 'aws-fundamentals',
    description: 'Core AWS services and architecture',
    emoji: '☁️',
    participantCount: 18500,
    color: 0xff1d4ed8,
    category: 'Cloud',
    topics: ['EC2', 'S3', 'IAM', 'VPC', 'CloudWatch'],
    duration: '12 hours',
    level: 'Beginner',
    rating: 4.8,
  },
  {
    id: 'db1',
    title: 'SQL Fundamentals',
    slug: 'sql-fundamentals',
    description: 'Learn relational databases from scratch',
    emoji: '🗃️',
    participantCount: 21000,
    color: 0xff065f46,
    category: 'Database',
    topics: ['SELECT', 'JOIN', 'Indexes', 'Normalization', 'Transactions'],
    duration: '10 hours',
    level: 'Beginner',
    rating: 4.8,
  },
  {
    id: 'sd1',
    title: 'System Design Fundamentals',
    slug: 'system-design-fundamentals',
    description: 'Basics of scalable system design',
    emoji: '🏗️',
    participantCount: 18500,
    color: 0xff4338ca,
    category: 'System Design',
    topics: ['Scalability', 'Latency', 'Throughput', 'CAP Theorem', 'Load Balancing'],
    duration: '10 hours',
    level: 'Beginner',
    rating: 4.8,
  },
  {
    id: 'ip1',
    title: 'DSA for Interviews',
    slug: 'dsa-for-interviews',
    description: 'Master data structures & algorithms',
    emoji: '📊',
    participantCount: 25000,
    color: 0xff0ea5e9,
    category: 'Interview Prep',
    topics: ['Arrays', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming'],
    duration: '20 hours',
    level: 'Beginner',
    rating: 4.8,
  },
];

export async function fetchInterviews(): Promise<Interview[]> {
  try {
    const res = await fetch('https://json.revochamp.site/tech/category.json', {
      next: {revalidate: 10 }, // ISR: revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // The API returns { courses: [...] }
    const courses = data.courses;
    
    if (!Array.isArray(courses)) {
      throw new Error('Invalid data format: expected an array of courses');
    }
    
    // Map each course to the Interview interface
    return courses.map((c: any) => ({
      id: c.id || '',
      title: c.title || '',
      slug: c.slug || '',
      description: c.description || '',
      emoji: c.emoji || '📚',
      participantCount: Number(c.studentCount) || 0, // map studentCount → participantCount
      color: typeof c.color === 'string' ? parseInt(c.color) : (c.color || 0),
      category: c.category || 'Other',
      topics: Array.isArray(c.topics) ? c.topics : [],
      duration: c.duration || '',
      level: c.level || 'All Levels',
      rating: Number(c.rating) || 4.8,
    }));
  } catch (error) {
    console.error('Failed to fetch interviews from API, using fallback data:', error);
    return fallbackInterviews;
  }
}

export function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'Frontend': '🎨',
    'Backend': '⚙️',
    'Full Stack': '🧩',
    'Mobile': '📱',
    'AI & ML': '🤖',
    'Data Science': '📊',
    'DevOps': '☁️',
    'Cloud': '🌩️',
    'Programming': '💻',
    'Database': '🗄️',
    'Testing': '🧪',
    'Cyber Security': '🔐',
    'UI/UX': '🖌️',
    'System Design': '🏗️',
    'Tools': '🛠️',
    'Interview Prep': '🎯',
  };
  return map[category] || '📚';
}

export function getCategoryColor(category: string): number {
  const map: Record<string, number> = {
    'Frontend': 0xff1e40af,
    'Backend': 0xff047857,
    'Full Stack': 0xff0f766e,
    'Mobile': 0xff0369a1,
    'AI & ML': 0xff9f1239,
    'Data Science': 0xff7c2d12,
    'DevOps': 0xff6b21a8,
    'Cloud': 0xff1d4ed8,
    'Programming': 0xff374151,
    'Database': 0xff065f46,
    'Testing': 0xffb45309,
    'Cyber Security': 0xff991b1b,
    'UI/UX': 0xff0ea5e9,
    'System Design': 0xff4338ca,
    'Tools': 0xff475569,
    'Interview Prep': 0xff0ea5e9,
  };
  return map[category] || 0xff64748b;
}

// export interface Interview {
//   id: string;
//   title: string;
//   slug: string;
//   description: string;
//   emoji: string;
//   participantCount: number;
//   color: number;
//   category: string;
//   topics: string[];
//   duration: string;
//   level: string;
//   rating: number;
// }

// export interface CategoryItem {
//   name: string;
//   emoji: string;
//   color: number;
//   count: number;
// }

// export async function fetchInterviews(): Promise<Interview[]> {
//   const res = await fetch('https://json.revochamp.site/tech/category.json', {
//     next: {revalidate: 10 }, // ISR: revalidate every hour
//   });
//   if (!res.ok) throw new Error('Failed to fetch interviews');
//   const data = await res.json();
//   return data.interviews.map((i: any) => ({
//     ...i,
//     participantCount: Number(i.participantCount) || 0,
//     color: typeof i.color === 'string' ? parseInt(i.color) : i.color || 0,
//     topics: Array.isArray(i.topics) ? i.topics : [],
//     rating: Number(i.rating) || 4.8,
//   }));
// }

// export function getCategoryEmoji(category: string): string {
//   const map: Record<string, string> = {
//     'Frontend': '🎨',
//     'Backend': '⚙️',
//     'Full Stack': '🧩',
//     'Mobile': '📱',
//     'AI & ML': '🤖',
//     'Data Science': '📊',
//     'DevOps': '☁️',
//     'Cloud': '🌩️',
//     'Programming': '💻',
//     'Database': '🗄️',
//     'Testing': '🧪',
//     'Cyber Security': '🔐',
//     'UI/UX': '🖌️',
//     'System Design': '🏗️',
//     'Tools': '🛠️',
//     'Interview Prep': '🎯',
//   };
//   return map[category] || '📚';
// }

// export function getCategoryColor(category: string): number {
//   const map: Record<string, number> = {
//     'Frontend': 0xff1e40af,
//     'Backend': 0xff047857,
//     'Full Stack': 0xff0f766e,
//     'Mobile': 0xff0369a1,
//     'AI & ML': 0xff9f1239,
//     'Data Science': 0xff7c2d12,
//     'DevOps': 0xff6b21a8,
//     'Cloud': 0xff1d4ed8,
//     'Programming': 0xff374151,
//     'Database': 0xff065f46,
//     'Testing': 0xffb45309,
//     'Cyber Security': 0xff991b1b,
//     'UI/UX': 0xffbe185d,
//     'System Design': 0xff4338ca,
//     'Tools': 0xff475569,
//     'Interview Prep': 0xff0ea5e9,
//   };
//   return map[category] || 0xff64748b;
// }