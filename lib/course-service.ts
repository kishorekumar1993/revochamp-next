import { Course, CategoryItem } from "@/types/course";

const API_URL = "https://json.revochamp.site/tech/category.json";

// Cache
let cachedCourses: Course[] | null = null;
let cachedCategories: CategoryItem[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Helper: Emoji & color mapping (static fallback)
const getCategoryEmoji = (cat: string): string => {
  const map: Record<string, string> = {
    Frontend: "🎨", Backend: "⚙️", "Full Stack": "🧩", Mobile: "📱",
    "AI & ML": "🤖", "Data Science": "📊", DevOps: "☁️", Cloud: "🌩️",
    Programming: "💻", Database: "🗄️", Testing: "🧪", "Cyber Security": "🔐",
    "UI/UX": "🖌️", "System Design": "🏗️", Tools: "🛠️", "Interview Prep": "🎯",
  };
  return map[cat] || "📚";
};

const getCategoryColor = (cat: string): string => {
  const map: Record<string, string> = {
    Frontend: "#1e40af", Backend: "#047857", "Full Stack": "#0f766e",
    Mobile: "#0369a1", "AI & ML": "#9f1239", "Data Science": "#7c2d12",
    DevOps: "#6b21a8", Cloud: "#1d4ed8", Programming: "#374151",
    Database: "#065f46", Testing: "#b45309", "Cyber Security": "#991b1b",
    "UI/UX": "#be185d", "System Design": "#4338ca", Tools: "#475569",
    "Interview Prep": "#0ea5e9",
  };
  return map[cat] || "#64748b";
};

export async function fetchCourses(): Promise<{
  courses: Course[];
  categories: CategoryItem[];
}> {
  // Return cached data if fresh
  if (cachedCourses && cachedCategories && Date.now() - lastFetchTime < CACHE_TTL) {
    return { courses: cachedCourses, categories: cachedCategories };
  }

  const res = await fetch(API_URL, { next: {revalidate: 10 } }); // ISR fallback
  if (!res.ok) throw new Error("Failed to fetch courses");
  const data = await res.json();
  const courses: Course[] = data.courses.map((c: any) => ({
    ...c,
    color: typeof c.color === "string" ? c.color : `#${c.color.toString(16)}`,
  }));

  // Pre‑compute categories
  const categoryMap = new Map<string, number>();
  courses.forEach((c) => {
    categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + 1);
  });

  const categories: CategoryItem[] = [
    { name: "All", emoji: "🎯", color: "#64748b", count: courses.length },
    ...Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        emoji: getCategoryEmoji(name),
        color: getCategoryColor(name),
        count,
      }))
      .sort((a, b) => b.count - a.count),
  ];

  // Update cache
  cachedCourses = courses;
  cachedCategories = categories;
  lastFetchTime = Date.now();

  return { courses, categories };
}