'use client';

export default function AcceptButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="mt-8 inline-block bg-rich-blue text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition"
    >
      I Accept & Continue →
    </button>
  );
}