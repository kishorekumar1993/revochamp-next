'use client';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-12">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 border border-border disabled:opacity-30 hover:bg-gray-100 transition"
      >
        Previous
      </button>
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}   // ✅ unique key added
          onClick={() => onPageChange(pageNum)}
          className={`px-4 py-2 ${
            currentPage === pageNum
              ? 'bg-red text-white'
              : 'border border-border hover:bg-gray-100'
          } transition`}
        >
          {pageNum}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 border border-border disabled:opacity-30 hover:bg-gray-100 transition"
      >
        Next
      </button>
    </div>
  );
}