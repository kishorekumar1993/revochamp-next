export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-100" />
      <div className="container mx-auto px-4 py-8">
        <div className="h-64 bg-gray-200 rounded-xl mb-6" />
        <div className="h-12 bg-gray-200 rounded-lg mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}