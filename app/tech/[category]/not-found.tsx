import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
        <p className="text-gray-600 mb-6">The tutorial category you're looking for doesn't exist.</p>
        <Link href="/tech/courses" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Browse All Courses
        </Link>
      </div>
    </div>
  );
}