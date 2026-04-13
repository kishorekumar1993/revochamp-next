"use client";

import { Course } from "@/types/course";
import Link from "next/link";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition group">
      <Link href={`/courses/${course.slug}`}>
        <div
          className="h-32 flex items-center justify-center"
          style={{ backgroundColor: `${course.color}10` }}
        >
          <span className="text-6xl">{course.emoji}</span>
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/courses/${course.slug}`}>
          <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-900">
            {course.title}
          </h4>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {course.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${course.color}15`, color: course.color }}
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span>⏱️</span> {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <span>👥</span> {Math.round(course.studentCount / 1000)}k
          </span>
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="block w-full mt-4 py-2 bg-blue-900 text-white text-center text-sm font-semibold rounded-lg hover:bg-blue-800 transition"
        >
          Start Learning
        </Link>
      </div>
    </div>
  );
}