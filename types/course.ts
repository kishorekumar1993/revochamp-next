export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  studentCount: number;
  color: string; // Hex string e.g. "#1e40af"
  category: string;
  topics: string[];
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  rating?: number;
}

export interface CategoryItem {
  name: string;
  emoji: string;
  color: string;
  count: number;
}