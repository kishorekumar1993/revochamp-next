// app/interview/[category]/layout.tsx
interface LayoutProps {
  params: Promise<{ category: string }>;
  children: React.ReactNode;
}

export default async function CategoryLayout({ params, children }: LayoutProps) {
  const { category } = await params;
  // You can use `category` for layout‑level logic (e.g., sidebars, breadcrumbs)
  return (
    <div className="category-layout">
      {/* Optional: category header */}
      <div className="category-content">{children}</div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}