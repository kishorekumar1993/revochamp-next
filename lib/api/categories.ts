// Add this interface at the top of the file
interface Course {
  category: string;
  // include other fields if needed, e.g., id, title, slug...
}

interface CategoryJsonResponse {
  courses: Course[];
}

export async function getAllCategories(): Promise<string[]> {
  const res = await fetch('https://json.revochamp.site/tech/category.json', {
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error('Failed to fetch categories JSON');
  
  const data = (await res.json()) as CategoryJsonResponse;
  const categories = [...new Set(data.courses.map(course => course.category))];
  return categories; // now TypeScript knows this is string[]
}